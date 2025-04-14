import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'
// API to register user

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name || !password || !email) {
            return res.json({success:false,message:"Missing Details"})
        }

        // validating email format
        if (!validator.isEmail(email)) {
            return res.json({success:false,message:"enter a valid email"})
        }

        // validating strong password
        if (password.length < 8) {
            return res.json({success:false,message:"enter a strong password"}) 
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        
        const userData = {
            name,
            email,
            password: hashedPassword
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
        res.json({success:true,token})

    }
    catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// API for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await userModel.findOne({ email })
        
        if (!user) {
           return res.json({success:false,message:'User does not exist'})
        }
        const isMatch = await bcrypt.compare(password, user.password)
        
        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({success:true,token})
        }
        else {
            res.json({ success: false, message: "Invalid credentials" })
        }
    }
    catch (error) {
       console.log(error)
        res.json({success:false,message:error.message}) 
    }
}

// API to get user profile data
const getProfile = async (req,res) => {
    
    try {
        // const { userId } = req.body
        const { userId } = req.user
        const userData = await userModel.findById(userId).select('-password')

        res.json({success:true,userData})
    }
    catch (error) {
      console.log(error)
      res.json({success:false,message:error.message})   
    }
}

// API to update user profile

// const updateProfile = async (req, res) => {
//     try {
//         const { userId, name, phone, address, dob, gender } = req.body
//         const imageFile = req.file

//         if (!name || !phone || !dob || !gender) {
//             return res.json({ success: false, message: "Data Missing" })
//         }
//         //     await userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dob, gender })
//         //     if (imageFile) {
           
//         //         // upload image to cloudinary
//         //         const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' })
//         //         const imageURL = imageUpload.secure_url

//         //         await userModel.findByIdAndUpdate(userId,{image:imageURL})
//         //     }
//         //     res.json({success:true,message:"Profile Updated"})
//         // }
//         // catch(error) {
//         //     console.log(error)
//         //   res.json({success:false,message:error.message})
//         // }
//         const updatedUser = await userModel.findByIdAndUpdate(
//             userId,
//             {
//                 name,
//                 phone,
//                 address: JSON.parse(address),
//                 dob,
//                 gender
//             },
//             { new: true } // return the updated document
//         )

//         if (!updatedUser) {
//             return res.json({ success: false, message: "User not found or update failed" })
//         }

//         if (imageFile) {
//             const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' })
//             const imageURL = imageUpload.secure_url

//             await userModel.findByIdAndUpdate(userId, { image: imageURL })
//         }

//         res.json({ success: true, message: "Profile Updated", updatedUser })
//     }
// }

const updateProfile = async (req, res) => {
    try {
        const { userId, name, phone, address, dob, gender } = req.body
        const imageFile = req.file

        if (!name || !phone || !dob || !gender || !address) {
            return res.json({ success: false, message: "Data Missing" })
        }

        // Prepare update fields
        const updateData = {
            name,
            phone,
            address: JSON.parse(address),
            dob,
            gender
        }

        // If image is present, upload it to cloudinary and add to updateData
        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
                resource_type: 'image'
            })
            updateData.image = imageUpload.secure_url
        }

        // Perform the update and return the updated document
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            updateData,
            { new: true } // To return updated document
        ).select('-password')

        if (!updatedUser) {
            return res.json({ success: false, message: "User not found or update failed" })
        }

        res.json({ success: true, message: "Profile Updated", updatedUser })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export {registerUser,loginUser,getProfile,updateProfile}
