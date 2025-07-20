"use client";
import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaSave, FaHeartbeat, FaWeight, FaRulerVertical, FaVial, FaTint } from 'react-icons/fa';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const AddHealthDataPage = ({ healthData, onSave }) => {
  const router = useRouter();
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

  const handleBackClick = () => {
    router.push('/Patient/PatientProfile');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Get patientId from localStorage
      const patientId = localStorage.getItem('patientId') || "3B879C95-267A-42EA-B546-59FFFB748CFD";
      
      // Format the data according to the API structure
      const requestBody = {
        patientId: patientId,
        height: parseFloat(formData.height) || 0,
        weight: parseFloat(formData.weight) || 0,
        bloodGroup: formData.bloodGroup || "",
        bloodSugar: parseFloat(formData.bloodSugar) || 0,
        heartRate: parseInt(formData.heartRate) || 0,
        systolicBloodPressure: parseInt(formData.systolicBP) || 0,
        diastolicBloodPressure: parseInt(formData.diastolicBP) || 0,
        allergies: formData.allergies.trim() || ""
      };

      console.log('Sending data to API:', requestBody);

      // Send data to the API endpoint
      const response = await axios.post(
        `https://localhost:7021/api/PatientVitals/patient/${patientId}/update-vitals`,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('API Response:', response.data);

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

      if (onSave) {
        onSave(updatedHealthData);
      }
      
      // Show success message
      alert('Health data updated successfully!');
      
      // Navigate to Patient Profile page after successful save
      router.push('/Patient/PatientProfile');
    } catch (err) {
      console.error("Error updating health data:", err);
      
      // More detailed error handling
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(`Failed to update health data: ${err.response.data?.message || err.response.statusText}`);
      } else if (err.request) {
        // The request was made but no response was received
        setError("Network error. Please check your connection and try again.");
      } else {
        // Something happened in setting up the request that triggered an Error
        setError("Failed to update health data. Please try again later.");
      }
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
    <div className="min-h-screen bg py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <button 
                onClick={handleBackClick}
                className="text-gray-600 hover:text-gray-900 flex items-center transition-colors duration-200"
              >
                <FaArrowLeft className="mr-2" /> Back
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Add Health Data</h1>
              <div className="w-20"></div> {/* Spacer for alignment */}
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 p-4 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Height */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                  <div className="flex items-center space-x-3 mb-3">
                    <FaRulerVertical className="w-5 h-5 text-blue-500" />
                    <label htmlFor="height" className="text-sm font-medium text-gray-700">Height (cm)</label>
                  </div>
                  <input
                    id="height"
                    name="height"
                    type="number"
                    step="0.1"
                    value={formData.height}
                    onChange={handleInputChange}
                    placeholder="e.g. 175"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Weight */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                  <div className="flex items-center space-x-3 mb-3">
                    <FaWeight className="w-5 h-5 text-green-500" />
                    <label htmlFor="weight" className="text-sm font-medium text-gray-700">Weight (kg)</label>
                  </div>
                  <input
                    id="weight"
                    name="weight"
                    type="number"
                    step="0.1"
                    value={formData.weight}
                    onChange={handleInputChange}
                    placeholder="e.g. 70"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* BMI (calculated automatically, read-only) */}
                <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border border-green-100 p-4 shadow-sm">
                  <p className="text-sm font-medium text-gray-700 mb-2">Body Mass Index (BMI)</p>
                  <div className="flex items-center space-x-2 mb-3">
                    <p className="text-2xl font-bold text-gray-900">
                      {currentBmi || "N/A"}
                    </p>
                    {currentBmi && (
                      <span className={`${bmiColor} text-white px-3 py-1 rounded-full text-xs font-medium`}>
                        {bmiStatus}
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-1">
                    <div className="h-2 w-1/4 bg-blue-300 rounded-full"></div>
                    <div className="h-2 w-1/4 bg-green-500 rounded-full"></div>
                    <div className="h-2 w-1/4 bg-yellow-300 rounded-full"></div>
                    <div className="h-2 w-1/4 bg-red-300 rounded-full"></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Under</span>
                    <span>Normal</span>
                    <span>Over</span>
                    <span>Obese</span>
                  </div>
                </div>

                {/* Blood Group */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                  <div className="flex items-center space-x-3 mb-3">
                    <FaTint className="w-5 h-5 text-red-500" />
                    <label htmlFor="bloodGroup" className="text-sm font-medium text-gray-700">Blood Group</label>
                  </div>
                  <select
                    id="bloodGroup"
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                  <div className="flex items-center space-x-3 mb-3">
                    <FaVial className="w-5 h-5 text-purple-500" />
                    <label htmlFor="bloodSugar" className="text-sm font-medium text-gray-700">Blood Sugar (mg/dL)</label>
                  </div>
                  <input
                    id="bloodSugar"
                    name="bloodSugar"
                    type="number"
                    step="0.1"
                    value={formData.bloodSugar}
                    onChange={handleInputChange}
                    placeholder="e.g. 90"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Heart Rate */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                  <div className="flex items-center space-x-3 mb-3">
                    <FaHeartbeat className="w-5 h-5 text-red-500" />
                    <label htmlFor="heartRate" className="text-sm font-medium text-gray-700">Heart Rate (bpm)</label>
                  </div>
                  <input
                    id="heartRate"
                    name="heartRate"
                    type="number"
                    value={formData.heartRate}
                    onChange={handleInputChange}
                    placeholder="e.g. 72"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="mt-3 h-8">
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
                <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                  <div className="flex items-center space-x-3 mb-3">
                    <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
                    </svg>
                    <label className="text-sm font-medium text-gray-700">Blood Pressure (mmHg)</label>
                  </div>
                  <div className="flex space-x-3">
                    <div className="flex-1">
                      <input
                        id="systolicBP"
                        name="systolicBP"
                        type="number"
                        value={formData.systolicBP}
                        onChange={handleInputChange}
                        placeholder="Systolic"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">Systolic</p>
                    </div>
                    <div className="flex items-center text-gray-500 text-xl font-bold">
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">Diastolic</p>
                    </div>
                  </div>
                </div>

                {/* Allergies - Full width in the grid */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm md:col-span-2">
                  <div className="flex items-center space-x-3 mb-3">
                    <svg className="w-5 h-5 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v-2h-2v2zm0-4h2V7h-2v6z"/>
                    </svg>
                    <label htmlFor="allergies" className="text-sm font-medium text-gray-700">Allergies (comma separated)</label>
                  </div>
                  <textarea
                    id="allergies"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleInputChange}
                    placeholder="e.g. Penicillin, Peanuts, Latex"
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className={`inline-flex items-center px-6 py-3 rounded-lg bg-blue-600 text-white font-medium text-sm transition-all duration-200 ${
                    loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5'
                  }`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
    </div>
  );
};

export default AddHealthDataPage;