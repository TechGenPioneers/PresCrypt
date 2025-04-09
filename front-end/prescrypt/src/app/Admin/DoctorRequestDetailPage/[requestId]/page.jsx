import React from 'react';
import AdminNavBar from '../AdminComponents/AdminNavBar';
import Footer from '@/app/Components/footer/Footer';
import DoctorRequestDetails from '../AdminComponents/DoctorRequestDetails';

const DoctorRequestDetailPage = () => {
  const { requestID } = useParams(); 
    return (
        <div>
      <div className="flex">
        <div className="w-27">
          <AdminNavBar />
        </div>
        <div className="w-full">
          <DoctorRequestDetails requestID={requestID}/>
        </div>
      </div>
      <div>
          <Footer />
      </div>
    </div>
    );
};

export default DoctorRequestDetailPage;