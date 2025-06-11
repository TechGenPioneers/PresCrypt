"use client";
import React from "react";
export default function StepIndicator({ currentStep }) {
  return (
    <div className="flex items-center justify-center my-6">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
          currentStep === 1 ? "bg-teal-200 text-green-800" : "bg-gray-200 text-gray-600"
        }`}
      >
        1
      </div>
      <div className="w-16 h-0.5 bg-gray-200 mx-2"></div>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
          currentStep === 2 ? "bg-teal-200 text-green-800" : "bg-gray-200 text-gray-600"
        }`}
      >
        2
      </div>
    </div>
  );
}
