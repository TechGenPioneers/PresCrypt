"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import NotificationIcon from "../../Patient/PatientComponents/NotificationIcon";
import { getProfileImage } from "../../Patient/services/PatientDataService";

export default function Header() {
  const [patientId, setPatientId] = useState(null);
  const [profileImage, setProfileImage] = useState("/profile.png");

  // Load patientId when component mounts and when localStorage changes
  useEffect(() => {
    const checkPatientId = () => {
      const id = localStorage.getItem("patientId");
      if (id && id !== patientId) {
        setPatientId(id);
      }
    };

    // Initial check
    checkPatientId();

    // Listen for localStorage changes (from other tabs/windows)
    const handleStorageChange = (event) => {
      if (event.key === "patientId") {
        checkPatientId();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Optional: poll for changes in same tab
    const interval = setInterval(checkPatientId, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [patientId]);

  // Fetch profile image when patientId is available
  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        if (patientId) {
          const image = await getProfileImage(patientId);
          if (image) {
            setProfileImage(image);
          }
        }
      } catch (error) {
        console.error("Error loading patient image:", error);
      }
    };

    fetchProfileImage();
  }, [patientId]);

  return (
    <header className="grid grid-cols-3 items-center px-6 py-4 shadow-md bg-white">
      {/* Left Placeholder */}
      <div className="p-2"></div>

      {/* Center Logo */}
      <div className="flex justify-center">
        <Image
          src="/logo.png"
          alt="logo"
          width={150}
          height={150}
          className="w-20 h-20 object-contain"
          quality={80}
        />
      </div>

      {/* Right Icons (Notification + Profile) */}
      <div className="flex justify-end space-x-12 items-center">
        <NotificationIcon patientId={patientId} />

        <Link href="/Patient/PatientProfile">
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-gray-300 hover:ring-2 ring-green-400 transition ml-6">
            <img
              src={profileImage}
              alt="User"
              className="w-full h-full object-cover"
            />
          </div>
        </Link>
      </div>
    </header>
  );
}
