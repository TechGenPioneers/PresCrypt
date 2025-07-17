"use client";
import React from "react";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ChangePatientStatus,
  GetPatientById,
} from "../service/AdminPatientService";
import { Spinner } from "@material-tailwind/react";
import {
  Calendar,
  Phone,
  Mail,
  CreditCard,
  Shield,
  Clock,
  User,
  Activity,
} from "lucide-react";
import { X, UserX, ArrowLeft, Search, Users } from "lucide-react";
const PatientDetails = ({ patientId }) => {
  const [patientData, setPatientsData] = useState(null);
  const [dateTime, setDateTime] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState("");
  const [showNotFound, setShowNotFound] = useState(false);
  // Inside your component
  const [filterStatus, setFilterStatus] = useState("All");
  const [isSubmitting, setIsSubmitting] = useState(false);

  //get patient by id
  const getPatientData = async () => {
    const getPatient = await GetPatientById(patientId);
    setPatientsData(getPatient);
    console.log("patientID:", patientId);
  };

  //calculate the patient age
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

  useEffect(() => {
    getPatientData();
    const updateDateTime = () => setDateTime(new Date());
    updateDateTime(); // Set initial time
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, [patientId]);

  const filteredAppointments =
    filterStatus === "All"
      ? patientData?.appointments || []
      : (patientData?.appointments || []).filter(
          (appointment) =>
            appointment.status.toLowerCase() === filterStatus.toLowerCase()
        );

  const handleManagePatient = () => {
    setShowModal(true);
    setStatus(patientData.patient.status);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!patientData) {
        setShowNotFound(true);
      }
    }, 60000); // 1 minute = 60000ms

    if (patientData) {
      clearTimeout(timeout); // cancel timeout if doctor is loaded
      setShowNotFound(false);
    }

    return () => clearTimeout(timeout); // cleanup on unmount
  }, [patientData]);

  //handle patient status
  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const sent = await ChangePatientStatus(
        patientData.patient.patientId,
        status
      );
      console.log(sent);

      getPatientData();
    } catch (err) {
      console.error("Failed to send mail", err);
      alert("Failed to send mail!", err);
    }
    setIsLoading(false);
    setShowModal(false);
  };

  const statusOptions = [
    {
      value: "Active",
      label: "Active",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
    },
    {
      value: "InActive",
      label: "InActive",
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
  ];

  if (!dateTime) return null;

  if (showNotFound && !patientData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Patient Details
            </h1>
            <div className="w-24 h-1 bg-[#A9C9CD] rounded-full"></div>
          </div>

          {/* Not Found Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
            <div className="p-12">
              {/* Icon Section */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-red-100 to-orange-100 rounded-full mb-6">
                  <UserX className="w-12 h-12 text-red-500" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  Patient Not Found
                </h2>
                <p className="text-gray-600 text-lg max-w-md mx-auto">
                  The patient you're looking for doesn't exist or may have been
                  removed from the system.
                </p>
              </div>

              {/* Suggestions */}
              <div className="bg-[#E9FAF2] rounded-2xl p-8 mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  What you can do:
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#A9C9CD] rounded-lg flex items-center justify-center">
                      <Search className="w-5 h-5 text-[#09424D]" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Search Again</p>
                      <p className="text-sm text-gray-600">
                        Try a different patient ID
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Browse All Patients
                      </p>
                      <p className="text-sm text-gray-600">
                        View the complete patient list
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/Admin/AdminPatient">
                  <button className="group flex items-center justify-center gap-3 px-8 py-4 bg-[#A9C9CD] text-[#09424D]  font-semibold rounded-xl hover:bg-[#91B4B8] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
                    Go to Patient List
                  </button>
                </Link>
              </div>
            </div>

            {/* Bottom Gradient */}
            <div className="h-2 bg-gradient-to-r from-[#eef3f4]  via-[#A9C9CD]  to-[#eef3f4] "></div>
          </div>
        </div>
      </div>
    );
  }

  const getStatusDot = (status) => {
    switch (status) {
      case "Active":
      case "Completed":
        return "bg-emerald-500";
      case "Scheduled":
        return "bg-blue-500";
      case "Cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
      case "Completed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getFilterButtonClass = (isActive) => {
    return `px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
      isActive
        ? "bg-[#A9C9CD] text-[#09424D] shadow-lg"
        : "bg-white text-slate-600 hover:bg-slate-50 border border-[#A9C9CD]"
    }`;
  };

  return (
    <div className="min-h-screen bg-[#f3faf7] p-6">
      {patientData ? (
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-1">
                    {patientData.patient.firstName}{" "}
                    {patientData.patient.lastName}
                  </h1>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">
                      ID: {patientData.patient.patientId}
                    </span>
                    <div
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                        patientData.patient.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          patientData.patient.status === "Active"
                            ? "bg-green-700 text-green-700"
                            : "bg-red-700 text-red-700"
                        }`}
                      ></span>
                      {patientData.patient.status ? "Active" : "Inactive"}
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={handleManagePatient}
                className="px-8 py-3  bg-[#A9C9CD] text-[#09424D]  font-semibold rounded-xl hover:bg-[#91B4B8]  transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Manage Patient
              </button>
            </div>
          </div>

          {/* Patient Details Section */}
          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            {/* Profile Image */}
            <div className="lg:col-span-1">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 text-center">
                <div className="w-48 h-48 mx-auto mb-6 relative">
                  <img
                    src={
                      patientData.patient.profileImage &&
                      patientData.patient.profileImage.trim() !== ""
                        ? `data:image/jpeg;base64,${patientData.patient.profileImage}`
                        : "/profile2.png"
                    }
                    alt="Patient Avatar"
                    className="w-full h-full rounded-3xl object-cover shadow-2xl"
                  />
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/10 to-transparent"></div>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {patientData.patient.firstName} {patientData.patient.lastName}
                </h2>
                <p className="text-gray-600">
                  Patient ID: {patientData.patient.patientId}
                </p>
              </div>
            </div>

            {/* Patient Information */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Patient Information
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date of Birth</p>
                      <p className="font-semibold text-gray-900">
                        {patientData.patient.dob} •{" "}
                        {calculateAge(patientData.patient.dob)} years old
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <User className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Gender</p>
                      <p className="font-semibold text-gray-900">
                        {patientData.patient.gender === "M" ? "Male" : "Female"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <Phone className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Contact</p>
                      <p className="font-semibold text-gray-900">
                        {patientData.patient.phoneNumber}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                      <Mail className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-semibold text-gray-900">
                        {patientData.patient.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">NIC</p>
                      <p className="font-semibold text-gray-900">
                        {patientData.patient.nic}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                      <Shield className="w-6 h-6 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email Verified</p>
                      <p className="font-semibold text-gray-900">
                        {patientData.patient.emailVerified
                          ? "Verified"
                          : "Not Verified"}
                      </p>
                    </div>
                  </div>
                  {patientData.patient.lastLogin && (
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                        <Clock className="w-6 h-6 text-pink-600" />
                      </div>

                      <div>
                        <p className="text-sm text-gray-600">Last Login</p>
                        <p className="font-semibold text-gray-900">
                          {patientData.patient.lastLogin}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
                      <Activity className="w-6 h-6 text-cyan-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Created At</p>
                      <p className="font-semibold text-gray-900">
                        {patientData.patient.createdAt}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Appointments Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Appointments
            </h2>
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => setFilterStatus("All")}
                className={getFilterButtonClass(filterStatus === "All")}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus("Completed")}
                className={getFilterButtonClass(filterStatus === "Completed")}
              >
                Completed
              </button>
              <button
                onClick={() => setFilterStatus("Pending")}
                className={getFilterButtonClass(filterStatus === "Pending")}
              >
                Pending
              </button>
              <button
                onClick={() => setFilterStatus("Cancelled")}
                className={getFilterButtonClass(filterStatus === "Cancelled")}
              >
                Cancelled
              </button>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-full">
                <div className="max-h-96 overflow-y-auto rounded-2xl border border-gray-200">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-10">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Appointment
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Doctor
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Hospital
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Charge
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Details
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredAppointments.map((appointment, index) => (
                        <tr
                          key={index}
                          className="hover:bg-gray-50 transition-colors duration-150"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {appointment.appointmentId}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {appointment.typeOfAppointment}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {appointment.doctorName}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {appointment.doctorId}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">
                              {appointment.date}
                            </div>
                            <div className="text-sm text-gray-500">
                              {appointment.time}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {appointment.hospitalName}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {appointment.hospitalId}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap items-center">
                            <div className="flex items-center">
                              <p className="text-sm font-medium  mr-1">Rs. </p>
                              <span className="text-sm font-medium text-gray-900">
                                {appointment.charge}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                appointment.status
                              )}`}
                            >
                              <span
                                className={`w-2 h-2 ${getStatusDot(
                                  appointment.status
                                )} rounded-full mr-2`}
                              ></span>
                              {appointment.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 mb-1">
                              {appointment.specialNote}
                            </div>
                            <div className="text-xs text-gray-500">
                              <div>Created: {appointment.createdAt}</div>
                              <div>Updated: {appointment.updatedAt}</div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-[400px]">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 border-4 border-[#E9FAF2] border-t-[#50d094] rounded-full animate-spin"></div>
            <p className="text-slate-600 text-lg font-medium">
              Loading Patient Details...
            </p>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#E9FAF2] border border-[#A9C9CD]  rounded-full flex items-center justify-center">
                  <Activity className="w-5 h-5 text-[#09424D]" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Patient Status
                  </h2>
                  <p className="text-sm text-gray-500">
                    Update patient activity status
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Status
                </label>

                <div className="grid grid-cols-1 gap-3">
                  {statusOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-sm ${
                        status === option.value
                          ? `${option.borderColor} ${option.bgColor} shadow-sm`
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="status"
                        value={option.value}
                        onChange={handleStatusChange}
                        checked={status === option.value}
                        className="sr-only"
                      />

                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 transition-all duration-200 ${
                          status === option.value
                            ? `${option.borderColor.replace(
                                "border-",
                                "border-"
                              )} bg-white`
                            : "border-gray-300"
                        }`}
                      >
                        {status === option.value && (
                          <div
                            className={`w-2.5 h-2.5 rounded-full ${option.color.replace(
                              "text-",
                              "bg-"
                            )}`}
                          />
                        )}
                      </div>

                      <div className="flex-1">
                        <span
                          className={`font-medium ${
                            status === option.value
                              ? option.color
                              : "text-gray-700"
                          }`}
                        >
                          {option.label}
                        </span>
                      </div>

                      {status === option.value && (
                        <div
                          className={`w-6 h-6 rounded-full ${option.color.replace(
                            "text-",
                            "bg-"
                          )} flex items-center justify-center`}
                        >
                          <svg
                            className="w-3 h-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!status || isSubmitting}
                  className={`flex-1 px-4 py-3 text-[#09424D] rounded-xl font-medium transition-all duration-200 ${
                    !status || isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#A9C9CD]  hover:bg-[#91B4B8] hover:shadow-lg"
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Updating...
                    </div>
                  ) : (
                    "Update Status"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* loading component */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <p className="mb-4 text-lg font-semibold text-[rgba(0,126,133,0.7)]">
              Please wait...
            </p>
            <Spinner className="h-10 w-10 text-[rgba(0,126,133,0.7)]" />
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDetails;
