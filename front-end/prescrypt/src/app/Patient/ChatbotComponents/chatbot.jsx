"use client";
import { useState, useRef, useEffect } from "react";
import ChatHeader from "./chatHeader";
import MessageList from "./messageList";
import MessageInput from "./messageInput";
import ChatButton from "./chatButton";
import axios from "axios";
import Link from "next/link";
import { Import } from "lucide-react";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    return `${hours % 12 || 12}:${minutes.toString().padStart(2, "0")} ${
      hours >= 12 ? "PM" : "AM"
    }`;
  };

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello Kayle!",
      time: getCurrentTime(),
    },
    {
      sender: "bot",
      text: "Welcome to Prescrypt! Let me know how can I help you to continue your journey healthily?",
      time: getCurrentTime(),
    },
  ]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = async (newMessage) => {
    if (!newMessage.trim()) return;

    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const formattedTime = `${hours % 12 || 12}:${minutes
      .toString()
      .padStart(2, "0")} ${hours >= 12 ? "PM" : "AM"}`;

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: newMessage,
        time: formattedTime,
      },
    ]);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/api/query",
        {
          question: newMessage,
          user_id: "p001",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const botResponse = response.data.response;
      const navRoute = response.data.navigate;

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text:
            typeof botResponse === "string"
              ? botResponse
              : JSON.stringify(botResponse),
          time: formattedTime,
        },
        ...(navRoute
          ? [
              {
                sender: "bot",
                text: `Click here to continue:`,
                time: formattedTime,
                link: navRoute,
              },
            ]
          : []),
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Sorry, there was a problem connecting to the chatbot backend.",
          time: formattedTime,
        },
      ]);
    }
  };

  const suggestedQuestions = [
    "I want to book an appointment",
    "Show me my prescriptions",
    "Is Dr. Sharma available today?",
    "Show me the doctors available today",
    "How do I update my health report?",
  ];

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && <ChatButton onClick={() => setIsOpen(true)} />}

      {/* Chat Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 md:w-1/2 lg:w-2/5 xl:w-1/3 max-w-xl bg-white shadow-xl z-50 transform transition-transform duration-500 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <ChatHeader onClose={() => setIsOpen(false)} />

        {/* Suggested Questions (show on hover) */}
        <div className="relative group">
          <div className="absolute top-0 left-0 w-full opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-300 z-10 ">
            <div className="px-4 py-2 bg-gray-70">
              <p className="text-sm text-gray-600 mb-1 font-semibold align-middle">
                Try Quick Questions!
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(question)}
                    className="text-xs px-3 py-1 rounded-full bg-teal-0 text-teal-700 hover:bg-teal-200 transition "
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {/* Invisible area to trigger hover */}
          <div className="h-2 not-[]:w-full"></div>
        </div>

        {/* Messages */}
        <MessageList messages={messages} messagesEndRef={messagesEndRef} />

        {/* Input */}
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </>
  );
}
