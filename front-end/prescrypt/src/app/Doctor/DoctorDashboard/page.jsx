"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import DateTimeDisplay from "../DoctorComponents/DateTimeDisplay";
import PageHeaderDisplay from "../DoctorComponents/PageHeaderDisplay";
import DoctorDashboardService from "../services/DoctorDashboardService";
import { Search, CalendarDays } from "lucide-react";
import Link from "next/link";
import useAuthGuard from "@/utils/useAuthGuard";

export default function Dashboard() {
  useAuthGuard("Doctor");
  const Title = "Dashboard";
  const [doctorId, setDoctorId] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const [profile, setProfile] = useState({ name: "", doctorImage: "" });
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    upcomingAppointments: 0,
    cancelledAppointments: 0,
    bookedPatients: 0,
    hospitalAppointments: [],
    notifications: [],
    isLoading: true,
    error: null,
  });

  const connectionRef = useRef(null);
  const notificationsContainerRef = useRef(null);
  const bellRef = useRef(null);

  // Initialize client-side data and fetch immediately
  useEffect(() => {
    const loadData = async () => {
      setIsClient(true);
      const storedDoctorId = localStorage.getItem("doctorId");

      if (storedDoctorId) {
        setDoctorId(storedDoctorId);
        try {
          // Initial load
          await Promise.all([
            fetchProfileData(storedDoctorId),
            fetchDashboardData(storedDoctorId),
          ]);

          // Hidden refresh after initial load
          setIsRefreshing(true); // Indicate refresh is happening
          await fetchDashboardData(storedDoctorId); // Second fetch for "hidden" refresh
          setIsRefreshing(false); // End refresh
          setInitialLoadComplete(true);

          // Set up auto-refresh every 30 seconds
          const refreshInterval = setInterval(() => {
            fetchDashboardData(storedDoctorId);
          }, 30000);

          return () => clearInterval(refreshInterval);
        } catch (error) {
          console.error("Initial load or refresh error:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    loadData();
  }, []); // Empty dependency array means this runs once on mount

  const formatNotificationTime = useCallback((date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInSeconds = Math.floor((now - notificationDate) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const notificationDay = new Date(
      notificationDate.getFullYear(),
      notificationDate.getMonth(),
      notificationDate.getDate()
    );

    if (notificationDay.getTime() === today.getTime()) {
      return "Today";
    } else if (notificationDay.getTime() === yesterday.getTime()) {
      return "Yesterday";
    } else {
      return notificationDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year:
          notificationDate.getFullYear() !== now.getFullYear()
            ? "numeric"
            : undefined,
      });
    }
  }, []);

  const fetchProfileData = useCallback(async (currentDoctorId) => {
    if (!currentDoctorId) return;

    try {
      const res = await DoctorDashboardService.getProfile(currentDoctorId);
      setProfile(res || { name: "", doctorImage: "" });
    } catch (err) {
      console.error("Profile fetch error:", err);
    }
  }, []);

  const fetchDashboardData = useCallback(
    async (currentDoctorId) => {
      if (!currentDoctorId) return;

      // Only set isLoading to true if it's the *initial* load, not for subsequent auto-refreshes or hidden refreshes
      // The initial useEffect handles its own isLoading state.
      // For subsequent calls, we rely on isRefreshing for the button spinner.

      try {
        const [stats, notifications] = await Promise.all([
          DoctorDashboardService.getDashboardStats(currentDoctorId),
          DoctorDashboardService.getNotifications(currentDoctorId),
        ]);

        setDashboardData((prev) => ({
          ...prev,
          upcomingAppointments: stats.upcomingAppointments || 0,
          cancelledAppointments: stats.cancelledAppointments || 0,
          bookedPatients: stats.bookedPatients || 0,
          hospitalAppointments: stats.hospitalAppointments || [],
          notifications:
            notifications.map((n) => ({
              ...n,
              createdAt: new Date(n.createdAt),
              formattedTime: formatNotificationTime(new Date(n.createdAt)),
            })) || [],
          isLoading: false, // Ensure isLoading is set to false after data is fetched
          error: null,
        }));
      } catch (error) {
        console.error("API Error:", error);
        setDashboardData((prev) => ({
          ...prev,
          error: "Failed to fetch dashboard data",
          isLoading: false,
        }));
      }
    },
    [formatNotificationTime]
  );

  const markAsRead = async (notificationId) => {
    try {
      await DoctorDashboardService.markNotificationAsRead(notificationId);
      setDashboardData((prev) => ({
        ...prev,
        notifications: prev.notifications.map((n) =>
          n.id === notificationId ? { ...n, isRead: true } : n
        ),
      }));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const removeNotification = async (notificationId) => {
    try {
      setDashboardData((prev) => ({
        ...prev,
        notifications: prev.notifications.filter(
          (n) => n.id !== notificationId
        ),
      }));
      await DoctorDashboardService.deleteNotification(notificationId);
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const handleRefresh = async () => {
    if (!doctorId) return;

    try {
      setIsRefreshing(true);
      setShowAllNotifications(false);
      await Promise.all([
        fetchDashboardData(doctorId),
        fetchProfileData(doctorId),
      ]);
    } finally {
      setIsRefreshing(false);
    }

    if (connectionRef.current && connectionStatus !== "connected") {
      connectionRef.current.start().catch((err) => {
        console.error("Reconnection failed:", err);
      });
    }
  };

  // Click outside handler for notification dialog
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  // SignalR connection setup
  useEffect(() => {
    if (!isClient || !doctorId) return;

    const connection = DoctorDashboardService.createDoctorSignalRConnection();

    connection.on("ReceiveNotification", (notification) => {
      if (!notification) return;

      const newNotification = {
        id: notification.id || Date.now().toString(),
        title: notification.title || "New Notification",
        message: notification.message,
        type: notification.type || "General",
        isRead: false,
        createdAt: notification.createdAt
          ? new Date(notification.createdAt)
          : new Date(),
        formattedTime: formatNotificationTime(
          notification.createdAt ? new Date(notification.createdAt) : new Date()
        ),
      };

      setDashboardData((prev) => ({
        ...prev,
        notifications: [newNotification, ...prev.notifications],
      }));
    });

    connection.onreconnecting((error) => {
      console.log("Connection reconnecting:", error);
      setConnectionStatus("reconnecting");
    });

    const startConnection = async () => {
      try {
        setConnectionStatus("connecting");
        await connection.start();
        await connection.invoke("JoinDoctorGroup", doctorId);
        setConnectionStatus("connected");
        connectionRef.current = connection;
      } catch (err) {
        console.error("Connection failed:", err);
        setConnectionStatus("failed");
        setTimeout(startConnection, 5000);
      }
    };

    startConnection();

    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop();
      }
    };
  }, [isClient, doctorId, formatNotificationTime]);

  // Network and visibility event handlers
  useEffect(() => {
    if (!isClient) return;

    const handleOnline = () => {
      if (connectionStatus !== "connected" && connectionRef.current) {
        connectionRef.current.start().catch((err) => {
          console.error("Reconnection failed:", err);
        });
      }
    };

    const handleVisibilityChange = () => {
      if (
        document.visibilityState === "visible" &&
        connectionStatus !== "connected" &&
        connectionRef.current
      ) {
        connectionRef.current.start().catch((err) => {
          console.error("Reconnection failed:", err);
        });
      }
    };

    window.addEventListener("online", handleOnline);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("online", handleOnline);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isClient, connectionStatus]);

  const DoctorProfileSkeleton = () => (
    <div className="bg-teal-50 rounded-3xl shadow-lg p-6 animate-pulse">
      <div className="flex items-center">
        <div className="w-24 h-24 bg-teal-50 rounded-full mr-6"></div>
        <div>
          <div className="h-6 bg-teal-100 rounded-lg w-48 mb-2"></div>
          <div className="h-4 bg-teal-100 rounded-lg w-32"></div>
        </div>
      </div>
    </div>
  );

  const unreadCount = dashboardData.notifications.filter(
    (n) => !n.isRead
  ).length;

  if (!isClient || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-teal-500 border-dashed rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-semibold">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-grow">
      <div className="flex-grow min-h-screen">
        <div className="p-2 flex flex-col lg:flex-row">
          {/* Left Column */}
          <div className="lg:w-2/3">
            <div className="bg-white min-h-screen">
              <div className="flex justify-between items-center p-1">
                <PageHeaderDisplay title={Title} />
                <div className="flex items-center space-x-2">
                  {initialLoadComplete && (
                    <button
                      onClick={handleRefresh}
                      disabled={isRefreshing}
                      className="p-2 text-teal-600 hover:text-teal-800 hover:bg-teal-50 rounded-full transition-all"
                      title="Refresh Data"
                    >
                      {isRefreshing ? (
                        <svg
                          className="w-5 h-5 animate-spin"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                      )}
                    </button>
                  )}
                  <div className="relative" ref={bellRef}>
                    <button
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="relative p-3 hover:bg-gray-50 rounded-full transition-all duration-200 border border-gray-200 hover:border-teal-300"
                    >
                      <svg
                        className="w-6 h-6 text-gray-600 hover:text-teal-500 transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 17h5l-3.5-3.5a5.46 5.46 0 01-.65-2.5A4.5 4.5 0 0012 6.5a4.5 4.5 0 00-3.85 4c-.35.85-.65 1.65-.65 2.5L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                      </svg>
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[1.2rem] h-5 flex items-center justify-center animate-pulse">
                          {unreadCount}
                        </span>
                      )}
                    </button>

                    {showNotifications && (
                      <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-hidden">
                        <div className="p-4 border-b border-gray-100">
                          <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-gray-800">
                              Notifications
                            </h3>
                          </div>
                        </div>

                        <div className="max-h-80 overflow-y-auto">
                          {dashboardData.notifications.length === 0 ? (
                            <div className="p-6 text-center">
                              <svg
                                className="w-12 h-12 text-gray-300 mx-auto mb-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M15 17h5l-3.5-3.5a5.46 5.46 0 01-.65-2.5A4.5 4.5 0 0012 6.5a4.5 4.5 0 00-3.85 4c-.35.85-.65 1.65-.65 2.5L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                />
                              </svg>
                              <p className="text-gray-500 text-sm">
                                No new notifications
                              </p>
                            </div>
                          ) : (
                            <div className="divide-y divide-gray-100">
                              {dashboardData.notifications
                                .slice(0, showAllNotifications ? undefined : 5)
                                .map((notification) => (
                                  <div
                                    key={notification.id}
                                    className={`p-4 hover:bg-gray-50 transition-colors ${
                                      !notification.isRead ? "bg-teal-50/30" : ""
                                    }`}
                                  >
                                    <div className="flex justify-between items-start">
                                      <div className="flex-1 min-w-0 pr-2">
                                        <div className="flex items-start justify-between mb-1">
                                          <h4 className="text-sm font-medium text-gray-800 truncate">
                                            {notification.title}
                                          </h4>
                                          {!notification.isRead && (
                                            <div className="w-2 h-2 bg-teal-500 rounded-full flex-shrink-0 ml-2 mt-1"></div>
                                          )}
                                        </div>
                                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                                          {notification.message}
                                        </p>
                                        <div className="flex justify-between items-center">
                                          <span className="text-xs text-gray-400">
                                            {notification.formattedTime}
                                          </span>
                                          <div className="flex space-x-1">
                                            {!notification.isRead && (
                                              <button
                                                onClick={() =>
                                                  markAsRead(notification.id)
                                                }
                                                className="text-xs text-teal-500 hover:text-teal-800 px-2 py-1 rounded hover:bg-teal-100 transition-all duration-200"
                                              >
                                                ✓
                                              </button>
                                            )}
                                            <button
                                              onClick={() =>
                                                removeNotification(
                                                  notification.id
                                                )
                                              }
                                              className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-100 transition-all duration-200"
                                            >
                                              ✕
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>

                        {dashboardData.notifications.length > 5 && (
                          <div className="p-3 border-t border-gray-100 bg-gray-50">
                            <button
                              onClick={() =>
                                setShowAllNotifications(!showAllNotifications)
                              }
                              className="w-full text-center text-sm text-teal-500 hover:text-teal-800 font-medium py-1 hover:bg-teal-100 rounded transition-all duration-200"
                            >
                              {showAllNotifications
                                ? "Show Less"
                                : `View All (${dashboardData.notifications.length})`}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-8">
                {profile.name ? (
                  <div className="bg-gradient-to-r from-teal-50 via-teal-50 to-teal-50 rounded-3xl shadow-xl p-6 border border-teal-100 backdrop-blur-sm">
                    <div className="flex items-center">
                      <div className="relative">
                        <img
                          src={
                            profile.doctorImage
                              ? `data:image/jpeg;base64,${profile.doctorImage}`
                              : "/default-doctor.png"
                          }
                          alt="Doctor"
                          className="w-24 h-24 rounded-full mr-6 object-cover border-4 border-white shadow-lg"
                        />
                      </div>
                      <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                          Welcome,{" "}
                          <span className="bg-gradient-to-r from-teal-500 to-teal-700 bg-clip-text text-transparent">
                            Dr. {profile.name}
                          </span>
                        </h1>
                        <p className="text-lg font-medium text-gray-600 mt-1">
                          Have a productive day at work! 🩺
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <DoctorProfileSkeleton />
                )}

                <div className="grid grid-cols-2 gap-8 mt-8">
                  <div className="bg-gradient-to-br from-white to-teal-50 p-6 rounded-3xl shadow-xl border border-teal-100 hover:shadow-2xl transition-all duration-300">
                    <div className="flex items-center mb-2">
                      <div className="p-3 bg-gradient-to-r from-teal-500 to-teal-500 rounded-2xl">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <p className="text-xl font-bold text-gray-700 ml-4">
                        Upcoming Appointments
                      </p>
                    </div>
                    <p className="text-5xl font-black text-teal-500 mb-2">
                      {dashboardData.upcomingAppointments}
                    </p>
                    <p className="text-sm text-gray-500 font-medium">Today</p>
                  </div>

                  <div className="bg-gradient-to-br from-white to-teal-50 p-6 rounded-3xl shadow-xl border border-teal-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer group">
                    <div className="flex items-center justify-center h-full">
                      <div className="flex items-center">
                        <div className="p-4 bg-gradient-to-r from-teal-500 to-teal-500 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                          <CalendarDays className="text-white" />
                        </div>
                        <Link href="/Doctor/DoctorAppointments">
                          <p className="text-xl font-bold text-gray-700 ml-6 group-hover:text-teal-700 transition-colors">
                            View Appointments
                          </p>
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-white to-red-50 p-6 rounded-3xl shadow-xl border border-red-100 hover:shadow-2xl transition-all duration-300">
                    <div className="flex items-center mb-2">
                      <div className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </div>
                      <p className="text-xl font-bold text-gray-700 ml-4">
                        Cancelled Appointments
                      </p>
                    </div>
                    <p className="text-5xl font-black text-red-500 mb-2">
                      {dashboardData.cancelledAppointments}
                    </p>
                    <p className="text-sm text-gray-500 font-medium">Today</p>
                  </div>

                  <div className="bg-gradient-to-br from-white to-teal-50 p-6 rounded-3xl shadow-xl border border-teal-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer group">
                    <div className="flex items-center justify-center h-full">
                      <div className="flex items-center">
                        <div className="p-4 bg-gradient-to-r from-teal-500 to-teal-500 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                          <Search className="text-white" />
                        </div>
                        <Link href="/Doctor/DoctorPatients">
                          <p className="text-xl font-bold text-gray-700 ml-6 group-hover:text-teal-700 transition-colors">
                            Search Patients
                          </p>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/3 relative">
            <div className="bg-gradient-to-b from-gray-50 to-white p-6 min-h-screen flex flex-col">
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-2xl shadow-lg border border-blue-100">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-gradient-to-r from-teal-500 to-teal-500 rounded-xl">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                    <h3 className="font-bold text-lg text-gray-800 ml-3">
                      Hospital Coverage
                    </h3>
                  </div>

                  {dashboardData.hospitalAppointments &&
                  dashboardData.hospitalAppointments.length > 0 ? (
                    <div className="space-y-3">
                      <div className="text-center mb-4">
                        <p className="text-4xl text-teal-500 font-black">
                          {dashboardData.hospitalAppointments.length}
                        </p>
                        <p className="text-sm text-gray-600 font-medium">
                          Active Hospitals
                        </p>
                      </div>
                      <div className="max-h-32 overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-teal-300">
                        {dashboardData.hospitalAppointments.map(
                          (hospital, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between py-2 px-3 bg-white rounded-lg mb-2 shadow-sm"
                            >
                              <span className="text-sm font-medium text-gray-700 truncate">
                                {hospital.hospitalName ||
                                  hospital.name ||
                                  "Hospital"}
                              </span>
                              <span className="text-xs text-teal-650 bg-blue-50 px-2 py-1 rounded-full font-bold">
                                {hospital.appointmentCount ||
                                  hospital.patientCount ||
                                  0}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-500 text-sm">
                        No hospital appointments found.
                      </p>
                    </div>
                  )}
                </div>

                <div className="bg-gradient-to-br from-white to-teal-50 p-6 rounded-2xl shadow-lg border border-teal-100">
                  <div className="flex justify-center mb-4">
                    <img
                      src="/image31.png"
                      alt="Health"
                      className="w-20 h-20 opacity-80"
                    />
                  </div>

                  <div className="text-center">
                    <div className="bg-gradient-to-r from-teal-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg">
                      <p className="text-lg font-bold mb-2">Total Patients</p>
                      <p className="text-4xl font-black">
                        {dashboardData.bookedPatients}
                      </p>
                      <p className="text-sm opacity-90 mt-1">Under your care</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DateTimeDisplay />
    </div>
  );
}