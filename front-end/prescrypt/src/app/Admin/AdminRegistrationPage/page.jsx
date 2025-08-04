import React from 'react';
import AdminNavBar from '../AdminComponents/AdminNavBar';
import Footer from '../AdminComponents/Footer';
import AdminRegistration from '@/app/Auth/AdminRegistration/page';

const AdminRegistrationPage = () => {
    return (
        <div className='bg-[#f3faf7]'>
      <div className="flex">
        <div className="w-27">
          <AdminNavBar />
        </div>
        <div className="w-full">
          <AdminRegistration/>
        </div>
      </div>
      <div>
          <Footer />
      </div>
    </div>
    );
};

export default AdminRegistrationPage;