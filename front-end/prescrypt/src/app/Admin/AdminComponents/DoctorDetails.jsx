"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Sample Data 
const doctors = {
  D001: {
    name: "Shenali Perera",
    gender: "Female",
    specialty: "Cardiology",
    hospital: "Nawaloka Hospital",
    availability: [
      "Monday 4.00 PM - 6.00 PM",
      "Wednesday 4.00 PM - 6.00 PM",
      "Sunday 4.00 PM - 6.00 PM",
    ],
  },
};

export default function DoctorDetails({}) {
  const id = "D001";
  const router = useRouter();
  const [doctor, setDoctor] = useState(null);
  const [dateTime, setDateTime] = useState(null);

  useEffect(() => {
    setDoctor(doctors[id]);
    const updateDateTime = () => setDateTime(new Date());
    updateDateTime(); // Set initial time
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, [id]);

  if (!dateTime) return null; // Prevent SSR mismatch

  // Date Formatting
  const formattedDate = dateTime.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Time Formatting
  const formattedTime = dateTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  if (!doctor) return <p className="text-center">Doctor not found.</p>;

  return (
    <div className="p-8 border-15 border-[#E9FAF2]">
      <h1 className="text-3xl font-bold mb-2">Doctor - {doctor.name}</h1>
      <p className="text-gray-500">{formattedDate}</p>

      <div className="grid col-span-1 justify-end">
        <button
          className="ml-1 px-10 py-2 bg-[#A9C9CD] text-[#09424D] font-semibold rounded-lg 
          hover:bg-[#91B4B8] transition duration-300 "
        >
          Manage Doctor
        </button>
      </div>

      <div className="flex mt-6 space-x-6">
        {/* Profile Card */}
        <div className="bg-[#E9FAF2] p-6 rounded-lg shadow-md w-1/3 text-center">
          <div className="w-24 h-24 bg-red-500 rounded-full mx-auto mb-3">
            <img src="/profile2.png" alt="Avatar" className="rounded-full" />
          </div>
          <h2 className="text-lg font-bold">{doctor.name}</h2>
          <p className="text-gray-600">{doctor.gender}</p>
          <p className="text-gray-600">{doctor.specialty}</p>
          <p className="text-gray-600">{doctor.hospital}</p>
        </div>

        {/* Availability */}
        <div className="bg-[#E9FAF2] p-6 rounded-lg shadow-md w-2/3">
          <h3 className="font-semibold">Availability:</h3>
          {doctor.availability.map((time, index) => (
            <p key={index} className="text-gray-700 pt-10 pl-5">
              {time}
            </p>
          ))}
        </div>
      </div>

      <div className="mt-6 text-gray-500 text-right">
        <p>{formattedDate}</p>
        <p>{formattedTime}</p>
      </div>
    </div>
  );
}
