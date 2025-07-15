"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import ChatHeaderSkeleton from "./skeletons/ChatHeaderSkeleton";
import {
  DeleteMessage,
  GetAllMessages,
  MarkMessagesAsRead,
  StartVideoCall,
} from "../service/ChatService";
import { EllipsisVertical, Trash2, Check, Clock } from "lucide-react";
import VideoCallRoom from "../VideoCall/VideoCallRoom";
import { useVideoCall } from "../VideoCallProvider";

// Utility functions
const formatMessageTime = (date) =>
  new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

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

const ChatWindow = ({
  selectedUser,
  setSelectedUser,
  userId,
  userRole,
  fetchUsers,
  connection,
  setNewMessage,
  newMessage,
  doctorName,
  patientName,
}) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const messageEndRef = useRef(null);
  const menuRef = useRef(null);
  const [activeCall, setActiveCall] = useState(null);

  const currentUserName =
    userRole === "Doctor"
      ? `Dr. ${doctorName || ""}`.trim()
      : patientName || "Patient";

  const otherUserName =
    userRole === "Doctor"
      ? patientName || "Patient"
      : `Dr. ${doctorName || ""}`.trim();

  // Video call hooks
  const { incomingCall, callerInfo, roomUrl, receiveCall, resetCallState } =
    useVideoCall();

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
      if (err.response && err.response.status === 404) {
        console.warn("No messages found for this conversation.");
        setMessages([]); // Clear messages or handle as needed
      } else {
        console.error("Error loading messages:", err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [userId, selectedUser.receiverId]);

  const markAsRead = useCallback(async () => {
    try {
      console.log("Marking messages as read for user:", userId);
      await MarkMessagesAsRead(userId, selectedUser.receiverId);
      fetchUsers();
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  }, [userId, selectedUser.receiverId]); // add userId and fetchUsers to deps

  // Handle video call events
  const handleStartCall = async () => {
    if (!selectedUser?.receiverId) return;

    try {
      const response = await StartVideoCall(userId, selectedUser.receiverId);
      setActiveCall({
        roomUrl: response.roomUrl,
        otherUserName: selectedUser.fullName || selectedUser.userName,
      });
    } catch (error) {
      console.error("Failed to start video call", error);
    }
  };

  const handleEndCall = () => {
    setActiveCall(null);
  };
  // Handle incoming call for current chat
  useEffect(() => {
    if (
      incomingCall &&
      callerInfo?.callerId === selectedUser?.receiverId &&
      roomUrl
    ) {
      setActiveCall({
        roomUrl: roomUrl,
        otherUserName: callerInfo.callerName,
      });
      resetCallState();
    }
  }, [
    incomingCall,
    callerInfo,
    roomUrl,
    selectedUser?.receiverId,
    resetCallState,
  ]);
  // for handling the video call event
  useEffect(() => {
    const handleCallEvent = (e) => {
      const { roomUrl, otherUserName } = e.detail;
      setActiveCall({ roomUrl, otherUserName });
    };

    window.addEventListener("startVideoCall", handleCallEvent);
    return () => window.removeEventListener("startVideoCall", handleCallEvent);
  }, []);
  useEffect(() => {
    if (!connection) return;

    const handleMessageRead = (payload) => {
      console.log("MessageRead event received:", payload);
      // Defensive: Check payload shape and data type
      if (!payload || !Array.isArray(payload.messageIds)) return;

      setMessages((prev) =>
        prev.map((msg) =>
          payload.messageIds.includes(msg.id) ? { ...msg, isRead: true } : msg
        )
      );
    };

    connection.on("MessageRead", handleMessageRead);

    return () => {
      connection.off("MessageRead", handleMessageRead);
    };
  }, [connection]);

  useEffect(() => {
    fetchMessages();
    markAsRead();
  }, [selectedUser]);

  useEffect(() => {
    if (!connection) return;

    const handleDeleted = (deletedId) => {
      setMessages((prev) => prev.filter((msg) => msg.id !== deletedId));
    };

    connection.on("MessageDeleted", handleDeleted);

    return () => {
      connection.off("MessageDeleted", handleDeleted);
    };
  }, [connection]);

  useEffect(() => {
    const container = messageEndRef.current;
    if (!container) return;

    // Check if user is near bottom before update
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      50;

    if (isNearBottom) {
      // Scroll to bottom smoothly
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    // else do nothing, so user scroll position stays where it is
  }, [messages]);

  useEffect(() => {
    if (!newMessage) return;

    console.log("New message received:", newMessage);

    if (
      newMessage.senderId === selectedUser.receiverId ||
      newMessage.receiverId === selectedUser.sender
    ) {
      setMessages((prev) => [
        ...prev,
        ...(Array.isArray(newMessage) ? newMessage : [newMessage]),
      ]);
      markAsRead();
      fetchUsers();
      setNewMessage(null);
    }
  }, [newMessage]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpenId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDeleteMessage = async (messageId) => {
    try {
      await DeleteMessage(messageId); // Your API method that triggers SignalR

      // UI updates automatically via `MessageDeleted` event
      setMenuOpenId(null);
      fetchUsers(); // Update last message if needed
    } catch (err) {
      console.error("Failed to delete message", err);
    }
  };

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
        onStartCall={userRole === "Doctor" ? handleStartCall : null} // Only doctors can initiate calls
      />
      {activeCall ? (
        <VideoCallRoom
          roomUrl={activeCall.roomUrl}
          onLeave={handleEndCall}
          userName={
            currentUserName || (userRole === "Doctor" ? "Dr." : "Patient")
          }
          otherUserName={
            otherUserName || (userRole === "Doctor" ? "Patient" : "Dr.")
          }
          userRole={userRole}
        />
      ) : (
        <>
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
                  <div key={msg.id || i} className="relative group">
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

                      <div className="max-w-[70%] relative">
                        {isSelf && (
                          <button
                            onClick={() =>
                              setMenuOpenId(
                                menuOpenId === msg.id ? null : msg.id
                              )
                            }
                            className="absolute top-2 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out cursor-pointer z-10"
                            aria-label="Open message menu"
                          >
                            <EllipsisVertical className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                          </button>
                        )}

                        <div
                          className={`flex flex-col chat-bubble p-2 rounded-lg break-words ${
                            isSelf
                              ? "bg-[#E9FAF2] text-gray-800 rounded-br-none"
                              : "bg-gray-200 text-gray-900 rounded-bl-none"
                          }`}
                        >
                          {msg.image && (
                            <img
                              src={`data:${
                                msg.imageMimeType || "image/png"
                              };base64,${msg.image}`}
                              alt="attachment"
                              className="sm:max-w-auto rounded-md mb-1"
                            />
                          )}
                          {msg.text && <p>{msg.text}</p>}
                          <div className="flex items-center justify-end gap-1 mt-1">
                            <time className="text-xs text-right opacity-50">
                              {formatMessageTime(msg.sendAt)}
                            </time>
                            {isSelf && (
                              <>
                                {!msg.isReceived ? (
                                  <span className="text-gray-500 text-xs">
                                    <Clock className="w-3 h-3" />
                                  </span>
                                ) : msg.isRead ? (
                                  <span className="flex items-center gap-[1px] text-blue-500 text-xs">
                                    <Check className="w-3 h-3" />
                                    <Check className="w-3 h-3 -ml-1.5" />
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-[1px] text-gray-500 text-xs">
                                    <Check className="w-3 h-3" />
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                        </div>

                        {menuOpenId === msg.id && (
                          <ul
                            ref={menuRef}
                            className="absolute top-0 right-0 z-0 w-48 rounded-md border bg-white p-2 shadow-xl space-y-1"
                          >
                            <li>
                              <button
                                onClick={() => handleDeleteMessage(msg.id)}
                                className="w-full flex items-center gap-2 text-sm text-red-600 hover:bg-red-50 p-2 rounded-md transition"
                              >
                                <Trash2 /> delete
                              </button>
                            </li>
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                );
              });
            })()}
          </div>

          <MessageInput
            selectedUser={selectedUser}
            userId={userId}
            fetchUsers={fetchUsers}
            connection={connection}
            setMessages={setMessages}
          />
        </>
      )}
    </div>
  );
};

export default ChatWindow;
