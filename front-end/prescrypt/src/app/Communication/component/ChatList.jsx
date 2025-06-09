"use client";

import { useCallback, useEffect, useState } from "react";
import ChatListSkeleton from "./skeletons/ChatListSkeleton";
import { GetAllMessages } from "../service/ChatService";

const formatMessageTime = (date) => {
  const msgDate = new Date(date);
  const now = new Date();

  const isSameDay = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  if (isSameDay(msgDate, now)) {
    return msgDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } else if (isSameDay(msgDate, yesterday)) {
    return "Yesterday";
  } else {
    return msgDate.toLocaleDateString([], {
      weekday: "short",
    });
  }
};

const ChatList = ({
  selectedUser,
  setSelectedUser,
  userId,
  fetchUsers,
  users,
  isUsersLoading,
  connection,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [hasFetched, setHasFetched] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({});

  useEffect(() => {
    fetchUsers();
  }, [userId]);

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

    // Sort by latest message time descending
    filtered.sort((a, b) => new Date(b.sendAt) - new Date(a.sendAt));

    setFilteredUsers(filtered);
  }, [users, searchTerm]);

  // Fetch messages for each user once
  useEffect(() => {
    const fetchUnreadCounts = async () => {
      const counts = {};

      await Promise.all(
        users.map(async (user) => {
          try {
            const messages = await GetAllMessages(userId, user.receiverId);

            const unreadCount = messages.filter(
              (msg) =>
                !msg.isRead &&
                msg.senderId === user.receiverId &&
                msg.receiverId === userId
            ).length;

            counts[user.receiverId] = unreadCount;
          } catch (err) {
            // Handle 404 (no messages yet) gracefully
            if (err.response?.status === 404) {
              counts[user.receiverId] = 0; // No messages means no unread messages
              console.warn(`No messages found for ${user.receiverId}`);
            } else {
              console.error(
                `Failed to fetch messages for ${user.receiverId}:`,
                err
              );
            }
          }
        })
      );

      setUnreadCounts(counts);
    };

    if (users?.length > 0 && userId) {
      fetchUnreadCounts();
    }
  }, [users, userId]);

const handleReceiveMessage = useCallback((msg) => {
  console.log("New in chat list msg", msg);
  fetchUsers();
}, [fetchUsers]);


useEffect(() => {
  if (!connection || !userId) return;

  const setupConnection = async () => {
    try {
      if (connection.state !== "Connected") {
        await connection.start();
        console.log("Connected to SignalR hub");
      }

      // Delay if still not connected
      if (connection.state !== "Connected") {
        const waitForConnection = () =>
          new Promise((resolve, reject) => {
            const interval = setInterval(() => {
              if (connection.state === "Connected") {
                clearInterval(interval);
                resolve();
              }
            }, 100);
            // Timeout after 5 seconds
            setTimeout(() => {
              clearInterval(interval);
              reject(new Error("SignalR connection timed out"));
            }, 5000);
          });

        await waitForConnection();
      }

      await connection.invoke("JoinGroup", userId);

      connection.off("ReceiveMessage", handleReceiveMessage);
      connection.on("ReceiveMessage", handleReceiveMessage);

    } catch (err) {
      console.error("SignalR connection error:", err);
    }
  };

  setupConnection();

  return () => {
    if (connection?.state === "Connected") {
      connection.invoke("LeaveGroup", userId);
      connection.off("ReceiveMessage", handleReceiveMessage);
    }
  };
}, [connection, userId, handleReceiveMessage]);

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
        {filteredUsers.map((user) => {
          const unread = unreadCounts[user.receiverId] || 0;

          return (
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
              <div className="relative">
                <div className="avatar">
                  <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-emerald-200">
                    <img
                      src={user.image || "profile.png"}
                      alt={user.fullName}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white ${
                    onlineUsers.includes(user.id)
                      ? "bg-green-500 animate-pingOnce"
                      : "bg-gray-400"
                  }`}
                />
              </div>

              {/* User Info */}
              <div className="flex flex-col justify-between w-full text-left relative">
                <div className="flex justify-between items-center">
                  <div className="font-medium truncate" title={user.fullName}>
                    {user.fullName}
                  </div>
                  <div className="flex flex-col items-end gap-0 ml-2">
                    <time className="text-xs opacity-50 whitespace-nowrap">
                      {formatMessageTime(user.sendAt)}
                    </time>
                    {unread > 0 && (
                      <span className="bg-emerald-500 text-white text-xs font-semibold px-2 py-0.5  rounded-full mt-0.5">
                        {unread}
                      </span>
                    )}
                  </div>
                </div>

                {user.lastMessage && (
                  <div
                    className={`text-sm truncate ${
                      !user.isRead && user.lastMessageSenderId !== userId
                        ? "text-emerald-600 font-semibold"
                        : "text-zinc-400"
                    }`}
                    title={user.lastMessage}
                  >
                    {user.lastMessageSenderId === userId
                      ? `You: ${user.lastMessage}`
                      : `${user.fullName}: ${user.lastMessage}`}
                  </div>
                )}
              </div>
            </button>
          );
        })}

        {filteredUsers.length === 0 && (
          <div className="py-4 text-center text-zinc-500">No users found</div>
        )}
      </div>
    </aside>
  );
};

export default ChatList;
