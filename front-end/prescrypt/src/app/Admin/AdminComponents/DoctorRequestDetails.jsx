"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { MoveLeft } from "lucide-react";
import {
  GetRequestById,
  RejectRequest,
  SendMail,
} from "../service/AdminDoctorRequestService";
import { Spinner } from "@material-tailwind/react";

const DoctorRequestDetails = ({ requestId }) => {
  const router = useRouter();
  const [request, setRequest] = useState(null);
  const [dateTime, setDateTime] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [mail, setMail] = useState({
    Receptor: "",
    FirstName:"",
    LastName:"",
    reason: "",
  });

  const fetchRequest = async () => {
    const getRequest = await GetRequestById(requestId);
    setRequest(getRequest);
    console.log("Request:", getRequest);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const updatedMail = {
      ...mail,
      Receptor: request.request.email, 
      FirstName: request.request.firstName,
      LastName: request.request.lastName,
    };

    console.log("Rejection reason:", updatedMail);

    console.log("Rejection reason:", mail);
    try {
      const sent = await SendMail(updatedMail);
      console.log(sent);
      if (sent != null) {
        try {
          const response = await RejectRequest(
            request.request.requestId,
            mail.reason
          );
          console.log(response);
        } catch (error) {
          alert("failed to reject");
        }
      }
    } catch (err) {
      console.error("Failed to send mail", err);
      alert("Failed to send mail!", err);
    }
    setIsLoading(false);
    setMail({ Receptor: "", reason: "" });
    fetchRequest();
    setShowModal(false); // Close modal after submit
  };

  useEffect(() => {
    fetchRequest();

    const updateDateTime = () => setDateTime(new Date());
    updateDateTime(); // Set initial time
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, [requestId]);

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

  if (!request) {
    return (
      <div className="h-[650px] p-8 border-15 border-[#E9FAF2]">
        <h1 className="text-3xl font-bold mb-2"> Doctor Request</h1>
        <div className="h-[400px] mt-10 bg-[#E9FAF2] p-6 rounded-lg shadow-md w-full flex flex-col">
          <div className="flex-grow flex items-center justify-center">
            <p className="text-red-400 font-bold text-xl text-center mb-5">
              Request not found
            </p>
          </div>
          <Link href="/Admin/DoctorRequestPage">
            <button
              className="w-full ml-1 px-10 py-2 bg-[#A9C9CD] text-[#09424D] font-semibold rounded-lg 
          hover:bg-[#91B4B8] transition duration-300 cursor-pointer"
            >
              Go to Doctor Request List
            </button>
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="p-8 border-15 border-[#E9FAF2]">
      <h1 className="text-3xl font-bold mb-2">
        Doctor Request - {request.request.requestId} -{" "}
        {request.request.firstName} {request.request.lastName}
        <span
          className={`font-semibold text-lg flex items-center gap-2 ${
            request.request.requestStatus === "Approved"
              ? "text-green-500"
              : request.request.requestStatus === "Rejected"
              ? "text-red-500"
              : "text-yellow-500"
          }`}
        >
          <span
            className={`w-3 h-3 rounded-full ${
              request.request.requestStatus === "Approved"
                ? "bg-green-500"
                : request.request.requestStatus === "Rejected"
                ? "bg-red-500"
                : "bg-yellow-500"
            }`}
          ></span>
          {request.request.requestStatus}
        </span>
      </h1>

      <div className="flex mt-6 space-x-6">
        {/* Profile Card */}
        <div className="bg-[#E9FAF2] p-6 rounded-lg shadow-md sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 text-left">
          {/* Doctor Name */}
          <div className="text-center">
            <h2 className="text-lg font-bold">
              {request.request.firstName} {request.request.lastName}
            </h2>
          </div>

          {/* Doctor Details */}
          <div className="flex gap-1.5 m-1">
            <h1 className="font-semibold">Doctor Fee:</h1>{" "}
            <p className="text-gray-600">Rs.{request.request.charge}</p>
          </div>
          <div className="flex gap-1.5 m-1">
            <h1 className="font-semibold">Gender:</h1>{" "}
            <p className="text-gray-600">{request.request.gender}</p>
          </div>
          <div className="flex gap-1.5 m-1">
            <h1 className="font-semibold">Contact:</h1>
            <p className="text-gray-600">{request.request.contactNumber}</p>
          </div>
          <div className="flex gap-1.5 m-1">
            <h1 className="font-semibold">Specialization:</h1>{" "}
            <p className="text-gray-600">{request.request.specialization}</p>
          </div>
          <div className="flex gap-1.5 m-1">
            <h1 className="font-semibold">SLMC License:</h1>
            <p className="text-gray-600">{request.request.slmcRegId}</p>
          </div>
          <div className="flex gap-1.5 m-1">
            <h1 className="font-semibold">Email:</h1>{" "}
            <p className="text-gray-600">{request.request.email}</p>
          </div>
          <div className="flex gap-1.5 m-1">
            <h1 className="font-semibold">NIC:</h1>
            <p className="text-gray-600">{request.request.nic}</p>
          </div>
          <div className="flex gap-1.5 m-1">
            <h1 className="font-semibold">Email Verified:</h1>{" "}
            <p className="text-gray-600">
              {request.request.emailVerified ? "Verified" : "Not Verified"}
            </p>
          </div>
          <div className="flex gap-1.5 m-1">
            <h1 className="font-semibold">Requested At:</h1>{" "}
            <p className="text-gray-600">{request.request.createdAt}</p>
          </div>
          {(request.request.requestStatus === "Approved" ||
            request.request.requestStatus === "Rejected") && (
            <div className="flex gap-1.5 m-1">
              <h1 className="font-semibold">Checked At:</h1>
              <p className="text-gray-600">{request.request.checkedAt}</p>
            </div>
          )}
          {request.request.requestStatus === "Rejected" && (
            <div className="flex gap-1.5 m-1">
              <h1 className="font-semibold">Reason:</h1>
              <p className="text-gray-600">{request.request.reason}</p>
            </div>
          )}
        </div>

        {/* Availability */}
        <div className="bg-[#E9FAF2] p-6 rounded-lg shadow-md w-2/3">
          <h3 className="font-semibold mb-2">Availability:</h3>
          <ul className="list-disc pl-5">
            {request.requestAvailability.map((slot, index) => (
              <li key={index} className="text-gray-700 pt-2">
                <span className="font-bold">{slot.availableDay}</span>:{" "}
                {slot.availableStartTime} - {slot.availableEndTime} at{" "}
                <span className="font-bold">{slot.hospitalName}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {request.request.requestStatus === "Pending" && (
        <div className="flex mt-6 space-x-6 justify-center">
          <div className="grid grid-cols-2 gap-10">
            <button
              className="bg-red-700 text-white py-2 px-5 rounded-xl hover:bg-red-900 cursor-pointer"
              onClick={() => setShowModal(true)}
            >
              Cancel Request
            </button>
            <button className="bg-[rgba(0,126,133,0.7)] text-[#094A4D] py-2 px-5 rounded-xl hover:bg-[rgba(0,126,133,0.4)] cursor-pointer">
            <Link href={`/Admin/RegistrationConfirmPage/${request.request.requestId}`}>
              Confirm Registration</Link>
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-xl h-auto  shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-[#094A4D]">
              Cancel Request
            </h2>
            <form onSubmit={handleSubmit}>
              <label className="block mb-2 text-sm text-gray-700">
                Reason for Cancellation:
              </label>
              <textarea
                value={mail.reason}
                onChange={(e) => setMail({ ...mail, reason: e.target.value })}
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

export default DoctorRequestDetails;
