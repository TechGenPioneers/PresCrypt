"use client";
import React, { useState, useEffect } from "react";
import DateTimeDisplay from "../DoctorComponents/DateTimeDisplay";
import PageHeaderDisplay from "../DoctorComponents/PageHeaderDisplay"
import PatientViewModal from "./PatientViewModal";
import DoctorPatientsService from "../services/DoctorPatientsService";
import { Calendar, MapPin, Filter } from "lucide-react";
export default function page() {
  const Title = "Patients";
  const doctorId =
    typeof window !== "undefined" ? localStorage.getItem("doctorId") : null;
  const [allPatients, setAllPatients] = useState({ past: [], future: [] });
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noPatients, setNoPatients] = useState(false);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [patientType, setPatientType] = useState("past");

  // Hospital filter states
  const [selectedHospital, setSelectedHospital] = useState("");
  const [hospitalList, setHospitalList] = useState([]);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const [pastPatients, futurePatients] = await Promise.all([
        DoctorPatientsService.getPatientsByType(doctorId, "past"),
        DoctorPatientsService.getPatientsByType(doctorId, "future"),
      ]);

      const allFetchedPatients = {
        past: pastPatients || [],
        future: futurePatients || [],
      };
      setAllPatients(allFetchedPatients);

      // Get unique hospitals
      const hospitals = [...pastPatients, ...futurePatients]
        .map((p) => p.hospitalName)
        .filter((v, i, a) => v && a.indexOf(v) === i);

      setHospitalList(hospitals);
      setNoPatients(hospitals.length === 0);
    } catch (error) {
      console.error("Error:", error);
      setNoPatients(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // filtered patients
  useEffect(() => {
    let patientsToFilter =
      patientType === "past" ? allPatients.past : allPatients.future;

    if (searchTerm) {
      patientsToFilter = patientsToFilter.filter(
        (p) =>
          p.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.patientId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedHospital) {
      patientsToFilter = patientsToFilter.filter(
        (p) => p.hospitalName === selectedHospital
      );
    }

    setFilteredPatients(patientsToFilter);
    setNoPatients(patientsToFilter.length === 0);
  }, [patientType, searchTerm, selectedHospital, allPatients]);

  const calculateAge = (dob) => {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleViewClick = (patient) => {
    setSelectedPatient(patient);
    setIsPatientModalOpen(true);
  };

  return (
    <div className="p-1">
      <PageHeaderDisplay title={Title}/>

      {/* Search input for Patient ID or Name */}
      <div className="pl-12 pt-8 pb-5">
        <input
          type="text"
          placeholder="🔍 Search by Patient ID or Name..."
          className="w-full p-4 border-none bg-[#E9FAF2] shadow-lg rounded-[15px] focus:outline-none focus:shadow-xl transition-shadow duration-200 text-[#094A4D] placeholder-[#094A4D]/60"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Filter Controls */}
      <div className="px-12 pb-5">
        <div className="flex flex-wrap items-center gap-6">
          {/* Patient Type Filter */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-[#094A4D]" />
              <span className="text-sm font-medium text-[#094A4D]">
                Patient Type:
              </span>
            </div>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="patientType"
                value="past"
                checked={patientType === "past"}
                onChange={(e) => setPatientType(e.target.value)}
                className="w-4 h-4 text-[#094A4D] focus:ring-[#094A4D]"
              />
              <span className="text-sm text-[#094A4D]">
                Visited Patients
              </span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="patientType"
                value="future"
                checked={patientType === "future"}
                onChange={(e) => setPatientType(e.target.value)}
                className="w-4 h-4 text-[#094A4D] focus:ring-[#094A4D]"
              />
              <span className="text-sm text-[#094A4D]">New Patients</span>
            </label>
          </div>

          {/* Hospital Filter */}
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-[#094A4D]" />
            <select
              value={selectedHospital}
              onChange={(e) => setSelectedHospital(e.target.value)}
              className="px-4 py-2 bg-[#E9FAF2] border border-[#094A4D]/20 rounded-xl text-[#094A4D] focus:outline-none focus:ring-2 focus:ring-[#094A4D] cursor-pointer"
            >
              <option value="">All Hospitals</option>
              {hospitalList.map((hospital) => (
                <option key={hospital} value={hospital}>
                  {hospital}
                </option>
              ))}
            </select>
          </div>

          {/* Results Count */}
          <div className="ml-auto flex items-center space-x-2 text-sm text-[#094A4D]">
            <Filter className="w-4 h-4" />
            <span>{filteredPatients.length} patients found</span>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col justify-center items-center h-40 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-3 border-b-3 border-[#094A4D]"></div>
          <p className="text-[#094A4D] font-medium">Loading patient data...</p>
        </div>
      ) : (
        // Display the table of patients
        <div className="pl-12 pb-8 pr-12">
          <div className="rounded-lg shadow-md bg-white max-h-[418px] overflow-hidden relative border border-[#094A4D]/20">
            {filteredPatients.length === 0 ? (
              <div className="text-center p-8 text-lg text-[#094A4D]/70">
                <div className="mb-4 text-4xl">👥</div>
                {searchTerm || selectedHospital
                  ? "No patients found matching your search."
                  : "No patients found."}
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
                      <th className="px-14 py-4 text-left font-semibold text-sm uppercase tracking-wide">
                        Last Appointment Date
                      </th>
                      
                      <th className="px-16 py-4 text-left font-semibold text-sm uppercase tracking-wide">
                        Action
                      </th>
                    </tr>
                  </thead>
                </table>

                {/* Scrollable Table Body */}
                <div className="max-h-[340px] overflow-y-auto">
                  <table className="w-full table-auto sm:table-fixed">
                    <tbody>
                      {filteredPatients.map((patient, index) => (
                        <tr
                          key={patient.appointmentId}
                          className="border-b border-[#094A4D]/20 relative odd:bg-[#E9FAF2]/50 hover:bg-[#E9FAF2]/80 transition-colors duration-150"
                        >
                          <td className="px-6 py-4 font-medium text-[#094A4D]">
                            {patient.patientId}
                          </td>
                          <td className="py-4">
                            <div className="flex items-center space-x-4">
                              <div className="relative">
                               <div className="relative w-[50px] h-[50px] shrink-0">
                              <img
                                src={
                                  patient.profileImage
                                    ? `data:image/jpeg;base64,${patient.profileImage}`
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
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#E9FAF2] rounded-full border-2 border-white"></div>
                              </div>
                              <div className="flex flex-col">
                                <span className="font-semibold text-[#094A4D]">
                                  {patient.patientName}
                                </span>
                                <span className="text-sm text-[#094A4D]/60 flex items-center space-x-1">
                                  <span>{patient.gender}</span>
                                  <span>•</span>
                                  <span>
                                    {calculateAge(patient.dob)} yrs
                                  </span>
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-16 py-4">
                            <div className="flex flex-col">
                              <span className="font-medium text-[#094A4D]">
                                {new Date(patient.date).toLocaleDateString(
                                  "en-US"
                                )}
                              </span>
                            </div>
                          </td>
                          
                          <td className="px-18 py-4">
                            <button
                              className="bg-[#0064694e] text-[#094A4D] px-4 py-2 rounded-lg font-medium cursor-pointer hover:bg-[#094A4D]/90 hover:text-white transition-colors duration-200 shadow-sm hover:shadow-md"
                              onClick={() => handleViewClick(patient)}
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

      <PatientViewModal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        patient={selectedPatient}
      />
      <DateTimeDisplay />
    </div>
  );
}