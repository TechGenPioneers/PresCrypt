"use client";
import React from "react";
import { useState, useEffect } from "react";
const Patients = () => {
  const [dateTime, setDateTime] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

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

  const patients = [
    {
      id: "P001",
      name: "John Doe",
      gender: "Male",
      age: 32,
      doctor: "Dr. Smith",
      lastVisit: "2025-03-01",
    },
    {
      id: "P002",
      name: "Jane Doe",
      gender: "Female",
      age: 28,
      doctor: "Dr. Johnson",
      lastVisit: "2025-02-15",
    },
    {
      id: "P003",
      name: "Alice Smith",
      gender: "Female",
      age: 45,
      doctor: "Dr. Lee",
      lastVisit: "2025-01-20",
    },
    {
      id: "P004",
      name: "Bob Brown",
      gender: "Male",
      age: 50,
      doctor: "Dr. Turner",
      lastVisit: "2025-03-10",
    },
    {
      id: "P005",
      name: "Charlie White",
      gender: "Male",
      age: 37,
      doctor: "Dr. Baker",
      lastVisit: "2025-02-05",
    },
    {
      id: "P006",
      name: "Diana Green",
      gender: "Female",
      age: 42,
      doctor: "Dr. Moore",
      lastVisit: "2025-02-25",
    },
  ];

  // Filtered patients based on search query (searching by id or name)
  const filteredPatients = patients.filter(
    (patient) =>
      patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.name.toLowerCase().includes(searchQuery.toLowerCase())
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
                    Doctor
                  </th>
                  <th className="p-3 text-left sticky top-0 bg-[#B5D9DB] z-5">
                    Last Visit
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
                    <td className="p-3 text-[#094A4D]">{patient.id}</td>
                    <td className="p-3 flex items-center space-x-3">
                      <img
                        src="/profile2.png"
                        alt="Avatar"
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-semibold text-[#094A4D]">{patient.name}</p>
                        <p className="text-[#094A4D] text-sm">
                          {patient.gender} • {patient.age}
                        </p>
                      </div>
                    </td>
                    <td className="p-3 text-[#094A4D]">{patient.doctor}</td>
                    <td className="p-3 text-[#094A4D]">{patient.lastVisit}</td>
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
