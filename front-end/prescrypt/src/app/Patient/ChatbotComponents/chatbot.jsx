"use client";
import { useState, useRef, useEffect } from "react";
import ChatHeader from "./chatHeader";
import MessageList from "./messageList";
import MessageInput from "./messageInput";
import ChatButton from "./chatButton";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Get the token from localStorage (keeping original logic but with fallback)
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  let patientId = "guest";
  if (token) {
    try {
      const decoded = jwtDecode(token);
      patientId = decoded.patientId || decoded.sub || "guest";
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  const getStorageKey = () => `chatbotMessages_${patientId}_${token?.slice(-6) || "noToken"}`;
  
  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    return `${hours % 12 || 12}:${minutes.toString().padStart(2, "0")} ${
      hours >= 12 ? "PM" : "AM"
    }`;
  };

  // Initialize messages with enhanced greeting
  const [messages, setMessages] = useState(() => {
    if (typeof window === 'undefined') return [];
    
    const savedMessages = localStorage.getItem(getStorageKey());
    return savedMessages
      ? JSON.parse(savedMessages)
      : [
          {
            sender: "bot",
            text: (() => {
              const hour = new Date().getHours();
              const name = patientId !== "guest" ? "there" : "there";
              if (hour < 12) return `Hello ${name}! Good morning! 🌅`;
              if (hour < 18) return `Hello ${name}! Good afternoon! ☀️`;
              return `Hello ${name}! Good evening! 🌙`;
            })(),
            time: getCurrentTime(),
          },
          {
            sender: "bot",
            text: "Welcome to Prescrypt! I'm here to assist you with appointments, prescriptions, doctor availability, and health reports. How can I help you today? 💊✨",
            time: getCurrentTime(),
          },
        ];
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(getStorageKey(), JSON.stringify(messages));
    }
    scrollToBottom();
  }, [messages, isOpen]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const currentKey = getStorageKey();
    const savedMessages = localStorage.getItem(currentKey);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      setMessages([
        {
          sender: "bot",
          text: (() => {
            const hour = new Date().getHours();
            const name = patientId !== "guest" ? "there" : "there";
            if (hour < 12) return `Hello ${name}! Good morning! 🌅`;
            if (hour < 18) return `Hello ${name}! Good afternoon! ☀️`;
            return `Hello ${name}! Good evening! 🌙`;
          })(),
          time: getCurrentTime(),
        },
        {
          sender: "bot",
          text: "Welcome to Prescrypt! I'm here to assist you with appointments, prescriptions, doctor availability, and health reports. How can I help you today? 💊✨",
          time: getCurrentTime(),
        },
      ]);
    }
  }, [token]);

  const handleSendMessage = async (newMessage) => {
    if (!newMessage.trim()) return;

    const formattedTime = getCurrentTime();

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: newMessage,
        time: formattedTime,
      },
    ]);

    setIsTyping(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/api/query",
        {
          question: newMessage,
          patient_id: patientId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsTyping(false);

      const botResponse = response.data.response;
      const navRoute = response.data.navigate;

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: typeof botResponse === "string" ? botResponse : JSON.stringify(botResponse),
          time: formattedTime,
        },
        ...(navRoute
          ? [
              {
                sender: "bot",
                text: `Click here to continue: 👆`,
                time: formattedTime,
                link: navRoute,
              },
            ]
          : []),
      ]);
    } catch (error) {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          error: error.message,
          text: "Sorry, I'm having trouble connecting right now. Please try again in a moment. 🔄",
          time: formattedTime,
        },
      ]);
    }
  };

  const suggestedQuestions = [
    "📅 Book an appointment",
    "💊 Show my prescriptions", 
    "👨‍⚕️ Is Dr. Sharma available?",
    "🏥 Available doctors today",
    "📋 Update health report",
  ];

  return (
    <>
      {!isOpen && <ChatButton onClick={() => setIsOpen(true)} />}
      
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-20 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Chat Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 md:w-1/2 lg:w-2/5 xl:w-1/3 max-w-xl bg-gradient-to-b from-gray-50 to-white shadow-2xl z-50 transform transition-all duration-500 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Enhanced Header */}
        <ChatHeader onClose={() => setIsOpen(false)} />
        
        {/* Quick Questions Overlay */}
        <div className="relative group">
          <div className="absolute top-0 left-0 w-full opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 z-10 transform translate-y-2 group-hover:translate-y-0">
            <div className="mx-4 mb-2 p-4 bg-white rounded-xl shadow-lg border border-teal-100">
              <div className="flex items-center mb-2">
                <div className="w-2 h-2 bg-teal-500 rounded-full mr-2 animate-pulse"></div>
                <p className="text-sm text-gray-700 font-semibold">Quick Questions</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(question.replace(/^[\w\s]*\s/, ''))} // Remove emoji for actual query
                    className="text-xs px-3 py-2 rounded-full bg-gradient-to-r from-teal-50 to-teal-100 text-teal-700 hover:from-teal-100 hover:to-teal-200 transition-all duration-200 hover:scale-105 hover:shadow-md border border-teal-200"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Hover indicator */}
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-teal-200 to-transparent opacity-30"></div>
        </div>

        {/* Messages Area */}
        <MessageList 
          messages={messages} 
          messagesEndRef={messagesEndRef} 
          isTyping={isTyping}
        />
        
        {/* Enhanced Input */}
        <MessageInput onSendMessage={handleSendMessage} />
        
        {/* Status Bar */}
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              <span>Online • Prescrypt Assistant</span>
            </div>
            <span>{messages.length > 2 ? `${messages.length - 2} messages` : 'New chat'}</span>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out forwards;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-typing {
          animation: typing 1.5s infinite;
        }
        
        @keyframes typing {
          0%, 60%, 100% { opacity: 0; }
          30% { opacity: 1; }
        }
        
        .chat-shadow {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </>
  );
}