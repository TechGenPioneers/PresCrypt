import React, { useState } from "react";
import AppointmentCard from "./appointmentCard";

const BookingCard = ({
  doctorId,
  firstName,
  lastName,
  appointmentTime,
  appointmentDay,
  imageUrl,
  hospitalName,
  specialization,
  hospitalId,
  hospitalCharge,
}) => {
  const [openDialog, setOpenDialog] = useState(false);

  const saveAppointmentToLocalStorage = () => {
    const appointmentData = {
      doctorId,
      firstName,
      lastName,
      appointmentTime,
      appointmentDay,
      imageUrl,
      hospitalName,
      specialization,
      hospitalId,
      hospitalCharge,
    };
    localStorage.setItem("selectedAppointment", JSON.stringify(appointmentData));
    console.log("Appointment saved to localStorage:", appointmentData);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4 w-[450px]">
      <div className="flex gap-4 items-center">
        <img
          src={imageUrl}
          alt={`${firstName} ${lastName}`}
          className="w-16 h-16 rounded-full object-cover"
          loading="lazy"
        />
        <div>
          <h4 className="font-semibold text-lg">
            Dr. {firstName} {lastName}
          </h4>
          <p className="text-sm text-gray-600">{specialization}</p>
          <p className="text-sm text-gray-600">{hospitalName}</p>
        </div>
      </div>

      <div className="mt-3 text-gray-700">
        <p>
          <strong>Appointment Day:</strong> {appointmentDay}
        </p>
        <p>
          <strong>Time:</strong> {appointmentTime}
        </p>
      </div>

      <button
        className="mt-4 w-full bg-green-700 text-white py-2 rounded-md hover:bg-green-600"
        onClick={() => {
          saveAppointmentToLocalStorage();
          setOpenDialog(true);
        }}
      >
        Book Appointment
      </button>

      {/* Appointment Dialog */}
      <AppointmentCard
        doctorId={doctorId}
        firstName={firstName}
        lastName={lastName}
        appointmentTime={appointmentTime}
        appointmentDay={appointmentDay}
        imageUrl={imageUrl}
        hospitalName={hospitalName}
        specialization={specialization}
        hospitalId={hospitalId}
        hospitalCharge={hospitalCharge}
        open={openDialog}
        handleClose={() => setOpenDialog(false)}
      />
    </div>
  );
};

export default BookingCard;
