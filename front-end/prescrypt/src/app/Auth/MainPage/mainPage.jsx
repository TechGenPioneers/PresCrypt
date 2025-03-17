
"use client"; 
import React, { useState } from "react";
import { useRouter } from "next/router";
import styles from "./mainPage.module.css";
import Header from "../../Components/header/Header";
import Footer from "../../Components/footer/Footer";
import Calendar from "react-calendar"; 
import "react-calendar/dist/Calendar.css"; 

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col justify-between items-center bg-white text-gray-700">
     
      

      {/* Main Content */}
      <main className="text-center px-6">
        <h1 className="text-4xl font-bold">
          Our <span className="text-green-500">Health</span> Journey{" "}
          <span className="text-blue-500">Starts Here!</span>
        </h1>
        <p className="mt-4 text-lg max-w-2xl mx-auto">
          At <span className="text-blue-500 font-semibold">PresCrypt</span>, we offer a 
          comprehensive suite of healthcare services designed to make managing 
          your health easier and more efficient. Whether you are a{" "}
          <span className="text-blue-500">Patient, Doctor, or Administrator</span>, 
          we have solutions to meet your needs.
        </p>

        {/* Role Selection Buttons */}
        <div className="mt-6 flex gap-4">
          <button
            onClick={() => router.push("/Patient/register")}
            className="border border-green-500 text-green-500 px-6 py-2 rounded-lg hover:bg-green-500 hover:text-white transition"
          >
            PATIENT
          </button>
          <button
            onClick={() => router.push("/Doctor/register")}
            className="border border-blue-500 text-blue-500 px-6 py-2 rounded-lg hover:bg-blue-500 hover:text-white transition"
          >
            DOCTOR
          </button>
        </div>
      </main>

     
    </div>
  );
}
