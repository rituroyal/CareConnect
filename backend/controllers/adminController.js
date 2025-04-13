import validator from "validator"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
//import cloudinary from '../config/cloudinary.js';
import {v2 as cloudinary} from "cloudinary"
import doctorModel from "../models/doctorModel.js"

// API for adding doctor
const addDoctor = async (req,res) => {

    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body 
        const imageFile = req.file

        console.log(" Data received:", { name, email, password, speciality, degree, experience, about, fees, address });
        console.log(" Image file:", imageFile);


        //checking for all data to add doctor
        if(!name || !email  || !password || !speciality || !degree || !experience || !about || !fees || !address){
            return res.json({success:false,message:"Missing Details"})
        }

        
        if (!imageFile) {
        return res.json({ success: false, message: "Image file missing" });
        }

        //validating email format
        if(!validator.isEmail(email)){
            return res.json({success:false,message:"Please enter a valid email"})
        }

        //validating strong password
        if(password.length < 8){
            return res.json({success:false,message:"Please provide a strong password"})
        }

        //hashing doctor password
        const salt=await bcrypt.genSalt(10)
        const hashedPassword= await bcrypt.hash(password,salt)

        //upload image to cloudinary
        const imageUpload=await cloudinary.uploader.upload(imageFile.path,{resource_type:"image"})
        const imageUrl= imageUpload.secure_url

        const doctorData={
            name,
            email,
            image:imageUrl,
            password:hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            //in address we r getting obj but in form data we need a string so parse it
            address:JSON.parse(address),
            date:Date.now()
        }

        const newDoctor= new doctorModel(doctorData)
        await newDoctor.save() //saving dr in database

        res.json({success:true,message:"Doctor added"})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//api for admin login
const loginAdmin=async(req,res)=>{
    try{
        const {email,password}=req.body

        if(email== process.env.ADMIN_EMAIL && password==process.env.ADMIN_PASSWORD){
            const token=jwt.sign(email+password,process.env.JWT_SECRET)
            res.json({succes:true,token})
        }else{
            res.json({success:false,message:"Invalid Credentials"})
        }
    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}
export {addDoctor,loginAdmin}