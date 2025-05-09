import { useState, useEffect } from "react";
import axios from "axios";
import SpecializationDialog from "./specializationBox";
import LocationDialog from "./locationSelectBox";
import { CircularProgress } from "@mui/material";
import { findDoctors } from "../services/AppointmentsFindingService";  

const SearchBar = ({ setDoctors }) => {
  const [specializationOpen, setSpecializationOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);

  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedName, setSelectedName] = useState("");

  const [loading, setLoading] = useState(false);
  const [hospitalCharge, setHospitalCharge] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);

  const handleFindDoctor = async () => {
    if (!selectedName && (!selectedSpecialization || !selectedLocation)) {
      alert("Please select either a doctor name or both specialization and location.");
      return;
    }

    setLoading(true);
    try {
      // Use the service function here for fetching data
      const doctorsData = await findDoctors({
        specialization: selectedSpecialization,
        hospitalName: selectedLocation,
        name: selectedName,
      });

      setDoctors(doctorsData);

      if (doctorsData && doctorsData.length > 0) {
        setHospitalCharge(doctorsData[0].charge);
        localStorage.setItem("hospitalCharge", doctorsData[0].charge);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
      alert("Failed to fetch doctor details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Clear the selections in localStorage when the component mounts
    localStorage.removeItem("selectedSpecialization");
    localStorage.removeItem("selectedLocation");
    localStorage.removeItem("selectedName");
    setSelectedSpecialization("");
    setSelectedLocation("");
    setSelectedName("");
  }, []);

  useEffect(() => {
    if (selectedSpecialization) {
      localStorage.setItem("selectedSpecialization", selectedSpecialization);
    }
  }, [selectedSpecialization]);

  useEffect(() => {
    if (selectedLocation) {
      localStorage.setItem("selectedLocation", selectedLocation);
    }
  }, [selectedLocation]);

  useEffect(() => {
    if (selectedName) {
      localStorage.setItem("selectedName", selectedName);
    }
  }, [selectedName]);

  useEffect(() => {
    if (hospitalCharge) {
      localStorage.setItem("hospitalCharge", hospitalCharge);
    }
  }, [hospitalCharge]);

  const isNameSearchActive = selectedName.trim().length > 0;

  return (
    <div className="bg-[#E8F4F2] p-6 rounded-md">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">
        Search for available appointments
      </h2>

      {/* Layout section */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left column - Specialization + Doctor Name */}
        <div className="flex flex-col gap-4 w-full md:w-1/2">
          {/* Specialization */}
          <button
            className={`w-full p-4 text-md border rounded-md text-gray-700 shadow-sm text-left ${
              isNameSearchActive ? "bg-gray-200 border-gray-300" : "bg-white border-green-700"
            }`}
            onClick={() => !isNameSearchActive && setSpecializationOpen(true)}
            disabled={isNameSearchActive}
          >
            <span className="text-gray-400 text-sm">Specialization / Category</span>
            <br />
            <span className="font-medium text-green-700">
              {selectedSpecialization || "Find Your Category"}
            </span>
          </button>

          {/* Doctor Name input (below Specialization if shown) */}
          {showNameInput && (
            <label
              className={`w-full block p-4 text-md border rounded-md shadow-sm text-left ${
                isNameSearchActive ? "bg-white border-green-700" : "bg-white border-gray-300"
              }`}
            >
              <span className="text-gray-400 text-sm">Doctor Name</span>
              <input
                type="text"
                placeholder="Enter doctor's name"
                className="mt-1 w-full bg-transparent outline-none font-medium text-green-700"
                value={selectedName}
                onChange={(e) => {
                  setSelectedName(e.target.value);
                  if (e.target.value) {
                    setSelectedSpecialization("");
                    setSelectedLocation("");
                  }
                }}
              />
            </label>
          )}
        </div>

        {/* Right column - Location */}
        <div className="flex flex-col gap-4 w-full md:w-1/2">
          <button
            className={`w-full p-4 text-md border rounded-md text-gray-700 shadow-sm text-left ${
              isNameSearchActive ? "bg-gray-200 border-gray-300" : "bg-white border-green-700"
            }`}
            onClick={() => !isNameSearchActive && setLocationOpen(true)}
            disabled={isNameSearchActive}
          >
            <span className="text-gray-400 text-sm">Location or remote appointment</span>
            <br />
            <span className="font-medium text-green-700">
              {selectedLocation || "Find Your Location"}
            </span>
          </button>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-6 justify-end">
        {/* More Options Button */}
        <button
          className="px-6 py-3 border border-gray-300 rounded-md text-white bg-gray-600 hover:bg-gray-500 shadow-sm"
          onClick={() => setShowNameInput(!showNameInput)}
        >
          More Options
        </button>

        {/* Find My Doctor */}
        <button
          className="px-6 py-3 border border-gray-300 rounded-md text-white bg-green-700 hover:bg-green-600 shadow-sm flex justify-center items-center"
          onClick={handleFindDoctor}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Find my Doctor"}
        </button>
      </div>

      {/* Dialogs */}
      <SpecializationDialog
        open={specializationOpen}
        handleClose={() => setSpecializationOpen(false)}
        onSelect={(spec) => {
          setSelectedSpecialization(spec);
          setSpecializationOpen(false);
        }}
      />

      <LocationDialog
        open={locationOpen}
        handleClose={() => setLocationOpen(false)}
        onSelect={(loc) => {
          setSelectedLocation(loc);
          setLocationOpen(false);
        }}
      />
    </div>
  );
};

export default SearchBar;
