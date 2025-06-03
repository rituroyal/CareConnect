import express from 'express';
import { getChatHistory, getUnreadChats,sendMessage, markMessagesAsRead } from '../controllers/chatController.js';


const router = express.Router();
router.get('/:roomId', getChatHistory);
router.get('/unread/:doctorId', getUnreadChats);
router.post('/send', sendMessage);
router.post('/mark-read/:roomId', markMessagesAsRead)

export default router;