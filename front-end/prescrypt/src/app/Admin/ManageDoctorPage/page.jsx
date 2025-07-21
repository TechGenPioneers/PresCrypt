"use client";
import React, { useState, useEffect } from "react";
import AdminNavBar from "../AdminComponents/AdminNavBar";
import ManageDoctor from "../AdminComponents/ManageDoctor";
import useAuthGuard from "@/utils/useAuthGuard"; 
import Footer from "../AdminComponents/Footer";
const ManageDoctorPage = () => {
  useAuthGuard("Admin"); 
  const [doctorData, setDoctorData] = useState(null); // Initialize as null

  // UseEffect to fetch doctor data from localStorage
  useEffect(() => {
    const storedDoctor = localStorage.getItem("doctor");
    if (storedDoctor) {
      setDoctorData(JSON.parse(storedDoctor));
      console.log("Manage: storeDoctor", { storedDoctor });
    }
  }, []);

  // Log doctorData once it's updated
  useEffect(() => {
    if (doctorData) {
      console.log("Manage: doctorData", doctorData);
    }
  }, [doctorData]);

  return (
    <div className="bg-[#f3faf7]">
      <div className="flex">
        <div className="w-27">
          <AdminNavBar />
        </div>
        <div className="w-full">
          <ManageDoctor doctorData={doctorData} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ManageDoctorPage;
