"use client";

import { useEffect, useRef, useState } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import ChatHeaderSkeleton from "./skeletons/ChatHeaderSkeleton";
import { GetAllMessages } from "../service/ChatService";

// Format time as HH:mm
const formatMessageTime = (date) => {
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

// Format date label (Today, Yesterday, or full date)
const getDateLabel = (date) => {
  const now = new Date();
  const messageDate = new Date(date);

  const isToday = messageDate.toDateString() === now.toDateString();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  const isYesterday = messageDate.toDateString() === yesterday.toDateString();

  if (isToday) return "Today";
  if (isYesterday) return "Yesterday";

  return messageDate.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const ChatWindow = ({ selectedUser, setSelectedUser }) => {
  const userId = "P002";
  const [messages, setMessages] = useState([]);
  const [isMessagesLoading, setMessageLoading] = useState(false);
  const messageEndRef = useRef(null);

  // Dummy state to trigger re-render for auto-updating time
  const [timeNow, setTimeNow] = useState(new Date());

  const fetchMessages = async () => {
    setMessageLoading(true);
    try {
      const response = await GetAllMessages(selectedUser.receiverId);
      setMessages(response);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setMessageLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedUser]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Update time every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeNow(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  if (isMessagesLoading) {
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
        {(() => {
          let lastMessageDate = null;
          return messages.map((message, index) => {
            const currentMessageDate = new Date(message.sendAt).toDateString();
            const showDateSeparator = currentMessageDate !== lastMessageDate;
            lastMessageDate = currentMessageDate;

            return (
              <div key={message.id}>
                {showDateSeparator && (
                  <div className="flex justify-center my-2">
                    <span className="text-sm text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
                      {getDateLabel(message.sendAt)}
                    </span>
                  </div>
                )}

                <div
                  ref={index === messages.length - 1 ? messageEndRef : null}
                  className={`flex items-end ${
                    message.senderId === userId ? "justify-end" : "justify-start"
                  }`}
                >
                  {/* Avatar on left for received messages */}
                  {message.senderId !== userId && (
                    <div className="chat-image avatar mr-2">
                      <div className="border border-emerald-600 rounded-full w-10 h-10 overflow-hidden">
                        <img
                          src={selectedUser.image || "profile.png"}
                          alt="profile pic"
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </div>
                  )}

                  <div className="max-w-[70%]">
                    <div
                      className={`flex flex-col chat-bubble p-2 rounded-lg break-words ${
                        message.senderId === userId
                          ? "bg-[#E9FAF2] text-gray-800 rounded-br-none"
                          : "bg-gray-200 text-gray-900 rounded-bl-none"
                      }`}
                    >
                      {message.image && (
                        <img
                          src={message.image}
                          alt="Attachment"
                          className="sm:max-w-[200px] rounded-md"
                        />
                      )}
                      {message.text && <p>{message.text}</p>}
                      <div className="text-right">
                        <time className="ml-1 text-xs opacity-50">
                          {formatMessageTime(message.sendAt)}
                        </time>
                      </div>
                    </div>
                  </div>

                  {/* Avatar on right for sent messages */}
                  {message.senderId === userId && (
                    <div className="chat-image avatar ml-2">
                      <div className="border border-emerald-800 rounded-full w-10 h-10 overflow-hidden">
                        <img
                          src={"/avatar.png"}
                          alt="profile pic"
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

      <MessageInput selectedUser={selectedUser} fetchMessages={fetchMessages} />
    </div>
  );
};

export default ChatWindow;
