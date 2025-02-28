"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Dashboard"); // State to track the selected tab

  return (
    <header className="grid md:grid-cols-3">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-2xl font-medium font-sans transition-all duration-300 ease-in-out`}
        style={{
          width: isExpanded ? "16rem" : "4rem", // Increase width here
        }}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className="flex justify-start mt-10 p-2 mb-8 ml-2">
          <Image
            src="/profile.png"
            alt="logo"
            width={40}
            height={40}
            className="transition-none"
          />
          {/* User Info on Hover */}
          {isExpanded && (
            <div className="ml-4 whitespace-nowrap">
              {" "}
              {/* Prevent text wrapping */}
              <p className="font-bold text-[#033A3D] text-[17px]">
                Kayle Fernando
              </p>
              <p className="text-[10px] text-gray-500">
                Joined since: 01st December 2023
              </p>
            </div>
          )}
        </div>

        <nav className="p-2 ml-2 text-black text-xl font-bold">
          <ul>
            {[
              { img: "/image11.png", label: "Dashboard", path: "" },
              { img: "/image12.png", label: "Profile", path: "/Patient/PatientProfile" },
              { img: "/clock13.png", label: "Appointments", path: "/Patient/PatientAppointments" },
              { img: "/image14.png", label: "Health Records", path: "/Patient/Health" },
              { img: "/image18.png", label: "Chat With Doctor", path: "/Patient/Chat" },
            ].map((item, index) => (
              <li key={index} className="mb-4">
                <a
                  href={item.path}
                  className={`flex items-center py-2 px-2 space-x-4 border-2 ${
                    selectedTab === item.label
                      ? "border-[#033A3D] bg-[#033A3D]/10" // Selected tab style
                      : "border-transparent"
                  } hover:border-[#033A3D] hover:bg-[#033A3D]/10 rounded-full transition-all duration-300`} // Hover and border radius
                  onClick={() => setSelectedTab(item.label)}
                >
                  <img src={item.img} alt={item.label} className="w-5 h-5" />
                  <span
                    className={`${
                      isExpanded ? "opacity-100" : "opacity-0"
                    } transition-opacity duration-300 text-[#033A3D] text-[15px] whitespace-nowrap`}
                  >
                    {item.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Header */}
      <div className="flex justify-center p-10">
        <Image src="/logo.png" alt="logo" width={200} height={200} />
      </div>

      <div className="flex justify-end p-10">
        <div className="flex space-x-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            width="35"
            height="35"
            className="relative group"
          >
            {/* 
            <path d="M224 0c-17.7 0-32 14.3-32 32l0 19.2C119 66 64 130.6 64 208v18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416h384c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8V208c0-77.4-55-142-128-156.8L256 32c0-17.7-14.3-32-32-32zM269.3 493.3c12-12 18.7-28.3 18.7-45.3h-64h-64c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z" />
            <span className="absolute left-10 top-1/2 transform -translate-y-1/2 bg-white text-black text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Notifications
            </span>
            */}
          </svg>
        </div>
      </div>
    </header>
  );
}