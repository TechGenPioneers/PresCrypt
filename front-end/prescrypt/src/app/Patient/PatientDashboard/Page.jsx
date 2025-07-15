"use client";
import Footer from "../../Components/footer/Footer";
import Header from "../../Components/header/Header";
import NavBar from "../PatientComponents/navBar";
import PatientDashboardSection from "../PatientComponents/patientDashboard";
import React from "react";
import useAuthGuard from "@/utils/useAuthGuard";
import Chatbot from "../ChatbotComponents/chatbot";

export default function Home() {
  useAuthGuard(["Patient"]);

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background image with opacity */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 z-0"
        style={{ backgroundImage: "url('/BGImage.png')" }}
      ></div>


      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <NavBar />
        <main className="flex-grow">
          <PatientDashboardSection />
        </main>
        <Chatbot />
        <Footer />
      </div>
    </div>
  );
}
