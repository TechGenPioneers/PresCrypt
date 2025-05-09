"use client";
import React, { useState, useEffect, useRef } from "react";
import { Bell, Check } from "lucide-react";
import * as signalR from "@microsoft/signalr";
import { GetAllNotifications, MarkAsRead } from "../service/AdminDashboardService";
import { useMemo } from "react";


const AdminNotification = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const GetNotifications = async () => {
    try {
      const response = await GetAllNotifications();
      setNotifications(response);
      console.log("Notifications:", response);
    } catch (error) {
      console.error("Failed to get the data", error);
    }
  };

  // SignalR setup
  useEffect(() => {
    GetNotifications(); // fetch all notifications

    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7021/AdminNotificationHub") // <-- Update this
      .withAutomaticReconnect()
      .build();

    connection
      .start()
      .then(() => {
        console.log("SignalR connected");
      })
      .catch((err) => console.error("SignalR error: ", err));

    connection.on("ReceiveNotification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => {
      connection.stop();
    };
  }, []);

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

  //set the time ago format
  const timeAgo = (dateString) => {
    const now = new Date();
    const createdAt = new Date(dateString);
    const diff = (now - createdAt) / 1000; // seconds

    if (diff < 60) return `${Math.floor(diff)} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`;
    if (diff < 31536000) return `${Math.floor(diff / 2592000)} months ago`;
    return `${Math.floor(diff / 31536000)} years ago`;
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await MarkAsRead(notificationId);
  
      if (response.status === 200) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, isRead: true } : n
          )
        );
      } else {
        console.error("Failed to mark as read");
      }
    } catch (err) {
      console.error("Error marking notification as read", err);
    }
  };

  const MarkAllRead = async () => {
    try {
      // Call backend endpoint to mark all as read (make sure you create this API endpoint)
      await fetch("https://localhost:7021/api/AdminDashboard/MarkAllAsRead", {
        method: "PUT",
      });
  
      // Update local state
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true }))
      );
    } catch (error) {
      console.error("Failed to mark all notifications as read", error);
    }
  };
  
  
  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  return (
    <div className="relative">
      {/* Notification Button */}
      <div className="pb-9">
        <button
          onClick={toggleSidebar}
          className="p-3 fixed right-5 top-5 focus:outline-none cursor-pointer flex items-center bg-white shadow-lg rounded-full transition-transform hover:scale-110 z-50"
        >
          <Bell className="w-6 h-6 text-gray-700" />
          {unreadCount > 0 && (
      <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
        {unreadCount}
      </span>
    )}
        </button>
      </div>

      {/* Notification Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-16 right-0 h-[70%] w-72 sm:w-96 md:w-[28rem] lg:w-[32rem] bg-[#CEE4E6] text-[#094A4D] rounded-l-xl shadow-xl p-4 transition-all duration-500 ease-in-out transform ${
          isSidebarVisible
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0"
        } overflow-hidden z-40`}
      >
        {/* Sidebar Header */}
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h3 className="text-xl font-semibold flex items-center">
            <Bell className="w-5 h-5 mr-2" /> Notifications
          </h3>
          <div className="flex items-center space-x-3">
            <button
            onClick={MarkAllRead}
            className="text-sm text-[#094A4D] hover:underline cursor-pointer">
              Mark All Read
            </button>
            <button
              onClick={toggleSidebar}
              className="text-gray-700 text-2xl hover:text-red-600 cursor-pointer"
            >
              &times;
            </button>
          </div>
        </div>

        {/* Notification Messages */}
        <div className="space-y-3 overflow-y-auto h-[calc(100%-50px)] pr-2 scrollbar-custom">
          {notifications.length === 0 ? (
            <p className="text-center text-gray-600">
              No notifications available
            </p>
          ) : (
            notifications.map((notif, index) => (
              <div
                key={index}
                className={`p-4 rounded-2xl shadow-md border-2 ${
                  notif.isRead
                    ? "bg-gray-100 border-gray-300"
                    : "bg-[#e0f2f1] border-[#094A4D]"
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h4 className="font-semibold text-base">{notif.title}</h4>
                    <p className="text-sm text-gray-700">{notif.message}</p>
                  </div>
                  {!notif.isRead && (
                    <button
                      onClick={() => markAsRead(notif.id)}
                      className="ml-3 mt-1 hover:scale-110 cursor-pointer transition-transform"
                      title="Mark as read"
                    >
                      <Check className="w-5 h-5 text-[#094A4D]" />
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {timeAgo(notif.createdAt)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNotification;
