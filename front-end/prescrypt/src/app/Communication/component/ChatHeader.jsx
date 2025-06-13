"use client";

import { X, Video, Ban, Info } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const ChatHeader = ({ selectedUser, setSelectedUser }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const startCall = () => {
    console.log("Starting video call with", selectedUser.fullName);
  };

  // Handle Esc key press to close chat
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedUser(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setSelectedUser]);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  if (!selectedUser) return null;

  return (
    <div className="p-4 border-b border-gray-200 bg-white shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 relative" ref={dropdownRef}>
          <div
            className="flex items-center gap-3 cursor-pointer hover:bg-emerald-100  py-1 pr-20 pl-2 rounded-md transition-colors duration-200"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className="relative">
              <div className="avatar">
                <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-emerald-200">
                  <img
                    src={selectedUser.profilePic || "profile.png"}
                    alt={selectedUser.fullName}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-800">
                {selectedUser.fullName}
              </h3>
            </div>
          </div>

          {menuOpen && (
            <ul className="absolute top-14 z-20 w-48 rounded-md border bg-white p-2 shadow-xl space-y-1">
              <li>
                <button className="w-full flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-100 p-2 rounded-md transition">
                  <Info /> info
                </button>
              </li>
              <li>
                <button className="w-full flex items-center gap-2 text-sm text-red-600 hover:bg-red-50 p-2 rounded-md transition">
                  <Ban /> block
                </button>
              </li>
            </ul>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={startCall}
            title="Start video call"
            className="p-2 rounded-full hover:bg-emerald-100 transition"
          >
            <Video className="w-6 h-6 text-emerald-700 cursor-pointer" />
          </button>
          <button
            onClick={() => setSelectedUser(null)}
            title="Close chat"
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5 text-gray-600 hover:text-red-500 cursor-pointer" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
