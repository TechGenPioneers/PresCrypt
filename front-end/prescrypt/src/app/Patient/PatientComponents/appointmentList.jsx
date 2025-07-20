"use client";

import React, { useEffect, useState } from "react";
import AppointmentListStat from "./appointmentListStat";
import CancelAppointmentDialog from "./cancelAppointmentConfirmation";
import ResponseDialogBox from "./responseDialogBox";
import AlertDialogBox from "./alertDialogBox";
import {
  getAppointmentsByPatient,
  deleteAppointment,
  sendEmail,
  sendNotification
} from "../services/AppointmentsFindingService";
import {
  getPatientDetails,
  getProfileImage
} from "../services/PatientDataService";

const AppointmentList = ({ patientId }) => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [filter, setFilter] = useState("all");

  const [patientDetails, setPatientDetails] = useState({});
  const [profileImage, setProfileImage] = useState(null); // Changed from "" to null
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [responseDialogOpen, setResponseDialogOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [payHereObjectId, setPayHereObjectId] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appointmentsRes, patientRes, imageRes] = await Promise.all([
          getAppointmentsByPatient(patientId),
          getPatientDetails(patientId),
          getProfileImage(patientId)
        ]);

        const sortedAppointments = appointmentsRes.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        const calculatedAge = calculateAge(patientRes.dob);

        setAppointments(sortedAppointments);
        setPatientDetails({ ...patientRes, age: calculatedAge });
        // Only set profile image if it's not empty
        setProfileImage(imageRes && imageRes.trim() !== "" ? imageRes : null);
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };

    fetchData();
  }, [patientId]);

  useEffect(() => {
    // Apply filter when `appointments` or `filter` changes
    const lowerFilter = filter.toLowerCase();
    const result = appointments.filter((appt) => {
      const status = appt.status.toLowerCase();
      if (lowerFilter === "all") return true;
      if (lowerFilter === "pending") return status === "pending" || status === "no";
      return status === lowerFilter;
    });
    setFilteredAppointments(result);
  }, [appointments, filter]);

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

  const handleCancelConfirmed = async () => {
    const appointmentId = selectedAppointment.appointmentId;
    const cancelledAppt = selectedAppointment;
    setOpenDialog(false);
    setAppointments((prev) =>
      prev.filter((appt) => appt.appointmentId !== appointmentId)
    );

    try {
      const res = await deleteAppointment(appointmentId);
      console.log("Payhere Object Id:", res.payhereObjectId);
      setResponseMessage(res.message || "Wrong there");
      setPaymentMethod(res.paymentMethod || "N/A");
      setAppointmentDate(res.appointmentDate);
      setAppointmentTime(res.appointmentTime);
      setPaymentAmount(res.paymentAmount);
      setPayHereObjectId(res.payHereObjectId);
      setResponseDialogOpen(true);

      if (cancelledAppt) {
        const patientEmailPayload = {
          receptor: cancelledAppt.patientEmail,
          title: "Cancelled the Appointment",
          message: `Your appointment with Dr. ${cancelledAppt.doctorName} on ${cancelledAppt.date} at ${cancelledAppt.time} at ${cancelledAppt.hospitalName} has been cancelled on your request.`,
          attachment: { fileName: "", contentType: "", base64Content: "" },
        };

        const doctorEmailPayload = {
          receptor: cancelledAppt.doctorEmail,
          title: "Cancelled the Appointment",
          message: `Your patient Mr/Mrs/Ms ${cancelledAppt.patientName} booked on ${cancelledAppt.date} at ${cancelledAppt.time} at ${cancelledAppt.hospitalName} has confirmed their cancellation.`,
          attachment: { fileName: "", contentType: "", base64Content: "" },
        };

        const notificationPayload = {
          patientId,
          title: "Appointment Cancellation",
          type: "Cancellation",
          message: `Your appointment with Dr. ${cancelledAppt.doctorName} on ${cancelledAppt.date} at ${cancelledAppt.time} at ${cancelledAppt.hospitalName} has been cancelled as per your request.`,
        };

        await sendEmail(patientEmailPayload);
        await sendEmail(doctorEmailPayload);
        await sendNotification(notificationPayload);
      }
    } catch (err) {
      console.error("Failed to cancel appointment", err);
      setAlertMessage("Failed to cancel appointment. Please try again.");
      setAlertOpen(true);
      // Refresh appointments on error
      const res = await getAppointmentsByPatient(patientId);
      setAppointments(res);
    }
  };

  const total = appointments.length;
  const accepted = appointments.filter(
    (a) => a.status.toLowerCase() === "completed"
  ).length;
  const cancelled = appointments.filter(
    (a) => a.status.toLowerCase() === "cancelled"
  ).length;
  const rescheduled = appointments.filter(
    (a) => a.status.toLowerCase() === "rescheduled"
  ).length;

  return (
    <div className="ml-[90px] p-6 bg-white/20 backdrop-blur-md min-h-screen rounded-xl shadow-lg">
      <AppointmentListStat
        patientName={patientDetails.name}
        age={patientDetails.age}
        location={patientDetails.location}
        imageUrl={profileImage}
        total={total}
        accepted={accepted}
        cancelled={cancelled}
        rescheduled={rescheduled}
        onFilterSelect={setFilter}
        selectedFilter={filter}
      />

      <div className="rounded-lg space-y-4">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appt, index) => (
            <div
              key={appt.appointmentId || index}
              className={`flex flex-col md:flex-row justify-between items-center rounded-xl shadow p-4 ${
                index % 2 === 0 ? "bg-white/40" : "bg-white/20"
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

              <div className="flex gap-2 mt-2 md:mt-0 min-h-[36px]">
                {appt.status.toLowerCase() === "pending" && (
                  <button
                    onClick={() => confirmCancelAppointment(appt)}
                    className="bg-red-500 hover:bg-red-300 rounded-lg text-white px-3 py-1 text-sm shadow"
                  >
                    Cancel Appointment
                  </button>
                )}

                {appt.status.toLowerCase() === "completed" && (
                  <button
                    onClick={() =>
                      alert(`Viewing health records for appointment ${appt.appointmentId}`)
                    }
                    className="bg-blue-500 hover:bg-blue-300 rounded-lg text-white px-3 py-1 text-sm shadow"
                  >
                    View Health Records
                  </button>
                )}

                {appt.status.toLowerCase() === "cancelled" && (
                  <div className="h-[32px] w-[140px] invisible">
                    <button className="w-full h-full">Placeholder</button>
                  </div>
                )}

                {appt.status.toLowerCase() === "rescheduled" && (
                  <div className="h-[32px] w-[140px] invisible">
                    <button className="w-full h-full">Placeholder</button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 mt-6">No appointments found for selected filter.</p>
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

      {responseDialogOpen && (
        <ResponseDialogBox
          open={responseDialogOpen}
          onClose={() => setResponseDialogOpen(false)}
          message={responseMessage}
          paymentMethod={paymentMethod}
          appointmentDate={appointmentDate}
          appointmentTime={appointmentTime}
          payHereObjectId={payHereObjectId}
          paymentAmount={paymentAmount}
        />
      )}

      <AlertDialogBox
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
        message={alertMessage}
      />
    </div>
  );
};

export default AppointmentList;