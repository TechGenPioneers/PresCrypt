"use client";
import React, { useState } from "react";
import CustomCalendar from "../PatientComponents/calender";
import SearchBar from "../PatientComponents/searchBar";
import BookingCard from "../PatientComponents/bookingCard";
import dayjs from "dayjs";
import useAuthGuard from "@/utils/useAuthGuard";

export default function Appointments() {
  useAuthGuard(["Patient"]);
  const [date, setDate] = useState(dayjs());
  const [isExpanded, setIsExpanded] = useState(false);
  const [doctors, setDoctors] = useState([]);

  return (
    <>
    

      {/* Content Over Background */}
      <div className={`relative z-10 flex flex-col min-h-screen p-5 ${!isExpanded ? "ml-[100px]" : ""}`}>
        <SearchBar setDoctors={setDoctors} />

        <div className="flex gap-6">
          <CustomCalendar date={date} setDate={setDate} />

          <div className="flex-2">
            <h3 className="text-2xl mb-4">Available Appointments</h3>

            {doctors.length === 0 ? (
              <p className="text-gray-500">
                No appointments found. Try another search.
              </p>
            ) : (
              doctors.map((doctor, index) =>
                doctor.availableDay.map((availableDay, dayIndex) =>
                  doctor.availableTime.map((availableTime, timeIndex) => (
                    <BookingCard
                      key={`${doctor.doctorId}-${dayIndex}-${timeIndex}`}
                      doctorId={doctor.doctorId}
                      firstName={doctor.firstName}
                      lastName={doctor.lastName}
                      appointmentDay={availableDay}
                      appointmentTime={availableTime}
                      imageUrl="https://png.pngtree.com/png-clipart/20240323/original/pngtree-professional-doctor-with-stethoscope-png-image_14666123.png"
                      hospitalName={doctor.hospitalName}
                      specialization={doctor.specialization}
                      hospitalId={doctor.hospitalId}
                      hospitalCharge={doctor.charge}
                    />
                  ))
                )
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
}
