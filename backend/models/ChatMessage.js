import mongoose from "mongoose";

const ChatMessageSchema = new mongoose.Schema({
  roomId: { type: String, required: true },
  sender: { type: String, required: true }, // 'doctor' or 'patient'
  message: { type: String, required: true },
  readByDoctor: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
});

const ChatMessage = mongoose.models.ChatMessage || mongoose.model('ChatMessage', ChatMessageSchema);
export default ChatMessage;