"use client";
import React, { useState, useEffect } from "react";
import AdminNavBar from "../AdminComponents/AdminNavBar";
import Footer from "@/app/Components/footer/Footer";
import ManageDoctor from "../AdminComponents/ManageDoctor";
import { Spinner } from "@material-tailwind/react";

const ManageDoctorPage = () => {
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

  // Show loading message if doctor data is not yet available
  if (!doctorData) {
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
        <p className="mb-4 text-lg font-semibold text-[rgba(0,126,133,0.7)]">
          Please wait...
        </p>
        <Spinner className="h-10 w-10 text-[rgba(0,126,133,0.7)]" />
      </div>
    </div>;
  }

  return (
    <div>
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
