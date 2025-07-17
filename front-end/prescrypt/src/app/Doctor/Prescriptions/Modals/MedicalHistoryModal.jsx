"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

const MedicalHistoryModal = ({ isOpen, onClose, patient }) => {
  const [error, setError] = useState(null);
  const [accessRequested, setAccessRequested] = useState(false);
  const [Status, setAccessStatus] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setError(null);
      setAccessRequested(false);
      setAccessStatus(null);
    } else {
      fetchAccessStatus(); // fetch when modal opens
    }
  }, [isOpen]);

  const handleRequestAccess = async () => {
    try {
      setError(null);

      const token = localStorage.getItem("token"); // Your JWT token (already stored)

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(
        "https://localhost:7021/api/Doctor/request-patient-access",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            doctorId: "D001", // 🔒 Hardcoded doctor ID (replace later)
            patientId: patient?.patientId,
            title: "Request to View Medical History",
            message: "Doctor requests access to your medical history.",
          }),
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData?.message || "Failed to request access.");
      }

      setAccessRequested(true);
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    }
  };
  const fetchAccessStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found");

      const response = await fetch(
        `https://localhost:7021/api/AccessRequest/status?doctorId=D001&patientId=p021`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch access status");
      }

      const data = await response.json();
      setAccessStatus(data.status); // "Approved", "Pending", "Denied"
    } catch (err) {
      console.error("Access status error:", err);
      setAccessStatus("Unknown");
    }
  };
  const handleViewHealthRecord = () => {
    // Redirect or open a new page or modal with full record
    alert("Opening Medical Record...");
    // Or: router.push(`/doctor/view-records/${patient.patientId}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#ffffffc0] flex items-center justify-center z-50">
      <div className="bg-[#E9FAF2] p-2 rounded-[20px] w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 rounded-[20px] border-2 border-dashed border-black">
          {/* Close button */}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="cursor-pointer"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Patient info */}
          <div className="mb-4">
            <h2 className="text-xl font-bold text-[#094A4D]">
              Medical History
            </h2>
            <p className="text-sm text-gray-700">
              Patient ID: {patient?.patientId || "N/A"}
            </p>
            <p className="text-sm text-gray-700">
              Name: {patient?.patientName || "N/A"}
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
              <p>{error}</p>
            </div>
          )}

          {/* Access request confirmation */}
          {accessRequested ? (
            <div className="mb-6 p-4 bg-blue-100 text-blue-800 rounded-lg">
              <p>
                Request has been sent to the patient. Once they approve, you can
                view the profile.
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
          {Status === "Approved" ? (
            <button onClick={handleViewHealthRecord}>
              View Medical Health Record
            </button>
          ) : (
            <p>Access not granted or expired.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalHistoryModal;
