import React, { useState, useRef, useEffect } from "react";
import {
  CloudUpload,
  Loader2,
  X,
  FileText,
  Image,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function PatientViewModal({ isOpen, onClose, patient }) {
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setPrescriptionFile(null);
      setError(null);
      setIsDragOver(false);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      if (!prescriptionFile) {
        throw new Error("Please upload a prescription file");
      }

      const formData = new FormData();
      formData.append("patientId", patient.patientId);
      formData.append("hospitalId", patient.hospitalId);
      formData.append("prescriptionFile", prescriptionFile);

      const response = await fetch("/DoctorPrescription/submit-prescription", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit prescription");
      }

      alert("Prescription submitted successfully");
      onClose();
    } catch (error) {
      setError(error.message);
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (file) => {
    if (file) {
      const validTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "application/pdf",
      ];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!validTypes.includes(file.type)) {
        setError("Please upload a PDF, JPEG, JPG, or PNG file");
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

  const handleInputFileChange = (e) => {
    const file = e.target.files[0];
    handleFileChange(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const removeFile = () => {
    setPrescriptionFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getFileIcon = (fileType) => {
    if (fileType === "application/pdf") {
      return <FileText className="w-5 h-5 text-red-500" />;
    }
    return <Image className="w-5 h-5 text-blue-500" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-emerald-50/90 to-green-50/90 rounded-3xl shadow-2xl border border-emerald-500 max-w-6xl w-full max-h-[95vh] overflow-hidden">
        <div className="bg-white/80 backdrop-blur-sm m-4 rounded-2xl border border-emerald-200/40 overflow-y-auto max-h-[calc(95vh-2rem)]">
          <div className="p-8 relative">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-3 rounded-full hover:bg-red-50/80 transition-all duration-200 group shadow-sm border border-red-100/50"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-red-600 group-hover:text-red-700" />
            </button>

            <div className="flex flex-col lg:flex-row gap-10">
              {/* Patient Info Section */}
              <div className="lg:w-1/2">
                <div className="mb-8">
                  <h2 className="text-3xl font-light mb-3 text-black tracking-wide">
                    Patient Information
                  </h2>
                  <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full"></div>
                </div>

                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-7 border border-emerald-100/60 shadow-lg space-y-7">
                  {/* Patient Profile */}
                  <div className="flex items-start gap-6">
                    <div className="relative">
                      <img
                        src={
                          patient.profileImage
                            ? `data:image/jpeg;base64,${patient.profileImage}`
                            : "/patient.png"
                        }
                        alt="Patient Profile"
                        className="w-28 h-28 rounded-2xl object-cover border-3 border-emerald-200/70 shadow-md"
                        onError={(e) => {
                          e.target.onerror = null; // prevent infinite loop if fallback also fails
                          e.target.src = "/patient.png";
                        }}
                      />

                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full border-3 border-white flex items-center justify-center shadow-sm">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-light text-black mb-2">
                        {patient.patientName}
                      </h3>
                      <div className="flex items-center gap-4 text-black text-sm mb-3">
                        <span className="flex items-center gap-2 bg-emerald-50/80 px-3 py-1 rounded-full">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          {patient.gender === "M" ? "Male" : "Female"}
                        </span>
                        <span className="flex items-center gap-2 bg-emerald-50/80 px-3 py-1 rounded-full">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          {new Date().getFullYear() -
                            new Date(patient.dob).getFullYear()}{" "}
                          years
                        </span>
                      </div>
                      <div className="inline-flex items-center gap-2 bg-emerald-100/80 px-4 py-2 rounded-full shadow-sm">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        <span className="text-sm font-medium text-black tracking-wider">
                          ID: {patient.patientId}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div className="space-y-4 pt-6 border-t border-emerald-100/60">
                    <div className="flex items-center justify-between py-4 px-5 bg-gradient-to-r from-emerald-50/80 to-emerald-100/60 rounded-xl shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-emerald-200/70 rounded-full flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-black"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-emerald-600 tracking-wider uppercase mb-1">
                            Hospital
                          </p>
                          <p className="text-emerald-800 font-medium">
                            {patient.hospitalName}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-4 px-5 bg-gradient-to-r from-emerald-50/80 to-emerald-100/60 rounded-xl shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-emerald-200/70 rounded-full flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-black"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-emerald-600 tracking-wider uppercase mb-1">
                            Appointment Time
                          </p>
                          <p className="text-emerald-800 font-medium">
                            {patient.time}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-4 px-5 bg-gradient-to-r from-emerald-50/80 to-emerald-100/60 rounded-xl shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-emerald-200/70 rounded-full flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-black"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-emerald-600 tracking-wider uppercase mb-1">
                            Status
                          </p>
                          <span
                            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium shadow-sm ${
                              patient.status === "Completed"
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                : "bg-amber-100 text-amber-800 border border-amber-200"
                            }`}
                          >
                            {patient.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prescription Section */}
              <div className="lg:w-1/2">
                <div className="mb-8">
                  <h2 className="text-3xl font-light mb-3 text-black tracking-wide">
                    Upload Prescription
                  </h2>
                  <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full"></div>
                </div>

                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-7 border border-emerald-100/60 shadow-lg">
                  <div className="space-y-8">
                    <div>
                      <label className="block text-sm font-semibold text-black tracking-wider uppercase mb-4">
                         Prescription Document
                      </label>
                      <div
                        className={`border-3 border-dashed rounded-2xl p-10 text-center transition-all duration-300 ${
                          isDragOver
                            ? "border-emerald-400 bg-emerald-100/70"
                            : prescriptionFile
                            ? "border-emerald-300 bg-emerald-50/60"
                            : "border-emerald-200/70 bg-emerald-50/40 hover:bg-emerald-100/60 hover:border-emerald-300"
                        }`}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                      >
                        <div className="w-20 h-20 bg-emerald-100/80 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                          <CloudUpload className="text-emerald-600" size={36} />
                        </div>

                        {!prescriptionFile ? (
                          <>
                            <button
                              type="button"
                              onClick={() => fileInputRef.current.click()}
                              className="px-5 cursor-pointer py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-semibold tracking-wide hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg transform"
                            >
                              Choose File
                            </button>
                            <p className="mt-6 text-black font-medium">
                              or drag and drop your file here
                            </p>
                            <p className="mt-3 text-sm text-black bg-emerald-50/60 inline-block px-4 py-2 rounded-lg">
                              Supported: PDF, JPG, JPEG, PNG • Max size: 10MB
                            </p>
                          </>
                        ) : (
                          <div className="text-center">
                            <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
                            <p className="text-emerald-800 font-semibold text-lg">
                              File Ready!
                            </p>
                            <p className="text-emerald-600 text-sm">
                              Click submit when ready
                            </p>
                          </div>
                        )}

                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleInputFileChange}
                          className="hidden"
                          accept=".jpg,.jpeg,.png,.pdf"
                        />
                      </div>

                      {prescriptionFile && (
                        <div className="mt-6 p-5 bg-gradient-to-r from-emerald-50/90 to-green-50/90 rounded-xl border-2 border-emerald-200/60 shadow-sm">
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex items-center gap-4 flex-1">
                              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-emerald-100">
                                {getFileIcon(prescriptionFile.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-emerald-800 font-semibold truncate text-lg">
                                  {prescriptionFile.name}
                                </p>
                                <p className="text-emerald-600 text-sm mt-1">
                                  {formatFileSize(prescriptionFile.size)} •{" "}
                                  {prescriptionFile.type.includes("pdf")
                                    ? "PDF Document"
                                    : "Image File"}
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={removeFile}
                              className="p-2.5 rounded-full hover:bg-red-100/80 transition-all duration-200 group shadow-sm border border-red-100"
                            >
                              <X
                                size={18}
                                className="text-red-500 group-hover:text-red-600"
                              />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {error && (
                      <div className="p-5 bg-red-50/90 backdrop-blur-sm border-l-4 border-red-400 rounded-xl shadow-sm">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                          </div>
                          <p className="text-red-700 font-medium">{error}</p>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting || !prescriptionFile}
                      className="w-full cursor-pointer mt-10 px-5 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-semibold text-lg tracking-wide hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center transform disabled:transform-none"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="animate-spin mr-4" size={24} />
                          <span>Processing Prescription...</span>
                        </>
                      ) : (
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-6 h-6" />
                          <span>Submit Prescription</span>
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
