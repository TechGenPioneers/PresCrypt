"use client";

import React, { useEffect, useState } from "react";
import AppointmentListStat from "./appointmentListStat";
import axios from "axios";

const AppointmentList = ({ patientId }) => {
  const [appointments, setAppointments] = useState([]);
  const [patientDetails, setPatientDetails] = useState({});

  useEffect(() => {
    const fetchAppointments = async () => {
      const res = await axios.get(`https://localhost:7021/api/Appointments/patient/${patientId}`);
      const pres = await axios.get(`https://localhost:7021/api/Patient/profileNavbarDetails/${patientId}`);
      const sorted = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
  
      const calculatedAge = calculateAge(pres.data.dob); // dynamically calculate age
      setAppointments(sorted);
      setPatientDetails({ ...pres.data, age: calculatedAge }); // include calculated age
    };
  
    fetchAppointments();
  }, [patientId]);

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleCancel = async (appointmentId) => {
    const cancelledAppt = appointments.find((appt) => appt.appointmentId === appointmentId);
  
    setAppointments((prev) => prev.filter((appt) => appt.appointmentId !== appointmentId));
    try {
      await axios.delete(`https://localhost:7021/api/Appointments/${appointmentId}`);
      alert(`Cancelled appointment ${appointmentId}`);
  
      if (cancelledAppt) {
        const patientEmailPayload = {//sending email to patient of cancellation
          receptor: cancelledAppt.patientEmail,
          title: "Cancelled the Appointment",
          message: `Your appointment with Dr. ${cancelledAppt.doctorName} on ${cancelledAppt.date} at ${cancelledAppt.time} at ${cancelledAppt.hospitalName} has been cancelled on your request. By cancelling, any record regarding that appointment has been removed from your profile. If you paid online, your money will be refunded.`,
        };
  
        await axios.post("https://localhost:7021/api/PatientEmail", patientEmailPayload);

        const doctorEmailPayload = {//sending email to doctor of cancellation
          receptor: cancelledAppt.doctorEmail,
          title: "Cancelled the Appointment",
          message: `Your patient Mr/Mrs/Ms ${cancelledAppt.patientName} booked on ${cancelledAppt.date} at ${cancelledAppt.time} at ${cancelledAppt.hospitalName} has been confirmed their cancellation of booking. From now the cancelled booking will not be visible in your profile.`,
        };
  
        await axios.post("https://localhost:7021/api/PatientEmail", doctorEmailPayload);

        const notificationPayload = {//sedning in-app notification to patient of cancellation
          patientId,
          title: "Appointment Cancellation",
          type: "Cancellation",
          message: `Your appointment with Dr. ${cancelledAppt.doctorName} on ${cancelledAppt.date} at ${cancelledAppt.time} at ${cancelledAppt.hospitalName} has been cancelled as per your request. For more info please check your email.`,
        };
        
        await axios.post("https://localhost:7021/api/PatientNotification/send", notificationPayload);
      }
    } catch (err) {
      console.error("Failed to cancel appointment", err);
      alert("Failed to cancel appointment.");
  
      const res = await axios.get(`https://localhost:7021/api/Appointments/patient/${patientId}`);
      setAppointments(res.data);
    }
  };

  const total = appointments.length;
  const accepted = appointments.filter((a) => a.status.toLowerCase() === "yes").length;
  const cancelled = appointments.filter((a) => a.status.toLowerCase() === "cancelled").length;

  return (
    <div className="ml-[90px] p-6 bg-[#f4fbfd] min-h-screen">
      <AppointmentListStat
        patientName={patientDetails.name}
        age={patientDetails.age}
        location={patientDetails.location}
        imageUrl={`https://localhost:7021/api/Patient/profileImage/${patientId}`}
        total={total}
        accepted={accepted}
        cancelled={cancelled}
      />


      <div className="rounded-lg space-y-4">
      {appointments.map((appt, index) => (
  <div
    key={appt.appointmentId || index}
    className={`flex flex-col md:flex-row justify-between items-center rounded-xl shadow p-4 ${
      index % 2 === 0 ? "bg-[#E8F4F2]" : "bg-white"
    }`}
  >
    <div className="flex flex-col md:flex-row gap-4 w-full md:items-center">
      <div className="flex-1">
        <p className="font-medium text-gray-800">Dr {appt.doctorName}</p>
        <p className="text-sm text-gray-500">{appt.hospitalName}</p>
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-700">{appt.specialization}</p>
      </div>
      <div className="flex-1">
        <span
          className={`font-semibold ${
            appt.status.toLowerCase() === "cancelled"
              ? "text-red-600"
              : appt.status.toLowerCase() === "no"
              ? "text-yellow-600"
              : "text-green-600"
          }`}
        >
          {appt.status}
        </span>
      </div>
      <div className="flex-1 text-gray-600 text-sm">{appt.date}</div>
      <div className="flex-1 text-gray-600 text-sm">{appt.time}</div>
    </div>

    <div className="flex gap-2 mt-2 md:mt-0">
      {appt.status.toLowerCase() === "pending" && (
        <button
          onClick={() => handleCancel(appt.appointmentId)}
          className="bg-red-500 hover:bg-red-300 rounded-lg text-white px-3 py-1 text-sm rounded shadow"
        >
          Cancel Appointment
        </button>
      )}
      {appt.status.toLowerCase() === "completed" && (
        <button
          onClick={() => alert(`Viewing health records for appointment ${appt.appointmentId}`)}
          className="bg-blue-500 hover:bg-blue-300 rounded-lg text-white px-3 py-0.5 text-sm rounded shadow"
        >
          View Health Records
        </button>
      )}
    </div>
  </div>
))}

        {appointments.length > 5 && (
          <div className="text-center">
            <button className="bg-[#5da9a7] hover:bg-[#4c9995] text-white px-6 py-2 rounded-full shadow">
              Load more..
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentList;
