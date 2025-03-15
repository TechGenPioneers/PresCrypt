"use client";
import React, { useState } from "react";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import Nav from "./PatientComponents/navBar";
import CustomCalendar from "./PatientComponents/calender";
import SearchBar from "../../Patient/PatientAppointments/PatientComponents/searchBar";
import BookingCard from "../../Patient/PatientAppointments/PatientComponents/bookingCard";

export default function Appointments() {
  const [date, setDate] = useState(new Date());
  const [isExpanded, setIsExpanded] = useState(false);
  const [doctors, setDoctors] = useState([]); // Store doctors received from API

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className={`p-5 flex-1 ${!isExpanded ? "ml-[100px]" : ""}`}>
        <SearchBar setDoctors={setDoctors} />
        <div className="flex gap-6">
          <CustomCalendar date={date} setDate={setDate} />
          <div className="flex-2">
            <h3 className="text-2xl mb-4">Available Appointments</h3>

            {doctors.length === 0 ? (
              <p className="text-gray-500">No appointments found. Try another search.</p>
            ) : (
              doctors.map((doctor, index) => (
                doctor.availableDates.map((availableDate, dateIndex) => (
                  doctor.availableTimes.map((availableTime, timeIndex) => (
                    <BookingCard
                      key={`${index}-${dateIndex}-${timeIndex}`} // Unique key
                      doctorName={doctor.doctorName} // Corrected property name
                      appointmentDate={availableDate.split("T")[0]} // Extract YYYY-MM-DD
                      appointmentTime={availableTime} // Display available time
                      imageUrl="https://png.pngtree.com/png-clipart/20240323/original/pngtree-professional-doctor-with-stethoscope-png-image_14666123.png"
                    />
                  ))
                ))
              ))
            )}

            {doctors.length > 0 && (
              <button className="bg-green-500 text-white py-3 px-6 rounded-md mt-10">
                Load more
              </button>
            )}
          </div>
        </div>
      </div>
      <Nav setIsExpanded={setIsExpanded} isExpanded={isExpanded} />
      <Footer />
    </div>
  );
}
