import React from "react";
import AdminNavBar from "./AdminComponents/AdminNavBar";
import Footer from "../Components/footer/Footer";
import Doctors from "./AdminComponents/Doctors";
import Patients from "./AdminComponents/Patients";
import DoctorRegistrationForm from "./AdminComponents/DoctorsRegistrationForm";

const AdminDoctorsPage = () => {
  return (
    <div>
      <div>
        <AdminNavBar />
        <div className="ml-10">
          <DoctorRegistrationForm />
        </div>
      </div>

      <div className="">
      <Footer />
      </div>
    </div>
  );
};

export default AdminDoctorsPage;
