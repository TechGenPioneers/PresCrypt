"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { GetDoctorById } from "../service/AdminDoctorService";
import { useRouter } from "next/navigation";
import {
  Clock,
  Mail,
  Phone,
  User,
  MapPin,
  Calendar,
  Shield,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { UserX, ArrowLeft, Search, Stethoscope } from "lucide-react";

export default function DoctorDetails({ doctorID }) {
  const [doctor, setDoctor] = useState(null);
  const [dateTime, setDateTime] = useState(null);
  const [showNotFound, setShowNotFound] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!doctor) {
        setShowNotFound(true);
      }
    }, 60000); // 1 minute = 60000ms

    if (doctor) {
      clearTimeout(timeout); // cancel timeout if doctor is loaded
      setShowNotFound(false);
    }

    return () => clearTimeout(timeout); // cleanup on unmount
  }, [doctor]);

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
  if (showNotFound && !doctor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-slate-200">
            <h1 className="text-4xl font-bold text-slate-900 flex items-center gap-3">
              <Stethoscope className="w-8 h-8 text-blue-600" />
              Doctor Details
            </h1>
          </div>

          {/* Not Found Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-visible">
            <div className="h-96 flex flex-col">
              {/* Content Area */}
              <div className="flex-grow flex items-center justify-center p-12">
                <div className="text-center space-y-6">
                  {/* Icon */}
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <UserX className="w-12 h-12 text-red-500" />
                    </div>
                  </div>

                  {/* Error Message */}
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-red-500">
                      Doctor Not Found
                    </h2>
                    <p className="text-slate-600 max-w-md mx-auto leading-relaxed">
                      We couldn't find the doctor you're looking for. They may
                      have been removed or the ID might be incorrect.
                    </p>
                  </div>

                  {/* Decorative Elements */}
                  <div className="flex justify-center space-x-2 mt-8">
                    <div className="w-2 h-2 bg-red-300 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse delay-100"></div>
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse delay-200"></div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-8 bg-gradient-to-r from-slate-50 to-blue-50 border-t border-slate-200">
                <Link href="/Admin/AdminDoctor">
                  <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-4 px-8 rounded-xl hover:from-blue-700 hover:to-blue-800 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3">
                    <ArrowLeft className="w-5 h-5" />
                    Go to Doctor List
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Additional Help Section */}
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">
              What you can do:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mb-3">
                  <Search className="w-4 h-4 text-white" />
                </div>
                <h4 className="font-semibold text-slate-900 mb-1">
                  Search Again
                </h4>
                <p className="text-sm text-slate-600">
                  Try searching with a different doctor ID or name
                </p>
              </div>

              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mb-3">
                  <Stethoscope className="w-4 h-4 text-white" />
                </div>
                <h4 className="font-semibold text-slate-900 mb-1">
                  Browse All Doctors
                </h4>
                <p className="text-sm text-slate-600">
                  View the complete list of available doctors
                </p>
              </div>

              <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mb-3">
                  <UserX className="w-4 h-4 text-white" />
                </div>
                <h4 className="font-semibold text-slate-900 mb-1">
                  Add New Doctor
                </h4>
                <p className="text-sm text-slate-600">
                  Create a new doctor profile if needed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const InfoItem = ({ icon: Icon, label, value, className = "" }) => (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg bg-white/50 hover:bg-white/70 transition-all duration-300 ${className}`}
    >
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
      {doctor?.doctor ? (
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-slate-200">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-4xl font-bold text-slate-900 mb-2">
                  {doctor.doctor.doctorId} - {doctor.doctor.firstName}{" "}
                  {doctor.doctor.lastName}
                </h1>
                <p className="text-xl text-slate-600 mb-4">
                  {doctor.doctor.specialization}
                </p>
                <div
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                    doctor.doctor.status
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      doctor.doctor.status ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></span>
                  {doctor.doctor.status ? "Active" : "Inactive"}
                </div>
              </div>
              <button
                onClick={handleManageDoctor}
                className="px-8 py-3  bg-[#A9C9CD] text-[#09424D]  font-semibold rounded-xl hover:bg-[#91B4B8]  transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Manage Doctor
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
                {/* Profile Photo */}
                <div className="relative mb-6">
                  <div className="w-40 h-40 mx-auto relative">
                    <img
                      src={
                        doctor.doctor.profilePhoto &&
                        doctor.doctor.profilePhoto.trim() !== ""
                          ? `data:image/jpeg;base64,${doctor.doctor.profilePhoto}`
                          : "/profile2.png"
                      }
                      alt="Doctor Avatar"
                      className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  </div>
                </div>

                {/* Doctor Name */}
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">
                    {doctor.doctor.firstName} {doctor.doctor.lastName}
                  </h2>
                  <p className="text-slate-600 mt-1">
                    {doctor.doctor.specialization}
                  </p>
                </div>

                {/* Key Info */}
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-600">
                        Doctor Fee
                      </span>
                      <span className="text-2xl font-bold text-green-600">
                        Rs.{doctor.doctor.charge}
                      </span>
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
              {/* SLMC ID Image */}
              <div className="bg-white rounded-2xl mt-5 shadow-lg p-8 border border-slate-200">
                <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">
                  SLMC Verification
                </h3>
                <div className="mt-6 text-center">
                  <div className="inline-block p-2 border rounded-2xl shadow-md hover:shadow-xl transition duration-300 ease-in-out">
                    <img
                      className="rounded-xl min-w-lg h-auto object-contain hover:scale-105 transition-transform duration-300"
                      src={`data:image/jpeg;base64,${doctor.doctor.slmcIdImage}`}
                      alt="SLMC ID"
                    />
                    <p className="mt-2 text-sm text-gray-500">SLMC ID Image</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Details and Availability */}
            <div className="lg:col-span-2 space-y-8 ">
              {/* Availability Card */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
                <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-green-700" />
                  Availability Schedule
                </h3>
                <div className="grid gap-4">
                  {doctor.availability.map((slot, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r bg-[#E9FAF2] p-6 rounded-xl border border-[#A9C9CD] hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-green-700 rounded-full flex items-center justify-center">
                            <Clock className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 text-lg">
                              {slot.day}
                            </h4>
                            <p className="text-slate-600">
                              {slot.startTime} - {slot.endTime}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 text-slate-700">
                            <MapPin className="w-4 h-4" />
                            <span className="font-semibold">
                              {slot.hospitalName}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Details */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">
                  Additional Information
                </h3>
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
                      <span className="text-sm font-medium text-slate-600">
                        Email Verified:
                      </span>
                      <span
                        className={`ml-2 ${
                          doctor.doctor.emailVerified
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {doctor.doctor.emailVerified
                          ? "Verified"
                          : "Not Verified"}
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
                  <h4 className="font-semibold text-slate-900 mb-2">
                    Description:
                  </h4>
                  <p className="text-slate-700 leading-relaxed">
                    {doctor.doctor.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-[400px]">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 border-4 border-[#E9FAF2] border-t-[#50d094] rounded-full animate-spin"></div>
            <p className="text-slate-600 text-lg font-medium">
              Loading Doctor Details...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
