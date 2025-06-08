"use client";
import { useState } from "react";
import ChatList from "./component/ChatList";
import ChatWindow from "./component/ChatWindow";
import NoChatSelected from "./component/NoChatSelected";

const Layout = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);

  const sendMessage = (message) => {
    setMessages([...messages, { sender: "patient", text: message }]);
  };

  return (
    <div className="flex h-screen p-2 gap-2">
  <div className="w-1/4 bg-white text-black p-4 border-[3px] border-[#006369] overflow-y-auto rounded-xl">
    <ChatList
      selectedUser={selectedUser}
      setSelectedUser={setSelectedUser}
    />
  </div>

  <div className="w-3/4 flex flex-col bg-[#ecf0f1] rounded-xl overflow-hidden">
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
