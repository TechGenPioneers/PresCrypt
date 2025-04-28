"use client";
import React, { useState, useRef, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { GetAllDetails, GetReportDetails } from "../service/AdminReportService";

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
  const [errorMessage, setErrorMessage] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reportData, setReportData] = useState(null);
  const reportRef = useRef(null);

  const handleGenerate = async () => {
    if (!reportType) {
      setErrorMessage("Please select a Report Type.");
      return;
    }
    setErrorMessage("");

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

    const reportDetails = {
      fromDate: finalFromDate,
      toDate: finalToDate,
      doctor: finalDoctor,
      patient: finalPatient,
      specialty: finalSpecialty,
      reportType: reportType,
    };

    try {
      const reportDatas = await GetReportDetails(reportDetails);
      console.log("Fetched reportDatas:", reportDatas);
      setReportData(reportDatas); // This triggers useEffect
    } catch (err) {
      console.error("Failed to get the report data", err);
    }
  };

  useEffect(() => {
    if (reportData) {
      console.log("Updated reportData:", reportData);
      // Now open the modal only when reportData is updated
      setIsModalOpen(true);
    }
  }, [reportData]);

  const handleDownload = async () => {
    const element = reportRef.current;
    const canvas = await html2canvas(element, { scale: 5 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4",
    });

    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    const today1 = new Date();
    const todayDate = today1.toISOString().split("T")[0];
    pdf.addImage(imgData, "PNG", 5, 5, width, height);
    pdf.save(`${todayDate}-report.pdf`);
  };

  const [doctorOptions, setDoctorOptions] = useState([]);
  const [patientOptions, setPatientOptions] = useState([]);
  const [specialtyOptions, setSpecialtyOptions] = useState([]);

  const GetAllData = async () => {
    try {
      const response = await GetAllDetails();
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
    { value: "appointment", label: "Appointment Report" },
    { value: "activity", label: "User Activity Report" },
  ];

  const filteredReportTypeOptions =
    doctor === "all" || patient === "all" // Show only "summary" and "detailed" if doctor or patient is "all"
      ? reportTypeOptions.filter((option) => option.value === "summary")
      : doctor && patient // If both doctor and patient have values
      ? reportTypeOptions.filter(
          (option) => option.value === "appointment" // Show only "Appointment Report"
        )
      : specialty && patient // If doctor and specialty have values
      ? reportTypeOptions.filter(
          (option) => option.value === "appointment" // Show only "Appointment Report"
        )
      : reportTypeOptions; // Show all other options when none of the above conditions are true

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
                disabled={
                  reportType === "summary" ||
                  reportType === "detailed" ||
                  reportType === "activity"
                }
                className={`w-full p-2 text-[#09424D] bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CEE4E6] ${
                  reportType === "summary" ||
                  reportType === "detailed" ||
                  reportType === "activity"
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
                disabled={
                  reportType === "summary" ||
                  reportType === "detailed" ||
                  reportType === "activity"
                }
                className={`w-full p-2 text-[#09424D] bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CEE4E6] ${
                  reportType === "summary" ||
                  reportType === "detailed" ||
                  reportType === "activity"
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
                disabled={patient === "all" || specialty != ""}
                placeholder="-- Select Doctor --"
              />

              <SearchableDropdown
                options={specialtyOptions}
                value={specialty}
                onChange={setSpecialty}
                disabled={
                  doctor != "" ||
                  (patient == "all" && reportType != "appointment") ||
                  patient === "all" ||
                  reportType === "activity"
                }
                placeholder="-- Select Specialty --"
              />

              <SearchableDropdown
                options={filteredReportTypeOptions}
                value={reportType}
                onChange={setReportType}
                placeholder="-- Select Specialty --"
                required
              />
            </div>
            <p className="text-red-500 font-bold text-center mb-5">
              {errorMessage}
            </p>
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
      {/* Modal to show the generated report */}
      {isModalOpen && (
        <div className="fixed inset-0  bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-h-[80%] overflow-auto p-6 rounded-lg shadow-xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-red-600 text-lg font-bold cursor-pointer"
            >
              ×
            </button>

            {/* PDF Preview */}
            <div ref={reportRef} className="text-[#09424D] p-5">
              {/* Header */}
              <header className="flex flex-col mb-4">
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="w-32 h-16 mt-2 mb-4 mx-auto" // Adjust size and center image
                />
                <h2 className="text-xl font-bold mb-2 text-center">
                  Generated Report
                </h2>{" "}
                {/* Text alignment adjusted */}
              </header>

              {/* Shared Info */}
              {reportType === "summary" &&
                patient === "" &&
                doctor === "all" && (
                  <>
                    <h2 className="text-lg font-bold mb-2 text-left">
                      Summary Report
                    </h2>
                    <p>
                      <strong>Doctor: All Doctors</strong>
                    </p>
                    <div className="overflow-x-auto my-5 mb-5">
                      <table className="table-auto w-full border-collapse border">
                        <thead>
                          <tr>
                            <th className="border px-4 py-2 text-left">
                              Doctor ID
                            </th>
                            <th className="border px-4 py-2 text-left">Name</th>
                            <th className="border px-4 py-2 text-left">
                              Specialization
                            </th>
                            <th className="border px-4 py-2 text-left">
                              SLMC License
                            </th>
                            <th className="border px-4 py-2 text-left">NIC</th>
                            <th className="border px-4 py-2 text-left">
                              Charge
                            </th>
                            <th className="border px-4 py-2 text-left">
                              Contact Number
                            </th>
                            <th className="border px-4 py-2 text-left">
                              Gender
                            </th>
                            <th className="border px-4 py-2 text-left">
                              Email
                            </th>
                            <th className="border px-4 py-2 text-left">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {reportData.doctorList.map((doctor) => (
                            <tr key={doctor.doctorId}>
                              <td className="border px-4 py-2">
                                {doctor.doctorId}
                              </td>
                              <td className="border px-4 py-2">
                                {doctor.firstName} {doctor.lastName}
                              </td>
                              <td className="border px-4 py-2">
                                {doctor.specialization}
                              </td>
                              <td className="border px-4 py-2">
                                {doctor.slmcLicense}
                              </td>
                              <td className="border px-4 py-2">{doctor.nic}</td>
                              <td className="border px-4 py-2">
                                Rs.{doctor.charge}
                              </td>
                              <td className="border px-4 py-2">
                                {doctor.contactNumber}
                              </td>
                              <td className="border px-4 py-2">
                                {doctor.gender}
                              </td>
                              <td className="border px-4 py-2">
                                {doctor.email}
                              </td>
                              <td className="border px-4 py-2">
                                {doctor.status ? "Active" : "Inactive"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}

              {reportType === "summary" &&
                patient === "all" &&
                doctor === "" && (
                  <>
                    <h2 className="text-lg font-bold mb-2 text-left">
                      Summary Report
                    </h2>
                    <p>
                      <strong>Doctor: All Patients</strong>
                    </p>
                    <div className="overflow-x-auto my-5 mb-5">
                      <table className="table-auto w-full border-collapse border">
                        <thead>
                          <tr>
                            <th className="border px-4 py-2 text-left">
                              Patient ID
                            </th>
                            <th className="border px-4 py-2 text-left">Name</th>
                            <th className="border px-4 py-2 text-left">NIC</th>
                            <th className="border px-4 py-2 text-left">
                              Gender
                            </th>
                            <th className="border px-4 py-2 text-left">
                              Email
                            </th>
                            <th className="border px-4 py-2 text-left">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {reportData.patientList.map((patient) => (
                            <tr key={patient.patientId}>
                              <td className="border px-4 py-2">
                                {patient.patientId}
                              </td>
                              <td className="border px-4 py-2">
                                {patient.firstName} {patient.lastName}
                              </td>
                              <td className="border px-4 py-2">
                                {patient.nic}
                              </td>
                              <td className="border px-4 py-2">
                                {patient.gender}
                              </td>
                              <td className="border px-4 py-2">
                                {patient.email}
                              </td>
                              <td className="border px-4 py-2">
                                {patient.status}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}

              {reportType === "summary" && patient !== "" && doctor === "" && (
                <>
                  <h2 className="text-lg font-bold mb-2 text-left">
                    Summary Report
                  </h2>
                  <div className="mb-4">
                    <img
                      src={
                        reportData?.singlePatient?.profileImage ||
                        "/profile2.png"
                      }
                      alt="Avatar"
                      className="rounded-full mt-5 mb-5"
                    />
                    <p>
                      <strong>Patient:</strong> {patient}{" "}
                      {reportData?.singlePatient?.firstName}{" "}
                      {reportData?.singlePatient?.lastName}
                    </p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr>
                          <th className="border px-4 py-2">Field</th>
                          <th className="border px-4 py-2">Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border px-4 py-2 font-semibold">
                            Full Name
                          </td>
                          <td className="border px-4 py-2">
                            {reportData?.singlePatient?.firstName}{" "}
                            {reportData?.singlePatient?.lastName}
                          </td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2 font-semibold">
                            Email
                          </td>
                          <td className="border px-4 py-2">
                            {reportData?.singlePatient?.email}
                          </td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2 font-semibold">
                            NIC
                          </td>
                          <td className="border px-4 py-2">
                            {reportData?.singlePatient?.nic}
                          </td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2 font-semibold">
                            Date Of Birth
                          </td>
                          <td className="border px-4 py-2">
                            {reportData?.singlePatient?.dob}
                          </td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2 font-semibold">
                            Gender
                          </td>
                          <td className="border px-4 py-2">
                            {reportData?.singlePatient?.gender}
                          </td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2 font-semibold">
                            Status
                          </td>
                          <td className="border px-4 py-2">
                            {reportData?.singlePatient?.status}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {reportType === "summary" && patient === "" && doctor !== "" && (
                <>
                  <h2 className="text-lg font-bold mb-2 text-left">
                    Summary Report
                  </h2>
                  <div className="mb-4">
                    <img
                      src={
                        reportData?.singleDoctor?.profilePhoto ||
                        "/profile2.png"
                      }
                      alt="Avatar"
                      className="rounded-full mt-5 mb-5"
                    />
                    <p>
                      <strong>Doctor:</strong> {doctor}{" "}
                      {reportData?.singleDoctor?.firstName}{" "}
                      {reportData?.singleDoctor?.lastName}
                    </p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr>
                          <th className="border px-4 py-2">Field</th>
                          <th className="border px-4 py-2">Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border px-4 py-2 font-semibold">
                            Full Name
                          </td>
                          <td className="border px-4 py-2">
                            {reportData?.singleDoctor?.firstName}{" "}
                            {reportData?.singleDoctor?.lastName}
                          </td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2 font-semibold">
                            Email
                          </td>
                          <td className="border px-4 py-2">
                            {reportData?.singleDoctor?.email}
                          </td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2 font-semibold">
                            Charge
                          </td>
                          <td className="border px-4 py-2">
                            Rs.{reportData?.singleDoctor?.charge}
                          </td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2 font-semibold">
                            Specialization
                          </td>
                          <td className="border px-4 py-2">
                            {reportData?.singleDoctor?.specialization}
                          </td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2 font-semibold">
                            Gender
                          </td>
                          <td className="border px-4 py-2">
                            {reportData?.singleDoctor?.gender}
                          </td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2 font-semibold">
                            Status
                          </td>
                          <td className="border px-4 py-2">
                            {reportData?.singleDoctor?.status
                              ? "Active"
                              : "Inactive"}
                          </td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2 font-semibold">
                            Description
                          </td>
                          <td className="border px-4 py-2">
                            {reportData?.singleDoctor?.description}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {reportType === "detailed" &&
                patient === "" &&
                doctor !== "all" && (
                  <>
                    <h2 className="text-lg font-bold mb-4 text-left">
                      Detailed Report
                    </h2>

                    {/* Doctor Info */}
                    <div className="mb-4">
                      <img
                        src={
                          reportData?.singleDoctor?.profilePhoto ||
                          "/profile2.png"
                        }
                        alt="Avatar"
                        className="rounded-full mt-5 mb-5"
                      />
                      <p>
                        <strong>Doctor:</strong> {doctor}{" "}
                        {reportData?.singleDoctor?.firstName}{" "}
                        {reportData?.singleDoctor?.lastName}
                      </p>
                    </div>

                    {/* Doctor Details Table */}
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead>
                          <tr>
                            <th className="border px-4 py-2">Field</th>
                            <th className="border px-4 py-2">Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border px-4 py-2 font-semibold">
                              Full Name
                            </td>
                            <td className="border px-4 py-2">
                              {reportData?.singleDoctor?.firstName}{" "}
                              {reportData?.singleDoctor?.lastName}
                            </td>
                          </tr>
                          <tr>
                            <td className="border px-4 py-2 font-semibold">
                              Email
                            </td>
                            <td className="border px-4 py-2">
                              {reportData?.singleDoctor?.email}
                            </td>
                          </tr>
                          <tr>
                            <td className="border px-4 py-2 font-semibold">
                              Contact Number
                            </td>
                            <td className="border px-4 py-2">
                              {reportData?.singleDoctor?.contactNumber}
                            </td>
                          </tr>
                          <tr>
                            <td className="border px-4 py-2 font-semibold">
                              Specialization
                            </td>
                            <td className="border px-4 py-2">
                              {reportData?.singleDoctor?.specialization}
                            </td>
                          </tr>
                          <tr>
                            <td className="border px-4 py-2 font-semibold">
                              SLMC License
                            </td>
                            <td className="border px-4 py-2">
                              {reportData?.singleDoctor?.slmcLicense}
                            </td>
                          </tr>
                          <tr>
                            <td className="border px-4 py-2 font-semibold">
                              NIC
                            </td>
                            <td className="border px-4 py-2">
                              {reportData?.singleDoctor?.nic}
                            </td>
                          </tr>
                          <tr>
                            <td className="border px-4 py-2 font-semibold">
                              Charge
                            </td>
                            <td className="border px-4 py-2">
                              Rs.{reportData?.singleDoctor?.charge}
                            </td>
                          </tr>
                          <tr>
                            <td className="border px-4 py-2 font-semibold">
                              Gender
                            </td>
                            <td className="border px-4 py-2">
                              {reportData?.singleDoctor?.gender}
                            </td>
                          </tr>
                          <tr>
                            <td className="border px-4 py-2 font-semibold">
                              Description
                            </td>
                            <td className="border px-4 py-2">
                              {reportData?.singleDoctor?.description}
                            </td>
                          </tr>
                          <tr>
                            <td className="border px-4 py-2 font-semibold">
                              Status
                            </td>
                            <td className="border px-4 py-2">
                              {reportData?.singleDoctor?.status
                                ? "Active"
                                : "Inactive"}
                            </td>
                          </tr>
                          <tr>
                            <td className="border px-4 py-2 font-semibold">
                              CreatedAt
                            </td>
                            <td className="border px-4 py-2">
                              {reportData?.singleDoctor?.createdAt}
                            </td>
                          </tr>
                          <tr>
                            <td className="border px-4 py-2 font-semibold">
                              UpdatedAt
                            </td>
                            <td className="border px-4 py-2">
                              {reportData?.singleDoctor?.updatedAt}
                            </td>
                          </tr>
                          <tr>
                            <td className="border px-4 py-2 font-semibold">
                              Last Login
                            </td>
                            <td className="border px-4 py-2">
                              {reportData?.singleDoctor?.lastLogin}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="overflow-x-auto my-5 mb-5">
                      <table className="min-w-full text-left">
                        <thead>
                          <tr>
                            <th>Availability ID</th>
                            <th>Day</th>
                            <th>Hospital</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reportData.availability.map((item) => (
                            <tr key={item.availabilityId}>
                              <td>{item.availabilityId}</td>
                              <td>{item.day}</td>
                              <td>{item.hospitalName}</td>
                              <td>{item.startTime}</td>
                              <td>{item.endTime}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}

              {reportType === "detailed" &&
                patient !== "all" &&
                doctor === "" && (
                  <>
                    <h2 className="text-lg font-bold mb-4 text-left">
                      Detailed Report
                    </h2>

                    {/* Patient Info */}
                    <div className="mb-4">
                      <img
                        src={
                          reportData?.singlePatient?.profileImage ||
                          "/profile2.png"
                        }
                        alt="Avatar"
                        className="rounded-full mt-5 mb-5"
                      />
                      <p>
                        <strong>Patient:</strong> {patient}{" "}
                        {reportData?.singlePatient?.firstName}{" "}
                        {reportData?.singlePatient?.lastName}
                      </p>
                    </div>

                    {/* Patient Details Table */}
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead>
                          <tr>
                            <th className="border px-4 py-2">Field</th>
                            <th className="border px-4 py-2">Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border px-4 py-2 font-semibold">
                              Full Name
                            </td>
                            <td className="border px-4 py-2">
                              {reportData?.singlePatient?.firstName}{" "}
                              {reportData?.singlePatient?.lastName}
                            </td>
                          </tr>
                          <tr>
                            <td className="border px-4 py-2 font-semibold">
                              Email
                            </td>
                            <td className="border px-4 py-2">
                              {reportData?.singlePatient?.email}
                            </td>
                          </tr>
                          <tr>
                            <td className="border px-4 py-2 font-semibold">
                              NIC
                            </td>
                            <td className="border px-4 py-2">
                              {reportData?.singlePatient?.nic}
                            </td>
                          </tr>
                          <tr>
                            <td className="border px-4 py-2 font-semibold">
                              Date Of Birth
                            </td>
                            <td className="border px-4 py-2">
                              {reportData?.singlePatient?.dob}
                            </td>
                          </tr>
                          <tr>
                            <td className="border px-4 py-2 font-semibold">
                              Gender
                            </td>
                            <td className="border px-4 py-2">
                              {reportData?.singlePatient?.gender}
                            </td>
                          </tr>
                          <tr>
                            <td className="border px-4 py-2 font-semibold">
                              Status
                            </td>
                            <td className="border px-4 py-2">
                              {reportData?.singlePatient?.status}
                            </td>
                          </tr>
                          <tr>
                            <td className="border px-4 py-2 font-semibold">
                              CreatedAt
                            </td>
                            <td className="border px-4 py-2">
                              {reportData?.singlePatient?.createdAt}
                            </td>
                          </tr>
                          <tr>
                            <td className="border px-4 py-2 font-semibold">
                              UpdatedAt
                            </td>
                            <td className="border px-4 py-2">
                              {reportData?.singlePatient?.updatedAt}
                            </td>
                          </tr>
                          <tr>
                            <td className="border px-4 py-2 font-semibold">
                              Last Login
                            </td>
                            <td className="border px-4 py-2">
                              {reportData?.singlePatient?.lastLogin}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </>
                )}

              {reportType === "appointment" && (
                <div className="mt-4">
                  <h2 className="text-lg font-bold mb-4 text-left">
                    Appointments Report
                  </h2>

                  {doctor && (
                    <p>
                      <strong>Doctor:</strong> {doctor}
                    </p>
                  )}

                  {patient && (
                    <p>
                      <strong>Patient:</strong> {patient}
                    </p>
                  )}

                  {specialty && (
                    <p>
                      <strong>Specialty:</strong> {specialty}
                    </p>
                  )}

                  {fromDate && (
                    <p>
                      <strong>From:</strong> {fromDate}
                    </p>
                  )}
                  {toDate && (
                    <p>
                      <strong>To:</strong> {toDate}
                    </p>
                  )}
                  <div className="overflow-x-auto">
                    {reportData?.appointments?.map((appointment, index) => (
                      <div key={index} className="mb-8">
                        <h2 className="text-lg font-bold mb-2">
                          Appointment {index + 1}
                        </h2>
                        <table className="min-w-full border">
                          <thead>
                            <tr>
                              <th className="border px-4 py-2">Field</th>
                              <th className="border px-4 py-2">Value</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border px-4 py-2 font-semibold">
                                Appointment Id
                              </td>
                              <td className="border px-4 py-2">
                                {appointment.appointmentId}
                              </td>
                            </tr>
                            <tr>
                              <td className="border px-4 py-2 font-semibold">
                                Doctor Id
                              </td>
                              <td className="border px-4 py-2">
                                {appointment.doctorId}
                              </td>
                            </tr>
                            <tr>
                              <td className="border px-4 py-2 font-semibold">
                                Doctor Name
                              </td>
                              <td className="border px-4 py-2">
                                {appointment.doctorName}
                              </td>
                            </tr>
                            <tr>
                              <td className="border px-4 py-2 font-semibold">
                                Patient Id
                              </td>
                              <td className="border px-4 py-2">
                                {appointment.patientId}
                              </td>
                            </tr>
                            <tr>
                              <td className="border px-4 py-2 font-semibold">
                                Patient Name
                              </td>
                              <td className="border px-4 py-2">
                                {appointment.patientName}
                              </td>
                            </tr>
                            <tr>
                              <td className="border px-4 py-2 font-semibold">
                                Hospital Id
                              </td>
                              <td className="border px-4 py-2">
                                {appointment.hospitalId}
                              </td>
                            </tr>
                            <tr>
                              <td className="border px-4 py-2 font-semibold">
                                Hospital Name
                              </td>
                              <td className="border px-4 py-2">
                                {appointment.hospitalName}
                              </td>
                            </tr>
                            <tr>
                              <td className="border px-4 py-2 font-semibold">
                                Date
                              </td>
                              <td className="border px-4 py-2">
                                {appointment.date}
                              </td>
                            </tr>
                            <tr>
                              <td className="border px-4 py-2 font-semibold">
                                Time
                              </td>
                              <td className="border px-4 py-2">
                                {appointment.time}
                              </td>
                            </tr>
                            <tr>
                              <td className="border px-4 py-2 font-semibold">
                                Charge
                              </td>
                              <td className="border px-4 py-2">
                                {appointment.charge}
                              </td>
                            </tr>
                            <tr>
                              <td className="border px-4 py-2 font-semibold">
                                Status
                              </td>
                              <td className="border px-4 py-2">
                                {appointment.status}
                              </td>
                            </tr>
                            <tr>
                              <td className="border px-4 py-2 font-semibold">
                                Special Note
                              </td>
                              <td className="border px-4 py-2">
                                {appointment.specialNote || "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td className="border px-4 py-2 font-semibold">
                                Type Of Appointment
                              </td>
                              <td className="border px-4 py-2">
                                {appointment.typeOfAppointment}
                              </td>
                            </tr>
                            <tr>
                              <td className="border px-4 py-2 font-semibold">
                                Created At
                              </td>
                              <td className="border px-4 py-2">
                                {appointment.createdAt}
                              </td>
                            </tr>
                            <tr>
                              <td className="border px-4 py-2 font-semibold">
                                Updated At
                              </td>
                              <td className="border px-4 py-2">
                                {appointment.updatedAt}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {reportType === "activity" && (
                <div className="mt-4">
                  <h2 className="text-lg font-bold mb-4 text-left">
                    User Activity Report
                  </h2>

                  {doctor && (
                    <p>
                      <strong>Doctor:</strong> {doctor}
                    </p>
                  )}

                  {patient && (
                    <p>
                      <strong>Patient:</strong> {patient}
                    </p>
                  )}
                  <div className="overflow-x-auto my-5 mb-5">
                    <table className="min-w-full">
                      <thead>
                        <tr>
                          <th className="border px-4 py-2">Field</th>
                          <th className="border px-4 py-2">Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border px-4 py-2 font-semibold">
                            User ID
                          </td>
                          <td className="border px-4 py-2">
                            {reportData?.userActivity?.userId}
                          </td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2 font-semibold">
                            User Name
                          </td>
                          <td className="border px-4 py-2">
                            {reportData?.userActivity?.userName}
                          </td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2 font-semibold">
                            Created At
                          </td>
                          <td className="border px-4 py-2">
                            {reportData?.userActivity?.createdAt}
                          </td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2 font-semibold">
                            Updated At
                          </td>
                          <td className="border px-4 py-2">
                            {reportData?.userActivity?.updatedAt}
                          </td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2 font-semibold">
                            Last Login
                          </td>
                          <td className="border px-4 py-2">
                            {reportData?.userActivity?.lastLogin}
                          </td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2 font-semibold">
                            Last Appointment CreatedAt
                          </td>
                          <td className="border px-4 py-2">
                            {reportData?.userActivity?.lastAppointmentCreatedAt}
                          </td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2 font-semibold">
                            Last Appointment Status
                          </td>
                          <td className="border px-4 py-2">
                            {reportData?.userActivity?.lastAppointmentStatus}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* More report variations here... */}
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="mt-4 px-10 py-1 bg-[#007e8556] text-[#006369] rounded-lg hover:bg-[#007e8589] cursor-pointer"
            >
              Download PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
