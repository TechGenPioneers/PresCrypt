"use client";
import React, { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const ResponseDialogBox = ({
  open,
  onClose,
  message,
  paymentMethod,
  appointmentDate,
  appointmentTime,
}) => {
  // Combine appointmentDate + appointmentTime into JS Date object
  const appointmentDateTime = useMemo(() => {
    if (!appointmentDate || !appointmentTime) return null;
    const date = new Date(`${appointmentDate}T${appointmentTime}`);
    return date;
  }, [appointmentDate, appointmentTime]);

  // Calculate hours until appointment
  const hoursUntilAppointment = useMemo(() => {
    if (!appointmentDateTime) return null;
    const now = new Date();
    const diffMs = appointmentDateTime - now;
    return diffMs / (1000 * 60 * 60); // Convert ms to hours
  }, [appointmentDateTime]);

  // Decide warning message
  const warningMessage = useMemo(() => {
    if (!paymentMethod || hoursUntilAppointment === null) return null;

    if (paymentMethod === "Location") {
      return `Since your payment method was "Pay At Location" and cancelling more appointments in near days may result in permanent account inactivation.`;
    }

    if (paymentMethod === "Card") {
      if (hoursUntilAppointment <= 48) {
        return `Since your appointment is Card payment and you are cancelling this appointment within 48 hours prior to the appointment, only 80% will be refunded to your paid account.`;
      } else {
        return `Since your appointment is Card payment and you are cancelling this appointment beyond 48 hours prior to the appointment, the full payment will be credited to your account.`;
      }
    }

    return null;
  }, [paymentMethod, hoursUntilAppointment]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "40px",
          padding: "40px 20px",
          border: "2px solid #4CAF50",
          backgroundColor: "#ffffff",
          boxShadow: "0px 6px 30px rgba(0, 0, 0, 0.15)",
        },
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{ position: "absolute", top: 16, right: 16 }}
      >
        <CloseIcon fontSize="large" />
      </IconButton>

      <DialogContent className="flex flex-col items-center text-center">
        <CheckCircleOutlineIcon sx={{ fontSize: 80, color: "#4CAF50" }} />
        <Typography
          variant="h6"
          sx={{ mt: 2, fontWeight: "bold", color: "#2e7d32" }}
        >
          {message}
        </Typography>

        {paymentMethod && (
          <Typography variant="body1" sx={{ mt: 1, color: "#555" }}>
            Payment Method: <strong>{paymentMethod}</strong>
          </Typography>
        )}
        {appointmentDate && appointmentTime && (
          <Typography variant="body2" sx={{ mt: 0.5, color: "#777" }}>
            Appointment: <strong>{appointmentDate} at {appointmentTime}</strong>
          </Typography>
        )}

        {warningMessage && (
          <Typography variant="body2" sx={{ mt: 2, color: "#d84315", fontWeight: 500 }}>
            {warningMessage}
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", mt: 2 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            backgroundColor: "#4CAF50",
            color: "#fff",
            "&:hover": { backgroundColor: "#43a047" },
            borderRadius: "8px",
            padding: "8px 20px",
            fontWeight: 600,
          }}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResponseDialogBox;
