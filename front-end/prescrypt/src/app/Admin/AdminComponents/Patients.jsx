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

  // Formatting time as "11:15 AM"
  const formattedTime = dateTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  // Filtered patients based on search query (searching by id or name)
  const filteredPatients = patients.filter(
    (patient) =>
      patient.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className="p-6 border-15 border-[#E9FAF2] bg-white ">
      {/* Title */}
      <h1 className="text-2xl font-bold mb-2">Patients</h1>
      <p className="text-[#09424D] text-sm">{formattedDate}</p>

      {/* Search Input */}
      <div className="mt-4 mb-6">
        <input
          type="text"
          placeholder="Enter Patient Id or Name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 bg-[#E9FAF2] border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#CEE4E6] focus:border-transparent"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <div className="rounded-lg overflow-hidden">
          <div className="max-h-80 overflow-y-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#006369] text-[#094A4D]">
                  <th className="p-3 text-left sticky top-0 bg-[#B5D9DB] z-5">
                    Patient Id
                  </th>
                  <th className="p-3 text-left sticky top-0 bg-[#B5D9DB] z-5">
                    Patient
                  </th>
                  <th className="p-3 text-left sticky top-0 bg-[#B5D9DB] z-5">
                    Last Appointment
                  </th>
                  <th className="p-3 text-left sticky top-0 bg-[#B5D9DB] z-5">
                    Last Appointment Status
                  </th>
                  <th className="p-3 text-left sticky top-0 bg-[#B5D9DB] z-5">
                    Last Login
                  </th>
                  <th className="p-3 text-left sticky top-0 bg-[#B5D9DB] z-5">
                    Action
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {filteredPatients.map((patient, index) => (
                  <tr
                    key={index}
                    className={`border-t ${
                      index % 2 === 0 ? "bg-[#E9FAF2]" : "bg-[#ffffff]"
                    }`}
                  >
                    <td className="p-3 text-[#094A4D]">{patient.patientId}</td>
                    <td className="p-3 flex items-center space-x-3">
                      <img
                        src={patient.profileImage || "/profile2.png"} // Use profilePhoto if available
                        alt="Avatar"
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-semibold text-[#094A4D]">
                          {patient.firstName} {patient.lastName}
                        </p>
                        <p className="text-[#094A4D] text-sm">
                          {patient.gender} • {calculateAge(patient.dob)} years
                        </p>
                      </div>
                    </td>
                    <td className="p-3  items-center space-x-3">
                      <div>
                        <p className="font-semibold text-[#094A4D]">
                          {patient.lastAppointmentDoctorName}
                        </p>
                        <p className="text-[#094A4D] text-sm">
                          {patient.lastAppointmentDoctorID} •{" "}
                          {patient.lastAppointmentDate}
                        </p>
                      </div>
                    </td>
                    <td className="p-3 text-[#094A4D]">
                      <span
                        className={` text-md flex items-center gap-2 ${
                          patient.status === "Completed"
                            ? "text-green-500"
                            : patient.status === "Cancelled"
                            ? "text-red-500"
                            :  patient.status === "Pending"
                            ? "text-yellow-500"
                            : ""
                        }`}
                      >
                        <span
                          className={`w-3 h-3 rounded-full ${
                            patient.status === "Completed"
                              ? "bg-green-500"
                              : patient.status === "Cancelled"
                              ? "bg-red-500"
                              :  patient.status === "Pending"
                              ? "text-yellow-500"
                              : ""
                          }`}
                        ></span>
                        {patient.status}
                      </span>
                    </td>
                    <td className="p-3 text-[#094A4D]">{patient.lastLogin}</td>
                    <td className="p-3 space-x-3">
                      <button className="px-4 py-2 text-[#094A4D] cursor-pointer rounded">
                        <Link href={`/Admin/PatientDetailsPage/${patient.patientId}`}>
                        View
                        </Link>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-6 text-gray-500 flex flex-col items-end">
        <p>{formattedDate}</p>
        <p>{formattedTime}</p>
      </div>
    </div>
  );
};

export default Patients;
