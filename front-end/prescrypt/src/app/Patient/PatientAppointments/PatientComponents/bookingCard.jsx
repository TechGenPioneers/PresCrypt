import React, { useState } from "react";
import AppointmentCard from "./AppointmentCard";

const BookingCard = ({ doctorId, firstName, lastName,appointmentTime, appointmentDay, imageUrl }) => {
  const [openDialog, setOpenDialog] = useState(false);


  const saveAppointmentToLocalStorage = () => {
    const appointmentData = {
      doctorId,
      firstName,
      lastName,
      appointmentTime,
      appointmentDay,
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
        <p className="text-green-700 font-bold text-sm md:text-base">On Every {appointmentDay}</p>
        <p className="text-sm md:text-base font-semibold">At {appointmentTime}</p>
      </div>

      {/* Doctor Image */}
      <img
        src={imageUrl}
        alt="Doctor"
        className="w-16 h-16 rounded-full object-cover border border-gray-300 mb-4 md:mb-0"
      />

      {/* Doctor Name */}
      <p className="ml-4 text-lg font-semibold flex-1">{`Dr. ${firstName}  ${lastName}`}</p>

      {/* Book Button */}
      <button
        className="border border-green-700 text-green-700 font-semibold px-4 py-1 rounded-full hover:bg-green-50 ml-4 mt-4 md:mt-0"
        onClick={() => {
          console.log("Opening Dialog for:", doctorId, firstName); // Debugging
          saveAppointmentToLocalStorage();  // Save appointment data to localStorage
          setOpenDialog(true);  // Open the dialog
        }}
      >
        Book
      </button>

      {/* Dialog Component */}
      <AppointmentCard
        doctorId="D002"
        firstName={firstName}
        lastName={lastName}
        appointmentTime={appointmentTime}
        appointmentDay={appointmentDay}
        imageUrl={imageUrl}
        open={openDialog && firstName}
        handleClose={() => setOpenDialog(false)}
      />
    </div>
  );
};

export default BookingCard;
