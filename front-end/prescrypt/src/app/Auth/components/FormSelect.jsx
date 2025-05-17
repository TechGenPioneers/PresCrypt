import React from 'react';
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FormSelect({
  options,
  selected,
  onChange,
  error,
  placeholder = "Select an option",
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4 relative">
      <button
        type="button"
        className={`w-full flex justify-between items-center bg-gray-50 border rounded-lg py-2 px-4 focus:outline-none focus:ring-2 ${
          error
            ? "border-red-500 focus:ring-red-200"
            : "border-gray-300 focus:ring-teal-200"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={!selected ? "text-gray-400" : ""}>
          {selected || placeholder}
        </span>
        <ChevronDown
          className={`h-5 w-5 text-gray-400 transition-transform ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          {options.map((option) => (
            <div
              key={option}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}