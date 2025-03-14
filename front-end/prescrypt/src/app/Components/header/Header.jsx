// src/app/Components/Header/Header.js
"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="grid md:grid-cols-3">
      <div className="relative">
        {/* Button to toggle the sidebar (removed sidebar content) */}
        <div className="p-10"></div>
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
        <div className="flex space-x-10">
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
