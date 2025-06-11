"use client";
import { useEffect, useState } from "react";
import ChatList from "./component/ChatList";
import ChatWindow from "./component/ChatWindow";
import NoChatSelected from "./component/NoChatSelected";
import { EstablishSignalRConnection, GetUsers } from "./service/ChatService";
import * as signalR from "@microsoft/signalr";

const Layout = ({ userId }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState([]);
  const [users, setUsers] = useState([]);
  const [isUsersLoading, setIsUsersLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);
  const [connection, setConnection] = useState();

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
  // SignalR setup
  useEffect(() => {
    const newConnection = EstablishSignalRConnection();
    setConnection(newConnection);
  }, []);

  return (
    <div className="flex h-screen p-2 gap-2">
      <div className="w-1/4 bg-white text-black border-[3px] border-[#006369] overflow-y-auto rounded-xl">
        <ChatList
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          userId={userId}
          fetchUsers={fetchUsers}
          setUsers={setUsers}
          users={users}
          isUsersLoading={isUsersLoading}
          connection={connection}
          setNewMessage={setNewMessage}
          newMessage={newMessage}
        />
      </div>

      <div className="w-3/4 flex flex-col bg-[#ecf0f1] rounded-xl overflow-hidden">
        {selectedUser !== null ? (
          <ChatWindow
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            userId={userId}
            fetchUsers={fetchUsers}
            connection={connection}
            setNewMessage={setNewMessage}
            newMessage={newMessage}
          />
        ) : (
          <NoChatSelected />
        )}
      </div>
    </div>
  );
};

export default Layout;
