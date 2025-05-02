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
  // Initialize date with local time (without time component)
  const [date, setDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  });
  const [hospital, setHospital] = useState("");
  const [selectedHospitalName, setSelectedHospitalName] = useState("");
  const [time, setTime] = useState("");
  const [availableHospitals, setAvailableHospitals] = useState([]);
  const [availabilityData, setAvailabilityData] = useState([]);
  const [availableTimes, setAvailableTimes] = useState({ start: "", end: "" });
  const [timeSlots, setTimeSlots] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    date: "",
    time: "",
    hospital: "",
    api: "",
  });
  const [successMessage, setSuccessMessage] = useState("");

  const convertTo24Hour = (time) => {
    const date = new Date(`1970-01-01T${time}`);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // Fetch hospitals and availability when date changes
  useEffect(() => {
    if (!isOpen) return;

    if (date && doctorId) {
      // Prevent selecting past dates (using local date comparison)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date < today) {
        setErrors((prev) => ({ ...prev, date: "Please select a future date" }));
        setDate(new Date(today));
        return;
      }

      // Format date correctly for API (YYYY-MM-DD) without timezone issues
      const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

      // Reset errors and selections
      setErrors({ date: "", time: "", hospital: "", api: "" });
      setHospital("");
      setSelectedHospitalName("");
      setTime("");
      setAvailableTimes({ start: "", end: "" });
      setTimeSlots([]);

      // Fetch hospitals
      axiosInstance
        .get(
          `/Appointments/available-hospitals?doctorId=${doctorId}&date=${formattedDate}`
        )
        .then((response) => {
          // More robust handling of different response structures
          let hospitalsData = [];

          if (Array.isArray(response.data)) {
            hospitalsData = response.data;
          } else if (
            response.data?.hospitals &&
            Array.isArray(response.data.hospitals)
          ) {
            hospitalsData = response.data.hospitals;
          } else if (
            typeof response.data === "object" &&
            response.data !== null
          ) {
            // Handle case where hospitals are properties of the object
            hospitalsData = Object.values(response.data);
          }

          // More flexible mapping to handle different structures
          const normalizedHospitals = hospitalsData
            .map((hospital) => {
              // Try different possible property names for hospital ID and name
              const hospitalId =
                hospital.hospitalId ||
                hospital.id ||
                hospital.hospital?.hospitalId ||
                hospital.hospital?.id;

              const hospitalName =
                hospital.hospitalName ||
                hospital.name ||
                hospital.hospital?.hospitalName ||
                hospital.hospital?.name ||
                `Hospital ${hospitalId}`;

              return {
                hospitalId,
                hospitalName,
              };
            })
            .filter((h) => h.hospitalId && h.hospitalName); // Only filter if both are missing

          console.log("Available hospitals:", normalizedHospitals); // Debug log
          setAvailableHospitals(normalizedHospitals);

          if (normalizedHospitals.length === 0) {
            setErrors((prev) => ({
              ...prev,
              api: "No hospitals available for the selected date.",
            }));
          }
        })
        .catch((error) => {
          console.error("Error fetching hospitals:", error);
          setErrors((prev) => ({
            ...prev,
            api: "Failed to load hospitals. Please try again.",
          }));
        });

      // Fetch availability
      axiosInstance
        .get(`/Appointments/availability/${formattedDate}?doctorId=${doctorId}`)
        .then((response) => {
          setAvailabilityData(
            Array.isArray(response.data) ? response.data : []
          );
        })
        .catch((error) => {
          if (error.response?.status === 404) {
            setAvailabilityData([]);
          } else {
            console.error("Error fetching availability:", error);
            setErrors((prev) => ({
              ...prev,
              api: "Failed to load availability. Please try again.",
            }));
          }
        });
    }
  }, [date, doctorId, isOpen]);

  // Update available times when hospital is selected
  useEffect(() => {
    if (hospital && availabilityData.length > 0) {
      const selectedAvailability = availabilityData.find(
        (a) => a.hospitalId === hospital
      );

      if (selectedAvailability) {
        const { availableStartTime, availableEndTime } = selectedAvailability;
        setAvailableTimes({
          start: availableStartTime,
          end: availableEndTime,
        });
        setTimeSlots(generateTimeSlots(availableStartTime, availableEndTime));
      } else {
        setAvailableTimes({ start: "", end: "" });
        setTimeSlots([]);
      }
    }
  }, [hospital, availabilityData]);

  // Handle date selection
  const handleDateSelect = (selectedDate) => {
    if (!selectedDate) return;
    
    // Create a new date without time component to avoid timezone issues
    const localDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    );
    
    setDate(localDate);
    setErrors((prev) => ({ ...prev, date: "" }));
  };


  // Handle hospital selection change
  const handleHospitalChange = (e) => {
    const selectedId = e.target.value;
    setHospital(selectedId);

    // Find and set the hospital name
    const selectedHospital = availableHospitals.find(
      (h) => h.hospitalId === selectedId
    );
    setSelectedHospitalName(selectedHospital?.hospitalName || "");
    setErrors((prev) => ({ ...prev, hospital: "" }));
  };

  const generateTimeSlots = (startTime12h, endTime12h) => {
    if (!startTime12h || !endTime12h) return [];

    const startTime = convertTo24Hour(startTime12h);
    const endTime = convertTo24Hour(endTime12h);

    const slots = [];
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    let currentHour = startHour;
    let currentMinute = startMinute;

    while (
      currentHour < endHour ||
      (currentHour === endHour && currentMinute < endMinute)
    ) {
      const timeString = `${currentHour
        .toString()
        .padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}`;
      slots.push(timeString);

      currentMinute += 30;
      if (currentMinute >= 60) {
        currentHour += 1;
        currentMinute -= 60;
      }
    }

    return slots;
  };

  const handleSubmit = async () => {
    setErrors({ date: "", time: "", hospital: "", api: "" });
    setSuccessMessage("");

    let newErrors = {};

    // Individual field validations
    if (!date) newErrors.date = "Please select a date.";
    if (!time) newErrors.time = "Please select a time.";
    if (!hospital) newErrors.hospital = "Please select a hospital.";

    if (Object.keys(newErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...newErrors }));
      return;
    }

    setIsSubmitting(true);

    try {
      const formattedDate = date.toISOString().split("T")[0];
      const formattedTime = time.includes(":")
        ? time
        : `${time.slice(0, 2)}:${time.slice(2)}`;
      const fullTime = `${formattedTime}:00`;

      const rescheduleData = {
        doctorId,
        hospitalId: hospital,
        hospitalName: selectedHospitalName,
        date: formattedDate,
        time: fullTime,
      };

      const response = await axiosInstance.post(
        "/Appointments/reschedule",
        rescheduleData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.success) {
        if (response.data.rescheduledCount === 0) {
          setErrors((prev) => ({
            ...prev,
            api:
              response.data.message ||
              "No appointments found to reschedule. Please ensure you have an existing appointment with this doctor.",
          }));
        } else {
          setSuccessMessage(
            response.data.message ||
              `Successfully rescheduled ${response.data.rescheduledCount} appointment(s).`
          );
          setTimeout(() => onClose(true), 1500); // Close after showing success
        }
      } else {
        setErrors((prev) => ({
          ...prev,
          api: response.data.message || "Failed to reschedule appointment.",
        }));
      }
    } catch (error) {
      const errorData = error.response?.data;
      let errorMsg = "Something went wrong while rescheduling.";

      if (
        error.response?.status === 400 &&
        errorData?.errorType === "ValidationError"
      ) {
        errorMsg = `Validation error: ${errorData.message}`;
      } else if (error.response?.status === 500) {
        errorMsg =
          errorData?.message || "Server error. Please try again later.";
      } else if (error.message === "Network Error") {
        errorMsg = "Network issue. Please check your internet connection.";
      }

      setErrors((prev) => ({ ...prev, api: errorMsg }));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#ffffffc0] z-50 flex justify-center items-center">
      <div className="p-1 bg-[#E9FAF2] rounded-[20px] shadow-2xl w-[90%] max-w-3xl">
        <div className="p-8 relative border-2 border-dashed border-black rounded-[20px]">
          <h2 className="text-lg font-bold mb-4 text-[#094A4D]">
            Reschedule Appointment
          </h2>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full cursor-pointer"
            disabled={isSubmitting}
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>

          {/* Error/Success Messages */}
          {errors.api && (
            <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
              <p>{errors.api}</p>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 border-l-4 border-green-500 text-green-700 rounded">
              <p>{successMessage}</p>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <label className="block mb-2 text-[#094A4D]">Select Date:</label>
              <DayPicker
                selected={date}
                onSelect={handleDateSelect} // Use the new handler
                className="mb-4"
                mode="single"
                disabled={isSubmitting}
                required
                fromDate={new Date()} // This will use local time
                modifiers={{
                  disabled: [{ before: new Date() }],
                }}
              />
              {errors.date && (
                <p className="text-red-500 text-sm">{errors.date}</p>
              )}
            </div>

            <div className="flex-1">
              <div className="mb-4">
                <label className="block mb-2 text-[#094A4D]">
                  Select Hospital:
                </label>
                <select
                  className={`w-full border p-2 rounded-[12px] cursor-pointer ${
                    errors.hospital ? "border-red-500" : ""
                  }`}
                  value={hospital}
                  onChange={handleHospitalChange}
                  disabled={!availableHospitals.length || isSubmitting}
                >
                  <option value="">Select Hospital</option>
                  {availableHospitals.length > 0 ? (
                    availableHospitals.map((hospital) => (
                      <option
                        key={hospital.hospitalId}
                        value={hospital.hospitalId}
                      >
                        {hospital.hospitalName}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No hospitals available for selected date
                    </option>
                  )}
                </select>
                {errors.hospital && (
                  <p className="text-red-500 text-sm mt-1">{errors.hospital}</p>
                )}
              </div>
              {availableTimes.start && (
                <p className="text-sm text-gray-600 mb-5">
                  Available between: {convertTo24Hour(availableTimes.start)} and{" "}
                  {convertTo24Hour(availableTimes.end)}
                </p>
              )}
              <div className="mb-4">
                <label className="block mb-2 text-[#094A4D]">
                  Select Time:
                </label>
                <select
                  className={`w-full border p-2 rounded-[12px] cursor-pointer ${
                    errors.time ? "border-red-500" : ""
                  }`}
                  value={time}
                  onChange={(e) => {
                    setTime(e.target.value);
                    setErrors((prev) => ({ ...prev, time: "" }));
                  }}
                  disabled={!hospital || !timeSlots.length || isSubmitting}
                >
                  <option value="">Select Time</option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
                {errors.time && (
                  <p className="text-red-500 text-sm mt-1">{errors.time}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 rounded-[12px] bg-[#094A4D] text-white hover:bg-[#072f30] disabled:opacity-50 flex items-center cursor-pointer"
              disabled={isSubmitting}
            >
              Confirm Reschedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
