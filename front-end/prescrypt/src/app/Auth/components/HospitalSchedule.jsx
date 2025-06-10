"use client";
import React from "react";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { ChevronDown, Search, Plus, Trash2 } from "lucide-react";
import { Button } from "@mui/material";

export default function HospitalScheduleForm({
  formData,
  setFormData,
  currentSchedule,
  setCurrentSchedule,
  errors,
  setErrors,
}) {
  const [hospitals, setHospitals] = useState([]);
  const [showHospitalDropdown, setShowHospitalDropdown] = useState(false);
  const [hospitalSearchTerm, setHospitalSearchTerm] = useState("");
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i % 12 || 12;
    const ampm = i < 12 ? "AM" : "PM";
    return [`${hour}:00 ${ampm}`, `${hour}:30 ${ampm}`];
  }).flat();

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await fetch("https://localhost:7021/api/User/GetAllHospitals");
        if (!response.ok) throw new Error("Failed to fetch hospitals");
        const data = await response.json();
        setHospitals(data);
      } catch (error) {
        console.error("Error fetching hospitals:", error);
      }
    };
    fetchHospitals();
  }, []);

  const filteredHospitals = hospitals.filter(
    (h) =>
      h.hospitalName.toLowerCase().includes(hospitalSearchTerm.toLowerCase()) ||
      h.city.toLowerCase().includes(hospitalSearchTerm.toLowerCase())
  );

  const handleDayAvailability = (day, isSelected) => {
    setCurrentSchedule((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: isSelected ? { startTime: "", endTime: "" } : undefined,
      },
    }));
  };

  const updateDayTimeSlot = (day, field, value) => {
    setCurrentSchedule((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability[day],
          [field]: value,
        },
      },
    }));
  };

  const addHospitalSchedule = () => {
    const newErrors = {};
    if (!currentSchedule.hospitalId) newErrors.hospitalSchedule = "Hospital is required";

    const hasValidAvailability = Object.values(currentSchedule.availability).some(
      (times) => times?.startTime && times?.endTime
    );

    if (!hasValidAvailability) {
      newErrors.hospitalSchedule = "At least one availability slot required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newSchedule = {
      hospitalId: currentSchedule.hospitalId,
      hospitalName: currentSchedule.hospital,
      availability: Object.fromEntries(
        Object.entries(currentSchedule.availability)
          .filter(([_, times]) => times?.startTime && times?.endTime)
          .map(([day, times]) => [
            day,
            {
              startTime: times.startTime,
              endTime: times.endTime,
            },
          ])
      ),
    };

    setFormData((prev) => ({
      ...prev,
      hospitalSchedules: [...prev.hospitalSchedules, newSchedule],
    }));

    setCurrentSchedule({
      hospital: "",
      hospitalId: "",
      availability: {},
    });
    setErrors((prev) => ({ ...prev, hospitalSchedule: "" }));
  };

  const removeHospitalSchedule = (index) => {
    setFormData((prev) => ({
      ...prev,
      hospitalSchedules: prev.hospitalSchedules.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="flex-1">
      <h3 className="text-lg font-semibold text-gray-800 mb-5">
        Hospital Schedules
      </h3>
      <div className="mb-6">
        <div className="relative mb-6">
          <button
            className={`w-full p-3 border rounded-lg bg-white text-left text-sm flex justify-between items-center ${
              !currentSchedule.hospital ? "border-red-500" : "border-gray-300"
            }`}
            onClick={() => {
              setShowHospitalDropdown(!showHospitalDropdown);
              setHospitalSearchTerm("");
            }}
          >
            {currentSchedule.hospital || "Select Hospital"}
            <ChevronDown size={18} className="text-gray-600" />
          </button>
          {showHospitalDropdown && (
            <div className="absolute w-full max-h-64 overflow-y-auto bg-white border border-gray-300 rounded-lg mt-1 z-10 shadow-lg">
              <div className="p-2 border-b border-gray-200">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search hospitals..."
                    value={hospitalSearchTerm}
                    onChange={(e) => setHospitalSearchTerm(e.target.value)}
                    className="w-full p-2 border rounded text-sm"
                    autoFocus
                  />
                  <Search
                    size={16}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                  />
                </div>
              </div>
              <div className="max-h-48 overflow-y-auto">
                {filteredHospitals.length > 0 ? (
                  filteredHospitals.map((hospital) => (
                    <div
                      key={hospital.hospitalId}
                      className="p-3 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => {
                        setCurrentSchedule({
                          ...currentSchedule,
                          hospital: hospital.hospitalName,
                          hospitalId: hospital.hospitalId,
                        });
                        setShowHospitalDropdown(false);
                      }}
                    >
                      <div>{hospital.hospitalName}</div>
                      <div className="text-gray-600">{hospital.city}</div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-sm">
                    No hospitals found matching "{hospitalSearchTerm}"
                  </div>
                )}
              </div>
            </div>
          )}
          {!currentSchedule.hospital && errors.hospitalSchedule && (
            <p className="text-red-500 text-xs mt-1">{errors.hospitalSchedule}</p>
          )}
        </div>
        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 shadow-sm mb-6">
          <h4 className="text-base font-semibold text-gray-800 mb-4 flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-200 mr-2"></span>
            Availability
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {daysOfWeek.map((day) => (
              <div
                key={day}
                className="p-2 bg-white rounded-lg border border-gray-200 hover:border-teal-200 hover:shadow-sm transition-all"
              >
                <label className="flex items-center gap-3 cursor-pointer text-sm font-medium text-gray-600">
                  <input
                    type="checkbox"
                    checked={!!currentSchedule.availability[day]}
                    onChange={(e) => handleDayAvailability(day, e.target.checked)}
                    className="w-4 h-4 accent-green-800 rounded"
                  />
                  <span>{day}</span>
                </label>
                {currentSchedule.availability[day] && (
                  <div className="mt-1 ml-0 flex flex-col gap-1 p-0 bg-white rounded">
                    <div>
                      <label className="text-xs font-medium text-gray-300 block mb-2">
                        Start Time
                      </label>
                      <select
                        value={currentSchedule.availability[day].startTime}
                        onChange={(e) =>
                          updateDayTimeSlot(day, "startTime", e.target.value)
                        }
                        className="w-full p-2 border rounded text-sm bg-white text-gray-800 focus:outline-none focus:border-teal-200 focus:ring-2 focus:ring-teal-100"
                      >
                        <option value="">Select Start Time</option>
                        {timeOptions.map((time) => (
                          <option key={`${day}-start-${time}`} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-300 block mb-1">
                        End Time
                      </label>
                      <select
                        value={currentSchedule.availability[day].endTime}
                        onChange={(e) =>
                          updateDayTimeSlot(day, "endTime", e.target.value)
                        }
                        className="w-full p-2 border rounded text-sm bg-white text-gray-800 focus:outline-none focus:border-teal-200 focus:ring-2 focus:ring-teal-100"
                      >
                        <option value="">Select End Time</option>
                        {timeOptions.map((time) => (
                          <option key={`${day}-end-${time}`} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#14b8a6",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#0d9488",
            },
          }}
          startIcon={<Plus size={16} />}
          fullWidth
          onClick={addHospitalSchedule}
          className="mt-6"
        >
          Add Hospital Schedule
        </Button>
        {errors.hospitalSchedule && (
          <p className="text-red-500 text-xs mt-2">{errors.hospitalSchedule}</p>
        )}
      </div>
      <div className="flex flex-col gap-4">
        {formData.hospitalSchedules.map((schedule, index) => {
          const hospital = hospitals.find((h) => h.hospitalId === schedule.hospitalId);
          return (
            <div
              key={index}
              className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-100">
                <h4 className="text-base font-semibold text-gray-800">
                  {hospital
                    ? `${hospital.hospitalName}, ${hospital.city}`
                    : schedule.hospitalId}
                </h4>
                <button
                  className="text-red-500 hover:bg-red-50 p-1 rounded"
                  onClick={() => removeHospitalSchedule(index)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {Object.entries(schedule.availability).map(([day, times]) => (
                  <div
                    key={day}
                    className="p-3 bg-gray-50 rounded border border-gray-200 text-sm flex items-center gap-3"
                  >
                    <strong className="text-green-800 font-semibold min-w-[80px]">
                      {day}:
                    </strong>{" "}
                    {times.startTime} - {times.endTime}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
