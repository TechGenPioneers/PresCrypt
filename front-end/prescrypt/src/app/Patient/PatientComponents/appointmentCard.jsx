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

const AppointmentCard = ({
  doctorId,
  firstName,
  lastName,
  appointmentTime,
  appointmentDay,
  imageUrl,
  open,
  handleClose,
  specialization,
}) => {
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [appointmentDates, setAppointmentDates] = useState([]);
  const [appointmentCounts, setAppointmentCounts] = useState({});
  const router = useRouter();

  // 🔁 Get next 4 Tuesdays
  useEffect(() => {
    const getNextAvailableDates = async (dayName) => {
      const daysOfWeek = {
        Sunday: 0,
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6,
      };
  
      const today = new Date();
      const targetDay = daysOfWeek[dayName];
      if (targetDay === undefined) return;
  
      const currentDay = today.getDay();
      const daysUntilTarget =
        (targetDay - currentDay + 7) % 7 || 7; // Ensure not 0 (i.e., push to next week)
  
      const firstAvailableDate = new Date(today);
      firstAvailableDate.setDate(today.getDate() + daysUntilTarget);
  
      const nextDates = [];
      for (let i = 0; i < 4; i++) {
        const nextDate = new Date(firstAvailableDate);
        nextDate.setDate(firstAvailableDate.getDate() + i * 7);
        nextDates.push(nextDate.toISOString().split("T")[0]);
      }
  
      setAppointmentDates(nextDates);
  
      // Fetch counts
      const counts = await fetchAppointmentCounts(nextDates);
      setAppointmentCounts(counts);
    };
  
    if (appointmentDay) {
      getNextAvailableDates(appointmentDay);
    }
  }, [appointmentDay]);

  // 🔁 Fetch appointment counts by date
  const fetchAppointmentCounts = async (dates) => {
    try {
      const response = await fetch(
        "https://localhost:7021/api/Appointments/count-by-dates",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            doctorId,
            dates,
          }),
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to fetch appointment counts");
      }
  
      const rawData = await response.json(); // e.g., { "2025-04-23T00:00:00": 2 }
  
      // 🔁 Normalize keys to 'YYYY-MM-DD'
      const normalizedData = {};
      for (const dateTime in rawData) {
        const dateOnly = new Date(dateTime).toISOString().split("T")[0];
        normalizedData[dateOnly] = rawData[dateTime];
      }
  
      return normalizedData;
    } catch (error) {
      console.error(error);
      return {};
    }
  };
  

  // 🔁 Fetch doctor details
  useEffect(() => {
    if (open && doctorId) {
      const fetchDoctorDetails = async () => {
        setLoading(true);
        setError("");

        try {
          const response = await fetch(
            `https://localhost:7021/api/Doctor/book/${doctorId}`
          );
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

  // 🔁 Handle booking
  const handleBooking = (selectedDate) => {
    if (doctorDetails) {
      localStorage.setItem(
        "selectedAppointment",
        JSON.stringify({
          doctorId,
          firstName,
          lastName,
          charge: doctorDetails.charge,
          selectedDate,
          appointmentTime,
        })
      );
      router.push(`/Patient/Bookings/Payments/${firstName}`);
    }
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
          overflow: "hidden",
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

        {/* Header */}
        <div className="bg-teal-700 text-white py-3 rounded-t-3xl text-center">
          <DialogTitle className="text-lg font-semibold">
            Dr. {firstName} {lastName}
          </DialogTitle>
        </div>

        {/* Content */}
        <DialogContent
  className="p-6 flex flex-col items-center bg-white overflow-y-auto"
  sx={{ maxHeight: '70vh' }}
>
          {loading ? (
            <CircularProgress />
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : doctorDetails ? (
            <>
              {/* Doctor Image */}
              <img
                src={doctorDetails.imageUrl || "/path/to/default-image.jpg"}
                alt="Doctor"
                className="w-28 h-28 rounded-full object-cover mb-4 border-4 border-gray-200 shadow-md"
              />

              {/* Specialization */}
              <div className="bg-teal-100 text-teal-700 py-1 px-4 rounded-full mb-4">
                {specialization || doctorDetails.specialization}
              </div>

              {/* Description */}
              <Typography
                variant="body1"
                className="text-gray-800 text-center mb-6"
              >
                {doctorDetails.description}
              </Typography>

              {/* Appointment Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full text-center mt-6">
                {appointmentDates.map((date, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center w-full border border-green-700 bg-[#E8F4F2]  p-3 rounded-lg shadow"
                  >
                    <p className=" font-semibold">
                      {date} {appointmentDay}
                    </p>
                    <p className="text-sm  mt-1">
                      Active Appointments:{" "}
                      {appointmentCounts[date] !== undefined
                        ? appointmentCounts[date]
                        : "Loading..."}
                    </p>
                    <button
                      onClick={() => handleBooking(date)}
                      className="border border-green-700 text-green-700 font-semibold px-4 py-1 rounded-full hover:bg-green-50 ml-2 mt-6 "
                    >
                      Book this Slot
                    </button>
                  </div>
                ))}
              </div>

              {/* Price Info */}
              <Typography
                variant="body2"
                className="text-gray-600 text-center mt-10 px-4"
              >
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
