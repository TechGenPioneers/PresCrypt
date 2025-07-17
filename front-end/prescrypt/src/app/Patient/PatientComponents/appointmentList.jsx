"use client";

import React, { useEffect, useState } from "react";
import AppointmentListStat from "./appointmentListStat";
import CancelAppointmentDialog from "./cancelAppointmentConfirmation";
import ViewHealthRecordsDialog from "./viewHealthRecordsDialog";
import {
  getAppointmentsByPatient,
  deleteAppointment,
  sendEmail,
  sendNotification
} from "../services/AppointmentsFindingService";
import {
  getPatientDetails,
  getProfileImage
} from "../services/PatientDataService"; // updated import

const AppointmentList = ({ patientId }) => {
  const [appointments, setAppointments] = useState([]);
  const [patientDetails, setPatientDetails] = useState({});
  const [profileImage, setProfileImage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openHealthRecordsDialog, setOpenHealthRecordsDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appointmentsRes, patientRes, imageRes] = await Promise.all([
          getAppointmentsByPatient(patientId),
          getPatientDetails(patientId),
          getProfileImage(patientId)
        ]);

        const sortedAppointments = appointmentsRes.sort((a, b) => new Date(b.date) - new Date(a.date));
        const calculatedAge = calculateAge(patientRes.dob);

        setAppointments(sortedAppointments);
        setPatientDetails({ ...patientRes, age: calculatedAge });
        setProfileImage(imageRes);
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };

    fetchData();
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

  const confirmCancelAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setOpenDialog(true);
  };

  const handleViewHealthRecords = (appointment) => {
    setSelectedAppointment(appointment);
    setOpenHealthRecordsDialog(true);
  };

  const handleCancelConfirmed = async () => {
    const appointmentId = selectedAppointment.appointmentId;
    const cancelledAppt = selectedAppointment;
    setOpenDialog(false);
    setAppointments((prev) => prev.filter((appt) => appt.appointmentId !== appointmentId));

    try {
      await deleteAppointment(appointmentId);
      alert(`Cancelled appointment ${appointmentId}`);

      if (cancelledAppt) {
        const patientEmailPayload = {
          receptor: cancelledAppt.patientEmail,
          title: "Cancelled the Appointment",
          message: `Your appointment with Dr. ${cancelledAppt.doctorName} on ${cancelledAppt.date} at ${cancelledAppt.time} at ${cancelledAppt.hospitalName} has been cancelled on your request.`,
          attachment: { fileName: "", contentType: "", base64Content: "" }
        };

        const doctorEmailPayload = {
          receptor: cancelledAppt.doctorEmail,
          title: "Cancelled the Appointment",
          message: `Your patient Mr/Mrs/Ms ${cancelledAppt.patientName} booked on ${cancelledAppt.date} at ${cancelledAppt.time} at ${cancelledAppt.hospitalName} has confirmed their cancellation.`,
          attachment: { fileName: "", contentType: "", base64Content: "" }
        };

        const notificationPayload = {
          patientId,
          title: "Appointment Cancellation",
          type: "Cancellation",
          message: `Your appointment with Dr. ${cancelledAppt.doctorName} on ${cancelledAppt.date} at ${cancelledAppt.time} at ${cancelledAppt.hospitalName} has been cancelled as per your request.`
        };

        await sendEmail(patientEmailPayload);
        await sendEmail(doctorEmailPayload);
        await sendNotification(notificationPayload);
      }
    } catch (err) {
      console.error("Failed to cancel appointment", err);
      alert("Failed to cancel appointment.");
      const res = await getAppointmentsByPatient(patientId);
      setAppointments(res);
    }
  };

  const total = appointments.length;
  const accepted = appointments.filter((a) => a.status.toLowerCase() === "completed").length;
  const cancelled = appointments.filter((a) => a.status.toLowerCase() === "cancelled").length;

  return (
    <div className="ml-[90px] p-6 bg-[#f4fbfd] min-h-screen">
      <AppointmentListStat
        patientName={patientDetails.name}
        age={patientDetails.age}
        location={patientDetails.location}
        imageUrl={profileImage}
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
              {/* Show Cancel button only for pending appointments */}
              {appt.status.toLowerCase() === "pending" && (
                <button
                  onClick={() => confirmCancelAppointment(appt)}
                  className="bg-red-500 hover:bg-red-300 rounded-lg text-white px-3 py-1 text-sm shadow"
                >
                  Cancel Appointment
                </button>
              )}
              
              {/* Show View Health Records button only for completed appointments */}
              {appt.status.toLowerCase() === "completed" && (
                <button
                  onClick={() => handleViewHealthRecords(appt)}
                  className="bg-[#5da9a7] hover:bg-[#4c9995] rounded-lg text-white px-3 py-1 text-sm shadow"
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

      {selectedAppointment && (
        <CancelAppointmentDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onConfirmCancel={handleCancelConfirmed}
          doctorName={selectedAppointment.doctorName}
          date={selectedAppointment.date}
          time={selectedAppointment.time}
          hospitalName={selectedAppointment.hospitalName}
        />
      )}

      {selectedAppointment && (
        <ViewHealthRecordsDialog
          open={openHealthRecordsDialog}
          onClose={() => setOpenHealthRecordsDialog(false)}
          doctorName={selectedAppointment.doctorName}
          date={selectedAppointment.date}
          time={selectedAppointment.time}
          hospitalName={selectedAppointment.hospitalName}
          appointmentId={selectedAppointment.appointmentId}
        />
      )}
    </div>
  );
};

export default AppointmentList;