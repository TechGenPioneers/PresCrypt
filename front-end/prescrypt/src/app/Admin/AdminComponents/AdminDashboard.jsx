"use client";
import React from "react";
import { Bell, UserPlus, Search } from "lucide-react";
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { day: "Mon", total: 50, completed: 45, missed: 5 },
  { day: "Tue", total: 65, completed: 55, missed: 10 },
  { day: "Wed", total: 85, completed: 70, missed: 15 },
  { day: "Thu", total: 90, completed: 80, missed: 10 },
  { day: "Fri", total: 75, completed: 60, missed: 15 },
  { day: "Sat", total: 50, completed: 40, missed: 10 },
  { day: "Sun", total: 30, completed: 25, missed: 5 },
];

const AdminDashboard = () => {
  const [dateTime, setDateTime] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  // Toggle function to show or hide the Notification bar
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  useEffect(() => {
    const updateDateTime = () => {
      setDateTime(new Date());
    };

    updateDateTime(); // Set initial value
    const interval = setInterval(updateDateTime, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  if (!dateTime) return null; // Prevent SSR mismatch

  // Formatting date as "Wednesday 5 March 2025"
  const formattedDate = dateTime.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Formatting time as "11:15 AM"
  const formattedTime = dateTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  return (
    <>
      <div className="flex min-h-screen bg-white">
        <div className="border-5 border-[#E9FAF2]"></div>
        {/* Main Content */}
        <main className="overflow-auto flex-grow p-6 ml-5">
          <div className="mb-10 pl-5 ml-5">
            <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
            <p className="text-gray-500">{formattedDate}</p>
          </div>
          {/* Welcome Section */}
          <div className="bg-[#E9FAF2] p-6 rounded-4xl mb-6 ml-10">
            <h3 className="text-2xl text-[#094A4D] font-semibold ">
              Welcome, Nimal
            </h3>
            <p className="text-[#094A4D]">Have a nice day at work!</p>
          </div>

          {/* Search & Add Doctor */}
          <div className="grid grid-cols-2 ml-10 gap-20 mb-6 ">
            <button className="flex items-center cursor-pointer justify-center bg-[#E9FAF2] p-5 rounded-lg shadow-[0px_2px_4px_rgba(0,0,0,0.5)] hover:bg-gray-100 transition">
              <img src="image22.png" className="w-6 h-6 mr-2 text-[#006369] " />
              Search Patients
            </button>
            <button className="flex items-center cursor-pointer justify-center bg-[#E9FAF2] p-5 rounded-lg shadow-[0px_2px_4px_rgba(0,0,0,0.5)] hover:bg-gray-100 transition">
              <img src="image21.png" className="w-6 h-6 mr-2 text-[#006369]" />
              Add New Doctor
            </button>
          </div>

          {/* Stats & Chart */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="flex text-[#094A4D] bg-[#E9FAF2] p-6 rounded-lg shadow-[0px_10px_5px_rgba(0,0,0,0.5)] m-10">
                <img src="image12.png" alt="icon" className="w-18 h-18 mr-2 mt-2" />
                <div className="ml-5">
                  <h4 className="text-xl font-semibold">Patient Visits</h4>
                  <p className="text-3xl font-bold mt-2">20</p>
                  <p className="text-[#094A4D]">15, July 2024</p>
                </div>
              </div>

              <div className="flex text-[#094A4D] bg-[#E9FAF2] p-6 rounded-lg shadow-[0px_10px_5px_rgba(0,0,0,0.5)] m-10">
                <img src="image26.png" alt="icon" className="w-18 h-18 mr-2 mt-2" />
                <div className="ml-5">
                <h4 className="text-xl font-semibold">Appointments</h4>
                <p className="text-3xl font-bold mt-2">20</p>
                <p className="text-[#094A4D]">15, July 2024</p>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white text-[#094A4D] p-6 rounded-lg shadow-md w-full h-[300px] md:h-[400px] lg:h-[500px]">
              <h4 className="text-xl font-semibold mb-4">
                Appointments Over Time
              </h4>
              <ResponsiveContainer width="100%" height="80%">
                <LineChart data={data}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#8884d8"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    stroke="#4CAF50"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="missed"
                    stroke="#FF0000"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </main>

        {/* Notifications */}
        {/* Button to toggle the Notification Bar */}
        <aside className="w-100 bg-[#CEE4E6] p-5 shadow-md relative">
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
                <button
                  onClick={toggleSidebar}
                  className="text-gray-700 text-lg cursor-pointer"
                >
                  ✖
                </button>
              </div>

              {/* Notification Messages */}
              <div className="space-y-3">
                <p className="bg-gray-100 text-gray-800 p-2 rounded-2xl shadow border-2 border-gray-400 justify-center">
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

          {/* Total Counts */}
          <div className="mt-15 p-7 bg-white">
            <img src="/image23.png" alt="image" />
            <div className="flex mt-15 bg-[#E9FAF2] p-4 rounded-lg mb-4 text-[#094A4D] shadow-[0px_10px_5px_rgba(0,0,0,0.5)]">
              <img
                src="/image19.png"
                alt="icon"
                className="w-10 h-12 mr-2 mt-2"
              />
              <div className=" pl-5">
                <h4 className="text-lg font-semibold">Total Doctors</h4>
                <p className="text-3xl font-bold">07</p>
              </div>
            </div>

            <div className="flex mt-15 bg-[#E9FAF2] p-4 rounded-lg text-[#094A4D] shadow-[0px_10px_5px_rgba(0,0,0,0.5)]">
              <img
                src="/image25.png"
                alt="icon"
                className="w-10 h-12 mr-2 mt-2"
              />
              <div className=" pl-5">
                <h4 className="text-lg font-semibold">Total Patients</h4>
                <p className="text-3xl font-bold">50</p>
              </div>
            </div>
            {/* Date & Time */}
            <div className="mt-15 text-center text-[#094A4D]">
              <p>{formattedDate}</p>
              <p>{formattedTime}</p>
            </div>
          </div>
        </aside>
      </div>
      <div className="border-5 border-[#E9FAF2]"></div>
    </>
  );
};

export default AdminDashboard;
