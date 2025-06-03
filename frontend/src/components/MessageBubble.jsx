import React from "react";

export default function MessageBubble({ message, isOwn }) {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-2`}>
      <div className={`rounded-lg px-4 py-2 max-w-xs ${isOwn ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"}`}>
        <div className="text-sm">{message.message}</div>
        <div className="text-xs text-right opacity-70">{new Date(message.timestamp).toLocaleTimeString()}</div>
      </div>
    </div>
  );
}