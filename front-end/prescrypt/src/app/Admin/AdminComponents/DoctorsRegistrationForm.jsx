"use client";
import { useState, useEffect } from "react";
import { AddNewDoctor } from "../service/AdminService";

export default function DoctorRegistrationForm() {
  const [schedule, setSchedule] = useState([]);
  const [newDoctor, setNewDoctor] = useState({
    firstName: "",
    lastName: "",
    email: "",
    specialization: "",
    slmcLicense: "",
    contactNumber: "",
    hospital: [],
  });
  const [availableData, setAvailableData] = useState({
    availability: [],
    startTime: "",
    endTime: "",
  });

  //set hospital
  const Hospitals = [
    "Asiri Hospital",
    "Nawaloka Hospital",
    "Lanka Hospital",
    "Hemas",
  ];
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  //date and time
  const [dateTime, setDateTime] = useState(null);
  //set error message
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewDoctor({ ...newDoctor, [name]: value });
  };

  // checkbox selection
  const handleCheckboxChange = (day) => {
    setAvailableData((prev) => ({
      ...prev,
      availability: prev.availability.includes(day)
        ? prev.availability.filter((d) => d !== day)
        : [...prev.availability, day],
    }));
  };
  //set available data
  const handleTime = (e) => {
    const { name, value } = e.target;
    setAvailableData({ ...availableData, [name]: value });
    console.log(availableData);
  };

  // const handleChangeDropdown = (e) => {
  //   setAvailableData((prev) => ({
  //     ...prev,
  //     timeSlot: e.target.value,
  //   }));
  // };

  //add available table
  const handleAddTime = () => {
    if (
      availableData.availability.length > 0 &&
      availableData.startTime &&
      availableData.endTime
    ) {
      const newSchedule = availableData.availability.map((day) => ({
        day,
        startTime: availableData.startTime,
        endTime: availableData.endTime,
      }));

      // Check if start time is before end time
      if (newSchedule.some((item) => item.startTime >= item.endTime)) {
        setErrorMessage("Start time must be before end time.");
        return;
      }

      const isDuplicate = newSchedule.some((newItem) =>
        schedule.some(
          (existing) =>
            existing.day === newItem.day ||
            existing.startTime === newItem.startTime ||
            existing.endTime === newItem.endTime
        )
      );

      if (!isDuplicate) {
        setSchedule((prev) => [...prev, ...newSchedule]);
        setAvailableData({ availability: [], startTime: "", endTime: "" });
        setErrorMessage("");
        console.log(schedule);
      } else {
        setErrorMessage(
          "Selected time slot already exists.please check again!"
        );
      }
    }

    // if (availableData.availability.length > 0 && availableData.timeSlot) {
    //   const newSchedule = availableData.availability.map((day) => ({
    //     day,
    //     time: availableData.timeSlot,
    //   }));
    //   setSchedule([...schedule, ...newSchedule]);
    //   setAvailableData({ availability: [], timeSlot: "" }); // Reset selection
    //   setErrorMessage("");
    //   console.log(schedule);
    // }
  };

  // Remove a time slot from the table
  const handleRemoveSlot = (index) => {
    setSchedule(schedule.filter((_, i) => i !== index));
    console.log(schedule);
  };

  //handle hospital input
  const handleHospitalInputChange = (e) => {
    const value = e.target.value;
    setInput(value);

    if (value.trim() === "") {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Filter hospitals (avoid duplicates)
    const filtered = Hospitals.filter(
      (hospital) =>
        hospital.toLowerCase().includes(value.toLowerCase()) &&
        !newDoctor.hospital.includes(hospital)
    );

    setSuggestions(filtered.length > 0 ? filtered : [`Use "${value}"`]);
    setShowSuggestions(true);
  };

  // Handle selecting a hospital
  const handleSelectHospital = (value) => {
    const hospitalName = value.replace('Use "', "").replace('"', "");

    setNewDoctor((prev) => ({
      ...prev,
      hospital: [...prev.hospital, hospitalName],
    }));

    setInput("");
    setShowSuggestions(false);
  };

  // Handle removing a selected hospital
  const removeHospital = (hospital) => {
    setNewDoctor((prev) => ({
      ...prev,
      hospital: prev.hospital.filter((h) => h !== hospital),
    }));
  };

  //form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (schedule.length > 0) {
      e.preventDefault();
      console.log("Form Data Submitted:", newDoctor, schedule);
      setAvailableData({
        availability: [],
        timeSlot: "",
      });

      setNewDoctor({
        firstName: "",
        lastName: "",
        email: "",
        specialization: "",
        slmcLicense: "",
        contactNumber: "",
        hospital: [],
      });

      //send new doctor details into backend
      try {
        const newDoctorDetails = await AddNewDoctor(newDoctor, schedule);
        console.log(newDoctorDetails);
        alert("Doctor Registered Successfully!");
      } catch (err) {
        console.error("Failed to add the doctor", err);
        
      alert("only Doctor form submit!",err);
      }

      setSchedule([]);

      setErrorMessage("");
    } else {
      console.log("time slots empty");
      setErrorMessage("Please select available time");
    }
  };

  useEffect(() => {
    const updateDateTime = () => setDateTime(new Date());
    updateDateTime(); // Set initial time
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // set date and time
  if (!dateTime) return null;

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

  return (
    <div className="p-6 ml-15 bg-white rounded-lg shadow-md">
      {/* Title */}
      <h1 className="text-2xl font-bold mb-2">Doctor Registration</h1>
      <p className="text-[#09424D] text-sm">{formattedDate}</p>
      <div className="mt-10 bg-[#E9FAF2] p-6 rounded-lg shadow-md w-[100%]">
        <form onSubmit={handleSubmit}>
          {/* Text Inputs */}
          <div className="grid grid-cols-2 gap-10">
            <div>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={newDoctor.firstName}
                onChange={handleChange}
                className="w-full max-w-5xl p-2 bg-white border-1 border-gray-300 rounded-md
          focus:outline-none focus:ring-2 focus:ring-[#CEE4E6] mt-2"
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={newDoctor.lastName}
                onChange={handleChange}
                className="w-full max-w-5xl p-2 bg-white border-1 border-gray-300 rounded-md
          focus:outline-none focus:ring-2 focus:ring-[#CEE4E6] mt-5"
                required
              />
              <input
                type="text"
                name="specialization"
                placeholder="Specialization"
                value={newDoctor.specialization}
                onChange={handleChange}
                className="w-full max-w-5xl p-2 bg-white border-1 border-gray-300 rounded-md
          focus:outline-none focus:ring-2 focus:ring-[#CEE4E6] mt-5"
                required
              />
              <input
                type="text"
                name="slmcLicense"
                placeholder="SLMC License Number"
                value={newDoctor.slmcLicense}
                onChange={handleChange}
                className="w-full max-w-5xl p-2 bg-white border-1 border-gray-300 rounded-md
          focus:outline-none focus:ring-2 focus:ring-[#CEE4E6] mt-5"
                required
              />
              <input
                type="text"
                name="contactNumber"
                placeholder="Contact Number"
                value={newDoctor.contactNumber}
                onChange={handleChange}
                className="w-full max-w-5xl p-2 bg-white border-1 border-gray-300 rounded-md
          focus:outline-none focus:ring-2 focus:ring-[#CEE4E6] mt-5"
                required
              />
              {/* <input
                type="text"
                name="hospital"
                placeholder="Hospital"
                value={newDoctor.hospital}
                onChange={handleChange}
                className="w-full max-w-5xl p-2 bg-white border-1 border-gray-300 rounded-md
          focus:outline-none focus:ring-2 focus:ring-[#CEE4E6] mt-5"
                required
              /> */}

              <div className="mb-4">
              <div className="w-full max-w-5xl p-2 bg-white border-1 border-gray-300 rounded-md
          focus:outline-none focus:ring-2 focus:ring-[#CEE4E6] mt-5">
                 {/* Display Selected Hospitals */}
                  <div className="flex flex-wrap">
                    {newDoctor.hospital.map((hospital, index) => (
                      <div
                        key={index}
                        className="bg-[#E9FAF2] text-[#09424D] px-2 py-1 rounded-md flex items-center m-1"
                      >
                        {hospital}
                        <span
                          className="ml-2 cursor-pointer text-red-400 font-bold"
                          onClick={() => removeHospital(hospital)}
                        >
                          ✕
                        </span>
                      </div>
                    ))}

                    {/* Input Field */}
                    <input
                      type="text"
                      placeholder="Type hospital name..."
                      value={input}
                      onChange={handleHospitalInputChange}
                      className="border-none outline-none flex-1"
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() =>
                        setTimeout(() => setShowSuggestions(false), 200)
                      } // Delay to allow clicks
                    />
                  </div>
                  </div>

                {/* Dropdown Suggestions */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute bg-white border mt-1 shadow-lg rounded-md w-full max-w-5xl">
                    {suggestions.map((hospital, index) => (
                      <div
                        key={index}
                        className="p-2 hover:bg-gray-200 cursor-pointer"
                        onClick={() => handleSelectHospital(hospital)}
                      >
                        {hospital}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div>
              {/* Availability Checkboxes */}

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={newDoctor.email}
                onChange={handleChange}
                className="w-full max-w-5xl p-2 bg-white border-1 border-gray-300 rounded-md
          focus:outline-none focus:ring-2 focus:ring-[#CEE4E6] mt-2"
                required
              />

              {/* checkboxes */}
              <label className="block font-semibold mb-2 mt-2">
                Availability:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ].map((day) => (
                  <label
                    key={day}
                    className="flex items-center space-x-3 py-1 px-3"
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-5 bg-[#007e8556] cursor-pointer"
                      checked={availableData.availability.includes(day)}
                      onChange={() => handleCheckboxChange(day)}
                    />
                    <span className="font-small text-[#5E6767]">{day}</span>
                  </label>
                ))}
              </div>

              {/* Select Time Dropdown */}
              {/* <select
                name="timeSlot"
                value={availableData.timeSlot}
                onChange={handleChangeDropdown}
                className="w-full max-w-5xl p-2 bg-white border-1 border-gray-300 rounded-md
          focus:outline-none focus:ring-2 focus:ring-[#CEE4E6] mt-3"
              >
                <option value="">Select Time</option>
                <option value="4:00 PM - 6:00 PM">4:00 PM - 6:00 PM</option>
                <option value="6:00 PM - 8:00 PM">6:00 PM - 8:00 PM</option>
              </select> */}

              {/* give custom Time */}
              <div className="flex gap-5">
                <input
                  type="time"
                  name="startTime"
                  placeholder="startTime"
                  value={availableData.startTime}
                  onChange={handleTime}
                  className="w-full max-w-5xl p-2 bg-white border-1 border-gray-300 rounded-md
          focus:outline-none focus:ring-2 focus:ring-[#CEE4E6] mt-2"
                />
                <input
                  type="time"
                  name="endTime"
                  placeholder="endTime"
                  value={availableData.endTime}
                  onChange={handleTime}
                  className="w-full max-w-5xl p-2 bg-white border-1 border-gray-300 rounded-md
          focus:outline-none focus:ring-2 focus:ring-[#CEE4E6] mt-2"
                />
              </div>

              <div className="mt-5 w-[100%]">
                <button
                  type="button"
                  onClick={handleAddTime}
                  className=" bg-[#007e8556] text-[#006369] p-2 w-[100%] rounded-lg hover:bg-[#007e8589] cursor-pointer"
                >
                  Add Time
                </button>
              </div>
            </div>
          </div>
          <h3 className="font-semibold mb-2 mt-4">Selected Time Slots:</h3>

          <div className="rounded-xl">
            <table className="w-full mt-5 border border-gray-200 rounded-xl">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">Day</th>
                  <th className="p-2">Start Time</th>
                  <th className="p-2">End Time</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((slot, index) => (
                  <tr
                    key={index}
                    className={`border-t ${
                      index % 2 === 0 ? "bg-[#E9FAF2]" : "bg-[#ffffff]"
                    }`}
                  >
                    <td className="p-2 text-center">{slot.day}</td>
                    <td className="p-2 text-center">{slot.startTime}</td>
                    <td className="p-2 text-center">{slot.endTime}</td>
                    <td className="p-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveSlot(index)}
                        className="text-red-500 cursor-pointer hover:underline"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Submit Button */}
          <div className="mt-5 w-[100%]">
            <p className="text-red-500 font-bold text-center mb-5">
              {errorMessage}
            </p>
            <button
              type="submit"
              className=" bg-[#007e8556] text-[#006369] p-2 w-[100%] rounded-lg hover:bg-[#007e8589] cursor-pointer"
            >
              Register
            </button>
          </div>
        </form>
      </div>
      <div className="mt-6 text-gray-500 text-right">
        <p>{formattedDate}</p>
        <p>{formattedTime}</p>
      </div>
    </div>
  );
}
