

import React from "react";
import AppointmentList from "../PatientComponents/appointmentList";
import Header from "../../Components/header/Header";
import Footer from "../../Components/footer/Footer";
import NavBar from "../PatientComponents/navBar";


const HealthRecords = () => {
  const patientId = "P021";

  return (
    
    <div className="container mx-auto mt-8">
        <Header/>
      <AppointmentList patientId={patientId} />
      <NavBar/>
      <Footer/>
    </div>
  );
};

export default HealthRecords;
