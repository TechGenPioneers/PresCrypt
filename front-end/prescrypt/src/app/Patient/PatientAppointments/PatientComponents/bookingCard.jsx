import React, { useState } from "react";
import AppointmentCard from "./AppointmentCard";

const BookingCard = ({ doctorId, doctorName, appointmentTime, appointmentDate, imageUrl }) => {
  const [openDialog, setOpenDialog] = useState(false);

  // Function to save the appointment data to localStorage
  const saveAppointmentToLocalStorage = () => {
    const appointmentData = {
      doctorId,
      doctorName,
      appointmentTime,
      appointmentDate,
      imageUrl,
    };

    // Save the appointment data to localStorage with a unique key for appointments
    localStorage.setItem("selectedAppointment", JSON.stringify(appointmentData));
    console.log("Appointment saved to localStorage:", appointmentData); // Debugging
  };

  return (
    <div className="flex flex-col md:flex-row items-center p-4 border border-gray-400 rounded-3xl shadow-md mb-4">
      {/* Left Section: Date & Time */}
      <div className="text-center md:text-left mr-4 mb-4 md:mb-0">
        <p className="text-green-700 font-bold text-sm md:text-base">{appointmentDate}</p>
        <p className="text-sm md:text-base font-semibold">{appointmentTime}</p>
      </div>

      {/* Doctor Image */}
      <img
        src={imageUrl}
        alt="Doctor"
        className="w-16 h-16 rounded-full object-cover border border-gray-300 mb-4 md:mb-0"
      />

      {/* Doctor Name */}
      <p className="ml-4 text-lg font-semibold flex-1">{`Dr. ${doctorName}`}</p>

      {/* Book Button */}
      <button
        className="border border-green-700 text-green-700 font-semibold px-4 py-1 rounded-full hover:bg-green-50 ml-4 mt-4 md:mt-0"
        onClick={() => {
          console.log("Opening Dialog for:", doctorId, doctorName); // Debugging
          saveAppointmentToLocalStorage();  // Save appointment data to localStorage
          setOpenDialog(true);  // Open the dialog
        }}
      >
        Book
      </button>

      {/* Dialog Component */}
      <AppointmentCard
        doctorId="D001"
        doctorName={doctorName}
        appointmentTime={appointmentTime}
        appointmentDate={appointmentDate}
        imageUrl={imageUrl}
        open={openDialog && doctorName}
        handleClose={() => setOpenDialog(false)}
      />
    </div>
  );
};

export default BookingCard;
