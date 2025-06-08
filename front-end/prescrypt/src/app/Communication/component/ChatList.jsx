"use client";

import { useEffect, useState } from "react";
import ChatListSkeleton from "./skeletons/ChatListSkeleton";
import { GetUsers } from "../service/ChatService";

const ChatList = ({ selectedUser, setSelectedUser }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchUsers = async () => {
    setIsUsersLoading(true);
    try {
      const response = await GetUsers();
      setUsers(response || []);
      setHasFetched(true);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setIsUsersLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!users || users.length === 0) {
      setFilteredUsers([]);
      return;
    }

    let filtered = [...users];

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((user) =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  }, [users, onlineUsers, searchTerm]);

  if (!hasFetched && isUsersLoading) return <ChatListSkeleton />;

  return (
    <aside className="flex flex-col w-full transition-all duration-200">
      {/* Sticky Header */}
      <div className="w-full p-5 border-b border-base-300 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <span className="font-bold text-2xl">TeleHealth</span>
        </div>

        <div className="w-full mt-3">
          <input
            type="text"
            placeholder="Search contacts..."
            className="w-full max-w-5xl p-2 bg-white border border-gray-300 rounded-md
            focus:outline-none focus:ring-2 focus:ring-[#CEE4E6] mt-1.5"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Scrollable User List */}
      <div className="w-full py-3 h-screen overflow-auto scroll-smooth">
        {filteredUsers.map((user) => (
          <button
            key={user.receiverId}
            onClick={() => setSelectedUser(user)}
            className={`w-full p-3 flex items-center gap-3 rounded-lg transition-colors duration-200 cursor-pointer select-none
              ${
                selectedUser && selectedUser.receiverId === user.receiverId
                  ? "bg-[#E9FAF2] text-gray-600 shadow-md"
                  : "bg-transparent text-gray-900 hover:bg-[#E9FAF2]/50"
              }`}
          >
            {/* Avatar */}
            <div className="relative hidden md:inline-flex">
              <img
                src={user.profilePic || "profile.png"}
                alt={user.fullName}
                onError={(e) => (e.currentTarget.src = "/default-avatar.png")}
                className="object-cover object-center rounded-full w-12 h-12"
              />
              {onlineUsers.includes(user.id) && (
                <span className="absolute min-w-[12px] min-h-[12px] rounded-full py-1 px-1 text-xs font-medium leading-none grid place-items-center top-[14%] right-[14%] translate-x-2/4 -translate-y-2/4 bg-green-500 text-white border border-white"></span>
              )}
            </div>

            {/* User Info */}
            <div className="min-w-0 text-left">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user.id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="py-4 text-center text-zinc-500">No users found</div>
        )}
      </div>
    </aside>
  );
};

export default ChatList;
