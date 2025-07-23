"use client";
import React from 'react';
import { useParams } from "next/navigation"; 
import AdminNavBar from '../../AdminComponents/AdminNavBar';
import DoctorConfirmForm from '../../AdminComponents/DoctorConfirmForm';
import useAuthGuard from '@/utils/useAuthGuard';
import Footer from '../../AdminComponents/Footer';


const DoctorRequestDetailPage = () => {
  const { requestId } = useParams(); 
  console.log("RequestID:", requestId);


    return (
        <div className='bg-[#f3faf7]'>
      <div className="flex">
        <div className="w-27">
          <AdminNavBar />
        </div>
        <div className="w-full">
          <DoctorConfirmForm requestId={requestId}/>
        </div>
      </div>
      <div>
          <Footer />
      </div>
    </div>
    );
};

export default DoctorRequestDetailPage;