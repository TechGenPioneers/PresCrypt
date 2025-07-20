"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import RescheduleConfirmationService from "./services/RescheduleConfirmationService";

export default function AppointmentConfirmation() {
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get("id");

  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const handleAction = async (action) => {
    if (!appointmentId) return;

    setStatus("loading");
    setMessage("");

    try {
      let response;
      if (action === "confirm") {
        response = await RescheduleConfirmationService.confirmAppointment(
          appointmentId
        );
      } else {
        response = await RescheduleConfirmationService.cancelAppointment(
          appointmentId
        );
      }

      setStatus("success");
      setMessage(
        response.message ||
          `Appointment ${
            action === "confirm" ? "confirmed" : "cancelled"
          } successfully!`
      );
    } catch (error) {
      setStatus("error");
      setMessage(
        error.response?.data?.message || error.message || "An error occurred"
      );
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          Confirm Your Appointment
        </h1>

        {status === "success" ? (
          <div className="text-center">
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <p className="text-lg mb-6">{message}</p>
            <p>You may now close this window.</p>
          </div>
        ) : (
          <>
            <p className="mb-6 text-center">
              Please confirm or cancel your appointment reschedule request.
            </p>

            <div className="flex flex-col space-y-4">
              <button
                onClick={() => handleAction("confirm")}
                disabled={status === "loading"}
                className={`bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-[10px] cursor-pointer ${
                  status === "loading" ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {status === "loading" ? "Processing..." : "Confirm Appointment"}
              </button>

              <button
                onClick={() => handleAction("cancel")}
                disabled={status === "loading"}
                className={`bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-[10px] cursor-pointer ${
                  status === "loading" ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {status === "loading" ? "Processing..." : "Cancel Appointment"}
              </button>
            </div>

            {status === "error" && (
              <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
                {message}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
