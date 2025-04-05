"use client"; // Client Component

import { useEffect, useState } from "react";
import Header from "../../../../components/header/header";
import Footer from "../../../../components/footer/footer";
import NavBar from "../../../PatientAppointments/PatientComponents/navBar";
import PaymentView from "../PaymentComponents/PaymentView";
import PaymentAtLocation from "../PaymentComponents/paymentAtLocation";

function PaymentClient({ id }) {
  const [appointmentData, setAppointmentData] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState("Remote Clinic");
  const [selectedSpecialization, setSelectedSpecialization] = useState("Psyco");
  const [charge, setCharge] = useState("Free of Charge");
  const [hospitalCharge, setHospitalCharge] = useState("Free of Charge");
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    // Retrieve stored data from localStorage
    const storedData = localStorage.getItem("selectedAppointment");
    const hospital = localStorage.getItem("selectedLocation");
    const specialization = localStorage.getItem("selectedSpecialization");
    const charge = localStorage.getItem("selectedCharge");
    const hospitalCharge = localStorage.getItem("hospitalCharge");
    const selectedDate = localStorage.getItem("selectedDate");

    // Set state with the stored data
    if (storedData) {
      setAppointmentData(JSON.parse(storedData));
    }
    if (hospital) {
      setSelectedLocation(hospital);
    }
    if (specialization) {
      setSelectedSpecialization(specialization);
    }
    if (charge) {
      setCharge(charge);
    }
    if (hospitalCharge) {
      setHospitalCharge(hospitalCharge);
    }
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
  }, [id]);

  return (
    <div>
      <NavBar />
      <Header />
      
      {/* Main Content: Flex container to align PaymentView and PaymentAtLocation side by side */}
      <div className="flex justify-between w-full max-w-6xl mx-auto gap-8">
        {/* PaymentView component for left section */}
        <PaymentView />

        {/* PaymentAtLocation component for right section */}
        <PaymentAtLocation />
      </div>

      <Footer />

      {/* Uncomment the following section if you want to display appointment data */}
      {/* {appointmentData ? (
        <div>
          <p>Doctor ID: {appointmentData.doctorId}</p>
          <p>Doctor Name: {appointmentData.firstName}</p>
          <p>Appointment Time: {appointmentData.appointmentTime}</p>
          <p>Appointment Date: {appointmentData.selectedDate}</p>
          <img src={appointmentData.imageUrl} alt="Doctor" width={100} />
          <p>Hospital: {selectedLocation}</p>
          <p>Selected Specialization :{selectedSpecialization}</p>
          <p>Charge for this doctor:{charge}</p>
          <p>Charge for the hospital: {hospitalCharge}</p>
        </div>
      ) : (
        <p>No appointment details found.</p>
      )} */}
    </div>
  );
}

export default PaymentClient;
