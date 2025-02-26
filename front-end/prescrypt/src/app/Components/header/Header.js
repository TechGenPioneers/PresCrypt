// src/app/Components/Header/Header.js
"use client";
import { useState } from "react";
import React from "react";
import Link from "next/link";
import styles from "./header.modules.css";
import Image from "next/image";

export default function Header() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  // Toggle function to show or hide the sidebar
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <header className="grid md:grid-cols-3">
      <div className="relative">
        {/* Button to toggle the sidebar */}
        <div className="p-10">
          <button
            onClick={toggleSidebar}
            className="p-2 focus:outline-none overflow-hidden cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              width="40"
              height="40"
              className="text-white"
            >
              <path d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z" />
            </svg>
          </button>
        </div>

        {/* Sidebar (Navigation) */}
        <div
          className={`fixed z-10 top-0 left-0 h-full bg-[#2B6E71] text-white w-1/3 sm:w-1/2 md:w-1/3 lg:w-1/4 transform ${
            isSidebarVisible ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out`}
        >
          <div className="flex justify-center mt-10 p-10">
            <Image
              src="/logo.png"
              alt="logo"
              width={200}
              height={200}
              className="w-26 h-26 sm:w-20 sm:h-25 md:w-28 md:h-28 lg:w-35 lg:h-35"
              quality={80}
              layout="intrinsic"
            />
          </div>
          <nav className="p-4 text-black text-xl font-bold">
            <ul>
              <li className="pl-8 mb-4 bg-white rounded-2xl hover:opacity-90">
                <a href="#" className="flex items-center space-x-3 py-2 ">
                  <img
                    src="/image11.png" // Place in public/images/health-records.jpg
                    alt="Dashboard"
                    className="w-5 h-5 object-fill"
                    quality={80}
                  />
                  <div className="text-lg">Dashboard</div>
                </a>
              </li>

              <li className="pl-8 mb-4 bg-white rounded-2xl hover:opacity-90">
                <a href="#" className="flex items-center space-x-3 py-2 ">
                  <img
                    src="/image12.png" // Place in public/images/health-records.jpg
                    alt="Profile"
                    className="w-5 h-5 object-fill"
                    quality={80}
                  />
                  <div className="text-lg">Profile</div>
                </a>
              </li>
              <li className="pl-8 mb-4 bg-white rounded-2xl hover:opacity-90">
                <a href="#" className="flex items-center space-x-3 py-2">
                  <img
                    src="/clock13.png" // Place in public/images/health-records.jpg
                    alt="Appointments"
                    className="w-5 h-5 object-fill"
                    quality={80}
                  />
                  <div className="text-lg">Appointments</div>
                </a>
              </li>
              <li className="pl-8 mb-4 bg-white rounded-2xl hover:opacity-90">
                <a href="#" className="flex items-center space-x-3 py-2">
                  <img
                    src="/image14.png" // Place in public/images/health-records.jpg
                    alt="Health Records"
                    className="w-5 h-5 object-fill"
                    quality={80}
                  />
                  <div className="text-lg">Health Records</div>
                </a>
              </li>
              <li className="pl-8 mb-4 bg-white rounded-2xl hover:opacity-90">
                <a href="#" className="flex items-center space-x-3 py-2">
                  <img
                    src="/image18.png" // Place in public/images/health-records.jpg
                    alt="Chat"
                    className="w-5 h-5 object-fill"
                    quality={80}
                  />
                  <div className="text-lg">Chat With Doctor</div>
                </a>
              </li>
            </ul>
          </nav>

          {/* Close button */}
          <button
            onClick={toggleSidebar}
            className="absolute top-4 right-4 text-white cursor-pointer focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
              width="20"
              height="20"
            >
              <path d="M310.6 361.4l-33.9 33.9L176 256l100.7-100.7-33.9-33.9-100.7 100.7-100.7-100.7-33.9 33.9L143.9 256 43.2 356.7l33.9 33.9L144 256l100.7 100.7z" />
            </svg>
          </button>
        </div>
      </div>
      <div className="flex justify-center relative group p-10">
        <Image
          src="/logo.png"
          alt="logo"
          width={200}
          height={200}
          className="w-26 h-26 sm:w-20 sm:h-25 md:w-28 md:h-28 lg:w-35 lg:h-35"
          quality={80}
          layout="intrinsic"
        />
      </div>
      <div className="flex justify-end relative group p-10 ">
        <div className="flex  space-x-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            width="35"
            height="35"
          >
            <path d="M224 0c-17.7 0-32 14.3-32 32l0 19.2C119 66 64 130.6 64 208l0 18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416l384 0c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8l0-18.8c0-77.4-55-142-128-156.8L256 32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3l-64 0-64 0c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z" />
          </svg>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            width="35"
            height="35"
          >
            <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z" />
          </svg>
        </div>
      </div>
    </header>
  );
}
