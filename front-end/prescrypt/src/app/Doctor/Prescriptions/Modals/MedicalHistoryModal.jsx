"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Snackbar, Alert } from "@mui/material";
import { useRouter } from "next/navigation";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices"; // Icon for Medical History
import PersonIcon from "@mui/icons-material/Person"; // Icon for Patient Info
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // Icon for Approved
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty"; // Icon for Pending
import CancelIcon from "@mui/icons-material/Cancel"; // Icon for Denied
import WarningIcon from "@mui/icons-material/Warning"; // Icon for Unknown

const MedicalHistoryModal = ({ isOpen, onClose, patient }) => {
  const [error, setError] = useState(null);
  const [accessRequested, setAccessRequested] = useState(false);
  const [accessStatus, setAccessStatus] = useState(null);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "info" });

  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      fetchAccessStatus();
    } else {
      setError(null);
      setAccessRequested(false);
      setAccessStatus(null);
    }
  }, [isOpen]);

  const showSnack = (message, severity = "info") => {
    setSnack({ open: true, message, severity });
  };

  const fetchAccessStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found");

      const response = await fetch(
        `https://localhost:7021/api/AccessRequest/status?doctorId=D001&patientId=${patient?.patientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch access status");

      const data = await response.json();
      setAccessStatus(data.status); // "Approved", "Pending", "Denied", or null
      if (data.status === "Pending") setAccessRequested(true);
    } catch (err) {
      console.error("Access status error:", err);
      setAccessStatus("Unknown");
      showSnack("Unable to fetch access status", "error");
    }
  };

  const handleRequestAccess = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found");

      const response = await fetch(
        "https://localhost:7021/api/AccessRequest/request-patient-access",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            doctorId: "D001",
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
      setAccessStatus("Pending");
      showSnack("Access request sent successfully.", "success");
    } catch (err) {
      showSnack(err.message || "An unexpected error occurred.", "error");
    }
  };

  const handleViewHealthRecord = () => {
    router.push(`http://localhost:3000/Patient/PatientProfile/MedicalHistory/${patient.patientId}`);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-[#ffffffd8] flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl w-full max-w-2xl border border-gray-300 shadow-xl relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-black"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-2 mb-4">
            <MedicalServicesIcon color="primary" />
            <h2 className="text-2xl font-semibold text-[#094A4D]">
              Medical History Access
            </h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            You can request permission to view this patient's health records.
          </p>

          {/* Patient Info */}
          <div className="bg-[#F3F8F6] p-4 rounded-md mb-4 text-sm text-gray-800">
            <div className="flex items-center gap-2">
              <PersonIcon color="action" />
              <p><span className="font-semibold">Patient ID:</span> {patient?.patientId}</p>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <PersonIcon color="action" />
              <p><span className="font-semibold">Name:</span> {patient?.patientName}</p>
            </div>
          </div>

          {/* Status display */}
          {accessStatus === "Approved" && (
            <div className="mb-4 flex items-center gap-2 text-teal-600 bg-teal-100 px-4 py-2 rounded">
              <CheckCircleIcon />
              Access approved by patient. You may now view the records.
            </div>
          )}
          {accessStatus === "Pending" && (
            <div className="mb-4 flex items-center gap-2 text-blue-600 bg-blue-100 px-4 py-2 rounded">
              <HourglassEmptyIcon />
               Access request is pending. Please wait for patient approval.
            </div>
          )}
          {accessStatus === "Denied" && (
            <div className="mb-4 flex items-center gap-2 text-red-600 bg-red-100 px-4 py-2 rounded">
              <CancelIcon />
              ❌ Access denied by patient. You may try again later.
            </div>
          )}
          {accessStatus === "Unknown" && (
            <div className="mb-4 flex items-center gap-2 text-yellow-600 bg-yellow-100 px-4 py-2 rounded">
              <WarningIcon />
               Unable to determine access status at the moment.
            </div>
          )}

          {/* Request Button / View Button */}
          {accessStatus === "Approved" ? (
            <button
              onClick={handleViewHealthRecord}
              className="mt-3 w-full bg-teal-600 hover:bg-green-700 text-white py-2 rounded-lg transition flex items-center justify-center gap-2"
            >
              <MedicalServicesIcon />
              View Medical Health Record
            </button>
          ) : (
            <button
              onClick={handleRequestAccess}
              disabled={accessRequested || accessStatus === "Pending"}
              className={`mt-3 w-full py-2 rounded-lg transition flex items-center justify-center gap-2 ${
                accessRequested || accessStatus === "Pending"
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#094A4D] hover:bg-[#006469] text-white"
              }`}
            >
              <MedicalServicesIcon />
              {accessRequested || accessStatus === "Pending"
                ? "Access Request Sent – Awaiting Response"
                : "Request Access"}
            </button>
          )}
        </div>
      </div>

      {/* Snackbar for success or errors */}
      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnack({ ...snack, open: false })}
          severity={snack.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default MedicalHistoryModal;