"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { GetDoctorById } from "../service/AdminDoctorService";
import { useRouter } from "next/navigation";
import { Clock, Mail, Phone, User, MapPin, Calendar, Shield, CheckCircle, XCircle } from 'lucide-react';

export default function DoctorDetails({ doctorID }) {
  const [doctor, setDoctor] = useState(null);
  const [dateTime, setDateTime] = useState(null);
  const router = useRouter();
  useEffect(() => {
    //fetch doctor by id
    const fetchDoctor = async () => {
      const getDoctor = await GetDoctorById(doctorID);
      setDoctor(getDoctor);
      console.log("Doctor:", getDoctor);
    };

    fetchDoctor();
    const updateDateTime = () => setDateTime(new Date());
    updateDateTime(); // Set initial time
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, [doctorID]);

  if (!dateTime) return null; // Prevent SSR mismatch


  //check the doctor
  if (!doctor) {
    return (
      <div className="h-[650px] p-8 border-t-[15px] border-l-[15px] border-r-[15px] border-b-0 border-[#E9FAF2]">
        <h1 className="text-3xl font-bold mb-2"> Doctor Details</h1>
        <div className="h-[400px] mt-10 bg-[#E9FAF2] p-6 rounded-lg shadow-md w-full flex flex-col">
          <div className="flex-grow flex items-center justify-center">
            <p className="text-red-400 font-bold text-xl text-center mb-5">
              Doctor not found
            </p>
          </div>
          <Link href="/Admin/AdminDoctor">
            <button
              className="w-full ml-1 px-10 py-2 bg-[#A9C9CD] text-[#09424D] font-semibold rounded-lg 
          hover:bg-[#91B4B8] transition duration-300 cursor-pointer"
            >
              Go to Doctor List
            </button>
          </Link>
        </div>
      </div>
    );
  }

   const InfoItem = ({ icon: Icon, label, value, className = "" }) => (
    <div className={`flex items-center gap-3 p-3 rounded-lg bg-white/50 hover:bg-white/70 transition-all duration-300 ${className}`}>
      <Icon className="w-5 h-5 text-slate-600" />
      <div>
        <span className="text-sm font-medium text-slate-600">{label}:</span>
        <span className="ml-2 text-slate-800">{value}</span>
      </div>
    </div>
  );

  const handleManageDoctor = () => {
    localStorage.setItem("doctor", JSON.stringify(doctor));
    router.push("/Admin/ManageDoctorPage");
  };

  return (
     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-slate-200">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                {doctor.doctor.doctorId} - {doctor.doctor.firstName} {doctor.doctor.lastName}
              </h1>
              <p className="text-xl text-slate-600 mb-4">{doctor.doctor.specialization}</p>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                doctor.doctor.status 
                  ? "bg-green-100 text-green-700" 
                  : "bg-red-100 text-red-700"
              }`}>
                <span className={`w-2 h-2 rounded-full ${
                  doctor.doctor.status ? "bg-green-500" : "bg-red-500"
                }`}></span>
                {doctor.doctor.status ? "Active" : "Inactive"}
              </div>
            </div>
            <button
              onClick={handleManageDoctor}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Manage Doctor
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
              {/* Profile Photo */}
              <div className="relative mb-6">
                <div className="w-40 h-40 mx-auto relative">
                  <img
                    src={
                      doctor.doctor.profilePhoto && doctor.doctor.profilePhoto.trim() !== ""
                        ? `data:image/jpeg;base64,${doctor.doctor.profilePhoto}`
                        : "/profile2.png"
                    }
                    alt="Doctor Avatar"
                    className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>

              {/* Doctor Name */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  {doctor.doctor.firstName} {doctor.doctor.lastName}
                </h2>
                <p className="text-slate-600 mt-1">{doctor.doctor.specialization}</p>
              </div>

              {/* Key Info */}
              <div className="space-y-3">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600">Doctor Fee</span>
                    <span className="text-2xl font-bold text-green-600">Rs.{doctor.doctor.charge}</span>
                  </div>
                </div>
                
                <InfoItem 
                  icon={User} 
                  label="Gender" 
                  value={doctor.doctor.gender} 
                />
                
                <InfoItem 
                  icon={Phone} 
                  label="Contact" 
                  value={doctor.doctor.contactNumber} 
                />
                
                <InfoItem 
                  icon={Shield} 
                  label="SLMC License" 
                  value={doctor.doctor.slmcLicense} 
                />
                
                <InfoItem 
                  icon={Mail} 
                  label="Email" 
                  value={doctor.doctor.email} 
                />
              </div>
            </div>
          </div>

          {/* Details and Availability */}
          <div className="lg:col-span-2 space-y-8">
            {/* Availability Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-blue-600" />
                Availability Schedule
              </h3>
              <div className="grid gap-4">
                {doctor.availability.map((slot, index) => (
                  <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                          <Clock className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-lg">{slot.day}</h4>
                          <p className="text-slate-600">{slot.startTime} - {slot.endTime}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 text-slate-700">
                          <MapPin className="w-4 h-4" />
                          <span className="font-semibold">{slot.hospitalName}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Details */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem 
                  icon={Shield} 
                  label="NIC" 
                  value={doctor.doctor.nic} 
                />
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50">
                  {doctor.doctor.emailVerified ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <div>
                    <span className="text-sm font-medium text-slate-600">Email Verified:</span>
                    <span className={`ml-2 ${doctor.doctor.emailVerified ? 'text-green-600' : 'text-red-600'}`}>
                      {doctor.doctor.emailVerified ? "Verified" : "Not Verified"}
                    </span>
                  </div>
                </div>
                
                <InfoItem 
                  icon={Calendar} 
                  label="Created At" 
                  value={doctor.doctor.createdAt} 
                />
                
                <InfoItem 
                  icon={Calendar} 
                  label="Updated At" 
                  value={doctor.doctor.updatedAt} 
                />
                
                <InfoItem 
                  icon={Clock} 
                  label="Last Login" 
                  value={doctor.doctor.lastLogin} 
                />
              </div>
              
              {/* Description */}
              <div className="mt-6 p-4 bg-slate-50 rounded-xl">
                <h4 className="font-semibold text-slate-900 mb-2">Description:</h4>
                <p className="text-slate-700 leading-relaxed">{doctor.doctor.description}</p>
              </div>
            </div>

            {/* SLMC ID Image */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">SLMC Verification</h3>
               <div className="mt-6 text-center">
        <div className="inline-block p-2 border rounded-2xl shadow-md hover:shadow-xl transition duration-300 ease-in-out">
          <img
            className="rounded-xl min-w-xl h-auto object-contain hover:scale-105 transition-transform duration-300"
            src={`data:image/jpeg;base64,${doctor.doctor.slmcIdImage}`}
            alt="SLMC ID"
          />
          <p className="mt-2 text-sm text-gray-500">SLMC ID Image</p>
        </div>
      </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
