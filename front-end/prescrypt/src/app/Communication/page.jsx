"use client";
import React from "react";
import Footer from "../Components/footer/Footer";
import { VideoCallProvider } from "./VideoCallProvider";
import Layout from "./Layout";
import PatientNavBar from "../Patient/PatientComponents/navBar";
import Sidebar from "../Doctor/DoctorComponents/DoctorSidebar";

export default function Chat() {
  // const userId = "D002";
  // const userRole = "Doctor";
  let userId;
  const userRole = localStorage.getItem("userRole");

  if (userRole === "Patient") {
    userId = localStorage.getItem("patientId");
  }

  if (userRole === "Doctor") {
    userId = localStorage.getItem("doctorId");
  }
  return (
    <div className="min-h-screen flex flex-col">
      {/* Conditional Navbars */}

      <div className="flex">
        <div className="w-27">
          {userRole === "Patient" && <PatientNavBar />}
        {userRole === "Doctor" && <Sidebar />}
        </div>

        {/* Main content area */}
        <div className="w-full">
          <VideoCallProvider>
            <Layout userId={userId} userRole={userRole} />
          </VideoCallProvider>
        </div>
      </div>
    </div>
  );
}
