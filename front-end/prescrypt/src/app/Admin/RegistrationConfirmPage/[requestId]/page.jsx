"use client";
import React from 'react';
import Footer from '@/app/Components/footer/Footer';
import { useParams } from "next/navigation"; 
import AdminNavBar from '../../AdminComponents/AdminNavBar';
import DoctorConfirmForm from '../../AdminComponents/DoctorConfirmForm';

const DoctorRequestDetailPage = () => {
  const { requestId } = useParams(); 
  console.log("RequestID:", requestId);

  if (!requestId) {
    <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
                <p className="mb-4 text-lg font-semibold text-[rgba(0,126,133,0.7)]">Please wait...</p>
                <Spinner className="h-10 w-10 text-[rgba(0,126,133,0.7)]"/>
              </div>
            </div>
  }

    return (
        <div>
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