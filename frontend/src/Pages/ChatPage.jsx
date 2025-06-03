
import React from "react";
import ChatRoom from "../components/ChatRoom";
import { useParams } from "react-router-dom";

export default function ChatPage() {
  const { roomId, sender } = useParams();

  if (!roomId || !sender) {
    return <div>Invalid Access</div>;
  }
  return (
    <div className="h-screen flex flex-col">
      <div className="bg-blue-600 text-white p-4 text-lg font-bold">Appointment Chat</div>
      <div className="flex-1">
        <ChatRoom roomId={roomId} sender={sender} />

      </div>
    </div>
  );
}