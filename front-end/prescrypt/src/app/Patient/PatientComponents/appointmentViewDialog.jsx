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
  Box,
  Chip,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { getAppointmentsByPatientIdAndDate } from "../services/AppointmentsFindingService";
import useAuthGuard from "@/utils/useAuthGuard";
const statusColor = {
  completed: "success",
  cancelled: "error",
  rescheduled: "warning",
  pending: "info",
};

const AppointmentViewDialog = ({ open, onClose, date, patientId }) => {
  useAuthGuard(["Patient"]);
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
          padding: "24px",
          border: "2px solid #2e7d32",
          backgroundColor: "#f9fdfb",
          boxShadow: "0px 8px 40px rgba(0, 0, 0, 0.2)",
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
          fontSize: "1.7rem",
          paddingTop: "36px",
        }}
      >
        Appointments on {date?.format("MMMM DD, YYYY")}
      </DialogTitle>

      <DialogContent dividers sx={{ mt: 1 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress color="success" />
          </Box>
        ) : appointments.length === 0 ? (
          <Typography align="center" sx={{ mt: 4, fontSize: "1.1rem", fontWeight: 500 }}>
            No appointments found on this date.
          </Typography>
        ) : (
          appointments.map((a, index) => (
            <Box
              key={index}
              sx={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                padding: "16px 20px",
                mb: 3,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                Dr. {a.doctorName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Specialization: {a.specialization}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Hospital: {a.hospitalName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Time: {a.appointmentTime}
              </Typography>
              <Box mt={1}>
                <Chip
                  label={a.status}
                  color={statusColor[a.status.toLowerCase()] || "default"}
                  sx={{ textTransform: "capitalize", fontWeight: 600 }}
                />
              </Box>
            </Box>
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
