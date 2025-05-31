import express from 'express'
import { registerUser,loginUser, getProfile, updateProfile,bookAppointment,listAppointment,cancelAppointment,paymentRazorpay, verifyRazorpay,googleLogin } from '../controllers/userController.js'
import authUser from '../middlewares/authUser.js'
import upload from '../middlewares/multer.js'

const userRouter = express.Router()
userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/get-profile',authUser,getProfile)
userRouter.put('/update-profile',upload.single('image'),authUser,updateProfile)
userRouter.post('/book-appointment',authUser,bookAppointment)
userRouter.get('/my-appointments', authUser, listAppointment)
userRouter.post('/cancel-appointment', authUser, cancelAppointment)
userRouter.post('/payment-razorpay', authUser, paymentRazorpay) 
userRouter.post('/verifyRazorpay', authUser, verifyRazorpay) 
userRouter.post('/google-login',googleLogin)
export default userRouter