"use client";

import React, { useEffect, useState } from "react";
import AppointmentListStat from "./appointmentListStat";
import axios from "axios";

const AppointmentList = ({ patientId }) => {
  const [appointments, setAppointments] = useState([]);
  const [patientDetails, setPatientDetails] = useState({});

  useEffect(() => {
    const fetchAppointments = async () => {
      const res = await axios.get(`https://localhost:7021/api/Appointments/patient/${patientId}`);
      setAppointments(res.data);

      // Dummy patient info
      setPatientDetails({
        name: "Ms Kayle Fernando",
        age: 24,
        location: "Colombo"
      });
    };

    fetchAppointments();
  }, [patientId]);

  const total = appointments.length;
  const accepted = appointments.filter(a => a.status.toLowerCase() === "yes").length;
  const cancelled = appointments.filter(a => a.status.toLowerCase() === "cancelled").length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <AppointmentListStat
        patientName={patientDetails.name}
        age={patientDetails.age}
        location={patientDetails.location}
        total={total}
        accepted={accepted}
        cancelled={cancelled}
      />

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white text-sm text-left">
          <thead className="bg-blue-200 text-blue-900 font-semibold">
            <tr>
              <th className="px-4 py-2">Appointed Doctor</th>
              <th className="px-4 py-2">Hospital Name</th>
              <th className="px-4 py-2">Appointed Type</th>
              <th className="px-4 py-2">Checked In</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Time</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt, index) => (
              <tr
                key={index}
                className={`border-t ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="px-4 py-2">{appt.doctorName}</td>
                <td className="px-4 py-2">{appt.hospitalName}</td>
                <td className="px-4 py-2">{appt.typeOfAppointment}</td>
                <td
                  className={`px-4 py-2 font-semibold ${
                    appt.status.toLowerCase() === "cancelled"
                      ? "text-red-500"
                      : "text-green-600"
                  }`}
                >
                  {appt.status}
                </td>
                <td className="px-4 py-2">{appt.date}</td>
                <td className="px-4 py-2">{appt.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-6">
        <button className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-6 py-2 rounded-lg shadow">
          Load more..
        </button>
      </div>
    </div>
  );
};

export default AppointmentList;
