"use client";
import React, { useEffect, useContext } from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { sendEmail, sendNotification } from "../services/PatientPaymentServices";
import {generatePdf, addDoctorCharge} from "../services/PatientDataService"; 
import { AppointmentContext } from "../Bookings/Payments/[id]/page"; 

const PaymentConfirmation = ({ open, handleClose, totalCharge, email , platformCharge}) => {
  const {
    paymentId,
    patientId,
    doctorId,
    doctorFirstName,
    doctorLastName,
    appointmentDate,
    appointmentTime,
    hospitalName,
    doctorCharge,
    hospitalCharge
  } = useContext(AppointmentContext);

  const doctorName = `${doctorFirstName} ${doctorLastName}`;
  const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(",")[1];
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
    });
  };

  useEffect(() => {
    if (open) {
      const sendNotificationFlow = async () => {
        try {
          const notificationPayload = {
            patientId:patientId,
            title: "Appointment Booking",
            type: "Appointment",
            message: `Your appointment with Dr. ${doctorName} has been successfully scheduled on ${appointmentDate} at ${appointmentTime} at ${hospitalName}.`,
          };
          await sendNotification(notificationPayload);

          await addDoctorCharge(doctorId, doctorCharge);

          const pdfPayload = {
            paymentId,
            patientId,
            doctorName,
            hospitalName,
            appointmentDate,
            appointmentTime,
            doctorCharge,
            hospitalCharge,
            platformCharge,
            totalCharge,
          };
          const pdfBlob = await generatePdf(pdfPayload);
          const pdfBase64 = await blobToBase64(pdfBlob);
         
          const emailPayload = {
            receptor: email,
            title: "Appointment Booked",
            message: `Your appointment with Dr. ${doctorName} on ${appointmentDate} at ${appointmentTime} at ${hospitalName} is confirmed now. Please be punctual to avoid any inconvenience. For online payments, no refunds will be issued if you fail to cancel the appointment at least 48 hours before the scheduled time. If you cancel the appointment 48 hours in advance, 80% of the payment will be refunded. For payments made at the hospital, please ensure you pay the amount mentioned in the appointment details document. Account inactivation will be applied to patients who choose “pay at the hospital” but fail to attend the appointment without prior notice to the hospital.`,
            attachment: {
              fileName: "Appointment.pdf",
              contentType: "application/pdf",
              base64Content: pdfBase64,
            },
          };
          await sendEmail(emailPayload);
          console.log("Email sent (no PDF), notification posted");
        } catch (error) {
          console.error("Error during notification flow:", error);
        }
      };

      sendNotificationFlow();
    }
  }, [open, patientId, email, doctorName, appointmentDate, appointmentTime, hospitalName, totalCharge]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "40px",
          padding: "40px 20px",
          border: "2px solid #0d9488",
          backgroundColor: "#f6ffff",
          boxShadow: "0px 6px 30px rgba(0, 0, 0, 0.15)",

        },
      }}
    >
      <IconButton onClick={handleClose} sx={{ position: "absolute", top: 16, right: 16 }}>
        <CloseIcon fontSize="large" />
      </IconButton>

      <DialogContent className="flex flex-col items-center text-center">
        <CheckCircleOutlineIcon sx={{ fontSize: 100, color: "#2E7D32" }} />
        <Box
          sx={{
            backgroundColor: "#00796B",
            color: "white",
            borderRadius: "12px",
            padding: "16px 24px",
            marginTop: "24px",
            maxWidth: "500px",
            textAlign: "center",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "1.25rem" }}>
            Your appointment has been successfully booked
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ marginTop: "16px", color: "#555", maxWidth: "500px" }}>
          We have sent an email to <strong>{email}</strong> with more appointment confirmation details.
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentConfirmation;
