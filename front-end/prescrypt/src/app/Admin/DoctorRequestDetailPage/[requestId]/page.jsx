"use client";
import React from 'react';
import Footer from '@/app/Components/footer/Footer';
import DoctorRequestDetails from '../../AdminComponents/DoctorRequestDetails';
import { useParams } from "next/navigation"; 
import AdminNavBar from '../../AdminComponents/AdminNavBar';

const DoctorRequestDetailPage = () => {
  const { requestId } = useParams(); 
  console.log("RequestID:", requestId);

  if (!requestId) {
    return <div>Loading...</div>; // You can show a loading message while waiting for the query
  }

    return (
        <div>
      <div className="flex">
        <div className="w-27">
          <AdminNavBar />
        </div>
        <div className="w-full">
          <DoctorRequestDetails requestId={requestId}/>
        </div>
      </div>
      <div>
          <Footer />
      </div>
    </div>
    );
};

export default DoctorRequestDetailPage;