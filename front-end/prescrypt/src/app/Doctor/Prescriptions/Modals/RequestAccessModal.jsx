"use client";
import { useState } from "react";

const RequestAccessModal = ({ isOpen, onClose, patient, onRequestSubmit }) => {
  const [requestReason, setRequestReason] = useState("");

  if (!isOpen || !patient) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-11/12 max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#094A4D]">
            Request Medical History Access
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        
        <div className="mb-4">
          <p className="mb-2">You are requesting access to medical records for:</p>
          <p className="font-semibold">{patient.patientName} (ID: {patient.patientId})</p>
        </div>
        
        <div className="mb-4">
          <label htmlFor="requestReason" className="block mb-2 font-medium">
            Reason for request:
          </label>
          <textarea
            id="requestReason"
            className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-[#094A4D]"
            rows="3"
            value={requestReason}
            onChange={(e) => setRequestReason(e.target.value)}
            placeholder="Explain why you need access to this patient's medical history"
          ></textarea>
        </div>
        
        <div className="flex justify-end space-x-4">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-[#094A4D] text-[#094A4D] rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button 
            className="px-4 py-2 bg-[#094A4D] text-white rounded hover:bg-[#006469]"
            onClick={() => {
              onRequestSubmit(requestReason);
              setRequestReason("");
            }}
          >
            Request Access
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestAccessModal;