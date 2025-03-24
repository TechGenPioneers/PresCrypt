// src/app/Patient/Bookings/Payments/[id]/PaymentClient.jsx
"use client"; // Client Component

import { useEffect, useState } from "react";
import Header from "../../../../components/header/header";
import Footer from "../../../../components/footer/footer";

function PaymentClient({ id }) {
  const [appointmentData, setAppointmentData] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState("Remote Clinic");
  const [selectedSpecialization, setSelectedSpecialization] = useState("Psyco");
  const [charge,setCharge]= useState("Free of Charge");
  const [hospitalCharge,setHospitalCharge]=useState("Free of Charge");

  useEffect(() => {
    // Log the ID to ensure it's passed correctly
    console.log("Payment for ID:", id);

    // Get data from localStorage if available
    const storedData = localStorage.getItem("selectedAppointment");
    const hospital =localStorage.getItem("selectedLocation");
    const specialization = localStorage.getItem("selectedSpecialization");
    const charge= localStorage.getItem("selectedCharge");
    const hospitalCharge=localStorage.getItem("hospitalCharge");

    if (storedData) {
      setAppointmentData(JSON.parse(storedData));
    }
    if(hospital){
      setSelectedLocation(hospital);
    }
    if(specialization){
      setSelectedSpecialization(specialization);
    }
    if(charge){
      setCharge(charge);
    }
    if(hospitalCharge){
      setHospitalCharge(hospitalCharge);
    }
  }, [id]);


  return (
    <div>
      <Header/>
      <h1>This is payment for: {id}</h1>

      {appointmentData ? (
        <div>
          <p>Doctor ID: {appointmentData.doctorId}</p>
          <p>Doctor Name: {appointmentData.doctorName}</p>
          <p>Appointment Time: {appointmentData.appointmentTime}</p>
          <p>Appointment Date: {appointmentData.appointmentDate}</p>
          <img src={appointmentData.imageUrl} alt="Doctor" width={100} />
          <p>Hospital: {selectedLocation}</p>
          <p>Selected Specialization :{selectedSpecialization}</p>
          <p>Charge for this doctor:{charge}</p>
          <p>Charge for the hospital: {hospitalCharge}</p>
        </div>
      ) : (
        <p>No appointment details found.</p>
      )}
      <Footer/>
    </div>
  );
}

export default PaymentClient;
