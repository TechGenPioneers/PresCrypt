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
import { useRouter } from "next/navigation"; // Import useRouter

const AppointmentCard = ({ doctorId, doctorName, appointmentTime, appointmentDate, imageUrl, open, handleClose }) => {
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter(); // Initialize the Next.js router

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
          console.log("Doctor details:", data); // Check API response
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

  // Handle booking with state passed to the next page
  const handleBooking = () => {
    router.push(`/Patient/Bookings/Payments/${doctorName}`);
  };
  

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "20px", // Same border-radius as the content
          border: "2px solid #4CAF50", // Green border
          backgroundColor: "transparent", 
          boxShadow: "none", // Optional: Remove the default shadow of Dialog
        },
      }}
    >
      <div className="bg-white rounded-3xl shadow-lg p-5 relative w-full border-2 border-green-600">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-0 right-0 text-gray-700 hover:text-gray-900 rounded-full p-2"
        >
          <CloseIcon />
        </button>

        {/* HEADER */}
        <div className="bg-teal-700 text-white py-3 rounded-t-3xl text-center">
          <DialogTitle className="text-lg font-semibold"> Dr. {doctorName}</DialogTitle>
        </div>

        {/* CONTENT */}
        <DialogContent className="p-6 flex flex-col items-center bg-white"> 
  {loading ? (
    <CircularProgress />
  ) : error ? (
    <p className="text-red-500">{error}</p>
  ) : doctorDetails ? (
    <>
      {/* Doctor Image */}
      <img
        src={doctorDetails.imageUrl || '/path/to/default-image.jpg'} // Fallback image
        alt="Doctor"
        className="w-28 h-28 rounded-full object-cover mb-4 border-4 border-gray-200 shadow-md"
      />

      {/* Description */}
      <Typography variant="body1" className="text-gray-800 text-center mb-2">
        {doctorDetails.description}
      </Typography>

      {/* Specialization, Appointment Date, and Appointment Time */}
      <div className="flex justify-between w-full mb-2">
        {/* Specialization */}
        <div className="bg-teal-100 text-teal-700 py-1 px-4 rounded-full">
          {doctorDetails.specialization}
        </div>

        {/* Appointment Date */}
        <div className="bg-teal-100 text-teal-700 py-1 px-4 rounded-full">
          {appointmentDate}
        </div>

        {/* Appointment Time */}
        <div className="bg-teal-100 text-teal-700 py-1 px-4 rounded-full">
          {appointmentTime}
        </div>
      </div>

      {/* Price & Info */}
      <Typography variant="body2" className="text-gray-600 text-center mt-4 px-4">
        The price estimate includes the physician’s fee, outpatient fee,
        and other potential costs for procedures and supplies.
      </Typography>

      {/* Confirm Button */}
      <button
        onClick={handleBooking}
        className="bg-teal-700 text-white py-2 px-6 rounded-full mt-6 shadow-md hover:bg-teal-800 transition"
      >
        Book this Slot
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
