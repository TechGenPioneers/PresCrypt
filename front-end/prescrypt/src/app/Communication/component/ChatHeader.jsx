"use client";
import { useState, useRef, useEffect } from "react";
import { X, Video, Ban, Info } from "lucide-react";

const ChatHeader = ({
  selectedUser,
  setSelectedUser,
  onStartCall,
  onCloseChat,
  userRole,
  isCallActive,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedUser(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setSelectedUser]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  if (!selectedUser) return null;

  return (
    <div className="p-4 border-b border-gray-200 bg-white shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <div
          ref={dropdownRef}
          className="flex items-center gap-3 cursor-pointer hover:bg-emerald-100 py-1 pr-20 pl-2 rounded-md"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className="avatar w-11 h-11 rounded-full overflow-hidden ring-2 ring-emerald-200">
            <img
              src={`data:image/jpeg;base64,${selectedUser.profileImage}`
                  || "/profile.png"
              }
              alt="avatar"
            />
          </div>
          <h3 className="text-base font-semibold text-gray-800">
            {selectedUser.fullName}
          </h3>
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
        <div className="flex items-center gap-4">
          {/* Only show video call button if onStartCall is provided and user is doctor */}
          {onStartCall && userRole === "Doctor" && (
            <button
              onClick={onStartCall}
              disabled={isCallActive}
              title={isCallActive ? "Call in progress" : "Start video call"}
              className={`p-2 rounded-full transition-colors ${
                isCallActive
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-emerald-100 cursor-pointer"
              }`}
              aria-label="Start video call"
            >
              <Video className="w-6 h-6 text-emerald-700" />
            </button>
          )}
          <button
            onClick={() => setSelectedUser(null)}
            title="Close chat"
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5 text-gray-600 hover:text-red-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
