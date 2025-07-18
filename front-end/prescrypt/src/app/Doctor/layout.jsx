"use client";
import React, { useEffect } from "react";
import Sidebar from "./DoctorComponents/DoctorSidebar";
import Footer from "../Components/footer/Footer";
import { getDoctorIdFromServer } from "./services/DoctorService";

export default function DoctorLayout({ children }) {
  useEffect(() => {
    const doctorId = localStorage.getItem("doctorId");
    if (!doctorId) {
      getDoctorIdFromServer(); // fetch and store doctorId
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen ml-32">
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-grow p-2 bg-[#D4E9EA] min-h-screen">
          <div className="bg-white h-full w-full">{children}</div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
