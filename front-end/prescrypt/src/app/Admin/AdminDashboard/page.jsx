'use client';
import React from 'react';
import AdminNavBar from '../AdminComponents/AdminNavBar';
import AdminDashboard from '../AdminComponents/AdminDashboard';
import Footer from '@/app/Components/footer/Footer';
import useAuthGuard from "@/utils/useAuthGuard"; // Ensure the user is authenticated as a Admin
const AdminDashboardPage = () => {
    useAuthGuard("Admin"); // Ensure the user is authenticated as a Admin
    return (
        <div>
      <div className="flex">
        <div className="w-27">
          <AdminNavBar />
        </div>
        <div className="w-full">
          <AdminDashboard/>
        </div>
      </div>
      <div>
          <Footer />
      </div>
    </div>
    );
};

export default AdminDashboardPage;