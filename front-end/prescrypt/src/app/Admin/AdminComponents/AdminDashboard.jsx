"use client";
import React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
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
import AdminNotification from "./AdminNotification";
import { GetAllDashboardData } from "../service/AdminDashboardService";

const AdminDashboard = () => {
  const [dateTime, setDateTime] = useState(null);
  const [dashboardData, setDashboardData] = useState([]);

  const getDashboardData = async () => {
    try {
      const response = await GetAllDashboardData();
      setDashboardData(response);
    } catch (error) {
      console.error("Failed to get the data", error);
    }
  };

  const getLast7DaysInOrder = () => {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const today = new Date();
    const order = [];

    for (let i = 7; i >= 1; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      order.push(daysOfWeek[d.getDay()]);
    }

    return order; // From last week same day to yesterday
  };

  useEffect(() => {
    const updateDateTime = () => {
      setDateTime(new Date());
    };

    getDashboardData(); // Fetch dashboard data

    updateDateTime(); // Set initial value
    const interval = setInterval(updateDateTime, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  // Sort appointments over time based on the last 7 days
  const sortAppointmentsOverTime = (data) => {
    const daysOrder = getLast7DaysInOrder(); // Get dynamic order
    if (!Array.isArray(data)) return []; // Handle undefined or invalid data

    return [...data].sort(
      (a, b) => daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day)
    );
  };
  // Sort the appointments data
  const sortedAppointmentsData = sortAppointmentsOverTime(
    dashboardData?.appointmentsOverTime
  );

  if (!dateTime) return null; // Prevent SSR mismatch

  // Formatting date as "Wednesday 5 March 2025"
  const formattedDate = dateTime.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const todayDate = dateTime.toLocaleDateString("en-GB", {
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
      <div className="flex min-h-screen bg-white border-15 border-[#E9FAF2]">
        {/* Main Content */}
        <main className="overflow-auto flex-grow p-6">
          <div className="mb-10 pl-5 ">
            <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
            <p className="text-gray-500">{formattedDate}</p>
          </div>
          {/* Welcome Section */}
          <div className="bg-[#E9FAF2] p-6 rounded-4xl mb-6">
            <h3 className="text-2xl text-[#094A4D] font-semibold ">
              Welcome, Nimal
            </h3>
            <p className="text-[#094A4D]">Have a nice day at work!</p>
          </div>

          {/* Search & Add Doctor */}
          <div className="grid grid-cols-2 ml-10 gap-20 mb-6 ">
            <button className="flex items-center cursor-pointer justify-center bg-[#E9FAF2] p-5 rounded-lg shadow-[0px_2px_4px_rgba(0,0,0,0.5)] hover:bg-gray-100 transition">
            <Link href={`/Admin/AdminPatient`}>
              <img
                src="/image22.png"
                className="w-6 h-6 mr-2 text-[#006369] "
              />
              Search Patients
              </Link>
            </button>
            <button className="flex items-center cursor-pointer justify-center bg-[#E9FAF2] p-5 rounded-lg shadow-[0px_2px_4px_rgba(0,0,0,0.5)] hover:bg-gray-100 transition">
              <img src="/image27.png" className="w-6 h-6 mr-2 text-[#006369]" />
              <Link href={`/Admin/DoctorRequestPage`}>
              Doctor Request
              </Link>
            </button>
          </div>
          
          {/* Stats & Chart */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="flex text-[#094A4D] bg-[#E9FAF2] p-6 rounded-lg shadow-[0px_10px_5px_rgba(0,0,0,0.5)] m-10">
                <img
                  src="/image12.png"
                  alt="icon"
                  className="w-18 h-18 mr-2 mt-2"
                />
                <div className="ml-5">
                  <h4 className="text-xl font-semibold">Patient Visits</h4>
                  <p className="text-3xl font-bold mt-2">
                    {dashboardData.patientVisit}
                  </p>
                  <p className="text-[#094A4D]">{todayDate}</p>
                </div>
              </div>

              <div className="flex text-[#094A4D] bg-[#E9FAF2] p-6 rounded-lg shadow-[0px_10px_5px_rgba(0,0,0,0.5)] m-10">
                <img
                  src="/image26.png"
                  alt="icon"
                  className="w-18 h-18 mr-2 mt-2"
                />
                <div className="ml-5">
                  <h4 className="text-xl font-semibold">Appointments</h4>
                  <p className="text-3xl font-bold mt-2">
                    {dashboardData.appointments}
                  </p>
                  <p className="text-[#094A4D]">{todayDate}</p>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white text-[#094A4D] p-6 rounded-lg shadow-md w-full h-[300px] md:h-[400px] lg:h-[500px]">
              <h4 className="text-xl font-semibold mb-4">
                Appointments Over Time
              </h4>
              <ResponsiveContainer width="100%" height="80%">
                <LineChart data={sortedAppointmentsData}>
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

        <aside className="w-100 bg-[#CEE4E6] p-5 shadow-md relative">
          {/* Notifications */}
          {/* Button to toggle the Notification Bar */}
          <AdminNotification />

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
                <p className="text-3xl font-bold">{dashboardData.doctors}</p>
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
                <p className="text-3xl font-bold">{dashboardData.patients}</p>
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
    </>
  );
};

export default AdminDashboard;
