import axios from "axios";
import React, { useState } from "react";
import SpecializationDialog from "../PatientComponents/specializationBox";
import LocationDialog from "../PatientComponents/locationSelectBox.jsx";
import { CircularProgress } from "@mui/material"; // Import MUI CircularProgress

const SearchBar = ({ setDoctors }) => {
  const [specializationOpen, setSpecializationOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFindDoctor = async () => {
    if (!selectedSpecialization || !selectedLocation) {
      alert("Please select both specialization and location.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get("https://localhost:7021/api/Doctor/search", {
        params: {
          specialization: selectedSpecialization,
          hospitalName: selectedLocation,
        },
      });

      setDoctors(response.data);  // Passing doctor details to the parent component
    } catch (error) {
      console.error("Error fetching doctors:", error);
      alert("Failed to fetch doctor details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#E8F4F2] p-6 rounded-md">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">Search for available appointments</h2>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex flex-col gap-4">
          <button
            className="p-4 text-md border border-green-700 rounded-md text-gray-700 bg-white shadow-sm text-left"
            onClick={() => setSpecializationOpen(true)}
          >
            <span className="text-gray-400 text-sm">Specialization / Category</span>
            <br />
            <span className="font-medium text-green-700">{selectedSpecialization || "Find Your Category"}</span>
          </button>
          <div className="flex gap-4">
            <button className="flex-1 p-3 border border-green-700 rounded-md text-green-700 bg-white shadow-sm">
              More options
            </button>
            <button className="flex-1 p-3 border border-green-700 rounded-md text-green-700 bg-white shadow-sm">
              🗓 Calendar
            </button>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <button
            className="p-4 text-md border border-green-700 rounded-md text-gray-700 bg-white shadow-sm text-left"
            onClick={() => setLocationOpen(true)}
          >
            <span className="text-gray-400 text-sm">Location or remote appointment</span>
            <br />
            <span className="font-medium text-green-700">{selectedLocation || "Find Your Location"}</span>
          </button>
          <button
            className="self-end w-1/2 p-3 border border-gray-300 rounded-md text-white bg-green-700 shadow-sm hover:bg-green-600 flex justify-center items-center"
            onClick={handleFindDoctor}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Find my Doctor"}
          </button>
        </div>
      </div>
      
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
