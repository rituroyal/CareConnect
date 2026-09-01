import React, { useEffect, useRef, useState, useContext } from "react";
import socket from "../utils/socket";
import axios from "axios";
import MessageBubble from "./MessageBubble";

export default function ChatRoom({ roomId, sender, }) {
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(true)

  const [error, setError] = useState(null)

  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (roomId && sender === 'doctor') {
      axios.post(`${backendUrl}/api/chat/mark-read/${roomId}`)
        .catch(err => console.error("Failed to mark messages as read:", err))
    }
  }, [roomId, sender])

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true)
        setError(null)
        const { data } = await axios.get(`${backendUrl}/api/chat/${roomId}`)
        setMessages(data)
      } catch (err) {
        console.error("Failed to load chat history:", err)
        setError("Failed to load messages. Please refresh.")
      } finally {
        setLoading(false)
      }
    }

    loadHistory()

    socket.emit("joinRoom", { roomId, sender })

    const handleMessage = (msg) => {
      setMessages(prev => [...prev, msg])
    }
    socket.on("message", handleMessage)

    // Cleanup
    return () => {
      socket.off("message", handleMessage)

      socket.emit("leaveRoom", { roomId })
    }
  }, [roomId, sender])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const optimisticMsg = {
      sender,
      message: input,
      timestamp: new Date().toISOString(),
      _id: `temp_${Date.now()}` 
    }
    setMessages(prev => [...prev, optimisticMsg])

    socket.emit("chatMessage", { roomId, sender, message: input })
    setInput("")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500 flex flex-col items-center gap-2">
          <svg
            className="animate-spin h-8 w-8 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10"
              stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z" />
          </svg>
          <p>Loading messages...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500 flex flex-col items-center gap-2">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

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
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>No messages yet. Say hello!</p>
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble
            key={msg._id || msg.timestamp}
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
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-r disabled:opacity-50"
          type="submit"
          disabled={!input.trim()}
        >
          Send
        </button>
      </form>
    </div>
  )
}