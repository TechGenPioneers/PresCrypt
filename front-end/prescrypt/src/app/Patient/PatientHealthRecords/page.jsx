"use client";
import React from "react";
import AppointmentList from "../PatientComponents/appointmentList";
import Header from "../../Components/header/Header";
import Footer from "../../Components/footer/Footer";
import NavBar from "../PatientComponents/navBar";
import useAuthGuard from "@/utils/useAuthGuard";
import Chatbot from "../ChatbotComponents/chatbot";


const HealthRecords = () => {
  useAuthGuard(["Patient"]);
  const patientId = "P021";

  return (
    
    <div className="container mx-auto mt-8">
        <Header/>
      <AppointmentList patientId={patientId} />
      <NavBar/>
      <Chatbot />
      <Footer/>
    </div>
  );
};

export default HealthRecords;
