"use client";
import React, { useState, useEffect } from "react";
import PrescriptionsService from "../services/PrescriptionsService";
import PageHeaderDisplay from "../DoctorComponents/PageHeaderDisplay";
import MedicalHistoryModal from "./Modals/MedicalHistoryModal";
import useAuthGuard from "@/utils/useAuthGuard"; // Ensure the user is authenticated as a Doctor

export default function Page() {
  useAuthGuard(["Doctor"]);
  const Title = "Prescriptions";
  const doctorId =
    typeof window !== "undefined" ? localStorage.getItem("doctorId") : null;

  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showMedicalHistory, setShowMedicalHistory] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [accessGranted, setAccessGranted] = useState(true); // Assume access is granted for now

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
          appointment.patientId
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          appointment.patientName
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      )
    : appointments;

  return (
    <div className="p-1">
      <PageHeaderDisplay title={Title} />
      {/* Search input for Patient ID or Name */}
      <div className="p-12">
        <input
          type="text"
          placeholder="🔍 Search by Patient ID or Name..."
          className="w-full p-4 border-none bg-[#E9FAF2] shadow-lg rounded-[15px] focus:outline-none focus:shadow-xl transition-shadow duration-200 text-[#094A4D] placeholder-[#094A4D]/60"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col justify-center items-center h-40 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-3 border-b-3 border-[#094A4D]"></div>
          <p className="text-[#094A4D] font-medium">Loading patient data...</p>
        </div>
      ) : (
        // Display the table of recent appointments
        <div className="pl-12 pb-8 pr-12">
          <div className="rounded-lg shadow-md bg-white max-h-[400px] overflow-hidden relative border border-[#094A4D]/20">
            {filteredAppointments.length === 0 ? (
              <div className="text-center p-8 text-lg text-[#094A4D]/70">
                <div className="mb-4 text-4xl">📋</div>
                {searchTerm
                  ? "No appointments found matching your search."
                  : "No recent appointments found."}
              </div>
            ) : (
              <>
                {/* Table Header */}
                <table className="w-full table-auto sm:table-fixed">
                  <thead className="text-[#094A4D] bg-gradient-to-r from-[#0064694e] to-[#094A4D]/20">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wide">
                        Patient ID
                      </th>
                      <th className="py-4 text-left font-semibold text-sm uppercase tracking-wide">
                        Patient
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wide">
                        Last View
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wide">
                        Hospital
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wide">
                        Action
                      </th>
                    </tr>
                  </thead>
                </table>

                {/* Scrollable Table Body */}
                <div className="max-h-[360px] overflow-y-auto">
                  <table className="w-full table-auto sm:table-fixed">
                    <tbody>
                      {filteredAppointments.map((appointment, index) => (
                        <tr
                          key={appointment.id || index}
                          className="border-b border-[#094A4D]/20 relative odd:bg-[#E9FAF2]/50 hover:bg-[#E9FAF2]/80 transition-colors duration-150"
                        >
                          <td className="px-6 py-4 font-medium text-[#094A4D]">
                            {appointment.patientId}
                          </td>
                          <td className="py-4">
                            <div className="flex items-center space-x-3">
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

                              <div className="flex flex-col">
                                <span className="font-semibold text-[#094A4D]">
                                  {appointment.patientName}
                                </span>
                                <span className="text-sm text-[#094A4D]/60 flex items-center space-x-1">
                                  <span>{appointment.gender}</span>
                                  <span>•</span>
                                  <span>
                                    {calculateAge(appointment.dob)} yrs
                                  </span>
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-medium text-[#094A4D]">
                                {new Date(appointment.date).toLocaleDateString(
                                  "en-US"
                                )}
                              </span>
                              <span className="text-sm text-[#094A4D]/60">
                                {new Date(
                                  `1970-01-01T${appointment.time}`
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                })}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-[#094A4D]">
                            {appointment.hospitalName}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              className="bg-[#0064694e] text-[#094A4D] px-4 py-2 rounded-lg font-medium cursor-pointer hover:bg-[#094A4D]/90 hover:text-white transition-colors duration-200 shadow-sm hover:shadow-md"
                              onClick={() => handleViewClick(appointment)}
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Medical History Modal */}
      <MedicalHistoryModal
        isOpen={showMedicalHistory}
        onClose={closeModals}
        patient={selectedPatient}
        calculateAge={calculateAge}
        doctorId={doctorId}
      />
    </div>
  );
}
