import React, { useState, useEffect } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from "dayjs";

const CustomCalendar = () => {
  const [date, setDate] = useState(dayjs());
  const [appointments, setAppointments] = useState([]);
  const patientId = "P021"; // use for testting purposes
  

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(
          `https://localhost:7021/api/patient/appointments/${patientId}`
        );
        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();
        console.log("Fetched appointments:", data);
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  const getAppointmentStatus = (day) => {
    const formattedDate = day.format("YYYY-MM-DD");
    return appointments.find((app) => app.date === formattedDate)?.status || null;
  };

  useEffect(() => {
    const highlightAppointments = () => {
      setTimeout(() => {
        document.querySelectorAll(".MuiPickersDay-root").forEach((el) => {
          const dayText = el.textContent.padStart(2, "0"); // Ensure proper day formatting
          const currentMonth = dayjs(date).format("YYYY-MM");
          const fullDate = `${currentMonth}-${dayText}`;
          const status = getAppointmentStatus(dayjs(fullDate));

          el.classList.remove("pending-appointment", "completed-appointment"); // Clear previous styles

          if (status === "Pending") {
            el.classList.add("pending-appointment");
          } else if (status === "Completed") {
            el.classList.add("completed-appointment");
          }
        });
      }, 200); // Delay ensures proper rendering before modifying elements
    };

    highlightAppointments();
  }, [appointments, date]);

  return (
    <div className="flex flex-col p-6 border border-gray-300 rounded-xl bg-white shadow-md">
      <h3 className="text-center mb-2 font-semibold">Your Appointments</h3>

      {/* Legend Box */}
      

      <div className="flex justify-center items-center">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            value={date}
            onChange={(newDate) => setDate(newDate)}
            shouldDisableDate={(day) => !getAppointmentStatus(day)}
            className="custom-calendar"
          />
        </LocalizationProvider>
      </div>
      <div className="flex justify-center space-x-4 mb-4">
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 bg-red-500 rounded-full"></span>
          <span className="text-sm">Upcoming Appointments</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
          <span className="text-sm">Completed Appointments</span>
        </div>
      </div>
    </div>
  );
};

export default CustomCalendar;
