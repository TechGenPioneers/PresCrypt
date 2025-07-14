"use client";
import React, { useState, useEffect, useRef } from "react";
import Footer from "../../Components/footer/Footer";
import Sidebar from "../DoctorComponents/DoctorSidebar";
import DateTimeDisplay from "../DoctorComponents/DateTimeDisplay";
import PatientViewModal from "./PatientViewModal";
import RescheduleModal from "./RescheduleModal";
import AppointmentService from "../services/DoctorAppointmentsService";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { FaCalendarAlt } from "react-icons/fa";
//import useAuthGuard from "@/utils/useAuthGuard";

export default function AppointmentsPage() {
  //useAuthGuard(["Doctor"]);
  const Title = "Appointments";
  const [appointments, setAppointments] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [noAppointments, setNoAppointments] = useState(false);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const calendarRef = useRef(null);

  //const doctorId = user?.id;
  const doctorId = "D002";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };

    if (showCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCalendar]);

  useEffect(() => {
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const formattedDate = selectedDate
        ? format(new Date(selectedDate), "yyyy-MM-dd")
        : "";

      const appointmentsData = await AppointmentService.getAppointmentsByDoctor(doctorId, formattedDate);

      if (appointmentsData && appointmentsData.length > 0) {
        setAppointments(appointmentsData);
        setNoAppointments(false);
      } else {
        setAppointments([]);
        setNoAppointments(true);
      }

      if (formattedDate) {
        try {
          const availabilityData = await AppointmentService.getAvailabilityByDoctor(doctorId, formattedDate);
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
}, [selectedDate]);


  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setShowCalendar(false); // close after select
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

  return (
    <div className="flex flex-col min-h-screen ml-32">
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-grow p-2 bg-[#D4E9EA] min-h-screen">
          <div className="bg-white h-full w-full">
            <DateTimeDisplay title={Title} />

            <div className="flex">
              {/* Date Picker Section */}
              <div
                className="relative my-10 ml-12 p-3 pl-5 bg-[#E9FAF2] text-[#094A4D] w-50 shadow-lg rounded-[20px]"
                ref={calendarRef}
              >
                <label className="font-semibold">Date: </label>
                <div>
                  <button
                    className="py-2 text-[#094A4D] cursor-pointer flex items-center gap-2"
                    onClick={() => setShowCalendar(!showCalendar)}
                  >
                    {selectedDate
                      ? format(selectedDate, "yyyy-MM-dd")
                      : "Select Date"}
                    <FaCalendarAlt className="ml-8"/>
                  </button>
                  {showCalendar && (
                    <div className="absolute z-10 mt-2 rounded bg-white shadow-lg">
                      <DayPicker
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateSelect}
                        className="p-3"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Time Section */}
              <div className="my-10 ml-10 p-3 pl-5 bg-[#E9FAF2] text-[#094A4D] shadow-lg rounded-[20px]">
                <label className="font-semibold block mb-2">Time: </label>
                {loading ? (
                  <div>Loading availability...</div>
                ) : availability.length > 0 ? (
                  <div className="flex flex-row gap-8">
                    {" "}
                    {/* Horizontal layout with spacing */}
                    {availability.map((avail) => (
                      <div key={avail.availabilityId} className="flex flex-col">
                        <div className="font-medium whitespace-nowrap">
                          {formatTime(avail.availableStartTime)} -{" "}
                          {formatTime(avail.availableEndTime)}
                        </div>
                        <div className="text-sm text-gray-600 whitespace-nowrap">
                          {avail.hospitalName || "Hospital not specified"}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>No available times found.</div>
                )}
              </div>

              {/* Reschedule Button */}
              <div className="ml-auto mr-12 flex items-center">
                <button
                  className="bg-[#094A4D] text-white px-4 py-2 rounded-[12px] shadow-md hover:bg-[#072f30] cursor-pointer"
                  onClick={() => setIsRescheduleModalOpen(true)}
                >
                  Reschedule
                </button>
              </div>
            </div>

            {/* Appointment Table */}
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#094A4D]"></div>
              </div>
            ) : (
              <div className="pl-12 pb-8 pr-12">
                <div className="overflow-hidden rounded-lg">
                  <table className="w-full table-auto sm:table-fixed min-w-full">
                    <thead className="text-[#094A4D] sticky top-0 bg-[#0064694e]">
                      <tr>
                        <th className="px-4 py-2 text-left">Patient ID</th>
                        <th className="py-2 text-left">Patient</th>
                        <th className="px-8 py-2 text-left">Date</th>
                        <th className="px-4 py-2 text-left">Time</th>
                        <th className="py-2 text-left">Hospital</th>
                        <th className="px-8 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left">Action</th>
                      </tr>
                    </thead>
                  </table>
                  <div className="overflow-y-auto max-h-[330px]">
                    <table className="w-full table-auto sm:table-fixed min-w-full">
                      <tbody>
                        {appointments.length > 0 ? (
                          appointments.map((appointment) => (
                            <tr
                              key={appointment.appointmentId}
                              className="border-b border-[#094A4D] relative odd:bg-[#E9FAF2]"
                            >
                              <td className="px-4 py-2">
                                {appointment.patientId}
                              </td>
                              <td className="py-2">
                                <div className="flex items-center space-x-3">
                                  <img
                                    src={`data:image/jpeg;base64,${appointment.profileImage}`}
                                    alt="Profile"
                                    width={50}
                                    height={50}
                                    className="rounded-full"
                                  />
                                  <div className="flex flex-col">
                                    <span className="font-semibold">
                                      {appointment.patientName}
                                    </span>
                                    <span className="text-sm text-gray-600">
                                      {appointment.gender},{" "}
                                      {calculateAge(appointment.dob)} yrs
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-8 py-2">
                                {new Date(
                                  appointment.date
                                ).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-2">
                                {formatTime(appointment.time)}
                              </td>
                              <td className="py-2">
                                {appointment.hospitalName}
                              </td>
                              <td className="px-8 py-2">
                                {appointment.status}
                              </td>
                              <td className="px-3">
                                <button
                                  onClick={() => handleViewClick(appointment)}
                                  className="block p-3 text-left w-full cursor-pointer font-semibold text-[#094A4D] hover:underline"
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="7" className="px-4 py-2 text-center">
                              {noAppointments
                                ? "No appointments found"
                                : "Select a date to view appointments"}
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
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
