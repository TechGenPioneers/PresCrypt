"use client";
import React, { useState, useEffect } from "react";
import Footer from "../../Components/footer/Footer";
import Sidebar from "../DoctorComponents/DoctorSidebar";
import DateTimeDisplay from "../DoctorComponents/DateTimeDisplay";
import PatientViewModal from "./PatientViewModal";
import axiosInstance from "../utils/axiosInstance";

export default function page() {
  const Title = "Patients";
  const [allPatients, setAllPatients] = useState({ past: [], future: [] });
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noPatients, setNoPatients] = useState(false);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [patientType, setPatientType] = useState("past");

  const doctorId = "D002"; // to be replaced with login user

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const [pastResponse, futureResponse] = await Promise.all([
        axiosInstance.get(`/DoctorPatient/patient-details/${doctorId}?type=past`)
          .catch(err => {
            if (err.response?.status === 404) {
              return { data: [] }; //as empty data
            }
            throw err;
          }),
        axiosInstance.get(`/DoctorPatient/patient-details/${doctorId}?type=future`)
          .catch(err => {
            if (err.response?.status === 404) {
              return { data: [] };
            }
            throw err;
          })
      ]);
    
      setAllPatients({
        past: pastResponse.data || [],
        future: futureResponse.data || []
      });
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

  //filtered patients
  useEffect(() => {
    let patientsToFilter = patientType === "past" ? allPatients.past : allPatients.future;
    
    if (searchTerm) {
      // earch through all patients regardless of type
      patientsToFilter = [...allPatients.past, ...allPatients.future].filter(
        (p) =>
          p.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.patientId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredPatients(patientsToFilter);
    setNoPatients(patientsToFilter.length === 0);
  }, [patientType, searchTerm, allPatients]);

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

            <div className="p-12">
              <input
                type="text"
                placeholder="Search by Patient ID or Name..."
                className="w-full p-3 border-none bg-[#E9FAF2] shadow-lg rounded-[10px] focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="px-12 pb-4 flex gap-6">
              <label className="flex items-center gap-2 text-[#094A4D] font-medium">
                <input
                  type="radio"
                  name="patientType"
                  value="past"
                  checked={patientType === "past"}
                  onChange={(e) => setPatientType(e.target.value)}
                  className="accent-[#094A4D]"
                />
                Visited patients
              </label>

              <label className="flex items-center gap-2 text-[#094A4D] font-medium">
                <input
                  type="radio"
                  name="patientType"
                  value="future"
                  checked={patientType === "future"}
                  onChange={(e) => setPatientType(e.target.value)}
                  className="accent-[#094A4D]"
                />
                New Patients
              </label>
            </div>

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
                        <th className="px-4 py-2 text-left">Last Visit</th>
                        <th className="py-2 text-left">Hospital</th>
                        <th className="px-4 py-2 text-left">Action</th>
                      </tr>
                    </thead>
                  </table>

                  <div className="overflow-y-auto max-h-[330px]">
                    <table className="w-full table-auto sm:table-fixed min-w-full">
                      <tbody>
                        {filteredPatients.length > 0 ? (
                          filteredPatients.map((patient) => (
                            <tr
                              key={patient.appointmentId}
                              className="border-b border-[#094A4D] relative odd:bg-[#E9FAF2]"
                            >
                              <td className="px-4 py-2">
                                {patient.patientId}
                              </td>
                              <td className="py-2">
                                <div className="flex items-center space-x-3">
                                  <img
                                    src={`data:image/jpeg;base64,${patient.profileImage}`}
                                    alt="Profile"
                                    width={50}
                                    height={50}
                                    className="rounded-full"
                                  />
                                  <div className="flex flex-col">
                                    <span className="font-semibold">
                                      {patient.patientName}
                                    </span>
                                    <span className="text-sm text-gray-600">
                                      {getGenderFullName(patient.gender)},{" "}
                                      {calculateAge(patient.dob)} yrs
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-2">
                                {new Date(patient.date).toLocaleDateString(
                                  "en-US"
                                )}
                              </td>
                              <td className="py-2">{patient.hospitalName}</td>
                              <td>
                                <button
                                  onClick={() => handleViewClick(patient)}
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
                              {noPatients ? "No patients found." : "Loading..."}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

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