"use client";
import React from 'react';
import { useParams } from "next/navigation"; 
import AdminNavBar from '../../AdminComponents/AdminNavBar';
import PatientDetails from '../../AdminComponents/PatientDetails';
import useAuthGuard from '@/utils/useAuthGuard';
import Footer from '../../AdminComponents/Footer';

const PatientDetailsPage = () => {
  const { patientId } = useParams(); 
  console.log("patientId:", patientId);

    return (
        <div className='bg-[#f3faf7]'>
      <div className="flex">
        <div className="w-27">
          <AdminNavBar />
        </div>
        <div className="w-full">
          <PatientDetails patientId={patientId}/>
        </div>
      </div>
      <div>
          <Footer />
      </div>
    </div>
    );
};

export default PatientDetailsPage;