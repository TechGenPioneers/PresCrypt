import React from 'react';
import AdminNavBar from './AdminComponents/AdminNavBar';
import AdminDashboard from './AdminComponents/AdminDashboard';
import Footer from '../Components/footer/Footer';

const Admin = () => {
    return (
        <div>
            <AdminNavBar/>
            <div className='ml-10'>
            <AdminDashboard/>
            </div>
            <Footer/>
        </div>
    );
};

export default Admin;