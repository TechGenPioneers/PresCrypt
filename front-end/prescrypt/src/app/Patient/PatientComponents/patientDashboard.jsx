"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardActionArea, CardContent, Typography } from "@mui/material";
import {
  getPatientIdByEmail,
  getPatientDetails,
  getAppointmentSummary
} from "../services/PatientDataService";
import LoadingSpinner from "./loadingSpinner";

const PatientDashboard = () => {
  const [patient, setPatient] = useState(null);
  const [appointmentSummary, setAppointmentSummary] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  // Health tips array with more tips for rotation
  const healthTips = [
    {
      icon: "💧",
      title: "Stay Hydrated",
      description: "Drink at least 8 glasses of water daily to maintain optimal health and boost your energy levels."
    },
    {
      icon: "🏃‍♂️",
      title: "Regular Exercise",
      description: "30 minutes of moderate exercise daily can significantly improve your cardiovascular health."
    },
    {
      icon: "😴",
      title: "Quality Sleep",
      description: "Aim for 7-9 hours of quality sleep each night for better recovery and mental clarity."
    },
    {
      icon: "🥗",
      title: "Balanced Diet",
      description: "Include plenty of fruits, vegetables, and whole grains in your daily meals for optimal nutrition."
    },
    {
      icon: "🧘‍♀️",
      title: "Manage Stress",
      description: "Practice meditation or deep breathing exercises to reduce stress and improve mental wellbeing."
    },
    {
      icon: "🌞",
      title: "Get Sunlight",
      description: "Spend 10-15 minutes in natural sunlight daily to boost your vitamin D levels."
    }
  ];

  // Function to format date to "Month Day" format
  const formatAppointmentDate = (dateString) => {
    if (!dateString) return null;
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric"
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const email = localStorage.getItem("username");
        if (!email) {
          console.error("No email found in localStorage.");
          return;
        }

        let patientId = localStorage.getItem("patientId");

        if (!patientId) {
          const response = await getPatientIdByEmail(email);
          if (!response || !response.patientId) {
            console.error("Patient ID not found for email.");
            return;
          }

          patientId = response.patientId;
          localStorage.setItem("patientId", patientId);
          localStorage.setItem("status", response.status);
        }

        // Fetch patient details and appointment summary in parallel
        const [details, appointmentData] = await Promise.all([
          getPatientDetails(patientId),
          getAppointmentSummary(patientId)
        ]);

        setPatient(details);
        setAppointmentSummary(appointmentData);
      } catch (error) {
        console.error("Failed to fetch patient data:", error);
      }
    };

    fetchPatientData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Health tips rotation effect
  useEffect(() => {
    const tipTimer = setInterval(() => {
      setCurrentTipIndex((prevIndex) => (prevIndex + 1) % healthTips.length);
    }, 8000);

    return () => clearInterval(tipTimer);
  }, [healthTips.length]);

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  if (!patient || !appointmentSummary) {
    return (
      <div className="flex flex-grow min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-teal-100 ml-24">
        <div className="flex-grow">
          <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white/90 backdrop-blur-sm p-12 rounded-3xl shadow-2xl">
              <LoadingSpinner />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const currentTip = healthTips[currentTipIndex];

  return (
    <div className="flex flex-grow ml-24">
      <div className="flex-grow bg-gradient-to-br from-teal-50 via-blue-50 to-teal-100 min-h-screen">
        <div className="p-2 flex flex-col lg:flex-row">
          {/* Left Column - Main Dashboard */}
          <div className="lg:w-2/3">
            <div className="bg-white min-h-screen rounded-r-3xl shadow-xl">
              {/* Date Time Display */}
              <div className="bg-gradient-to-r from-teal-600 to-teal-500 text-white p-6 rounded-tr-3xl">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-teal-100 text-lg opacity-90">
                      {formatDate(currentTime)}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{formatTime(currentTime)}</div>
                    <div className="text-sm text-teal-100 opacity-75">
                      Current Time
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8">
                {/* Welcome Card */}
                <div className="bg-gradient-to-r from-teal-50 to-teal-100 rounded-3xl shadow-lg p-6 mb-8 border border-teal-200">
                  <div className="flex items-center">
                    <div className="w-20 h-20 bg-teal-600 rounded-full flex items-center justify-center mr-6 shadow-lg">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-teal-700 mb-2">
                        Welcome back, <span className="text-teal-600">{patient.name}!</span>
                      </h2>
                      <p className="text-teal-600 text-lg">
                        Take control of your health journey with our comprehensive healthcare platform
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions Grid */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  {/* Book Appointment Card */}
                  <Link href="/Patient/PatientAppointments">
                    <div className="group cursor-pointer h-full">
                      <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-6 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-teal-200 h-full flex flex-col justify-center">
                        <div className="flex items-center justify-center mb-4">
                          <div className="w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:bg-teal-500 transition-colors duration-300">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-teal-700 text-center group-hover:text-teal-600 transition-colors duration-300">
                          Book Appointment
                        </h3>
                        <p className="text-teal-600 text-center mt-2 text-sm">
                          Schedule your next visit
                        </p>
                      </div>
                    </div>
                  </Link>

                  {/* Health Records Card */}
                  <Link href="/Patient/PatientHealthRecords">
                    <div className="group cursor-pointer h-full">
                      <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-6 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-teal-200 h-full flex flex-col justify-center">
                        <div className="flex items-center justify-center mb-4">
                          <div className="w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:bg-teal-500 transition-colors duration-300">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-teal-700 text-center group-hover:text-teal-600 transition-colors duration-300">
                          Health Records
                        </h3>
                        <p className="text-teal-600 text-center mt-2 text-sm">
                          View your medical history
                        </p>
                      </div>
                    </div>
                  </Link>

                  {/* Next Appointment */}
                  <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-6 rounded-3xl shadow-lg border border-teal-200 h-full flex flex-col justify-center">
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                    </div>
                    <p className="text-lg font-semibold text-teal-700 text-center">
                      Next Appointment
                    </p>
                    {appointmentSummary.nearestPendingAppointmentDate ? (
                      <>
                        <p className="text-lg font-bold mt-2 text-teal-600 text-center">
                          {formatAppointmentDate(appointmentSummary.nearestPendingAppointmentDate)}
                        </p>
                        <p className="text-sm text-teal-500 text-center">Upcoming</p>
                      </>
                    ) : (
                      <>
                        <p className="text-lg font-bold mt-2 text-teal-400 text-center">
                          No upcoming
                        </p>
                        <p className="text-sm text-teal-400 text-center">appointments</p>
                      </>
                    )}
                  </div>

                  {/* Contact Us Card */}
                  <Link href="/Patient/PatientContactUs">
                    <div className="group cursor-pointer h-full">
                      <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-6 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-teal-200 h-full flex flex-col justify-center">
                        <div className="flex items-center justify-center mb-4">
                          <div className="w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:bg-teal-500 transition-colors duration-300">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-teal-700 text-center group-hover:text-teal-600 transition-colors duration-300">
                          Contact Us
                        </h3>
                        <p className="text-teal-600 text-center mt-2 text-sm">
                          Get in touch with support
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Dynamic Health Tips & Stats */}
          <div className="lg:w-1/3">
            <div className="bg-white p-6 min-h-screen flex flex-col rounded-l-3xl shadow-xl ml-2">
              {/* Dynamic Health Tips Section */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-bold text-2xl text-teal-700">Health Tips</h2>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    {/* Progress dots */}
                    <div className="flex space-x-1">
                      {healthTips.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index === currentTipIndex 
                              ? 'bg-teal-600 w-6' 
                              : 'bg-teal-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Single Animated Health Tip */}
                <div className="relative overflow-hidden">
                  <div 
                    key={currentTipIndex}
                    className="bg-gradient-to-r from-teal-50 to-blue-50 p-6 rounded-2xl border-l-4 border-teal-500 transform transition-all duration-500 ease-in-out animate-fadeIn"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="text-3xl flex-shrink-0 animate-bounce">
                        {currentTip.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-teal-700 mb-2 text-lg">
                          {currentTip.title}
                        </h3>
                        <p className="text-teal-600 text-sm leading-relaxed">
                          {currentTip.description}
                        </p>
                      </div>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="mt-4 h-1 bg-teal-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-teal-500 rounded-full transition-all duration-300"
                        style={{
                          width: `${((Date.now() % 8000) / 8000) * 100}%`,
                          animation: 'progressBar 8s linear infinite'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Health Status Section */}
              <div className="flex-grow">
                <div className="bg-gradient-to-br from-teal-50 to-blue-50 p-6 rounded-3xl shadow-lg border border-teal-200">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-teal-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-teal-700 mb-3">
                      Your Health, Our Priority
                    </h3>
                    <p className="text-teal-600 mb-6">
                      Stay connected with your healthcare team and take proactive steps towards better health.
                    </p>
                    
                    {/* Quick Health Stats */}
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="bg-white/70 p-3 rounded-xl">
                        <p className="text-sm font-medium text-teal-700">Today Appointments</p>
                        <p className="text-2xl font-bold text-teal-600">
                          {appointmentSummary.todayAppointmentCount || 0}
                        </p>
                      </div>
                      <div className="bg-white/70 p-3 rounded-xl">
                        <p className="text-sm font-medium text-teal-700">Last Visit</p>
                        {appointmentSummary.latestCompletedAppointmentDate ? (
                          <p className="text-sm font-bold text-teal-600">
                            {formatAppointmentDate(appointmentSummary.latestCompletedAppointmentDate)}
                          </p>
                        ) : (
                          <p className="text-sm font-bold text-teal-400">
                            No visits
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes progressBar {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default PatientDashboard;