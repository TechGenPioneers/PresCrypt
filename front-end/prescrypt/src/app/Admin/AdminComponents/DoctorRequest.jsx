"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
const DoctorRequest = () => {
  const [dateTime, setDateTime] = useState(null);

  useEffect(() => {
    const updateDateTime = () => {
      setDateTime(new Date());
    };

    updateDateTime(); // Set initial value
    const interval = setInterval(updateDateTime, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

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

  const request = [
    {
      id: "R001",
      name: "Dr.Shenali",
      gender: "Female",
      date: "2025-03-01",
    },
    {
      id: "R002",
      name: "Jane Doe",
      gender: "Female",
      date: "2025-02-15",
    },
    {
      id: "R003",
      name: "Alice Smith",
      gender: "Female",
      date: "2025-01-20",
    },
    {
      id: "R004",
      name: "Bob Brown",
      gender: "Male",
      date: "2025-03-10",
    },
    {
      id: "R005",
      name: "Charlie White",
      gender: "Male",
      date: "2025-02-05",
    },
    {
      id: "P006",
      name: "Diana Green",
      gender: "Female",
      date: "2025-02-25",
    },
  ];
  return (
    <div className="p-6 border-15 border-[#E9FAF2] bg-white ">
      {/* Title */}
      <h1 className="text-2xl font-bold mb-2">Doctor's Requests</h1>
      <p className="text-[#09424D] text-sm">{formattedDate}</p>

      {/* Table */}
      <div className="overflow-x-auto mt-10">
        <div className="rounded-lg overflow-hidden">
          <div className="max-h-100 overflow-y-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#006369] text-[#094A4D]">
                  <th className="p-3 text-left sticky top-0 bg-[#B5D9DB] z-5">
                    Request Id
                  </th>
                  <th className="p-3 text-left sticky top-0 bg-[#B5D9DB] z-5">
                    Doctor
                  </th>
                  <th className="p-3 text-left sticky top-0 bg-[#B5D9DB] z-5">
                    Request Date
                  </th>
                  <th className="p-3 text-left sticky top-0 bg-[#B5D9DB] z-5">
                    Action
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {request.map((request, index) => (
                  <tr
                    key={index}
                    className={`border-t ${
                      index % 2 === 0 ? "bg-[#E9FAF2]" : "bg-[#ffffff]"
                    }`}
                  >
                    <td className="p-3 text-[#094A4D]">{request.id}</td>
                    <td className="p-3 flex items-center space-x-3">
                      <div>
                        <p className="font-semibold text-[#094A4D]">
                          {request.name}
                        </p>
                        <p className="text-[#094A4D] text-sm">
                          {request.gender}
                        </p>
                      </div>
                    </td>
                    <td className="p-3 text-[#094A4D]">{request.date}</td>
                    <td className="p-3">
                      <button
                        // onClick={() => router.push(`/Admin/DoctorRequestDetailPage/${request.id}`)}
                        className="px-4 py-2 text-[#094A4D] cursor-pointer rounded "
                      >
                        <Link href="/Admin/DoctorRequestDetailPage">
                        View
                        </Link>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
