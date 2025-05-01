// components/PaymentConfirmation.jsx
"use client";
import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import axios from "axios"; // install axios if not already installed

const PaymentConfirmation = ({
  open,
  handleClose,
  email,
  patientId,
  doctorName,
  appointmentDate,
  appointmentTime,
  hospitalName,
  patientEmail= 'dewminkasmitha30@gmail.com' //for testing
}) => {

  useEffect(() => {
    if (open) {
      const sendNotification = async () => {
        try {
          // 1. Send Email Notification
          const emailPayload = {
            receptor: patientEmail,
            title: "Appointment Booked",
            message: `Your appointment with Dr. ${doctorName} on ${appointmentDate} at ${appointmentTime} at ${hospitalName} is confirmed now. You have agreed to our terms and conditions to pay at the location services. If you pay online please ignore this message. You can find the payment details as follows.`,
          };
  
          await axios.post("https://localhost:7021/api/PatientEmail", emailPayload);
  
          // 2. Send In-App Notification
          const notificationPayload = {
            patientId,
            title: "Appointment Booking",
            type: "Appointment",
            message: `Your appointment with Dr. ${doctorName} has been successfully scheduled on ${appointmentDate} at ${appointmentTime} at ${hospitalName}.`,
          };
  
          await axios.post("https://localhost:7021/api/PatientNotification/send", notificationPayload);
  
          console.log("Both email and notification sent successfully");
        } catch (error) {
          console.error("Failed to send email or notification", error);
        }
      };
  
      sendNotification();
    }
  }, [open, patientId, patientEmail, doctorName, appointmentDate, appointmentTime, hospitalName]);
  
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
          border: "2px solid #4CAF50",
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
