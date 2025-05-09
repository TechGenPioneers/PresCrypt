"use client";

import { useEffect, useState } from "react";
import Header from "../../../../components/header/header";
import Footer from "../../../../components/footer/footer";
import NavBar from "../../../PatientComponents/navBar";
import PaymentView from "../../../PatientComponents/paymentView";

function PaymentClient({ id }) {
  const [appointmentData, setAppointmentData] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [charge, setCharge] = useState(0);
  const [hospitalCharge, setHospitalCharge] = useState(0);
  const [paymentId, setPaymentId] = useState("");

  const generatePaymentId = () => `PY25-${Math.floor(Math.random() * 900) + 100}`;


  useEffect(() => {
    const storedData = localStorage.getItem("selectedAppointment");
    const hospital = localStorage.getItem("selectedLocation");
    const specialization = localStorage.getItem("selectedSpecialization");
    const doctorCharge = localStorage.getItem("selectedCharge");
    const hospCharge = localStorage.getItem("hospitalCharge");
    const newPaymentId = generatePaymentId();
    setPaymentId(newPaymentId);

    if (storedData) setAppointmentData(JSON.parse(storedData));
    if (hospital) setSelectedLocation(hospital);
    if (specialization) setSelectedSpecialization(specialization);
    if (doctorCharge) setCharge(Number(doctorCharge));
    if (hospCharge) setHospitalCharge(Number(hospCharge));
  }, [id]);

  return (
    <div>
      <NavBar />
      <Header />
      <div className="flex justify-between w-full max-w-6xl mx-auto gap-8">
        {appointmentData && (
          <PaymentView
            paymentId={paymentId}
            hospitalCharge={hospitalCharge}
            doctorCharge={appointmentData.charge}
            hospital={selectedLocation}
            specialization={selectedSpecialization}
            appointmentDate={appointmentData.selectedDate}
            appointmentTime={appointmentData.appointmentTime}
            doctorName={appointmentData.firstName  + " " + appointmentData.lastName} 
          />
        )}
      </div>
      <Footer />
    </div>
  );
}

export default PaymentClient;
