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
  const [searched, setSearched] = useState(false); // 🔹 Track if search is done

  // Custom function to update doctors and mark as searched
  const handleSetDoctors = (results) => {
    setDoctors(results);
    setSearched(true); // search was attempted
  };

  return (
    <div className={`relative z-10 flex flex-col min-h-screen p-5 ${!isExpanded ? "ml-[100px]" : ""}`}>
      <SearchBar setDoctors={handleSetDoctors} />

      <div className="flex gap-6">
        <CustomCalendar date={date} setDate={setDate} />

        <div className="flex-2 w-full">
          {searched ? (
            doctors.length === 0 ? (
              <div className="flex justify-center items-center h-[300px]">
                <p className="text-2xl font-semibold text-gray-600 text-center">Hmm...We Couldn't find appointments. Try another search.</p>
              </div>
            ) : (
              <>
                <h3 className="text-2xl mb-4">Available Appointments</h3>
                {doctors.map((doctor, index) =>
                  doctor.availableDay.map((availableDay, dayIndex) =>
                    doctor.availableTime.map((availableTime, timeIndex) => {
                      const imageUrl = doctor.image
                        ? `data:image/jpeg;base64,${doctor.image}`
                        : "/profile.png";

                      return (
                        <BookingCard
                          key={`${doctor.doctorId}-${dayIndex}-${timeIndex}`}
                          doctorId={doctor.doctorId}
                          firstName={doctor.firstName}
                          lastName={doctor.lastName}
                          appointmentDay={availableDay}
                          appointmentTime={availableTime}
                          imageUrl={imageUrl}
                          hospitalName={doctor.hospitalName}
                          specialization={doctor.specialization}
                          hospitalId={doctor.hospitalId}
                          hospitalCharge={doctor.charge}
                        />
                      );
                    })
                  )
                )}
              </>
            )
          ) : (
            <div className="flex justify-center items-center h-[300px]">
              <p className="text-2xl font-semibold text-gray-600 text-center">Try some search to view appointments.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
