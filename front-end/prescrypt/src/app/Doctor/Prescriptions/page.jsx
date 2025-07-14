"use client";
import React, { useState, useEffect } from "react";
import Footer from "../../Components/footer/Footer";
import Sidebar from "../DoctorComponents/DoctorSidebar";
import PrescriptionsService from "../services/PrescriptionsService"; 
import DateTimeDisplay from "../DoctorComponents/DateTimeDisplay";
import MedicalHistoryModal from "./Modals/MedicalHistoryModal";
import useAuthGuard from "@/utils/useAuthGuard"; // Ensure the user is authenticated as a Doctor

export default function Page() {
  const Title = "Prescriptions";
  //useAuthGuard("Doctor"); 
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [doctorId, setDoctorId] = useState("D002");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showMedicalHistory, setShowMedicalHistory] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [accessGranted, setAccessGranted] = useState(true); // Assume access is granted for now

  //const doctorId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await PrescriptionsService.getRecentByDoctor(doctorId);
        setAppointments(data.length === 0 ? [] : data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [doctorId]);

  const handleViewClick = (appointment) => {
    setSelectedPatient(appointment);
    if (accessGranted) {
      setShowMedicalHistory(true);
    } else {
      setShowRequestModal(true);
    }
  };

  const handleRequestAccess = (reason) => {
    // In a real implementation, this would send a request to backend
    console.log("Access requested for:", selectedPatient.patientId);
    console.log("Reason:", reason);
    // For now, we'll simulate access being granted
    setAccessGranted(true);
    setShowRequestModal(false);
    setShowMedicalHistory(true);
  };

  const closeModals = () => {
    setShowMedicalHistory(false);
    setShowRequestModal(false);
    setSelectedPatient(null);
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

  const filteredAppointments = searchTerm
    ? appointments.filter(
        (appointment) =>
          appointment.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : appointments;

  return (
    <div className="flex flex-col min-h-screen ml-32">
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-grow p-2 bg-[#D4E9EA] min-h-screen">
          <div className="bg-white h-full w-full">
            <DateTimeDisplay title={Title} />

            {/* Search input for Patient ID or Name */}
            <div className="p-12">
              <input
                type="text"
                placeholder="Search by Patient ID or Name..."
                className="w-full p-3 border-none bg-[#E9FAF2] shadow-lg rounded-[10px] focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                  {filteredAppointments.length === 0 ? (
                    <div className="text-center p-4 text-lg text-gray-600">
                      {searchTerm
                        ? "No appointments found matching your search."
                        : "No recent appointments found."}
                    </div>
                  ) : (
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
                        {filteredAppointments.map((appointment, index) => (
                          <tr
                            key={appointment.id || index}
                            className="border-b border-[#094A4D] relative odd:bg-[#E9FAF2]"
                          >
                            <td className="px-4 py-2">{appointment.patientId}</td>
                            <td className="px-4 py-2">
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
                            <td className="px-4 py-2">
                              {new Date(appointment.date).toLocaleDateString("en-US")}{" "}
                              <span className="text-sm text-gray-600">
                                {new Date(`1970-01-01T${appointment.time}`).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                })}
                              </span>
                            </td>
                            <td className="px-4 py-2">{appointment.hospitalName}</td>
                            <td className="px-4 py-2">
                              <button
                                className="font-medium cursor-pointer text-[#094A4D] hover:underline"
                                onClick={() => handleViewClick(appointment)}
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />

      {/* Medical History Modal */}
      <MedicalHistoryModal
        isOpen={showMedicalHistory}
        onClose={closeModals}
        patient={selectedPatient}
        calculateAge={calculateAge}
      />
      
    </div>
  );
}
