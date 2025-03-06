"use client";
import { useState,useEffect } from "react";

export default function DoctorRegistrationForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    specialization: "",
    smlcLicense: "",
    contactNumber: "",
    hospital: "",
    availability: [],
    timeSlot: "",
  });
  const [dateTime, setDateTime] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (day) => {
    setFormData((prevState) => {
      const updatedAvailability = prevState.availability.includes(day)
        ? prevState.availability.filter((d) => d !== day)
        : [...prevState.availability, day];
      return { ...prevState, availability: updatedAvailability };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    alert("Doctor Registered Successfully!");
  };

   useEffect(() => {
      const updateDateTime = () => setDateTime(new Date());
      updateDateTime(); // Set initial time
      const interval = setInterval(updateDateTime, 1000);
      return () => clearInterval(interval);
    }, []);
  
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

  return (
    <div className="p-6 ml-15 bg-white rounded-lg shadow-md">
      {/* Title */}
      <h1 className="text-2xl font-bold mb-2">Doctors</h1>
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
                value={formData.firstName}
                onChange={handleChange}
                className="w-full max-w-5xl p-2 bg-white border-1 border-gray-300 rounded-md
          focus:outline-none focus:ring-2 focus:ring-[#CEE4E6] mt-5"
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full max-w-5xl p-2 bg-white border-1 border-gray-300 rounded-md
          focus:outline-none focus:ring-2 focus:ring-[#CEE4E6] mt-5"
                required
              />
              <input
                type="text"
                name="specialization"
                placeholder="Specialization"
                value={formData.specialization}
                onChange={handleChange}
                className="w-full max-w-5xl p-2 bg-white border-1 border-gray-300 rounded-md
          focus:outline-none focus:ring-2 focus:ring-[#CEE4E6] mt-5"
                required
              />
              <input
                type="text"
                name="smlcLicense"
                placeholder="SMLC License Number"
                value={formData.smlcLicense}
                onChange={handleChange}
                className="w-full max-w-5xl p-2 bg-white border-1 border-gray-300 rounded-md
          focus:outline-none focus:ring-2 focus:ring-[#CEE4E6] mt-5"
                required
              />
              <input
                type="text"
                name="contactNumber"
                placeholder="Contact Number"
                value={formData.contactNumber}
                onChange={handleChange}
                className="w-full max-w-5xl p-2 bg-white border-1 border-gray-300 rounded-md
          focus:outline-none focus:ring-2 focus:ring-[#CEE4E6] mt-5"
                required
              />
              <input
                type="text"
                name="hospital"
                placeholder="Hospital"
                value={formData.hospital}
                onChange={handleChange}
                className="w-full max-w-5xl p-2 bg-white border-1 border-gray-300 rounded-md
          focus:outline-none focus:ring-2 focus:ring-[#CEE4E6] mt-5"
                required
              />
            </div>
            <div>
              {/* Availability Checkboxes */}

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full max-w-5xl p-2 bg-white border-1 border-gray-300 rounded-md
          focus:outline-none focus:ring-2 focus:ring-[#CEE4E6] mt-5"
                required
              />

              <label className="block font-semibold mb-2 mt-5">Availability:</label>
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
                  <label key={day} className="flex items-center space-x-3 py-2 px-4">
                    <input
                      type="checkbox"
                      className="w-4 h-5 bg-[#007e8556] cursor-pointer"
                      checked={formData.availability.includes(day)}
                      onChange={() => handleCheckboxChange(day)}
                    />
                    <span className="font-small text-[#5E6767]">{day}</span>
                  </label>
                ))}
              </div>

              {/* Select Time Dropdown */}
              <select
                name="timeSlot"
                value={formData.timeSlot}
                onChange={handleChange}
                className="w-full max-w-5xl p-2 bg-white border-1 border-gray-300 rounded-md
          focus:outline-none focus:ring-2 focus:ring-[#CEE4E6] mt-5"
              >
                <option value="">Select Time</option>
                <option value="4:00 PM - 6:00 PM">4:00 PM - 6:00 PM</option>
                <option value="6:00 PM - 8:00 PM">6:00 PM - 8:00 PM</option>
              </select>

              {/* Submit Button */}
              <div className="mt-5 w-[100%]">
                <button
                  type="submit"
                  className=" bg-[#007e8556] text-[#006369] p-2 w-[100%] rounded-lg hover:bg-[#007e8589] cursor-pointer"
                >
                  Register
                </button>
              </div>
            </div>
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
