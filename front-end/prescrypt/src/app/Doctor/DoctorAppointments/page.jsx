"use client";
import React, { useState, useEffect } from "react";
import Footer from "../../Components/footer/Footer";
import Sidebar from "../DoctorComponents/DoctorSidebar";
import DateTimeDisplay from "../DoctorComponents/DateTimeDisplay";
import axiosInstance from "../utils/axiosInstance";

export default function AppointmentsPage() {
  const Title = "Appointments";
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  ); // Default to today
  const [loading, setLoading] = useState(false);

  // Fetch appointments on load and when date changes
  useEffect(() => {
    fetchAppointments(selectedDate);
  }, [selectedDate]);

  const fetchAppointments = async (date) => {
    setLoading(true);
    try {
      let url =
        date === new Date().toISOString().split("T")[0]
          ? "/appointments/today"
          : `/appointments/past?date=${date}`;

      const response = await axiosInstance.get(url);
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Date Change
  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-grow">
        <Sidebar />
        <div className="flex-grow p-2 bg-[#D4E9EA]">
          <div className="m-[0.1px] bg-white h-full w-full">
            <DateTimeDisplay title={Title} />

            {/* Date and time selection */}
            <div className="flex">
              <div className="my-10 ml-10 mt-12 p-3 pl-5 bg-[#E9FAF2] text-[#094A4D] w-45 shadow-lg rounded-[20px]">
                <label className="font-semibold">Date: </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                />
              </div>
              <div className="my-10 ml-10 mt-12 p-3 pl-5 bg-[#E9FAF2] text-[#094A4D] w-45 shadow-lg rounded-[20px]">
                <label className="font-semibold">Time: </label>
                <option value=""></option>
              </div>
            </div>
            {/* Display Loading State */}
            {loading && <p>Loading appointments...</p>}

            {/* Appointment Table */}
            <div className="p-4">
              <div className="p-4">
                <div className="overflow-hidden rounded-lg">
                  <table className="w-full table-auto">
                    <thead className="text-[#094A4D]">
                      <tr className="bg-[#0064694e]">
                        <th className="px-4 py-2">Patient ID</th>
                        <th className="px-4 py-2">Patient</th>
                        <th className="px-4 py-2">Duration</th>
                        <th className="px-4 py-2">Status</th>
                        <th className="px-4 py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.length > 0 ? (
                        appointments.map((appointment) => (
                          <tr key={appointment.id} className="border-b">
                            <td className="px-4 py-2">
                              {appointment.patientId}
                            </td>
                            <td className="px-4 py-2">
                              <div className="flex items-center space-x-3">
                                <img
                                  src={appointment.profilePictureUrl}
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
                              {appointment.duration} mins
                            </td>
                            <td className="px-4 py-2">{appointment.status}</td>
                            <td className="px-4 py-2">
                              <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
                                Reschedule
                              </button>
                              <button className="bg-green-500 text-white px-4 py-2 rounded">
                                Add Prescription
                              </button>
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
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
