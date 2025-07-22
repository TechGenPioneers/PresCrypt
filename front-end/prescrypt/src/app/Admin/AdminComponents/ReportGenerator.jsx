"use client";
import React, { useState, useRef, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { GetAllDetails, GetReportDetails } from "../service/AdminReportService";
import {
  Calendar,
  FileText,
  Download,
  Filter,
  AlertCircle,
  User,
  Stethoscope,
  Building,
} from "lucide-react";

//searchable dropdown
const SearchableDropdown = ({
  options,
  value,
  onChange,
  disabled,
  placeholder,
  required,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [dropdownRef, setDropdownRef] = useState(null);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef && !dropdownRef.contains(event.target)) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div ref={setDropdownRef} className="relative w-full">
      <input
        type="text"
        value={selectedLabel || searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => !disabled && setShowOptions(true)}
        disabled={disabled}
        placeholder={placeholder}
        required={required}
        className={`w-full px-4 py-3 pr-10 text-gray-700 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
          disabled
            ? "opacity-50 cursor-not-allowed bg-gray-50"
            : "hover:border-gray-300"
        }`}
      />
      {value && !disabled && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            showOptions ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
      {showOptions && !disabled && (
        <ul className="absolute z-5 w-full bg-white border border-gray-200 rounded-xl mt-1 max-h-48 overflow-y-auto shadow-lg">
          {filteredOptions.map((opt) => (
            <li
              key={opt.value}
              onMouseDown={() => handleSelect(opt.value)}
              className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors first:rounded-t-xl last:rounded-b-xl"
            >
              {opt.label}
            </li>
          ))}
          {filteredOptions.length === 0 && (
            <li className="px-4 py-3 text-gray-500 text-center">
              No results found
            </li>
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const reportRef = useRef(null);

  const handleGenerate = async () => {
    if (!reportType) {
      setErrorMessage("Please select a Report Type.");
      return;
    }
    setErrorMessage("");
    setIsGenerating(true);
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

    if (doctor === "all") {
      finalPatient = "";
      setPatient("");
    }

    if (patient === "all") {
      finalDoctor = "";
      setDoctor("");
    }

    if (doctor === "all" || patient === "all") {
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
      const reportDatas = await GetReportDetails(reportDetails); // get filtered data for report
      console.log("Fetched reportDatas:", reportDatas);
      setReportData(reportDatas); // This triggers useEffect
    } catch (err) {
      console.error("Failed to get the report data", err);
    }
    setIsGenerating(true);
  };

  useEffect(() => {
    if (reportData) {
      console.log("Updated reportData:", reportData);
      // Now open the modal only when reportData is updated
      setIsModalOpen(true);
    }
  }, [reportData]);

  //generate pdf
  const handleDownload = async () => {
    setIsDownloading(true);
    const element = reportRef.current;

    const canvas = await html2canvas(element, { scale: 2 }); // scale can be 2–3 for balance
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    const todayDate = new Date().toISOString().split("T")[0];

    while (heightLeft > 0) {
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      position -= pageHeight;

      if (heightLeft > 0) {
        pdf.addPage();
      }
    }

    pdf.save(`${todayDate}-report.pdf`);
    setIsDownloading(false);
    setIsModalOpen(false);
    setIsGenerating(false)
  };

  const [doctorOptions, setDoctorOptions] = useState([]);
  const [patientOptions, setPatientOptions] = useState([]);
  const [specialtyOptions, setSpecialtyOptions] = useState([]);

  // get all patients , doctors names and specialties
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

  const handleCloseModel = () => {
    setIsGenerating(false);
    setIsModalOpen(false);
  };

  if (!dateTime) return null;

  const formattedDate = dateTime.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const reportTypeOptions = [
    { value: "summary", label: "Summary" },
    { value: "detailed", label: "Detailed" },
    { value: "appointment", label: "Appointment Report" },
    { value: "activity", label: "User Activity Report" },
  ];

  const filteredReportTypeOptions =
    doctor === "all" ||
    patient === "all" ||
    (patient === "" && specialty !== "") // Show only "summary" and "detailed"
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
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Reports</h1>
              <p className="text-gray-600 mt-1">{formattedDate}</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-visible">
              {/* Form Header */}
              <div className="bg-[#c1d7cd] px-8 py-6 rounded-md">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[#09424D]/20 rounded-lg flex items-center justify-center">
                    <Filter className="w-4 h-4 text-[#09424D]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#09424D]">
                      Generate Report
                    </h2>
                    <p className="text-[#09424D] text-sm">
                      Configure your report parameters
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Body */}
              <div className="p-8 space-y-6">
                {/* Date Range Section */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <Calendar className="w-4 h-4 text-[#09424D]" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Date Range
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        From Date
                      </label>
                      <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        disabled={["summary", "detailed", "activity"].includes(
                          reportType
                        )}
                        className={`w-full px-4 py-3 text-gray-700 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                          ["summary", "detailed", "activity"].includes(
                            reportType
                          )
                            ? "opacity-50 cursor-not-allowed bg-gray-50"
                            : "hover:border-gray-300"
                        }`}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        To Date
                      </label>
                      <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        disabled={["summary", "detailed", "activity"].includes(
                          reportType
                        )}
                        className={`w-full px-4 py-3 text-gray-700 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                          ["summary", "detailed", "activity"].includes(
                            reportType
                          )
                            ? "opacity-50 cursor-not-allowed bg-gray-50"
                            : "hover:border-gray-300"
                        }`}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Filters Section */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <Filter className="w-4 h-4 text-[#09424D]" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Filters
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                        <User className="w-4 h-4" />
                        <span>Patient</span>
                      </label>
                      <SearchableDropdown
                        options={patientOptions}
                        value={patient}
                        onChange={setPatient}
                        disabled={
                          doctor === "all" ||
                          (reportType === "detailed" && doctor !== "") ||
                          (reportType === "summary" && doctor !== "") ||
                          (reportType === "summary" && specialty !== "")
                        }
                        placeholder="-- Select Patient --"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                        <Stethoscope className="w-4 h-4" />
                        <span>Doctor</span>
                      </label>
                      <SearchableDropdown
                        options={doctorOptions}
                        value={doctor}
                        onChange={setDoctor}
                        disabled={
                          patient === "all" ||
                          specialty !== "" ||
                          (reportType === "detailed" && patient !== "") ||
                          (reportType === "summary" && patient !== "")
                        }
                        placeholder="-- Select Doctor --"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                        <Building className="w-4 h-4" />
                        <span>Specialty</span>
                      </label>
                      <SearchableDropdown
                        options={specialtyOptions}
                        value={specialty}
                        onChange={setSpecialty}
                        disabled={
                          doctor !== "" ||
                          (patient === "all" && reportType !== "appointment") ||
                          patient === "all" ||
                          reportType === "activity"
                        }
                        placeholder="-- Select Specialty --"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                        <FileText className="w-4 h-4" />
                        <span>
                          Report Type <span className="text-red-500">*</span>
                        </span>
                      </label>
                      <SearchableDropdown
                        options={filteredReportTypeOptions}
                        value={reportType}
                        onChange={setReportType}
                        placeholder="-- Select Report Type --"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {errorMessage && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <p className="text-red-700 font-medium">{errorMessage}</p>
                  </div>
                )}
              </div>

              {/* Form Footer */}
              <div className="bg-gray-50 px-8 py-6 border-t border-gray-100">
                <div className="flex justify-end">
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="flex items-center gap-4 px-8 py-3  bg-[#A9C9CD] text-[#09424D]  font-semibold rounded-xl hover:bg-[#91B4B8]  transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>Generate Report</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal to show the generated report */}
      {isModalOpen && (
        <div className="fixed inset-0  bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-h-[80%] overflow-auto p-6 rounded-lg shadow-xl relative">
            <button
              onClick={handleCloseModel}
              className="absolute top-2 right-2 text-red-600 text-lg font-bold cursor-pointer"
            >
              ×
            </button>

            {/* PDF Preview */}
            <div ref={reportRef} className="text-[#09424D] p-5">
              {/* Header */}
              <header className="flex flex-col mb-4">
                <div className="mt-2 text-right text-sm">
                  <p>Generated at - {new Date().toLocaleDateString()}</p>
                  <p>Generated by - Admin</p>
                </div>
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

              {/* summary Info for all doctors*/}
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

              {/* summary Info for all doctors same specialists*/}
              {reportType === "summary" &&
                patient === "" &&
                doctor === "" &&
                specialty !== "" && (
                  <>
                    <h2 className="text-lg font-bold mb-2 text-left">
                      Summary Report
                    </h2>
                    <p>
                      <strong>Doctor: {specialty} - All Doctors</strong>
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

              {/* summary Info for all patients*/}
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

              {/* summary Info for patient*/}
              {reportType === "summary" &&
                patient !== "" &&
                patient !== "all" &&
                doctor === "" && (
                  <>
                    <h2 className="text-lg font-bold mb-2 text-left">
                      Summary Report
                    </h2>
                    <div className="mb-4">
                      <img
                        src={
                          reportData?.singlePatient?.profileImage &&
                          reportData?.singlePatient?.profileImage.trim() !== ""
                            ? `data:image/jpeg;base64,${reportData?.singlePatient?.profileImage}`
                            : "/profile2.png"
                        }
                        alt="Avatar"
                        className="rounded-full mt-5 mb-5 w-52 h-52"
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
              {/* summary Info for doctor*/}
              {reportType === "summary" &&
                patient === "" &&
                doctor !== "" &&
                doctor !== "all" && (
                  <>
                    <h2 className="text-lg font-bold mb-2 text-left">
                      Summary Report
                    </h2>
                    <div className="mb-4">
                      <img
                        src={
                          reportData?.singleDoctor?.profilePhoto &&
                          reportData?.singleDoctor?.profilePhoto.trim() !== ""
                            ? `data:image/jpeg;base64,${reportData?.singleDoctor?.profilePhoto}`
                            : "/profile2.png"
                        }
                        alt="Avatar"
                        className="rounded-full mt-5 mb-5 w-52 h-52"
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
              {/* detailed Info for doctor*/}
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
                          reportData.singleDoctor.profilePhoto &&
                          reportData.singleDoctor.profilePhoto.trim() !== ""
                            ? `data:image/jpeg;base64,${reportData.singleDoctor.profilePhoto}`
                            : "/profile2.png"
                        }
                        alt="Avatar"
                        className="rounded-full mt-5 mb-5 w-52 h-52"
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
              {/* detailed Info for patient*/}
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
                          reportData?.singlePatient?.profileImage &&
                          reportData?.singlePatient?.profileImage.trim() !== ""
                            ? `data:image/jpeg;base64,${reportData?.singlePatient?.profileImage}`
                            : "/profile2.png"
                        }
                        alt="Avatar"
                        className="rounded-full mt-5 mb-5 w-52 h-52"
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
              {/*  appointment info*/}
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
              {/* activity info*/}
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
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center gap-4 px-8 py-3  bg-[#A9C9CD] text-[#09424D]  font-semibold rounded-xl hover:bg-[#91B4B8]  transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {isDownloading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Downloading...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
