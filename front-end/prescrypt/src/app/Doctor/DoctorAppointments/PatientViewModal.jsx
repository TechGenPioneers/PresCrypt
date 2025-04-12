import React, { useState, useRef, useEffect } from "react";
import { CloudUpload, Loader2, X } from "lucide-react";

export default function PatientViewModal({ isOpen, onClose, patient }) {
  const [isTextMode, setIsTextMode] = useState(false);
  const [prescriptionText, setPrescriptionText] = useState('');
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setIsTextMode(false);
      setPrescriptionText('');
      setPrescriptionFile(null);
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!prescriptionText && !prescriptionFile) {
        throw new Error("Please enter prescription text or upload a file");
      }

      const formData = new FormData();
      formData.append('patientId', patient.patientId);
      formData.append('hospitalId', patient.hospitalId);

      if (isTextMode) {
        formData.append('prescriptionText', prescriptionText);
      } else if (prescriptionFile) {
        formData.append('prescriptionFile', prescriptionFile);
      }

      const response = await fetch('/DoctorPrescription/submit-prescription', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit prescription");
      }

      alert('Prescription submitted successfully');
      onClose();
    } catch (error) {
      setError(error.message);
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png'];
      const maxSize = 10 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        setError("Please upload a JPEG or PNG image file");
        return;
      }

      if (file.size > maxSize) {
        setError("File size must be less than 10MB");
        return;
      }

      setPrescriptionFile(file);
      setError(null);
    }
  };

  const removeFile = () => {
    setPrescriptionFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!isOpen || !patient) return null;

  return (
    <div className="fixed inset-0 bg-[#ffffffc0] flex items-center justify-center z-50">
      <div className="p-1 bg-[#E9FAF2] rounded-[20px] shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-10 relative border-2 border-dashed border-black rounded-[20px]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Patient Info Section */}
            <div className="md:w-1/2">
              <h2 className="text-xl font-bold mb-4">Patient Details</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={`data:image/jpeg;base64,${patient.profileImage}`}
                    alt="Patient"
                    className="w-30 h-30 rounded-full object-cover border-2 border-[#094A4D]"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{patient.patientName}</h3>
                    <p className="text-gray-600">
                      {patient.gender === "M" ? "Male" : "Female"},{" "}
                      {new Date().getFullYear() - new Date(patient.dob).getFullYear()} years
                    </p>
                    <p className="text-sm text-gray-500">ID: {patient.patientId}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <span className="font-semibold">Hospital:</span>{" "}
                    <span>{patient.hospitalName}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Appointment Time:</span>{" "}
                    <span>{patient.time}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Status:</span>{" "}
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        patient.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {patient.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Prescription Section */}
            <div className="md:w-1/2">
              <h2 className="text-xl font-bold mb-4 text-center">Add Prescription</h2>

              <div className="flex justify-center mb-4">
                <button
                  type="button"
                  onClick={() => setIsTextMode(!isTextMode)}
                  className="px-4 py-2 rounded-lg text-[#094A4D] transition-colors cursor-pointer hover:underline"
                >
                  {isTextMode ? "Switch to File Upload" : "Switch to Text Entry"}
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {isTextMode ? (
                  <div>
                    <label className="block font-medium mb-2">Prescription Details</label>
                    <textarea
                      value={prescriptionText}
                      onChange={(e) => setPrescriptionText(e.target.value)}
                      rows={6}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#094A4D] focus:border-transparent"
                      placeholder="Enter prescription details..."
                      required={isTextMode}
                    />
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="border-2 border-dashed border-gray-300 rounded-[20px] p-6">
                      <CloudUpload className="mx-auto mb-3 text-[#094A4D]" size={32} />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        className="px-4 py-2 bg-[#094A4D] text-white rounded-[10px] cursor-pointer transition-colors"
                      >
                        Browse Files
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".jpg,.jpeg,.png"
                      />
                      <p className="mt-4 text-sm text-gray-500">
                        Supported formats: JPG, PNG (max 10MB)
                      </p>
                    </div>

                    {prescriptionFile && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-[10px] flex justify-between items-center">
                        <span className="truncate">{prescriptionFile.name}</span>
                        <button
                          type="button"
                          onClick={removeFile}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 p-2 rounded-lg">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-6 px-4 py-2 bg-[#094A4D] text-white rounded-[10px] cursor-pointer transition-colors flex justify-center items-center"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={18} />
                      Submitting...
                    </>
                  ) : (
                    "Submit Prescription"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
