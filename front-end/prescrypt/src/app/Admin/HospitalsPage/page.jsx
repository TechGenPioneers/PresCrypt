import React from 'react';
import AdminNavBar from '../AdminComponents/AdminNavBar';
import Hospitals from '../AdminComponents/Hospitals';
import Footer from '@/app/Components/footer/Footer';
import useAuthGuard from "@/utils/useAuthGuard"; // Ensure the user is authenticated as an Admin

const HospitalsPage = () => {
    useAuthGuard(["Admin"]); 
    return (
        <div>
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