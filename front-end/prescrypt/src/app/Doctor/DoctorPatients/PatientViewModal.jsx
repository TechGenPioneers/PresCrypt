// "use client";

import { useState, useEffect } from "react";
import { X, Clock, CheckCircle, XCircle } from "lucide-react";

const MedicalHistoryModal = ({ isOpen, onClose, patient }) => {
  const [error, setError] = useState(null);
  const [accessStatus, setAccessStatus] = useState("NotRequested");
  const [loading, setLoading] = useState(false);
  const [accessExpiry, setAccessExpiry] = useState(null);

  const doctorId = "D001"; // Replace with actual doctor ID from authentication

  useEffect(() => {
    if (isOpen && patient) {
      checkAccessStatus();
    }
    if (!isOpen) {
      setError(null);
      setAccessStatus("NotRequested");
      setAccessExpiry(null);
    }
  }, [isOpen, patient]);

const checkAccessStatus = async () => {
  try {
    const response = await fetch(`/api/AccessRequest/check-access-status?doctorId=d001&patientId=p021`);
    const data = await response.json();

    if (data.status === "Approved") {
      setStatus("Approved");
    } else if (data.status === "Expired") {
      setStatus("Expired");
    } else {
      setStatus("Pending");
    }
  } catch (error) {
    console.error("Error checking access status:", error);
  }
};

// Call this inside useEffect when component loads
useEffect(() => {
  checkAccessStatus();
}, []);


  const handleRequestAccess = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch("https://localhost:7021/api/AccessRequest/request-patient-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          doctorId: doctorId,
          patientId: patient?.patientId,
          title: "Request to View Medical History",
          message: "Doctor requests access to your medical history.",
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData?.message || "Failed to request access.");
      }

      setAccessStatus("Pending");
      
      // Start polling for status updates
      const pollInterval = setInterval(async () => {
        await checkAccessStatus();
      }, 2000); // Check every 3 seconds

      // Clean up interval after 5 minutes
      setTimeout(() => {
        clearInterval(pollInterval);
      }, 300000);

    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewMedicalData = () => {
    // Navigate to medical data page
    window.location.href = `/doctor/patient-medical-data/${patient.patientId}`;
  };

  const renderAccessStatus = () => {
    switch (accessStatus) {
      case "NotRequested":
        return (
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              You need to request access to view this patient's medical history.
            </p>
            <button
              onClick={handleRequestAccess}
              disabled={loading}
              className="px-6 py-2 bg-[#094A4D] text-white rounded-[10px] hover:bg-[#006469] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Requesting..." : "Request Access"}
            </button>
          </div>
        );

      case "Pending":
        return (
          <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <Clock className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              Access Request Pending
            </h3>
            <p className="text-yellow-700">
              Your request has been sent to the patient. Please wait for their response.
            </p>
          </div>
        );

      case "Approved":
        return (
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Access Granted
            </h3>
            <p className="text-green-700 mb-4">
              Patient has granted you access to their medical history.
              {accessExpiry && (
                <span className="block text-sm mt-1">
                  Access expires: {new Date(accessExpiry).toLocaleString()}
                </span>
              )}
            </p>
            <button
              onClick={handleViewMedicalData}
              className="px-6 py-2 bg-green-600 text-white rounded-[10px] hover:bg-green-700"
            >
              View Medical Data
            </button>
          </div>
        );

      case "Denied":
        return (
          <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Access Denied
            </h3>
            <p className="text-red-700 mb-4">
              The patient has denied your request to access their medical history.
            </p>
            <button
              onClick={handleRequestAccess}
              disabled={loading}
              className="px-4 py-2 bg-[#094A4D] text-white rounded-[10px] hover:bg-[#006469] disabled:opacity-50"
            >
              {loading ? "Requesting..." : "Request Again"}
            </button>
          </div>
        );

      case "Expired":
        return (
          <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
            <Clock className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Access Expired
            </h3>
            <p className="text-gray-700 mb-4">
              Your access to this patient's medical history has expired.
            </p>
            <button
              onClick={handleRequestAccess}
              disabled={loading}
              className="px-4 py-2 bg-[#094A4D] text-white rounded-[10px] hover:bg-[#006469] disabled:opacity-50"
            >
              {loading ? "Requesting..." : "Request New Access"}
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#E9FAF2] p-2 rounded-[20px] w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 rounded-[20px] border-2 border-dashed border-black">
          {/* Close button */}
          <div className="flex justify-end">
            <button onClick={onClose} aria-label="Close modal" className="cursor-pointer">
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Patient info */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#094A4D] mb-2">Medical History</h2>
            <div className="text-sm text-gray-700 space-y-1">
              <p><strong>Patient ID:</strong> {patient?.patientId || "N/A"}</p>
              <p><strong>Name:</strong> {patient?.patientName || "N/A"}</p>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
              <p>{error}</p>
            </div>
          )}

          {/* Access status content */}
          <div className="mb-6">
            {renderAccessStatus()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalHistoryModal;