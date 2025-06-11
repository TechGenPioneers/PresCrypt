"use client";
import React, { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { X } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";

export default function RescheduleModal({
  isOpen,
  onClose,
  doctorId = "D002",
}) {
  const [date, setDate] = useState(new Date());
  const [hospitalFilter, setHospitalFilter] = useState("");
  const [availableHospitals, setAvailableHospitals] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [rescheduleStates, setRescheduleStates] = useState({}); // Stores which appointments are marked for reschedule
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const formatDateWithoutTimezone = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getAppointmentUniqueKey = (appointment, index) => {
    return `${appointment.appointmentId || appointment.id}-${
      appointment.time
    }-${appointment.patientId}-${index}`;
  };

  const filteredAppointments = hospitalFilter
    ? appointments.filter((a) => a.hospitalId === hospitalFilter)
    : appointments;

  useEffect(() => {
    if (isOpen) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      setDate(today); // Set calendar to today's date
      setHospitalFilter("");
      setRescheduleStates({}); // Reset selections on modal open
      setSuccessMessage("");
      setErrors("");
    }
  }, [isOpen]);

  // Effect to fetch available hospitals when modal opens, doctorId or date changes
  useEffect(() => {
    if (!isOpen || !doctorId || !date) return; // Only fetch if modal is open and required data exists
    const formattedDate = formatDateWithoutTimezone(date);
    setErrors("");
    setSuccessMessage("");

    axiosInstance
      .get(
        `/Appointments/available-hospitals?doctorId=${doctorId}&date=${formattedDate}`
      )
      .then((res) => {
        const hospitals = res.data || [];
        const normalized = hospitals.map((h) => ({
          hospitalId: h.hospitalId || h.id,
          hospitalName:
            h.hospitalName || h.name || `Hospital ${h.hospitalId || h.id}`,
        }));
        setAvailableHospitals(normalized);
      })
      .catch((err) => {
        console.error("Failed to load hospitals:", err);
        setErrors("Failed to load hospitals. Please try again.");
      });
  }, [isOpen, doctorId, date]);

  // Effect to fetch appointments when modal opens, doctorId or date changes
  useEffect(() => {
    if (!isOpen || !doctorId || !date) return; // Only fetch if modal is open and required data exists
    const formattedDate = formatDateWithoutTimezone(date);
    setErrors("");
    setSuccessMessage("");

    axiosInstance
      .get(`/Appointments/by-doctor/${doctorId}?date=${formattedDate}`)
      .then((res) => {
        const fetchedAppointments = res.data || [];
        // Log fetched data to inspect its structure, especially the ID field
        console.log("Fetched Appointments:", fetchedAppointments);
        setAppointments(fetchedAppointments);
        setRescheduleStates({});
      })
      .catch((err) => {
        console.error("Failed to load appointments:", err);
        setErrors("Failed to load appointments. Please try again.");
      });
  }, [isOpen, doctorId, date]); // Dependency array: re-run when these change

  // Toggles the selection state for an individual appointment using its unique key
  const toggleSelection = (uniqueKey) => {
    setRescheduleStates((prev) => ({
      ...prev,
      [uniqueKey]: !prev[uniqueKey],
    }));
  };

  const handleConfirm = () => {
    const selectedCount =
      Object.values(rescheduleStates).filter(Boolean).length;
    if (selectedCount === 0) {
      setErrors("Please select at least one appointment to reschedule.");
      return;
    }
    setErrors("");
    setShowConfirmation(true);
  };

  const confirmReschedule = async () => {
    setIsSubmitting(true);
    setErrors("");
    setSuccessMessage("");

    try {
      // Get the unique keys of selected appointments
      const selectedUniqueKeys = Object.keys(rescheduleStates).filter(
        (uniqueKey) => rescheduleStates[uniqueKey]
      );

      const appointmentIdsToReschedule = selectedUniqueKeys.map((uniqueKey) => {
        const originalAppointmentId = uniqueKey.split("-")[0];
        return originalAppointmentId;
      });

      if (appointmentIdsToReschedule.length === 0) {
        setErrors("No appointments selected for rescheduling.");
        setIsSubmitting(false);
        return;
      }

      const payload = {
        appointmentIds: appointmentIdsToReschedule,
      };
      console.log("Sending payload for reschedule:", payload);

      // Call the backend endpoint for rescheduling multiple appointments
      const response = await axiosInstance.post(
        "/Appointments/reschedule-appointments",
        payload
      );

      console.log("Backend response for reschedule:", response.data); // Log backend response

      if (response.data && response.data.length > 0) {
        const successfulReschedules = response.data.filter(
          (r) => r.success
        ).length;
        if (successfulReschedules > 0) {
          setSuccessMessage(
            `Successfully initiated auto-reschedule for ${successfulReschedules} appointment(s). ` +
              `Patients will receive an email for confirmation.`
          );
        } else {
          // Check for individual appointment errors from the backend response
          const failedMessages = response.data
            .filter((r) => !r.success)
            .map((r) => r.message)
            .join("; ");
          setErrors(
            `Some appointments could not be auto-rescheduled: ${
              failedMessages || "No specific error messages provided."
            }`
          );
        }

        setShowConfirmation(false);
        setRescheduleStates({}); // Clear selection after processing

        // Re-fetch appointments for the currently selected date to update the list
        const res = await axiosInstance.get(
          `/Appointments/by-doctor/${doctorId}?date=${formatDateWithoutTimezone(
            date
          )}`
        );
        setAppointments(res.data || []);
      } else {
        setErrors(
          "Failed to auto-reschedule appointments: No response data or empty result from backend."
        );
      }
    } catch (err) {
      console.error("Auto-rescheduling error:", err);
      if (err.response) {
        console.error("Error response data:", err.response.data);
        console.error("Error response status:", err.response.status);
        console.error("Error response headers:", err.response.headers);
        if (err.response.data && typeof err.response.data === "string") {
          setErrors(`Server Error: ${err.response.data}`);
        } else if (err.response.data && err.response.data.message) {
          setErrors(`Error: ${err.response.data.message}`);
        } else {
          setErrors(
            `Server responded with status ${err.response.status}. Please try again.`
          );
        }
      } else if (err.request) {
        // The request was made but no response was received
        setErrors(
          "No response from server. Please check your network connection."
        );
        console.error("Error request:", err.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        setErrors(
          "An unknown error occurred while preparing the request. Please try again."
        );
        console.error("Error message:", err.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#ffffffc0] z-50 flex justify-center items-center p-4 overflow-auto">
      <div className="p-1 bg-[#E9FAF2] rounded-[20px] shadow-2xl max-w-6xl w-full mx-4 overflow-y-auto">
        <div className="p-3 relative border-2 border-dashed border-black rounded-[20px]">
          <div className="max-w-6xl w-full max-h-[90vh] overflow-hidden flex relative">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 transition z-10"
              aria-label="Close"
            >
              <X className="w-6 h-6 text-gray-600 cursor-pointer" />
            </button>

            {/* Left Side: Calendar */}
            <div className="w-1/2 border-r border-gray-300 p-6 overflow-auto">
              <h2 className="text-2xl font-bold mb-6 text-[#094A4D]">
                Select Date to View Appointments
              </h2>
              <DayPicker
                mode="single"
                selected={date}
                onSelect={(d) => {
                  // Ensure a date is selected and it's a new day before updating state
                  if (d) {
                    const newDate = new Date(
                      d.getFullYear(),
                      d.getMonth(),
                      d.getDate()
                    );
                    // Only update if the date actually changed to prevent unnecessary re-fetches
                    if (newDate.toDateString() !== date.toDateString()) {
                      setDate(newDate);
                    }
                  }
                }}
                fromDate={new Date()} // Prevents selecting past dates
                disabled={isSubmitting}
                modifiers={{ disabled: [{ before: new Date() }] }} // Visually disables past dates
              />
              <div className="mt-8 mb-6">
                <label className="block mb-2 font-semibold text-[#094A4D]">
                  Filter by Hospital:
                </label>
                <select
                  value={hospitalFilter}
                  onChange={(e) => setHospitalFilter(e.target.value)}
                  disabled={isSubmitting || !availableHospitals.length}
                  className="w-full p-2 border rounded-[10px] cursor-pointer"
                >
                  <option value="">All Hospitals</option>
                  {availableHospitals.map((h) => (
                    <option key={h.hospitalId} value={h.hospitalId}>
                      {h.hospitalName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-[10px] border rounded-12px border-blue-200">
                <p className="font-semibold">Viewing Appointments for:</p>
                <p>{date.toDateString()}</p>
              </div>
            </div>

            {/* Right Side: Appointment List */}
            <div className="w-1/2 p-6 flex flex-col">
              <h2 className="text-2xl font-bold mb-4 text-[#094A4D]">
                Appointments for {date.toDateString()}
              </h2>

              {errors && (
                <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
                  {errors}
                </div>
              )}

              {successMessage && (
                <div className="mb-4 p-3 bg-green-100 border-l-4 border-green-500 text-green-700 rounded">
                  {successMessage}
                </div>
              )}

              <div className="flex-grow overflow-y-auto mb-4 border border-gray-300 rounded-[12px] p-4">
                {filteredAppointments.length === 0 ? (
                  <p className="text-center text-gray-600">
                    No upcoming appointments for selected date and hospital.
                  </p>
                ) : (
                  filteredAppointments.map((appointment, index) => {
                    const uniqueKey = getAppointmentUniqueKey(
                      appointment,
                      index
                    );
                    const isSelected = rescheduleStates[uniqueKey] || false;

                    const canSelect =
                      appointment.status !== "Rescheduled" &&
                      appointment.status !== "Completed" &&
                      appointment.status !== "Pending Confirmation"; // Added this status

                    return (
                      <div
                        key={uniqueKey} // Use the unique key here
                        className={`flex justify-between items-center p-3 mb-2 rounded-[12px] border ${
                          isSelected
                            ? "border-green-500 bg-green-50"
                            : "border-gray-300"
                        } ${
                          !canSelect
                            ? "bg-gray-100 opacity-70 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <div className="flex-grow">
                          <p>
                            <strong>Patient ID:</strong> {appointment.patientId}
                          </p>
                          <p>
                            <strong>Hospital:</strong>{" "}
                            {appointment.hospitalName}
                          </p>
                          <p>
                            <strong>Time:</strong> {appointment.time}
                          </p>
                          <p>
                            <strong>Status:</strong>{" "}
                            <span className="font-semibold">
                              {appointment.status}
                            </span>
                          </p>
                          {isSelected && (
                            <p className="mt-1 text-[#094a4dbd]">
                              <span className="font-semibold">Action:</span>{" "}
                              Initiate auto-reschedule
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => toggleSelection(uniqueKey)} // Pass the unique key to toggleSelection
                          className={`px-3 py-1 rounded-[10px] text-white cursor-pointer ${
                            isSelected
                              ? "bg-red-500 hover:bg-red-600"
                              : "bg-[#094A4D] hover:bg-[#0b6669]"
                          }`}
                          disabled={isSubmitting || !canSelect} // Disable if submitting or not eligible for reschedule
                        >
                          {isSelected ? "Unselect" : "Reschedule"}
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              {!showConfirmation ? (
                <div className="flex justify-end gap-4">
                  <button
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-gray-400 rounded-[10px] text-white hover:bg-gray-500 transition cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleConfirm}
                    // Disable if submitting or no appointments are selected for reschedule
                    disabled={
                      isSubmitting ||
                      !Object.values(rescheduleStates).some((s) => s)
                    }
                    className={`px-6 py-2 rounded-[10px] text-white transition cursor-pointer ${
                      !Object.values(rescheduleStates).some((s) => s)
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-[#094A4D] hover:bg-[#0b6669]"
                    }`}
                  >
                    {Object.values(rescheduleStates).filter((s) => s).length > 0
                      ? `Initiate Reschedule for ${
                          Object.values(rescheduleStates).filter((s) => s)
                            .length
                        } Appointment(s)`
                      : "Initiate Reschedule"}
                  </button>
                </div>
              ) : (
                <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                  <p className="mb-4">
                    Rescheduling for{" "}
                    {Object.values(rescheduleStates).filter((s) => s).length}{" "}
                    appointment(s). Please confirm your action.
                  </p>
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => setShowConfirmation(false)}
                      className="px-6 py-2 bg-gray-400 rounded-[12px] text-white hover:bg-gray-600 transition cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      onClick={confirmReschedule}
                      disabled={isSubmitting}
                      className="px-6 py-2 rounded-[12px] bg-[#094A4D] text-white hover:bg-[#0b6669] transition cursor-pointer"
                    >
                      {isSubmitting ? "Processing..." : "Confirm"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
