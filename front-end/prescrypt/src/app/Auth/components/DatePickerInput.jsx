// components/auth/DatePickerInput.jsx
"use client";

import { Calendar } from "lucide-react";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";

export default function DatePickerInput({
  selected,
  onChange,
  error,
  placeholder = "Date of Birth",
}) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Date of Birth
      </label>
      <div className="relative">
        <DatePicker
          selected={selected}
          onChange={onChange}
          placeholderText={placeholder}
          className={`
            w-full pl-4 pr-10 py-2 rounded-lg border bg-gray-50
            focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500
            ${error ? "border-red-500" : "border-gray-300"}
          `}
          dateFormat="MMMM d, yyyy"
          showYearDropdown
          showMonthDropdown
          dropdownMode="select"
          maxDate={new Date()}
          minDate={new Date(1900, 0, 1)}
          yearDropdownItemNumber={100}
          scrollableYearDropdown
          withPortal
          isClearable
          todayButton="Today"
          popperPlacement="bottom-start"
          popperClassName="!z-50"
          customInput={
            <div className="relative">
              <input
                className={`
                  w-full pl-4 pr-10 py-2 rounded-lg border bg-gray-50
                  focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                  ${error ? "border-red-500" : "border-gray-300"}
                `}
                value={selected ? format(selected, "MMMM d, yyyy") : ""}
                readOnly
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
          }
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}