import React, { useEffect, useRef, useState } from "react";
import socket from "../utils/socket";
import axios from "axios";
import MessageBubble from "./MessageBubble";

export default function ChatRoom({ roomId, sender }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (roomId && sender === 'doctor') {
      axios.post(`/api/chat/mark-read/${roomId}`);
    }
  }, [roomId, sender]);

  useEffect(() => {
    // Fetch chat history
    axios.get(`http://localhost:4000/api/chat/${roomId}`)
      .then(res => setMessages(res.data));

    socket.emit("joinRoom", { roomId, sender });

    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("message");
    };
  }, [roomId, sender]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    socket.emit("chatMessage", { roomId, sender, message: input });
    console.log("Sending message", { roomId, sender, message: input });
    setInput("");
  };

  return (
    <div className="flex flex-col h-full">
     
<div
  className="flex-1 p-4 bg-gray-50"
  style={{
    maxHeight: "80vh", 
    minHeight: "200px",
    overflowY: "auto",
  }}
>
  {messages.map((msg, idx) => (
    <MessageBubble
      key={idx}
      message={msg}
      isOwn={msg.sender === sender}
    />
  ))}
  <div ref={messagesEndRef} />
</div>
      <form onSubmit={sendMessage} className="flex p-2 border-t bg-white">
        <input
          className="flex-1 border rounded-l px-3 py-2 focus:outline-none"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded-r" type="submit">
          Send
        </button>
      </form>
    </div>
  );
}