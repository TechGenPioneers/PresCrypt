"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import DoctorDashboardService from "../services/DoctorDashboardService";
import DoctorProfileImageService from "../services/DoctorProfileImageService";
import LogoutConfirmationDialog from "./LogoutConfirmationDialog"; // Import the component
import useAuthGuard from "@/utils/useAuthGuard";
export default function Sidebar() {
  useAuthGuard("Doctor"); // Ensure the user is authenticated as a Doctor
  const [isExpanded, setIsExpanded] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false); // Add state for dialog
  const pathname = usePathname();
  const router = useRouter();
  const doctorId =
    typeof window !== "undefined" ? localStorage.getItem("doctorId") : null;
  const [userName, setUserName] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      const profile = await DoctorDashboardService.getProfile(doctorId);
      if (profile.name) {
        setUserName(profile.name);
      }
      if (profile?.doctorImage) {
        setProfileImage(profile.doctorImage);
      }
    }
    fetchProfile();
  }, [doctorId]);

  const handleLogoutClick = (e) => {
    e.preventDefault();
    setLogoutDialogOpen(true);
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  const handleLogoutConfirm = async () => {
    setLogoutDialogOpen(false);
    
    try {
      await axios.post("https://localhost:7021/api/User/logout", null, {
        withCredentials: true,
      });
    } catch (err) {
      console.warn("Backend logout failed (may not be using cookies):", err);
    }
    localStorage.removeItem("doctorId");
    localStorage.clear();
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");

    router.push("/Auth/login");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      if (!file.type.match("image.*")) {
        setUploadError("Please select an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setUploadError("File size should be less than 5MB");
        return;
      }
      setSelectedFile(file);
      setUploadError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);

      const imageBase64 = await DoctorProfileImageService.uploadImage(
        doctorId,
        selectedFile
      );

      setProfileImage(imageBase64);
      setShowImageModal(false);
      setSelectedFile(null);
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadError("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const collapsedWidth = 128; // 8rem in pixels
  const expandedWidth = 256; // 16rem in pixels

  return (
      <div
        className={`h-full bg-white shadow-2xl font-medium font-sans transition-all duration-300 ease-in-out flex flex-col fixed left-0 top-0 z-50`}
        style={{
          width: isExpanded ? "16rem" : "8rem",
        }}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Logo */}
        <div className="flex justify-center items-center mt-4 mb-8">
          <Image src="/logo.png" alt="logo" width={100} height={100} />
        </div>

      {/* Profile */}
      <div className="flex items-center ml-3 py-2 flex-shrink-0 transition-all duration-500 ease-in-out" style={{ justifyContent: isExpanded ? 'flex-start' : 'center', paddingLeft: isExpanded ? '16px' : '0px' }}>
        <button
          onClick={() => setShowImageModal(true)}
          className="relative group flex-shrink-0"
        >
          {profileImage ? (
            <Image
              src={`data:image/jpeg;base64,${profileImage}`}
              alt="profile"
              width={50}
              height={50}
              unoptimized
              className="rounded-full cursor-pointer hover:opacity-80 transition-opacity"
            />
          ) : (
            <Image
              src="/profile.png"
              alt="profile"
              width={50}
              height={50}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            />
          )}
          <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50 rounded-full text-white text-xs cursor-pointer">
            Edit
          </span>
        </button>
        <div 
          className="ml-4 whitespace-nowrap transition-all duration-500 ease-in-out overflow-hidden"
          style={{
            width: isExpanded ? '140px' : '0px',
            opacity: isExpanded ? 1 : 0,
          }}
        >
          <p className="font-bold text-[#033A3D] text-[17px]">
            {userName || "Loading..."}
          </p>
        </div>
      </div>

      {/* Image Upload Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4 text-[#033A3D]">
              Update Profile Picture
            </h2>

            {/* File selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select an image
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-4 text-gray-500"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span>{" "}
                      or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG (MAX. 5MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {selectedFile && (
              <div className="mb-4">
                <div className="flex items-center justify-center mb-2">
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Preview"
                    className="h-32 w-32 object-cover rounded-full"
                  />
                </div>
                <p className="text-sm text-center text-gray-600">
                  {selectedFile.name} (
                  {(selectedFile.size / 1024).toFixed(2)} KB)
                </p>
              </div>
            )}

            {/* Error message */}
            {uploadError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {uploadError}
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowImageModal(false);
                  setSelectedFile(null);
                  setUploadError(null);
                }}
                disabled={isUploading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${
                  !selectedFile || isUploading
                    ? "bg-[#033A3D]/50 cursor-not-allowed"
                    : "bg-[#033A3D] hover:bg-[#033A3D]/90"
                }`}
              >
                {isUploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex flex-col items-center px-2 text-black text-xl font-bold mt-4 flex-grow overflow-hidden">
        <ul className="flex flex-col items-center w-full">
          {[
            {
              img: "/image11.png",
              label: "Dashboard",
              path: "/Doctor/DoctorDashboard",
            },
            {
              img: "/image12.png",
              label: "Patients",
              path: "/Doctor/DoctorPatients",
            },
            {
              img: "/clock13.png",
              label: "Appointments",
              path: "/Doctor/DoctorAppointments",
            },
            {
              img: "/image14.png",
              label: "Prescriptions",
              path: "/Doctor/Prescriptions",
            },
            {
              img: "/image18.png",
              label: "TeleHealth",
              path: "/Communication",
            },
            {
              img: "/image20.png",
              label: "Reports",
              path: "/Doctor/Reports",
            },
          ].map((item, index) => (
            <li key={index} className="mb-4 w-full flex justify-center">
              <Link
                href={item.path}
                className={`flex items-center transition-all duration-500 ease-in-out overflow-hidden ${
                  pathname === item.path
                    ? "border border-[#033A3D] bg-[#9debc78d] text-[#033A3D] font-bold shadow-md"
                    : "border border-transparent hover:border-[#033A3D] hover:bg-[#9debc74b] text-black"
                }`}
                style={{
                  width: isExpanded ? "90%" : "50px",
                  height: "50px",
                  borderRadius: isExpanded ? "20px" : "50px",
                  paddingLeft: isExpanded ? "20px" : "0",
                  justifyContent: isExpanded ? "flex-start" : "center",
                }}
              >
                <img src={item.img} alt={item.label} className="w-5 h-auto ml-1 flex-shrink-0" />
                <span 
                  className="text-[15px] whitespace-nowrap ml-2 transition-all duration-500 ease-in-out overflow-hidden"
                  style={{
                    width: isExpanded ? 'auto' : '0px',
                    opacity: isExpanded ? 1 : 0,
                    transform: isExpanded ? 'translateX(0)' : 'translateX(-10px)',
                  }}
                >
                  {item.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>


      {/* Logout Button */}
      <div className="w-full px-2 pb-4 flex-shrink-0">
        <div className="w-full flex justify-center">
          <a
            href="/Auth/login"
            className="flex items-center hover:border hover:border-red-800 hover:bg-red-200 transition-all duration-500 ease-in-out overflow-hidden"
            onClick={handleLogoutClick}
            style={{
              width: isExpanded ? "90%" : "50px",
              height: "50px",
              borderRadius: isExpanded ? "20px" : "50px",
              paddingLeft: isExpanded ? "20px" : "0",
              justifyContent: isExpanded ? "flex-start" : "center",
            }}
          >
            <img src="/image28.png" alt="Logout" className="w-5 h-5 flex-shrink-0" />
            <span 
              className="text-red-600 text-[15px] whitespace-nowrap ml-2 font-bold transition-all duration-500 ease-in-out overflow-hidden"
              style={{
                width: isExpanded ? 'auto' : '0px',
                opacity: isExpanded ? 1 : 0,
                transform: isExpanded ? 'translateX(0)' : 'translateX(-10px)',
              }}
            >
              Logout
            </span>
          </a>

        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <LogoutConfirmationDialog
        open={logoutDialogOpen}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        title="Doctor Logout"
        message="Are you sure you want to log out of your doctor account? You'll need to sign in again to access your dashboard."
      />
    </div>
  );
}