"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { GetDoctors } from "../service/AdminDoctorService";
import { Search } from "lucide-react";
import useAuthGuard from "@/utils/useAuthGuard";

const Doctors = () => {
  useAuthGuard(["Admin"]); // Ensure the user is authenticated as an Admin
  const [dateTime, setDateTime] = useState(new Date()); // Initialize dateTime
  const [searchQuery, setSearchQuery] = useState("");
  const [doctorData, setDoctorData] = useState([]); // Initialize as an array
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  // UseEffect to load doctor data
  useEffect(() => {
    const loadData = async () => {
      const doctorDetails = await GetDoctors();
      setDoctorData(doctorDetails); // Set doctor data as an array
      setLoading(false);
      const updateDateTime = () => setDateTime(new Date());
      updateDateTime(); // Set initial time
      const interval = setInterval(updateDateTime, 1000);
      return () => clearInterval(interval);
    };
    loadData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 60000); // 1 minute

    return () => clearTimeout(timer);
  }, []);

  if (!dateTime) return null;

  // Date and Time Formatting
  const formattedDate = dateTime.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const filteredDoctors = doctorData.filter((doctor) => {
  const doctorId = doctor.doctorId?.toLowerCase() || "";
  const fullName = `${doctor.firstName || ""} ${doctor.lastName || ""}`.toLowerCase();
  const specialization = doctor.specialization?.toLowerCase() || "";
  const status = doctor.status; // This is a boolean: true or false

  const matchesSearch =
    doctorId.includes(searchQuery.toLowerCase()) ||
    fullName.includes(searchQuery.toLowerCase()) ||
    specialization.includes(searchQuery.toLowerCase());

  const matchesStatus =
    statusFilter === "All" ||
    (statusFilter === "Active" && status === true) ||
    (statusFilter === "Inactive" && status === false);

  return matchesSearch && matchesStatus;
});


  return (
    <div className="p-6 border-[15px] border-b-0 border-[#E9FAF2] bg-white">
      {/* Title */}
      <h1 className="text-3xl font-bold text-slate-800 mb-1">Doctors</h1>
      <p className="text-[#09424D] text-sm mb-4">{formattedDate}</p>

      {/* Search Input */}
      {/* Search + Filter Section */}

      <div className="mt-6 mb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-2/3">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by Doctor ID or Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 bg-[#F4FAF7] text-sm text-[#094A4D] placeholder:text-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B5D9DB] transition-all"
          />
        </div>

        {/* Status Dropdown */}
        <div className="ml-5 w-full md:w-1/3 flex items-center gap-4">
          {["All", "Active", "Inactive"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 text-sm rounded-full border transition-all shadow-sm
              ${
                statusFilter === status
                  ? "bg-[#E9FAF2] text-[#094A4D] border-[#50d094]"
                  : "bg-white text-gray-500 border-gray-300 hover:bg-[#F4FAF7]"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <div className="max-h-96 overflow-y-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="sticky top-0 bg-[#B5D9DB] shadow z-5">
              <tr className="text-[#094A4D]">
                <th className="p-4 font-semibold">Doctor ID</th>
                <th className="p-4 font-semibold">Doctor</th>
                <th className="p-4 font-semibold">Specialty</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Action</th>
              </tr>
            </thead>
            
              {filteredDoctors.length === 0 ? (
                loading ? (
                  <tbody>
                    <tr>
                      <td colSpan="6">
                        <div className="flex items-center justify-center h-[400px]">
                          <div className="flex flex-col items-center space-y-4">
                            <div className="w-16 h-16 border-4 border-[#E9FAF2] border-t-[#50d094] rounded-full animate-spin"></div>
                            <p className="text-slate-600 text-lg font-medium">
                              Loading Doctors...
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                ) : (
                  <tbody>
                    <tr>
                      <td colSpan="6">
                        <div className="flex items-center justify-center h-[400px]">
                          <p className="text-slate-600 text-lg font-medium">
                            No Doctor Found.
                          </p>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                )
              ) : (
              <tbody>
                {filteredDoctors.map((doctor, index) => (
                  <tr
                    key={doctor.doctorId}
                    className={`transition-all ${
                      index % 2 === 0 ? "bg-[#F7FCFA]" : "bg-white"
                    } hover:bg-[#E9FAF2]`}
                  >
                    <td className="p-4 text-[#094A4D] font-medium">
                      {doctor.doctorId}
                    </td>
                    <td className="p-4 flex items-center gap-4">
                      <img
                        src={
                          doctor.profilePhoto?.trim()
                            ? `data:image/jpeg;base64,${doctor.profilePhoto}`
                            : "/profile2.png"
                        }
                        alt="Avatar"
                        className="w-10 h-10 rounded-full object-cover border border-slate-300"
                      />
                      <div>
                        <div className="font-semibold text-[#094A4D]">
                          {doctor.firstName} {doctor.lastName}
                        </div>
                        <div className="text-sm text-slate-500">
                          {doctor.gender}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-[#094A4D]">
                      {doctor.specialization}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                          doctor.status
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {doctor.status ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-4">
                      <Link href={`/Admin/DoctorDetailPage/${doctor.doctorId}`}>
                        <button className="px-4 py-2 bg-[#B5D9DB] text-[#09424D] font-medium rounded-lg hover:bg-[#A2C5C7] transition">
                          View
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
              )}
          </table>
        </div>
      </div>
    </div>
  );
};

export default Doctors;
