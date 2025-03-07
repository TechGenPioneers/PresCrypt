import React from 'react';
import AdminDashboard from './AdminComponents/AdminDashboard';
import AdminNavBar from './AdminComponents/AdminNavBar';
import Footer from '../Components/footer/Footer';

const AdminDashboardPage = () => {
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

export default AdminDashboardPage;