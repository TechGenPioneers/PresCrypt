"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // Import useRouter
import { FaUser, FaEnvelope, FaBirthdayCake, FaPhone, FaMapMarkerAlt, FaEdit, FaPlus } from 'react-icons/fa';
import Header from '@/app/Components/header/Header';
import Sidebar from '@/app/Patient/PatientComponents/navBar';
import axios from 'axios';


const HealthRecord = () => {
  const router = useRouter(); // Initialize router
  const [patientData, setPatientData] = useState(null);
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [healthError, setHealthError] = useState(null);

  // Helper function to extract value from observation display string
  const extractValueFromDisplay = (displayString) => {
    if (!displayString) return null;
    const matches = displayString.match(/:\s*([^,]+)$/);
    return matches ? matches[1].trim() : null;
  };

  // Helper function to parse allergies display string
  const parseAllergies = (displayString) => {
    if (!displayString) return ["No allergies recorded"];
    const matches = displayString.match(/:\s*(.+)$/);
    if (matches) {
      return matches[1].split(',').map(item => item.trim());
    }
    return ["No allergies recorded"];
  };

  // Helper function to find the most recent value from observations
  const findLatestObservation = (results, displayStartsWith) => {
    const matchingObs = results.filter(obs => 
      obs.display && obs.display.startsWith(displayStartsWith)
    );
    return matchingObs.length > 0 ? matchingObs[matchingObs.length - 1] : null;
  };

  useEffect(() => {
    // Function to fetch patient data from API
    const fetchPatientData = async () => {
      try {
        // Get patientId from localStorage or other state management
        const patientId = "3B879C95-267A-42EA-B546-59FFFB748CFD";
        
        if (!patientId) {
          setError("Patient ID not found. Please log in again.");
          setLoading(false);
          return;
        }

        // Fetch patient basic data from the API
        const response = await axios.get(`https://localhost:7295/api/Patients/${patientId}`);
        
        // Transform API data to match component requirements
        setPatientData({
          name: response.data.name,
          title: response.data.title,
          joinedDate: new Date(response.data.joinedDate).toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
          }),
          gender: response.data.gender,
          birthDate: new Date(response.data.birthDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }),
          phone: response.data.phone,
          email: response.data.email,
          address: response.data.address,
          profileImage: response.data.profileImageBase64,
          bloodGroup: response.data.bloodGroup || "Not recorded"
        });

        // Now fetch health information data
        try {
          // Assume we're getting the data in the format of the second document
          const healthResponse = await axios.get(`https://localhost:7295/api/PatientObservations/${patientId}`);
          const results = healthResponse.data.results || [];

          // Find the latest observations for each vital sign
          const heightObs = findLatestObservation(results, "Height (cm)");
          const weightObs = findLatestObservation(results, "Weight (kg)");
          const bmiObs = findLatestObservation(results, "Body mass index");
          const systolicBPObs = findLatestObservation(results, "Systolic blood pressure");
          const diastolicBPObs = findLatestObservation(results, "Diastolic blood pressure");
          const pulseObs = findLatestObservation(results, "Pulse");
          const bloodSugarObs = findLatestObservation(results, "Serum glucose");
          const bloodTypeObs = findLatestObservation(results, "bloodType");
          const allergiesObs = findLatestObservation(results, "allergies");

          // Extract values from observation display strings
          const height = heightObs ? extractValueFromDisplay(heightObs.display) : null;
          const weight = weightObs ? extractValueFromDisplay(weightObs.display) : null;
          const bmi = bmiObs ? extractValueFromDisplay(bmiObs.display) : null;
          const systolicBP = systolicBPObs ? extractValueFromDisplay(systolicBPObs.display) : null;
          const diastolicBP = diastolicBPObs ? extractValueFromDisplay(diastolicBPObs.display) : null;
          const pulse = pulseObs ? extractValueFromDisplay(pulseObs.display) : null;
          const bloodSugar = bloodSugarObs ? extractValueFromDisplay(bloodSugarObs.display) : null;
          const bloodType = bloodTypeObs ? extractValueFromDisplay(bloodTypeObs.display) : null;
          const allergies = allergiesObs ? parseAllergies(allergiesObs.display) : ["No allergies recorded"];

          // Set health data
          setHealthData({
            height: height ? `${height} cm` : "Not recorded",
            weight: weight ? `${weight} kg` : "Not recorded",
            bmi: bmi || "Not recorded",
            bloodSugar: bloodSugar ? `${bloodSugar} mg/dL` : "Not recorded",
            heartRate: pulse ? `${pulse} bpm` : "Not recorded",
            bloodPressure: (systolicBP && diastolicBP) ? `${systolicBP}/${diastolicBP} mmHg` : "Not recorded",
            allergies: allergies,
            bloodGroup: bloodType || (patientData?.bloodGroup || "Not recorded")
          });
        } catch (healthErr) {
          console.error("Error fetching health data:", healthErr);
          setHealthError("Couldn't connect to the Health info server");
          // Set default health data
          setHealthData({
            height: "Not recorded",
            weight: "Not recorded",
            bmi: "Not recorded",
            bloodSugar: "Not recorded",
            heartRate: "Not recorded",
            bloodPressure: "Not recorded",
            allergies: ["No allergies recorded"],
            bloodGroup: patientData?.bloodGroup || "Not recorded"
          });
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching patient data:", err);
        setError("Failed to load patient data. Please try again later.");
        setLoading(false);
      }
    };

    fetchPatientData();
  }, []);

  // Get BMI status text based on value
  const getBmiStatus = (bmi) => {
    if (!bmi || bmi === "Not recorded") return "";
    const bmiValue = parseFloat(bmi);
    if (isNaN(bmiValue)) return "";
    
    if (bmiValue < 18.5) return "Underweight";
    if (bmiValue < 25) return "In good shape";
    if (bmiValue < 30) return "Overweight";
    return "Obese";
  };

  // Get appropriate color class for BMI status
  const getBmiStatusColor = (status) => {
    switch(status) {
      case "Underweight": return "bg-blue-500";
      case "In good shape": return "bg-green-500";
      case "Overweight": return "bg-yellow-500";
      case "Obese": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  // Navigation functions for the buttons
  const navigateToPersonalInfo = () => {
    router.push('/Patient/PatientProfile/PersonalInfo');
  };

  const navigateToHealthInfo = () => {
    router.push('/Patient/PatientProfile/HealthInfo');
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-gray-700">Loading patient data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
          <div className="text-red-500 text-center mb-4">
            <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-center mb-2">Error</h3>
          <p className="text-center text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // If no data is available
  if (!patientData) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center p-4">
          <p className="text-lg text-gray-700">No patient data available</p>
        </div>
      </div>
    );
  }

  // Get BMI status
  const bmiStatus = getBmiStatus(healthData?.bmi);
  const bmiStatusColor = getBmiStatusColor(bmiStatus);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header/>
      <Sidebar/>
      {/* Main Content - Adjusted with left margin/padding to move content right */}
      <div className="ml-16 sm:ml-20 md:ml-24 lg:ml-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-2xl shadow-md p-6">
                {/* Profile Section */}
                <div className="flex flex-col items-center mb-8">
                  <div className="relative mb-4">
                    {patientData.profileImage ? (
                      <Image 
                        src={`data:image/jpeg;base64,${patientData.profileImage}`}
                        alt={patientData.name}
                        width={80}
                        height={80}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                        <FaUser className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">{patientData.title}</h2>
                  <p className="text-sm text-gray-500 mt-1">Joined since: {patientData.joinedDate}</p>
                </div>

                {/* Basic Information */}
                <div className="space-y-1">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <FaUser className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Name</p>
                        <p className="text-sm font-medium text-gray-900">{patientData.name}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <FaUser className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Gender</p>
                        <p className="text-sm font-medium text-gray-900">{patientData.gender}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <FaBirthdayCake className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Birth Date</p>
                        <p className="text-sm font-medium text-gray-900">{patientData.birthDate}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <FaPhone className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Phone Number</p>
                        <p className="text-sm font-medium text-gray-900">{patientData.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <FaEnvelope className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Email Address</p>
                        <p className="text-sm font-medium text-gray-900">{patientData.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <FaMapMarkerAlt className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Address</p>
                        <p className="text-sm font-medium text-gray-900">{patientData.address}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons - Updated with navigation functions */}
              <div className="space-y-3 mt-4">
                <button 
                  onClick={navigateToPersonalInfo}
                  className="w-full bg-white rounded-xl shadow-sm py-3.5 px-4 flex items-center justify-center space-x-2 hover:bg-gray-50 border border-gray-100 transition duration-200"
                >
                  <FaEdit className="w-5 h-5 text-gray-700" />
                  <span className="text-sm font-semibold text-gray-700">Edit your profile</span>
                </button>

                <button 
                  onClick={navigateToHealthInfo}
                  className="w-full bg-white rounded-xl shadow-sm py-3.5 px-4 flex items-center justify-center space-x-2 hover:bg-gray-50 border border-gray-100 transition duration-200"
                >
                  <FaPlus className="w-5 h-5 text-gray-700" />
                  <span className="text-sm font-semibold text-gray-700">Add more Health Data</span>
                </button>
              </div>
            </div>

            {/* Right Content */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Health Information</h2>
                
                {healthError ? (
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Error</h3>
                        <div className="mt-2 text-sm text-red-700">
                          <p>{healthError}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Health Metrics Grid */}
                    <div className="flex-1">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Height */}
                        <div className="bg-white rounded-xl border border-gray-200 p-4">
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-sm text-gray-600">Height</p>
                            <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v16M20 4v16M8 4h8M8 20h8M12 9v6" />
                            </svg>
                          </div>
                          <p className="text-2xl font-bold text-gray-900">{healthData?.height}</p>
                        </div>

                        {/* Weight */}
                        <div className="bg-white rounded-xl border border-gray-200 p-4">
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-sm text-gray-600">Weight</p>
                            <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h18M5 12h14M7 18h10" />
                            </svg>
                          </div>
                          <p className="text-2xl font-bold text-gray-900">{healthData?.weight}</p>
                        </div>

                        {/* BMI */}
                        <div className="bg-green-50 rounded-xl border border-green-100 p-4">
                          <p className="text-sm text-gray-600 mb-1">Body Mass Index (BMI)</p>
                          <div className="flex items-center space-x-2 mb-2">
                            <p className="text-2xl font-bold text-gray-900">{healthData?.bmi}</p>
                            {healthData?.bmi && healthData.bmi !== "Not recorded" && (
                              <span className={`${bmiStatusColor} text-white px-2 py-0.5 rounded text-xs font-medium`}>
                                {bmiStatus}
                              </span>
                            )}
                          </div>
                          <div className="flex space-x-1">
                            <div className="h-1 w-1/4 bg-blue-300 rounded"></div>
                            <div className="h-1 w-1/4 bg-green-500 rounded"></div>
                            <div className="h-1 w-1/4 bg-yellow-300 rounded"></div>
                            <div className="h-1 w-1/4 bg-red-300 rounded"></div>
                          </div>
                        </div>

                        {/* Blood Group */}
                        <div className="bg-white rounded-xl border border-gray-200 p-4">
                          <p className="text-sm text-gray-600 mb-3">Blood Group</p>
                          <p className="text-2xl font-bold text-gray-900">{healthData?.bloodGroup}</p>
                        </div>

                        {/* Blood Sugar */}
                        <div className="bg-white rounded-xl border border-gray-200 p-4">
                          <div className="flex items-center space-x-2 mb-3">
                            <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 21c-1.654 0-3-1.346-3-3 0-3.312 3-7 3-7s3 3.688 3 7c0 1.654-1.346 3-3 3z"/>
                              <path d="M12 3C7.589 3 4 6.589 4 11c0 3.57 2.824 7.876 5.368 10.502.41.422.982.498 1.632.498s1.222-.076 1.632-.498C15.176 18.876 18 14.57 18 11c0-4.411-3.589-8-8-8z"/>
                            </svg>
                            <p className="text-sm text-gray-600">Blood Sugar</p>
                          </div>
                          <p className="text-lg font-medium text-gray-900">{healthData?.bloodSugar}</p>
                        </div>

                        {/* Heart Rate */}
                        <div className="bg-white rounded-xl border border-gray-200 p-4">
                          <div className="flex items-center space-x-2 mb-3">
                            <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                            <p className="text-sm text-gray-600">Heart Rate</p>
                          </div>
                          <p className="text-lg font-medium text-gray-900">{healthData?.heartRate}</p>
                          <div className="mt-2 h-8">
                            <svg viewBox="0 0 100 20" className="w-full h-full">
                              <path
                                d="M0,10 L10,10 L15,5 L20,15 L25,8 L30,12 L40,10 L45,8 L50,12 L55,10 L60,10 L65,7 L70,13 L75,10 L80,10"
                                fill="none"
                                stroke="#F87171"
                                strokeWidth="2"
                              />
                            </svg>
                          </div>
                        </div>

                        {/* Blood Pressure */}
                        <div className="bg-white rounded-xl border border-gray-200 p-4">
                          <div className="flex items-center space-x-2 mb-3">
                            <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                            </svg>
                            <p className="text-sm text-gray-600">Blood Pressure</p>
                          </div>
                          <p className="text-lg font-medium text-gray-900">{healthData?.bloodPressure}</p>
                          {healthData?.bloodPressure && healthData.bloodPressure !== "Not recorded" && (
                            <p className="text-sm text-green-600">Normal</p>
                          )}
                        </div>

                        {/* Allergies */}
                        <div className="bg-blue-50 rounded-xl border border-blue-100 p-4">
                          <p className="text-sm text-gray-600 mb-3">Allergies</p>
                          {healthData?.allergies && healthData.allergies.length > 0 ? (
                            <ul className="text-sm space-y-1 text-gray-700">
                              {healthData.allergies.map((allergy, index) => (
                                <li key={index} className="flex items-start">
                                  {allergy !== "No allergies recorded" && <span className="mr-1 font-medium">{index + 1}.</span>}
                                  <span>{allergy}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-gray-700">No allergies recorded</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Anatomy Image */}
                    <div className="lg:w-72 flex items-center justify-center">
                      <Image 
                        src="/anatomy-image.png" 
                        alt="Human Anatomy" 
                        width={240} 
                        height={400}
                        className="object-contain max-h-[500px]"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthRecord;