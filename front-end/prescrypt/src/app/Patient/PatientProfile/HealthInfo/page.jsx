"use client";
import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaSave, FaHeartbeat, FaWeight, FaRulerVertical, FaVial, FaTint } from 'react-icons/fa';
import axios from 'axios';
import { useRouter } from 'next/navigation'; // Import useRouter hook

const AddHealthData = ({ healthData, onClose, onSave }) => {
  const router = useRouter(); // Initialize router
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    bloodSugar: '',
    heartRate: '',
    systolicBP: '',
    diastolicBP: '',
    allergies: '',
    bloodGroup: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (healthData) {
      // Extract numeric values from strings like "175 cm", "80 kg", etc.
      const extractNumeric = (str) => {
        if (!str || str === "Not recorded") return '';
        const matches = str.match(/^(\d+\.?\d*)/);
        return matches ? matches[1] : '';
      };

      // Extract blood pressure values from "120/80 mmHg"
      const extractBP = (bpStr) => {
        if (!bpStr || bpStr === "Not recorded") return { systolic: '', diastolic: '' };
        const matches = bpStr.match(/^(\d+)\/(\d+)/);
        return matches ? { systolic: matches[1], diastolic: matches[2] } : { systolic: '', diastolic: '' };
      };

      // Format allergies from array to comma-separated string
      const formatAllergies = (allergiesArr) => {
        if (!allergiesArr || allergiesArr.length === 0 || 
            (allergiesArr.length === 1 && allergiesArr[0] === "No allergies recorded")) {
          return '';
        }
        return allergiesArr.join(', ');
      };

      const bp = extractBP(healthData.bloodPressure);

      setFormData({
        height: extractNumeric(healthData.height),
        weight: extractNumeric(healthData.weight),
        bloodSugar: extractNumeric(healthData.bloodSugar),
        heartRate: extractNumeric(healthData.heartRate),
        systolicBP: bp.systolic,
        diastolicBP: bp.diastolic,
        allergies: formatAllergies(healthData.allergies),
        bloodGroup: healthData.bloodGroup !== "Not recorded" ? healthData.bloodGroup : ''
      });
    }
  }, [healthData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Modified handleBackClick function to navigate to PatientProfile
  const handleBackClick = () => {
    // Check if onClose prop exists and call it (for backward compatibility)
    if (onClose) {
      onClose();
    }
    // Navigate to Patient Profile page
    router.push('/Patient/PatientProfile');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Get patientId from localStorage or other state management
      const patientId = "3B879C95-267A-42EA-B546-59FFFB748CFD";
      
      // Format the data as required by the API
      // Creating observations for each vital sign
      const observations = [
        {
          code: "8302-2",
          display: `Height (cm): ${formData.height}`,
          value: parseFloat(formData.height) || 0
        },
        {
          code: "29463-7",
          display: `Weight (kg): ${formData.weight}`,
          value: parseFloat(formData.weight) || 0
        },
        {
          code: "39156-5",
          display: `Body mass index: ${calculateBMI(formData.height, formData.weight)}`,
          value: calculateBMI(formData.height, formData.weight) || 0
        },
        {
          code: "8480-6",
          display: `Systolic blood pressure: ${formData.systolicBP}`,
          value: parseInt(formData.systolicBP) || 0
        },
        {
          code: "8462-4",
          display: `Diastolic blood pressure: ${formData.diastolicBP}`,
          value: parseInt(formData.diastolicBP) || 0
        },
        {
          code: "8867-4",
          display: `Pulse: ${formData.heartRate}`,
          value: parseInt(formData.heartRate) || 0
        },
        {
          code: "2339-0",
          display: `Serum glucose: ${formData.bloodSugar}`,
          value: parseFloat(formData.bloodSugar) || 0
        },
        {
          code: "883-9",
          display: `bloodType: ${formData.bloodGroup}`,
          value: 0
        }
      ];

      // Add allergies if provided
      if (formData.allergies.trim()) {
        observations.push({
          code: "48765-2",
          display: `allergies: ${formData.allergies}`,
          value: 0
        });
      }

      // Send observations to the API
      await axios.post(`https://localhost:7295/api/PatientObservations/${patientId}`, { 
        observations 
      });

      // Format data for the parent component
      const updatedHealthData = {
        ...healthData,
        height: formData.height ? `${formData.height} cm` : "Not recorded",
        weight: formData.weight ? `${formData.weight} kg` : "Not recorded",
        bmi: calculateBMI(formData.height, formData.weight)?.toString() || "Not recorded",
        bloodSugar: formData.bloodSugar ? `${formData.bloodSugar} mg/dL` : "Not recorded",
        heartRate: formData.heartRate ? `${formData.heartRate} bpm` : "Not recorded",
        bloodPressure: (formData.systolicBP && formData.diastolicBP) 
          ? `${formData.systolicBP}/${formData.diastolicBP} mmHg` 
          : "Not recorded",
        allergies: formData.allergies.trim() 
          ? formData.allergies.split(',').map(a => a.trim()) 
          : ["No allergies recorded"],
        bloodGroup: formData.bloodGroup || "Not recorded"
      };

      onSave(updatedHealthData);
      
      // Navigate to Patient Profile page after successful save
      router.push('/Patient/PatientProfile');
    } catch (err) {
      console.error("Error updating health data:", err);
      setError("Failed to update health data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Calculate BMI from height (cm) and weight (kg)
  const calculateBMI = (height, weight) => {
    const heightM = parseFloat(height) / 100; // Convert cm to m
    const weightKg = parseFloat(weight);
    
    if (!heightM || !weightKg || heightM <= 0 || weightKg <= 0) return null;
    
    const bmi = weightKg / (heightM * heightM);
    return bmi.toFixed(1);
  };

  // Get BMI status and color
  const getBmiStatus = (bmi) => {
    if (!bmi) return { status: "", color: "bg-gray-500" };
    
    const bmiValue = parseFloat(bmi);
    if (isNaN(bmiValue)) return { status: "", color: "bg-gray-500" };
    
    if (bmiValue < 18.5) return { status: "Underweight", color: "bg-blue-500" };
    if (bmiValue < 25) return { status: "In good shape", color: "bg-green-500" };
    if (bmiValue < 30) return { status: "Overweight", color: "bg-yellow-500" };
    return { status: "Obese", color: "bg-red-500" };
  };

  // Calculate BMI in real-time for display
  const currentBmi = calculateBMI(formData.height, formData.weight);
  const { status: bmiStatus, color: bmiColor } = getBmiStatus(currentBmi);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <button 
              onClick={handleBackClick} // Changed to new handler
              className="text-gray-600 hover:text-gray-900 flex items-center"
            >
              <FaArrowLeft className="mr-2" /> Back
            </button>
            <h2 className="text-xl font-bold text-gray-900">Add Health Data</h2>
            <div className="w-6"></div> {/* Spacer for alignment */}
          </div>

          {error && (
            <div className="mb-4 bg-red-50 p-3 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Height */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <FaRulerVertical className="w-5 h-5 text-gray-400" />
                  <label htmlFor="height" className="text-sm text-gray-600">Height (cm)</label>
                </div>
                <input
                  id="height"
                  name="height"
                  type="number"
                  value={formData.height}
                  onChange={handleInputChange}
                  placeholder="e.g. 175"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Weight */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <FaWeight className="w-5 h-5 text-gray-400" />
                  <label htmlFor="weight" className="text-sm text-gray-600">Weight (kg)</label>
                </div>
                <input
                  id="weight"
                  name="weight"
                  type="number"
                  value={formData.weight}
                  onChange={handleInputChange}
                  placeholder="e.g. 70"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* BMI (calculated automatically, read-only) */}
              <div className="bg-green-50 rounded-xl border border-green-100 p-4">
                <p className="text-sm text-gray-600 mb-1">Body Mass Index (BMI)</p>
                <div className="flex items-center space-x-2 mb-2">
                  <p className="text-xl font-bold text-gray-900">
                    {currentBmi || "N/A"}
                  </p>
                  {currentBmi && (
                    <span className={`${bmiColor} text-white px-2 py-0.5 rounded text-xs font-medium`}>
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
                <div className="flex items-center space-x-3 mb-2">
                  <FaTint className="w-5 h-5 text-red-500" />
                  <label htmlFor="bloodGroup" className="text-sm text-gray-600">Blood Group</label>
                </div>
                <select
                  id="bloodGroup"
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              {/* Blood Sugar */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <FaVial className="w-5 h-5 text-red-500" />
                  <label htmlFor="bloodSugar" className="text-sm text-gray-600">Blood Sugar (mg/dL)</label>
                </div>
                <input
                  id="bloodSugar"
                  name="bloodSugar"
                  type="number"
                  value={formData.bloodSugar}
                  onChange={handleInputChange}
                  placeholder="e.g. 90"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Heart Rate */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <FaHeartbeat className="w-5 h-5 text-red-500" />
                  <label htmlFor="heartRate" className="text-sm text-gray-600">Heart Rate (bpm)</label>
                </div>
                <input
                  id="heartRate"
                  name="heartRate"
                  type="number"
                  value={formData.heartRate}
                  onChange={handleInputChange}
                  placeholder="e.g. 72"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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
                <div className="flex items-center space-x-3 mb-2">
                  <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
                  </svg>
                  <label className="text-sm text-gray-600">Blood Pressure (mmHg)</label>
                </div>
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <input
                      id="systolicBP"
                      name="systolicBP"
                      type="number"
                      value={formData.systolicBP}
                      onChange={handleInputChange}
                      placeholder="Systolic"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Systolic</p>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <span>/</span>
                  </div>
                  <div className="flex-1">
                    <input
                      id="diastolicBP"
                      name="diastolicBP"
                      type="number"
                      value={formData.diastolicBP}
                      onChange={handleInputChange}
                      placeholder="Diastolic"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Diastolic</p>
                  </div>
                </div>
              </div>

              {/* Allergies - Full width in the grid */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 md:col-span-2">
                <div className="flex items-center space-x-3 mb-2">
                  <svg className="w-5 h-5 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v-2h-2v2zm0-4h2V7h-2v6z"/>
                  </svg>
                  <label htmlFor="allergies" className="text-sm text-gray-600">Allergies (comma separated)</label>
                </div>
                <textarea
                  id="allergies"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleInputChange}
                  placeholder="e.g. Penicillin, Peanuts, Latex"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white font-medium ${
                  loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" /> Save Health Data
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

export default AddHealthData;