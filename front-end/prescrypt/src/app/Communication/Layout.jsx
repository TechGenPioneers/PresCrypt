"use client";

import { useState } from "react";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import VideoCall from "./VideoCall";
import "./styles/telehealth.css"; // Import the CSS file

const Layout = () => {
  const contacts = [
    { name: "Dr. John Doe", recentMessage: "Hello, how can I assist you?", id: 1 },
    { name: "Dr. Jane Smith", recentMessage: "Let's discuss your symptoms.", id: 2 },
  ];

  // Set the first contact as the default selected contact
  const [selectedContact, setSelectedContact] = useState(contacts[0]);
  const [messages, setMessages] = useState([]);

  const selectChat = (contact) => {
    setSelectedContact(contact);
    setMessages([]); // Fetch chat history for the contact
  };

  const sendMessage = (message) => {
    setMessages([...messages, { sender: "patient", text: message }]);
  };

  const startCall = () => {
    console.log("Starting video call with", selectedContact.name);
  };

  return (
    <div className="telehealth-app">
      {/* Left side - Chat Contacts */}
      <div className="left-side">
        <ChatList contacts={contacts} selectChat={selectChat} selectedContact={selectedContact} />
      </div>

      {/* Right side - Chat Window & Video Call */}
      <div className="right-side">
        {selectedContact && (
          <>
            <VideoCall startCall={startCall} />
            <ChatWindow
              selectedContact={selectedContact}
              messages={messages}
              sendMessage={sendMessage}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Layout;