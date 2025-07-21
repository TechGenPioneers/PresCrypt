"use client";
import React from 'react';
import AdminNavBar from '../AdminComponents/AdminNavBar';
import DoctorRequest from '../AdminComponents/DoctorRequest';
import useAuthGuard from "@/utils/useAuthGuard"; 
import Footer from '../AdminComponents/Footer';


const DoctorRequestPage = () => {
    return (
        <div className='bg-[#f3faf7]'>
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