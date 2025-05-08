"use client";
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

const CancelAppointmentDialog = ({
  open,
  onClose,
  onConfirmCancel,
  doctorName,
  date,
  time,
  hospitalName,
}) => {
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
          backgroundColor: "#fffdfd",
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
        <WarningAmberOutlinedIcon sx={{ fontSize: 80, color: "#F57C00" }} />
        <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold", color: "#d84315" }}>
          Are you sure you want to cancel this appointment?
        </Typography>
        <Typography variant="body1" sx={{ mt: 1, color: "#555", maxWidth: "480px" }}>
        You are about to cancel your appointment with Dr. <strong>{doctorName}</strong> on <strong>{date}</strong> at <strong>{time}</strong> at <strong>{hospitalName}</strong>. By cancelling this appointment, you may lose your booking fee and the opportunity to reschedule. Please confirm your decision. Frequent cancellations may lead to your account being suspended. Patients who cancel appointments at least 48 hours in advance are eligible for a full refund and automatically credited to your account.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", mt: 2 }}>
      <Button
          onClick={onConfirmCancel}
          variant="contained"
          sx={{
            backgroundColor: "#e53935",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#d32f2f",
            },
            borderRadius: "8px",
            padding: "8px 20px",
            fontWeight: 600,
          }}
        >
          Cancel Appointment
        </Button>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: "#888",
            color: "#555",
            "&:hover": {
              borderColor: "#555",
              backgroundColor: "#f0f0f0",
            },
            borderRadius: "8px",
            padding: "8px 20px",
            fontWeight: 600,
          }}
        >
          Keep Appointment
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CancelAppointmentDialog;
