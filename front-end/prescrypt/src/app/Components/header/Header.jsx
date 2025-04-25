"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
      <div className="flex justify-end space-x-4 items-center">
        {/* Notification Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          width="25"
          height="25"
          className="text-gray-600"
        >
          <path d="M224 0c-17.7 0-32 14.3-32 32v19.2C119 66 64 130.6 64 208v18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416h384c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8v-18.8c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32zM269.3 493.3c12-12 18.7-28.3 18.7-45.3h-64c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7 33.3-6.7 45.3-18.7z" />
        </svg>

        {/* Profile Image with Link */}
        <Link href="/Patient/PatientProfile">
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-gray-300 hover:ring-2 ring-green-400 transition">
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
