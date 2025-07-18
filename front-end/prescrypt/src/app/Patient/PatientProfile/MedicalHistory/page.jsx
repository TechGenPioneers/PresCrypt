"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Header from '@/app/Components/header/Header';
import Sidebar from '@/app/Patient/PatientComponents/navBar';

const HealthRecord = () => {
  const router = useRouter();
  
  const [healthData, setHealthData] = useState({
    vitals: [],
    measurements: [],
    labResults: [],
    personalInfo: {
      bloodType: '',
      allergies: []
    }
  });
  
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTab, setSelectedTab] = useState('overview');
  const [uploadingFile, setUploadingFile] = useState(false);

  // Helper function to extract value from display string
  const extractValueFromDisplay = (display) => {
    if (!display) return null;
    const match = display.match(/:\s*([^,\s]+)/);
    return match ? match[1] : null;
  };

  // Helper function to parse allergies
  const parseAllergies = (display) => {
    if (!display) return [];
    const allergiesText = extractValueFromDisplay(display);
    return allergiesText ? allergiesText.split(', ').map(a => a.trim()) : [];
  };

  // Helper function to categorize observations
  const categorizeObservations = (results) => {
    const vitals = [];
    const measurements = [];
    const labResults = [];
    let bloodType = '';
    let allergies = [];

    results.forEach((obs, index) => {
      const display = obs.display || '';
      const value = extractValueFromDisplay(display);
      
      if (display.includes('Pulse')) {
        vitals.push({
          id: index,
          type: 'Pulse',
          value: value,
          unit: 'bpm',
          status: value && parseInt(value) >= 60 && parseInt(value) <= 100 ? 'normal' : 'warning'
        });
      } else if (display.includes('Systolic blood pressure')) {
        vitals.push({
          id: index,
          type: 'Systolic Blood Pressure',
          value: value,
          unit: 'mmHg',
          status: value && parseInt(value) >= 90 && parseInt(value) <= 140 ? 'normal' : 'warning'
        });
      } else if (display.includes('Diastolic blood pressure')) {
        vitals.push({
          id: index,
          type: 'Diastolic Blood Pressure',
          value: value,
          unit: 'mmHg',
          status: value && parseInt(value) >= 60 && parseInt(value) <= 90 ? 'normal' : 'warning'
        });
      } else if (display.includes('Temperature')) {
        vitals.push({
          id: index,
          type: 'Temperature',
          value: value,
          unit: '°C',
          status: value && parseFloat(value) >= 36.1 && parseFloat(value) <= 37.2 ? 'normal' : 'warning'
        });
      } else if (display.includes('Respiratory rate')) {
        vitals.push({
          id: index,
          type: 'Respiratory Rate',
          value: value,
          unit: '/min',
          status: value && parseInt(value) >= 12 && parseInt(value) <= 20 ? 'normal' : 'warning'
        });
      } else if (display.includes('oxygen saturation')) {
        vitals.push({
          id: index,
          type: 'Oxygen Saturation',
          value: value,
          unit: '%',
          status: value && parseFloat(value) >= 95 ? 'excellent' : 'warning'
        });
      } else if (display.includes('Weight')) {
        measurements.push({
          id: index,
          type: 'Weight',
          value: value,
          unit: 'kg',
          date: new Date().toISOString().split('T')[0]
        });
      } else if (display.includes('Height')) {
        measurements.push({
          id: index,
          type: 'Height',
          value: value,
          unit: 'cm',
          date: new Date().toISOString().split('T')[0]
        });
      } else if (display.includes('Body mass index')) {
        measurements.push({
          id: index,
          type: 'BMI',
          value: value,
          unit: 'kg/m²',
          date: new Date().toISOString().split('T')[0]
        });
      } else if (display.includes('Mid-upper arm circumference')) {
        measurements.push({
          id: index,
          type: 'Mid-upper arm circumference',
          value: value,
          unit: 'cm',
          date: new Date().toISOString().split('T')[0]
        });
      } else if (display.includes('Serum glucose')) {
        labResults.push({
          id: index,
          type: 'Serum Glucose',
          value: value,
          unit: 'mg/dL',
          status: value && parseInt(value) >= 70 && parseInt(value) <= 100 ? 'normal' : 'warning',
          range: '70-100'
        });
      } else if (display.includes('bloodType')) {
        bloodType = value || '';
      } else if (display.includes('allergies')) {
        allergies = parseAllergies(display);
      }
    });

    return { vitals, measurements, labResults, bloodType, allergies };
  };

  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      const newAttachment = {
        id: Date.now(),
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date().toISOString(),
        url: URL.createObjectURL(file)
      };
      setAttachments(prev => [...prev, newAttachment]);
      event.target.value = '';
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Failed to upload file. Please try again.');
    } finally {
      setUploadingFile(false);
    }
  };

  // Handle file deletion
  const handleDeleteAttachment = (attachmentId) => {
    // Find the attachment to revoke its URL before removing from state
    const attachmentToRemove = attachments.find(att => att.id === attachmentId);
    if (attachmentToRemove) {
      URL.revokeObjectURL(attachmentToRemove.url);
    }
    setAttachments(prev => prev.filter(attachment => attachment.id !== attachmentId));
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get file icon based on type
  const getFileIcon = (type) => {
    if (type.includes('image')) return '🖼️';
    if (type.includes('pdf')) return '📄';
    if (type.includes('document') || type.includes('word')) return '📝';
    if (type.includes('spreadsheet') || type.includes('excel')) return '📊';
    return '📎';
  };

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const patientId = localStorage.getItem('patientId') || "P021";
        
        if (!patientId) {
          setError("Patient ID not found. Please log in again.");
          setLoading(false);
          return;
        }
  
        // Fetch health data (Vitals, Measurements, Labs)
        try {
          const healthResponse = await axios.get(`https://localhost:7021/api/PatientObservations/${patientId}`);
          let results = [];
          if (healthResponse.data && healthResponse.data.data) {
            try {
              const parsedData = JSON.parse(healthResponse.data.data);
              results = parsedData.results || [];
            } catch (parseError) {
              console.error('Error parsing health data JSON:', parseError);
            }
          }
          const categorizedData = categorizeObservations(results);
          setHealthData({
            vitals: categorizedData.vitals,
            measurements: categorizedData.measurements,
            labResults: categorizedData.labResults,
            personalInfo: {
              bloodType: categorizedData.bloodType,
              allergies: categorizedData.allergies.length > 0 ? categorizedData.allergies : ["No allergies recorded"]
            }
          });
        } catch (healthErr) {
          console.error("Error fetching health data:", healthErr);
          setError("Couldn't connect to the server for health data.");
        }
        
        // Fetch attachments
        try {
          const attachmentResponse = await axios.get(`https://localhost:7021/api/PatientAttachment/${patientId}`);
          if (attachmentResponse.data && Array.isArray(attachmentResponse.data.observations)) {
            const formattedAttachments = attachmentResponse.data.observations.map((att, index) => {
              if (!att.attachmentValue) return null;
              
              const byteCharacters = atob(att.attachmentValue);
              const byteNumbers = new Array(byteCharacters.length);
              for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
              }
              const byteArray = new Uint8Array(byteNumbers);
              
              const fileType = 'application/pdf'; // Assuming PDF
              const blob = new Blob([byteArray], { type: fileType });
              const objectUrl = URL.createObjectURL(blob);

              return {
                id: att.observationUuid || index,
                name: `Attachment-${att.observationUuid.slice(0, 8)}.pdf`,
                size: blob.size,
                type: fileType,
                uploadDate: att.obsDatetime || new Date().toISOString(),
                url: objectUrl,
              };
            }).filter(Boolean);
            
            setAttachments(formattedAttachments);
          } else {
            setAttachments([]);
          }
        } catch (attachErr) {
          console.error("Failed to fetch attachments:", attachErr);
          setError(prevError => (prevError ? prevError + "\n" : "") + "Failed to load attachments.");
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching patient data:", err);
        setError("Failed to load patient data. Please try again later.");
        setLoading(false);
      }
    };
  
    fetchPatientData();

    return () => {
      attachments.forEach(attachment => URL.revokeObjectURL(attachment.url));
    };
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'normal': return 'text-green-600 bg-green-50';
      case 'excellent': return 'text-blue-600 bg-blue-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'danger': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getLatestVitals = () => {
    const latest = {};
    healthData.vitals.forEach(vital => {
      if (!latest[vital.type] || vital.id > latest[vital.type].id) {
        latest[vital.type] = vital;
      }
    });
    return Object.values(latest);
  };

  const getLatestMeasurements = () => {
    const latest = {};
    healthData.measurements.forEach(measurement => {
      if (!latest[measurement.type] || measurement.id > latest[measurement.type].id) {
        latest[measurement.type] = measurement;
      }
    });
    return Object.values(latest);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
        <Sidebar />
        <div className="ml-16 sm:ml-20 md:ml-24 lg:ml-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
        <Sidebar />
        <div className="ml-16 sm:ml-20 md:ml-24 lg:ml-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="text-red-400">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p className="whitespace-pre-line">{error}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <Sidebar />
      <div className="ml-16 sm:ml-20 md:ml-24 lg:ml-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Medical History</h1>
            <p className="text-gray-600">Track and monitor your health data over time</p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 mb-8 bg-white rounded-lg p-1 shadow-sm border border-gray-200">
            {['overview', 'vitals', 'measurements', 'labs', 'attachments'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                  selectedTab === tab
                    ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Content based on selected tab */}
          {selectedTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Blood Type</p>
                      <p className="text-2xl font-bold text-red-600">
                        {healthData.personalInfo.bloodType || 'Not recorded'}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 font-bold">🩸</span>
                    </div>
                  </div>
                </div>

                {getLatestMeasurements().slice(0, 3).map((measurement, index) => (
                  <div key={measurement.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{measurement.type}</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {measurement.value} {measurement.unit}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-bold">
                          {measurement.type === 'Weight' ? '⚖️' : measurement.type === 'Height' ? '📏' : '📊'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Latest Vitals */}
              {healthData.vitals.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Latest Vital Signs</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getLatestVitals().map((vital) => (
                      <div key={vital.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm text-gray-600">{vital.type}</p>
                            <p className="text-xl font-bold text-gray-900">{vital.value} {vital.unit}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vital.status)}`}>
                            {vital.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Allergies */}
              {healthData.personalInfo.allergies.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">⚠️ Allergies & Sensitivities</h3>
                  <div className="flex flex-wrap gap-2">
                    {healthData.personalInfo.allergies.map((allergy, index) => (
                      <span key={index} className={`px-3 py-1 rounded-full text-sm font-medium border ${
                        allergy === 'No allergies recorded' 
                          ? 'bg-green-50 text-green-700 border-green-200' 
                          : 'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {selectedTab === 'vitals' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Vital Signs History</h3>
                {healthData.vitals.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {healthData.vitals.map((vital) => (
                      <div key={vital.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm text-gray-600">{vital.type}</p>
                            <p className="text-xl font-bold text-gray-900">{vital.value} {vital.unit}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vital.status)}`}>
                            {vital.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No vital signs recorded yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedTab === 'measurements' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Body Measurements</h3>
                {healthData.measurements.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {healthData.measurements.map((measurement) => (
                      <div key={measurement.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm text-gray-600">{measurement.type}</p>
                            <p className="text-xl font-bold text-gray-900">{measurement.value} {measurement.unit}</p>
                            <p className="text-xs text-gray-500 mt-1">{measurement.date}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No measurements recorded yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedTab === 'labs' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Laboratory Results</h3>
                {healthData.labResults.length > 0 ? (
                  <div className="space-y-4">
                    {healthData.labResults.map((lab) => (
                      <div key={lab.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm text-gray-600">{lab.type}</p>
                            <p className="text-xl font-bold text-gray-900">{lab.value} {lab.unit}</p>
                            <p className="text-xs text-gray-500 mt-1">Normal Range: {lab.range}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lab.status)}`}>
                            {lab.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No laboratory results recorded yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedTab === 'attachments' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Medical Attachments</h3>
                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      id="fileUpload"
                      className="hidden"
                      onChange={handleFileUpload}
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                    />
                    <label
                      htmlFor="fileUpload"
                      className={`px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg cursor-pointer hover:from-blue-600 hover:to-teal-600 transition-all duration-200 flex items-center space-x-2 ${
                        uploadingFile ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {uploadingFile ? (
                        <>
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          <span>Add File</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                {attachments.length > 0 ? (
                  <div className="space-y-4">
                    {attachments.map((attachment) => (
                      <div key={attachment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-4">
                          <div className="text-2xl">
                            {getFileIcon(attachment.type)}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{attachment.name}</p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(attachment.size)} • {new Date(attachment.uploadDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <a
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                          >
                            View
                          </a>
                          <button
                            onClick={() => handleDeleteAttachment(attachment.id)}
                            className="px-3 py-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📎</div>
                    <p className="text-gray-500 mb-4">No attachments uploaded yet.</p>
                    <p className="text-sm text-gray-400">Upload medical documents, test results, or other relevant files.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthRecord;