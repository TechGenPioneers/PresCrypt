'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Bell } from "lucide-react";

const AdminNotification = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const sidebarRef = useRef(null); // Ref for the sidebar

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  // Close sidebar on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setIsSidebarVisible(false);
      }
    };

    if (isSidebarVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarVisible]);

  return (
    <div className="relative">
      {/* Notification Button */}
      <div className="pb-9">
        <button
          onClick={toggleSidebar}
          className="p-3 fixed right-5 top-5 focus:outline-none cursor-pointer flex items-center bg-white shadow-lg rounded-full transition-transform transform hover:scale-110"
        >
          <Bell className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* Notification Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-16 right-0 h-[70%] bg-[#CEE4E6] text-[#094A4D] w-64 sm:w-1/2 md:w-1/3 lg:w-1/4 rounded-lg shadow-lg p-5 transition-all duration-500 ease-in-out transform ${
          isSidebarVisible
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold flex items-center">
            <Bell className="w-5 h-5 mr-2" /> Notifications
          </h3>

          <div className="flex items-center space-x-2">
            <button className="cursor-pointer hover:underline">Mark as Read</button>
            <button
              onClick={toggleSidebar}
             className="text-gray-700 text-3xl cursor-pointer hover:text-red-500"
            >
               &times;
            </button>
          </div>
        </div>

        {/* Notification Messages */}
        <div className="space-y-3">
          <p className="bg-gray-100 text-gray-800 p-2 rounded-2xl shadow border-2 border-gray-400">
            New patient - Nimal Perera registered
          </p>
          <p className="bg-gray-100 text-gray-800 p-3 rounded-2xl shadow border-2 border-gray-400">
            New sign-up from doctor - Hiruni Perera
          </p>
          <p className="bg-gray-100 text-gray-800 p-3 rounded-2xl shadow border-2 border-gray-400">
            Usage reports available for last month
          </p>
          <p className="bg-gray-100 text-gray-800 p-3 rounded-2xl shadow border-2 border-gray-400">
            New sign-up from doctor - Sunil Perera
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminNotification;
