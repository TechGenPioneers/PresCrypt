"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { GetDoctors } from "../service/AdminService";

const Doctors = () => {
  const [dateTime, setDateTime] = useState(new Date()); // Initialize dateTime
  const [searchQuery, setSearchQuery] = useState("");
  const [doctorData, setDoctorData] = useState([]); // Initialize as an array

  // UseEffect to load doctor data
  useEffect(() => {
    const loadData = async () => {
      const doctorDetails = await GetDoctors();
      console.log(doctorDetails); 
      setDoctorData(doctorDetails); // Set doctor data as an array

      const updateDateTime = () => setDateTime(new Date());
      updateDateTime(); // Set initial time
      const interval = setInterval(updateDateTime, 1000);
      return () => clearInterval(interval);
    };
    loadData();
  }, []);

  if (!dateTime) return null; // Prevent SSR mismatch

  // Date and Time Formatting
  const formattedDate = dateTime.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formattedTime = dateTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  // Filtering doctors based on search input
  const filteredDoctors = doctorData.filter(
    (doctor) =>
      doctor.doctorId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${doctor.firstName} ${doctor.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 border-15 border-[#E9FAF2] bg-white">
      {/* Title */}
      <h1 className="text-2xl font-bold mb-2">Doctors</h1>
      <p className="text-[#09424D] text-sm">{formattedDate}</p>

      {/* Search Input and Button */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Search Doctor Id or Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-5xl p-2 bg-[#E9FAF2] border border-gray-300 rounded-full shadow-sm 
          focus:outline-none focus:ring-2 focus:ring-[#CEE4E6]"
          />

          <button
            className="ml-1 px-10 py-2 bg-[#A9C9CD] text-[#09424D] font-semibold rounded-lg 
          hover:bg-[#91B4B8] transition duration-300"
          >
            <Link href="/Admin/DoctorRegistrationForm">Add New Doctor</Link>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <div className="rounded-lg overflow-hidden">
          <div className="max-h-80 overflow-y-auto">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 bg-[#B5D9DB]">
                <tr className="text-[#094A4D]">
                  <th className="p-3 text-left sticky top-0 bg-[#B5D9DB] z-5">Doctor ID</th>
                  <th className="p-3 text-left sticky top-0 bg-[#B5D9DB] z-5">Doctor</th>
                  <th className="p-3 text-left sticky top-0 bg-[#B5D9DB] z-5">Specialty</th>
                  <th className="p-3 text-left sticky top-0 bg-[#B5D9DB] z-5">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredDoctors.map((doctor, index) => (
                  <tr
                    key={doctor.doctorId}
                    className={`border-t ${
                      index % 2 === 0 ? "bg-[#E9FAF2]" : "bg-[#ffffff]"
                    }`}
                  >
                    <td className="p-3 text-[#094A4D]">{doctor.doctorId}</td>
                    <td className="p-3 flex items-center space-x-3">
                      <img
                        src={doctor.profilePhoto || "/profile2.png"} // Use profilePhoto if available
                        alt="Avatar"
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                      <span className="font-semibold text-[#094A4D]">
                        {doctor.firstName} {doctor.lastName}
                      </span>
                        <p className="text-[#094A4D] text-sm">
                          {doctor.gender}
                        </p>
                      </div>
                    </td>
                    <td className="p-3 text-[#094A4D]">{doctor.specialization}</td>
                    <td className="p-3">
                      <Link href={`/Admin/DoctorDetailPage/${doctor.doctorId}`}>
                        <button className="px-4 py-2 text-[#094A4D] cursor-pointer rounded ">
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

      {/* Date & Time */}
      <div className="mt-6 text-gray-500 flex flex-col items-end">
        <p>{formattedDate}</p>
        <p>{formattedTime}</p>
      </div>
    </div>
  );
};

export default Doctors;
