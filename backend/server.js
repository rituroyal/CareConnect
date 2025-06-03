import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import userRouter from './routes/userRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import http from 'http'
import { Server } from 'socket.io'
import ChatMessage from './models/ChatMessage.js'
import chatRouter from './routes/chatRoutes.js';
import Appointment from './models/AppointmentModel.js';


//app config
const app = express()
const port = process.env.PORT || 4000
 connectDB()
 connectCloudinary()
// middlewares
app.use(express.json())
app.use(cors())

// api endpoints
app.use('/api/admin', adminRouter)
app.use('/api/doctor',doctorRouter)

app.use('/api/user',userRouter)

app.get('/', (req, res) => {
    res.send('API WORKING Great')
})

app.use('/api/chat', chatRouter)


// --- SOCKET.IO SETUP ---
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
})

io.on('connection', (socket) => {
    // Join a room (appointment)
    socket.on('joinRoom', ({ roomId }) => {
        socket.join(roomId)
    })

    // Handle sending a message
    socket.on('chatMessage', async ({ roomId, sender, message }) => {
        // Save to MongoDB
        try {
            const chatMsg = new ChatMessage({ roomId, sender, message, readByDoctor: sender === 'patient' ? false : true })
            await chatMsg.save()
            // console.log("Message saved in DB:", chatMsg);
            // Emit to all in room
            io.to(roomId).emit('message', {
                sender,
                message,
                timestamp: chatMsg.timestamp
            })
        }
        catch (error) {
            console.error("Error saving chat message:", error)
        }   

        // Notify doctor if not in room
        const appointment = await Appointment.findOne({ _id: roomId });
        if (appointment) {
            io.to(`doctor_${appointment.docId}`).emit('newMessageNotification', { roomId });
        }
    })

    socket.on('disconnect', () => {})
})

server.listen(port, () => console.log("Server Started", port))

// app.listen(port, ()=> console.log("Server Started", port))