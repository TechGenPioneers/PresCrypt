import React from "react";
import { X } from "lucide-react";

export default function PatientViewModal({ isOpen, onClose, patient }) {
  if (!isOpen || !patient) return null;

  return (
    <div className="fixed bg-[#ffffffc0] inset-0 flex items-center justify-center z-50">
      <div className="bg-[#E9FAF2] rounded-[20px] shadow-2xl p-1 max-w-3xl w-full">
        <div className="p-6 rounded-[20px] flex flex-col md:flex-row relative border-2 border-dashed border-black">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>

          {/* Patient Info */}
          <div className="flex w-full justify-between">
            <div className="w-1/2 p-5">
              <h2 className="text-xl font-bold mb-4 text-black">
                Patient Details
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={`data:image/jpeg;base64,${patient.profileImage}`}
                    alt="Patient"
                    className="w-30 h-30 rounded-full object-cover border-2 border-[#094A4D]"
                  />{" "}
                  {/* add default image */}
                  <div>
                    <h3 className="text-lg font-semibold">
                      {patient.patientName}
                    </h3>
                    <p className="text-gray-600">
                      {patient.gender === "M" ? "Male" : "Female"},{" "}
                      {new Date().getFullYear() -
                        new Date(patient.dob).getFullYear()}{" "}
                      years
                    </p>
                    <p className="text-sm text-gray-500">
                      ID: {patient.patientId}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hospital, Date, Time, Status */}
            <div className="w-1/2 p-5">
              <div className="font-semibold">Hospital:</div>
              {patient.hospitalName}
              <div className="font-semibold pt-3">Last Visit:</div>
              <div>
                Date:{" "}
                {new Date(patient.date).toLocaleString([], {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                })}
              </div>
              <div>Time: {patient.time}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
