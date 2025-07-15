import React, { useState, useEffect } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import dayjs from "dayjs";
import AppointmentViewDialog from "./AppointmentViewDialog";
import { getAppointmentsByPatientId } from "../services/AppointmentsFindingService";
import "./calender.css";

// ✅ Custom Day Component
const CustomDay = (props) => {
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
        localStorage.setItem("appointments", JSON.stringify(data)); // ✅ Store for CustomDay
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
    <div className="flex flex-col p-6 border border-gray-300 rounded-xl bg-white shadow-md">
      <h3 className="text-center mb-2 font-semibold">Your Appointments</h3>

      <div className="flex justify-center items-center">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            value={date}
            onChange={handleDateClick}
            shouldDisableDate={(day) => !getAppointmentStatus(day)}
            className="custom-calendar"
            slots={{
              day: CustomDay, // ✅ Use custom day component
            }}
          />
        </LocalizationProvider>
      </div>

      <div className="flex justify-center space-x-4 mt-4">
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 bg-red-500 rounded-full"></span>
          <span className="text-sm">Upcoming Appointments</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
          <span className="text-sm">Completed Appointments</span>
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
