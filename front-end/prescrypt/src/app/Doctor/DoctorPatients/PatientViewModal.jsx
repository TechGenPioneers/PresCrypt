import React from "react";
import { X, User, Calendar, Clock, Building2, CreditCard } from "lucide-react";

export default function PatientViewModal({ isOpen, onClose, patient }) {
  if (!isOpen || !patient) return null;

  return (
    <div className="fixed bg-[#ffffffc0] backdrop-blur-sm inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-teal-50 to-teal-50/80 rounded-3xl shadow-2xl p-2 max-w-4xl w-full border border-teal-500/20">
        <div className="bg-white p-8 rounded-2xl flex flex-col md:flex-row relative shadow-lg border border-teal-500/20">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-teal-50 rounded-full cursor-pointer transition-all duration-200 group z-10"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 text-teal-500/60 group-hover:text-teal-500 transition-colors duration-200" />
          </button>

          {/* Patient Info Section */}
          <div className="flex w-full justify-between gap-8">
            {/* Left Side - Patient Details */}
            <div className="w-1/2 space-y-6">
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl shadow-lg">
                  <User className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-teal-800">
                  Patient Details
                </h2>
              </div>

              {/* Patient Profile Card */}
              <div className="bg-gradient-to-r from-teal-50/50 to-teal-50/30 p-6 rounded-2xl border border-teal-500/20 shadow-sm">
                <div className="flex items-center gap-6">
                  {/* Profile Image */}
                  <div className="relative">
                    <img
                      src={
                        patient.profileImage
                          ? `data:image/jpeg;base64,${patient.profileImage}`
                          : "/patient.png"
                      }
                      alt="Profile"
                      className="w-40 h-40 rounded-full border-2 border-teal-500/20 shadow-sm object-cover object-top bg-white"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/patient.png";
                      }}
                    />
                  </div>

                  {/* Patient Info */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-teal-600 mb-2">
                      {patient.patientName}
                    </h3>
                    <div className="space-y-1">
                      <p className="text-black font-medium">
                        {patient.gender === "M" ? "Male" : "Female"},{" "}
                        {new Date().getFullYear() -
                          new Date(patient.dob).getFullYear()}{" "}
                        years old
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <div className="p-1.5 bg-teal-500/10 rounded-lg">
                          <CreditCard className="w-4 h-4 text-teal-500" />
                        </div>
                        <p className="text-sm text-black font-medium">
                          ID: {patient.patientId}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Hospital & Visit Info */}
            <div className="w-1/2 space-y-6">
              {/* Hospital Information */}
              <div className="bg-gradient-to-r from-teal-50/50 to-teal-50/30 p-6 rounded-2xl border border-teal-500/20 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-teal-500/10 rounded-xl">
                    <Building2 className="w-5 h-5 text-teal-500" />
                  </div>
                  <h3 className="text-lg font-bold text-teal-800">Hospital</h3>
                </div>
                <p className="text-teal-800 font-semibold text-lg pl-2">
                  {patient.hospitalName}
                </p>
              </div>

              {/* Last Visit Information */}
              <div className="bg-gradient-to-r from-teal-50/50 to-teal-50/30 p-6 rounded-2xl border border-teal-500/20 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-teal-500/10 rounded-xl">
                    <Calendar className="w-5 h-5 text-teal-500" />
                  </div>
                  <h3 className="text-lg font-bold text-teal-800">
                    Last Visit
                  </h3>
                </div>

                <div className="space-y-3 pl-2">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-teal-500/60" />
                      <span className="text-sm font-medium text-teal-500/70">
                        Date:
                      </span>
                    </div>
                    <span className="text-teal-800 font-semibold">
                      {new Date(patient.date).toLocaleString([], {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-teal-500/60" />
                      <span className="text-sm font-medium text-teal-500/70">
                        Time:
                      </span>
                    </div>
                    <span className="text-teal-800 font-semibold">
                      {patient.time}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}