"use client";

import { useEffect, useState } from "react";
import ChatListSkeleton from "./skeletons/ChatListSkeleton";
import { GetAllMessages } from "../service/ChatService";
import { Clock, Check, Image, MessageCircle } from "lucide-react";

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
  setNewMessage,
  newMessage,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
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

  useEffect(() => {
    if (!connection || !userId) return;

    const setupConnection = async () => {
      try {
        if (connection.state === "Disconnected") {
          await connection.start();
          console.log("Connected to SignalR hub");
        }

        if (connection.state !== "Connected") {
          await new Promise((resolve, reject) => {
            const interval = setInterval(() => {
              if (connection.state === "Connected") {
                clearInterval(interval);
                resolve();
              }
            }, 100);
            setTimeout(() => {
              clearInterval(interval);
              reject(new Error("SignalR connection timed out"));
            }, 5000);
          });
        }

        await connection.invoke("JoinGroup", userId);

        // Remove any existing handler and register the correct one
        console.log("setNewMessage:", setNewMessage);
        connection.off("ReceiveMessage");
        connection.on("ReceiveMessage", (msg) => {
          if (selectedUser && msg.senderId === selectedUser.receiverId) {
            if (!Array.isArray(newMessage) || newMessage.length === 0) {
              setNewMessage([msg]);
            } else {
              setNewMessage((prev) => [...prev, msg]);
            }
          }
          fetchUsers();
        });
      } catch (err) {
        console.error("SignalR connection error:", err);
      }
    };

    setupConnection();

    return () => {
      if (connection?.state === "Connected") {
        connection.invoke("LeaveGroup", userId);
        connection.off("ReceiveMessage");
      }
    };
  }, [connection, userId, fetchUsers]);

  useEffect(() => {
    if (!connection) return;

    const handleMessageRead = (payload) => {
      console.log("MessageRead event received:", payload);
      fetchUsers();
    };

    connection.on("MessageRead", handleMessageRead);

    return () => {
      connection.off("MessageRead", handleMessageRead);
    };
  }, [connection]);

  if (isUsersLoading) return <ChatListSkeleton />;

  return (
    <aside className="flex flex-col w-full min-h-screen transition-all duration-300 bg-base-100 border-r border-[#09424D]">
      <div className="w-full p-5 border-b border-[#09424D] bg-[#E9FAF2] sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-[#09424D]">TeleHealth</span>
        </div>

        <div className="mt-3">
          <input
            type="text"
            placeholder="Search contacts..."
            className="w-full p-2 px-3 text-sm border rounded-md focus:ring-2 focus:ring-emerald-200 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Scrollable User List */}
      <div className="h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-300 scrollbar-track-transparent py-3 px-1">
        {filteredUsers.map((user) => {
          const unread = unreadCounts[user.receiverId] || 0;

          return (
            <button
              key={user.receiverId}
              onClick={() => setSelectedUser(user)}
              className={`w-full flex items-center p-3 my-1 rounded-xl transition-all border hover:border-emerald-400 ${
                selectedUser?.receiverId === user.receiverId
                  ? "bg-[#E9FAF2] border-emerald-400 shadow-sm"
                  : "border-emerald-200/50 hover:bg-emerald-50/40"
              }`}
            >
              {/* Avatar */}
              <div className="relative shrink-0 mr-3">
                <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-emerald-200">
                  <img
                    src={
                      user.profileImage
                        ? `data:image/jpeg;base64,${user.profileImage}`
                        : "/profile.png"
                    }
                    alt={user.fullName}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
              </div>

              {/* User Info */}
              <div className="flex flex-col w-full">
                {/* Top row: name + time + ticks */}
                <div className="flex justify-between items-center">
                  <div className="text-sm font-semibold text-gray-900 truncate max-w-[65%]">
                    {user.fullName}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <time>{formatMessageTime(user.sendAt)}</time>
                    {user.lastMessageSenderId === userId &&
                      (!user.isReceived ? (
                        <Clock className="w-3 h-3" />
                      ) : user.isRead ? (
                        <span className="flex gap-[1px] text-blue-500">
                          <Check className="w-3 h-3" />
                          <Check className="w-3 h-3 -ml-1.5" />
                        </span>
                      ) : (
                        <Check className="w-3 h-3 text-gray-400" />
                      ))}
                  </div>
                </div>

                {/* Message preview */}
                <div className="flex flex-col items-start text-sm mt-0.5">
                  {user.image && (
                    <div
                      className={`flex items-center gap-1 truncate ${
                        !user.isRead && user.lastMessageSenderId !== userId
                          ? "text-emerald-600 font-semibold"
                          : "text-zinc-400"
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        {user.lastMessageSenderId === userId ? (
                          <>
                            <span>You:</span>
                            <Image className="w-4 h-4" />
                            <span>Attachment</span>
                          </>
                        ) : (
                          <>
                            <span>{user.fullName}:</span>
                            <Image className="w-4 h-4" />
                            <span>Attachment</span>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {user.lastMessage && (
                    <div
                      className={`truncate ${
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

                {/* Unread badge */}
                {unread > 0 && (
                  <span className="-mt-4 self-end text-xs font-semibold text-white bg-emerald-500 px-2 py-0.5 rounded-full">
                    {unread}
                  </span>
                )}
              </div>
            </button>
          );
        })}

        {filteredUsers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <MessageCircle className="w-12 h-12 text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">No Chat found</p>
            <p className="text-gray-400 text-sm">
              Try adjusting your search terms
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default ChatList;
