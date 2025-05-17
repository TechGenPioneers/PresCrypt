"use client";
import { useState, useRef, useEffect } from "react";
import ChatHeader from "./chatHeader";
import MessageList from "./messageList";
import MessageInput from "./messageInput";
import ChatButton from "./chatButton";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello Kayle!",
      time: "02:10 PM"
    },
    {
      sender: "bot",
      text: "Welcome to Prescrypt! Let me know how can i help you to continue your journey healthily?",
      time: "02:10 PM"
    },
    {
      sender: "user",
      text: "How can i view my past appointments?",
      time: "02:12 PM"
    }
  ]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = (newMessage) => {
    if (!newMessage.trim()) return;
    
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const formattedTime = `${hours % 12 || 12}:${minutes.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`;
    
    setMessages([
      ...messages,
      {
        sender: "user",
        text: newMessage,
        time: formattedTime
      }
    ]);
    
    // Simulate bot response (in a real app, this would call your backend)
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          sender: "bot",
          text: "I'll help you find your past appointments. You can view them in the Appointments section of your dashboard.",
          time: formattedTime
        }
      ]);
    }, 1000);
  };

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

        {/* Messages */}
        <MessageList messages={messages} messagesEndRef={messagesEndRef} />

        {/* Input */}
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </>
  );
}