'use client';
import React from 'react';
import AdminNavBar from '../AdminComponents/AdminNavBar';
import DoctorRegistrationForm from '../AdminComponents/DoctorsRegistrationForm';
import useAuthGuard from "@/utils/useAuthGuard"; 
import Footer from '../AdminComponents/Footer';
const DoctorRegistrationFormPage = () => {
    useAuthGuard("Admin");
    return (
        <div className='bg-[#f3faf7]'>
        <div className="flex">
          <div className="w-27">
            <AdminNavBar />
          </div>
          <div className="w-full">
            <DoctorRegistrationForm/>
          </div>
        </div>
        <div>
            <Footer />
        </div>
      </div>
    );
};

export default DoctorRegistrationFormPage;