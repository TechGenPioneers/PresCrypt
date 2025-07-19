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
import * as signalR from "@microsoft/signalr";
import VideoCallRoom from "../VideoCall/VideoCallRoom";
import { useVideoCall } from "../VideoCallProvider";
import IncomingCallModal from "../VideoCall/IncomingCallModal";

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
  users,
  selectedUser,
  setSelectedUser,
  userId,
  userRole,
  fetchUsers,
  connection,
  videoCallConnection,
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
  const messageContainerRef = useRef(null);
  const currentUserName = userRole === "Doctor" ? doctorName : patientName;
  const otherUserName = userRole === "Doctor" ? patientName : doctorName;
  const[isDelete,setIsDelete]=useState(false)
  const {
    incomingCall,
    callerInfo,
    roomUrl,
    activeCall,
    startCall,
    endCall,
    resetCallState,
    setCallStatus,
  } = useVideoCall();

  const handleStartCall = async () => {
    if (!selectedUser?.receiverId || !videoCallConnection) return;

    try {
      const response = await StartVideoCall(userId, selectedUser.receiverId);
      if (!response?.roomUrl) throw new Error("No room URL");

      if (videoCallConnection.state !== signalR.HubConnectionState.Connected) {
        await videoCallConnection.start();
      }

      // When initiating, otherUserName is correctly passed (e.g., patientName object if doctor is calling)
      startCall(response.roomUrl, currentUserName, otherUserName);
    } catch (error) {
      alert(`Could not start call: ${error.message}`);
    }
  };

  // FIX STARTS HERE
  const handleCallAccepted = useCallback(
    ({ roomUrl }) => {
      // Ensure we have the correct selectedUser for the call
      if (callerInfo?.callerId !== selectedUser?.receiverId) {
        const callerUser = users.find(
          (user) => user.receiverId === callerInfo?.callerId
        );
        if (callerUser) {
          setSelectedUser(callerUser);
        }
      }

      startCall(roomUrl, currentUserName, otherUserName);
      setCallStatus("active");
    },
    [
      startCall,
      setCallStatus,
      currentUserName,
      otherUserName,
      callerInfo,
      selectedUser,
      users,
    ]
  );

  const handleEndCall = () => {
    endCall();
    resetCallState();
  };

  const handleRejectCall = () => {
    resetCallState();
  };

  useEffect(() => {
    console.log("activeCall updated:", activeCall);
  }, [activeCall]);

  const [, setTimeTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeTick((prev) => prev + 1);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!connection) return;
    connection.on("MessageReceived", handleNewMessage);
    return () => connection.off("MessageReceived", handleNewMessage);
  }, [connection]);

  const fetchMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await GetAllMessages(userId, selectedUser.receiverId);
      setMessages(data);
    } catch (err) {
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  }, [userId, selectedUser.receiverId]);

  const markAsRead = useCallback(async () => {
    try {
      await MarkMessagesAsRead(userId, selectedUser.receiverId);
      fetchUsers();
    } catch {}
  }, [userId, selectedUser.receiverId]);

  const handleNewMessage = (newMsg) => {
    if (
      newMsg.senderId === selectedUser.receiverId ||
      newMsg.receiverId === selectedUser.sender
    ) {
      setMessages((prev) => [...prev, newMsg]);
      markAsRead();
      fetchUsers();
    }
  };

  useEffect(() => {
    fetchMessages();
    markAsRead();
  }, [selectedUser, fetchMessages, markAsRead]); // Added fetchMessages and markAsRead to dependencies

  useEffect(() => {
    if (!connection) return;

    const handleMessageRead = (payload) => {
      if (!payload || !Array.isArray(payload.messageIds)) return;

      setMessages((prev) =>
        prev.map((msg) =>
          payload.messageIds.includes(msg.id) ? { ...msg, isRead: true } : msg
        )
      );
    };

    connection.on("MessageRead", handleMessageRead);
    return () => connection.off("MessageRead", handleMessageRead);
  }, [connection]);

  useEffect(() => {
    if (!connection) return;

    const handleDeleted = (deletedId) => {
      setMessages((prev) => prev.filter((msg) => msg.id !== deletedId));
    };

    connection.on("MessageDeleted", handleDeleted);
    return () => connection.off("MessageDeleted", handleDeleted);
  }, [connection]);

  useEffect(() => {
    const container = messageContainerRef.current;
    if (!container) return;

    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      50;

    if (isNearBottom) {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (!newMessage) return;

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
  }, [newMessage, selectedUser, markAsRead, fetchUsers, setNewMessage]); // Added dependencies

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpenId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDeleteMessage = async (messageId) => {
    setIsDelete(true)
    try {
      await DeleteMessage(messageId);
      setMenuOpenId(null);
      fetchUsers();
    } catch (err) {
      console.error("Failed to delete message", err);
    } 
    setIsDelete(false) 
  };

  const shouldShowIncomingModal =
    incomingCall && callerInfo?.callerId === selectedUser?.receiverId;

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
    <div ref={messageContainerRef} className="flex flex-col flex-1 min-h-0">
      <ChatHeader
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        onStartCall={userRole === "Doctor" ? handleStartCall : undefined}
        userRole={userRole}
        isCallActive={!!activeCall}
      />

      {shouldShowIncomingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <IncomingCallModal
            callerName={callerInfo?.callerName} // This callerName might be just a string
            onAccept={() => handleCallAccepted({ roomUrl })}
            onReject={handleRejectCall}
          />
        </div>
      )}

      {activeCall ? (
        <VideoCallRoom
          roomUrl={activeCall.roomUrl}
          onLeave={handleEndCall}
          userName={activeCall.currentUserName || currentUserName}
          otherUserName={activeCall.otherUserName || otherUserName}
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
                              src={
                                `data:image/jpeg;base64,${selectedUser.profileImage}` ||
                                "/profile.png"
                              }
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
                            className="absolute top-2 right-0 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
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
                              className="rounded-md mb-1"
                            />
                          )}
                          {msg.text && <p>{msg.text}</p>}
                          <div className="flex items-center justify-end gap-1 mt-1">
                            <time className="text-xs opacity-50">
                              {formatMessageTime(msg.sendAt)}
                            </time>
                            {isSelf && (
                              <>
                                {!msg.isReceived ? (
                                  <Clock className="w-3 h-3 text-gray-500" />
                                ) : msg.isRead ? (
                                  <span className="flex gap-[1px] text-blue-500">
                                    <Check className="w-3 h-3" />
                                    <Check className="w-3 h-3 -ml-1.5" />
                                  </span>
                                ) : (
                                  <Check className="w-3 h-3 text-gray-500" />
                                )}
                              </>
                            )}
                          </div>
                        </div>

                        {menuOpenId === msg.id && (
                          <ul
                            ref={menuRef}
                            className="absolute top-0 right-0 z-0 w-48 rounded-md border bg-white p-2 shadow-xl"
                          >
                            <li>
                              <button
                                onClick={() => handleDeleteMessage(msg.id)}
                                disabled={isDelete}
                                className={`w-full flex items-center gap-2 text-sm p-2 rounded-md ${
                                  isDelete
                                    ? "text-gray-400 cursor-not-allowed"
                                    : "text-red-600 hover:bg-red-50"
                                }`}
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
