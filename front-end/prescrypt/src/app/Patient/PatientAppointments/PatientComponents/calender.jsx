import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const CustomCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const patientId = "P001"; // Hardcoded for now, can be dynamic later

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(`https://localhost:7021/api/Patient/appointments/${patientId}`);
        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments(); // Fetch only once on mount
  }, []);

  const getTileContent = ({ date, view }) => {
  const formattedDate = date.toISOString().split("T")[0]; // Convert date to YYYY-MM-DD
  const appointment = appointments.find((app) => app.date === formattedDate);

  if (appointment) {
    return (
      <div
        className={`w-8 h-8 flex items-center justify-center rounded-full text-white font-bold ${appointment.status === "Pending" ? "bg-red-500" : "bg-green-500"}`}
      >
        {date.getDate()}
      </div>
    );
  }

  return <div>{date.getDate()}</div>; // Return the date if no appointment
};

  return (
    <div className="flex flex-col p-6 border border-gray-300 rounded-xl bg-white shadow-md">
      <h3 className="text-center mb-4">Appointments</h3>
      <div className="flex justify-center items-center">
        <Calendar
          onChange={setDate}
          value={date}
          className="w-full max-w-xl bg-white border-none rounded-xl shadow-md"
          tileContent={getTileContent} // Use tileContent instead of tileClassName
        />
      </div>
    </div>
  );
};

export default CustomCalendar;
