import React from 'react';
import Image from 'next/image';
import { FaUser, FaEnvelope, FaBirthdayCake, FaPhone, FaMapMarkerAlt, FaEdit, FaPlus } from 'react-icons/fa';
import Header from '@/app/Components/header/Header';
import Sidebar from '@/app/Patient/PatientComponents/navBar'

const HealthRecord = () => {
  const patientData = {
    name: "Kayle Fernando",
    title: "Ms Kayle Fernando",
    joinedDate: "01 December 2023",
    gender: "Female",
    birthDate: "1992.06.07",
    phone: "+94 71 1374388",
    email: "kayleFernanda98@gmail.com",
    address: "No 04, Rose Street, Piliyandala",
    height: "169 cm",
    weight: "42 kg",
    bmi: "24.5",
    bloodGroup: "O+",
    bloodSugar: "Normal",
    heartRate: "98 bpm",
    bloodPressure: "102/77 mmHg",
    allergies: [
      "Tree and grass pollen (Hay fever)",
      "House dust mites",
      "Foods such as peanuts, milk and eggs (food allergy)",
      "Animals, particularly pets like cats and dogs"
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header/>
      <Sidebar/>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-md p-6">
              {/* Profile Section */}
              <div className="flex flex-col items-center mb-8">
                <div className="relative mb-4">
                  <Image 
                    src="/patient-photo.jpg" 
                    alt={patientData.name}
                    width={80}
                    height={80}
                    className="rounded-full object-cover"
                  />
                </div>
                <h2 className="text-lg font-bold text-gray-900">{patientData.title}</h2>
                <p className="text-sm text-gray-500 mt-1">Joined since: {patientData.joinedDate}</p>
              </div>

              {/* Basic Information */}
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-gray-800 mb-4">Basic Informational</h3>
                
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

            {/* Action Buttons */}
            <div className="space-y-3 mt-4">
              <button className="w-full bg-white rounded-xl shadow-sm py-3.5 px-4 flex items-center justify-center space-x-2 hover:bg-gray-50 border border-gray-100">
                <FaEdit className="w-5 h-5 text-gray-700" />
                <span className="text-sm font-semibold text-gray-700">Edit your profile</span>
              </button>

              <button className="w-full bg-white rounded-xl shadow-sm py-3.5 px-4 flex items-center justify-center space-x-2 hover:bg-gray-50 border border-gray-100">
                <FaPlus className="w-5 h-5 text-gray-700" />
                <span className="text-sm font-semibold text-gray-700">Add more Health Data</span>
              </button>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Health Information</h2>
              
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
                      <p className="text-2xl font-bold text-gray-900">{patientData.height}</p>
                    </div>

                    {/* Weight */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm text-gray-600">Weight</p>
                        <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h18M5 12h14M7 18h10" />
                        </svg>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{patientData.weight}</p>
                    </div>

                    {/* BMI */}
                    <div className="bg-green-50 rounded-xl border border-green-100 p-4">
                      <p className="text-sm text-gray-600 mb-1">Body Mass Index (BMI)</p>
                      <div className="flex items-center space-x-2 mb-2">
                        <p className="text-2xl font-bold text-gray-900">{patientData.bmi}</p>
                        <span className="bg-green-500 text-white px-2 py-0.5 rounded text-xs font-medium">In good shape</span>
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
                      <p className="text-2xl font-bold text-gray-900">{patientData.bloodGroup}</p>
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
                      <p className="text-lg font-medium text-gray-900">{patientData.bloodSugar}</p>
                    </div>

                    {/* Heart Rate */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                        <p className="text-sm text-gray-600">Heart Rate</p>
                      </div>
                      <p className="text-lg font-medium text-gray-900">{patientData.heartRate}</p>
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
                      <p className="text-lg font-medium text-gray-900">{patientData.bloodPressure}</p>
                      <p className="text-sm text-green-600">Normal</p>
                    </div>

                    {/* Allergies */}
                    <div className="bg-blue-50 rounded-xl border border-blue-100 p-4">
                      <p className="text-sm text-gray-600 mb-3">Allergies</p>
                      <ul className="text-sm space-y-1 text-gray-700">
                        {patientData.allergies.map((allergy, index) => (
                          <li key={index} className="flex items-start">
                            <span className="mr-1 font-medium">{index + 1}.</span>
                            <span>{allergy}</span>
                          </li>
                        ))}
                      </ul>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthRecord;