import React, { use, useState } from "react";
import AppointmentCard from "./appointmentCard";
import useAuthGuard from "@/utils/useAuthGuard";

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
  useAuthGuard(["Patient"]); // Ensure only authenticated patients can access this component
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
    <div className="bg-white p-6 rounded-lg shadow-lg mb-6 w-full border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Section - Doctor Info */}
        <div className="flex gap-4 items-center lg:w-1/2">
          <div className="relative">
            <img
              src={imageUrl}
              alt={`${firstName} ${lastName}`}
              className="w-20 h-20 rounded-full object-cover border-4 border-green-100"
              loading="lazy"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <span className="text-white text-xs font-bold">✓</span>
            </div>
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-xl text-gray-800 mb-1">
              Dr. {firstName} {lastName}
            </h4>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium">
                {specialization}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm font-medium">{hospitalName}</span>
            </div>
          </div>
        </div>

        {/* Right Section - Appointment Details & Action */}
        <div className="lg:w-1/2 lg:pl-6 lg:border-l border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Appointment Day */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium text-gray-600">Appointment Day</span>
              </div>
              <p className="font-bold text-lg text-gray-800">{appointmentDay}</p>
            </div>

            {/* Appointment Time */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-gray-600">Time</span>
              </div>
              <p className="font-bold text-lg text-gray-800">{appointmentTime}</p>
            </div>
          </div>



          {/* Book Appointment Button */}
          <button
            className="w-full px-6 py-3 border border-gray-300 rounded-md text-white bg-green-700 hover:bg-green-600 shadow-sm flex justify-center items-center relative min-w-[160px] font-semibold text-lg transition-all duration-300 gap-2"
            onClick={() => {
              saveAppointmentToLocalStorage();
              setOpenDialog(true);
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Book Appointment
          </button>

          {/* Quick Info Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
              Available
            </span>
            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
              Verified Doctor
            </span>
            <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">
              Online Booking
            </span>
          </div>
        </div>
      </div>

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