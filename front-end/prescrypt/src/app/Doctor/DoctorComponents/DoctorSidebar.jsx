"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // added useRouter for navigation
import axios from "axios";
import DoctorDashboardService from "../services/DoctorDashboardService";

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();
  const router = useRouter(); // for redirect after logout
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
    localStorage.clear(); // remove other items if needed
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");

    router.push("/Auth/login");
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
        {profileImage ? (
          <Image
            src={profileImage}
            alt="profile"
            width={40}
            height={40}
            className="rounded-full"
          />
        ) : (
          <Image src="/profile.png" alt="profile" width={40} height={40} />
        )}
        {isExpanded && (
          <div className="flex justify-center ml-4 whitespace-nowrap mt-2">
            <p className="font-bold text-[#033A3D] text-[17px]">
              {userName || "Loading..."}
            </p>
          </div>
        )}
      </div>

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
