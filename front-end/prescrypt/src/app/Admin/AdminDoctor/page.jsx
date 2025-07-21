"use client";
import React from "react";
import AdminNavBar from "../AdminComponents/AdminNavBar";
import Doctors from "../AdminComponents/Doctors";

import useAuthGuard from "@/utils/useAuthGuard"; 
import Footer from "../AdminComponents/Footer";

const AdminDoctorsPage = () => {
  useAuthGuard("Admin"); // Ensure the user is authenticated as an Admin
  return (
    <div className="bg-[#f3faf7]">
      <div className="flex ">
        <div className="w-27">
          <AdminNavBar />
        </div>
        <div className="w-full">
          <Doctors/>
        </div>
      </div>
      <div>
          <Footer />
      </div>
    </div>
  );
};

export default AdminDoctorsPage;
