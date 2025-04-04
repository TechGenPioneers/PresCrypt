"use client";
import React, { useState, useRef } from "react";
import { CloudUpload } from "lucide-react";

const PrescriptionModal = ({ isOpen, onClose, onSubmit }) => {
  const [isTextMode, setIsTextMode] = useState(false);
  const [prescriptionText, setPrescriptionText] = useState("");
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setPrescriptionFile(e.target.files[0]);
  };

  const handleTextChange = (e) => {
    setPrescriptionText(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(prescriptionText, prescriptionFile);
    onClose();
  };

  const triggerFileUpload = () => {
    fileInputRef.current.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bg-[#ffffffc0] inset-0 flex justify-center items-center z-50 text-[#094A4D]">
      <div className="bg-[#E9FAF2] p-6 rounded-[20px] shadow-2xl max-w-lg w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-2xl font-semibold text-[#094A4D] cursor-pointer"
        >
          &times;
        </button>

        <p className="flex justify-center text-xl font-semibold mb-4">
          Upload Prescription
        </p>

        <div className="flex flex-col items-center gap-4 mb-4">
          <button
            onClick={() => setIsTextMode(true)}
            className="px-4 py-2 rounded-[10px] text-[#094A4D] font-medium underline text-center cursor-pointer"
          >
            As Text
          </button>

          <p className="text-gray-600">or</p>
          <CloudUpload size={20} />
          <button
            onClick={triggerFileUpload}
            className="px-6 py-1 rounded-[15px] flex items-center justify-center gap-2 text-white bg-[#094A4D] cursor-pointer"
          >
            Browse Files
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {isTextMode ? (
            <div>
              <label className="block font-semibold mb-2">
                Prescription Text:
              </label>
              <textarea
                value={prescriptionText}
                onChange={handleTextChange}
                rows="4"
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter prescription text here..."
              />
              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  className="bg-[#094A4D] text-white px-4 py-2 rounded-[10px]"
                >
                  Submit
                </button>
              </div>
            </div>
          ) : (
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              {prescriptionFile && (
                <div className="mt-4">
                  <p className="flex justify-center text-sm text-gray-700 font-medium">
                    Selected File:
                  </p>
                  <p className="flex justify-center text-sm text-gray-700 font-medium">
                    <span className="font-semibold">
                      {prescriptionFile.name}
                    </span>
                  </p>
                  <div className="flex justify-end mt-4">
                    <button
                      type="submit"
                      className="bg-[#094A4D] text-white px-4 py-2 rounded-[10px]"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default PrescriptionModal;
