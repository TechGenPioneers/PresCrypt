"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { GetDoctorById } from "../service/AdminDoctorService";
import { useRouter } from "next/navigation";

export default function DoctorDetails({ doctorID }) {
  const [doctor, setDoctor] = useState(null);
  const [dateTime, setDateTime] = useState(null);
  const router = useRouter();
  useEffect(() => {
    //fetch doctor by id
    const fetchDoctor = async () => {
      const getDoctor = await GetDoctorById(doctorID);
      setDoctor(getDoctor);
      console.log("Doctor:", getDoctor);
    };

    fetchDoctor();
    const updateDateTime = () => setDateTime(new Date());
    updateDateTime(); // Set initial time
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, [doctorID]);

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

  //check the doctor
  if (!doctor) {
    return (
      <div className="h-[650px] p-8 border-15 border-[#E9FAF2]">
        <h1 className="text-3xl font-bold mb-2"> Doctor Details</h1>
        <div className="h-[400px] mt-10 bg-[#E9FAF2] p-6 rounded-lg shadow-md w-full flex flex-col">
          
          <div className="flex-grow flex items-center justify-center">
              <p className="text-red-400 font-bold text-xl text-center mb-5">
              Doctor not found
              </p>
            </div>
          <Link href="/Admin/AdminDoctor">
            <button
              className="w-full ml-1 px-10 py-2 bg-[#A9C9CD] text-[#09424D] font-semibold rounded-lg 
          hover:bg-[#91B4B8] transition duration-300 cursor-pointer"
            >
              Go to Doctor List
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const handleManageDoctor = () => {
    localStorage.setItem("doctor", JSON.stringify(doctor));
    router.push("/Admin/ManageDoctorPage");
  };

  return (
    <div className="p-8 border-15 border-[#E9FAF2]">
      {/*title*/}
      <h1 className="text-3xl font-bold mb-2">
        {doctor.doctor.doctorId} - {doctor.doctor.firstName}{" "}
        {doctor.doctor.lastName} - {doctor.doctor.specialization}.
        <span
          className={`font-semibold text-lg flex items-center gap-2 ${
            doctor.doctor.status ? "text-green-500" : "text-red-500"
          }`}
        >
          <span
            className={`w-3 h-3 rounded-full ${
              doctor.doctor.status ? "bg-green-500" : "bg-red-500"
            }`}
          ></span>
          {doctor.doctor.status ? "Active" : "Inactive"}
        </span>
      </h1>

      <div className="grid col-span-1 justify-end">
        <button
          className="ml-1 px-10 py-2 bg-[#A9C9CD] text-[#09424D] font-semibold rounded-lg 
          hover:bg-[#91B4B8] transition duration-300 cursor-pointer"
          onClick={handleManageDoctor}
        >
          Manage Doctor
        </button>
      </div>

      <div className="flex mt-6 space-x-6">
        {/* Profile Card */}
        <div className="bg-[#E9FAF2] p-6 rounded-lg shadow-md sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 text-left">
          {/* Profile Photo */}
          <div className="w-24 h-24 bg-red-500 rounded-full mx-auto mb-3">
            <img
              src={doctor.doctor.profilePhoto || "/profile2.png"}
              alt="Avatar"
              className="rounded-full"
            />
          </div>

          {/* Doctor Name */}
          <div className="text-center">
            <h2 className="text-lg font-bold">
              {doctor.doctor.firstName} {doctor.doctor.lastName}
            </h2>
          </div>

          {/* Doctor Details */}
          <div className="flex gap-1.5 m-1">
            <h1 className="font-semibold">Doctor Fee:</h1>{" "}
            <p className="text-gray-600">Rs.{doctor.doctor.charge}</p>
          </div>
          <div className="flex gap-1.5 m-1">
            <h1 className="font-semibold">Gender:</h1>{" "}
            <p className="text-gray-600">{doctor.doctor.gender}</p>
          </div>
          <div className="flex gap-1.5 m-1">
            <h1 className="font-semibold">Contact:</h1>
            <p className="text-gray-600">{doctor.doctor.contactNumber}</p>
          </div>
          <div className="flex gap-1.5 m-1">
            <h1 className="font-semibold">Specialization:</h1>{" "}
            <p className="text-gray-600">{doctor.doctor.specialization}</p>
          </div>
          <div className="flex gap-1.5 m-1">
            <h1 className="font-semibold">SLMC License:</h1>
            <p className="text-gray-600">{doctor.doctor.slmcLicense}</p>
          </div>
          <div className="flex gap-1.5 m-1">
            <h1 className="font-semibold">Email:</h1>{" "}
            <p className="text-gray-600">{doctor.doctor.email}</p>
          </div>
          <div className="flex gap-1.5 m-1">
            <h1 className="font-semibold">NIC:</h1>
            <p className="text-gray-600">{doctor.doctor.nic}</p>
          </div>
          <div className="flex gap-1.5 m-1">
            <h1 className="font-semibold">Email Verified:</h1>{" "}
            <p className="text-gray-600">
              {doctor.doctor.emailVerified ? "Verified" : "Not Verified"}
            </p>
          </div>
          <div className="flex gap-1.5 m-1">
            <h1 className="font-semibold">Created At:</h1>{" "}
            <p className="text-gray-600">{doctor.doctor.createdAt}</p>
          </div>
          <div className="flex gap-1.5 m-1">
            <h1 className="font-semibold">Updated At:</h1>{" "}
            <p className="text-gray-600">{doctor.doctor.updatedAt}</p>
          </div>
          <div className="flex gap-1.5 m-1">
            <h1 className="font-semibold">Last Login:</h1>
            <p className="text-gray-600">{doctor.doctor.lastLogin}</p>
          </div>
          <div className="flex gap-1.5 m-1">
            <h1 className="font-semibold">Description:</h1>{" "}
            <p className="text-gray-600">{doctor.doctor.description}</p>
          </div>
        </div>

        {/* Availability */}
        <div className="bg-[#E9FAF2] p-6 rounded-lg shadow-md w-2/3">
          <h3 className="font-semibold mb-2">Availability:</h3>
          <ul className="list-disc pl-5">
            {doctor.availability.map((slot, index) => (
              <li key={index} className="text-gray-700 pt-2">
                <span className="font-bold">{slot.day}</span>: {slot.startTime}{" "}
                - {slot.endTime} at{" "}
                <span className="font-bold">{slot.hospitalName}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 text-gray-500 text-right">
        <p>{formattedDate}</p>
        <p>{formattedTime}</p>
      </div>
    </div>
  );
}
