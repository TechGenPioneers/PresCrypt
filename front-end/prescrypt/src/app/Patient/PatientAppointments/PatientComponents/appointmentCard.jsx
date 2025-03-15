"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const AppointmentCard = ({ doctorId, doctorName, imageUrl, open, handleClose }) => {
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch doctor details from API
  useEffect(() => {
    if (open) {
      const fetchDoctorDetails = async () => {
        setLoading(true);
        setError("");

        try {
          const response = await fetch(`https://localhost:7021/api/Doctor/book/D001`);
          if (!response.ok) {
            throw new Error("Failed to fetch doctor details");
          }
          const data = await response.json();
          setDoctorDetails(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchDoctorDetails();
    }
  }, [open, doctorId]);

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <div className="flex justify-between items-center px-4 py-3 border-b">
        <DialogTitle className="text-xl font-semibold text-green-700">Dr. {doctorName}</DialogTitle>
        <IconButton onClick={handleClose} className="text-green-700">
          <CloseIcon />
        </IconButton>
      </div>

      <DialogContent className="min-h-[200px] flex flex-col items-center">
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : doctorDetails ? (
          <>
            <img
              src={doctorDetails.imageUrl || imageUrl}
              alt="Doctor"
              className="w-24 h-24 rounded-full object-cover mb-4"
            />
            <Typography variant="body1" className="text-gray-700">
              Specialization: {doctorDetails.specialization}
            </Typography>
            <Typography variant="body1" className="text-gray-700">
              Experience: {doctorDetails.experience} years
            </Typography>
            <Typography variant="body1" className="text-gray-700">
              Hospital: {doctorDetails.hospital}
            </Typography>
          </>
        ) : (
          <p className="text-gray-600">No details available</p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentCard;
