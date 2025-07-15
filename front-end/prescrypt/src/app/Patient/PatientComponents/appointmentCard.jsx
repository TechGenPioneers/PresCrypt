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
import {
  fetchDoctorDetails,
  fetchAppointmentCounts,
} from "../services/AppointmentsFindingService";

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
  hospitalName,
  hospitalId,
  hospitalCharge,
}) => {
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [appointmentDates, setAppointmentDates] = useState([]);
  const [appointmentCounts, setAppointmentCounts] = useState({});
  const router = useRouter();

  const daysOfWeek = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  useEffect(() => {
    const getNextAvailableDates = async (dayName) => {
      const today = new Date();
      const targetDay = daysOfWeek[dayName];
      if (targetDay === undefined) return;

      const currentDay = today.getDay();
      const daysUntilTarget = (targetDay - currentDay + 7) % 7 || 7;

      const firstAvailableDate = new Date(today);
      firstAvailableDate.setDate(today.getDate() + daysUntilTarget);

      const nextDates = [];
      for (let i = 0; i < 4; i++) {
        const nextDate = new Date(firstAvailableDate);
        nextDate.setDate(firstAvailableDate.getDate() + i * 7);
        nextDates.push({
          date: nextDate.toISOString().split("T")[0],
          day: dayName,
        });
      }

      setAppointmentDates((prev) => {
        const combined = [...prev, ...nextDates];
        const unique = Array.from(
          new Map(combined.map((d) => [d.date, d])).values()
        );
        return unique.sort((a, b) => a.date.localeCompare(b.date));
      });

      try {
        const counts = await fetchAppointmentCounts(
          doctorId,
          nextDates.map((d) => d.date)
        );
        setAppointmentCounts((prev) => ({ ...prev, ...counts }));
      } catch (err) {
        console.error(err);
      }
    };

    if (appointmentDay) {
      const daysArray = appointmentDay.split(",").map((d) => d.trim());
      daysArray.forEach(getNextAvailableDates);
    }
  }, [appointmentDay, doctorId]);

  useEffect(() => {
    if (open && doctorId) {
      const fetchData = async () => {
        setLoading(true);
        setError("");
        try {
          const data = await fetchDoctorDetails(doctorId);
          setDoctorDetails(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [open, doctorId]);

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
          specialization,
          hospitalName,
          hospitalId,
          hospitalCharge,
        })
      );
      router.push(`/Patient/Bookings/Payments/${doctorId}`);
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
        <button
          onClick={handleClose}
          className="absolute top-0 right-0 text-gray-700 hover:text-gray-900 rounded-full p-2"
        >
          <CloseIcon />
        </button>

        <div className="bg-teal-700 text-white py-3 rounded-t-3xl text-center">
          <DialogTitle className="text-lg font-semibold">
            Dr. {firstName} {lastName} 
          </DialogTitle>
        </div>

        <DialogContent
          className="p-6 flex flex-col items-center bg-white overflow-y-auto"
          sx={{ maxHeight: "70vh" }}
        >
          {loading ? (
            <CircularProgress />
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : doctorDetails ? (
            <>
              <img
                src={doctorDetails.imageUrl || "/path/to/default-image.jpg"}
                alt="Doctor"
                className="w-28 h-28 rounded-full object-cover mb-4 border-4 border-gray-200 shadow-md"
              />
              <div className="bg-teal-100 text-teal-700 py-1 px-4 rounded-full mb-4">
                {specialization || doctorDetails.specialization}
              </div>
              <Typography
                variant="body1"
                className="text-gray-800 text-center mb-6"
              >
                {doctorDetails.description}
              </Typography>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full text-center mt-6">
                {appointmentDates.map(({ date, day }, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center w-full border border-green-700 bg-[#E8F4F2] p-3 rounded-lg shadow"
                  >
                    <p className="font-semibold">
                      {date} ({day})
                    </p>
                    <p className="text-sm mt-1">
                      Active Appointments:{" "}
                      {appointmentCounts[date] !== undefined
                        ? appointmentCounts[date]
                        : "Loading..."}
                    </p>
                    <button
                      onClick={() => handleBooking(date)}
                      className="border border-green-700 text-green-700 font-semibold px-4 py-1 rounded-full hover:bg-green-50 ml-2 mt-6"
                    >
                      Book this Slot
                    </button>
                  </div>
                ))}
              </div>

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
