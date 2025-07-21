"use client";
import { useState, useRef } from "react";

export default function MessageInput({ onSendMessage }) {
  const [newMessage, setNewMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 shadow-lg">
      <div className="p-4">
        <form onSubmit={handleSubmit} className="relative">
          <div className={`relative flex items-end bg-gray-50 rounded-2xl border-2 transition-all duration-300 ${
            isFocused ? 'border-teal-500 shadow-lg bg-white' : 'border-gray-200 hover:border-gray-300'
          }`}>
            
            {/* Input field */}
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Type your message..."
                className="w-full p-4 pr-12 bg-transparent resize-none focus:outline-none text-gray-800 placeholder-gray-500 max-h-32 min-h-[3rem]"
                rows="1"
                style={{
                  height: 'auto',
                  minHeight: '3rem'
                }}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
                }}
              />
              
              {/* Character counter */}
              {newMessage.length > 100 && (
                <div className="absolute bottom-1 left-4 text-xs text-gray-400">
                  {newMessage.length}/500
                </div>
              )}
            </div>

            {/* Send button */}
            <div className="p-2">
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  newMessage.trim()
                    ? 'bg-gradient-to-br from-teal-600 to-teal-700 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'
                    : 'bg-teal-200 text-teal-700 cursor-not-allowed'
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 transform rotate-45"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Quick actions */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-3 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Online</span>
              </div>
              <span>•</span>
              <span>Press Enter to send</span>
            </div>
            
            {/* Emoji/attachment buttons */}
            <div className="flex items-center space-x-2">
              <button
                type="button"
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
                title="Add emoji"
              >
                <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}