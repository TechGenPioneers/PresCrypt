import React, { useState, useEffect } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import dayjs from "dayjs";
import AppointmentViewDialog from "./AppointmentViewDialog";
import { getAppointmentsByPatientId } from "../services/AppointmentsFindingService";
import "./calender.css";
import useAuthGuard from "@/utils/useAuthGuard";

// ✅ Custom Day Component
const CustomDay = (props) => {
  useAuthGuard(["Patient"]); // Ensure only authenticated patients can access this component
  const { day, outsideCurrentMonth, ...other } = props;

  const appointments = JSON.parse(localStorage.getItem("appointments")) || [];
  const formattedDate = day.format("YYYY-MM-DD");
  const appointment = appointments.find((app) => app.date === formattedDate);
  const status = appointment?.status;

  let className = "";
  if (status === "Pending") {
    className = "pending-appointment";
  } else if (status === "Completed") {
    className = "completed-appointment";
  }

  return (
    <PickersDay
      {...other}
      day={day}
      outsideCurrentMonth={outsideCurrentMonth}
      className={className}
    />
  );
};

const CustomCalendar = () => {
  const [date, setDate] = useState(dayjs());
  const [appointments, setAppointments] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const patientId = localStorage.getItem("patientId");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getAppointmentsByPatientId(patientId);
        setAppointments(data);
        localStorage.setItem("appointments", JSON.stringify(data));
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, [patientId]);

  const getAppointmentStatus = (day) => {
    const formattedDate = day.format("YYYY-MM-DD");
    return appointments.find((app) => app.date === formattedDate)?.status || null;
  };

  const handleDateClick = (newDate) => {
    setDate(newDate);
    setSelectedDate(newDate);
    setDialogOpen(true);
  };

  return (
    // 🔥 CRITICAL: Absolutely positioned or fixed container
    <div 
      className="bg-white border border-gray-300 rounded-xl shadow-md"
      style={{
        width: '400px',           // Fixed width
        height: '480px',          // Fixed height
        minWidth: '400px',        // Prevent shrinking
        minHeight: '480px',       // Prevent shrinking
        maxWidth: '400px',        // Prevent growing
        maxHeight: '480px',       // Prevent growing
        flexShrink: 0,            // Don't shrink in flex containers
        position: 'relative',     // Ensure it maintains its space
      }}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-center font-semibold text-gray-800">Your Appointments</h3>
      </div>

      {/* Calendar Container - Absolutely sized */}
      <div 
        className="flex justify-center items-center overflow-hidden"
        style={{
          height: '360px',          // Fixed height for calendar area
          width: '100%',
          padding: '16px',
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            value={date}
            onChange={handleDateClick}
            shouldDisableDate={(day) => !getAppointmentStatus(day)}
            className="custom-calendar"
            slots={{
              day: CustomDay,
            }}
            sx={{
              // Absolutely fixed calendar dimensions
              width: '340px !important',
              height: '320px !important',
              minWidth: '340px !important',
              minHeight: '320px !important',
              maxWidth: '340px !important',
              maxHeight: '320px !important',
              
              // Prevent any expansion
              '& .MuiDateCalendar-root': {
                width: '340px !important',
                height: '320px !important',
                minWidth: '340px !important',
                minHeight: '320px !important',
                maxWidth: '340px !important',
                maxHeight: '320px !important',
              },
              
              // Fixed header
              '& .MuiPickersCalendarHeader-root': {
                height: '48px !important',
                minHeight: '48px !important',
                maxHeight: '48px !important',
                paddingLeft: '16px',
                paddingRight: '16px',
              },
              
              // Fixed calendar grid
              '& .MuiDayCalendar-root': {
                height: '252px !important',
                minHeight: '252px !important',
                maxHeight: '252px !important',
              },
              
              // Fixed day buttons
              '& .MuiPickersDay-root': {
                width: '36px !important',
                height: '36px !important',
                minWidth: '36px !important',
                minHeight: '36px !important',
                maxWidth: '36px !important',
                maxHeight: '36px !important',
                margin: '2px',
                fontSize: '0.875rem',
              },
              
              // Fixed week container
              '& .MuiDayCalendar-weekContainer': {
                height: '36px !important',
                minHeight: '36px !important',
                maxHeight: '36px !important',
                margin: '2px 0',
              },
              
              // Fixed slide transition container
              '& .MuiDayCalendar-slideTransition': {
                height: '252px !important',
                minHeight: '252px !important',
                maxHeight: '252px !important',
              },
              
              // Prevent any flex growth
              '& *': {
                flexGrow: 0,
                flexShrink: 0,
              }
            }}
          />
        </LocalizationProvider>
      </div>

      {/* Legend - Fixed at bottom */}
      <div 
        className="border-t border-gray-200 px-4 py-3"
        style={{
          height: '64px',
          minHeight: '64px',
          maxHeight: '64px',
        }}
      >
        <div className="flex justify-center space-x-6">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 bg-red-500 rounded-full flex-shrink-0"></span>
            <span className="text-sm text-gray-600">Upcoming</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></span>
            <span className="text-sm text-gray-600">Completed</span>
          </div>
        </div>
      </div>

      {appointments && (
        <AppointmentViewDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          date={selectedDate}
          patientId={patientId}
        />
      )}
    </div>
  );
};

export default CustomCalendar;