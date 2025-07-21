"use client";
import React from "react";
import AdminNavBar from "../../AdminComponents/AdminNavBar";
import DoctorDetails from "../../AdminComponents/DoctorDetails";
import { useParams } from "next/navigation"; 
import useAuthGuard from "@/utils/useAuthGuard";
import Footer from "../../AdminComponents/Footer";
const DoctorDetailPage = () => {
  useAuthGuard("Admin"); 
  const { doctorId } = useParams(); // Access the dynamic parameter

  // Check if doctorId is available
  if (!doctorId) {
    <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
                <p className="mb-4 text-lg font-semibold text-[rgba(0,126,133,0.7)]">Please wait...</p>
                <Spinner className="h-10 w-10 text-[rgba(0,126,133,0.7)]"/>
              </div>
            </div>
  }

  return (
    <div className="bg-[#f3faf7]">
      <div className="flex">
        <div className="w-27">
          <AdminNavBar />
        </div>
        <div className="w-full">
          <DoctorDetails doctorID={doctorId} /> 
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default DoctorDetailPage;
