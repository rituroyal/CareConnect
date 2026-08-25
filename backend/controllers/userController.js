import validator from 'validator'
import bcrypt from 'bcrypt'
import axios from 'axios'
import userModel from '../models/userModel.js'
import appointmentModel from '../models/AppointmentModel.js'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import razorpay from 'razorpay'
import mongoose from 'mongoose'
// API to register user

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name || !password || !email) {
            return res.json({ success: false, message: "Missing Details" })
        }
        //validating name format
        if (!/^[A-Za-z ]+$/.test(name) || name.length < 2 || name.length > 50) {
            return res.json({
                success: false,
                message: "Enter a valid name"
            });
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
        // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
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
  


//new
const cancelAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.body
        const {userId} = req.user

        const appointmentData = await appointmentModel.findById(appointmentId)

        //verify appointment user
        if (appointmentData.userId.toString() !== userId) {
            return res.json({ success: false, message: "Unauthorized action" })
        }

      

        if (appointmentData.isCompleted) {
            return res.json({ success: false, message: "Cannot cancel a completed appointment" })
        }

        if (appointmentData.cancelled) {
            return res.json({ success: false, message: "Appointment is already cancelled" })
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


const bookAppointment = async (req, res) => {
    const session = await mongoose.startSession()

    try {
        const { docId, slotDate, slotTime } = req.body
        const userId = req.user.userId

        let appointment

        await session.withTransaction(async () => {

            // 1. Atomically reserve the requested slot
            const docData = await doctorModel.findOneAndUpdate(
                {
                    _id: docId,
                    available: true,

                    // Slot must NOT already exist
                    [`slots_booked.${slotDate}`]: {
                        $ne: slotTime
                    }
                },
                {
                    // Add slot only when the condition above passes
                    $addToSet: {
                        [`slots_booked.${slotDate}`]: slotTime
                    }
                },
                {
                    new: true,
                    session
                }
            ).select('-password')

            // No doctor means the condition failed
            if (!docData) {
                throw new Error(
                    'Doctor not available or slot already booked'
                )
            }

            // 2. Get user information
            const userData = await userModel
                .findById(userId)
                .select('-password')
                .session(session)

            if (!userData) {
                throw new Error('User not found')
            }

            // 3. Create a snapshot of doctor data
            const doctorSnapshot = docData.toObject()

            // We don't need booked slots inside appointment snapshot
            delete doctorSnapshot.slots_booked

            // 4. Prepare appointment data
            const appointmentData = {
                userId,
                docId,
                userData,
                docData: doctorSnapshot,
                amount: docData.fees,
                slotTime,
                slotDate,
                date: Date.now()
            }

            // 5. Create appointment
            const newAppointment =
                new appointmentModel(appointmentData)

            // Save inside the same transaction
            appointment =
                await newAppointment.save({ session })
        })

        // Transaction committed successfully
        res.json({
            success: true,
            message: 'Appointment Booked',
            appointment
        })

    } catch (error) {
        console.log(error)

        res.json({
            success: false,
            message: error.message
        })

    } finally {
        // Always close the MongoDB session
        await session.endSession()
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
            // await appointmentModel.findByIdAndUpdate(orderInfo.receipt, {
            //     payment:true
            // })

            //new
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt, {
            isPaid:true
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
