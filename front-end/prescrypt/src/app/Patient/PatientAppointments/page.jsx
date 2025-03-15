// src/pages/Appointments.jsx
"use client";
import React, { useState } from "react";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import Nav from "./PatientComponents/navBar";
import CustomCalendar from "./PatientComponents/calender";
import SearchBar from "../../Patient/PatientAppointments/PatientComponents/searchBar";
import BookingCard from "../../Patient/PatientAppointments/PatientComponents/bookingCard";

export default function Appointments() {
  const [date, setDate] = useState(new Date()); // State to manage selected date
  const [isExpanded, setIsExpanded] = useState(false); // State to track navbar's expanded state

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div
        className={`p-5 flex-1 ${!isExpanded ? "ml-[100px]" : ""}`} // Apply margin only when collapsed
      >
        <SearchBar />
        <div className="flex gap-6">
          <CustomCalendar date={date} setDate={setDate} />
          <div className="flex-2">
            <h3 className="text-2xl mb-4">Available Appointments</h3>
            {[...Array(6)].map((_, index) => (
              <BookingCard
                key={index}
                doctorName="Dr. Nimal De Silva"
                appointmentTime="Today 16:15"
                imageUrl="https://png.pngtree.com/png-clipart/20240323/original/pngtree-professional-doctor-with-stethoscope-png-image_14666123.png"
              />
            ))}
            <button className="bg-green-500 text-white py-3 px-6 rounded-md mt-10">Load more</button>
          </div>
        </div>
      </div>
      <Nav setIsExpanded={setIsExpanded} isExpanded={isExpanded} />
      <Footer />
    </div>
  );
}
