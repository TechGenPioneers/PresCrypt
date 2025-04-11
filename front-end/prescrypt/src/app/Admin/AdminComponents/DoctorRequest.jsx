"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { GetDoctorRequest } from "../service/AdminDoctorRequestService";
const DoctorRequest = () => {
  const [dateTime, setDateTime] = useState(null);
  const [requests, setRequests] = useState([]);
  const [title, setTitle] = useState("Pending Requests");
  const [statusFilter, setStatusFilter] = useState("Pending");

  useEffect(() => {
    const fetchDoctorRequests = async () => {
      const getDoctorRequest = await GetDoctorRequest();
      setRequests(getDoctorRequest);
      console.log("Requests:", getDoctorRequest);
    };
    fetchDoctorRequests();
    setTitle(`${statusFilter} Requests`);
    const updateDateTime = () => {
      setDateTime(new Date());
    };

    updateDateTime(); // Set initial value
    const interval = setInterval(updateDateTime, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [statusFilter]);

  const filteredRequests = requests.filter(
    (request) => request.status === statusFilter
  );

  if (!dateTime) return null; // Prevent SSR mismatch

  // Formatting date as "Wednesday 5 March 2025"
  const formattedDate = dateTime.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Formatting time as "11:15 AM"
  const formattedTime = dateTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return (
    <div className=" p-6 border-15 border-[#E9FAF2] bg-white">
      {/* Title */}
      <h1 className="text-2xl font-bold mb-2">Doctor's Requests</h1>
      <p className="text-[#09424D] text-sm">{formattedDate}</p>

      {/* Table */}
      <div className="overflow-x-auto mt-10 h-[400px]">
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <div className="rounded-lg overflow-hidden">
          <div className="max-h-100 overflow-y-auto">
            <table className="w-full mt-5 border-collapse">
              <thead>
                <tr className="bg-[#006369] text-[#094A4D]">
                  <th className="p-3 text-left sticky top-0 bg-[#B5D9DB] z-5">
                    Request Id
                  </th>
                  <th className="p-3 text-left sticky top-0 bg-[#B5D9DB] z-5">
                    Doctor
                  </th>
                  <th className="p-3 text-left sticky top-0 bg-[#B5D9DB] z-5">
                    specialization
                  </th>
                  <th className="p-3 text-left sticky top-0 bg-[#B5D9DB] z-5">
                    {statusFilter === "Pending"
                      ? "Request Date"
                      : statusFilter === "Approved"
                      ? "Approved Date"
                      : "Rejected Date"}
                  </th>
                  <th className="p-3 text-left sticky top-0 bg-[#B5D9DB] z-5">
                    Action
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {filteredRequests.map((request, index) => (
                  <tr
                    key={index}
                    className={`border-t ${
                      index % 2 === 0 ? "bg-[#E9FAF2]" : "bg-[#ffffff]"
                    }`}
                  >
                    <td className="p-3 text-[#094A4D] space-x-3">{request.requestId}</td>
                    <td className="p-3 flex items-center space-x-3">
                      <div>
                        <p className="font-semibold text-[#094A4D] space-x-3">
                          {request.firstName} {request.lastName}
                        </p>
                        <p className="text-[#094A4D] text-sm">
                          {request.gender}
                        </p>
                      </div>
                    </td>
                    <td className="p-3 text-[#094A4D] space-x-3">
                      {request.specialization}
                    </td>
                    <td className="p-3 text-[#094A4D] space-x-3">
                      {statusFilter === "Pending"
                        ? request.createdAt
                        : statusFilter === "Approved"
                        ? request.checkedAt
                        : request.checkedAt}
                    </td>

                    <td className="p-3 space-x-3">
                      <button className="px-4 py-2 text-[#094A4D] cursor-pointer rounded">
                      <Link href={`/Admin/DoctorRequestDetailPage/${request.requestId}`}>View</Link>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="flex mt-6 space-x-6 justify-center">
        <div className="grid grid-cols-3 gap-10">
          <button
            className={`py-2 px-5 rounded-xl border-5 cursor-pointer ${
              statusFilter === "Rejected"
                ? "bg-red-700 text-white"
                : "text-black border-red-600 hover:bg-red-900 hover:text-white"
            }`}
            onClick={() => setStatusFilter("Rejected")}
          >
            Rejected Requests
          </button>

          <button
            className={`py-2 px-5 rounded-xl border-5 cursor-pointer ${
              statusFilter === "Pending"
                ? "bg-[rgba(0,126,133,0.7)] text-white"
                : "text-[#094A4D] border-[rgba(0,126,133,0.7)] hover:bg-[rgba(0,126,133,0.4)]"
            }`}
            onClick={() => setStatusFilter("Pending")}
          >
            Pending Requests
          </button>

          <button
            className={`py-2 px-5 rounded-xl border-5 cursor-pointer ${
              statusFilter === "Approved"
                ? "bg-[rgba(0,126,133,0.7)] text-white"
                : "text-[#094A4D] border-[rgba(0,126,133,0.7)] hover:bg-[rgba(0,126,133,0.4)]"
            }`}
            onClick={() => setStatusFilter("Approved")}
          >
            Approved Requests
          </button>
        </div>
      </div>
      <div className="mt-6 text-gray-500 flex flex-col items-end">
        <p>{formattedDate}</p>
        <p>{formattedTime}</p>
      </div>
    </div>
  );
};

export default DoctorRequest;
