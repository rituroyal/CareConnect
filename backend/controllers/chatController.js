import ChatMessage from '../models/ChatMessage.js';
import Appointment from '../models/AppointmentModel.js';

export const getChatHistory = async (req, res) => {
  try {
    const { roomId } = req.params;
    // Find appointment by _id (since appointmentId field nahi hai)
    const appointment = await Appointment.findOne({ _id: roomId });
    if (!appointment) return res.status(403).json({ error: "No such appointment" });

    // Parse slotDate correctly
    let appointmentDate;
    if (typeof appointment.slotDate === "string" && appointment.slotDate.includes("_")) {
      const [day, month, year] = appointment.slotDate.split('_').map(Number);
      appointmentDate = new Date(year, month - 1, day);
    } else {
      appointmentDate = new Date(appointment.slotDate);
    }
    const now = new Date();
    const diffHours = Math.abs(now - appointmentDate) / 36e5;
    if (appointment.cancelled || diffHours > 48) {
      return res.status(403).json({ error: "Chat not allowed for this appointment" });
    }

    // Fetch chat messages if allowed
    const messages = await ChatMessage.find({ roomId }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};



export const getUnreadChats = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const appointments = await Appointment.find({ docId: doctorId });
    const unread = [];
    for (const appt of appointments) {
      // Count unread patient messages for this appointment
      const count = await ChatMessage.countDocuments({
        roomId: appt._id,
        sender: 'patient',
        readByDoctor: false
      });
      if (count > 0) {
        unread.push({
          ...appt.toObject(),
          unreadCount: count
        });
      }
    }
    res.json(unread);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};


export const sendMessage = async (req, res) => {
  try {
    const newMessage = new ChatMessage({
      roomId: req.body.roomId,
      sender: req.body.sender, // 'patient' ya 'doctor'
      message: req.body.message,
      
      readByDoctor: req.body.sender === 'patient' ? false : true,
      
    });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
export const markMessagesAsRead = async (req, res) => {
  try {
    const { roomId } = req.params;
    await ChatMessage.updateMany(
      { roomId, sender: 'patient', readByDoctor: false },
      { $set: { readByDoctor: true } }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};