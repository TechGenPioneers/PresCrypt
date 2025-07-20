"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import DoctorDashboardService from "../services/DoctorDashboardService";

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
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
      if (profile.image) {
        setProfileImage(profile.image);
      }
    }
    fetchProfile();
  }, [doctorId]);

  const handleLogout = async (e) => {
    e.preventDefault();
    const ok = window.confirm("Are you sure you want to log out?");
    if (!ok) return;

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
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setUploadError("File size should be less than 5MB");
        return;
      }
      setSelectedFile(file);
      setUploadError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("doctorId", doctorId);

    try {
      setUploadProgress(0);
      const response = await axios.post(
        "https://localhost:7021/api/Doctor/upload-profile-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      if (response.data.success) {
        setProfileImage(response.data.imageUrl);
        setShowImageModal(false);
        setSelectedFile(null);
        setUploadProgress(0);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadError("Failed to upload image. Please try again.");
    }
  };

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
      <div className="flex justify-center p-2">
        <button 
          onClick={() => setShowImageModal(true)}
          className="relative group"
        >
          {profileImage ? (
            <Image
              src={profileImage}
              alt="profile"
              width={40}
              height={40}
              className="rounded-full cursor-pointer hover:opacity-80 transition-opacity"
            />
          ) : (
            <Image 
              src="/profile.png" 
              alt="profile" 
              width={40} 
              height={40} 
              className="cursor-pointer hover:opacity-80 transition-opacity"
            />
          )}
          <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50 rounded-full text-white text-xs">
            Edit
          </span>
        </button>
        {isExpanded && (
          <div className="flex justify-center ml-4 whitespace-nowrap mt-2">
            <p className="font-bold text-[#033A3D] text-[17px]">
              {userName || "Loading..."}
            </p>
          </div>
        )}
      </div>

      {/* Image Upload Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[#033A3D]">Upload Profile Image</h3>
              <button 
                onClick={() => {
                  setShowImageModal(false);
                  setSelectedFile(null);
                  setUploadError(null);
                  setUploadProgress(0);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select an image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-[#033A3D] file:text-white
                  hover:file:bg-[#033A3D]/90"
              />
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
                  {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                </p>
              </div>
            )}
            
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div
                  className="bg-[#033A3D] h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
                <p className="text-xs text-center mt-1">
                  Uploading: {uploadProgress}%
                </p>
              </div>
            )}
            
            {uploadError && (
              <div className="mb-4 text-red-500 text-sm">{uploadError}</div>
            )}
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowImageModal(false);
                  setSelectedFile(null);
                  setUploadError(null);
                  setUploadProgress(0);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!selectedFile || uploadProgress > 0}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                  !selectedFile || uploadProgress > 0
                    ? "bg-[#033A3D]/50 cursor-not-allowed"
                    : "bg-[#033A3D] hover:bg-[#033A3D]/90"
                }`}
              >
                {uploadProgress > 0 ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex flex-col items-center p-2 text-black text-xl font-bold mt-4 flex-grow">
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
                className={`flex items-center p-2 border-1 rounded-full transition-all duration-300 ${
                  pathname === item.path
                    ? "border-[#033A3D] bg-[#033A3D]/20 text-[#033A3D] font-bold shadow-md"
                    : "border-transparent hover:border-[#033A3D] hover:bg-[#033a3d32] text-black"
                }`}
                style={{
                  width: isExpanded ? "90%" : "50px",
                  height: "50px",
                  justifyContent: isExpanded ? "flex-start" : "center",
                  paddingLeft: isExpanded ? "20px" : "8px",
                  borderRadius: isExpanded ? "20px" : "100%",
                }}
              >
                <img src={item.img} alt={item.label} className="w-5 h-5" />
                {isExpanded && (
                  <span className="text-[15px] whitespace-nowrap ml-2">
                    {item.label}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div
        className="w-full p-2 mt-5"
        style={{
          width: isExpanded ? "16rem" : "8rem",
        }}
      >
        <li className="mb-4 w-full flex justify-center">
          <a
            href="/Auth/login"
            className="flex items-center p-2 hover:border-1 rounded-full transition-all duration-300 hover:border-[#033A3D] hover:bg-[#033a3d32]"
            onClick={handleLogout}
            style={{
              width: isExpanded ? "90%" : "50px",
              height: "50px",
              justifyContent: isExpanded ? "flex-start" : "center",
              paddingLeft: isExpanded ? "20px" : "8px",
              borderRadius: isExpanded ? "20px" : "100%",
            }}
          >
            <img src="/image28.png" alt="Logout" className="w-5 h-5" />
            {isExpanded && (
              <span className="text-[#033A3D] text-[15px] whitespace-nowrap ml-2 font-bold">
                Logout
              </span>
            )}
          </a>
        </li>
      </div>
    </div>
  );
}