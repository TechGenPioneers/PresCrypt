"use client";
import React from "react";

export default function Message({ message }) {
  const { sender, text, time } = message;
  const isUser = sender === "user";

  return (
    <div className={`mb-4 ${isUser ? "text-right" : ""}`}>
      {!isUser && (
        <div className="flex items-center mb-1 text-xs text-gray-500">
          <span className="font-medium text-green-800">Prescrypt chatbot</span>
          <span className="ml-2">{time}</span>
        </div>
      )}
      
      <div
        className={`inline-block max-w-[80%] p-3 rounded-lg ${
          isUser
            ? "bg-teal-600 text-white rounded-tr-none"
            : "bg-white text-gray-800 rounded-tl-none border border-gray-200"
        }`}
      >
        {text}
      </div>
      
      {isUser && (
        <div className="flex justify-end items-center mt-1 text-xs text-gray-500">
          <span className="mr-2">{time}</span>
          <span className="font-medium">You</span>
        </div>
      )}
    </div>
  );
}