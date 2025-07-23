"use client";

import { useEffect, useState, createContext } from "react";
import PaymentView from "../../../PatientComponents/paymentView";

export const AppointmentContext = createContext();

function PaymentClient({ id }) {
  const [appointmentData, setAppointmentData] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [hospitalId, setHospitalId] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [charge, setCharge] = useState(0);
  const [hospitalCharge, setHospitalCharge] = useState(0);
  const [paymentId, setPaymentId] = useState("");
  const [patientId, setPatientId] = useState("");
  const [username, setUsername] = useState("");

  const generatePaymentId = () => {
  const randomNumber = Math.floor(Math.random() * 100000000);
  const paddedNumber = String(randomNumber).padStart(8, '0'); 
  return `PY25-${paddedNumber}`;
};


  useEffect(() => {
    const storedData = localStorage.getItem("selectedAppointment");
    const hospital = localStorage.getItem("selectedLocation");
    const specialization = localStorage.getItem("selectedSpecialization");
    const doctorCharge = localStorage.getItem("selectedCharge");
    const hospCharge = localStorage.getItem("hospitalCharge");
    const hospitalId = localStorage.getItem("hospitalId");
    const storedPatientId = localStorage.getItem("patientId");
    const storedUsername = localStorage.getItem("username"); 
    const newPaymentId = generatePaymentId();

    setPaymentId(newPaymentId);
    if (storedData) setAppointmentData(JSON.parse(storedData));
    if (hospital) setSelectedLocation(hospital);
    if (specialization) setSelectedSpecialization(specialization);
    if (doctorCharge) setCharge(Number(doctorCharge));
    if (hospCharge) setHospitalCharge(Number(hospCharge));
    if (hospitalId) setHospitalId(hospitalId);
    if (storedPatientId) setPatientId(storedPatientId);
    if (storedUsername) setUsername(storedUsername); 
  }, [id]);

  return (
    <div>
      <div className="flex justify-between w-full max-w-6xl mx-auto gap-8">
        {appointmentData && (
          <AppointmentContext.Provider
            value={{
              paymentId,
              hospitalCharge: appointmentData.hospitalCharge,
              doctorCharge: appointmentData.charge,
              hospitalName: appointmentData.hospitalName,
              hospitalId: appointmentData.hospitalId,
              specialization: appointmentData.specialization,
              appointmentDate: appointmentData.selectedDate,
              appointmentTime: appointmentData.appointmentTime,
              doctorId: appointmentData.doctorId,
              doctorFirstName: appointmentData.firstName,
              doctorLastName: appointmentData.lastName,
              patientId: patientId,
              email: username, 
            }}
          >
            <PaymentView />
          </AppointmentContext.Provider>
        )}
      </div>
    </div>
  );
}

export default PaymentClient;
