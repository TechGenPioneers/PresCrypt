import React from 'react';
import AdminNavBar from '../AdminComponents/AdminNavBar';
import MessageTable from '../AdminComponents/ContactUsMessage';
import Footer from '../AdminComponents/Footer';

const AdminMessage = () => {
    return (
        <div className='bg-[#f3faf7]'>
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
