import doctorModel from "../models/doctorModel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import appointmentModel from "../models/AppointmentModel.js"

const changeAvailability = async(req,res) => {
    try{
        const {docId} = req.body

        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId,{available: !docData.available})
        res.json({success:true,message: 'Availability Changed'})
    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const doctorList = async(req,res) => {
    try{

        const doctors = await doctorModel.find({}).select(['-password','-email'])
        res.json({success:true,doctors})
    
    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// API for doctor login
const loginDoctor = async(req,res) => {
    try{
        const {email,password} = req.body

        const doctor = await doctorModel.findOne
            ({ email })
        if(!doctor){
            return res.json({success:false,message:'Doctor not found'})
        }
        const isMatch = await bcrypt.compare(password, doctor.password) 
        if (isMatch) {
            const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET) 
            res.json({ success: true, message: 'Login successful', token })

        }
        else {
            res.json({ success: false, message: 'Invalid credentials' })
        }
    }
    catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }  
}

//API to get doctor appointments for doctor panel
const appointmentsDoctor = async(req,res) => {
    try{
       
        // const {docId} = req.docId
        const docId = req.docId // Use the docId from the request object set by authDoctor middleware
        const appointments = await appointmentModel.find({ docId }) 
        
        
        res.json({ success: true, appointments })
        
    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//API to mark Appointment completed for doctor panel
const appointmentComplete = async(req,res) => {
    try{
        const docId = req.docId; // from middleware
        const { appointmentId } = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId)
        if(appointmentData && appointmentData.docId.toString() === docId){
            await appointmentModel.findByIdAndUpdate(appointmentId, {isCompleted: true})
            console.log("appointmentData:", appointmentData);
            console.log("appointmentData.docId:", appointmentData?.docId?.toString());
            console.log("req.docId:", docId);
            return res.json({ success: true, message: 'Appointment marked as completed' })
        }
        else {
            return res.json({ success: false, message: 'Appointment not found or does not belong to this doctor' }) 
        }
}
catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//API to cancel Appointment  for doctor panel
const appointmentCancel = async(req,res) => {
    try{
        const docId = req.docId; // from middleware
        const { appointmentId } = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId)
        if(appointmentData && appointmentData.docId.toString() === docId){
            await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled: true})
            return res.json({ success: true, message: 'Appointment Cancelled' })
        }
        else {
            return res.json({ success: false, message: 'Cancellation Failed' }) 
        }
}
catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//api to get dashboard data for doctor panel
const doctorDashboard = async (req,res) => {
    try{
        const docId = req.docId // Use the docId from the request object set by authDoctor middleware

        const appointments = await appointmentModel.find({docId})

        let earnings = 0

        appointments.map((item)=>{
            if(item.isCompleted || item.payment){
                earnings += item.amount
            }
        })

        let patients = []

        appointments.map((item)=>{
            if(!patients.includes(item.userId)){
                patients.push(item.userId)
            }
        })

        const dashData = {
            docId,
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.reverse().slice(0,5)
        }

        res.json({success:true,dashData})
 
    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//api to get doctor profile data for Doctor panel
const doctorProfile = async (req, res) => {
    try {
        const docId = req.docId; // Use the docId from the request object set by authDoctor middleware
        const profileData = await doctorModel.findById(docId).select('-password');
        if (!profileData) {
            return res.json({ success: false, message: 'Doctor not found' });
        }
        res.json({ success: true, profileData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to update doctor profile data for Doctor panel
const updateDoctorProfile = async (req, res) => {
    try {
        const docId = req.docId; // Use the docId from the request object set by authDoctor middleware
        const { fees,address,available } = req.body;

        const updatedData = await doctorModel.findByIdAndUpdate(docId, {
            fees,
            address,
            available
        })
        
        res.json({ success: true, message: 'Profile updated successfully'});
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export{
    changeAvailability,
    doctorList,
    loginDoctor,
    appointmentsDoctor,
    appointmentComplete,
    appointmentCancel,
    doctorDashboard,
    doctorProfile,updateDoctorProfile
}