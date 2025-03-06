import React from 'react';
import AdminNavBar from './AdminComponents/AdminNavBar';
import Footer from '../Components/footer/Footer';
import DoctorRegistrationForm from './AdminComponents/DoctorsRegistrationForm';

const AdminDoctorsPage = () => {
    
    return (
        <div>
            <AdminNavBar/>
            <div className='ml-10'>
            <DoctorRegistrationForm/>
            </div>
            <Footer/>
        </div>
    );
};

export default AdminDoctorsPage;