"use client";
import React, { useState, useEffect, useRef } from "react";
import DateTimeDisplay from "../DoctorComponents/DateTimeDisplay";
import PageHeaderDisplay from "../DoctorComponents/PageHeaderDisplay";
import PatientViewModal from "./PatientViewModal";
import RescheduleModal from "./RescheduleModal";
import AppointmentService from "../services/DoctorAppointmentsService";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import useAuthGuard from "@/utils/useAuthGuard";
import {
  Calendar,
  Clock,
  RefreshCw,
  MapPin,
  Loader2,
  Filter,
  ChevronDown,
} from "lucide-react";

export default function AppointmentsPage() {
  useAuthGuard("Doctor");
  const Title = "Appointments";
  const doctorId =
    typeof window !== "undefined" ? localStorage.getItem("doctorId") : null;
  const [appointments, setAppointments] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState();
  const [selectedHospital, setSelectedHospital] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showHospitalDropdown, setShowHospitalDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [noAppointments, setNoAppointments] = useState(false);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [availableHospitals, setAvailableHospitals] = useState([]);
  const [allHospitals, setAllHospitals] = useState([]);

  const calendarRef = useRef(null);
  const statusRef = useRef(null);
  const hospitalRef = useRef(null);

  const statusOptions = [
    { value: "", label: "All Statuses" },
    { value: "completed", label: "Completed" },
    { value: "pending", label: "Pending" },
    { value: "cancelled", label: "Cancelled" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
      if (statusRef.current && !statusRef.current.contains(event.target)) {
        setShowStatusDropdown(false);
      }
      if (hospitalRef.current && !hospitalRef.current.contains(event.target)) {
        setShowHospitalDropdown(false);
      }
    };

    if (showCalendar || showStatusDropdown || showHospitalDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCalendar, showStatusDropdown, showHospitalDropdown]);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const formattedDate = selectedDate
          ? format(new Date(selectedDate), "yyyy-MM-dd")
          : "";

        const appointmentsData =
          await AppointmentService.getAppointmentsByDoctor(
            doctorId,
            formattedDate,
            selectedHospital,
            selectedStatus
          );

        if (appointmentsData && appointmentsData.length > 0) {
          setAppointments(appointmentsData);
          setNoAppointments(false);
        } else {
          setAppointments([]);
          setNoAppointments(true);
        }

        if (formattedDate) {
          try {
            const availabilityData =
              await AppointmentService.getAvailabilityByDoctor(
                doctorId,
                formattedDate
              );
            setAvailability(availabilityData || []);
          } catch (error) {
            if (error.response?.status === 404) {
              setAvailability([]);
            } else {
              console.error("Error fetching availability:", error);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setAppointments([]);
        setNoAppointments(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [selectedDate, selectedStatus, selectedHospital]);

  // Fetch initial hospitals for dropdown
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const allAppointments =
          await AppointmentService.getAppointmentsByDoctor(doctorId);
        if (allAppointments && allAppointments.length > 0) {
          const hospitals = [
            ...new Set(
              allAppointments.map((apt) => apt.hospitalName).filter(Boolean)
            ),
          ];
          setAllHospitals(hospitals);
          setAvailableHospitals(hospitals);
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    if (doctorId) {
      fetchInitialData();
    }
  }, [doctorId]);

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setShowCalendar(false);
  };

  const handleStatusSelect = (status) => {
    setSelectedStatus(status);
    setShowStatusDropdown(false);
  };

  const handleHospitalSelect = (hospital) => {
    setSelectedHospital(hospital);
    setShowHospitalDropdown(false);
  };

  const calculateAge = (dob) => {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleViewClick = (patient) => {
    setSelectedPatient(patient);
    setIsPatientModalOpen(true);
  };

  const getSelectedStatusLabel = () => {
    const selectedOption = statusOptions.find(
      (option) => option.value === selectedStatus
    );
    return selectedOption ? selectedOption.label : "All Statuses";
  };

  const isViewButtonDisabled = (status) => {
    const statusLower = status?.toLowerCase();
    return statusLower === "completed" || statusLower === "cancelled";
  };

  return (
    <div className="p-1">
      <PageHeaderDisplay title={Title} />

      <div className="flex">
        {/* Date Picker Section */}
        <div
          className="relative my-10 ml-12 p-3 pl-6 bg-[#E9FAF2] text-[#094A4D] w-56 shadow-lg rounded-[20px] border border-[#094A4D]/10"
          ref={calendarRef}
        >
          <label className="font-semibold text-sm uppercase tracking-wide mb-2 flex items-center gap-2">
            <Calendar size={16} className="text-[#094A4D]" />
            Date:
          </label>
          <div>
            <button
              className="py-3 px-2 text-[#094A4D] cursor-pointer flex items-center justify-between w-full hover:bg-[#094A4D]/5 rounded-lg transition-colors duration-200"
              onClick={() => setShowCalendar(!showCalendar)}
            >
              <span className="font-medium">
                {selectedDate
                  ? format(selectedDate, "yyyy-MM-dd")
                  : "Select Date"}
              </span>
              <Calendar size={16} className="text-[#094A4D]/70" />
            </button>
            {showCalendar && (
              <div className="absolute z-20 mt-2 rounded-xl bg-white shadow-xl border border-[#094A4D]/20">
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  className="p-4"
                />
              </div>
            )}
          </div>
        </div>

        {/* Available Times Section - Moved next to date filter */}
        <div className="my-10 ml-5 p-3 pl-6 bg-[#E9FAF2] text-[#094A4D] shadow-lg rounded-[20px] border border-[#094A4D]/10 min-w-[418px]">
          <label className="font-semibold text-sm uppercase tracking-wide mb-3 flex items-center gap-2">
            <Clock size={16} className="text-[#094A4D]" />
            Available Times:
          </label>
          {loading ? (
            <div className="flex items-center space-x-2 py-2">
              <Loader2 size={16} className="animate-spin text-[#094A4D]" />
              <span className="text-[#094A4D]/70">Loading availability...</span>
            </div>
          ) : availability.length > 0 ? (
            <div className="flex flex-row gap-6 flex-wrap">
              {availability.map((avail) => (
                <div
                  key={avail.availabilityId}
                  className="flex flex-col bg-white/50 p-3 rounded-lg border border-[#094A4D]/10"
                >
                  <div className="font-medium text-[#094A4D] whitespace-nowrap">
                    {formatTime(avail.availableStartTime)} -{" "}
                    {formatTime(avail.availableEndTime)}
                  </div>
                  <div className="text-sm text-[#094A4D]/60 whitespace-nowrap mt-1 flex items-center gap-1">
                    <MapPin size={12} className="text-[#094A4D]/60" />
                    {avail.hospitalName || "Hospital not specified"}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-[#094A4D]/70 py-2">
              Select a date to view available times.
            </div>
          )}
        </div>

        {/* Status Filter Section */}
        <div
          className="relative my-10 ml-5 p-3 pl-6 bg-[#E9FAF2] text-[#094A4D] w-48 shadow-lg rounded-[20px] border border-[#094A4D]/10"
          ref={statusRef}
        >
          <label className="font-semibold text-sm uppercase tracking-wide mb-2 flex items-center gap-2">
            <Filter size={16} className="text-[#094A4D]" />
            Status:
          </label>
          <div>
            <button
              className="py-3 px-2 text-[#094A4D] cursor-pointer flex items-center justify-between w-full hover:bg-[#094A4D]/5 rounded-lg transition-colors duration-200"
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            >
              <span className="font-medium">{getSelectedStatusLabel()}</span>
              <ChevronDown size={16} className="text-[#094A4D]/70" />
            </button>
            {showStatusDropdown && (
              <div className="absolute z-20 mt-2 w-full rounded-xl bg-white shadow-xl border border-[#094A4D]/20">
                <div className="py-2">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      className="w-full px-4 py-2 text-left hover:bg-[#E9FAF2] transition-colors duration-150 text-[#094A4D]"
                      onClick={() => handleStatusSelect(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Hospital Filter Section */}
        <div
          className="relative my-10 ml-5 p-3 pl-6 bg-[#E9FAF2] text-[#094A4D] w-56 shadow-lg rounded-[20px] border border-[#094A4D]/10"
          ref={hospitalRef}
        >
          <label className="font-semibold text-sm uppercase tracking-wide mb-2 flex items-center gap-2">
            <MapPin size={16} className="text-[#094A4D]" />
            Hospital:
          </label>
          <div>
            <button
              className="py-3 px-2 text-[#094A4D] cursor-pointer flex items-center justify-between w-full hover:bg-[#094A4D]/5 rounded-lg transition-colors duration-200"
              onClick={() => setShowHospitalDropdown(!showHospitalDropdown)}
            >
              <span className="font-medium">
                {selectedHospital || "All Hospitals"}
              </span>
              <ChevronDown size={16} className="text-[#094A4D]/70" />
            </button>
            {showHospitalDropdown && (
              <div className="absolute z-20 mt-2 w-full rounded-xl bg-white shadow-xl border border-[#094A4D]/20">
                <div className="py-2">
                  <button
                    className="w-full px-4 py-2 text-left hover:bg-[#E9FAF2] transition-colors duration-150 text-[#094A4D]"
                    onClick={() => handleHospitalSelect("")}
                  >
                    All Hospitals
                  </button>
                  {allHospitals.map((hospital) => (
                    <button
                      key={hospital}
                      className="w-full px-4 py-2 text-left hover:bg-[#E9FAF2] transition-colors duration-150 text-[#094A4D]"
                      onClick={() => handleHospitalSelect(hospital)}
                    >
                      {hospital}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reschedule Button */}
        <div className="ml-auto mr-12 flex items-center">
          <button
            className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 disabled:from-gray-400 disabled:to-gray-500 text-white px-4 py-3 rounded-[15px] shadow-lg hover:bg-[#094A4D]/90 hover:shadow-xl cursor-pointer transition-all duration-200 font-medium flex items-center space-x-2"
            onClick={() => setIsRescheduleModalOpen(true)}
          >
            <RefreshCw size={16} className="text-white" />
            <span>Reschedule</span>
          </button>
        </div>
      </div>

      {/* Appointment Table */}
      {loading ? (
        <div className="flex flex-col justify-center items-center h-40 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-3 border-b-3 border-[#094A4D]"></div>
          <p className="text-[#094A4D] font-medium">Loading appointments...</p>
        </div>
      ) : (
        <div className="pl-12 pb-8 pr-12">
          <div className="overflow-hidden rounded-lg shadow-md bg-white">
            <table className="w-full table-auto sm:table-fixed min-w-full">
              <thead className="text-[#094A4D] sticky top-0 bg-gradient-to-r from-[#0064694e] to-[#094A4D]/20 z-10">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wide">
                    Patient ID
                  </th>
                  <th className="py-4 text-left font-semibold text-sm uppercase tracking-wide">
                    Patient
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wide">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wide">
                    Time
                  </th>
                  <th className="py-4 px-4 text-left font-semibold text-sm uppercase tracking-wide">
                    Hospital
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wide">
                    Action
                  </th>
                </tr>
              </thead>
            </table>
            <div className="overflow-y-auto max-h-[400px]">
              <table className="w-full table-auto sm:table-fixed min-w-full">
                <tbody>
                  {appointments.length > 0 ? (
                    appointments.map((appointment) => (
                      <tr
                        key={appointment.appointmentId}
                        className="border-b border-[#094A4D]/20 relative odd:bg-[#E9FAF2]/50 hover:bg-[#E9FAF2]/80 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 font-medium text-[#094A4D]">
                          {appointment.patientId}
                        </td>
                        <td className="py-4">
                          <div className="flex items-center space-x-4">
                            <div className="relative w-[50px] h-[50px] shrink-0">
                              <img
                                src={
                                  appointment.profileImage
                                    ? `data:image/jpeg;base64,${appointment.profileImage}`
                                    : "/patient.png"
                                }
                                alt="Profile"
                                className="w-full h-full rounded-full border-2 border-[#094A4D]/20 shadow-sm object-cover object-top bg-white"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "/patient.png";
                                }}
                              />
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#E9FAF2] rounded-full border-2 border-white"></div>
                            </div>
                            <div className="flex flex-col justify-center min-h-[50px]">
                              <span className="font-semibold text-[#094A4D] leading-tight">
                                {appointment.patientName}
                              </span>
                              <span className="text-sm text-[#094A4D]/60 flex items-center space-x-1 leading-tight mt-1">
                                <span>{appointment.gender}</span>
                                <span>•</span>
                                <span>{calculateAge(appointment.dob)} yrs</span>
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-[#094A4D]">
                          {new Date(appointment.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-[#094A4D]">
                          {formatTime(appointment.time)}
                        </td>
                        <td className="py-4 px-4 text-[#094A4D]">
                          {appointment.hospitalName}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              appointment.status?.toLowerCase() === "completed"
                                ? "bg-green-100 text-green-800"
                                : appointment.status?.toLowerCase() ===
                                  "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : appointment.status?.toLowerCase() ===
                                  "cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-[#E9FAF2] text-[#094A4D]"
                            }`}
                          >
                            {appointment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleViewClick(appointment)}
                            disabled={isViewButtonDisabled(appointment.status)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-sm ${
                              isViewButtonDisabled(appointment.status)
                                ? "bg-gray-200 text-gray-500 cursor-not-allowed opacity-50"
                                : "bg-[#0064694e] text-[#094A4D] cursor-pointer hover:bg-[#094A4D]/90 hover:text-white hover:shadow-md"
                            }`}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-6 py-8 text-center text-[#094A4D]/70"
                      >
                        <div className="flex flex-col items-center space-y-2">
                          <Calendar size={48} className="text-[#094A4D]/40" />
                          <div>
                            {noAppointments
                              ? "No appointments found"
                              : "Select a date to view appointments"}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      <PatientViewModal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        patient={selectedPatient}
      />
      <RescheduleModal
        isOpen={isRescheduleModalOpen}
        onClose={() => setIsRescheduleModalOpen(false)}
        doctorId={doctorId}
      />
      <DateTimeDisplay />
    </div>
  );
}
