"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { getAppointmentsByPatientIdAndDate } from "../services/AppointmentsFindingService";

const AppointmentViewDialog = ({ open, onClose, date, patientId }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!open || !date || !patientId) return;

      setLoading(true);
      try {
        const formattedDate = date.format("YYYY-MM-DD");
        const response = await getAppointmentsByPatientIdAndDate(patientId, formattedDate);
        setAppointments(response);
      } catch (error) {
        console.error("Failed to load appointments", error);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [open, date, patientId]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "20px",
          padding: "20px",
          border: "2px solid #2e7d32",
          backgroundColor: "#ffffff",
          boxShadow: "0px 6px 30px rgba(0, 0, 0, 0.15)",
          position: "relative",
        },
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{ position: "absolute", top: 16, right: 16, color: "#2e7d32" }}
      >
        <CloseIcon fontSize="large" />
      </IconButton>

      <DialogTitle
        sx={{
          fontWeight: "bold",
          textAlign: "center",
          color: "#2e7d32",
          fontSize: "1.5rem",
          paddingTop: "32px", 
        }}
      >
        Appointments on {date?.format("MMMM DD, YYYY")}
      </DialogTitle>

      <DialogContent dividers>
        {loading ? (
          <Typography align="center" sx={{ mt: 2 }}>
            Loading...
          </Typography>
        ) : appointments.length === 0 ? (
          <Typography align="center" sx={{ mt: 2 }}>
            No appointments found on this date.
          </Typography>
        ) : (
          appointments.map((a, index) => (
            <div key={index} className="mb-4">
              <Typography variant="subtitle1">
                Doctor: <strong>{a.doctorName}</strong>
              </Typography>
              <Typography variant="body2">Specialization: {a.specialization}</Typography>
              <Typography variant="body2">Hospital: {a.hospitalName}</Typography>
              <Typography variant="body2">Time: {a.appointmentTime}</Typography>
              <Typography variant="body2">Status: {a.status}</Typography>
              {index < appointments.length - 1 && <Divider className="mt-3 mb-3" />}
            </div>
          ))
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center" }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            backgroundColor: "#2e7d32",
            color: "#fff",
            "&:hover": { backgroundColor: "#1b5e20" },
            borderRadius: "8px",
            px: 4,
            py: 1.5,
            fontWeight: 600,
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AppointmentViewDialog;
