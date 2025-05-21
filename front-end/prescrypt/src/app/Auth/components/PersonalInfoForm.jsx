"use client";
import React from "react";
import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { TextField, Button } from "@mui/material";
import { teal } from "@mui/material/colors";

export default function PersonalInfoForm({
  formData,
  setFormData,
  errors,
  setErrors,
  uploadedFile,
  setUploadedFile,
  setShowUploadModal,
  otherSpecialization,
  setOtherSpecialization,
}) {
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [showSpecializationDropdown, setShowSpecializationDropdown] = useState(false);
  const [specializationSearchTerm, setSpecializationSearchTerm] = useState("");
  const genderOptions = ["Male", "Female"];
  const specializations = [
    "General Medicine",
    "Cardiology",
    "Neurology",
    "Pediatrics",
    "Obstetrics & Gynecology",
    "Ophthalmology",
    "Orthopedics",
    "Dermatology",
    "Psychiatry",
    "ENT (Ear, Nose, Throat)",
    "Gastroenterology",
    "Endocrinology",
    "Nephrology",
    "Oncology",
    "Urology",
    "Pulmonology",
    "Rheumatology",
    "Other",
  ];

  const filteredSpecializations = specializations.filter((s) =>
    s.toLowerCase().includes(specializationSearchTerm.toLowerCase())
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 mb-6">
      {/* Left Column */}
      <div className="flex-1 flex flex-col">
        <div className="mb-6">
          <TextField
            fullWidth
            name="FirstName"
            label="First Name"
            variant="outlined"
            value={formData.FirstName}
            onChange={handleChange}
            error={!!errors.FirstName}
            helperText={errors.FirstName}
            size="small"
          />
        </div>
        <div className="mb-6">
          <TextField
            fullWidth
            name="LastName"
            label="Last Name"
            variant="outlined"
            value={formData.LastName}
            onChange={handleChange}
            error={!!errors.LastName}
            helperText={errors.LastName}
            size="small"
          />
        </div>
        <div className="mb-6 relative">
          <button
            className={`w-full p-3 border rounded-lg bg-white text-left text-sm flex justify-between items-center ${
              errors.Gender ? "border-red-500" : "border-gray-300"
            }`}
            onClick={() => setShowGenderDropdown(!showGenderDropdown)}
          >
            {formData.Gender || "Select Gender"}
            <ChevronDown size={18} className="text-gray-600" />
          </button>
          {showGenderDropdown && (
            <div className="absolute w-full max-h-64 overflow-y-auto bg-white border border-gray-300 rounded-lg mt-1 z-10 shadow-lg">
              {genderOptions.map((gender) => (
                <div
                  key={gender}
                  className="p-3 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => {
                    setFormData({ ...formData, Gender: gender });
                    setShowGenderDropdown(false);
                  }}
                >
                  {gender}
                </div>
              ))}
            </div>
          )}
          {errors.Gender && <p className="text-red-500 text-xs mt-1">{errors.Gender}</p>}
        </div>
        <div className="mb-6 relative">
          <button
            className={`w-full p-3 border rounded-lg bg-white text-left text-sm flex justify-between items-center ${
              errors.Specialization ? "border-red-500" : "border-gray-300"
            }`}
            onClick={() => setShowSpecializationDropdown(!showSpecializationDropdown)}
          >
            {formData.Specialization || "Select Specialization"}
            <ChevronDown size={18} className="text-gray-600" />
          </button>
          {showSpecializationDropdown && (
            <div className="absolute w-full max-h-64 overflow-y-auto bg-white border border-gray-300 rounded-lg mt-1 z-10 shadow-lg">
              <div className="p-2 border-b border-gray-200">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search specializations..."
                    value={specializationSearchTerm}
                    onChange={(e) => setSpecializationSearchTerm(e.target.value)}
                    className="w-full p-2 border rounded text-sm"
                  />
                  <Search size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
                </div>
              </div>
              <div className="max-h-48 overflow-y-auto">
                {filteredSpecializations.map((specialization) => (
                  <div
                    key={specialization}
                    className="p-3 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => {
                      setFormData({ ...formData, Specialization: specialization });
                      setShowSpecializationDropdown(false);
                    }}
                  >
                    {specialization}
                  </div>
                ))}
              </div>
            </div>
          )}
          {errors.Specialization && (
            <p className="text-red-500 text-xs mt-1">{errors.Specialization}</p>
          )}
        </div>
        {formData.Specialization === "Other" && (
          <div className="mb-6">
            <TextField
              fullWidth
              label="Specify your specialization"
              variant="outlined"
              value={otherSpecialization}
              onChange={(e) => setOtherSpecialization(e.target.value)}
              error={!!errors.otherSpecialization}
              helperText={errors.otherSpecialization}
              size="small"
            />
          </div>
        )}
      </div>
      {/* Right Column */}
      <div className="flex-1 flex flex-col">
        <div className="mb-6">
          <TextField
            fullWidth
            name="SLMCRegId"
            label="SLMC License Number"
            variant="outlined"
            value={formData.SLMCRegId}
            onChange={handleChange}
            error={!!errors.SLMCRegId}
            helperText={errors.SLMCRegId}
            size="small"
          />
        </div>
        <div className="mb-6">
          <TextField
            fullWidth
            name="NIC"
            label="NIC number"
            variant="outlined"
            value={formData.NIC}
            onChange={handleChange}
            error={!!errors.NIC}
            helperText={errors.NIC}
            size="small"
          />
        </div>
        <div className="mb-6">
          <TextField
            fullWidth
            name="ContactNumber"
            label="Contact Number"
            variant="outlined"
            value={formData.ContactNumber}
            onChange={handleChange}
            error={!!errors.ContactNumber}
            helperText={errors.ContactNumber}
            size="small"
          />
        </div>
        <div className="mb-6">
          <TextField
            fullWidth
            name="Email"
            label="Email"
            variant="outlined"
            value={formData.Email}
            onChange={handleChange}
            error={!!errors.Email}
            helperText={errors.Email}
            size="small"
          />
        </div>
        <div className="mb-6">
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">
              Rs.
            </span>
            <TextField
              fullWidth
              name="Charge"
              label="Consultation Charge"
              type="number"
              variant="outlined"
              value={formData.Charge}
              onChange={handleChange}
              error={!!errors.Charge}
              helperText={errors.Charge}
              size="small"
              InputProps={{ style: { paddingLeft: "2.5rem" } }}
            />
          </div>
        </div>
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <span className="mr-2 text-sm text-gray-600">Copy of ID:</span>
            <Button
              variant="contained"
              sx={{
                backgroundColor: teal[500],
                "&:hover": {
                  backgroundColor: teal[800],
                },
                
              }}
              size="small"
              onClick={() => setShowUploadModal(true)}
            >
              Upload
            </Button>
          </div>
          {uploadedFile && (
            <div className="text-xs text-gray-600">File: {uploadedFile.name}</div>
          )}
          {errors.uploadedFile && (
            <p className="text-red-500 text-xs mt-1">{errors.uploadedFile}</p>
          )}
        </div>
      </div>
    </div>
  );
}
