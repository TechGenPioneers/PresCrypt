import React from 'react';
import AdminNavBar from '../AdminComponents/AdminNavBar';
import Patients from '../AdminComponents/Patients';
import Footer from '@/app/Components/footer/Footer';

const AdminPatientsPage = () => {
    return (
        <div>
      <div className="flex">
        <div className="w-27">
          <AdminNavBar />
        </div>
        <div className="w-full">
          <Patients/>
        </div>
      </div>
      <div>
          <Footer />
      </div>
    </div>
    );
};

export default AdminPatientsPage;