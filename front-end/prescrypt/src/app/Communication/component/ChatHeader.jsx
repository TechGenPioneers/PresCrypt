"use client";
import { useState, useRef, useEffect } from "react";
import { X, Video, Ban, Info } from "lucide-react";
import { GetUserDetails } from "../service/ChatService";
import {
  User,
  Phone,
  Calendar,
  Stethoscope,
  Activity,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const ChatHeader = ({
  selectedUser,
  setSelectedUser,
  onStartCall,
  onCloseChat,
  userRole,
  userId,
  isCallActive,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [details, setDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedUser(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setSelectedUser]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const handleMenu = async () => {
    setMenuOpen(true);
    setIsLoading(true);
    const response = await GetUserDetails(selectedUser.receiverId, userId);
    setDetails(response);
    setIsLoading(false);
  };

  if (!selectedUser) return null;

  return (
    <>
      <div className="p-4 border-b border-gray-200 bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div
            ref={dropdownRef}
            className="flex items-center gap-3 cursor-pointer hover:bg-emerald-100 py-1 pr-20 pl-2 rounded-md"
            onClick={handleMenu}
          >
            <div className="avatar w-11 h-11 rounded-full overflow-hidden ring-2 ring-emerald-200">
              <img
                src={
                  `data:image/jpeg;base64,${selectedUser.profileImage}` ||
                  "/profile.png"
                }
                alt="avatar"
              />
            </div>
            <h3 className="text-base font-semibold text-gray-800">
              {selectedUser.fullName}
            </h3>
          </div>

          <div className="flex items-center gap-4">
            {/* Only show video call button if onStartCall is provided and user is doctor */}
            {onStartCall && userRole === "Doctor" && (
              <button
                onClick={onStartCall}
                disabled={isCallActive}
                title={isCallActive ? "Call in progress" : "Start video call"}
                className={`p-2 rounded-full transition-colors ${
                  isCallActive
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-emerald-100 cursor-pointer"
                }`}
                aria-label="Start video call"
              >
                <Video className="w-6 h-6 text-emerald-700" />
              </button>
            )}
            <button
              onClick={() => setSelectedUser(null)}
              title="Close chat"
              className="p-2 rounded-full hover:bg-gray-100 transition"
            >
              <X className="w-5 h-5 text-gray-600 hover:text-red-500" />
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="mx-4 bg-white rounded-2xl  overflow-hidden border border-[#E9FAF2] sticky top-0 z-50">
          {isLoading ? (
            // Loading State
            <div className="flex items-center justify-center py-16">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-12 h-12 border-4 border-[#E9FAF2] border-t-[#50d094]  rounded-full animate-spin"></div>
                <p className="text-[#09424D] font-medium">Loading details...</p>
              </div>
            </div>
          ) : (
            <>
              {/* <div className="flex flex-col items-center text-center py-4">
                <div className="w-24 h-24 relative">
                  <img
                    src={
                      selectedUser.profileImage &&
                      selectedUser.profileImage.trim() !== ""
                        ? `data:image/jpeg;base64,${selectedUser.profileImage}`
                        : "/profile2.png"
                    }
                    alt="User Avatar"
                    className="w-full h-full rounded-full object-cover border border-gray-300"
                  />
                </div>
              </div> */}

              {/* Doctor Details */}
              {details?.patientStatus === null && (
                <div className="p-6 border-b border-[#E9FAF2]">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-[#E9FAF2] rounded-full flex items-center justify-center">
                      <Stethoscope className="w-5 h-5 text-[#09424D]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#09424D]">
                      Doctor Information
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">
                        Specialization
                      </span>
                      <span className="font-medium text-[#09424D]">
                        {details.specialization}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Gender</span>
                      <span className="font-medium text-[#09424D]">
                        {details.gender}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Status</span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          details?.doctorStatus
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {details?.doctorStatus
                          ? "Doctor is available"
                          : "Doctor is not available"}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg text-left">
                      <span className="text-gray-600 text-sm block mb-1">
                        Description
                      </span>
                      <p className="text-sm text-gray-700">
                        {details.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Patient Details */}
              {details?.patientStatus !== null && (
                <div className="p-6 border-b border-[#E9FAF2]">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-[#E9FAF2] rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-[#09424D]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#09424D]">
                      Patient Information
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        Phone Number
                      </span>
                      <span className="font-medium text-[#09424D] ml-auto">
                        {details.patientPhoneNumber}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Status</span>
                      <span className="px-3 py-1 bg-[#E9FAF2] text-[#09424D] rounded-full text-xs font-medium">
                        {details.patientStatus}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Appointment Details */}
              {(details?.lastAppointmentDate ||
                details?.lastAppointmentStatus) && (
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-[#E9FAF2] rounded-full flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-[#09424D]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#09424D]">
                      Last Appointment Details
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Date</span>
                      <span className="font-medium text-[#09424D]">
                        {details.lastAppointmentDate}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Status</span>
                      <div>
                        <span className="block text-xs text-gray-500">
                          {["Pending", "Rescheduled"].includes(
                            details.lastAppointmentStatus
                          )
                            ? "Incoming appointment"
                            : "Past appointment"}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            ["Pending", "Rescheduled"].includes(
                              details.lastAppointmentStatus
                            )
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {details.lastAppointmentStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Bottom Spacing */}
      <div className="h-6"></div>
    </>
  );
};

export default ChatHeader;
