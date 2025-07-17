"use client";
import React from "react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { GetPatients } from "../service/AdminPatientService";
const Patients = () => {
  const [dateTime, setDateTime] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [patients, setPatients] = useState([]);

  //get all patients
  const getPatients = async () => {
    try {
      const patients = await GetPatients();
      setPatients(patients);
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
  const filteredPatients = patients.filter(
    (patient) =>
      patient.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${patient.firstName} ${patient.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );
  return (
    <div className="p-6 bg-white border-t-[15px] border-l-[15px] border-r-[15px] border-[#E9FAF2]">
      {/* Title */}
      <h1 className="text-3xl font-bold text-slate-800 mb-1">Patients</h1>
      <p className="text-[#09424D] text-sm">{formattedDate}</p>

      {/* Search Input */}
      <div className="mt-6 mb-4">
        <input
          type="text"
          placeholder="Search Patient ID or Name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 bg-[#F4FAF7] border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B5D9DB]"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 max-h-[400px] overflow-y-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="sticky top-0 bg-[#B5D9DB] z-10 shadow text-[#094A4D]">
            <tr>
              <th className="p-4 text-left font-semibold">Patient ID</th>
              <th className="p-4 text-left font-semibold">Patient</th>
              <th className="p-4 text-left font-semibold">Last Appointment</th>
              <th className="p-4 text-left font-semibold">Status</th>
              <th className="p-4 text-left font-semibold">Last Login</th>
              <th className="p-4 text-left font-semibold">Action</th>
            </tr>
          </thead>
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
                <td className="p-4 text-[#094A4D]">
                  <p className="font-semibold">
                    {patient.lastAppointmentDoctorName}
                  </p>
                  <p className="text-sm text-slate-600">
                    {patient.lastAppointmentDoctorID} •{" "}
                    {patient.lastAppointmentDate}
                  </p>
                </td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                      patient.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : patient.status === "Cancelled"
                        ? "bg-red-100 text-red-700"
                        : patient.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        patient.status === "Completed"
                          ? "bg-green-500"
                          : patient.status === "Cancelled"
                          ? "bg-red-500"
                          : patient.status === "Pending"
                          ? "bg-yellow-500"
                          : "bg-gray-400"
                      }`}
                    ></span>
                    {patient.status || "N/A"}
                  </span>
                </td>
                <td className="p-4 text-[#094A4D]">{patient.lastLogin}</td>
                <td className="p-4">
                  <Link href={`/Admin/PatientDetailsPage/${patient.patientId}`}>
                    <button className="px-4 py-2 bg-[#B5D9DB] text-[#094A4D] rounded-lg hover:bg-[#A2C5C7] transition font-medium shadow-sm">
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
  );
};

export default Patients;
