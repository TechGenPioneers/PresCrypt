'use client';
import React, { useState } from 'react';
import AdminNavBar from '../AdminComponents/AdminNavBar';
import AdminDashboard from '../AdminComponents/AdminDashboard';
import useAuthGuard from "@/utils/useAuthGuard"; // Ensure the user is authenticated as a Admin
import Footer from '../AdminComponents/Footer';
const AdminDashboardPage = () => {
    useAuthGuard("Admin"); // Ensure the user is authenticated as a Admin
    const [adminName,setAdminName] = useState("")
    return (
        <div className='bg-[#f3faf7]'>
      <div className="flex">
        <div className="w-27">
          <AdminNavBar
          adminName={adminName}
          />
        </div>
        <div className="w-full">
          <AdminDashboard
          setAdminName={setAdminName}
          />
        </div>
      </div>
      <div>
          <Footer />
      </div>
    </div>
    );
};

export default AdminDashboardPage;