import React, { useState } from "react";
import AppointmentCard from "./AppointmentCard";

const BookingCard = ({ doctorId, doctorName, appointmentTime, appointmentDate, imageUrl }) => {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <div className="flex gap-4 items-center p-4 border border-gray-300 rounded-lg bg-gray-50 mb-4">
      <img src={imageUrl} alt="Doctor" className="w-12 h-12 rounded-full object-cover" />
      <div className="flex-1">
        <p className="font-semibold">Dr. {doctorName}</p>
        <p className="text-gray-600">{appointmentDate}</p>
        <p className="text-gray-600">{appointmentTime}</p>
      </div>
      <div className="text-right">
        <button
          className="bg-white-600 text-green-700 py-2 px-4 rounded-md mt-2 border border-black"
          onClick={() => setOpenDialog(true)}
        >
          Book
        </button>
      </div>

      {/* Dialog Component */}
      {openDialog && (
        <AppointmentCard
          doctorId={doctorId}
          doctorName={doctorName}
          imageUrl={imageUrl}
          open={openDialog}
          handleClose={() => setOpenDialog(false)}
        />
      )}
    
    </div>
  );
};

export default BookingCard;
