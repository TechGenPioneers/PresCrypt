"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardActionArea, CardContent, Typography } from "@mui/material";
import {
  getPatientIdByEmail,
  getPatientDetails,
} from "../services/PatientDataService";
import LoadingSpinner from "./loadingSpinner";
import useAuthGuard from "@/utils/useAuthGuard";


const PatientDashboard = () => {
  useAuthGuard(["Patient"]);
  const [patient, setPatient] = useState(null);
  const [dateTime, setDateTime] = useState(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const email = localStorage.getItem("username");
        if (!email) {
          console.error("No email found in localStorage.");
          return;
        }

        let patientId = localStorage.getItem("patientId");

        if (!patientId) {
          // Fetch patient ID using email and store it
          patientId = await getPatientIdByEmail(email);
          if (!patientId) {
            console.error("Patient ID not found for email.");
            return;
          }
          localStorage.setItem("patientId", patientId);
        }

        // Fetch patient details with the patient ID
        const details = await getPatientDetails(patientId);
        setPatient(details);
      } catch (error) {
        console.error("Failed to fetch patient data:", error);
      }
    };

    const updateDateTime = () => {
      setDateTime(new Date());
    };

    fetchPatient();
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const getCurrentDate = () => {
    if (!dateTime) return "";
    return dateTime.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCurrentTime = () => {
    if (!dateTime) return "";
    return dateTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  if (!patient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100 flex flex-col items-center justify-center py-10 ml-24">
        <div className="bg-white/80 backdrop-blur-sm p-12 rounded-3xl shadow-2xl">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100 border-t-[15px] border-l-[15px] border-r-[15px] border-b-0 border-green-200 ml-24">
      <div className="container mx-auto px-6 py-10">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <div className="mb-6">
            <div className="inline-block bg-white/90 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-lg border border-green-200 mb-4">
              <p className="text-green-600 text-lg font-medium">
                {getCurrentDate()}
              </p>
              <p className="text-green-800 text-xl font-bold">
                {getCurrentTime()}
              </p>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-green-700 mb-4">
            Personal Health Hub
          </h1>
          <div className="h-2 w-32 bg-green-700 rounded-full mx-auto mb-6"></div>
        </div>

        {/* Welcome Card */}
        <div className="bg-green-50 p-8 rounded-3xl mb-12 shadow-2xl border border-green-200 backdrop-blur-sm">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-green-700 mb-2">
              Welcome back, {patient.name}!
            </h2>
            <p className="text-green-600 text-xl opacity-80">
              Take control of your health journey with our comprehensive healthcare platform
            </p>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Book Appointment Card */}
          <Link href="/Patient/PatientAppointments">
            <div className="group cursor-pointer">
              <Card className="h-80 rounded-3xl shadow-xl border-2 border-green-100 hover:border-green-300 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl bg-gradient-to-br from-white to-green-50 overflow-hidden relative">
                <div className="absolute inset-0 bg-green-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardActionArea className="h-full p-0 relative z-10">
                  <div className="h-48 relative overflow-hidden">
                    <Image
                      src="/Appointment_Booking.jpg"
                      alt="Book Appointment"
                      width={384}
                      height={192}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                  <CardContent className="h-32 flex flex-col justify-center items-center bg-gradient-to-br from-green-50 to-white p-6">
                    <div className="w-12 h-12 bg-green-700 hover:bg-green-600 rounded-2xl flex items-center justify-center mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <Typography
                      variant="h5"
                      align="center"
                      className="text-green-700 font-bold group-hover:text-green-600 transition-colors duration-300"
                    >
                      Book Appointment
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </div>
          </Link>

          {/* Health Records Card */}
          <Link href="/Patient/PatientHealthRecords">
            <div className="group cursor-pointer">
              <Card className="h-80 rounded-3xl shadow-xl border-2 border-green-100 hover:border-green-300 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl bg-gradient-to-br from-white to-green-50 overflow-hidden relative">
                <div className="absolute inset-0 bg-green-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardActionArea className="h-full p-0 relative z-10">
                  <div className="h-48 relative overflow-hidden">
                    <Image
                      src="/HelathRecords.jpg"
                      alt="Health Records"
                      width={384}
                      height={192}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                  <CardContent className="h-32 flex flex-col justify-center items-center bg-gradient-to-br from-green-50 to-white p-6">
                    <div className="w-12 h-12 bg-green-700 hover:bg-green-600 rounded-2xl flex items-center justify-center mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                    </div>
                    <Typography
                      variant="h5"
                      align="center"
                      className="text-green-700 font-bold group-hover:text-green-600 transition-colors duration-300"
                    >
                      Health Records
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </div>
          </Link>

          {/* Contact Us Card */}
          <Link href="/Patient/PatientContactUs">
            <div className="group cursor-pointer">
              <Card className="h-80 rounded-3xl shadow-xl border-2 border-green-100 hover:border-green-300 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl bg-gradient-to-br from-white to-green-50 overflow-hidden relative">
                <div className="absolute inset-0 bg-green-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardActionArea className="h-full p-0 relative z-10">
                  <div className="h-48 relative overflow-hidden">
                    <Image
                      src="/ContactUs.jpg"
                      alt="Contact Us"
                      width={384}
                      height={192}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                  <CardContent className="h-32 flex flex-col justify-center items-center bg-gradient-to-br from-green-50 to-white p-6">
                    <div className="w-12 h-12 bg-green-700 hover:bg-green-600 rounded-2xl flex items-center justify-center mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <Typography
                      variant="h5"
                      align="center"
                      className="text-green-700 font-bold group-hover:text-green-600 transition-colors duration-300"
                    >
                      Contact Us
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </div>
          </Link>
        </div>

        {/* Health Tip Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-white/70 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-green-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-700 hover:bg-green-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg transition-all duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-green-700 mb-3">
                Your Health, Our Priority
              </h3>
              <p className="text-green-600 text-lg">
                Stay connected with your healthcare team and take proactive steps towards better health. 
                We're here to support you every step of the way.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;