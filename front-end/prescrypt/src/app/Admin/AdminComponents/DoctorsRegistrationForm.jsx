"use client";
import { useState, useEffect } from "react";
import { AddNewDoctor, GetHospitals } from "../service/AdminDoctorService";
import { Spinner } from "@material-tailwind/react";

export default function DoctorRegistrationForm() {
  const [schedule, setSchedule] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    FirstName: "",
    LastName: "",
    Email: "",
    specialization: "",
    SlmcLicense: "",
    ContactNumber: "",
    NIC: "",
    Gender: "",
    Description: "",
    Charge: 0.00,
  });
  const [availableData, setAvailableData] = useState({
    availability: [],
    startTime: "",
    endTime: "",
    HospitalId: "",
    HospitalName: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState(" ");
  const [hospitalsData, setHospitalsData] = useState([]);
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  //date and time
  const [dateTime, setDateTime] = useState(null);
  //set error message
  const [errorMessage, setErrorMessage] = useState(" ");
  const [timeErrorMessage, setTimeErrorMessage] = useState(" ");

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
  //handle gender
  const handleGenderChange = (event) => {
    setNewDoctor((prevDoctor) => ({
      ...prevDoctor,
      Gender: event.target.value,
    }));
  };

  //set available data
  const handleTime = (e) => {
    const { name, value } = e.target;
    setAvailableData({ ...availableData, [name]: value });
  };

  //add available table
  const handleAddTime = () => {
    if (
      availableData.availability.length > 0 &&
      availableData.startTime &&
      availableData.endTime &&
      availableData.HospitalId &&
      availableData.HospitalName
    ) {
      const newSchedule = availableData.availability.map((day) => ({
        day,
        startTime: availableData.startTime,
        endTime: availableData.endTime,
        HospitalId: availableData.HospitalId,
        HospitalName: availableData.HospitalName,
      }));

      // Check if start time is before end time
      if (newSchedule.some((item) => item.startTime >= item.endTime)) {
        setTimeErrorMessage("Start time must be before end time.");
        return;
      }

      const isDuplicate = newSchedule.some((newItem) =>
        schedule.some(
          (existing) =>
            existing.day === newItem.day &&
            existing.startTime === newItem.startTime &&
            existing.endTime === newItem.endTime &&
            existing.HospitalId === newItem.HospitalId
        )
      );

      if (!isDuplicate) {
        setSchedule((prev) => [...prev, ...newSchedule]);
        setAvailableData({
          availability: [],
          startTime: "",
          endTime: "",
          HospitalId: "",
          HospitalName: "",
        });
        setErrorMessage("");
      } else {
        setTimeErrorMessage(
          "Selected time slot already exists. Please check again!"
        );
      }
    }
  };

  // Remove a time slot from the table
  const handleRemoveSlot = (index) => {
    setSchedule(schedule.filter((_, i) => i !== index));
  };

  // Handle hospital input
  const handleHospitalInputChange = (e) => {
    const value = e.target.value;
    setInput(value);

    if (value.trim() === "") {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Filter hospitals (avoid duplicates)
    const filtered = hospitalsData.filter(
      (hospital) =>
        hospital.hospitalName.toLowerCase().includes(value.toLowerCase()) &&
        availableData.HospitalName !== hospital.hospitalName // Prevent duplicate selection
    );

    setSuggestions(filtered.length > 0 ? filtered : [`Use "${value}"`]);
    setShowSuggestions(true);
  };

  // Handle selecting a hospital
  const handleSelectHospital = (value, Id) => {
    const hospitalName = value.replace('Use "', "").replace('"', "");
    setAvailableData((prev) => ({
      ...prev,
      HospitalName: hospitalName,
      HospitalId: Id,
    }));
    setInput("");
    setShowSuggestions(false);
  };

  //form submit
  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    if (schedule.length > 0) {
      e.preventDefault();
      console.log("Form Data Submitted:", newDoctor, schedule);
      setAvailableData({
        availability: [],
        startTime: "",
        endTime: "",
        HospitalId: "",
        HospitalName: "",
      });

      setNewDoctor({
        FirstName: "",
        LastName: "",
        Email: "",
        specialization: "",
        SlmcLicense: "",
        ContactNumber: "",
        Gender: "",
        NIC: "",
        Description: "",
        Charge: 0.00,
      });

      //send new doctor details into backend
      console.log("Before sending Data --->", newDoctor, schedule);
      try {
        const newDoctorDetails = await AddNewDoctor(newDoctor, schedule);
        console.log(newDoctorDetails);
      } catch (err) {
        setIsLoading(false);
        console.error("Failed to add the doctor", err);
        alert("Failed to add the doctor!", err);
      }
      setSchedule([]);
      setErrorMessage("");
      setIsSubmitted(true);
      setSuccessMessage("Doctor Registered Successfully!");
      setIsLoading(false);
    } else {
      setIsLoading(false);
      console.log("time slots empty");
      setErrorMessage("Please select available time");
      
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const loadData = async () => {
      //get all hospitals
      const HospitalDetails = await GetHospitals();
      console.log(HospitalDetails);
      setHospitalsData(HospitalDetails); // Set doctor data as an array

      const updateDateTime = () => setDateTime(new Date());
      updateDateTime(); // Set initial time
      const interval = setInterval(updateDateTime, 1000);
      return () => clearInterval(interval);
    };
    loadData();
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
      {!isSubmitted ? (
      <div className="mt-10 bg-[#E9FAF2] p-6 rounded-lg shadow-md w-[100%]">
        <form onSubmit={handleSubmit}>
          {/* Text Inputs */}
          <div className="grid grid-cols-2 gap-10">
            <div>
              <input
                type="text"
                name="FirstName"
                placeholder="First Name"
                value={newDoctor.FirstName}
                onChange={handleChange}
                className="w-full max-w-5xl p-2 bg-white border-1 border-gray-300 rounded-md
          focus:outline-none focus:ring-2 focus:ring-[#CEE4E6] mt-2"
                required
              />
              <input
                type="text"
                name="LastName"
                placeholder="Last Name"
                value={newDoctor.LastName}
                onChange={handleChange}
                className="w-full max-w-5xl p-2 bg-white border-1 border-gray-300 rounded-md
          focus:outline-none focus:ring-2 focus:ring-[#CEE4E6] mt-6"
                required
              />
              <input
                type="text"
                name="specialization"
                placeholder="Specialization"
                value={newDoctor.specialization}
                onChange={handleChange}
                className="w-full max-w-5xl p-2 bg-white border-1 border-gray-300 rounded-md
          focus:outline-none focus:ring-2 focus:ring-[#CEE4E6] mt-6"
                required
              />
              <input
                type="text"
                name="SlmcLicense"
                placeholder="SLMC License Number"
                value={newDoctor.SlmcLicense}
                onChange={handleChange}
                className="w-full max-w-5xl p-2 bg-white border-1 border-gray-300 rounded-md
          focus:outline-none focus:ring-2 focus:ring-[#CEE4E6] mt-6"
                required
              />
              <input
                type="text"
                name="NIC"
                placeholder="NIC"
                value={newDoctor.NIC}
                onChange={handleChange}
                className="w-full max-w-5xl p-2 bg-white border-1 border-gray-300 rounded-md
          focus:outline-none focus:ring-2 focus:ring-[#CEE4E6] mt-6"
                required
              />
              <input
                type="text"
                name="ContactNumber"
                placeholder="Contact Number"
                value={newDoctor.ContactNumber}
                onChange={handleChange}
                className="w-full max-w-5xl p-2 bg-white border-1 border-gray-300 rounded-md
          focus:outline-none focus:ring-2 focus:ring-[#CEE4E6] mt-6"
                required
              />
              <input
                type="email"
                name="Email"
                placeholder="Email"
                value={newDoctor.Email}
                onChange={handleChange}
                className="w-full max-w-5xl p-2 bg-white border-1 border-gray-300 rounded-md
          focus:outline-none focus:ring-2 focus:ring-[#CEE4E6] mt-6"
                required
              />
            </div>
            <div>
            <input
                  type="text"
                  name="Charge"
                  placeholder="Doctor Fee"
                  value={newDoctor.Charge}
                  onChange={handleChange}
                  className="w-full max-w-5xl p-2 bg-white border-1 border-gray-300 rounded-md
          focus:outline-none focus:ring-2 focus:ring-[#CEE4E6] mt-2"
                  required
                />
              <label className="block font-semibold mb-2 mt-4">Gender:</label>
              <div className="grid grid-cols-2 gap-2 items-center mt-2">
                <div className="ml-3">
                  <input
                    type="radio"
                    id="male"
                    name="Gender"
                    value="Male"
                    onChange={handleGenderChange}
                    checked={newDoctor.Gender === "Male"}
                    className="mr-2 bg-[#007e8556] cursor-pointer"
                  />
                  <label htmlFor="male" className="font-small text-[#5E6767]">
                    Male
                  </label>
                </div>

                <div className="ml-3">
                  <input
                    type="radio"
                    id="female"
                    name="Gender"
                    value="Female"
                    onChange={handleGenderChange}
                    checked={newDoctor.Gender === "Female"}
                    className="mr-2 bg-[#007e8556] cursor-pointer"
                  />
                  <label htmlFor="female" className="font-small text-[#5E6767]">
                    Female
                  </label>
                </div>
              </div>
              {/* Availability */}
              {/* checkboxes */}
              <label className="block font-semibold mb-2 mt-3">
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

              <div className="mb-4">
                <div className="w-full max-w-5xl p-2 bg-white border-1 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CEE4E6] mt-5">
                  {/* Display Selected Hospital */}
                  {availableData.HospitalId && (
                    <div className="bg-[#E9FAF2] text-[#09424D] px-2 rounded-md flex items-center ">
                      {availableData.HospitalName}
                      <span
                        className="ml-2 cursor-pointer text-red-400 font-bold "
                        onClick={() =>
                          setAvailableData((prev) => ({
                            ...prev,
                            HospitalName: "",
                            HospitalId: "",
                          }))
                        }
                      >
                        ✕
                      </span>
                    </div>
                  )}

                  {/* Input Field */}
                  {!availableData.HospitalName && (
                    <input
                      type="text"
                      placeholder="Hospital"
                      name="HospitalName"
                      value={input}
                      onChange={handleHospitalInputChange}
                      className="border-none outline-none flex-1"
                      onFocus={() => setShowSuggestions(true)}
                    />
                  )}
                </div>

                {/* Dropdown Suggestions */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute bg-[#E9FAF2] border mt-1 shadow-lg rounded-md w-full max-w-5xl">
                    {suggestions.map((hospital, index) => (
                      <div
                        key={index}
                        className="p-2 hover:bg-gray-200 cursor-pointer"
                        onClick={() =>
                          handleSelectHospital(
                            hospital.hospitalName,
                            hospital.hospitalId
                          )
                        }
                      >
                        {hospital.hospitalName}
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
              <p className="text-red-500 font-bold text-center my-5">
                {timeErrorMessage}
              </p>
              <div className="mt-3 w-[100%]">
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
              {/*availability table */}
          <div className="rounded-xl">
            <table className="w-full mt-5 border border-gray-200 rounded-xl">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">Day</th>
                  <th className="p-2">Start Time</th>
                  <th className="p-2">End Time</th>
                  <th className="p-2">Hospital Name</th>
                  <th className="p-2">Hospital Id</th>
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
                    <td className="p-2 text-center">{slot.HospitalName}</td>
                    <td className="p-2 text-center">{slot.HospitalId}</td>
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
          <textarea
            name="Description"
            placeholder="Description"
            value={newDoctor.Description}
            onChange={handleChange}
            className="w-full  p-2 bg-white border border-gray-300 rounded-md
  focus:outline-none focus:ring-2 focus:ring-[#CEE4E6] mt-6"
            required
            rows="4" 
          ></textarea>

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
       ) : (
        <div className="h-[500px] ">
          <div className="h-[500px] mt-10 bg-[#E9FAF2] p-6 rounded-lg shadow-md w-full flex flex-col">
            <h1 className="text-2xl font-bold text-center mb-2">
              Add data status
            </h1>
            <div className="flex-grow flex items-center justify-center">
              <p className="text-green-600 font-bold text-xl text-center mb-5">
                {successMessage}
              </p>
            </div>
          </div>
        </div>
      )}
      {/*loading component */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <p className="mb-4 text-lg font-semibold text-[rgba(0,126,133,0.7)]">
              Please wait...
            </p>
            <Spinner className="h-10 w-10 text-[rgba(0,126,133,0.7)]" />
          </div>
        </div>
      )}
      <div className="mt-6 text-gray-500 text-right">
        <p>{formattedDate}</p>
        <p>{formattedTime}</p>
      </div>
    </div>
  );
}
