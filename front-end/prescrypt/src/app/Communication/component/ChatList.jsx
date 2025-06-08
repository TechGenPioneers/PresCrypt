"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";

const dummyUsers = [
  {
    _id: "1",
    fullName: "Alice Smith",
    profilePic: "profile.png", // Assuming this is a valid image in your public folder
    email: "alice@example.com",
    status: "Hey there! I am using ChatApp.",
  },
  {
    _id: "2",
    fullName: "Bob Johnson",
    profilePic: "https://via.placeholder.com/150?text=Bob",
    email: "bob@example.com",
    status: "Available",
  },
  {
    _id: "3",
    fullName: "Charlie Davis",
    profilePic: "https://via.placeholder.com/150?text=Charlie",
    email: "charlie@example.com",
    status: "Busy",
  },
];

const dummyOnlineUsers = ["1", "3"];

const ChatList = ({ selectedUser, setSelectedUser }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [users, setUsers] = useState(dummyUsers);
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    setOnlineUsers(dummyOnlineUsers);
  }, []);

  useEffect(() => {
    let filtered = users;

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((user) =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  }, [users, onlineUsers, searchTerm]);

  return (
    <aside className="flex flex-col w-full h-full transition-all duration-200 border-base-300 bg-base-100">
      <div className="w-full p-5 border-b border-base-300">
        <div className="flex items-center gap-2">
          <span className="font-bold text-2xl">TeleHealth</span>
        </div>

        <div className="w-full mt-3">
          <input
            type="text"
            placeholder="Search contacts..."
            className="w-full max-w-5xl p-2 bg-white border-1 border-gray-300 rounded-md
          focus:outline-none focus:ring-2 focus:ring-[#CEE4E6] mt-1.5"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="w-full py-3 overflow-y-auto">
        {filteredUsers.map((user) => (
         <button
  key={user._id}
  onClick={() => setSelectedUser(user)}
  className={`w-full p-3 flex items-center gap-3 rounded-lg transition-colors duration-200 cursor-pointer select-none
    ${
      selectedUser && selectedUser._id === user._id
        ? "bg-[#E9FAF2] text-gray-600 shadow-md"
        : "bg-transparent text-gray-900 hover:bg-[#E9FAF2]/50"
    }`}
>
            <div className="relative inline-flex">
              <img
                src={user.profilePic || "profile.png"}
                alt="avatar"
                className="inline-block relative object-cover object-center rounded-full w-12 h-12"
              />
              {onlineUsers.includes(user._id) && (
                <span className="absolute min-w-[12px] min-h-[12px] rounded-full py-1 px-1 text-xs font-medium content-[''] leading-none grid place-items-center top-[14%] right-[14%] translate-x-2/4 -translate-y-2/4 bg-green-500 text-white border border-white"></span>
              )}
            </div>

            <div className="hidden min-w-0 text-left md:block">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
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
