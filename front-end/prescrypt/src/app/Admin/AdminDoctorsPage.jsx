import React from 'react';
import AdminNavBar from './AdminComponents/AdminNavBar';
import Doctors from './AdminComponents/Doctors';
import Footer from '../Components/footer/Footer';
import DoctorDetails from './AdminComponents/DoctorDetails';

const AdminDoctorsPage = () => {
    
    return (
        <div>
            <AdminNavBar/>
            <div className='ml-10'>
            {/* <AdminDashboard/> */}
            <DoctorDetails/>
            </div>
            <Footer/>
        </div>
    );
};

export default AdminDoctorsPage;