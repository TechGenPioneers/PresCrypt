import React from "react";
import AdminNavBar from "../AdminComponents/AdminNavBar";
import Doctors from "../AdminComponents/Doctors";
import Footer from "@/app/Components/footer/Footer";

const AdminDoctorsPage = () => {
  return (
    <div>
      <div className="flex">
        <div className="w-27">
          <AdminNavBar />
        </div>
        <div className="w-full">
          <Doctors/>
        </div>
      </div>
      <div>
          <Footer />
      </div>
    </div>
  );
};

export default AdminDoctorsPage;
