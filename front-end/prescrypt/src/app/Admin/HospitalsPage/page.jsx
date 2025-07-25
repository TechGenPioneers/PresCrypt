import React from 'react';
import AdminNavBar from '../AdminComponents/AdminNavBar';
import Hospitals from '../AdminComponents/Hospitals';
import Footer from '../AdminComponents/Footer';

const HospitalsPage = () => {
    return (
        <div className='bg-[#f3faf7]'>
      <div className="flex">
        <div className="w-27">
          <AdminNavBar />
        </div>
        <div className="w-full">
          <Hospitals/>
        </div>
      </div>
      <div>
          <Footer />
      </div>
    </div>
    );
};

export default HospitalsPage;