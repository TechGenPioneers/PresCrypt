"use client";
import React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Search,
  UserPlus,
  Users,
  Calendar,
  Bell,
  TrendingUp,
  Activity,
  Stethoscope,
} from "lucide-react";

import AdminNotification from "./AdminNotification";
import { GetAllDashboardData } from "../service/AdminDashboardService";
import Dashboard from "@/app/Doctor/DoctorDashboard/page";
import useAuthGuard from "@/utils/useAuthGuard";
//import SystemAnalyze from "./SystemAnalyse";

const AdminDashboard = ({ setAdminName }) => {
  useAuthGuard(["Admin"]); // Ensure the user is authenticated as an Admin
  const [dateTime, setDateTime] = useState(null);
  const [dashboardData, setDashboardData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  //get dashboard data
  const getDashboardData = async () => {
    try {
      const response = await GetAllDashboardData();
      setDashboardData(response);
      setAdminName(response.adminName);
    } catch (error) {
      console.error("Failed to get the data", error);
    }
  };

  //get last 7 days in order according to today
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

    return () => clearInterval(interval);
  }, []);

  // Sort appointments over time based on the last 7 days
  const sortAppointmentsOverTime = (data) => {
    const daysOrder = getLast7DaysInOrder();
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

  const getCurrentDate = () => {
    const today = new Date();
    return today.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toLocaleDateString("en-US", {
      Year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  return (
    <>
      <div className="flex min-h-screen bg-white border-t-[15px] border-l-[15px] border-r-[15px] border-b-0 border-[#E9FAF2]">
        {/* Main Content */}
        <main className="overflow-auto flex-grow p-6">
          {/* Header */}
          <div className="mb-10 pl-5">
            <h2 className="text-3xl font-bold mb-4 text-[#094A4D]">
              Dashboard
            </h2>
            <p className="text-gray-500 text-lg">{getCurrentDate()}</p>
          </div>

          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-[#E9FAF2] to-[#CEE4E6] p-8 rounded-2xl mb-8 shadow-lg">
            <h3 className="text-3xl text-[#094A4D] font-bold mb-2">
              Welcome back, {dashboardData.adminName}
            </h3>
            <p className="text-[#094A4D] text-lg opacity-80">
              Have a productive day managing your healthcare system!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 px-4">
            <Link
              className="group flex items-center justify-center bg-[#E9FAF2] p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-[#094A4D]"
              href={`/Admin/AdminPatient`}
            >
              <Search className="w-7 h-7 mr-3 text-[#006369] group-hover:text-[#094A4D] transition-colors" />
              <span className="text-lg font-semibold text-[#094A4D]">
                Search Patients
              </span>
            </Link>
            <Link
              className="group flex items-center justify-center bg-[#E9FAF2] p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-[#094A4D]"
              href={`/Admin/DoctorRequestPage`}
            >
              <UserPlus className="w-7 h-7 mr-3 text-[#006369] group-hover:text-[#094A4D] transition-colors" />
              <span className="text-lg font-semibold text-[#094A4D]">
                Doctor Requests
              </span>
            </Link>
          </div>

          {/* Stats & Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Stats Cards */}
            <div className="space-y-6">
              <div className="flex items-center bg-[#E9FAF2] p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="bg-white p-4 rounded-full mr-6">
                  <Activity className="w-8 h-8 text-[#006369]" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-[#094A4D]">
                    Patient Visits
                  </h4>
                  <p className="text-4xl font-bold mt-2 text-[#094A4D]">
                    {dashboardData.patientVisit}
                  </p>
                  <p className="text-[#094A4D] opacity-70">{getTodayDate()}</p>
                </div>
              </div>

              <div className="flex items-center bg-[#E9FAF2] p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="bg-white p-4 rounded-full mr-6">
                  <Calendar className="w-8 h-8 text-[#006369]" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-[#094A4D]">
                    Appointments
                  </h4>
                  <p className="text-4xl font-bold mt-2 text-[#094A4D]">
                    {dashboardData.appointments}
                  </p>
                  <p className="text-[#094A4D] opacity-70">{getTodayDate()}</p>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center mb-6">
                <TrendingUp className="w-6 h-6 text-[#094A4D] mr-2" />
                <h4 className="text-xl font-semibold text-[#094A4D]">
                  Appointments Over Time
                </h4>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={sortedAppointmentsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E9FAF2" />
                  <XAxis dataKey="day" stroke="#094A4D" />
                  <YAxis stroke="#094A4D" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#E9FAF2",
                      border: "1px solid #094A4D",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#006369"
                    strokeWidth={3}
                    name="Total"
                    dot={{ fill: "#006369", strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    stroke="#4CAF50"
                    strokeWidth={3}
                    name="Completed"
                    dot={{ fill: "#4CAF50", strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="missed"
                    stroke="#FF5252"
                    strokeWidth={3}
                    name="Missed"
                    dot={{ fill: "#FF5252", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </main>

        <aside className="w-80 bg-[#f3faf7] p-6 shadow-lg relative">
          {/* Notifications */}
          <AdminNotification />

          {/* Total Counts */}
          <div className="space-y-6">
            <div className="flex items-center bg-[#E9FAF2] p-5 rounded-xl shadow text-[#09424D] hover:shadow-xl transition-shadow duration-300">
              <div className="bg-white p-3 rounded-full mr-4">
                <Stethoscope className="w-8 h-8 text-[#006369]" />
              </div>
              <div>
                <h4 className="text-lg font-semibold">Total Doctors</h4>
                <p className="text-3xl font-bold">{dashboardData.doctors}</p>
              </div>
            </div>

            <div className="flex items-center bg-[#E9FAF2] p-5 rounded-xl shadow text-[#09424D] hover:shadow-xl transition-shadow duration-300">
              <div className="bg-white p-3 rounded-full mr-4">
                <Users className="w-8 h-8 text-[#006369]" />
              </div>
              <div>
                <h4 className="text-lg font-semibold">Total Patients</h4>
                <p className="text-3xl font-bold">{dashboardData.patients}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-18 bg-white p-5 rounded-xl shadow ">
            <h4 className="text-lg font-semibold text-[#09424D] mb-4">
              More Actions
            </h4>
            <div className="space-y-3">
              <button
                className="w-full text-left p-3 rounded-lg bg-[#E9FAF2] hover:bg-[#CEE4E6] transition-colors text-[#09424D]"
                onClick={() => setIsModalOpen(true)}
              >
                System Analyses
              </button>
              <Link href={"/Admin/HospitalsPage"}>
                <button className="w-full text-left p-3 rounded-lg bg-[#E9FAF2] hover:bg-[#CEE4E6] transition-colors text-[#09424D]">
                  Hospitals
                </button>
              </Link>
            </div>
          </div>

          <img
            src="/AdminDashboardImage.png"
            alt="Admin Dashboard Image"
            className="mt-6"
          />
        </aside>
      </div>
      {isModalOpen ? (
        <SystemAnalyze closeModal={() => setIsModalOpen(false)} />
      ) : null}
    </>
  );
};

export default AdminDashboard;
