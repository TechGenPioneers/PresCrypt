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
  open,
  handleClose,
  specialization,
  hospitalName,
  hospitalId,
  hospitalCharge,
  imageUrl,
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
          border: "2px solid #15803d",
          backgroundColor: "transparent",
          boxShadow: "none",
          overflow: "hidden",
        },
      }}
    >
      <div className="bg-white rounded-3xl shadow-lg p-0 relative w-full border-2 border-teal-700">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600 rounded-full p-2 hover:bg-gray-100 transition-colors duration-200"
        >
          <CloseIcon />
        </button>

        {/* Header */}
        <div className="bg-teal-600 text-white py-6 px-8 rounded-t-3xl text-center">
          <DialogTitle className="text-2xl font-bold p-0 m-0">
            Dr. {firstName} {lastName}
          </DialogTitle>
        </div>

        <DialogContent
          className="p-8 bg-white overflow-y-auto"
          sx={{ maxHeight: "70vh" }}
        >
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <CircularProgress size={48} className="text-teal-600" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 text-lg">{error}</p>
            </div>
          ) : doctorDetails ? (
            <>
              {/* Doctor Info Section */}
              <div className="flex flex-col md:flex-row gap-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={
                        doctorDetails.imageUrl ||
                        imageUrl ||
                        "/profile.png"
                      }
                      alt="Doctor"
                      className="w-24 h-24 rounded-full object-cover border-4 border-teal-100 shadow-lg"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-teal-500 rounded-full border-2 border-white flex items-center justify-center">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium">
                      {specialization || doctorDetails.specialization}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm font-medium">{hospitalName}</span>
                  </div>

                  <Typography
                    variant="body1"
                    className="text-gray-700 leading-relaxed"
                  >
                    {doctorDetails.description}
                  </Typography>
                </div>
              </div>

              {/* Available Slots Section */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Available Slots
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {appointmentDates.map(({ date, day }, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-600">Date</span>
                      </div>
                      <p className="font-bold text-lg text-gray-800 mb-2">
                        {date} ({day})
                      </p>
                      
                      <div className="flex items-center gap-2 mb-4">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="text-sm text-gray-600">
                          Active Appointments: {" "}
                          <span className="font-semibold">
                            {appointmentCounts[date] !== undefined
                              ? appointmentCounts[date]
                              : "Loading..."}
                          </span>
                        </span>
                      </div>

                      <button
                        onClick={() => handleBooking(date)}
                        className="w-full px-6 py-3 border border-gray-300 rounded-md text-white bg-teal-600 hover:bg-teal-600 shadow-sm flex justify-center items-center relative min-w-[160px] font-semibold transition-all duration-300"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Book This Slot
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Information */}
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-1">Pricing Information</h4>
                    <Typography
                      variant="body2"
                      className="text-blue-700 leading-relaxed"
                    >
                      The price estimate includes the physician's fee, outpatient fee,
                      and other potential costs for procedures and supplies.
                    </Typography>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No details available</p>
            </div>
          )}
        </DialogContent>
      </div>
    </Dialog>
  );
};

export default AppointmentCard;