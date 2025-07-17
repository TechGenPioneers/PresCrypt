"use client";
import React, { useState, useEffect, useRef } from "react";
import { Bell, Check } from "lucide-react";
import * as signalR from "@microsoft/signalr";
import {
  GetAllNotifications,
  MarkAllAsRead,
  MarkAsRead,
} from "../service/AdminDashboardService";
import { useMemo } from "react";

const AdminNotification = () => {
  const [connection, setConnection] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  //get all notifications
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

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${process.env.NEXT_PUBLIC_API_BASE_URL}/AdminNotificationHub`, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
        logger: signalR.LogLevel.Debug,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    newConnection
      .start()
      .then(() => {
        console.log("Connected to SignalR hub");

        newConnection.on("ReceiveNotification", (msg) => {
          console.log("New Notification", msg);
          setNotifications((prev) => [
            {
              id: msg.id,
              title: msg.title,
              message: msg.message,
              date: msg.createdAt,
              isRead: false,
              type: msg.type,
              doctorId: msg.doctorId || null,
              patientId: msg.patientId || null,
              requestId: msg.requestId || null,
            },
            ...prev,
          ]);
        });
      })
      .catch((err) => console.error("SignalR connection failed:", err));

    setConnection(newConnection);

    return () => {
      newConnection.stop();
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

  //notification time based on triggered
  const timeAgo = (dateString) => {
    const now = new Date();
    const createdAt = new Date(dateString);
    const diffSeconds = Math.floor((now - createdAt) / 1000);

    const units = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
      { label: "second", seconds: 1 },
    ];

    for (const unit of units) {
      const count = Math.floor(diffSeconds / unit.seconds);
      if (count >= 1) {
        return `${count} ${unit.label}${count > 1 ? "s" : ""} ago`;
      }
    }

    return "just now";
  };

  // mark as read one notification
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

  //mark all as read
  const MarkAllRead = async () => {
    try {
      const response = await MarkAllAsRead();
      if (response.status === 200) {
        // Update local state
        setNotifications((prev) =>
          prev.map((notif) => ({ ...notif, isRead: true }))
        );
      }
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
          <Bell
            className={`w-6 h-6 text-gray-700 ${
              unreadCount > 0 ? "animate-pulse" : ""
            }`}
          />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full animate-bounce">
              {unreadCount}
            </span>
          )}
        </button>
      </div>



      {/* Notification Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed right-5 h-[70%] w-72 sm:w-96 md:w-[28rem] lg:w-[32rem] bg-[#CEE4E6] text-[#094A4D] rounded-l-xl shadow-xl p-4 transition-all duration-500 ease-in-out transform overflow-hidden z-40${
          isSidebarVisible
            ? "top-16 h-[70%] w-72 sm:w-96 md:w-[28rem] lg:w-[32rem] opacity-100 scale-100"
            : "top-5 h-12 w-12 opacity-0 scale-75"
        } overflow-hidden z-40`}
         style={{
          transformOrigin: 'top right'
        }}
      >
        {/* notification Header */}
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h3 className="text-xl font-semibold flex items-center">
            <Bell className="w-5 h-5 mr-2" /> Notifications
          </h3>
          <div className="flex items-center space-x-3">
            <button
              onClick={MarkAllRead}
              className="text-sm text-[#094A4D] hover:underline cursor-pointer"
            >
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
