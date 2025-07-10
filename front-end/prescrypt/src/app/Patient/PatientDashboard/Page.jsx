"use client"

import Footer from "../../Components/footer/Footer";
import Header from "../../Components/header/Header";
import NavBar from "../PatientComponents/navBar";
import PatientDashboardSection from "../PatientComponents/patientDashboard";
import React from "react";
import { useEffect } from "react";
import useAuthGuard from "@/utils/useAuthGuard";
import Chatbot from "../ChatbotComponents/chatbot";

export default function Home() {
 useAuthGuard(["Patient"]);
  return (
    <div>
      <Header/>
      <NavBar/>
      <PatientDashboardSection />
      <Chatbot />
      <Footer/>
    </div>
  );
}
