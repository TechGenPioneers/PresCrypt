import React, { useState, useEffect } from "react";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from "dayjs"; // Import Dayjs for date manipulation

const CustomCalendar = () => {
  const [date, setDate] = useState(dayjs()); // Initialize with a Dayjs object
  const [appointments, setAppointments] = useState([]);
  const patientId = "P001"; // Hardcoded for now, can be dynamic later

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(`https://localhost:7021/api/patient/appointments/${patientId}`);
        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();
        console.log("Fetched appointments:", data); // Log the fetched appointments
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments(); // Fetch only once on mount
  }, []);

  const handleDateChange = (newDate) => {
    setDate(newDate); // Set the selected date, which is a Dayjs object
  };

  const getAppointmentStatus = (day) => {
    const formattedDate = day.format("YYYY-MM-DD"); // Use Dayjs to format the date as 'YYYY-MM-DD'
    console.log("Formatted Date:", formattedDate); // Debug log
    const appointment = appointments.find((app) => app.date === formattedDate);
    return appointment ? appointment.status : null;
  };

  const renderCustomDay = (day, selectedDate, dayInCurrentMonth, dayComponent) => {
    const formattedDate = day.format("YYYY-MM-DD");
    const appointmentStatus = getAppointmentStatus(day);

    let bgColor = "";
    if (appointmentStatus === "Pending") {
      bgColor = "bg-red-500";
    } else if (appointmentStatus === "Completed") {
      bgColor = "bg-green-500";
    }

    console.log("Day:", day.format("YYYY-MM-DD"), "Status:", appointmentStatus); // Debug log

    return React.cloneElement(dayComponent, {
      children: (
        <div
          className={`w-8 h-8 flex items-center justify-center rounded-full text-white font-bold ${bgColor}`}
        >
          {day.date()}
        </div>
      ),
    });
  };

  return (
    <div className="flex flex-col p-6 border border-gray-300 rounded-xl bg-white shadow-md">
      <h3 className="text-center mb-2 font-semibold">Appointments</h3>
      <div className="flex justify-center items-center">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            value={date} // Ensure that `date` is a Dayjs object
            onChange={handleDateChange}
            renderDay={renderCustomDay} // Pass the custom render function for each day
          />
        </LocalizationProvider>
      </div>
    </div>
  );
};

export default CustomCalendar;
