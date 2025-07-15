"use client";
import React, { useState, useRef, useEffect } from "react";
import Footer from "../../Components/footer/Footer";
import Sidebar from "../DoctorComponents/DoctorSidebar";
import DateTimeDisplay from "../DoctorComponents/DateTimeDisplay";
import ReportsService from "../services/ReportsService"; 
import { Input, Button, Checkbox } from "@material-tailwind/react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { FaCalendarAlt } from "react-icons/fa";
import Select from "react-select";
import useAuthGuard from "@/utils/useAuthGuard";

export default function Page() {
  useAuthGuard("Doctor"); // Ensure the user is authenticated as a Doctor
  const Title = "Reports";
  const [formData, setFormData] = useState({
    fromDate: null,
    toDate: null,
    patient: null,
    reportType: "",
  });
  const [generatedReports, setGeneratedReports] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errors, setErrors] = useState({});
  const [showFromDateCalendar, setShowFromDateCalendar] = useState(false);
  const [showToDateCalendar, setShowToDateCalendar] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [reportTypeOptions] = useState([
    "Summary Report",
    "Detailed Report",
    "Appointments History",
  ]);

  const fromDateRef = useRef(null);
  const toDateRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fromDateRef.current && !fromDateRef.current.contains(event.target)) {
        setShowFromDateCalendar(false);
      }
      if (toDateRef.current && !toDateRef.current.contains(event.target)) {
        setShowToDateCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleSelectAll = () => {
    if (selectAll) {
      setFormData((prev) => ({ ...prev, patient: null }));
    } else {
      setFormData((prev) => ({
        ...prev,
        patient: {
          id: "all",
          name: "All Patients",
        },
      }));
    }
    setSelectAll(!selectAll);
  };

  const handleDateChange = (name, date) => {
    if (!date) return;
    // Create a new date that represents the same UTC date
    const utcDate = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    setFormData((prev) => ({ ...prev, [name]: utcDate }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fromDate) newErrors.fromDate = "From date is required";
    if (!formData.toDate) newErrors.toDate = "To date is required";
    if (
      formData.fromDate &&
      formData.toDate &&
      formData.fromDate > formData.toDate
    ) {
      newErrors.dateRange = "From date cannot be after To date";
    }
    if (!formData.reportType)
      newErrors.reportType = "Please select a report type";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerate = async () => {
    if (!validateForm()) return;

    setIsGenerating(true);
    try {
      const patientId =
        formData.patient?.id === "all" ? "all" : formData.patient?.id;

      const response = await ReportsService.generateReport({
        fromDate: formData.fromDate,
        toDate: formData.toDate,
        patientId,
        reportType: formData.reportType,
        doctorId: "D002", // Replace this with dynamic doctorId if needed
      });

      const reportDate = format(new Date(), "yyyyMMdd");
      const patientIdentifier =
        patientId === "all" ? "AllPatients" : `Patient-${patientId}`;
      const filename = `${formData.reportType.replace(
        /\s+/g,
        "-"
      )}_${patientIdentifier}_${reportDate}.pdf`;

      const blob = new Blob([response.data], { type: "application/pdf" });
      const reportUrl = URL.createObjectURL(blob);

      setGeneratedReports((prev) => [
        ...prev,
        {
          id: Date.now(),
          name: filename,
          url: reportUrl,
          date: new Date(),
          patient: formData.patient?.name || "All Patients",
          type: formData.reportType,
        },
      ]);
    } catch (error) {
      console.error("Error generating report:", error);
      alert(error.response?.data?.message || "Failed to generate report");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (report) => {
    const link = document.createElement("a");
    link.href = report.url;
    link.setAttribute("download", report.name);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };

  return (
    <div className="flex flex-col min-h-screen ml-32">
      <div className="flex flex-grow">
        <Sidebar />
        <div className="flex-grow p-2 bg-[#D4E9EA] min-h-screen">
          <div className="bg-white h-full w-full">
            <DateTimeDisplay title={Title} />
            <div className="flex flex-col items-center pt-8 px-4">
              {/* Report Generation Form */}
              <div className="bg-[#E9FAF2] p-6 rounded-[20px] w-full max-w-md space-y-4 shadow-2xl mb-8">
                <h2 className="text-xl font-semibold text-[#094A4D] text-center">
                  Generate Reports
                </h2>

                {/* Date pickers */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#094A4D]">
                    Select Date Range:
                  </label>
                  <div className="flex gap-4 mt-2">
                    <div className="relative w-full" ref={fromDateRef}>
                      <button
                        onClick={() =>
                          setShowFromDateCalendar(!showFromDateCalendar)
                        }
                        className="w-full border rounded-[10px] px-4 py-2 text-[#094A4D] border-[#094A4D] flex justify-between cursor-pointer"
                      >
                        <span>
                          {formData.fromDate
                            ? format(formData.fromDate, "MM/dd/yyyy")
                            : "From Date"}
                        </span>
                        <span>
                          <FaCalendarAlt className="mt-1  text-[#094A4D]" />
                        </span>
                      </button>
                      {showFromDateCalendar && (
                        <div className="absolute z-10 bg-white p-2 shadow-md rounded-md mt-1">
                          <DayPicker
                            mode="single"
                            selected={formData.fromDate}
                            onSelect={(date) =>
                              handleDateChange("fromDate", date)
                            }
                          />
                        </div>
                      )}
                      {errors.fromDate && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.fromDate}
                        </p>
                      )}
                    </div>

                    <div className="relative w-full" ref={toDateRef}>
                      <button
                        onClick={() =>
                          setShowToDateCalendar(!showToDateCalendar)
                        }
                        className="w-full border rounded-[10px] px-4 py-2 text-[#094A4D] border-[#094A4D] flex justify-between cursor-pointer"
                      >
                        <span>
                          {formData.toDate
                            ? format(formData.toDate, "MM/dd/yyyy")
                            : "To Date"}
                        </span>
                        <span>
                          <FaCalendarAlt className="mt-1 text-[#094A4D]" />
                        </span>
                      </button>
                      {showToDateCalendar && (
                        <div className="absolute z-10 bg-white p-2 shadow-md rounded-md mt-1">
                          <DayPicker
                            mode="single"
                            selected={formData.toDate}
                            onSelect={(date) =>
                              handleDateChange("toDate", date)
                            }
                          />
                        </div>
                      )}
                      {errors.toDate && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.toDate}
                        </p>
                      )}
                    </div>
                  </div>
                  {errors.dateRange && (
                    <p className="text-red-500 text-xs">{errors.dateRange}</p>
                  )}
                </div>

                {/* Patient Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#094A4D]">
                    Patient:
                  </label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectAll}
                      onChange={toggleSelectAll}
                      ripple={false}
                      className="h-4 w-4 rounded border-gray-300 accent-[#094A4D] focus:ring-[#094A4D]"
                    />
                    <span className="text-sm text-[#094A4D]">
                      Generate for All Patients
                    </span>
                  </div>
                  {!selectAll && (
                    <Input
                      placeholder="Enter Patient ID"
                      value={formData.patient?.id || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          patient: { id: e.target.value, name: e.target.value },
                        })
                      }
                      className="rounded-[10px] border border-[#094A4D]"
                    />
                  )}
                </div>

                <Select
                  options={reportTypeOptions.map((option) => ({
                    value: option,
                    label: option,
                  }))}
                  value={
                    formData.reportType
                      ? {
                          value: formData.reportType,
                          label: formData.reportType,
                        }
                      : null
                  }
                  onChange={(selectedOption) => {
                    setFormData((prev) => ({
                      ...prev,
                      reportType: selectedOption.value,
                    }));
                    setErrors((prev) => ({ ...prev, reportType: "" }));
                  }}
                  styles={{
                    control: (provided, state) => ({
                      ...provided,
                      minHeight: "42px",
                      borderRadius: "10px",
                      borderColor: errors.reportType ? "#ef4444" : "#094A4D",
                      backgroundColor: "transparent",
                      boxShadow: state.isFocused ? "0 0 0 1px #094A4D" : "none",
                      "&:hover": {
                        borderColor: "#094A4D",
                        cursor: "pointer",
                      },
                      cursor: "pointer",
                    }),
                    option: (provided, state) => ({
                      ...provided,
                      backgroundColor: state.isFocused ? "#094A4D" : "white",
                      color: state.isFocused ? "white" : "#094A4D",
                      padding: "8px 12px",
                      cursor: "pointer",
                    }),
                    menu: (provided) => ({
                      ...provided,
                      borderRadius: "10px",
                      border: "1px solid #094A4D",
                      boxShadow: "none",
                    }),
                    singleValue: (provided) => ({
                      ...provided,
                      color: "#094A4D",
                      cursor: "pointer",
                    }),
                    dropdownIndicator: (provided) => ({
                      ...provided,
                      cursor: "pointer",
                    }),
                    indicatorSeparator: (provided) => ({
                      ...provided,
                      cursor: "pointer",
                    }),
                  }}
                  placeholder="Select report type"
                  className="basic-single"
                  classNamePrefix="select"
                />

                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="bg-[#094A4D] hover:bg-[#0b6669] text-white w-full mt-4 py-3 rounded-[10px] cursor-pointer"
                >
                  {isGenerating ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Generating...
                    </span>
                  ) : (
                    "Generate Report"
                  )}
                </Button>

                {/* Generated Reports List */}
                {generatedReports.length > 0 && (
                  <div className="space-y-3">
                    {generatedReports.map((report) => (
                      <div
                        key={report.id}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-[12px]"
                      >
                        <div>
                          <h3 className="font-medium text-gray-800">
                            {report.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {format(report.date, "MMM dd, yyyy h:mm a")} •{" "}
                            {report.patient} • {report.type}
                          </p>
                        </div>
                        <Button
                          onClick={() => handleDownload(report)}
                          className="bg-[#094A4D] hover:bg-[#0b6669] text-white px-4 py-2 rounded-[8px] cursor-pointer min-w-[100px]"
                        >
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
