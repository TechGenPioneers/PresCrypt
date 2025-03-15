import axios from "axios";
import React, { useState } from "react";
import SpecializationDialog from "../PatientComponents/specializationBox";
import LocationDialog from "../PatientComponents/locationSelectBox.jsx";

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
  
      setDoctors(response.data); // Assuming backend returns doctor details correctly
    } catch (error) {
      console.error("Error fetching doctors:", error);
      alert("Failed to fetch doctor details. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="mb-6 bg-green-50 w-full px-8 sm:px-6 lg:px-10">
      <h2 className="text-2xl mb-4">Search for available appointments</h2>
      <div className="flex gap-4 mb-4 items-center">
        <button
          className="flex-1 p-3 text-lg border border-gray-300 rounded-md text-gray-500"
          onClick={() => setSpecializationOpen(true)}
        >
          {selectedSpecialization || "Select Specialization"}
        </button>

        <button
          className="flex-1 p-3 text-lg border border-gray-300 rounded-md text-gray-500"
          onClick={() => setLocationOpen(true)}
        >
          {selectedLocation || "Select Location"}
        </button>
      </div>

      <div className="flex gap-4">
        <button className="p-3 text-lg border border-gray-300 rounded-md text-green-700">
          More Options
        </button>
        <button className="p-3 text-lg border border-gray-300 rounded-md text-green-700">
          Calendar
        </button>
        <button
          className="p-3 text-lg border border-gray-300 rounded-md text-green-700"
          onClick={handleFindDoctor}
          disabled={loading}
        >
          {loading ? "Searching..." : "Find my Doctor"}
        </button>
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
