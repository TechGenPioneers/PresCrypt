"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import DateTimeDisplay from "../DoctorComponents/DateTimeDisplay";
import DoctorDashboardService from "../services/DoctorDashboardService";
import Link from "next/link";
import useAuthGuard from "@/utils/useAuthGuard";

export default function Dashboard() {
  useAuthGuard("Doctor");
  const Title = "Dashboard";
  const doctorId =
    typeof window !== "undefined" ? localStorage.getItem("doctorId") : null;

  const [profile, setProfile] = useState({ name: "", doctorImage: "" });
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    upcomingAppointments: 0,
    cancelledAppointments: 0,
    bookedPatients: 0,
    notifications: [],
    isLoading: true,
    error: null,
  });

  const connectionRef = useRef(null);
  const notificationsContainerRef = useRef(null);

  const formatNotificationTime = useCallback((date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const notificationDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    if (notificationDate.getTime() === today.getTime()) {
      return "Today";
    } else if (notificationDate.getTime() === yesterday.getTime()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });
    }
  }, []);

  const fetchProfileData = useCallback(async (currentDoctorId) => {
    try {
      const res = await DoctorDashboardService.getProfile(currentDoctorId);
      setProfile(res || { name: "", doctorImage: "" });
    } catch (err) {
      console.error("Profile fetch error:", err);
    }
  }, []);

  const fetchDashboardData = useCallback(
    async (currentDoctorId) => {
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
          notifications:
            notifications.map((n) => ({
              ...n,
              createdAt: new Date(n.createdAt),
              formattedTime: formatNotificationTime(new Date(n.createdAt)),
            })) || [],
        }));
      } catch (error) {
        console.error("API Error:", error);
        setDashboardData((prev) => ({
          ...prev,
          error: "Failed to fetch dashboard data",
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

  const handleRefresh = () => {
    setShowAllNotifications(false);
    fetchDashboardData(doctorId);
    fetchProfileData(doctorId);

    if (connectionRef.current && connectionStatus !== "connected") {
      connectionRef.current.start().catch((err) => {
        console.error("Reconnection failed:", err);
      });
    }
  };

  useEffect(() => {
    if (!doctorId) return;

    fetchProfileData(doctorId);
    fetchDashboardData(doctorId);
  }, [doctorId, fetchDashboardData, fetchProfileData]);

  useEffect(() => {
    if (!doctorId) return;

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
  }, [doctorId, formatNotificationTime]);

  useEffect(() => {
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
  }, [connectionStatus]);

  return (
    <div className="flex flex-grow">
      <div className="flex-grow  min-h-screen">
        <div className="p-2 flex flex-col lg:flex-row">
          {/* Left Column */}
          <div className="lg:w-2/3">
            <div className="bg-white min-h-screen">
              <DateTimeDisplay title={Title} />
              <div className="p-8">
                {/* Welcome Card */}
                <div className="bg-[#E9FAF2] rounded-[20px] shadow-lg p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={
                        profile.doctorImage
                          ? `data:image/jpeg;base64,${profile.doctorImage}`
                          : "/default-doctor.png"
                      }
                      alt="Doctor"
                      className="w-30 h-auto rounded-full mr-6 object-cover"
                    />
                    <div>
                      <h1 className="text-2xl font-semibold text-gray-800">
                        Welcome,{" "}
                        <span className="text-[#117F8B]">
                          Dr. {profile.name}
                        </span>
                      </h1>
                      <p className="text-base font-normal text-gray-600">
                        Have a nice day at work!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-6 mt-6">
                  <div className="bg-[#E9FAF2] p-6 rounded-[20px] shadow-lg">
                    <p className="text-lg font-semibold">
                      Upcoming Appointments
                    </p>
                    <p className="text-4xl font-bold mt-2 text-[#117F8B]">
                      {dashboardData.upcomingAppointments}
                    </p>
                  </div>

                  <div className="bg-[#E9FAF2] p-6 rounded-[20px] shadow-lg flex items-center justify-center transition hover:bg-[#D4E9EA] cursor-pointer">
                    <img
                      src="/image29.png"
                      className="lg:w-20 w-12 h-auto mr-5"
                      alt="Calendar"
                    />
                    <Link href="/Doctor/DoctorAppointments">
                      <p className="text-lg font-semibold">View Appointments</p>
                    </Link>
                  </div>

                  <div className="bg-[#E9FAF2] p-6 rounded-[20px] shadow-lg">
                    <p className="text-lg font-semibold">
                      Cancelled Appointments
                    </p>
                    <p className="text-4xl font-bold mt-2 text-red-500">
                      {dashboardData.cancelledAppointments}
                    </p>
                    <p className="text-sm text-gray-500">Today</p>
                  </div>

                  <div className="bg-[#E9FAF2] p-6 rounded-[20px] shadow-lg flex items-center justify-center transition hover:bg-[#D4E9EA] cursor-pointer">
                    <img
                      src="/image30.png"
                      className="lg:w-20 w-12 h-auto mr-5"
                      alt="Search"
                    />
                    <Link href="/Doctor/DoctorPatients">
                      <p className="text-lg font-semibold">Search Patients</p>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Notifications */}
          <div className="lg:w-1/3">
            <div className="bg-white p-6 min-h-screen flex flex-col">
              {/* Notifications Section */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold text-xl">Notifications</h2>
                  <button
                    onClick={handleRefresh}
                    className="text-sm text-[#117F8B] hover:text-[#094A4D] flex items-center cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Refresh
                  </button>
                </div>

                {dashboardData.notifications.length === 0 ? (
                  <div className="text-center p-8">
                    <p className="text-gray-500">No new notifications</p>
                  </div>
                ) : (
                  <div className="relative">
                    <div
                      ref={notificationsContainerRef}
                      className={`space-y-2 overflow-y-auto pr-2 ${
                        showAllNotifications ? "h-[400px]" : "h-[285px]"
                      }`}
                    >
                      {dashboardData.notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`bg-[#F3F4F6] p-2 rounded-[12px] shadow-sm border-l-4 ${
                            notification.isRead
                              ? "border-gray-300"
                              : "border-[#117F8B]"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                <p className="font-medium text-gray-800 truncate">
                                  {notification.title}
                                </p>
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-[#117F8B] whitespace-nowrap">
                                    {notification.formattedTime} at{" "}
                                    {notification.createdAt.toLocaleTimeString(
                                      "en-US",
                                      {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true,
                                      }
                                    )}
                                  </span>
                                  <button
                                    onClick={() =>
                                      removeNotification(notification.id)
                                    }
                                    className="text-[#117F8B] hover:text-[#094A4D] cursor-pointer"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-4 w-4"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                              <div className="flex flex-col">
                                <p className="text-sm text-gray-600 whitespace-pre-wrap break-words">
                                  {notification.message}
                                </p>
                                {!notification.isRead && (
                                  <button
                                    onClick={() => markAsRead(notification.id)}
                                    className="text-xs text-[#117F8B] hover:text-[#094A4D] self-end cursor-pointer"
                                  >
                                    Mark as read
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Patient Stats Section */}
              <div className="">
                <div className="items-center max-w-3xl mx-auto">
                  {/* Image - spans both rows */}
                  <div className="row-span-2 flex mb-2 justify-center items-center">
                    <img
                      src="/image31.png"
                      alt="Health"
                      className="w-50 h-auto"
                    />
                  </div>

                  {/* Centered Total Patients Card */}
                  <div className="flex justify-center">
                    <div className="bg-[#E9FAF2] rounded-xl p-4 shadow-lg w-50 justify-center items-center">
                      <p className="text-md font-medium mb-2 items-center">
                        Total No of Patients
                      </p>
                      <p className="text-3xl font-bold text-[#117F8B]">
                        {dashboardData.bookedPatients}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
