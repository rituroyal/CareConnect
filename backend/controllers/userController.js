import validator from 'validator'
import bcrypt from 'bcrypt'
import axios from 'axios'
import userModel from '../models/userModel.js'
import appointmentModel from '../models/AppointmentModel.js'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import razorpay from 'razorpay'
//import razorpay from 'razorpay'
// API to register user

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name || !password || !email) {
            return res.json({ success: false, message: "Missing Details" })
        }

        // validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "enter a valid email" })
        }

        // validating strong password
        if (password.length < 8) {
            return res.json({ success: false, message: "enter a strong password" })
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
        res.json({ success: true, token })

    }
    catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: 'User does not exist' })
        }
        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        }
        else {
            res.json({ success: false, message: "Invalid credentials" })
        }
    }
    catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get user profile data
const getProfile = async (req, res) => {

    try {
        // const { userId } = req.body
        const { userId } = req.user
        const userData = await userModel.findById(userId).select('-password')

        res.json({ success: true, userData })
    }
    catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update user profile
const updateProfile = async (req, res) => {
    try {
        const { name,email, phone, address, dob, gender } = req.body
        const imageFile = req.file

        const userId = req.user.userId

        if (!name || !phone || !email || !dob || !gender || !address) {
            return res.json({ success: false, message: "Data Missing" })
        }

        // Prepare update fields
        const updateData = {
            name,
            phone,
            email,
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

//api to get user appointments for my-appointments page
const listAppointment = async (req, res) => {
    try {
      const {userId} = req.user;
  
      const appointments = await appointmentModel.find({ userId })
      res.json({ success: true, appointments });

    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
    }
  };
  

const cancelAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.body
        const {userId} = req.user

        const appointmentData = await appointmentModel.findById(appointmentId)
      
        //verify appointment user
        if (appointmentData.userId.toString() !== userId) {
            return res.json({ success: false, message: "Unauthorized action" })
        }

        if (appointmentData.userId !== userId) {
            return res.json({ success: false, message: "Unauthorized to cancel this appointment" })
        }

        await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})
        
        //releasing doctors slot
        const {docId,slotDate,slotTime}=appointmentData

        const doctorData = await doctorModel.findById(docId)
        let slots_booked=doctorData.slots_booked

        slots_booked[slotDate]=slots_booked[slotDate].filter(e=> e!==slotTime)
        
        await doctorModel.findByIdAndUpdate(docId,{slots_booked})

        res.json({ success: true, message: "Appointment cancelled successfully" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


//api to book appointment
const bookAppointment = async (req, res) => {
    try {
        const {  docId, slotDate, slotTime } = req.body
        const userId = req.user.userId; // <-- from auth middleware

        const docData = await doctorModel.findById(docId).select('-password')

        if (!docData.available) {
            return res.json({ success: false, message: 'Doctor not available' })
        }

        let slots_booked = docData.slots_booked

        //checking for slot availability
        // checking for slot availability
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: 'Slot not available' })
            } else {
                slots_booked[slotDate].push(slotTime)
            }
        } else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select('-password')

        delete docData.slots_booked

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()

        //save new slots data in docData
        await doctorModel.findByIdAndUpdate(docId,{slots_booked})

        res.json({success:true,message:"Appointment Booked"})



    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const googleLogin = async (req, res) => {
  const { code } = req.body;
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = 'postmessage'; // for @react-oauth/google

  if (!code) return res.status(400).json({ success: false, message: 'Authorization code is required' });

  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not set in environment variables');
    return res.status(500).json({ success: false, message: 'Server configuration error' });
  }

  try {
    // 1. Exchange code for tokens
    const { data: tokenData } = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    });

    const { access_token } = tokenData;
     if (!access_token) return res.json({ success: false, message: 'Google token exchange failed' });

    // 2. Fetch user info
    const { data: userInfo } = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const { email, name, picture } = userInfo;

    // 3. Check or create user
    let user = await userModel.findOne({ email });
    if (!user) {
      user = await userModel.create({
        name: name || 'Google User',
        email,
        image: picture,
        authProvider: 'google',
      });
    }


    // 4. Generate app token
    const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET)

    console.log('JWT Token:', token); // Debug log

    res.status(200).json({ success: true, token });
  } catch (err) {
    console.error('Google Auth Error:', err.response?.data || err.message);
    res.status(500).json({ success: false, message: 'Google authentication failed' });
  }
};

// const razorpayInstance=new razorpay({
//     key_id:'process.env.RAZORPAY_KEY_ID',
//     key_secret:'process.env.RAZORPAY_KEY_SECRET'
// })

// //api to make payment of appointment using razor pay
// const paymentRazorpay=async(req,res)=>{

//     try{
//         const{appointmentId}= req.body
//     const appointmentData= await appointmentModel.findById(appointmentId)

//     if(!appointmentData || appointmentData.cancelled){
//         return res.json({success:false,message:"Appointment cancelled or not found"})
//     }

//     //creating optioms for razor pay payment
//     const options={
//         amount:appointmentData.amount * 100,
//         currency:process.env.CURRENCY,
//         receipt:appointmentId,
//     }

//     //creation of order
//     const order=await razorpayInstance.orders.create(options)
//     res.json({success:true,order})

//     }catch(error){
//         console.log(error)
//         res.json({success:false,message:error.message})
//     }

//}

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})
//Api to make payment of appointment using razor pay
const paymentRazorpay = async (req, res) => {
    try {
        const { appointmentId } = req.body
    const appointmentData = await appointmentModel.findById(appointmentId)
    if (!appointmentData || appointmentData.cancelled) {
        return res.json({ success: false, message: "Appointment cancelled or not found" })
    }

    //creating options for razor pay payment
    const options = {
        amount: appointmentData.amount * 100, // amount in smallest currency unit
        currency: process.env.CURRENCY,
        receipt: appointmentId,
    }

    //creation of order
    const order = await razorpayInstance.orders.create(options)

    res.json({ success: true, order }) 
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//API to verify payment of appointment using razorpay

const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
        console.log(orderInfo)
        if(orderInfo.status === 'paid') {
            // Payment is successful, you can proceed with your logic
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt, {
                payment:true
            })
            res.json({ success: true, message: "Payment successful" })  
        }   else {
            return res.json({ success: false, message: "Payment not successful" })
        }
        // Here you would typically verify the payment signature with Razorpay's API
        // For simplicity, we are just returning the payment details
        // res.json({ success: true, message: "Payment verified", paymentDetails: { razorpay_payment_id, razorpay_order_id, razorpay_signature } })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { registerUser, loginUser, getProfile, updateProfile ,bookAppointment,listAppointment,cancelAppointment, paymentRazorpay,verifyRazorpay,googleLogin }
