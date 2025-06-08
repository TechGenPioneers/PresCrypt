"use client";

import { useState } from "react";
import ChatList from "./component/ChatList";
import ChatWindow from "./component/ChatWindow";
import NoChatSelected from "./component/NoChatSelected";
import VideoCall from "./VideoCall";
import { Video } from "lucide-react";
import "./styles/telehealth.css"; // Import the CSS file

const Layout = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);

  const sendMessage = (message) => {
    setMessages([...messages, { sender: "patient", text: message }]);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Chat Contacts */}
      <div className="w-1/4 bg-white text-black p-4 overflow-y-auto border-[3px] border-[#006369] m-5">
        <ChatList
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
      </div>

      {/* Right side - Chat Window & Video Call */}
      <div className="right-side">
        {selectedUser !== null ? (
          <ChatWindow
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            messages={messages}
            sendMessage={sendMessage}
          />
        ) : (
          <NoChatSelected />
        )}
      </div>
    </div>
  );
};

export default Layout;
