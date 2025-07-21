"use client";
import React, { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { X } from "lucide-react";
import AppointmentsRescheduleService from "../services/AppointmentsRescheduleService";
import useAuthGuard from "@/utils/useAuthGuard";

export default function RescheduleModal({ isOpen, onClose, doctorId }) {
  useAuthGuard("Doctor");
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
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(false);

  const filteredAppointments = hospitalFilter
    ? appointments.filter((a) => a.hospitalId === hospitalFilter)
    : appointments;

  const getAppointmentUniqueKey = (appointment) => appointment.appointmentId;

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
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    AppointmentsRescheduleService.fetchAvailableHospitals(
      doctorId,
      formattedDate
    )
      .then((hospitals) => {
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

    AppointmentsRescheduleService.fetchAppointmentsByDoctor(
      doctorId,
      formattedDate
    )
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
      const selectedKeys = Object.keys(rescheduleStates).filter(
        (key) => rescheduleStates[key]
      );
      const appointmentIds = selectedKeys;

      if (appointmentIds.length === 0) {
        setErrors("No appointments selected for rescheduling.");
        setIsSubmitting(false);
        return;
      }

      const result = await AppointmentsRescheduleService.rescheduleAppointments(
        appointmentIds
      );

      if (Array.isArray(result) && result.length > 0) {
        const successCount = result.filter((r) => r.success).length;
        const failedMessages = result
          .filter((r) => !r.success)
          .map((r) => r.message)
          .join("; ");

        if (successCount > 0) {
          setSuccessMessage(
            `Successfully initiated auto-reschedule for ${successCount} appointment(s).`
          );
        }
        if (failedMessages) {
          setErrors(`Some failed: ${failedMessages}`);
        }
      } else {
        setSuccessMessage(
          "Rescheduling initiated. Patients will receive confirmation emails."
        );
      }

      setShowConfirmation(false);
      setRescheduleStates({});
      // Re-fetch appointments for the currently selected date to reflect changes
      // Format the date to "YYYY-MM-DD" in local time before sending to service
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;
      const refreshed =
        await AppointmentsRescheduleService.fetchAppointmentsByDoctor(
          doctorId,
          formattedDate
        );
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
    <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex justify-center items-center p-4 overflow-auto">
      <div className="bg-gradient-to-br from-green-100/80 to-green-200/80 rounded-3xl shadow-xl border border-green-300/50 max-w-6xl w-full mx-4 overflow-hidden">
        <div className="bg-white/70 backdrop-blur-sm m-3 rounded-2xl border border-green-400/30">
          <div className="max-w-6xl flex relative overflow-hidden max-h-[90vh]">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="absolute top-6 right-6 p-2.5 rounded-full hover:bg-green-200/70 transition-all duration-200 z-10 group"
            >
              <X className="w-5 h-5 text-green-800 group-hover:text-green-900" />
            </button>

            <div className="w-1/2 border-r border-green-400/40 p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-light mb-2 text-black tracking-wide">
                  Select a Date to Reschedule Appointments
                </h2>
                <div className="w-16 h-0.5 bg-gradient-to-r from-green-600 to-green-500"></div>
              </div>

              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-3 mb-6 border border-green-300/50">
                <DayPicker
                  mode="single"
                  selected={date}
                  onSelect={(selectedDay) => {
                    if (selectedDay) {
                      const newLocalMidnightDate = new Date(
                        selectedDay.getFullYear(),
                        selectedDay.getMonth(),
                        selectedDay.getDate()
                      );
                      setDate(newLocalMidnightDate);

                      // Show loading spinner while fetching appointments
                      setIsLoadingAppointments(true);

                      // Simulate API call - replace with your actual appointment fetching logic
                      setTimeout(() => {
                        setIsLoadingAppointments(false);
                      }, 1000);
                    }
                  }}
                  fromDate={new Date()}
                  disabled={isSubmitting || isLoadingAppointments}
                  className="medical-calendar ml-8"
                />
              </div>

              <div className="mb-6">
                <label className="block mb-3 text-sm font-medium text-green-800 tracking-wide">
                  FILTER BY HOSPITAL
                </label>
                <div className="relative">
                  <select
                    value={hospitalFilter}
                    onChange={(e) => setHospitalFilter(e.target.value)}
                    className="w-full p-4 bg-white/70 backdrop-blur-sm border border-green-400/50 rounded-xl text-green-900 focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all duration-200 appearance-none"
                    disabled={
                      isSubmitting ||
                      !availableHospitals.length ||
                      isLoadingAppointments
                    }
                  >
                    <option value="">All Hospitals</option>
                    {availableHospitals.map((h) => (
                      <option key={h.hospitalId} value={h.hospitalId}>
                        {h.hospitalName}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-green-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

            </div>

            <div className="w-1/2 p-8 flex flex-col">
              <div className="mb-6">
                <h2 className="text-2xl font-light mb-2 text-black tracking-wide">
                  Appointments Overview
                </h2>
                <div className="w-16 h-0.5 bg-gradient-to-r from-green-600 to-green-500"></div>
                <p className="text-green-700 text-sm mt-2">
                  {date.toDateString()}
                </p>
              </div>

              {errors && (
                <div className="mb-4 p-4 bg-red-50/80 backdrop-blur-sm border-l-4 border-red-400 rounded-xl">
                  <p className="text-red-700 text-sm">{errors}</p>
                </div>
              )}

              {successMessage && (
                <div className="mb-4 p-4 bg-green-100/80 backdrop-blur-sm border-l-4 border-green-500 rounded-xl">
                  <p className="text-green-800 text-sm">{successMessage}</p>
                </div>
              )}

              <div className="flex-grow overflow-y-auto mb-6 bg-white/50 backdrop-blur-sm p-5 rounded-xl border border-green-300/50 relative">
                {/* Loading Overlay */}
                <div
                  className={`absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center z-10 transition-all duration-300 ${
                    isLoadingAppointments
                      ? "opacity-100 visible"
                      : "opacity-0 invisible"
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <div className="relative mb-3">
                      <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-green-700 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      </div>
                    </div>
                    <p className="text-green-800 text-sm font-medium">
                      Loading appointments...
                    </p>
                  </div>
                </div>

                {filteredAppointments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-32 text-center">
                    <div className="w-12 h-12 bg-green-200/70 rounded-full flex items-center justify-center mb-3">
                      <svg
                        className="w-6 h-6 text-black"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-black text-sm">
                      No appointments scheduled
                    </p>
                  </div>
                ) : (
                  filteredAppointments.map((appt, index) => {
                    const key = getAppointmentUniqueKey(appt, index);
                    const isSelected = rescheduleStates[key] || false;
                    const canSelect = ![
                      "Rescheduled",
                      "Completed",
                      "Pending Confirmation",
                    ].includes(appt.status);
                    return (
                      <div
                        key={key}
                        className={`flex justify-between items-center p-4 mb-3 rounded-xl transition-all duration-200 ${
                          isSelected
                            ? "bg-green-200/70 border-2 border-green-500/60 shadow-sm"
                            : "bg-white/70 border border-green-300/40 hover:bg-green-100/50"
                        } ${!canSelect ? "bg-gray-50/70 opacity-60" : ""}`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-black tracking-wider uppercase">
                              Patient ID:
                            </span>
                            <span className="text-black font-light">
                              {appt.patientId}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-black tracking-wider uppercase">
                              Hospital:
                            </span>
                            <span className="text-black font-light">
                              {appt.hospitalName}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-black tracking-wider uppercase">
                              Time:
                            </span>
                            <span className="text-black font-light">
                              {appt.time}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-black tracking-wider uppercase">
                              Status:
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                appt.status === "Completed"
                                  ? "bg-green-200 text-green-800"
                                  : appt.status === "Pending Confirmation"
                                  ? "bg-amber-100 text-amber-700"
                                  : appt.status === "Rescheduled"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {appt.status}
                            </span>
                          </div>
                          {isSelected && (
                            <div className="flex items-center gap-2 mt-2">
                              <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                              <span className="text-xs text-green-700 font-medium">
                                Marked for reschedule
                              </span>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => toggleSelection(key)}
                          disabled={isSubmitting || !canSelect}
                          className={`px-4 py-2.5 rounded-xl text-xs font-medium tracking-wide transition-all duration-200 ${
                            isSelected
                              ? "bg-red-100/80 text-red-700 hover:bg-red-200/80 border border-red-200"
                              : "bg-green-700 text-white hover:bg-green-800 shadow-sm"
                          } ${
                            !canSelect ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          {isSelected ? "REMOVE" : "SELECT"}
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              {!showConfirmation ? (
                <div className="flex justify-end gap-3">
                  <button
                    onClick={onClose}
                    className="px-6 py-3 bg-gray-100/80 hover:bg-gray-200/80 rounded-xl text-gray-700 text-sm font-medium tracking-wide transition-all duration-200"
                    disabled={isSubmitting}
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={
                      isSubmitting ||
                      !Object.values(rescheduleStates).some((v) => v)
                    }
                    className={`px-6 py-3 rounded-xl text-sm font-medium tracking-wide transition-all duration-200 ${
                      Object.values(rescheduleStates).some((v) => v)
                        ? "bg-green-700 hover:bg-green-800 text-white shadow-sm"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    RESCHEDULE
                  </button>
                </div>
              ) : (
                <div className="bg-amber-50/80 backdrop-blur-sm p-6 border border-amber-200/50 rounded-xl">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg
                        className="w-4 h-4 text-amber-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-amber-800 text-sm mb-4 leading-relaxed">
                        Confirm rescheduling for{" "}
                        <span className="font-medium">
                          {
                            Object.values(rescheduleStates).filter((s) => s)
                              .length
                          }
                        </span>{" "}
                        appointment(s)? This action will update the appointment
                        status and notify relevant parties.
                      </p>
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => setShowConfirmation(false)}
                          className="px-5 py-2.5 bg-gray-100/80 hover:bg-gray-200/80 rounded-xl text-gray-700 text-sm font-medium tracking-wide transition-all duration-200"
                        >
                          BACK
                        </button>
                        <button
                          onClick={confirmReschedule}
                          disabled={isSubmitting}
                          className="px-5 py-2.5 bg-green-700 hover:bg-green-800 text-white rounded-xl text-sm font-medium tracking-wide transition-all duration-200 shadow-sm disabled:opacity-50"
                        >
                          {isSubmitting ? "PROCESSING..." : "CONFIRM"}
                        </button>
                      </div>
                    </div>
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