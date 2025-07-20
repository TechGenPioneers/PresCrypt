"use client";
import React, { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { X } from "lucide-react";
import AppointmentsRescheduleService from "../services/AppointmentsRescheduleService";

export default function RescheduleModal({ isOpen, onClose, doctorId }) {
  // Initialize date to today's date, setting hours, minutes, seconds, and milliseconds to 0
  const [date, setDate] = useState(() => {
    const today = new Date();
    // Set to midnight local time
    today.setHours(0, 0, 0, 0); 
    return today;
  });
  const [hospitalFilter, setHospitalFilter] = useState("");
  const [availableHospitals, setAvailableHospitals] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [rescheduleStates, setRescheduleStates] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const filteredAppointments = hospitalFilter
    ? appointments.filter((a) => a.hospitalId === hospitalFilter)
    : appointments;

  const getAppointmentUniqueKey = (appointment, index) =>
    `${appointment.appointmentId || appointment.id}-${appointment.time}-${appointment.patientId}-${index}`;

  useEffect(() => {
    if (isOpen) {
      const today = new Date();
      // Ensure today's date is set to midnight local time
      today.setHours(0, 0, 0, 0); 
      setDate(today);
      setHospitalFilter("");
      setRescheduleStates({});
      setSuccessMessage("");
      setErrors("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !doctorId || !date) return;

    setErrors("");
    setSuccessMessage("");

    // Format the date to "YYYY-MM-DD" in local time before sending to service
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    AppointmentsRescheduleService.fetchAvailableHospitals(doctorId, formattedDate)
      .then((hospitals) => {
        const normalized = hospitals.map((h) => ({
          hospitalId: h.hospitalId || h.id,
          hospitalName: h.hospitalName || h.name || `Hospital ${h.hospitalId || h.id}`,
        }));
        setAvailableHospitals(normalized);
      })
      .catch((err) => {
        console.error("Failed to load hospitals:", err);
        setErrors("Failed to load hospitals. Please try again.");
      });

    AppointmentsRescheduleService.fetchAppointmentsByDoctor(doctorId, formattedDate)
      .then((fetchedAppointments) => {
        setAppointments(fetchedAppointments);
        setRescheduleStates({});
      })
      .catch((err) => {
        console.error("Failed to load appointments:", err);
        setErrors("Failed to load appointments. Please try again.");
      });
  }, [isOpen, doctorId, date]);

  const toggleSelection = (uniqueKey) => {
    setRescheduleStates((prev) => ({
      ...prev,
      [uniqueKey]: !prev[uniqueKey],
    }));
  };

  const handleConfirm = () => {
    const selectedCount = Object.values(rescheduleStates).filter(Boolean).length;
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
      const selectedKeys = Object.keys(rescheduleStates).filter((key) => rescheduleStates[key]);
      const appointmentIds = selectedKeys.map((key) => key.split("-")[0]);

      if (appointmentIds.length === 0) {
        setErrors("No appointments selected for rescheduling.");
        setIsSubmitting(false);
        return;
      }

      const result = await AppointmentsRescheduleService.rescheduleAppointments(appointmentIds);

      if (Array.isArray(result) && result.length > 0) {
        const successCount = result.filter((r) => r.success).length;
        const failedMessages = result
          .filter((r) => !r.success)
          .map((r) => r.message)
          .join("; ");

        if (successCount > 0) {
          setSuccessMessage(`Successfully initiated auto-reschedule for ${successCount} appointment(s).`);
        }
        if (failedMessages) {
          setErrors(`Some failed: ${failedMessages}`);
        }
      } else {
        setSuccessMessage("Rescheduling initiated. Patients will receive confirmation emails.");
      }

      setShowConfirmation(false);
      setRescheduleStates({});
      // Re-fetch appointments for the currently selected date to reflect changes
      // Format the date to "YYYY-MM-DD" in local time before sending to service
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      const refreshed = await AppointmentsRescheduleService.fetchAppointmentsByDoctor(doctorId, formattedDate);
      setAppointments(refreshed);
    } catch (err) {
      console.error("Auto-rescheduling error:", err);
      if (err.response?.data?.message) {
        setErrors(`Error: ${err.response.data.message}`);
      } else {
        setErrors("Something went wrong while rescheduling. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#ffffffc0] z-50 flex justify-center items-center p-4 overflow-auto">
      <div className="p-1 bg-[#E9FAF2] rounded-[20px] shadow-2xl max-w-6xl w-full mx-4 overflow-y-auto">
        <div className="p-3 border-2 border-dashed border-black rounded-[20px]">
          <div className="max-w-6xl flex relative overflow-hidden max-h-[90vh]">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 z-10"
            >
              <X className="w-6 h-6 text-gray-600 cursor-pointer" />
            </button>

            {/* Calendar */}
            <div className="w-1/2 border-r p-6">
              <h2 className="text-2xl font-bold mb-6 text-[#094A4D]">
                Select a Date to Reschedule Appointments
              </h2>
              <DayPicker
                mode="single"
                selected={date}
                onSelect={(selectedDay) => {
                  if (selectedDay) {
                    // Create a new Date object from the selectedDay, ensuring it's interpreted
                    // in the local timezone at midnight, which is what DayPicker gives us.
                    const newLocalMidnightDate = new Date(
                      selectedDay.getFullYear(),
                      selectedDay.getMonth(),
                      selectedDay.getDate()
                    );
                    setDate(newLocalMidnightDate);
                  }
                }}
                fromDate={new Date()} // Prevents selecting past dates
                disabled={isSubmitting}
              />
              <div className="mt-6">
                <label className="block mb-2 font-semibold text-[#094A4D]">
                  Filter by Hospital:
                </label>
                <select
                  value={hospitalFilter}
                  onChange={(e) => setHospitalFilter(e.target.value)}
                  className="w-full p-2 border rounded-[10px]"
                  disabled={isSubmitting || !availableHospitals.length}
                >
                  <option value="">All Hospitals</option>
                  {availableHospitals.map((h) => (
                    <option key={h.hospitalId} value={h.hospitalId}>
                      {h.hospitalName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-4 bg-blue-50 p-3 rounded-[10px]">
                <p className="font-semibold">Viewing Appointments for:</p>
                <p>{date.toDateString()}</p>
              </div>
            </div>

            {/* Appointment List */}
            <div className="w-1/2 p-6 flex flex-col">
              <h2 className="text-2xl font-bold mb-4 text-[#094A4D]">
                Appointments for {date.toDateString()}
              </h2>

              {errors && <div className="mb-3 p-3 bg-red-100 border-l-4 border-red-500">{errors}</div>}
              {successMessage && (
                <div className="mb-3 p-3 bg-green-100 border-l-4 border-green-500">{successMessage}</div>
              )}

              <div className="flex-grow overflow-y-auto mb-4 border p-4 rounded-[12px]">
                {filteredAppointments.length === 0 ? (
                  <p className="text-center text-gray-600">No appointments found.</p>
                ) : (
                  filteredAppointments.map((appt, index) => {
                    const key = getAppointmentUniqueKey(appt, index);
                    const isSelected = rescheduleStates[key] || false;
                    const canSelect = !["Rescheduled", "Completed", "Pending Confirmation"].includes(
                      appt.status
                    );

                    return (
                      <div
                        key={key}
                        className={`flex justify-between items-center p-3 mb-2 rounded-[12px] border ${
                          isSelected
                            ? "border-green-500 bg-green-50"
                            : "border-gray-300"
                        } ${!canSelect ? "bg-gray-100 opacity-70" : ""}`}
                      >
                        <div>
                          <p><strong>Patient ID:</strong> {appt.patientId}</p>
                          <p><strong>Hospital:</strong> {appt.hospitalName}</p>
                          <p><strong>Time:</strong> {appt.time}</p>
                          <p><strong>Status:</strong> {appt.status}</p>
                          {isSelected && <p className="text-[#094a4dbd]">✓ Marked for reschedule</p>}
                        </div>
                        <button
                          onClick={() => toggleSelection(key)}
                          disabled={isSubmitting || !canSelect}
                          className={`px-3 py-1 rounded-[10px] text-white ${
                            isSelected
                              ? "bg-red-500 hover:bg-red-600"
                              : "bg-[#094A4D] hover:bg-[#0b6669]"
                          }`}
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
                    className="px-6 py-2 bg-gray-400 rounded-[10px] text-white"
                    disabled={isSubmitting}
                  >
                    Close
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={
                      isSubmitting ||
                      !Object.values(rescheduleStates).some((v) => v)
                    }
                    className={`px-6 py-2 rounded-[10px] text-white ${
                      Object.values(rescheduleStates).some((v) => v)
                        ? "bg-[#094A4D] hover:bg-[#0b6669]"
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                  >
                    Reschedule
                  </button>
                </div>
              ) : (
                <div className="mt-4 bg-yellow-50 p-4 border-l-4 border-yellow-400 rounded">
                  <p className="mb-4">
                    Confirm rescheduling for{" "}
                    {Object.values(rescheduleStates).filter((s) => s).length}{" "}
                    appointment(s)?
                  </p>
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => setShowConfirmation(false)}
                      className="px-6 py-2 bg-gray-400 rounded-[12px] text-white"
                    >
                      Back
                    </button>
                    <button
                      onClick={confirmReschedule}
                      disabled={isSubmitting}
                      className="px-6 py-2 bg-[#094A4D] hover:bg-[#0b6669] text-white rounded-[12px]"
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