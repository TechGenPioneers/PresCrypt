"use client";
import React from "react";
import AdminNavBar from "../../AdminComponents/AdminNavBar";
import Footer from "@/app/Components/footer/Footer";
import DoctorDetails from "../../AdminComponents/DoctorDetails";
import { useParams } from "next/navigation"; 

const DoctorDetailPage = () => {
  const { doctorId } = useParams(); // Access the dynamic parameter

  // Check if doctorId is available
  if (!doctorId) {
    return <div>Loading...</div>; // You can show a loading message while waiting for the query
  }

  return (
    <div>
      <div className="flex">
        <div className="w-27">
          <AdminNavBar />
        </div>
        <div className="w-full">
          <DoctorDetails doctorID={doctorId} /> {/* Pass doctorId to DoctorDetails */}
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default DoctorDetailPage;
