"use client";
import React from "react";
import PropTypes from "prop-types";
import { CheckCircle } from "lucide-react";
import { Button } from "@mui/material";

export default function SuccessMessage({ registrationSuccess, handleSuccessClose }) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-lg w-full text-center">
        <CheckCircle size={64} className="text-teal-500 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Registration Submitted
        </h2>
        <p className="text-lg text-gray-800 mb-4 leading-relaxed">
          {registrationSuccess.message}
        </p>
        <p className="text-base text-gray-500 mb-8 leading-relaxed">
          {registrationSuccess.details}
        </p>
        {registrationSuccess.requestId && (
          <div className="bg-gray-100 p-4 rounded-lg mb-6 inline-block">
            <span className="font-bold mr-2">Request ID:</span>
            <span className="font-mono text-gray-800">
              {registrationSuccess.requestId}
            </span>
          </div>
        )}
        <Button
          variant="contained"
          color="success"
          onClick={handleSuccessClose}
          fullWidth
        >
          Return to Login
        </Button>
      </div>
    </div>
  );
}