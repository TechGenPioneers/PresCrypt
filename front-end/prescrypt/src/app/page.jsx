import React from 'react';
import AdminNavBar from './Admin/AdminComponents/AdminNavBar';
import AdminDashboard from './Admin/AdminComponents/AdminDashboard';
import Footer from '@/app/Components/footer/Footer';

const AdminDashboardPage = () => {
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