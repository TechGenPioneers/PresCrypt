import React from 'react';
import AdminNavBar from '../AdminComponents/AdminNavBar';
import ReportGenerator from '../AdminComponents/ReportGenerator';
import Footer from '@/app/Components/footer/Footer';
const AdminReportGeneratorPage = () => {
    return (
        <div>
        <div className="flex">
          <div className="w-27">
            <AdminNavBar />
          </div>
          <div className="w-full">
            <ReportGenerator/>
          </div>
        </div>
        <div>
            <Footer />
        </div>
      </div>
    );
};

export default AdminReportGeneratorPage;