"use client";
import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaBirthdayCake, FaPhone, FaMapMarkerAlt, FaArrowLeft, FaSave } from 'react-icons/fa';
import Image from 'next/image';
import axios from 'axios';

const EditProfile = ({ patientData, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    birthDate: '',
    phone: '',
    email: '',
    address: '',
    profileImage: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (patientData) {
      // Format birthDate from MM/DD/YYYY to YYYY-MM-DD for the date input
      const birthParts = patientData.birthDate?.split('/');
      const formattedBirthDate = birthParts?.length === 3 
        ? `${birthParts[2]}-${birthParts[0]}-${birthParts[1]}`
        : '';

      setFormData({
        name: patientData.name || '',
        gender: patientData.gender || '',
        birthDate: formattedBirthDate || '',
        phone: patientData.phone || '',
        email: patientData.email || '',
        address: patientData.address || '',
      });

      if (patientData.profileImage) {
        setPreviewImage(`data:image/jpeg;base64,${patientData.profileImage}`);
      }
    }
  }, [patientData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        // Extract base64 content without the data URI prefix
        const base64String = reader.result.split(',')[1];
        setFormData(prev => ({
          ...prev,
          profileImage: base64String
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Format birthDate from YYYY-MM-DD to MM/DD/YYYY for API
      const birthDate = formData.birthDate ? new Date(formData.birthDate) : null;
      const formattedBirthDate = birthDate 
        ? `${(birthDate.getMonth() + 1).toString().padStart(2, '0')}/${
            birthDate.getDate().toString().padStart(2, '0')}/${
            birthDate.getFullYear()}`
        : '';

      const dataToSend = {
        ...formData,
        birthDate: birthDate ? birthDate.toISOString() : null,
        profileImageBase64: formData.profileImage,
      };

      // Get patientId from localStorage or other state management
      const patientId = "3B879C95-267A-42EA-B546-59FFFB748CFD";

      // Send data to API
      await axios.put(`https://localhost:7295/api/Patients/${patientId}`, dataToSend);

      // Format data for the parent component
      const updatedData = {
        ...patientData,
        ...formData,
        birthDate: formattedBirthDate,
        profileImage: formData.profileImage || patientData.profileImage
      };

      onSave(updatedData);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <button 
              onClick={onClose}
              className="text-gray-600 hover:text-gray-900 flex items-center"
            >
              <FaArrowLeft className="mr-2" /> Back
            </button>
            <h2 className="text-xl font-bold text-gray-900">Edit Your Profile</h2>
            <div className="w-6"></div> {/* Spacer for alignment */}
          </div>

          {error && (
            <div className="mb-4 bg-red-50 p-3 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Profile Image */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-3">
                {previewImage ? (
                  <Image 
                    src={previewImage}
                    alt="Profile Preview"
                    width={80}
                    height={80}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                    <FaUser className="w-8 h-8 text-gray-400" />
                  </div>
                )}

                <label 
                  htmlFor="profile-image" 
                  className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1 cursor-pointer hover:bg-blue-600 transition duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </label>
                <input 
                  id="profile-image" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageChange}
                />
              </div>
              <span className="text-sm text-gray-500">Click to change profile picture</span>
            </div>

            <div className="space-y-4">
              {/* Name */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <FaUser className="w-5 h-5 text-gray-400" />
                  <label htmlFor="name" className="text-sm text-gray-600">Name</label>
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Gender */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <FaUser className="w-5 h-5 text-gray-400" />
                  <label htmlFor="gender" className="text-sm text-gray-600">Gender</label>
                </div>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Birth Date */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <FaBirthdayCake className="w-5 h-5 text-gray-400" />
                  <label htmlFor="birthDate" className="text-sm text-gray-600">Birth Date</label>
                </div>
                <input
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Phone Number */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <FaPhone className="w-5 h-5 text-gray-400" />
                  <label htmlFor="phone" className="text-sm text-gray-600">Phone Number</label>
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Email */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <FaEnvelope className="w-5 h-5 text-gray-400" />
                  <label htmlFor="email" className="text-sm text-gray-600">Email Address</label>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Address */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <FaMapMarkerAlt className="w-5 h-5 text-gray-400" />
                  <label htmlFor="address" className="text-sm text-gray-600">Address</label>
                </div>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  required
                />
              </div>
            </div>

            <div className="mt-6 flex space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-medium transition duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium flex items-center justify-center transition duration-200"
                disabled={loading}
              >
                {loading ? (
                  <span className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                ) : (
                  <>
                    <FaSave className="mr-2" /> Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;