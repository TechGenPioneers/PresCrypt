"use client";
import React, { useState, useEffect } from "react";
import Footer from "../../Components/footer/Footer";
import Sidebar from "../DoctorComponents/DoctorSidebar";
import DateTimeDisplay from "../DoctorComponents/DateTimeDisplay";
import PatientViewModal from "./PatientViewModal";
import axiosInstance from "../utils/axiosInstance";
import { format } from "date-fns";

export default function AppointmentsPage() {
  const Title = "Appointments";
  const [appointments, setAppointments] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [noAppointments, setNoAppointments] = useState(false);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const formattedDate = selectedDate
          ? format(new Date(selectedDate), "yyyy-MM-dd")
          : "";
        console.log("Fetching appointments with:", {
          doctorId: "D002",
          date: formattedDate,
        });

        // Fetch appointments
        const appointmentsResponse = await axiosInstance.get(
          `/Appointments/by-doctor/D002${
            formattedDate ? `?date=${formattedDate}` : ""
          }`
        );
        console.log("Appointments Response data:", appointmentsResponse.data);

        if (appointmentsResponse.data && appointmentsResponse.data.length > 0) {
          setAppointments(appointmentsResponse.data);
          setNoAppointments(false);
        } else {
          setAppointments([]);
          setNoAppointments(true);
        }

        // Fetch availability - updated with better error handling
        if (formattedDate) {
          try {
            const availabilityResponse = await axiosInstance.get(
              `/Appointments/availability/${formattedDate}`,
              {
                params: {
                  doctorId: "D002", //replace with dynamic doctor id
                },
              }
            );
            console.log("Availability data:", availabilityResponse.data);
            setAvailability(availabilityResponse.data || []);
          } catch (error) {
            if (error.response?.status === 404) {
              // Handle "no availability" case gracefully
              setAvailability([]);
            } else {
              console.error("Error fetching availability:", error);
              // Optionally show error to user
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

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
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

  const getGenderFullName = (genderChar) => {
    switch (genderChar) {
      case "M":
        return "Male";
      case "F":
        return "Female";
      default:
        return "Other";
    }
  };

  return (
    <div className="flex flex-col min-h-screen ml-32">
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-grow p-2 bg-[#D4E9EA] min-h-screen">
          <div className="bg-white h-full w-full">
            <DateTimeDisplay title={Title} />

            {/* Date and Time Selection */}
            <div className="flex">
              <div className="my-10 ml-10 p-3 pl-5 bg-[#E9FAF2] text-[#094A4D] w-50 shadow-lg rounded-[20px]">
                <label className="font-semibold">Date: </label>
                <input
                  type="date"
                  value={selectedDate || ""}
                  onChange={handleDateChange}
                />
              </div>
              <div className="my-10 ml-10 p-3 pl-5 bg-[#E9FAF2] text-[#094A4D] w-50 shadow-lg rounded-[20px]">
                <label className="font-semibold">Time: </label>
                {loading ? (
                  <div>Loading availability...</div>
                ) : availability.length > 0 ? (
                  availability.map((avail) => (
                    <div key={avail.availabilityId}>
                      {formatTime(avail.availableStartTime)} -{" "}
                      {formatTime(avail.availableEndTime)}
                    </div>
                  ))
                ) : (
                  <div>No available times found.</div>
                )}
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#094A4D]"></div>
              </div>
            ) : (
              /* Appointment Table */
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
                  {/* Scrollable Table Body */}
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
                                      {getGenderFullName(appointment.gender)},{" "}
                                      {calculateAge(appointment.dob)} yrs
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-8 py-2">
                                {new Date(appointment.date).toLocaleString([], {
                                  year: "numeric",
                                  month: "numeric",
                                  day: "numeric",
                                })}
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
                              <td>
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
                            <td colSpan="6" className="px-4 py-2 text-center">
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

            {/* Modal for Patient View */}
            <PatientViewModal
              isOpen={isPatientModalOpen}
              onClose={() => setIsPatientModalOpen(false)}
              patient={selectedPatient}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
