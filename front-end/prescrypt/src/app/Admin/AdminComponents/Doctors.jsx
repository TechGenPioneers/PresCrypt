"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { GetDoctors } from "../service/AdminDoctorService";

const Doctors = () => {
  const [dateTime, setDateTime] = useState(new Date()); // Initialize dateTime
  const [searchQuery, setSearchQuery] = useState("");
  const [doctorData, setDoctorData] = useState([]); // Initialize as an array

  // UseEffect to load doctor data
  useEffect(() => {
    const loadData = async () => {
      const doctorDetails = await GetDoctors();
      setDoctorData(doctorDetails); // Set doctor data as an array
      const updateDateTime = () => setDateTime(new Date());
      updateDateTime(); // Set initial time
      const interval = setInterval(updateDateTime, 1000);
      return () => clearInterval(interval);
    };
    loadData();
  }, []);

  if (!dateTime) return null;

  // Date and Time Formatting
  const formattedDate = dateTime.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Filtering doctors based on search input
  const filteredDoctors = doctorData.filter(
    (doctor) =>
      doctor.doctorId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${doctor.firstName} ${doctor.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())|| doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 border-[15px] border-b-0 border-[#E9FAF2] bg-white">
      {/* Title */}
      <h1 className="text-3xl font-bold text-slate-800 mb-1">Doctors</h1>
      <p className="text-[#09424D] text-sm mb-4">{formattedDate}</p>

      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search Doctor ID or Name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-5xl px-5 py-3 bg-[#F0FAF6] border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#A9C9CD] text-slate-700"
        />
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
          </table>
        </div>
      </div>
    </div>
  );
};

export default Doctors;
