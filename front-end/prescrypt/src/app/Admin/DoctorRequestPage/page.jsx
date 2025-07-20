"use client";
import React from 'react';
import AdminNavBar from '../AdminComponents/AdminNavBar';
import DoctorRequest from '../AdminComponents/DoctorRequest';
import Footer from '@/app/Components/footer/Footer';
import DoctorRequestDetails from '../AdminComponents/DoctorRequestDetails';
import useAuthGuard from "@/utils/useAuthGuard"; 
const DoctorRequestPage = () => {
    useAuthGuard("Admin");  
    return (
        <div>
      <div className="flex">
        <div className="w-27">
          <AdminNavBar />
        </div>
        <div className="w-full">
          <DoctorRequest/>
        </div>
      </div>
      <div>
          <Footer />
      </div>
    </div>
    );
};

export default DoctorRequestPage;