"use client";
import React from "react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ChangePatientStatus, GetPatientById } from "../service/AdminPatientService";
import { Spinner } from "@material-tailwind/react";

const PatientDetails = ({ patientId }) => {
  const [patientData, setPatientsData] = useState(null);
  const [dateTime, setDateTime] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState("");

  //get patient by id
  const getPatientData = async () => {
    const getPatient = await GetPatientById(patientId);
    setPatientsData(getPatient);
    console.log("patientID:", patientId);
  };

  //calculate the patient age
  function calculateAge(dobString) {
    const dob = new Date(dobString);
    const today = new Date();

    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    const dayDiff = today.getDate() - dob.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--; // Birthday hasn't occurred yet this year
    }

    return age;
  }

  useEffect(() => {
    getPatientData();
    const updateDateTime = () => setDateTime(new Date());
    updateDateTime(); // Set initial time
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, [patientId]);

  const handleManagePatient = () => {
    setShowModal(true);
    setStatus(patientData.patient.status);
  };

  //handle patient status
  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };
  
  
  const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);

      try {
        const sent = await ChangePatientStatus(patientData.patient.patientId,status);
        console.log(sent);
       
      } catch (err) {
        console.error("Failed to send mail", err);
        alert("Failed to send mail!", err);
      }
      setIsLoading(false);
      getPatientData();
      setShowModal(false); 
    };


  if (!dateTime) return null;

  const formattedDate = dateTime.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formattedTime = dateTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  if (!patientData) {
    return (
      <div className="h-[650px] p-8 border-15 border-[#E9FAF2]">
        <h1 className="text-3xl font-bold mb-2">Patient</h1>
        <div className="h-[400px] mt-10 bg-[#E9FAF2] p-6 rounded-lg shadow-md w-full flex flex-col">
          <div className="flex-grow flex items-center justify-center">
            <p className="text-red-400 font-bold text-xl text-center mb-5">
              Patient not found
            </p>
          </div>
          <Link href="/Admin/AdminPatient">
            <button className="w-full ml-1 px-10 py-2 bg-[#A9C9CD] text-[#09424D] font-semibold rounded-lg hover:bg-[#91B4B8] transition duration-300 cursor-pointer">
              Go to Patient List
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 border-15 border-[#E9FAF2]">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-2">
        Patient - {patientData.patient.patientId} -{" "}
        {patientData.patient.firstName} {patientData.patient.lastName}
        <span
          className={` font-semibold text-lg flex items-center gap-2 ${
            patientData.patient.status === "Active"
              ? "text-green-500"
              : "text-red-500"
          }`}
        >
          <span
            className={`w-3 h-3 rounded-full ${
              patientData.patient.status === "Active"
                ? "text-green-500"
                : "text-red-500"
            }`}
          ></span>
          {patientData.patient.status}
        </span>
      </h1>

      <div className="grid col-span-1 justify-end">
        <button
          className="ml-1 px-10 py-2 bg-[#A9C9CD] text-[#09424D] font-semibold rounded-lg 
          hover:bg-[#91B4B8] transition duration-300 cursor-pointer"
          onClick={handleManagePatient}
        >
          Manage Patient
        </button>
      </div>
                {/* patient details */}
      <div className="flex mt-6 space-x-15 justify-center items-center">
        <div>
          <div className="w-64 h-64 bg-red-500 rounded-full mx-auto mb-3">
             <img
              src={
                patientData.patient.profileImage &&
               patientData.patient.profileImage.trim() !== ""
                  ? `data:image/jpeg;base64,${patientData.patient.profileImage}`
                  : "/profile2.png"
              }
              alt="Avatar"
              className="w-64 h-64 rounded-full object-cover"
            />
          </div>
          <div className="text-center">
            <h2 className="text-lg font-bold">
              {patientData.patient.firstName} {patientData.patient.lastName}
            </h2>
          </div>
        </div>
        <div className="bg-[#E9FAF2] p-6 rounded-lg shadow-md sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 text-left">
          <div className="flex gap-1.5 m-1">
            <h1 className="font-semibold">Date OF Birth:</h1>
            <p className="text-gray-600">
              {patientData.patient.dob} •{" "}
              {calculateAge(patientData.patient.dob)} years old
            </p>
          </div>
          <div className="flex gap-1.5 m-1">
            <h1 className="font-semibold">Gender:</h1>
            <p className="text-gray-600">{patientData.patient.gender}</p>
          </div>
          <div className="flex gap-1.5 m-1">
            <h1 className="font-semibold">Contact:</h1>
            <p className="text-gray-600">{patientData.patient.contactNumber}</p>
          </div>
          <div className="flex gap-1.5 m-1">
            <h1 className="font-semibold">Email:</h1>
            <p className="text-gray-600">{patientData.patient.email}</p>
          </div>
          <div className="flex gap-1.5 m-1">
            <h1 className="font-semibold">NIC:</h1>
            <p className="text-gray-600">{patientData.patient.nic}</p>
          </div>
          <div className="flex gap-1.5 m-1">
            <h1 className="font-semibold">Email Verified:</h1>
            <p className="text-gray-600">
              {patientData.patient.emailVerified ? "Verified" : "Not Verified"}
            </p>
          </div>
          <div className="flex gap-1.5 m-1">
            <h1 className="font-semibold">Created At:</h1>
            <p className="text-gray-600">{patientData.patient.createdAt}</p>
          </div>
          <div className="flex gap-1.5 m-1">
            <h1 className="font-semibold">Updated At:</h1>
            <p className="text-gray-600">{patientData.patient.updatedAt}</p>
          </div>
          <div className="flex gap-1.5 m-1">
            <h1 className="font-semibold">Last Login:</h1>
            <p className="text-gray-600">{patientData.patient.lastLogin}</p>
          </div>
        </div>
      </div>
      {/* patient appointments */}
      <h1 className="text-3xl font-bold mb-2 mt-10">Appointments</h1>
      <div className="overflow-x-auto mt-10">
        <div className="rounded-lg overflow-hidden">
          <div className="max-h-100 overflow-y-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#006369] text-[#094A4D]">
                  <th className="p-3 text-left sticky top-0 bg-[#B5D9DB] z-5">
                    Appointment Id
                  </th>
                  <th className="p-3 text-left sticky top-0 bg-[#B5D9DB] z-5">
                    Doctor
                  </th>
                  <th className="p-3 text-left sticky top-0 bg-[#B5D9DB] z-5">
                    Appointment Date
                  </th>
                  <th className="p-3 text-left sticky top-0 bg-[#B5D9DB] z-5">
                    Appointment Time
                  </th>
                  <th className="p-3 text-left sticky top-0 bg-[#B5D9DB] z-5">
                    Hospital
                  </th>
                  <th className="p-3 text-left sticky top-0 bg-[#B5D9DB] z-5">
                    Charge
                  </th>
                  <th className="p-3 text-left sticky top-0 bg-[#B5D9DB] z-5">
                    Status
                  </th>
                  <th className="p-3 text-left sticky top-0 bg-[#B5D9DB] z-5">
                    Special Note
                  </th>
                  <th className="p-3 text-left sticky top-0 bg-[#B5D9DB] z-5">
                    Type Of Appointment
                  </th>
                  <th className="p-3 text-left sticky top-0 bg-[#B5D9DB] z-5">
                    Created At
                  </th>
                  <th className="p-3 text-left sticky top-0 bg-[#B5D9DB] z-5">
                    Updated At
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {patientData.appointments.map((appointments, index) => (
                  <tr
                    key={index}
                    className={`border-t ${
                      index % 2 === 0 ? "bg-[#E9FAF2]" : "bg-[#ffffff]"
                    }`}
                  >
                    <td className="p-3 text-[#094A4D]">
                      {appointments.appointmentId}
                    </td>
                    <td className="p-3 flex items-center space-x-3">
                      <div>
                        <p className="font-semibold text-[#094A4D]">
                          {appointments.doctorId}
                        </p>
                        <p className="text-[#094A4D] text-sm">
                          {appointments.doctorName}
                        </p>
                      </div>
                    </td>
                    <td className="p-3 text-[#094A4D]">{appointments.date}</td>
                    <td className="p-3 text-[#094A4D]">{appointments.time}</td>
                    <td className="p-3 flex items-center space-x-3">
                      <div>
                        <p className="font-semibold text-[#094A4D]">
                          {appointments.hospitalId}
                        </p>
                        <p className="text-[#094A4D] text-sm">
                          {appointments.hospitalName}
                        </p>
                      </div>
                    </td>
                    <td className="p-3 text-[#094A4D]">
                      {appointments.charge}
                    </td>

                    <td className="p-3 text-[#094A4D]">
                      <span
                        className={` text-md flex items-center gap-2 ${
                          appointments.status === "Completed"
                            ? "text-green-500"
                            : appointments.status === "Cancelled"
                            ? "text-red-500"
                            : "text-yellow-500"
                        }`}
                      >
                        <span
                          className={`w-3 h-3 rounded-full ${
                            appointments.status === "Completed"
                              ? "bg-green-500"
                              : appointments.status === "Cancelled"
                              ? "bg-red-500"
                              : "bg-yellow-500"
                          }`}
                        ></span>
                        {appointments.status}
                      </span>
                    </td>
                    <td className="p-3 text-[#094A4D]">
                      {appointments.specialNote}
                    </td>
                    <td className="p-3 text-[#094A4D]">
                      {appointments.typeOfAppointment}
                    </td>
                    <td className="p-3 text-[#094A4D]">
                      {appointments.createdAt}
                    </td>
                    <td className="p-3 text-[#094A4D]">
                      {appointments.updatedAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-xl h-auto  shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-[#094A4D]">
              Patient Status
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="justify-center flex items-center mb-4">
                <label className="block font-semibold mb-2 mt-2">
                  Active Status:
                </label>
                <div className="grid grid-cols-2 gap-2 items-center mt-2">
                  <div className="ml-3">
                    <input
                      type="radio"
                      id="active"
                      name="Status"
                      value="Active"
                      onChange={handleStatusChange}
                      checked={status === "Active"}
                      className="mr-2 bg-[#007e8556] cursor-pointer"
                    />
                    <label
                      htmlFor="Active"
                      className="font-small text-[#5E6767]"
                    >
                      Active
                    </label>
                  </div>

                  <div className="ml-3">
                    <input
                      type="radio"
                      id="inactive"
                      name="Status"
                      value="Inactive"
                      onChange={handleStatusChange}
                      checked={status === "Inactive"}
                      className="mr-2 bg-[#007e8556] cursor-pointer"
                    />
                    <label
                      htmlFor="Inactive"
                      className="font-small text-[#5E6767]"
                    >
                      Inactive
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-red-900 hover:bg-red-700 cursor-pointer"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* loading component */}
      {isLoading && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                      <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
                        <p className="mb-4 text-lg font-semibold text-[rgba(0,126,133,0.7)]">Please wait...</p>
                        <Spinner className="h-10 w-10 text-[rgba(0,126,133,0.7)]"/>
                      </div>
                    </div>
                  )}

      <div className="mt-6 text-gray-500 text-right">
        <p>{formattedDate}</p>
        <p>{formattedTime}</p>
      </div>
    </div>
  );
};

export default PatientDetails;
