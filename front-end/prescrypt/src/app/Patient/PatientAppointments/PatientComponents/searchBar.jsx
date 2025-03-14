import React, { useState } from "react";
import SpecializationDialog from "../PatientComponents/specializationBox";
import LocationDialog from "../PatientComponents/locationSelectBox.jsx";

const SearchBar = () => {
  const [specializationOpen, setSpecializationOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  return (
    <div className="mb-6 bg-green-50 w-full px-8 sm:px-6 lg:px-10">
      <h2 className="text-2xl mb-4">Search for available appointments</h2>
      <div className="flex gap-4 mb-4 items-center">
        {/* Specialization Selection */}
        <button
          className="flex-1 p-3 text-lg border border-gray-300 rounded-md text-gray-500"
          onClick={() => setSpecializationOpen(true)}
        >
          {selectedSpecialization || "Select Specialization"}
        </button>

        {/* Location Selection */}
        <button
          className="flex-1 p-3 text-lg border border-gray-300 rounded-md text-gray-500"
          onClick={() => setLocationOpen(true)}
        >
          {selectedLocation || "Select Location"}
        </button>
      </div>

      {/* Additional Buttons */}
      <div className="flex gap-4">
        <button className="p-3 text-lg border border-gray-300 rounded-md text-gray-500">
          More Options
        </button>
        <button className="p-3 text-lg border border-gray-300 rounded-md text-gray-500">
          Calendar
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
