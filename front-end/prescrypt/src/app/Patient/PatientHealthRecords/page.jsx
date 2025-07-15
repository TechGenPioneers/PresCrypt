"use client";
import React, { useEffect, useState } from "react";
import AppointmentList from "../PatientComponents/appointmentList";
import Header from "../../Components/header/Header";
import Footer from "../../Components/footer/Footer";
import NavBar from "../PatientComponents/navBar";
import useAuthGuard from "@/utils/useAuthGuard";
import Chatbot from "../ChatbotComponents/chatbot";

const HealthRecords = () => {
  useAuthGuard(["Patient"]);
  const [patientId, setPatientId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedId = localStorage.getItem("patientId");
    console.log("Retrieved from localStorage:", storedId);
    setPatientId(storedId);
    setLoading(false); 
  }, []);

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="container mx-auto mt-8">
      <Header />
      {patientId ? (
        <AppointmentList patientId={patientId} />
      ) : (
        <div className="text-center text-red-600 font-semibold">
          Patient ID not found. Please log in again.
        </div>
      )}
      <NavBar />
      <Chatbot />
      <Footer />
    </div>
  );
};

export default HealthRecords;
