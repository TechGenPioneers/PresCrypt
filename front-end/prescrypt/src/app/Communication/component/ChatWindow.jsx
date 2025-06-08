"use client";

import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import ChatHeaderSkeleton from "./skeletons/ChatHeaderSkeleton";

// Dummy auth user
const authUser = {
  _id: "1",
  fullName: "You",
  profilePic: "/avatar.png",
};

const formatMessageTime = (date) => {
  return new Date(date).toLocaleTimeString();
};

const useChatStore = () => {
  const messages = [
    {
      _id: "msg1",
      senderId: "1", // Alice Smith
      text: "Hey Bob! How's it going?",
      image: null,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    },
    {
      _id: "msg2",
      senderId: "2", // Bob Johnson
      text: "Hi Alice! Pretty good, thanks. How about you?",
      image: null,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1.5).toISOString(), // 1.5 hours ago
    },
    {
      _id: "msg3",
      senderId: "1",
      text: "Doing well! Just working on the new project.",
      image: null,
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
    },
    {
      _id: "msg4",
      senderId: "2",
      text: "",
      image: "image25.png", // Simulate sending an image
      createdAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(), // 40 minutes ago
    },
    {
      _id: "msg5",
      senderId: "1",
      text: "Nice photo! Where was that taken?",
      image: null,
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    },
    {
      _id: "msg6",
      senderId: "2",
      text: "At the beach last weekend. It was amazing!",
      image: null,
      createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(), // 25 minutes ago
    },
  ];

  return {
    messages,
    getMessages: () => {},
    isMessagesLoading: false,
    subscribeToMessages: () => {},
    unsubscribeFromMessages: () => {},
  };
};

const ChatWindow = ({ selectedUser, setSelectedUser }) => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser._id]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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
    <div className="min-h-screen flex flex-col flex-1 overflow-auto">
      <ChatHeader
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
      />

      <div className="flex-1 p-4 space-y-4 overflow-y-auto flex flex-col">
        {messages.map((message, index) => (
          <div
            key={message._id}
            ref={index === messages.length - 1 ? messageEndRef : null}
            className={`flex items-end ${
              message.senderId === authUser._id
                ? "justify-end"
                : "justify-start"
            }`}
          >
            {/* If message is from other user, show avatar on left */}
            {message.senderId !== authUser._id && (
              <div className="chat-image avatar mr-2">
                <div className="border rounded-full w-10 h-10 overflow-hidden">
                  <img
                    src={selectedUser.profilePic || "/avatar.png"}
                    alt="profile pic"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            )}

            <div className="max-w-[70%]">
              <div className="mb-1 chat-header text-right">
                <time className="ml-1 text-xs opacity-50">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>

              <div
                className={`flex flex-col chat-bubble p-3 rounded-lg break-words ${
                  message.senderId === authUser._id
                    ? "bg-[#E9FAF2] text-gray-800 rounded-br-none"
                    : "bg-gray-200 text-gray-900 rounded-bl-none"
                }`}
              >
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2"
                  />
                )}
                {message.text && <p>{message.text}</p>}
              </div>
            </div>

            {/* If message is from authUser, show avatar on right */}
            {message.senderId === authUser._id && (
              <div className="chat-image avatar ml-2">
                <div className="border rounded-full w-10 h-10 overflow-hidden">
                  <img
                    src={authUser.profilePic || "/avatar.png"}
                    alt="profile pic"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatWindow;
