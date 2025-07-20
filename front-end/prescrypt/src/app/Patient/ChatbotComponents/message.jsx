"use client";
import React from "react";
import Link from "next/link";

export default function Message({ message }) {
  const { sender, text, time, link } = message;
  const isUser = sender === "user";

  // Function to parse **bold** text into <strong> tags
  const parseBoldText = (text) => {
    return text.split(/(\*\*.*?\*\*)/g).map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index} className="font-semibold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  // Function to render text with line breaks and bullet points
  const renderFormattedText = (text) => {
    return text.split("\n").map((line, lineIndex) => {
      // Handle bullet points (- ) at the start of a line
      if (line.trim().startsWith("- ")) {
        const bulletItems = line.split(/(?=- )/);
        return (
          <ul key={lineIndex} className="list-disc pl-5 space-y-1 mt-2">
            {bulletItems
              .filter((item) => item.trim())
              .map((item, itemIndex) => (
                <li key={itemIndex} className="text-sm leading-relaxed">
                  {parseBoldText(item.trim().slice(2))}
                </li>
              ))}
          </ul>
        );
      }
      // Handle regular lines without bullets
      return (
        <span key={lineIndex} className="block leading-relaxed">
          {parseBoldText(line)}
          {lineIndex < text.split("\n").length - 1 && <br />}
        </span>
      );
    });
  };

  return (
    <div className={`mb-6 ${isUser ? "text-right" : ""} animate-fade-in`}>
      {/* Bot message header */}
      {!isUser && (
        <div className="flex items-center mb-2 text-xs text-gray-500">
          <div className="w-5 h-5 bg-gradient-to-br from-blue-300 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="font-medium ml-3 text-teal-800">Prescrypt Assistant</span>
          <span className="ml-2 text-gray-400">{time}</span>
        </div>
      )}

      {/* Message bubble */}
      <div className="flex items-end space-x-2">
  

        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} flex-1`}>
          <div
            className={`relative max-w-[85%] p-4 rounded-2xl shadow-md ${
              isUser
                ? "bg-gradient-to-br from-teal-600 to-teal-700 text-white rounded-br-md"
                : "bg-white text-gray-800 rounded-bl-md border border-gray-100 shadow-lg"
            }`}
          >
            {/* Message content */}
            {link ? (
              <Link 
                href={link} 
                className={`${isUser ? 'text-teal-100 hover:text-white' : 'text-teal-700 hover:text-teal-600'} font-medium underline decoration-2 underline-offset-2 transition-colors duration-200 flex items-center space-x-2`}
              >
                <span>{text}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
            ) : (
              <div className="text-sm leading-relaxed">
                {renderFormattedText(text)}
              </div>
            )}

            {/* Message tail */}
            <div
              className={`absolute top-4 ${
                isUser
                  ? "right-0 transform translate-x-1 w-3 h-3 bg-gradient-to-br from-teal-600 to-teal-700 rotate-45"
                  : "left-0 transform -translate-x-1 w-3 h-3 bg-white border-l border-b border-gray-100 rotate-45"
              }`}
            />
          </div>

          {/* User message timestamp */}
          {isUser && (
            <div className="flex items-center mt-1 text-xs text-gray-500 space-x-2">
              <span>{time}</span>
              <span className="font-medium">You</span>
              <div className="w-2 h-2 rounded-full bg-teal-400 flex items-center justify-center">
                
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}