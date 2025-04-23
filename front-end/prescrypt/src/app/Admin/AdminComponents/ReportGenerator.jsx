"use client";
import React, { useState, useRef, useEffect } from "react";
import { GetAllDetails } from "../service/AdminReportService";

const SearchableDropdown = ({
  options,
  value,
  onChange,
  disabled,
  placeholder,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const dropdownRef = useRef(null);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedLabel = options.find((opt) => opt.value === value)?.label;

  const handleSelect = (val) => {
    onChange(val);
    setShowOptions(false);
    setSearchTerm("");
  };

  const handleClear = () => {
    onChange("");
    setSearchTerm("");
  };

  // 👉 Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative w-full">
      <input
        type="text"
        value={selectedLabel || searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => !disabled && setShowOptions(true)}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full pr-10 p-2 text-[#09424D] bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CEE4E6] ${
          disabled ? "opacity-65 cursor-not-allowed" : ""
        }`}
      />

      {value && !disabled && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 cursor-pointer"
        >
          &times;
        </button>
      )}

      {showOptions && !disabled && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md max-h-40 overflow-y-auto shadow-md">
          {filteredOptions.map((opt) => (
            <li
              key={opt.value}
              onMouseDown={() => handleSelect(opt.value)}
              className="px-4 py-2 hover:bg-[#CEE4E6] cursor-pointer"
            >
              {opt.label}
            </li>
          ))}
          {filteredOptions.length === 0 && (
            <li className="px-4 py-2 text-gray-500">No results found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default function ReportGenerator() {
  const [toDate, setToDate] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [doctor, setDoctor] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [patient, setPatient] = useState("");
  const [reportType, setReportType] = useState("");
  const [dateTime, setDateTime] = useState(null);

  const handleGenerate = () => {
    let finalDoctor = doctor;
    let finalPatient = patient;
    let finalFromDate = fromDate;
    let finalToDate = toDate;
    let finalSpecialty = specialty;

    if (doctor === "all" || patient === "all") {
      finalFromDate = "";
      finalToDate = "";
      setFromDate("");
      setToDate("");
    }

    if (reportType === "doctor" || doctor === "all") {
      finalPatient = "";
      setPatient("");
    }

    if (reportType === "patient" || patient === "all") {
      finalDoctor = "";
      setDoctor("");
    }

    if (reportType === "patient" || doctor === "all" || patient === "all") {
      finalSpecialty = "";
      setSpecialty("");
    }

    console.log({
      fromDate: finalFromDate,
      toDate: finalToDate,
      doctor: finalDoctor,
      patient: finalPatient,
      specialty: finalSpecialty,
      reportType,
    });
  };
  const [doctorOptions, setDoctorOptions] = useState([]);
const [patientOptions, setPatientOptions] = useState([]);
const [specialtyOptions, setSpecialtyOptions] = useState([]);

const GetAllData = async () => {
  try {
    const response = await GetAllDetails(); // Make sure GetAllDetails returns a Promise
    console.log("response:", response);

    // Set doctor options
    const doctors = [
      { value: "all", label: "All Doctors" },
      ...response.doctors.map((doc) => ({
        value: doc.doctorId,
        label: `${doc.doctorId} - Dr. ${doc.firstName} ${doc.lastName}`,
      })),
    ];

    // Set patient options
    const patients = [
      { value: "all", label: "All Patients" },
      ...response.patients.map((pat) => ({
        value: pat.patientId,
        label: `${pat.patientId} - ${pat.firstName} ${pat.lastName}`,
      })),
    ];

    // Set specialty options
    const specialties = response.specialty.map((s) => ({
      value: s.toLowerCase(),
      label: s,
    }));

    // Update states
    setDoctorOptions(doctors);
    setPatientOptions(patients);
    setSpecialtyOptions(specialties);
  } catch (err) {
    console.error("Failed to get the data", err);
  }
};


  useEffect(() => {
    const updateDateTime = () => {
      setDateTime(new Date());
    };
    updateDateTime();
    GetAllData();
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

  const reportTypeOptions = [
    { value: "summary", label: "Summary" },
    { value: "detailed", label: "Detailed" },
    { value: "Revenue", label: "Revenue Report" },
    { value: "Appointment", label: "Appointment Report" },
    { value: "Activity", label: "User Activity Report" },
    { value: "doctor", label: "Doctor" },
    { value: "patient", label: "Patient" },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md border-15 border-[#E9FAF2]">
      <h1 className="text-2xl font-bold mb-2">Reports</h1>
      <p className="text-[#09424D] text-sm">{formattedDate}</p>

      <div className="mt-10 flex justify-center ">
        <div className="max-w-md md:max-w-md lg:max-w-lg xl:max-w-xl w-full">
          <div className="bg-[#E9FAF2] p-6 shadow-md rounded-lg px-30">
            <div className="flex flex-col gap-4 mb-4">
              <label className="block font-semibold text-[#09424D]">
                Select Date:
              </label>
              <label className="-m-2 text-[#09424D]">To Date:</label>
              <input
                type="date"
                name="toDate"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                disabled={doctor === "all" || patient === "all"}
                className={`w-full p-2 text-[#09424D] bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CEE4E6] ${
                  doctor === "all" || patient === "all"
                    ? "opacity-65 cursor-not-allowed"
                    : ""
                }`}
                required
              />
              <label className="-m-2 text-[#09424D]">From Date:</label>
              <input
                type="date"
                name="fromDate"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                disabled={doctor === "all" || patient === "all"}
                className={`w-full p-2 text-[#09424D] bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CEE4E6] ${
                  doctor === "all" || patient === "all"
                    ? "opacity-65 cursor-not-allowed"
                    : ""
                }`}
                required
              />
            </div>

            <div className="flex flex-col gap-4 mb-4">
              <SearchableDropdown
                options={patientOptions}
                value={patient}
                onChange={setPatient}
                disabled={reportType === "doctor" || doctor === "all"}
                placeholder="-- Select Patient --"
              />

              <SearchableDropdown
                options={doctorOptions}
                value={doctor}
                onChange={setDoctor}
                disabled={reportType === "patient" || patient === "all"}
                placeholder="-- Select Doctor --"
              />

              <SearchableDropdown
                options={specialtyOptions}
                value={specialty}
                onChange={setSpecialty}
                disabled={
                  reportType === "patient" ||
                  doctor === "all" ||
                  patient === "all"
                }
                placeholder="-- Select Specialty --"
              />

              <SearchableDropdown
                options={reportTypeOptions}
                value={reportType}
                onChange={setReportType}
                placeholder="-- Select Specialty --"
              />
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
