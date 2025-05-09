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
import { sendEmail, sendNotification /* , generatePdf */ } from "../services/PatientPaymentServices";

const PaymentConfirmation = ({
  open,
  handleClose,
  email,
  totalCharge,
  patientId,
  doctorName,
  appointmentDate,
  appointmentTime,
  hospitalName,
  patientEmail = "dewminkasmitha30@gmail.com",
}) => {

  useEffect(() => {
    if (open) {
      const sendNotificationFlow = async () => {
        try {
          // const pdfPayload = {
          //   patientId,
          //   doctorName,
          //   hospitalName,
          //   appointmentDate,
          //   appointmentTime,
          //   totalCharge,
          // };

          // // 1. Generate the PDF
          // const pdfBlob = await generatePdf(pdfPayload);
          // const pdfBase64 = await blobToBase64(pdfBlob);

          // 2. Send email WITHOUT PDF attachment
          const emailPayload = {
            receptor: patientEmail,
            title: "Appointment Booked",
            message: `Your appointment with Dr. ${doctorName} on ${appointmentDate} at ${appointmentTime} at ${hospitalName} is confirmed now.`,
            attachment: {
              fileName: "",
              contentType: "",
              base64Content: "",
            },
          };
          await sendEmail(emailPayload);

          // 3. Send in-app notification
          const notificationPayload = {
            patientId,
            title: "Appointment Booking",
            type: "Appointment",
            message: `Your appointment with Dr. ${doctorName} has been successfully scheduled on ${appointmentDate} at ${appointmentTime} at ${hospitalName}.`,
          };
          await sendNotification(notificationPayload);

          console.log("Email sent (no PDF), notification posted");
        } catch (error) {
          console.error("Error during notification flow:", error);
        }
      };

      // Helper function (not used now)
      // const blobToBase64 = async (blob) => {
      //   const buffer = await blob.arrayBuffer();
      //   const binary = new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), "");
      //   return btoa(binary);
      // };

      sendNotificationFlow();
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
