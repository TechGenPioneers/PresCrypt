"use client";
import React from "react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { GetDoctorRequest } from "../service/AdminDoctorRequestService";
const DoctorRequest = () => {
  const [dateTime, setDateTime] = useState(null);
  const [requests, setRequests] = useState([]);
  const [title, setTitle] = useState("Pending Requests");
  const [statusFilter, setStatusFilter] = useState("Pending");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 15000); 

    return () => clearTimeout(timeout); // Cleanup
  }, []);
  useEffect(() => {
    //get all requests
    const fetchDoctorRequests = async () => {
      const getDoctorRequest = await GetDoctorRequest();
      setRequests(getDoctorRequest);
      setLoading(false);
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

  return (
    <div className="p-6 border-[15px] border-b-0 border-[#E9FAF2] bg-white">
      {/* Title */}
      <h1 className="text-3xl font-bold text-slate-800 mb-1">
        Doctor's Requests
      </h1>
      <p className="text-[#09424D] text-sm">{formattedDate}</p>

      {/* Filter Buttons */}
      <div className="mt-8 flex justify-center">
        <div className="flex flex-wrap gap-4">
          <button
            className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
              statusFilter === "Rejected"
                ? "bg-red-600 text-white"
                : "border border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
            }`}
            onClick={() => setStatusFilter("Rejected")}
          >
            Rejected Requests
          </button>
          <button
            className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
              statusFilter === "Pending"
                ? "bg-[#007E85] text-white"
                : "border border-[#007E85] text-[#007E85] hover:bg-[#007E85]/20"
            }`}
            onClick={() => setStatusFilter("Pending")}
          >
            Pending Requests
          </button>
          <button
            className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
              statusFilter === "Approved"
                ? "bg-[#007E85] text-white"
                : "border border-[#007E85] text-[#007E85] hover:bg-[#007E85]/20"
            }`}
            onClick={() => setStatusFilter("Approved")}
          >
            Approved Requests
          </button>
        </div>
      </div>

      {/* Subtitle */}
      <h3 className="text-2xl font-bold mt-10 mb-2 text-slate-800">{title}</h3>

      {/* Table */}
      <div className="overflow-x-auto h-[400px] rounded-xl border border-slate-200 mt-4">
        <div className="max-h-96 overflow-y-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="sticky top-0 bg-[#B5D9DB] z-5 shadow">
              <tr className="text-[#094A4D]">
                <th className="p-4 text-left font-semibold">Request ID</th>
                <th className="p-4 text-left font-semibold">Doctor</th>
                <th className="p-4 text-left font-semibold">Specialization</th>
                <th className="p-4 text-left font-semibold">
                  {statusFilter === "Pending"
                    ? "Request Date"
                    : statusFilter === "Approved"
                    ? "Approved Date"
                    : "Rejected Date"}
                </th>
                <th className="p-4 text-left font-semibold">Action</th>
              </tr>
            </thead>
            {filteredRequests.length === 0 ? (
              loading ? (
                <tbody>
                  <tr>
                    <td colSpan="6">
                      <div className="flex items-center justify-center h-[400px]">
                        <div className="flex flex-col items-center space-y-4">
                          <div className="w-16 h-16 border-4 border-[#E9FAF2] border-t-[#50d094] rounded-full animate-spin"></div>
                          <p className="text-slate-600 text-lg font-medium">
                            Loading Doctor Requests...
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  <tr>
                    <td colSpan="6">
                      <div className="flex items-center justify-center h-[400px]">
                        <p className="text-slate-600 text-lg font-medium">
                          No Doctor Requests Found.
                        </p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              )
            ) : (
              <tbody>
                {filteredRequests.map((request, index) => (
                  <tr
                    key={index}
                    className={`transition-all ${
                      index % 2 === 0 ? "bg-[#F7FCFA]" : "bg-white"
                    } hover:bg-[#E9FAF2]`}
                  >
                    <td className="p-4 text-[#094A4D] font-medium">
                      {request.requestId}
                    </td>
                    <td className="p-4 text-[#094A4D]">
                      <div className="flex flex-col">
                        <span className="font-semibold">
                          {request.firstName} {request.lastName}
                        </span>
                        <span className="text-sm text-slate-600">
                          {request.gender}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-[#094A4D]">
                      {request.specialization}
                    </td>
                    <td className="p-4 text-[#094A4D]">
                      {statusFilter === "Pending"
                        ? request.createdAt
                        : request.checkedAt}
                    </td>
                    <td className="p-4">
                      <Link
                        href={`/Admin/DoctorRequestDetailPage/${request.requestId}`}
                      >
                        <button className="px-4 py-2 bg-[#B5D9DB] text-[#094A4D] font-medium rounded-lg hover:bg-[#A2C5C7] transition">
                          View
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};

export default DoctorRequest;
