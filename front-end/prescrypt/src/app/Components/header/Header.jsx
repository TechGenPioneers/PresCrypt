"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import NotificationIcon from "../../Patient/PatientComponents/NotificationIcon";
import axios from "axios";

export default function Header({ patientId = "P021" }) {
  const [profileImage, setProfileImage] = useState("/profile.png"); // fallback/default
  const [patientName, setPatientName] = useState("User");

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7021/api/Patient/profileImage/${patientId}`,
          { responseType: "arraybuffer" }
        );
        const base64Image = Buffer.from(response.data, "binary").toString("base64");
        setProfileImage(`data:image/jpeg;base64,${base64Image}`);
      } catch (error) {
        console.error("Error fetching profile image:", error);
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

      {/* Right Icons (bell and profile) */}
     {/* Right Icons (Notification + Profile) */}
<div className="flex justify-end space-x-12 items-center">
  {/* Notification Icon with Popup */}
  <NotificationIcon userId={patientId} />

  {/* Profile Image with Link */}
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

