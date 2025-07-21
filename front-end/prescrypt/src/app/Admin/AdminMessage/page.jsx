import React from 'react';
import AdminNavBar from '../AdminComponents/AdminNavBar';
import Footer from '@/app/Components/footer/Footer';
import MessageTable from '../AdminComponents/ContactUsMessage';
import useAuthGuard from "@/utils/useAuthGuard"; // Ensure the user is authenticated as an Admin
const AdminMessage = () => {
    useAuthGuard(["Admin"]); // Ensure the user is authenticated as an Admin
    return (
        <div>
      <div className="flex">
        <div className="w-27">
          <AdminNavBar />
        </div>
        <div className="w-full">
            <MessageTable/>
        </div>
      </div>
      <div>
          <Footer />
      </div>
    </div>
    );
};

export default AdminMessage;
