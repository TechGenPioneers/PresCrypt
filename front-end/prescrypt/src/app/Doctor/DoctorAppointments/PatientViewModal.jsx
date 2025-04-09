import React, { useState, useRef } from "react";
import { CloudUpload } from "lucide-react";

export default function PatientViewModal({
  isOpen,
  onClose,
  patient,
  onSubmitPrescription,
}) {
  const [isTextMode, setIsTextMode] = useState(false); // Default: file mode
  const [prescriptionText, setPrescriptionText] = useState("");
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen || !patient) return null;

  const handleTextChange = (e) => setPrescriptionText(e.target.value);
  const handleFileChange = (e) => setPrescriptionFile(e.target.files[0]);
  const triggerFileUpload = () => fileInputRef.current.click();

  const handleToggleMode = () => {
    setIsTextMode((prev) => !prev);
    setPrescriptionText("");
    setPrescriptionFile(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitPrescription(prescriptionText, prescriptionFile);
    onClose();
  };

  return (
    <div className="fixed bg-[#ffffffc0] inset-0 flex items-center justify-center z-50 text-[#094A4D]">
      <div className="bg-[#E9FAF2] rounded-[20px] shadow-2xl p-1 gap-x-6 max-w-3xl w-full">
        <div className="p-6 rounded-[20px] flex flex-col md:flex-row relative border-2 border-dashed border-black">
        <button
          onClick={onClose}
          className="absolute top-3 right-6 text-2xl font-semibold text-[#094A4D] cursor-pointer"
        >
          &times;
        </button>

        {/* Patient Info */}
        <div className="w-full md:w-1/2 p-5">
          <h2 className="text-xl font-semibold mb-4 text-black">
            Patient Details: {patient.patientId}
          </h2>
          <div className="flex items-center gap-4 mb-4">
            <img
              src={`data:image/jpeg;base64,${patient.profileImage}`}
              alt="Patient"
              className="w-24 h-24 rounded-full object-cover"
            />
            <div className="pl-5 font-medium text-[18px]">
              <p>{patient.patientName}</p>
              <p>
                {patient.gender === "M"
                  ? "Male"
                  : patient.gender === "F"
                  ? "Female"
                  : "Other"}
              </p>
              <p>
                {new Date().getFullYear() - new Date(patient.dob).getFullYear()}{" "}
                years
              </p>
            </div>
          </div>
          <div className="font-semibold">Hospital:</div>
          {patient.hospitalName}
          <div className="font-semibold pt-3">Appointment Time:</div>
          {patient.time}
          <div className="font-semibold pt-3">{patient.status}</div>
        </div>

        {/* Prescription Upload */}
        <div className="w-full md:w-1/2 p-5">
          <p className="text-xl font-semibold mb-4 text-center text-black">
            Add Prescription
          </p>

          <div className="flex flex-col items-center gap-4 mb-4">
            <button
              onClick={handleToggleMode}
              className="px-4 py-2 rounded-[10px] text-[#094A4D] font-medium underline cursor-pointer"
            >
              {isTextMode ? "Upload As File" : "Upload As Text"}
            </button>

            {!isTextMode && (
              <>
                <p className="text-gray-600">or</p>
                <CloudUpload size={20} />
                <button
                  onClick={triggerFileUpload}
                  className="px-6 py-1 rounded-[15px] flex items-center justify-center gap-2 text-white bg-[#094A4D] cursor-pointer"
                >
                  Browse Files
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </>
            )}
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
              </div>
            ) : (
              prescriptionFile && (
                <div className="text-center">
                  <p className="text-sm text-gray-700 font-medium">
                    Selected File: {prescriptionFile.name}
                  </p>
                </div>
              )
            )}

            {(isTextMode || prescriptionFile) && (
              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  className="bg-[#094A4D] text-white px-4 py-2 rounded-[10px]"
                >
                  Submit
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
      </div>
    </div>
  );
}
