"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const AppointmentCard = ({ doctorId, doctorName, imageUrl, open, handleClose }) => {
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Debugging to see if doctorId is received
  useEffect(() => {
    console.log("Doctor ID received:", doctorId);
  }, [doctorId]);

  // Fetch doctor details from API
  useEffect(() => {
    if (open && doctorId) {
      const fetchDoctorDetails = async () => {
        setLoading(true);
        setError("");

        try {
          const response = await fetch(`https://localhost:7021/api/Doctor/book/${doctorId}`);
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
      <div className="bg-white rounded-2xl shadow-lg p-5 relative w-full border border-gray-300">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-700 hover:text-gray-900"
        >
          <CloseIcon />
        </button>

        {/* HEADER */}
        <div className="bg-teal-700 text-white py-3 rounded-t-2xl text-center">
          <DialogTitle className="text-lg font-semibold">{doctorName}</DialogTitle>
        </div>

        {/* CONTENT */}
        <DialogContent className="p-6 flex flex-col items-center">
          {loading ? (
            <CircularProgress />
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : doctorDetails ? (
            <>
              {/* Doctor Image */}
              <img
                src={doctorDetails.imageUrl || imageUrl}
                alt="Doctor"
                className="w-28 h-28 rounded-full object-cover mb-4 border-4 border-gray-200 shadow-md"
              />

              {/* Description */}
              <Typography variant="body1" className="text-gray-800 text-center mb-2">
                {doctorDetails.description}
              </Typography>

              {/* Specialization Tag */}
              <div className="bg-teal-100 text-teal-700 py-2 px-4 rounded-full mt-3">
                {doctorDetails.specialization}
              </div>

              {/* Price & Info */}
              <Typography variant="body2" className="text-gray-600 text-center mt-4 px-4">
                The price estimate includes the physician’s fee, outpatient fee, 
                and other potential costs for procedures and supplies.
              </Typography>

              {/* Confirm Button */}
              <button
                className="bg-teal-700 text-white py-2 px-6 rounded-full mt-6 shadow-md hover:bg-teal-800 transition"
                onClick={handleClose}
              >
                Confirm
              </button>
            </>
          ) : (
            <p className="text-gray-600">No details available</p>
          )}
        </DialogContent>
      </div>
    </Dialog>
  );
};

export default AppointmentCard;
