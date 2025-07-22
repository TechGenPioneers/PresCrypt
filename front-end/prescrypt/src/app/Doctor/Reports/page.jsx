"use client";
import React, { useState, useRef, useEffect } from "react";
import PageHeaderDisplay from "../DoctorComponents/PageHeaderDisplay";
import ReportsService from "../services/ReportsService";
import { Input, Button } from "@material-tailwind/react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import {
  Calendar,
  Download,
  FileText,
  Users,
  Clock,
  CheckCircle,
  ChevronDown,
} from "lucide-react";
import useAuthGuard from "@/utils/useAuthGuard";

export default function Page() {
  useAuthGuard("Doctor");
  const Title = "Reports";
  const doctorId =
    typeof window !== "undefined" ? localStorage.getItem("doctorId") : null;

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
  const [showReportTypeDropdown, setShowReportTypeDropdown] = useState(false);
  const [reportTypeOptions] = useState([
    "Summary Report",
    "Detailed Report",
    "Appointments History",
  ]);

  const fromDateRef = useRef(null);
  const toDateRef = useRef(null);
  const reportTypeRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fromDateRef.current && !fromDateRef.current.contains(event.target)) {
        setShowFromDateCalendar(false);
      }
      if (toDateRef.current && !toDateRef.current.contains(event.target)) {
        setShowToDateCalendar(false);
      }
      if (
        reportTypeRef.current &&
        !reportTypeRef.current.contains(event.target)
      ) {
        setShowReportTypeDropdown(false);
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
        doctorId: doctorId,
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
    <div className="p-1 mb-5">
      <PageHeaderDisplay title={Title} />
      <div className="flex flex-col items-center px-4">
        {/* Report Generation Form */}
        <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-6 rounded-[20px] w-full max-w-2xl shadow-2xl border border-teal-200">
          {/* Header with improved styling */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center gap-3">
              <h2 className="text-2xl font-bold text-teal-800">
                Generate Reports
              </h2>
            </div>
          </div>

          <div className="space-y-6">
            {/* Date Range Section */}
            <div className="bg-white p-4 rounded-[15px] shadow-sm border border-teal-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-teal-100 rounded-[10px]">
                  <Calendar className="w-5 h-5 text-teal-600 cursor-pointer" />
                </div>
                <h3 className="text-lg font-semibold text-teal-800">
                  Date Range
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative" ref={fromDateRef}>
                  <label className="block text-sm font-medium text-teal-800 mb-1">
                    From Date:
                  </label>
                  <button
                    onClick={() =>
                      setShowFromDateCalendar(!showFromDateCalendar)
                    }
                    className="w-full border-2 border-teal-200 rounded-[10px] px-4 py-3 text-teal-800 flex justify-between items-center hover:border-teal-400 transition-all duration-200 bg-white"
                  >
                    <span
                      className={
                        formData.fromDate ? "text-teal-800" : "text-gray-400"
                      }
                    >
                      {formData.fromDate
                        ? format(formData.fromDate, "MM/dd/yyyy")
                        : "Select start date"}
                    </span>
                    <Calendar className="w-5 h-5 text-teal-500 cursor-pointer" />
                  </button>
                  {showFromDateCalendar && (
                    <div className="absolute z-20 mt-1 bg-white rounded-lg shadow-xl border border-teal-200 overflow-hidden">
                      <DayPicker
                        mode="single"
                        selected={formData.fromDate}
                        onSelect={(date) => handleDateChange("fromDate", date)}
                        className="bg-white p-3"
                        classNames={{
                          months:
                            "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                          month: "space-y-4",
                          caption:
                            "flex justify-center pt-1 relative items-center",
                          caption_label: "text-sm font-medium text-teal-800",
                          nav: "space-x-1 flex items-center",
                          nav_button:
                            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-teal-600",
                          nav_button_previous: "absolute left-1",
                          nav_button_next: "absolute right-1",
                          table: "w-full border-collapse space-y-1",
                          head_row: "flex",
                          head_cell:
                            "text-teal-600 rounded-md w-9 font-normal text-[0.8rem]",
                          row: "flex w-full mt-2",
                          cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-teal-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                          day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-teal-100 rounded-md",
                          day_selected:
                            "bg-teal-500 text-white hover:bg-teal-500 hover:text-white focus:bg-teal-500 focus:text-white",
                          day_today: "bg-teal-100 text-teal-800",
                          day_outside: "text-gray-400 opacity-50",
                          day_disabled: "text-gray-400 opacity-50",
                          day_hidden: "invisible",
                        }}
                      />
                    </div>
                  )}
                  {errors.fromDate && (
                    <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      {errors.fromDate}
                    </p>
                  )}
                </div>

                <div className="relative" ref={toDateRef}>
                  <label className="block text-sm font-medium text-teal-800 mb-1">
                    To Date:
                  </label>
                  <button
                    onClick={() => setShowToDateCalendar(!showToDateCalendar)}
                    className="w-full border-2 border-teal-200 rounded-[10px] px-4 py-3 text-teal-800 flex justify-between items-center hover:border-teal-400 transition-all duration-200 bg-white"
                  >
                    <span
                      className={
                        formData.toDate ? "text-teal-800" : "text-gray-400"
                      }
                    >
                      {formData.toDate
                        ? format(formData.toDate, "MM/dd/yyyy")
                        : "Select end date"}
                    </span>
                    <Calendar className="w-5 h-5 text-teal-500" />
                  </button>
                  {showToDateCalendar && (
                    <div className="absolute z-20 mt-1 bg-white rounded-lg shadow-xl border border-teal-200 overflow-hidden">
                      <DayPicker
                        mode="single"
                        selected={formData.toDate}
                        onSelect={(date) => handleDateChange("toDate", date)}
                        className="bg-white p-3"
                        classNames={{
                          months:
                            "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                          month: "space-y-4",
                          caption:
                            "flex justify-center pt-1 relative items-center",
                          caption_label: "text-sm font-medium text-teal-800",
                          nav: "space-x-1 flex items-center",
                          nav_button:
                            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-teal-600",
                          nav_button_previous: "absolute left-1",
                          nav_button_next: "absolute right-1",
                          table: "w-full border-collapse space-y-1",
                          head_row: "flex",
                          head_cell:
                            "text-teal-600 rounded-md w-9 font-normal text-[0.8rem]",
                          row: "flex w-full mt-2",
                          cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-teal-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                          day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-teal-100 rounded-md",
                          day_selected:
                            "bg-teal-500 text-white hover:bg-teal-500 hover:text-white focus:bg-teal-500 focus:text-white",
                          day_today: "bg-teal-100 text-teal-800",
                          day_outside: "text-gray-400 opacity-50",
                          day_disabled: "text-gray-400 opacity-50",
                          day_hidden: "invisible",
                        }}
                      />
                    </div>
                  )}
                  {errors.toDate && (
                    <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      {errors.toDate}
                    </p>
                  )}
                </div>
              </div>
              {errors.dateRange && (
                <p className="text-red-500 text-xs mt-3 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.dateRange}
                </p>
              )}
            </div>

            {/* Patient Selection Section */}
            <div className="bg-white p-4 rounded-[15px] shadow-sm border border-teal-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-teal-100 rounded-[10px]">
                  <Users className="w-5 h-5 text-teal-600" />
                </div>
                <h3 className="text-lg font-semibold text-teal-800">
                  Patient Selection
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 bg-teal-50 rounded-[10px] border border-teal-200 p-3">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={toggleSelectAll}
                    className="h-5 w-5 text-teal-500 rounded border-teal-300 focus:ring-teal-500"
                  />
                  <span className="text-sm font-medium text-teal-800">
                    Generate reports for all patients
                  </span>
                </div>

                {!selectAll && (
                  <div>
                    <label className="block text-sm font-medium text-teal-800 mb-2">
                      Patient ID
                    </label>
                    <Input
                      placeholder="Enter specific patient ID"
                      value={formData.patient?.id || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          patient: { id: e.target.value, name: e.target.value },
                        })
                      }
                      className="border-teal-200 focus:border-teal-400 rounded-[10px]"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Report Type Section */}
            <div className="bg-white p-4 rounded-[15px] shadow-sm border border-teal-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-teal-100 rounded-[10px]">
                  <FileText className="w-5 h-5 text-teal-600" />
                </div>
                <h3 className="text-lg font-semibold text-teal-800">
                  Report Type
                </h3>
              </div>

              <div className="relative" ref={reportTypeRef}>
                <button
                  onClick={() =>
                    setShowReportTypeDropdown(!showReportTypeDropdown)
                  }
                  className="w-full border-2 border-teal-200 rounded-[10px] px-4 py-3 text-teal-800 flex justify-between items-center hover:border-teal-400 transition-all duration-200 bg-white"
                >
                  <span
                    className={
                      formData.reportType ? "text-teal-800" : "text-gray-400"
                    }
                  >
                    {formData.reportType || "Choose report type"}
                  </span>
                  <ChevronDown className="w-5 h-5 text-teal-500" />
                </button>

                {showReportTypeDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-teal-200 rounded-[10px] shadow-lg">
                    {reportTypeOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            reportType: option,
                          }));
                          setErrors((prev) => ({ ...prev, reportType: "" }));
                          setShowReportTypeDropdown(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-teal-50 text-teal-800 first:rounded-t-[10px] last:rounded-b-[10px] transition-colors"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {errors.reportType && (
                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.reportType}
                </p>
              )}
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 text-white w-full py-4 rounded-[10px] shadow-lg hover:shadow-xl disabled:transform-none disabled:hover:scale-100  cursor-pointer"
            >
              {isGenerating ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-[10px] h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                  Generating Report...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Generate Report
                </span>
              )}
            </Button>

            {/* Generated Reports List */}
            {generatedReports.length > 0 && (
              <div className="bg-white p-6 rounded-[15px] shadow-sm border border-teal-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-teal-100 rounded-[10px]">
                    <CheckCircle className="w-5 h-5 text-teal-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-teal-800">
                    Generated Reports
                  </h3>
                </div>

                <div className="space-y-3">
                  {generatedReports.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-teal-50 to-teal-100 border border-teal-200 rounded-[10px] hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-white rounded-[10px] shadow-sm">
                          <FileText className="w-5 h-5 text-teal-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-1">
                            {report.name}
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {format(report.date, "MMM dd, yyyy")}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {report.patient}
                            </span>
                            <span className="px-2 py-1 bg-teal-100 text-teal-700 rounded-[10px] text-xs font-medium">
                              {report.type}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleDownload(report)}
                        className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-[10px] flex items-center gap-2 shadow-md hover:shadow-lg"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mb-8"></div>
    </div>
  );
}
