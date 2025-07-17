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
  Box,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";

const ViewHealthRecordsDialog = ({
  open,
  onClose,
  doctorName,
  date,
  time,
  hospitalName,
  appointmentId,
}) => {
  const handleViewRecord = () => {
    // Handle view record logic here
    console.log(`Viewing health record for appointment ${appointmentId}`);
    // You can add navigation logic here
  };

  const handleDownloadRecord = () => {
    // Handle download record logic here
    console.log(`Downloading health record for appointment ${appointmentId}`);
    // You can add download logic here
  };

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
          border: "2px solid #5da9a7",
          backgroundColor: "#fffdfd",
          boxShadow: "0px 6px 30px rgba(0, 0, 0, 0.15)",
        },
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{ position: "absolute", top: 16, right: 16, zIndex: 1 }}
      >
        <CloseIcon fontSize="large" />
      </IconButton>

      <DialogContent className="flex flex-col items-center text-center">
        <DescriptionOutlinedIcon sx={{ fontSize: 80, color: "#5da9a7" }} />
        <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold", color: "#2e7d79" }}>
          Health Records Available
        </Typography>
        
        <Box sx={{ mt: 2, p: 2, backgroundColor: "#f0f8f7", borderRadius: "8px", width: "100%" }}>
          <Typography variant="body2" sx={{ color: "#555", fontWeight: "600" }}>
            Appointment Details:
          </Typography>
          <Typography variant="body2" sx={{ color: "#666", mt: 1 }}>
            <strong>Doctor:</strong> Dr. {doctorName}
          </Typography>
          <Typography variant="body2" sx={{ color: "#666" }}>
            <strong>Date:</strong> {date}
          </Typography>
          <Typography variant="body2" sx={{ color: "#666" }}>
            <strong>Time:</strong> {time}
          </Typography>
          <Typography variant="body2" sx={{ color: "#666" }}>
            <strong>Hospital:</strong> {hospitalName}
          </Typography>
        </Box>

        <Typography variant="body1" sx={{ mt: 2, color: "#555", maxWidth: "480px" }}>
          Your health records for this appointment are ready to view. You can access your medical reports, 
          prescriptions, and treatment notes. All records are securely stored and can be downloaded for your reference.
        </Typography>

        <Divider sx={{ width: "100%", mt: 2, mb: 2 }} />

        <Typography variant="body2" sx={{ color: "#777", fontSize: "12px" }}>
          Records include: Medical reports, Prescriptions, Lab results, Treatment notes
        </Typography>
        
        <Typography variant="body2" sx={{ color: "#1976d2", fontSize: "12px", mt: 1 }}>
          ⚕️ Synced via OpenMRS API
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", mt: 2, gap: 2 }}>
        <Button
          onClick={handleViewRecord}
          variant="contained"
          startIcon={<VisibilityIcon />}
          sx={{
            backgroundColor: "#5da9a7",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#4c9995",
            },
            borderRadius: "8px",
            padding: "10px 20px",
            fontWeight: 600,
          }}
        >
          View Records
        </Button>
        
        <Button
          onClick={handleDownloadRecord}
          variant="outlined"
          startIcon={<DownloadIcon />}
          sx={{
            borderColor: "#5da9a7",
            color: "#5da9a7",
            "&:hover": {
              borderColor: "#4c9995",
              backgroundColor: "#f0f8f7",
            },
            borderRadius: "8px",
            padding: "10px 20px",
            fontWeight: 600,
          }}
        >
          Download
        </Button>
        
        <Button
          onClick={onClose}
          variant="text"
          sx={{
            color: "#888",
            "&:hover": {
              backgroundColor: "#f0f0f0",
            },
            borderRadius: "8px",
            padding: "10px 20px",
            fontWeight: 600,
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewHealthRecordsDialog;