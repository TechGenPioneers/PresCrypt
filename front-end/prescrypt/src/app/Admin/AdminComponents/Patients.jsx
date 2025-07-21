"use client";
import React from "react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { GetPatients } from "../service/AdminPatientService";
import { Search, Filter } from "lucide-react";
import useAuthGuard from "@/utils/useAuthGuard"; // Ensure the user is authenticated as an Admin
const Patients = () => {
  useAuthGuard(["Admin"]); // Ensure the user is authenticated as an Admin
  const [dateTime, setDateTime] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [patients, setPatients] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  //get all patients
  const getPatients = async () => {
    try {
      const patients = await GetPatients();
      setPatients(patients);
      setLoading(false);
      console.log(patients);
    } catch (error) {
      console.error("Failed to get the data", error);
    }
  };

  useEffect(() => {
    const updateDateTime = () => {
      setDateTime(new Date());
    };
    getPatients();
    updateDateTime(); // Set initial value
    const interval = setInterval(updateDateTime, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 60000); // 1 minute

    return () => clearTimeout(timer);
  }, []);

  function calculateAge(dobString) {
    const dob = new Date(dobString);
    const today = new Date();

    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    const dayDiff = today.getDate() - dob.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--; // Birthday hasn't occurred yet this year
    }

    return age;
  }

  if (!dateTime) return null; // Prevent SSR mismatch

  // Formatting date as "Wednesday 5 March 2025"
  const formattedDate = dateTime.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Filtered patients based on search query (searching by id or name)
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${patient.firstName} ${patient.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || patient.status === statusFilter;

    return matchesSearch && matchesStatus;
  });
  return (
    <div className="p-6 bg-white border-t-[15px] border-l-[15px] border-r-[15px] border-[#E9FAF2]">
      {/* Title */}
      <h1 className="text-3xl font-bold text-slate-800 mb-1">Patients</h1>
      <p className="text-[#09424D] text-sm">{formattedDate}</p>

      {/* Search Input */}
      <div className="mt-6 mb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-2/3">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by Patient ID or Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 bg-[#F4FAF7] text-sm text-[#094A4D] placeholder:text-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B5D9DB] transition-all"
          />
        </div>

        {/* Status Dropdown */}
        <div className="ml-5 w-full md:w-1/3 flex items-center gap-4">
          {["All", "Active", "InActive"].map((status) => (
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
      <div className="overflow-x-auto rounded-xl border border-slate-200 max-h-[400px] overflow-y-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="sticky top-0 bg-[#B5D9DB] z-5 shadow text-[#094A4D]">
            <tr>
              <th className="p-4 text-left font-semibold">Patient ID</th>
              <th className="p-4 text-left font-semibold">Patient</th>
              <th className="p-4 text-left font-semibold">Status</th>
              <th className="p-4 text-left font-semibold">Last Login</th>
              <th className="p-4 text-left font-semibold">Action</th>
            </tr>
          </thead>

          {filteredPatients.length === 0 ? (
            loading ? (
              <tbody>
                <tr>
                  <td colSpan="6">
                    <div className="flex items-center justify-center h-[400px]">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="w-16 h-16 border-4 border-[#E9FAF2] border-t-[#50d094] rounded-full animate-spin"></div>
                        <p className="text-slate-600 text-lg font-medium">
                          Loading Patients...
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
                        No Patients Found.
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
            )
          ) : (
          <tbody>
            {filteredPatients.map((patient, index) => (
              
                <tr
                  key={index}
                  className={`transition-all ${
                    index % 2 === 0 ? "bg-[#F7FCFA]" : "bg-white"
                  } hover:bg-[#E9FAF2]`}
                >
                  <td className="p-4 text-[#094A4D] font-medium">
                    {patient.patientId}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          patient.profileImage &&
                          patient.profileImage.trim() !== ""
                            ? `data:image/jpeg;base64,${patient.profileImage}`
                            : "/profile2.png"
                        }
                        alt="Avatar"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-[#094A4D]">
                          {patient.firstName} {patient.lastName}
                        </p>
                        <p className="text-sm text-slate-600">
                          {patient.gender} • {calculateAge(patient.dob)} years
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                        patient.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          patient.status === "Active"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      ></span>
                      {patient.status || "N/A"}
                    </span>
                  </td>
                  <td className="p-4 text-[#094A4D]">{patient.lastLogin}</td>
                  <td className="p-4">
                    <Link
                      href={`/Admin/PatientDetailsPage/${patient.patientId}`}
                    >
                      <button className="px-4 py-2 bg-[#B5D9DB] text-[#094A4D] rounded-lg hover:bg-[#A2C5C7] transition font-medium shadow-sm">
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
  );
};

export default Patients;
