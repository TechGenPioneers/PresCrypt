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
import { useRouter } from "next/navigation";

const AppointmentCard = ({ doctorId, firstName, lastName, appointmentTime,appointmentDay, charge, imageUrl, open, handleClose, specialization }) => {
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [appointmentDates, setAppointmentDates] = useState([]);
  const router = useRouter();

  // ✅ Fix: Get correct nearest Tuesday & next 4 Tuesdays
  useEffect(() => {
    const getNextTuesdays = () => {
      const today = new Date();
      let firstTuesday = new Date(today);

      // Ensure firstTuesday is the next Tuesday, not past
      const daysUntilTuesday = (9 - today.getDay()) % 7;
      firstTuesday.setDate(today.getDate() + (daysUntilTuesday === 0 ? 7 : daysUntilTuesday));

      
      const tuesdays = [];
      for (let i = 0; i < 4; i++) {
        let date = new Date(firstTuesday);
        date.setDate(firstTuesday.getDate() + i * 7+1);
        tuesdays.push(date.toISOString().split("T")[0]); // Format: YYYY-MM-DD
      }

      setAppointmentDates(tuesdays);
    };

    getNextTuesdays();
  }, []);

  // Fetch doctor details
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

  // Handle booking
  const handleBooking = (selectedDate) => {
    localStorage.setItem("selectedAppointment", JSON.stringify({ doctorId, firstName, selectedDate, appointmentTime }));
    router.push(`/Patient/Bookings/Payments/${firstName}`);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "20px",
          border: "2px solid #4CAF50",
          backgroundColor: "transparent",
          boxShadow: "none",
          overflow: "hidden", // ✅ Prevents scrollbar inside dialog
        },
      }}
    >
      <div className="bg-white rounded-3xl shadow-lg p-5 relative w-full border-2 border-green-600">
      
        <button
          onClick={handleClose}
          className="absolute top-0 right-0 text-gray-700 hover:text-gray-900 rounded-full p-2"
        >
          <CloseIcon />
        </button>

        {/* Header */}
        <div className="bg-teal-700 text-white py-3 rounded-t-3xl text-center">
          <DialogTitle className="text-lg font-semibold">Dr. {firstName} {lastName}</DialogTitle>
        </div>

        {/* Content (with proper scrolling) */}
        <DialogContent 
          className="p-6 flex flex-col items-center bg-white max-h-[80vh] overflow-y-auto scrollbar-none"
        >
          {loading ? (
            <CircularProgress />
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : doctorDetails ? (
            <>
              {/* Doctor Image */}
              <img
                src={doctorDetails.imageUrl || '/path/to/default-image.jpg'}
                alt="Doctor"
                className="w-28 h-28 rounded-full object-cover mb-4 border-4 border-gray-200 shadow-md"
              />

              {/* Specialization Badge (Aligned Center) */}
              <div className="bg-teal-100 text-teal-700 py-1 px-4 rounded-full mb-4">
                {specialization || doctorDetails.specialization}
              </div>

              {/* Description */}
              <Typography variant="body1" className="text-gray-800 text-center mb-6">
                {doctorDetails.description}
              </Typography>

              {/* 🔥 Fix: Space between description & slots */}
              <div className="mt-6"></div> 

              {/* Appointment Dates (Row by Row) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full text-center">
                {appointmentDates.map((date, index) => (
                  <div key={index} className="flex flex-col items-center w-full bg-green-100 p-3 rounded-lg shadow">
                    <p className="bg-[#E8F4F2] font-semibold">{date} {appointmentDay}</p>
                    <button
                      onClick={() => handleBooking(date)}
                      className="bg-teal-700 text-white py-2 px-4 rounded-full shadow-md hover:bg-teal-800 transition mt-2"
                    >
                      Book this Slot
                    </button>
                  </div>
                ))}
              </div>

              {/* Price & Info */}
              <Typography variant="body2" className="text-gray-600 text-center mt-10 px-4">
                The price estimate includes the physician’s fee, outpatient fee,
                and other potential costs for procedures and supplies.
              </Typography>
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
