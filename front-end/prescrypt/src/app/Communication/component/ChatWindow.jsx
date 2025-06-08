"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import ChatHeaderSkeleton from "./skeletons/ChatHeaderSkeleton";
import { GetAllMessages, MarkMessagesAsRead } from "../service/ChatService";

// Utility: Format HH:mm
const formatMessageTime = (date) =>
  new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

// Utility: Today, Yesterday, or formatted date
const getDateLabel = (date) => {
  const today = new Date();
  const msgDate = new Date(date);
  const isToday = msgDate.toDateString() === today.toDateString();

  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const isYesterday = msgDate.toDateString() === yesterday.toDateString();

  return isToday
    ? "Today"
    : isYesterday
    ? "Yesterday"
    : msgDate.toLocaleDateString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
};

const ChatWindow = ({ selectedUser, setSelectedUser, userId, fetchUsers }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const messageEndRef = useRef(null);

  // Re-render every minute to update timestamps
  const [, setTimeTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeTick((prev) => prev + 1);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await GetAllMessages(userId, selectedUser.receiverId);
      setMessages(data);
    } catch (err) {
      console.error("Error loading messages:", err);
    } finally {
      setIsLoading(false);
    }
  }, [userId, selectedUser.receiverId]);

  const markAsRead = useCallback(async () => {
    try {
      await MarkMessagesAsRead(userId, selectedUser.receiverId);
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  }, [userId, selectedUser.receiverId]);

  useEffect(() => {
    if (!selectedUser?.receiverId) return;

    fetchMessages();
    markAsRead();
    fetchUsers(); // Assuming fetchUsers is defined outside or in parent
  }, [fetchMessages, markAsRead, selectedUser?.receiverId]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex flex-col flex-1 overflow-auto">
        <ChatHeaderSkeleton />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <ChatHeader
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
      />

      <div className="flex-1 p-4 space-y-4 overflow-y-auto flex flex-col">
        {messages.length === 0 && (
          <p className="text-center text-zinc-400 italic mt-10">
            No messages yet. Start the conversation!
          </p>
        )}

        {(() => {
          let lastDate = null;

          return messages.map((msg, i) => {
            const currentDate = new Date(msg.sendAt).toDateString();
            const showDate = currentDate !== lastDate;
            lastDate = currentDate;

            const isSelf = msg.senderId === userId;

            return (
              <div key={msg.id}>
                {showDate && (
                  <div className="flex justify-center my-2">
                    <span className="text-sm text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
                      {getDateLabel(msg.sendAt)}
                    </span>
                  </div>
                )}

                <div
                  ref={i === messages.length - 1 ? messageEndRef : null}
                  className={`flex items-end ${
                    isSelf ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isSelf && (
                    <div className="avatar mr-2">
                      <div className="w-10 h-10 rounded-full border border-emerald-600 overflow-hidden">
                        <img
                          src={selectedUser.image || "/profile.png"}
                          alt="user"
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </div>
                  )}

                  <div className="max-w-[70%]">
                    <div
                      className={`flex flex-col chat-bubble p-2 rounded-lg break-words ${
                        isSelf
                          ? "bg-[#E9FAF2] text-gray-800 rounded-br-none"
                          : "bg-gray-200 text-gray-900 rounded-bl-none"
                      }`}
                    >
                      {msg.image && (
                        <img
                          src={msg.image}
                          alt="attachment"
                          className="sm:max-w-[200px] rounded-md mb-1"
                        />
                      )}
                      {msg.text && <p>{msg.text}</p>}
                      <time className="text-xs text-right opacity-50">
                        {formatMessageTime(msg.sendAt)}
                      </time>
                    </div>
                  </div>

                  {isSelf && (
                    <div className="avatar ml-2">
                      <div className="w-10 h-10 rounded-full border border-emerald-800 overflow-hidden">
                        <img
                          src="/avatar.png"
                          alt="me"
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          });
        })()}
      </div>

      <MessageInput
        selectedUser={selectedUser}
        fetchMessages={fetchMessages}
        userId={userId}
        fetchUsers={fetchUsers}
      />
    </div>
  );
};

export default ChatWindow;
