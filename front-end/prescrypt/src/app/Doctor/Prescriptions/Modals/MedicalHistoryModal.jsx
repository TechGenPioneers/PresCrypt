"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

const MedicalHistoryModal = ({ isOpen, onClose, patient }) => {
  const [error, setError] = useState(null);
  const [accessRequested, setAccessRequested] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setError(null);
      setAccessRequested(false);
    }
  }, [isOpen]);

  // Simulate access request
  const handleRequestAccess = async () => {
    try {
      setError(null);
      // Simulate delay for UX
      await new Promise((res) => setTimeout(res, 500));
      setAccessRequested(true);
    } catch {
      setError("Failed to send access request");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#ffffffc0] flex items-center justify-center z-50">
      <div className="bg-[#E9FAF2] p-2 rounded-[20px] w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 rounded-[20px] border-2 border-dashed border-black">
          {/* Close button */}
          <div className="flex justify-end">
            <button onClick={onClose} aria-label="Close modal" className="cursor-pointer">
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Patient info */}
          <div className="mb-4">
            <h2 className="text-xl font-bold text-[#094A4D]">Medical History</h2>
            <p className="text-sm text-gray-700">Patient ID: {patient?.patientId || "N/A"}</p>
            <p className="text-sm text-gray-700">Name: {patient?.patientName || "N/A"}</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
              <p>{error}</p>
            </div>
          )}

          {/* Access request or confirmation */}
          {accessRequested ? (
            <div className="mb-6 p-4 bg-blue-100 text-blue-800 rounded-lg">
              <p>
                Request has been sent to the patient. Once they allow you, you can view the
                profile.
              </p>
            </div>
          ) : (
            <div className="mb-6 text-center">
              <button
                onClick={handleRequestAccess}
                className="px-4 py-2 bg-[#094A4D] text-white rounded-[10px] hover:bg-[#006469] cursor-pointer"
              >
                Request Access
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalHistoryModal;
