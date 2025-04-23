"use client";
import React, { useState, useEffect } from "react";

export default function ReportGenerator() {
  const [toDate, setToDate] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [doctor, setDoctor] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [patient, setPatient] = useState("");
  const [reportType, setReportType] = useState("");
  const [dateTime, setDateTime] = useState(null);

  const handleGenerate = () => {
    console.log({ toDate, fromDate, doctor, specialty, patient, reportType });
  };

  useEffect(() => {
    const updateDateTime = () => {
      setDateTime(new Date());
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!dateTime) return null;

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

  return (
    <div className="p-6 bg-white rounded-lg shadow-md border-15 border-[#E9FAF2]">
      <h1 className="text-2xl font-bold mb-2">Report</h1>
      <p className="text-[#09424D] text-sm">{formattedDate}</p>

      <div className="mt-10 flex justify-center">
        <div className="max-w-md md:max-w-md lg:max-w-lg xl:max-w-xl w-full">
          <div className="bg-[#E9FAF2] p-6 shadow-md rounded-lg">
            <div className="flex flex-col gap-4 mb-4">
              <label className="block font-semibold">Select Date:</label>
              <input
                type="date"
                name="toDate"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full p-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CEE4E6]"
                required
              />
              <input
                type="date"
                name="fromDate"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full p-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CEE4E6] mb-10"
                required
              />
            </div>

            <div className="flex flex-col gap-4 mb-4">
              {/* Patient Select */}
              <select
                value={patient}
                onChange={(e) => setPatient(e.target.value)}
                disabled={reportType === "doctor"}
                className={`w-full p-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CEE4E6] ${
                  reportType === "doctor" ? "opacity-65 cursor-not-allowed" : ""
                }`}
              >
                <option value="">-- Select Patient --</option>
                <option value="all">All Patients</option>
                <option value="patient_1">Patient 1</option>
              </select>

              {/* Doctor Select */}
              <select
                value={doctor}
                onChange={(e) => setDoctor(e.target.value)}
                disabled={reportType === "patient"}
                className={`w-full p-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CEE4E6] ${
                  reportType === "patient"
                    ? "opacity-65 cursor-not-allowed"
                    : ""
                }`}
              >
                <option value="">-- Select Doctor --</option>
                <option value="all">All Doctors</option>
                <option value="dr_smith">Dr. Smith</option>
                <option value="dr_john">Dr. John</option>
              </select>

              {/* Specialty Select */}
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                disabled={reportType === "patient"}
                className={`w-full p-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CEE4E6] ${
                  reportType === "patient"
                    ? "opacity-65 cursor-not-allowed"
                    : ""
                }`}
              >
                <option value="">-- Select Specialty --</option>
                <option value="cardiology">Cardiology</option>
                <option value="neurology">Neurology</option>
              </select>

              {/* Report Type */}
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full p-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CEE4E6]"
              >
                <option value="">Select a Report Type</option>
                <option value="summary">Summary</option>
                <option value="detailed">Detailed</option>
                <option value="doctor">Doctor</option>
                <option value="patient">Patient</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              className="mt-4 px-10 py-1 bg-[#007e8556] text-[#006369] rounded-lg hover:bg-[#007e8589] cursor-pointer"
              onClick={handleGenerate}
            >
              Generate
            </button>
          </div>
        </div>
      </div>
      <div className="mt-6 text-gray-500 text-right">
        <p>{formattedDate}</p>
        <p>{formattedTime}</p>
      </div>
    </div>
  );
}
