import React from 'react';
import AdminNavBar from '../AdminComponents/AdminNavBar';
import Footer from '@/app/Components/footer/Footer';
import DoctorRegistrationForm from '../AdminComponents/DoctorsRegistrationForm';

const DoctorRegistrationFormPage = () => {
    return (
        <div>
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