// src/components/AppointmentCard.jsx
import React from "react";

const BookingCard = ({ doctorName, appointmentTime, imageUrl }) => {
  return (
    <div className="flex gap-4 items-center p-4 border border-gray-300 rounded-lg bg-gray-50 mb-4">
      <img src={imageUrl} alt="Doctor" className="w-12 h-12 rounded-full object-cover" />
      <div className="flex-1">
        <p className="font-semibold">{doctorName}</p>
        <p>Remote Appointment only</p>
      </div>
      <div className="text-right">
        <p>{appointmentTime}</p>
        <button className="bg-teal-600 text-white py-2 px-4 rounded-md mt-2">Book</button>
      </div>
    </div>
  );
};

export default BookingCard;
