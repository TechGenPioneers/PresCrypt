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
  const [selectedSpecialization, setSelectedSpecialization] = useState("Psycho");
  const [charge, setCharge] = useState("Free of Charge");
  const [hospitalCharge, setHospitalCharge] = useState("Free of Charge");
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const storedData = localStorage.getItem("selectedAppointment");
    const hospital = localStorage.getItem("selectedLocation");
    const specialization = localStorage.getItem("selectedSpecialization");
    const charge = localStorage.getItem("selectedCharge");
    const hospitalCharge = localStorage.getItem("hospitalCharge");
    const selectedDate = localStorage.getItem("selectedDate");

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
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <Header />
      <main className="flex-grow">
        <div className="flex justify-between gap-8 max-w-6xl mx-auto p-8">
          {/* Left Section for Payment View */}
          <div className="flex-1">
            <PaymentView />
          </div>
          {/* Right Section for Payment at Location */}
          <div className="flex-1">
            <PaymentAtLocation />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default PaymentClient;
