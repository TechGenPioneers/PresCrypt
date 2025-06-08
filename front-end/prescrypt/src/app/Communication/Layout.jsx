"use client";
import { useState } from "react";
import ChatList from "./component/ChatList";
import ChatWindow from "./component/ChatWindow";
import NoChatSelected from "./component/NoChatSelected";
import { GetUsers } from "./service/ChatService";

const Layout = () => {
  const userId = "P003"
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [isUsersLoading, setIsUsersLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await GetUsers(userId);
      setUsers(response || []);
      setHasFetched(true);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setIsUsersLoading(false);
    }
  };
  const sendMessage = (message) => {
    setMessages([...messages, { sender: "patient", text: message }]);
  };

  return (
    <div className="flex h-screen p-2 gap-2">
      <div className="w-1/4 bg-white text-black border-[3px] border-[#006369] overflow-y-auto rounded-xl">
        <ChatList
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          userId={userId}
          fetchUsers={fetchUsers}
          users={users}
          isUsersLoading={isUsersLoading}
        />
      </div>

      <div className="w-3/4 flex flex-col bg-[#ecf0f1] rounded-xl overflow-hidden">
        {selectedUser !== null ? (
          <ChatWindow
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            messages={messages}
            sendMessage={sendMessage}
            userId={userId}
            fetchUsers={fetchUsers}
          />
        ) : (
          <NoChatSelected />
        )}
      </div>
    </div>
  );
};

export default Layout;
