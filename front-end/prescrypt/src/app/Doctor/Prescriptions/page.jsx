"use client";
import React, { useState, useEffect } from "react";
import Footer from "../../Components/footer/Footer";
import Sidebar from "../DoctorComponents/DoctorSidebar";
import axiosInstance from "../utils/axiosInstance";
import DateTimeDisplay from "../DoctorComponents/DateTimeDisplay";
import useAuthGuard from "@/utils/useAuthGuard"; // Ensure the user is authenticated as a Doctor

export default function Page() {
  useAuthGuard("Doctor"); // Ensure the user is authenticated as a Doctor
  const Title = "Prescriptions"; // Dynamic title for each page
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [doctorId, setDoctorId] = useState(1); // You can dynamically set this based on logged-in doctor
  const [searchTerm, setSearchTerm] = useState(""); // To store the search term

  // Fetch recent appointments when the component mounts or when searchTerm changes
  useEffect(() => {
    const fetchRecentAppointments = async () => {
      setLoading(true);
      try {
        // First API call for fetching recent appointments (without search term)
        const defaultResponse = await axiosInstance.get(
          `/api/appointments/recent/${doctorId}`
        );

        if (defaultResponse.status === 200) {
          setAppointments(defaultResponse.data); // Set the appointments data
        } else {
          console.log("No recent appointments found.");
        }

        // If there's a search term
        if (searchTerm) {
          const searchResponse = await axiosInstance.get(
            `/api/appointments/recent/${doctorId}?patientId=${searchTerm}`
          );

          if (searchResponse.status === 200) {
            setAppointments(searchResponse.data); // Set the searched data
          } else {
            console.log("No appointments found for the given patient ID.");
          }
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
      setLoading(false);
    };

    fetchRecentAppointments();
  }, [doctorId, searchTerm]);
  // Re-fetch when doctorId or searchTerm changes

  return (
    <div className="flex flex-col min-h-screen ml-32">
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-grow p-2 bg-[#D4E9EA] min-h-screen">
          <div className="bg-white h-full w-full">
            <DateTimeDisplay title={Title} />

            {/* Search input for Patient ID */}
            <div className="p-12">
              <input
                type="text"
                placeholder="Enter Patient Id..."
                className="w-full p-3 border-none bg-[#E9FAF2] shadow-lg rounded-[10px] focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm state as the user types
              />
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#094A4D]"></div>
              </div>
            ) : (
              // Display the table of recent appointments
              <div className="pl-12 pb-8 pr-12">
                <div className="overflow-hidden rounded-lg">
                  <table className="w-full table-auto sm:table-fixed min-w-full">
                    <thead className="text-[#094A4D] sticky top-0 bg-[#0064694e]">
                      <tr>
                        <th className="px-4 py-2 text-left">Patient ID</th>
                        <th className="px-4 py-2 text-left">Patient</th>
                        <th className="px-4 py-2 text-left">Last View</th>
                        <th className="px-4 py-2 text-left">Hospital</th>
                        <th className="px-4 py-2 text-left">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.length > 0
                        ? appointments.map((appointment, index) => (
                            <tr
                              key={appointment.id || index} // Use index as a fallback
                              className="border-b border-[#094A4D] relative odd:bg-[#E9FAF2]"
                            >
                              <td className="px-4 py-2">
                                {appointment.patientId}
                              </td>
                              <td className="px-4 py-2">
                                <div className="flex items-center space-x-3">
                                  <img
                                    src={
                                      appointment.profilePictureUrl ||
                                      "/profile.png"
                                    }
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
                                      {appointment.gender}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-2">
                                {new Date(appointment.date).toLocaleString([], {
                                  year: "numeric",
                                  month: "numeric",
                                  day: "numeric",
                                  hour: "numeric",
                                  minute: "2-digit",
                                  hour12: true,
                                })}
                              </td>
                              <td className="px-4 py-2">
                                {appointment.hospital}
                              </td>
                              <td className="px-4 py-2">
                                <button className="font-medium cursor-pointer">
                                  View
                                </button>
                              </td>
                            </tr>
                          ))
                        : null}
                      {/* No message, just no rows if no appointments */}
                    </tbody>
                  </table>
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
