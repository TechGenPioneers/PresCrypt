// app/ChatbotComponents/message.jsx
"use client";
import React from "react";
import Link from "next/link";

export default function Message({ message }) {
  const { sender, text, time, link } = message; // Added link to handle navigation
  const isUser = sender === "user";

  // Function to parse **bold** text into <strong> tags
  const parseBoldText = (text) => {
    return text.split(/(\*\*.*?\*\*)/g).map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  // Function to render text with line breaks and bullet points
  const renderFormattedText = (text) => {
    return text.split("\n").map((line, lineIndex) => {
      // Handle bullet points (- ) at the start of a line
      if (line.trim().startsWith("- ")) {
        const bulletItems = line.split(/(?=- )/); // Split by - (keeping the -)
        return (
          <ul key={lineIndex} className="list-disc pl-5">
            {bulletItems
              .filter((item) => item.trim())
              .map((item, itemIndex) => (
                <li key={itemIndex} className="mb-1">
                  {parseBoldText(item.trim().slice(2))} {/* Remove "- " and parse */}
                </li>
              ))}
          </ul>
        );
      }
      // Handle regular lines without bullets
      return (
        <span key={lineIndex} className="block">
          {parseBoldText(line)}
          {lineIndex < text.split("\n").length - 1 && <br />}
        </span>
      );
    });
  };

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
        {link ? (
          <Link href={link} className="text-teal-700 underline hover:text-teal-500 block">
            {text}
          </Link>
        ) : (
          renderFormattedText(text)
        )}
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