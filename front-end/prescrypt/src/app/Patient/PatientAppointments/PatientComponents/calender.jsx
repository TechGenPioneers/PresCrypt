// src/components/CalendarComponent.jsx
import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const CustomCalendar = ({ date, setDate }) => {
  return (
    <div className="flex flex-col p-6 border border-gray-300 rounded-xl bg-white shadow-md">
      <h3 className="text-center mb-4">By available appointments</h3>
      <div className="flex justify-center items-center">
        <Calendar onChange={setDate} value={date} className="w-full max-w-xl bg-white border-none rounded-xl shadow-md" />
      </div>
    </div>
  );
};

export default CustomCalendar;
