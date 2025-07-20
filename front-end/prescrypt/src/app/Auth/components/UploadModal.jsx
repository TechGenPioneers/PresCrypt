"use client";
import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  X,
  Upload,
  Camera,
  CheckCircle,
  Info,
  FileText,
  Image,
} from "lucide-react";

// Mock MUI Button component since MUI isn't available
const Button = ({
  children,
  variant = "text",
  color = "primary",
  component,
  onClick,
  disabled,
  className,
  ...props
}) => {
  const baseClasses =
    "px-4 py-2 rounded font-medium transition-colors focus:outline-none focus:ring-2";
  const variants = {
    contained:
      color === "primary"
        ? "bg-teal-600 hover:bg-teal-700 text-white focus:ring-teal-500"
        : "bg-gray-600 hover:bg-gray-700 text-white",
    outlined: "border border-teal-600 text-teal-600 hover:bg-teal-50",
    text: "text-teal-600 hover:bg-teal-50",
  };

  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${disabledClasses} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default function UploadModal({
  showUploadModal,
  setShowUploadModal,
  handleFileUpload,
}) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  const onFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    console.log("File input changed:", files);
    handleFileUpload(e);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      setSelectedFiles(files);
      const syntheticEvent = {
        target: { files: e.dataTransfer.files },
      };
      handleFileUpload(syntheticEvent);
    }
  };

  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (file) => {
    if (file.type.startsWith("image/")) {
      return <Image className="text-green-600" size={20} />;
    } else if (file.type === "application/pdf") {
      return <FileText className="text-red-600" size={20} />;
    }
    return <Upload className="text-gray-600" size={20} />;
  };

  return (
    showUploadModal && (
      <div className="fixed inset-0  bg-white/70 flex justify-center items-center z-50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <div>
              <h3 className="text-2xl font-bold text-teal-900">
                Upload SMLC ID
              </h3>
              <p className="text-sm text-gray-600 mt-1 ">
                Medical License Verification Documents
              </p>
            </div>
            <button
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
              onClick={() => {
                console.log("Closing upload modal");
                setShowUploadModal(false);
                setSelectedFiles([]);
              }}
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex flex-col lg:flex-row">
            {/* Left Side - Upload Section */}
            <div className="flex-1 p-6">
              {/* Instructions */}
              <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Info
                    className="text-teal-600 mt-0.5 flex-shrink-0"
                    size={20}
                  />
                  <div>
                    <h4 className="font-semibold text-teal-900 mb-2">
                      Required Document
                    </h4>
                    <ul className="text-sm text-teal-800 space-y-1">
                      <li>
                        • Please upload a{" "}
                        <strong>selfie holding your SMLC ID</strong>
                      </li>
                      <li>• Both your face and ID must be clearly visible</li>
                      <li>• Ensure all text on the ID is readable</li>
                      <li>• Use good lighting and avoid shadows</li>
                      <li>• Maximum file size: 10MB</li>
                      <li>• Accepted format: only in <strong> .jpg</strong> format</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Upload Area */}
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer mb-6 ${
                  dragActive
                    ? "border-teal-500 bg-blue-50"
                    : selectedFiles.length > 0
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="fileUpload"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept="image/png,image/jpeg,image/jpg"
                  multiple
                  onChange={onFileChange}
                />

                {selectedFiles.length === 0 ? (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <Upload className="text-gray-400" size={48} />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-700 mb-2">
                        Drop files here or click to browse
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        PNG, JPG, or JPEG format accepted
                      </p>
                    </div>
                    <Button
                      variant="contained"
                      color="primary"
                      component="span"
                    >
                      Browse Files
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <CheckCircle className="text-green-500" size={48} />
                    </div>
                    <p className="text-lg font-medium text-green-700">
                      {selectedFiles.length} file
                      {selectedFiles.length > 1 ? "s" : ""} selected
                    </p>
                    <p className="text-sm text-gray-600">
                      Click to add more files or review below
                    </p>
                  </div>
                )}
              </div>

              {/* Selected Files Display */}
              {selectedFiles.length > 0 && (
                <div className="space-y-3 mb-6">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <CheckCircle className="text-green-500" size={18} />
                    Selected Files ({selectedFiles.length})
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center border">
                            {getFileIcon(file)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className="font-medium text-gray-900 truncate text-sm"
                              title={file.name}
                            >
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(file.size)} •{" "}
                              {file.type.split("/")[1]?.toUpperCase() || "FILE"}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors ml-2"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outlined"
                  onClick={() => {
                    setShowUploadModal(false);
                    setSelectedFiles([]);
                  }}
                  className="flex-1"
                >
                  OK
                </Button>
              
              </div>
            </div>

            {/* Right Side - Photo Guide */}
            <div className="lg:w-80 bg-gray-50 border-l border-gray-200 p-6">
              <div className="space-y-6">
                

                {/* SMLC ID Guide */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h5 className="font-medium text-gray-900 mb-3">
                    Selfie with SMLC ID
                  </h5>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                      Hold your SMLC ID clearly next to your face
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                      Ensure both your face and ID are in focus
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                      All text on ID must be readable
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                      Use natural lighting, avoid shadows
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                      Keep camera steady and at eye level
                    </li>
                  </ul>
                </div>

          
                {/* Example Photo Section */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h5 className="font-medium text-teal-900 mb-3">
                    Example Photo
                  </h5>

                  <div>
                    <img
                      src="/example.png"
                      alt="Example: Selfie holding SMLC ID"
                      className="h-70 w-auto rounded shadow object-cover"
                      //style={{ maxHeight: "10rem" }}
                    />

                    <div className="text-center text-gray-500 mt-2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
}

UploadModal.propTypes = {
  showUploadModal: PropTypes.bool.isRequired,
  setShowUploadModal: PropTypes.func.isRequired,
  handleFileUpload: PropTypes.func.isRequired,
};
