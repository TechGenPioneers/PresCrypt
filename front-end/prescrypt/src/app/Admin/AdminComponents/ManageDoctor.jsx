"use client";
import { useState, useEffect } from "react";
import {
  DeleteDoctor,
  GetHospitals,
  UpdateDoctor,
} from "../service/AdminDoctorService";
import { useRouter } from "next/navigation";
import {
  Calendar,
  ArrowLeft,
  Check,
  MapPin,
  User,
  Clock,
  Mail,
  Phone,
  FileText,
  DollarSign,
  Award,
  CreditCard,
  Trash2,
  Edit3,
  UserCheck,
  UserX,AlertTriangle, X
} from "lucide-react";

export default function ManageDoctor({ doctorData }) {
  const [schedule, setSchedule] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [doctorId, setDoctorId] = useState();
  const [showPopup, setShowPopup] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    DoctorId: "",
    FirstName: "",
    LastName: "",
    Email: "",
    specialization: "",
    SlmcLicense: "",
    ContactNumber: "",
    NIC: "",
    Gender: "",
    Description: "",
    Status: "",
    Charge: 0.0,
  });
  const [availableData, setAvailableData] = useState({
    availability: [],
    startTime: "",
    endTime: "",
    HospitalId: "",
    HospitalName: "",
    AvailabilityId: "",
  });
  const [hospitalsData, setHospitalsData] = useState([]);
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  //date and time
  const [dateTime, setDateTime] = useState(null);

  //set error message
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [timeErrorMessage, setTimeErrorMessage] = useState("");
  const router = useRouter();

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

  //handle status
  const handleStatusChange = (event) => {
    setNewDoctor((prevDoctor) => ({
      ...prevDoctor,
      Status: event.target.value === "true", // Convert string back to boolean
    }));
  };

  //set available data
  const handleTime = (e) => {
    const { name, value } = e.target;
    setAvailableData({ ...availableData, [name]: value });
  };

  //add available table
  const handleAddTime = () => {
    // Clear any previous error
    setTimeErrorMessage("");

    // Validate hospital
    if (!availableData.HospitalId || !availableData.HospitalName) {
      setTimeErrorMessage("Please select a hospital.");
      return;
    }

    // Validate days
    if (
      !availableData.availability ||
      availableData.availability.length === 0
    ) {
      setTimeErrorMessage("Please select at least one day.");
      return;
    }

    // Validate time
    if (!availableData.startTime || !availableData.endTime) {
      setTimeErrorMessage("Please select both start time and end time.");
      return;
    }

    const newSchedule = availableData.availability.map((day) => ({
      day,
      startTime: availableData.startTime,
      endTime: availableData.endTime,
      HospitalId: availableData.HospitalId,
      HospitalName: availableData.HospitalName,
    }));

    // Ensure start time is before end time
    if (newSchedule.some((item) => item.startTime >= item.endTime)) {
      setTimeErrorMessage("Start time must be before end time.");
      return;
    }

    // Check for duplicate entry
    const isDuplicate = newSchedule.some((newItem) =>
      schedule.some(
        (existing) =>
          existing.day === newItem.day &&
          existing.startTime === newItem.startTime &&
          existing.endTime === newItem.endTime &&
          existing.HospitalId === newItem.HospitalId
      )
    );

    if (isDuplicate) {
      setTimeErrorMessage(
        "Selected time slot already exists. Please check again!"
      );
      return;
    }

    // All good — Add to schedule
    setSchedule((prev) => [...prev, ...newSchedule]);

    // Clear fields
    setAvailableData({
      availability: [],
      startTime: "",
      endTime: "",
      HospitalId: "",
      HospitalName: "",
    });

    setTimeErrorMessage("");
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

  // Handle form delete
  const handleConfirmDelete = async (e) => {
    try {
      setIsLoading(true);
      const deleteDoctor = await DeleteDoctor(newDoctor.DoctorId);
      console.log(deleteDoctor);
      setIsSubmitted(true);
      setIsLoading(false);
      setSuccessMessage("Doctor Deleted Successfully!");
    } catch (error) {
      setErrorMessage("Failed to delete the Doctor!");
      console.error("Failed to delete the doctor", error);
      setIsLoading(false);
    }
  };
  const handleDeleteDoctor = () => {
    setShowPopup(true);
  };
  const handleCancel = () => {
    setShowPopup(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setIsLoading(true);
    // Check if schedule has data
    if (schedule.length > 0) {
      try {
        console.log("Form Data Submitted:", newDoctor, schedule);

        // Send new doctor details into the backend
        console.log("Before sending Data --->", newDoctor, schedule);

        // Uncomment the code to actually send the data
        const newDoctorDetails = await UpdateDoctor(newDoctor, schedule);
        console.log(newDoctorDetails);

        setDoctorId(newDoctor.DoctorId);

        // Reset state after successful submission
        setAvailableData({
          availability: [],
          startTime: "",
          endTime: "",
          HospitalId: "",
          HospitalName: "",
          AvailabilityId: "",
        });

        setNewDoctor({
          DoctorId: "",
          FirstName: "",
          LastName: "",
          Email: "",
          specialization: "",
          SlmcLicense: "",
          ContactNumber: "",
          Gender: "",
          NIC: "",
          Description: "",
          Status: "",
          Charge: 0.0,
        });
        setIsSubmitted(true);
        setSuccessMessage("Doctor Updated Successfully!");
        setSchedule([]); // Reset schedule
        setErrorMessage(""); // Clear any error message
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to add the doctor", err);
        setErrorMessage("Failed to add the doctor!");
        setIsLoading(false);
      }
    } else {
      console.log("Time slots empty");
      setErrorMessage("Please select available time");
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    console.log("clicked back", doctorId);
    router.push(`/Admin/DoctorDetailPage/${doctorId}`);
  };

  useEffect(() => {
    const loadData = async () => {
      const HospitalDetails = await GetHospitals();
      console.log(HospitalDetails);
      setHospitalsData(HospitalDetails);

      const updateDateTime = () => setDateTime(new Date());
      updateDateTime();
      const interval = setInterval(updateDateTime, 1000);
      return () => clearInterval(interval);
    };
    loadData();
  }, []); // Run once

  useEffect(() => {
    if (doctorData?.doctor) {
      setNewDoctor({
        DoctorId: doctorData.doctor.doctorId ?? "",
        FirstName: doctorData.doctor.firstName ?? "",
        LastName: doctorData.doctor.lastName ?? "",
        Email: doctorData.doctor.email ?? "",
        specialization: doctorData.doctor.specialization ?? "",
        SlmcLicense: doctorData.doctor.slmcLicense ?? "",
        ContactNumber: doctorData.doctor.contactNumber ?? "",
        Gender: doctorData.doctor.gender ?? "",
        NIC: doctorData.doctor.nic ?? "",
        Description: doctorData.doctor.description ?? "",
        Status: doctorData.doctor.status ?? false,
        Charge: doctorData.doctor.charge ?? "",
      });

      setSchedule(
        doctorData.availability.map((avail) => ({
          day: avail.day,
          startTime: avail.startTime,
          endTime: avail.endTime,
          HospitalId: avail.hospitalId,
          HospitalName: avail.hospitalName,
          AvailabilityId: avail.availabilityId,
        }))
      );
    }
  }, [doctorData]); // Now it reacts when doctorData is ready

  // set date and time
  if (!dateTime) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-[#E9FAF2] border-t-[#50d094] rounded-full animate-spin"></div>
          <p className="text-slate-600 text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }
  // Date Formatting
  const formattedDate = dateTime.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const StatusIndicator = ({ status }) => (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
        status
          ? "bg-green-100 text-green-700 border border-green-200"
          : "bg-red-100 text-red-700 border border-red-200"
      }`}
    >
      {status ? <UserCheck size={16} /> : <UserX size={16} />}
      {status ? "Active" : "Inactive"}
    </div>
  );

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-full mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border-t-4 border-[#E9FAF2] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#E9FAF2] to-[#CEE4E6] p-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-800">
                Doctor Management
              </h1>
              <StatusIndicator status={newDoctor.Status} />
            </div>
            <div className="flex items-center gap-4 text-[#09424D]">
              <div className="flex items-center gap-2">
                <User size={20} />
                <span className="text-xl font-semibold">
                  Dr. {newDoctor.FirstName} {newDoctor.LastName}
                </span>
              </div>
              <div className="text-sm bg-white/70 px-3 py-1 rounded-full">
                ID: {newDoctor.DoctorId}
              </div>
            </div>
            <p className="text-[#09424D] text-sm flex items-center gap-2 mt-2">
              <Calendar size={16} />
              {formattedDate}
            </p>
          </div>

          {!isSubmitted ? (
            <div className="p-8">
              <div className="space-y-8">
                {/* Status Control */}
                <div className="bg-[#E9FAF2] p-6 rounded-xl">
                  <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <UserCheck size={20} className="text-[#006369]" />
                    Account Status
                  </h2>
                  <div className="flex justify-center">
                    <div className="flex gap-8 p-4 bg-white rounded-xl border border-gray-200">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          id="active"
                          name="Status"
                          value="true"
                          onChange={handleStatusChange}
                          checked={newDoctor.Status === true}
                          className="w-4 h-4 text-[#006369] cursor-pointer"
                        />
                        <label
                          htmlFor="active"
                          className="flex items-center gap-2 text-gray-700 cursor-pointer font-medium"
                        >
                          <UserCheck size={16} className="text-green-600" />
                          Active
                        </label>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          id="inactive"
                          name="Status"
                          value="false"
                          onChange={handleStatusChange}
                          checked={newDoctor.Status === false}
                          className="w-4 h-4 text-[#006369] cursor-pointer"
                        />
                        <label
                          htmlFor="inactive"
                          className="flex items-center gap-2 text-gray-700 cursor-pointer font-medium"
                        >
                          <UserX size={16} className="text-red-600" />
                          Inactive
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="bg-[#E9FAF2] p-6 rounded-xl">
                  <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <User size={20} className="text-[#006369]" />
                    Personal Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Doctor ID (disabled) */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 font-semibold text-gray-700">
                        <CreditCard size={16} className="text-[#006369]" />
                        Doctor ID
                      </label>
                      <input
                        type="text"
                        name="DoctorId"
                        value={newDoctor.DoctorId}
                        onChange={handleChange}
                        disabled
                        className="w-full p-3 bg-gray-50 text-gray-500 border border-gray-200 rounded-xl cursor-not-allowed"
                        required
                      />
                    </div>
                    <div></div>

                    {/* First Name */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 font-semibold text-gray-700">
                        <User size={16} className="text-[#006369]" />
                        First Name
                      </label>
                      <input
                        type="text"
                        name="FirstName"
                        placeholder="First Name"
                        value={newDoctor.FirstName}
                        onChange={handleChange}
                        className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CEE4E6] focus:border-transparent transition-all duration-200 hover:border-gray-300"
                        required
                      />
                    </div>

                    {/* Last Name */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 font-semibold text-gray-700">
                        <User size={16} className="text-[#006369]" />
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="LastName"
                        placeholder="Enter last name"
                        value={newDoctor.LastName}
                        onChange={handleChange}
                        className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CEE4E6] focus:border-transparent transition-all duration-200 hover:border-gray-300"
                        required
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 font-semibold text-gray-700">
                        <Mail size={16} className="text-[#006369]" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="Email"
                        placeholder="Enter email address"
                        value={newDoctor.Email}
                        onChange={handleChange}
                        className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CEE4E6] focus:border-transparent transition-all duration-200 hover:border-gray-300"
                        required
                      />
                    </div>

                    {/* Contact Number */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 font-semibold text-gray-700">
                        <Phone size={16} className="text-[#006369]" />
                        Contact Number
                      </label>
                      <input
                        type="text"
                        name="ContactNumber"
                        placeholder="Enter contact number"
                        value={newDoctor.ContactNumber}
                        onChange={handleChange}
                        className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CEE4E6] focus:border-transparent transition-all duration-200 hover:border-gray-300"
                        required
                      />
                    </div>

                    {/* NIC */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 font-semibold text-gray-700">
                        <CreditCard size={16} className="text-[#006369]" />
                        NIC Number
                      </label>
                      <input
                        type="text"
                        name="NIC"
                        placeholder="Enter NIC number"
                        value={newDoctor.NIC}
                        onChange={handleChange}
                        className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CEE4E6] focus:border-transparent transition-all duration-200 hover:border-gray-300"
                        required
                      />
                    </div>

                    {/* Gender Selection */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 font-semibold text-gray-700">
                        <User size={16} className="text-[#006369]" />
                        Gender
                      </label>
                      <div className="flex gap-6 p-3 bg-white rounded-xl border border-gray-200">
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            id="male"
                            name="Gender"
                            value="Male"
                            onChange={handleGenderChange}
                            checked={newDoctor.Gender === "Male"}
                            className="w-4 h-4 text-[#006369] cursor-pointer"
                          />
                          <label
                            htmlFor="male"
                            className="text-gray-700 cursor-pointer"
                          >
                            Male
                          </label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            id="female"
                            name="Gender"
                            value="Female"
                            onChange={handleGenderChange}
                            checked={newDoctor.Gender === "Female"}
                            className="w-4 h-4 text-[#006369] cursor-pointer"
                          />
                          <label
                            htmlFor="female"
                            className="text-gray-700 cursor-pointer"
                          >
                            Female
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="bg-[#E9FAF2] p-6 rounded-xl">
                  <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Award size={20} className="text-[#006369]" />
                    Professional Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Specialization */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 font-semibold text-gray-700">
                        <Award size={16} className="text-[#006369]" />
                        Specialization
                      </label>
                      <input
                        type="text"
                        name="specialization"
                        placeholder="Enter specialization"
                        value={newDoctor.specialization}
                        onChange={handleChange}
                        className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CEE4E6] focus:border-transparent transition-all duration-200 hover:border-gray-300"
                        required
                      />
                    </div>

                    {/* SLMC License Number */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 font-semibold text-gray-700">
                        <FileText size={16} className="text-[#006369]" />
                        SLMC License Number
                      </label>
                      <input
                        type="text"
                        name="SlmcLicense"
                        placeholder="Enter SLMC license number"
                        value={newDoctor.SlmcLicense}
                        onChange={handleChange}
                        className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CEE4E6] focus:border-transparent transition-all duration-200 hover:border-gray-300"
                        required
                      />
                    </div>

                    {/* Consultation Fee */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 font-semibold text-gray-700">
                        <DollarSign size={16} className="text-[#006369]" />
                        Consultation Fee (LKR)
                      </label>
                      <input
                        type="number"
                        name="Charge"
                        placeholder="Enter consultation fee"
                        value={newDoctor.Charge}
                        onChange={handleChange}
                        className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CEE4E6] focus:border-transparent transition-all duration-200 hover:border-gray-300"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Availability & Schedule */}
                <div className="bg-[#E9FAF2] p-6 rounded-xl">
                  <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Clock size={20} className="text-[#006369]" />
                    Availability & Schedule Management
                  </h2>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Days Selection */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-700">
                        Available Days
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
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
                            className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                          >
                            <input
                              type="checkbox"
                              className="w-4 h-4 text-[#006369] rounded cursor-pointer"
                              checked={availableData.availability.includes(day)}
                              onChange={() => handleCheckboxChange(day)}
                            />
                            <span className="text-gray-700">{day}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Time and Hospital Selection */}
                    <div className="space-y-4">
                      {/* Hospital Selection */}
                      <div className="relative">
                        <label className="flex items-center gap-2 font-semibold text-gray-700 mb-2">
                          <MapPin size={16} className="text-[#006369]" />
                          Hospital
                        </label>
                        <div className="w-full p-3 bg-white border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-[#CEE4E6] focus-within:border-transparent">
                          {availableData.HospitalId ? (
                            <div className="bg-[#E9FAF2] text-[#09424D] px-3 py-2 rounded-lg flex items-center justify-between">
                              <span>{availableData.HospitalName}</span>
                              <button
                                type="button"
                                className="text-red-500 hover:text-red-700 font-bold"
                                onClick={() =>
                                  setAvailableData((prev) => ({
                                    ...prev,
                                    HospitalName: "",
                                    HospitalId: "",
                                  }))
                                }
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <input
                              type="text"
                              placeholder="Search hospital..."
                              value={input}
                              onChange={handleHospitalInputChange}
                              className="w-full border-none outline-none"
                              onFocus={() => setShowSuggestions(true)}
                            />
                          )}
                        </div>

                        {showSuggestions && suggestions.length > 0 && (
                          <div className="absolute z-10 w-full bg-white border border-gray-200 mt-1 shadow-lg rounded-xl overflow-hidden">
                            {suggestions.map((hospital, index) => (
                              <div
                                key={index}
                                className="p-3 hover:bg-[#E9FAF2] cursor-pointer transition-colors"
                                onClick={() =>
                                  handleSelectHospital(
                                    hospital.hospitalName,
                                    hospital.hospitalId
                                  )
                                }
                              >
                                <span className="font-medium">
                                  {hospital.hospitalName}
                                </span>
                                <span className="text-gray-500 ml-2">
                                  - {hospital.city}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Time Selection */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block font-semibold text-gray-700 mb-2">
                            Start Time
                          </label>
                          <input
                            type="time"
                            name="startTime"
                            value={availableData.startTime}
                            onChange={handleTime}
                            className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CEE4E6] focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-gray-700 mb-2">
                            End Time
                          </label>
                          <input
                            type="time"
                            name="endTime"
                            value={availableData.endTime}
                            onChange={handleTime}
                            className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CEE4E6] focus:border-transparent"
                          />
                        </div>
                      </div>

                      {timeErrorMessage && (
                        <p className="text-red-500 font-medium text-center">
                          {timeErrorMessage}
                        </p>
                      )}

                      <button
                        type="button"
                        onClick={handleAddTime}
                        className="w-full bg-[#007e8556] text-[#006369] py-3 px-6 rounded-xl hover:bg-[#007e8589] transition-colors font-semibold"
                      >
                        Add Time Slot
                      </button>
                    </div>
                  </div>
                </div>

                {/* Current Schedule Table */}
                {schedule.length > 0 && (
                  <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <Clock size={20} className="text-[#006369]" />
                      Current Schedule
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-[#E9FAF2]">
                            <th className="p-3 text-left font-semibold text-gray-700 rounded-tl-lg">
                              ID
                            </th>
                            <th className="p-3 text-left font-semibold text-gray-700">
                              Day
                            </th>
                            <th className="p-3 text-left font-semibold text-gray-700">
                              Start Time
                            </th>
                            <th className="p-3 text-left font-semibold text-gray-700">
                              End Time
                            </th>
                            <th className="p-3 text-left font-semibold text-gray-700">
                              Hospital
                            </th>
                            <th className="p-3 text-left font-semibold text-gray-700">
                              Hospital ID
                            </th>
                            <th className="p-3 text-left font-semibold text-gray-700 rounded-tr-lg">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {schedule.map((slot, index) => (
                            <tr
                              key={index}
                              className={`border-t ${
                                index % 2 === 0 ? "bg-[#E9FAF2]" : "bg-white"
                              }`}
                            >
                              <td className="p-3 text-sm text-gray-600">
                                {slot.AvailabilityId}
                              </td>
                              <td className="p-3 font-medium">{slot.day}</td>
                              <td className="p-3">{slot.startTime}</td>
                              <td className="p-3">{slot.endTime}</td>
                              <td className="p-3">{slot.HospitalName}</td>
                              <td className="p-3 text-sm text-gray-600">
                                {slot.HospitalId}
                              </td>
                              <td className="p-3">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSlot(index)}
                                  className="text-red-500 hover:text-red-700 font-medium hover:underline transition-colors"
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 font-semibold text-gray-700">
                    <FileText size={16} className="text-[#006369]" />
                    Description
                  </label>
                  <textarea
                    name="Description"
                    placeholder="Enter additional information about the doctor..."
                    value={newDoctor.Description}
                    onChange={handleChange}
                    className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CEE4E6] focus:border-transparent transition-all duration-200 hover:border-gray-300"
                    required
                    rows="4"
                  />
                </div>

                {/* Error Message */}
                {errorMessage && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-red-600 font-medium text-center">
                      {errorMessage}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={handleDeleteDoctor}
                    className="flex-1 bg-red-600 text-white py-4 px-6 rounded-xl hover:bg-red-700 transition-colors font-bold text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <Trash2 size={20} />
                    Delete Doctor
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="flex-1 bg-[#007e8556] text-[#006369] py-4 px-6 rounded-xl hover:bg-[#007e8589] transition-colors font-bold text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <Edit3 size={20} />
                    Update Doctor
                  </button>
                </div>
              </div>
              {/* Warning Popup Overlay */}
              {showPopup && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white relative">
                      <button
                        onClick={handleCancel}
                        className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                      >
                        <X size={20} />
                      </button>
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-white/20 rounded-full">
                          <AlertTriangle size={24} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">
                            Confirm Deletion
                          </h3>
                          <p className="text-red-100 text-sm">
                            This action cannot be undone
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <p className="text-gray-700 text-base leading-relaxed mb-6">
                        Are you sure you want to delete this doctor? This will
                        permanently remove all associated records, appointments,
                        and data from the system.
                      </p>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button
                          onClick={handleCancel}
                          className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors font-semibold"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleConfirmDelete}
                          className="flex-1 bg-red-600 text-white py-3 px-4 rounded-xl hover:bg-red-700 transition-colors font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2"></div>
                  <div className="p-8">
                    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                        <Check className="w-10 h-10 text-emerald-600" />
                      </div>
                      <h1 className="text-3xl font-bold text-slate-800 mb-4">
                        Success!
                      </h1>
                      <p className="text-emerald-600 text-xl font-semibold mb-8">
                        {successMessage}
                      </p>
                      <button
                        onClick={handleBack}
                        className="inline-flex items-center px-6 py-3  bg-[#A9C9CD] text-[#09424D] font-semibold rounded-xl hover:bg-[#91B4B8]  transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                      >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Doctor Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {isLoading && (
        <div className="fixed bg-gray-500/50 inset-0 z-50 flex items-center justify-center">
          <div className="flex items-center justify-center h-[300px]">
            <div className="flex flex-col items-center space-y-4">
              <p className="text-slate-600 text-lg font-medium">
                Please wait...
              </p>
              <div className="h-10 w-10 border-4 border-[#E9FAF2] border-t-[#50d094] rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
