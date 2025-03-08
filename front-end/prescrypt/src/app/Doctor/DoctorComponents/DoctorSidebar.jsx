"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Import usePathname

export default function Header() {
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname(); // Get the current URL path

  const handleLogout = () => {
    console.log("User logged out");
  };

  return (
    <header className="grid md:grid-cols-3">
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-2xl font-medium font-sans transition-all duration-300 ease-in-out flex flex-col`}
        style={{
          width: isExpanded ? "16rem" : "8rem",
        }}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className="flex justify-center items-center mt-4 mb-8">
          <Image src="/logo.png" alt="logo" width={100} height={100} />
        </div>

        <div className="flex justify-center p-2">
          <Image src="/profile.png" alt="profile" width={40} height={40} />
          {isExpanded && (
            <div className="flex justify-center ml-4 whitespace-nowrap mt-2">
              <p className="font-bold text-[#033A3D] text-[17px]">
                Dr. Nimal Fernando
              </p>
            </div>
          )}
        </div>

        <nav className="flex flex-col items-center p-2 text-black text-xl font-bold mt-8 flex-grow">
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
                path: "/Doctor/Chat",
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
                    pathname === item.path // Check if the current URL matches the tab's path
                      ? "border-[#033A3D] bg-[#033A3D]/20 text-[#033A3D] font-bold shadow-md" // Styles for selected tab
                      : "border-transparent hover:border-[#033A3D] hover:bg-[#033a3d32] text-black"
                  }`}
                  style={{
                    width: isExpanded ? "90%" : "50px",
                    height: "50px",
                    justifyContent: isExpanded ? "left" : "center",
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

        <div
          className="w-full p-2 absolute bottom-0 left-0"
          style={{
            width: isExpanded ? "16rem" : "8rem",
          }}
        >
          <li className="mb-4 w-full flex justify-center">
            <a
              href="#"
              className="flex items-center p-2 hover:border-1 rounded-full transition-all duration-300 hover:border-[#033A3D] hover:bg-[#033a3d32]"
              onClick={handleLogout}
              style={{
                width: isExpanded ? "90%" : "50px",
                height: "50px",
                justifyContent: isExpanded ? "left" : "center",
                paddingLeft: isExpanded ? "20px" : "8px",
                borderRadius: isExpanded ? "20px" : "100%",
              }}
            >
              <img src="/image27.png" alt="Logout" className="w-5 h-5" />
              {isExpanded && (
                <span className="text-[#033A3D] text-[15px] whitespace-nowrap ml-2 font-bold">
                  Logout
                </span>
              )}
            </a>
          </li>
        </div>
      </div>
    </header>
  );
}