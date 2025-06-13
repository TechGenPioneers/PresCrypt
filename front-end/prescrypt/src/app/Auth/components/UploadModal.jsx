"use client";
import React from "react";
import PropTypes from "prop-types";
import { X } from "lucide-react";
import { Button } from "@mui/material";

export default function UploadModal({
  showUploadModal,
  setShowUploadModal,
  handleFileUpload,
}) {
  const onFileChange = (e) => {
    console.log("File input changed:", e.target.files); // Debug log
    handleFileUpload(e);
  };

  return (
    showUploadModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg w-full max-w-sm shadow-lg">
          <div className="flex justify-between items-center p-4 border-b border-gray-100">
            <h3 className="text-base font-semibold">Upload ID Copy</h3>
            <button
              className="text-gray-600 hover:bg-gray-100 p-1 rounded"
              onClick={() => {
                console.log("Closing upload modal"); // Debug log
                setShowUploadModal(false);
              }}
            >
              <X size={20} />
            </button>
          </div>
          <div className="p-8 flex flex-col items-center text-center">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-teal-500 mb-4"
            >
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 16V8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 12L12 8L16 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-base font-medium mb-1">
              Upload ID Copy
              <span className="block text-xs text-gray-600 font-normal mt-1">
                (PNG, JPG, JPEG, or PDF format is accepted)
              </span>
            </p>
            <input
              type="file"
              id="fileUpload"
              className="hidden"
              accept="image/png,image/jpeg,image/jpg,application/pdf"
              onChange={onFileChange}
            />
            <label htmlFor="fileUpload" className="mt-4">
              <Button
                variant="contained"
                color="primary"
                component="span" // Ensures the button acts as a trigger for the file input
              >
                Browse Files
              </Button>
            </label>
          </div>
        </div>
      </div>
    )
  );
}
