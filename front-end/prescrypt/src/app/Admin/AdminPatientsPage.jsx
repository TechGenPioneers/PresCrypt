import React from 'react';
import Footer from '../Components/footer/Footer';
import Patients from './AdminComponents/Patients';
import AdminNavBar from './AdminComponents/AdminNavBar';

const AdminPatientsPage = () => {
    return (
        <div>
            <AdminNavBar/>
            <div className='ml-10'>
            <Patients/>
            </div>
            <Footer/>
        </div>
    );
};

export default AdminPatientsPage;