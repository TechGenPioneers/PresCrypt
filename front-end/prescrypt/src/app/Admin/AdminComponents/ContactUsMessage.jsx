"use client";
import React, { useEffect, useState } from "react";
import {
  Mail,
  MailOpen,
  Phone,
  User,
  Filter,
  X,
  Send,
  Check,
} from "lucide-react";
import {
  GetAllContactUsMessages,
  MarkAsRead,
  SendReply,
} from "../service/AdminContactUsService";

const MessageTable = () => {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState("");
  const [senderFilter, setSenderFilter] = useState("all");
  const [readFilter, setReadFilter] = useState("all");
  const [sending, setSending] = useState(false);
  const [marking, setMarking] = useState(false);

  const fetchAllMessages = async () => {
    const response = await GetAllContactUsMessages();
    setMessages(response);
    console.log("Messages fetched from API:", response);
    return response; // log the fresh data directly
  };

  useEffect(() => {
    fetchAllMessages();
  }, []); // Only once on mount

  const handleMarkAsRead = async (inquiryId) => {
    if (!selected) return;
    setMarking(true);

    const updateMessage = await MarkAsRead(inquiryId);

    if (updateMessage.status === 200) {
      const updatedMessages = await fetchAllMessages(); // wait for refresh
      const updated = updatedMessages.find((m) => m.inquiryId === inquiryId);

      if (updated) setSelected(updated);

      setReply("");
      setError(null);
    } else {
      setError("Failed to mark message as read");
    }

    setMarking(false);
  };

  const handleSubmit = async () => {
    setSending(true);
    if (!reply.trim()) {
      setError("Reply message cannot be empty.");
      setSending(false);
      return;
    }
    try {
      const response = await SendReply(selected.inquiryId, reply);

      if (response.status === 200) {
        const updatedMessages = await fetchAllMessages(); // ✅ get fresh data
        const updated = updatedMessages.find(
          (m) => m.inquiryId === selected.inquiryId
        );
        if (updated) {
          setSelected(updated);
        }

        setReply("");
        setError(null);
      } else {
        setError("Failed to send reply");
      }
    } catch (e) {
      setError("Failed to send reply");
    }

    setSending(false);
  };

  const filteredMessages = messages
    .filter((msg) => {
      const matchSender =
        senderFilter === "all" || msg.senderType === senderFilter;
      const matchRead =
        readFilter === "all" ||
        (readFilter === "read" && msg.isRead) ||
        (readFilter === "unread" && !msg.isRead);
      return matchSender && matchRead;
    })
    .sort((a, b) => {
      // Sort so unread messages come first
      if (a.isRead === b.isRead) return 0;
      return a.isRead ? 1 : -1; // unread (false) comes before read (true)
    });

  const getSenderBadge = (type) => {
    return type === "doctor"
      ? "bg-blue-100 text-blue-800 border-blue-200"
      : "bg-green-100 text-green-800 border-green-200";
  };

  const getFilterButtonClass = (isActive) => {
    return `px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
      isActive
        ? "bg-[#A9C9CD] text-[#09424D] shadow-lg"
        : "bg-white text-slate-600 hover:bg-slate-50 border border-[#A9C9CD]"
    }`;
  };

  const [showModel, setShowModel] = useState(true);

  useEffect(() => {
    // Minimum 5 second delay
    const timer = setTimeout(() => {
      setShowModel(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // set date and time
  if (showModel || !messages) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-[#E9FAF2] border-t-[#50d094] rounded-full animate-spin"></div>
          <p className="text-slate-600 text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }
  function getUnreadCount(messages) {
    return messages.reduce(
      (count, msg) => (!msg.isRead ? count + 1 : count),
      0
    );
  }

  const unreadCount = getUnreadCount(messages);
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Messages</h1>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-slate-600" />
            <h2 className="text-lg font-semibold text-slate-800">Filters</h2>
          </div>

          <div className="flex flex-wrap gap-3 mb-4">
            <span className="text-sm font-medium text-slate-600 flex items-center">
              Sender Type:
            </span>
            {["all", "doctor", "patient"].map((type) => (
              <button
                key={type}
                onClick={() => setSenderFilter(type)}
                className={getFilterButtonClass(senderFilter === type)}
              >
                {type === "all"
                  ? "All Senders"
                  : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex flex-wrap gap-3">
              <span className="text-sm font-medium text-slate-600 flex items-center">
                Status:
              </span>
              {["all", "read", "unread"].map((status) => (
                <button
                  key={status}
                  onClick={() => setReadFilter(status)}
                  className={getFilterButtonClass(readFilter === status)}
                >
                  {status === "all"
                    ? "All Messages"
                    : status === "read"
                    ? "Read"
                    : "Unread"}
                </button>
              ))}
            </div>
            {/* Unread Count */}
            <div className="text-sm text-slate-500 whitespace-nowrap ml-auto">
              Unread Messages:{" "}
              <span className="font-semibold text-slate-700">
                {unreadCount}
              </span>
            </div>
          </div>
        </div>
        {/* Messages Grid */}
        <div className="grid gap-4 max-h-[600px] overflow-y-auto">
          {filteredMessages.map((msg) => (
            <div
              key={msg.inquiryId}
              onClick={() => setSelected(msg)}
              className={`bg-white rounded-xl shadow-sm border transition-all duration-200 cursor-pointer hover:shadow-md hover:border-[#B5D9DB] ${
                !msg.isRead
                  ? "border-l-4 border-l-[#B5D9DB] bg-[#B5D9DB]-50/30"
                  : "border-[#B5D9DB]"
              }`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#b6e1e8] to-[#09424D] flex items-center justify-center">
                        <User className="w-6 h-6 text-[#09424D]" />
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-800">
                          {msg.firstName} {msg.lastName}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium border ${getSenderBadge(
                            msg.senderType
                          )}`}
                        >
                          {msg.senderType}
                        </span>
                        {!msg.isRead && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                            New
                          </span>
                        )}
                      </div>

                      <p className="text-slate-600 mb-1">{msg.email}</p>
                      <p className="text-lg font-medium text-slate-800 mb-2">
                        {msg.topic}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-500">
                      {msg.timestamp}
                    </span>
                    {msg.isRead === true ? (
                      <MailOpen className="w-5 h-5 text-slate-400" />
                    ) : (
                      <Mail className="w-5 h-5 text-blue-500" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modern Modal */}
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <h2 className="text-2xl font-bold text-slate-800">
                  Message Details
                </h2>
                <button
                  onClick={() => {
                    setSelected(null);
                    setReply("");
                    setError(null);
                  }}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* Sender Info */}
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#b6e1e8] to-[#09424D] flex items-center justify-center">
                    <User className="w-8 h-8 text-[#09424D]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-slate-800">
                        {selected.firstName} {selected.lastName}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium border ${getSenderBadge(
                          selected.senderType
                        )}`}
                      >
                        {selected.senderType}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-slate-600 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {selected.email}
                      </p>
                      <p className="text-slate-600 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {selected.phoneNumber}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Message Content */}
                <div className="bg-slate-50 rounded-xl p-6 space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-1">
                      Subject
                    </h4>
                    <p className="text-slate-600">{selected.topic}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-1">
                      Description
                    </h4>
                    <p className="text-slate-600">{selected.description}</p>
                  </div>
                  {selected.isRead && selected?.replyMessage && (
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-1">
                        Reply Message
                      </h4>
                      <p className="text-slate-600">{selected.replyMessage}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {!selected.isRead ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Reply
                      </label>
                      <textarea
                        className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-[#09424D] resize-none transition-colors"
                        rows={4}
                        placeholder="Type your reply..."
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                      />
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center gap-2">
                          <Check className="w-5 h-5 text-red-600" />
                          <p className="text-red-800 font-medium">{error}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex justify-end gap-3">
                      <button
                        disabled={marking}
                        onClick={() => handleMarkAsRead(selected.inquiryId)}
                        className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        {marking ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Marking...</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            Mark as Read
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={sending}
                        className="flex items-center gap-2 px-6 py-2 rounded-lg text-[#09424D] bg-[#A9C9CD] hover:bg-[#91B4B8] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {sending ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Sending...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Send Reply</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-600" />
                      <p className="text-green-800 font-medium">
                        Message already read
                        {selected.replyMessage ? " With Message" : ""}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredMessages.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <Mail className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              No messages found
            </h3>
            <p className="text-slate-600">
              Try adjusting your filters to see more messages.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageTable;
