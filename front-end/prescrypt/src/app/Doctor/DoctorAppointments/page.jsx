"use client";
import React, { useState, useEffect } from "react";
import Footer from "../../Components/footer/Footer";
import Sidebar from "../DoctorComponents/DoctorSidebar";
import DateTimeDisplay from "../DoctorComponents/DateTimeDisplay";
import axiosInstance from "../utils/axiosInstance";
import { MoreHorizontal } from "lucide-react";
import { format } from "date-fns";

export default function AppointmentsPage() {
  const Title = "Appointments";
  const [appointments, setAppointments] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0] // Default to today's date
  );
  const [loading, setLoading] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [noAppointments, setNoAppointments] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const formattedDate = format(new Date(selectedDate), "yyyy-MM-dd");
        console.log("Formatted Date:", formattedDate);

        const response = await axiosInstance.get(
          `/api/Appointments/date/${formattedDate}?doctorId=1` // Replace with dynamic doctor ID
        );
        setAppointments(response.data);

        const availabilityResponse = await axiosInstance.get(
          `/api/Appointments/availability/${formattedDate}?doctorId=1` // Replace with dynamic doctor ID
        );
        setAvailability(availabilityResponse.data);

        if (response.data.length === 0) {
          setNoAppointments(true);
        } else {
          setNoAppointments(false);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error.response || error.message);
        setNoAppointments(true); // Show no appointments message on error
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

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-grow">
        <Sidebar />
        <div className="flex-grow p-2 bg-[#D4E9EA]">
          <div className="bg-white h-full w-full">
            <DateTimeDisplay title={Title} />

            {/* Date and Time Selection */}
            <div className="flex">
              <div className="my-10 ml-10 p-3 pl-5 bg-[#E9FAF2] text-[#094A4D] w-45 shadow-lg rounded-[20px]">
                <label className="font-semibold">Date: </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                />
              </div>
              <div className="my-10 ml-10 p-3 pl-5 bg-[#E9FAF2] text-[#094A4D] w-45 shadow-lg rounded-[20px]">
                <label className="font-semibold">Time: </label>
                {loading ? (
                  <div>Loading availability...</div>
                ) : availability.length > 0 ? (
                  availability.map((avail) => {
                    const timeString = avail.availableTime.split(".")[0];
                    return (
                      <div key={avail.availabilityId}>
                        {new Date(`1970-01-01T${timeString}`).toLocaleTimeString([], {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </div>
                    );
                  })
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
                        <th className="px-4 py-2 text-left">Patient</th>
                        <th className="px-4 py-2 text-left">Appointment Time</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left">Actions</th>
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
                              key={appointment.id}
                              className="border-b border-[#094A4D] relative odd:bg-[#E9FAF2]"
                            >
                              <td className="px-4 py-2">{appointment.patientId}</td>
                              <td className="px-4 py-2">
                                <div className="flex items-center space-x-3">
                                  <img
                                    src={appointment.profilePictureUrl || "/profile.png"}
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
                                      {appointment.gender}, {appointment.age}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-2">
                                {new Date(appointment.appointmentTime).toLocaleTimeString([], {
                                  hour: "numeric",
                                  minute: "2-digit",
                                  hour12: true,
                                })}
                              </td>
                              <td className="px-4 py-2">{appointment.status}</td>
                              <td className="relative">
                                <button
                                  onClick={() => toggleMenu(appointment.id)}
                                  className="p-2"
                                  aria-label="Open menu"
                                >
                                  <MoreHorizontal size={20} className="cursor-pointer" />
                                </button>
                                {openMenuId === appointment.id && (
                                  <div className="absolute w-50 bg-[#E9FAF2] border border-[#094A4D] shadow-2xl p-2 z-50 mt-[-20px] ml-[30px] text-[#094A4D] transition-opacity duration-200">
                                    <button className="block p-3 text-left w-full hover:bg-white cursor-pointer border-b border-[#094A4D]">
                                      Reschedule
                                    </button>
                                    <button className="block p-3 text-left w-full hover:bg-white cursor-pointer">
                                      Add Prescription
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="px-4 py-2 text-center">
                              No appointments found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}