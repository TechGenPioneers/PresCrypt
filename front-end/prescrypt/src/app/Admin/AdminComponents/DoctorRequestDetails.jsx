"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { MoveLeft } from "lucide-react";
import { GetRequestById } from "../service/AdminDoctorRequestService";



const DoctorRequestDetails = (requestID) => {
  const router = useRouter();
  const [request, setRequest] = useState(null);
  const [dateTime, setDateTime] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission (e.g., send `message` to backend)
    console.log('Rejection reason:', message);
    setShowModal(false); // Close modal after submit
  };


  useEffect(() => {
    const fetchRequest = async () => {
      const getRequest = await GetRequestById(requestID);
      setRequest(getRequest);
      console.log("Doctor:", getRequest);
    };
    fetchRequest();
    const updateDateTime = () => setDateTime(new Date());
    updateDateTime(); // Set initial time
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, [requestID]);

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

  if (!doctor) return <p className="text-center">Request not found.</p>;
  return (
    <div className="p-8 border-15 border-[#E9FAF2]">
      <h1 className="text-3xl font-bold mb-2">
        Doctor Request - {doctor.name}
      </h1>
      <p className="text-gray-500">{formattedDate}</p>
      <div className="mt-5 mb-10 justify-start">
        <button className="cursor-pointer">
          <Link href="/Admin/DoctorRequest">
          <MoveLeft
            size={30}
            width={40}
            strokeWidth={4.5}
            absoluteStrokeWidth
          />
          </Link>
        </button>
      </div>
      <div className="flex mt-6 space-x-6 justify-center">
        {/* Availability */}
        <div className="bg-[rgb(233,250,242)] p-6 rounded-lg shadow-md w-2/3">
          <div className="grid grid-cols-2 space-x-2">
            <div>
              <h2 className="text-lg">{doctor.name}</h2>
              <p className="text-gray-600 mt-1">{doctor.gender}</p>
              <p className="text-gray-600 mt-1">{doctor.specialty}</p>
              <p className="text-gray-600 mt-1">{doctor.hospital}</p>

              <div className="mt-8">
                <p className="text-gray-600">{doctor.telephone}</p>
                <p className="text-gray-600">{doctor.email}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold">Availability:</h3>
              {doctor.availability.map((time, index) => (
                <p key={index} className="text-gray-700 pt-10 pl-5">
                  {time}
                </p>
              ))}
              <div className="text-end mt-7">
                <p className="text-gray-600"> Requested Date:{doctor.date}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex mt-6 space-x-6 justify-center">
        <div className="grid grid-cols-2 gap-10">
          <button className="bg-red-700 text-white py-2 px-5 rounded-xl hover:bg-red-900 cursor-pointer " onClick={() => setShowModal(true)}>
            Cancel Request
          </button>
          <button className="bg-[rgba(0,126,133,0.7)] text-[#094A4D] py-2 px-5 rounded-xl hover:bg-[rgba(0,126,133,0.4)] cursor-pointer">
            Confirm Registration
          </button>
        </div>
      </div>
{/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-xl h-auto  shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-[#094A4D]">Cancel Request</h2>
            <form onSubmit={handleSubmit}>
              <label className="block mb-2 text-sm text-gray-700">
              Reason for Cancellation:
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
                rows="4"
                placeholder="Enter your message..."
                required
              ></textarea>
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
      <div className="mt-6 text-gray-500 text-right">
        <p>{formattedDate}</p>
        <p>{formattedTime}</p>
      </div>
    </div>
  );
};

export default DoctorRequestDetails;
