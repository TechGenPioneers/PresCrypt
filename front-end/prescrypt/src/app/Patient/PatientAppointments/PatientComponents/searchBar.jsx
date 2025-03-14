// src/components/SearchBar.jsx
import React from "react";

const SearchBar = () => {
  return (
    <div className="mb-6">
      <h2 className="text-2xl mb-4">Search for available appointments</h2>
      <div className="flex gap-4 mb-4 p-6 bg-teal-600 rounded-lg">
        <input
          type="text"
          placeholder="Search General Practitioner"
          className="flex-1 p-3 text-lg border border-gray-300 rounded-md"
        />
        <input
          type="text"
          placeholder="Location or remote appointment"
          className="flex-1 p-3 text-lg border border-gray-300 rounded-md"
        />
      </div>
      <div className="flex gap-4">
        <button className="bg-teal-600 text-white py-3 px-6 rounded-md">More options</button>
        <button className="bg-teal-600 text-white py-3 px-6 rounded-md">Calendar</button>
      </div>
    </div>
  );
};

export default SearchBar;
