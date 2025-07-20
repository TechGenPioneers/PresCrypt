"use client";
import React, { useState, useRef, useEffect } from "react";
import DateTimeDisplay from "../DoctorComponents/DateTimeDisplay";
import PageHeaderDisplay from "../DoctorComponents/PageHeaderDisplay"
import ReportsService from "../services/ReportsService";
import { Input, Button, Checkbox } from "@material-tailwind/react";
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
} from "lucide-react";
import Select from "react-select";
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
      <PageHeaderDisplay title={Title}/>
      <div className="flex flex-col items-center px-4">
        {/* Report Generation Form */}
        <div className="bg-gradient-to-br from-[#f3faf7] to-[#e8f5f0] p-6 rounded-[20px] w-full max-w-2xl shadow-2xl border border-green-100">
          {/* Header with improved styling */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center gap-3">
              <h2 className="text-2xl font-bold text-[#094A4D]">
                Generate Reports
              </h2>
            </div>
          </div>

          <div className="space-y-6">
            {/* Date Range Section */}
            <div className="bg-white p-4 rounded-[15px] shadow-sm border border-green-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-green-100 rounded-[10px]">
                  <Calendar className="w-5 h-5 text-green-600 cursor-pointer" />
                </div>
                <h3 className="text-lg font-semibold text-[#094A4D]">
                  Date Range
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative" ref={fromDateRef}>
                  <label className="block text-sm font-medium text-[#094A4D] mb-1">
                    From Date:
                  </label>
                  <button
                    onClick={() =>
                      setShowFromDateCalendar(!showFromDateCalendar)
                    }
                    className="w-full border-2 border-green-200 rounded-[10px] px-4 py-3 text-[#094A4D] flex justify-between items-center hover:border-green-400 transition-all duration-200 bg-white"
                  >
                    <span
                      className={
                        formData.fromDate ? "text-[#094A4D]" : "text-gray-400"
                      }
                    >
                      {formData.fromDate
                        ? format(formData.fromDate, "MM/dd/yyyy")
                        : "Select start date"}
                    </span>
                    <Calendar className="w-5 h-5 text-green-500 cursor-pointer" />
                  </button>
                  {showFromDateCalendar && (
                    <div className="absolute z-15 mt-1 w-full">
                      <DayPicker
                        mode="single"
                        selected={formData.fromDate}
                        onSelect={(date) => handleDateChange("fromDate", date)}
                        className="bg-white p-3 shadow-lg"
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
                  <label className="block text-sm font-medium text-[#094A4D] mb-1">
                    To Date:
                  </label>
                  <button
                    onClick={() => setShowToDateCalendar(!showToDateCalendar)}
                    className="w-full border-2 border-green-200 rounded-[10px] px-4 py-3 text-[#094A4D] flex justify-between items-center hover:border-green-400 transition-all duration-200 bg-white"
                  >
                    <span
                      className={
                        formData.toDate ? "text-[#094A4D]" : "text-gray-400"
                      }
                    >
                      {formData.toDate
                        ? format(formData.toDate, "MM/dd/yyyy")
                        : "Select end date"}
                    </span>
                    <Calendar className="w-5 h-5 text-green-500" />
                  </button>
                  {showToDateCalendar && (
                    <div className="absolute z-10 mt-1 w-full">
                      <DayPicker
                        mode="single"
                        selected={formData.toDate}
                        onSelect={(date) => handleDateChange("toDate", date)}
                        className="bg-white p-3 shadow-lg"
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
            <div className="bg-white p-4 rounded-[15px] shadow-sm border border-green-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-[10px]">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-[#094A4D]">
                  Patient Selection
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 bg-green-50 rounded-[10px] border border-green-200">
                  <Checkbox
                    checked={selectAll}
                    onChange={toggleSelectAll}
                    className="h-5 w-5"
                  />
                  <span className="text-sm font-medium text-[#094A4D]">
                    Generate reports for all patients
                  </span>
                </div>

                {!selectAll && (
                  <div>
                    <label className="block text-sm font-medium text-[#094A4D] mb-2">
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
                      className="border-green-200 focus:border-green-400 rounded-[10px]"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Report Type Section */}
            <div className="bg-white p-4 rounded-[15px] shadow-sm border border-green-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-[10px]">
                  <FileText className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-[#094A4D]">
                  Report Type
                </h3>
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
                placeholder="Choose report type"
              />
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
              className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 disabled:from-gray-400 disabled:to-gray-500 text-white w-full py-4 rounded-[10px] shadow-lg hover:shadow-xl disabled:transform-none disabled:hover:scale-100  cursor-pointer"
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
              <div className="bg-white p-6 rounded-[15px] shadow-sm border border-green-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-100 rounded-[10px]">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#094A4D]">
                    Generated Reports
                  </h3>
                </div>

                <div className="space-y-3">
                  {generatedReports.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-[10px] hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-white rounded-[10px] shadow-sm">
                          <FileText className="w-5 h-5 text-green-600" />
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
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-[10px] text-xs font-medium">
                              {report.type}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleDownload(report)}
                        className="bg-[#094A4D] hover:bg-[#0b6669] text-white px-6 py-2 rounded-[10px] flex items-center gap-2 shadow-md hover:shadow-lg"
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
      <DateTimeDisplay />
    </div>
  );
}
