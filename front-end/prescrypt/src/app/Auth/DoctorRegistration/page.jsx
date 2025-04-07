"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X, Eye, EyeOff } from "lucide-react";
import styles from "./doctorReg.module.css";

export default function DoctorRegistration() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    Specialization: "",
    SMLCRegId: "",
    SMLCLicenseNumber: "",
    NIC: "",
    ContactNumber: "",
    Email: "",
    Hospital: "",
    Password: "",
    ConfirmPassword: "",
    availability: [],
    role: "Doctor",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [selectedTime, setSelectedTime] = useState("SelectTime");
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordFieldActive, setIsPasswordFieldActive] = useState(false);

  const daysOfWeek = [
    "Monday", 
    "Tuesday", 
    "Wednesday", 
    "Thursday", 
    "Friday", 
    "Saturday", 
    "Sunday"
  ];

  const timeSlots = [
    "9:00 AM - 12:00 PM",
    "1:00 PM - 5:00 PM",
    "6:00 PM - 9:00 PM"
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleCheckboxChange = (day) => {
    const updatedAvailability = formData.availability.includes(day) 
      ? formData.availability.filter(d => d !== day)
      : [...formData.availability, day];
    
    setFormData({ ...formData, availability: updatedAvailability });
  };

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const validateForm = () => {
    let newErrors = {};
    
    // Basic field validations
    if (!formData.FirstName.trim()) newErrors.FirstName = "First Name is required.";
    if (!formData.LastName.trim()) newErrors.LastName = "Last Name is required.";
    if (!formData.Specialization.trim()) newErrors.Specialization = "Specialization is required.";
    if (!formData.SMLCLicenseNumber.trim()) newErrors.SMLCLicenseNumber = "SMLC License Number is required.";
    
    if (!formData["NIC"]?.trim()) {
        newErrors["NIC"] = "NIC Number is required.";
      }
    // Contact number validation
    if (!formData.ContactNumber.trim()) {
      newErrors.ContactNumber = "Contact Number is required.";
    } else if (!/^\d{10}$/.test(formData.ContactNumber.replace(/\D/g, ''))) {
      newErrors.ContactNumber = "Please enter a valid 10-digit phone number.";
    }
    
    // Email validation
    if (!formData.Email.trim()) {
      newErrors.Email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email)) {
      newErrors.Email = "Invalid email format.";
    }
    
    if (!formData.Hospital.trim()) newErrors.Hospital = "Hospital is required.";
    if (formData.availability.length === 0) newErrors.availability = "Please select at least one day.";
    if (!uploadedFile) newErrors.uploadedFile = "Please upload your ID.";
    
    // Password validation
    if (!formData.Password) {
      newErrors.Password = "Password is required.";
    } else if (formData.Password.length < 8) {
      newErrors.Password = "Password must be at least 8 characters long.";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/.test(formData.Password)) {
      newErrors.Password = "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.";
    }
    
    // Confirm password validation
    if (!formData.ConfirmPassword) {
      newErrors.ConfirmPassword = "Please confirm your password.";
    } else if (formData.Password !== formData.ConfirmPassword) {
      newErrors.ConfirmPassword = "Passwords do not match.";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Create form data to handle file upload
      const formDataToSend = new FormData();
      for (const key in formData) {
        if (key === 'availability') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      }
      if (uploadedFile) {
        formDataToSend.append("idDocument", uploadedFile);
      }

      const response = await fetch("https://localhost:7021/api/User/DoctorRegistration", {
        method: "POST",
        body: formDataToSend,
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData);
      }
      
      alert("Registration Successful! Your account will be verified by admin.");
      router.push("/Login");
    } catch (err) {
      setErrors({ general: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.registerBox}>
        <div className={styles.formSection}>
          <div className={styles.logoContainer}>
            <Image 
              src="/logo.png" 
              alt="HiresCrypt Logo" 
              width={150}
              height={50}
              className={styles.logo}
            />
          </div>

          <h2 className={styles.title}>JOIN US FOR A HEALTHIER TOMORROW!</h2>
          <p className={styles.subtitle}>Create your account</p>

          {/* Role Dropdown */}
          <div className={styles.dropdownContainer}>
            <button 
              className={styles.dropdownButton} 
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            >
              {formData.role || "Choose your Role"}
              <span className={styles.dropdownArrow}>›</span>
            </button>
            {showRoleDropdown && (
              <div className={styles.dropdownMenu}>
                {["Patient", "Doctor", "Admin"].map((role) => (
                  <div
                    key={role}
                    className={styles.dropdownItem}
                    onClick={() => {
                      setFormData({ ...formData, role });
                      setShowRoleDropdown(false);
                      if (role === "Patient") {
                        router.push("/Auth/PatientRegistration");
                      } else if (role === "Admin") {
                        router.push("/Auth/AdminRegistration");
                      }
                    }}
                  >
                    {role}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Input Fields - Two Column Layout */}
          <div className={styles.formColumns}>
            {/* Left Column */}
            <div className={styles.formColumn}>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  name="FirstName"
                  placeholder="FirstName"
                  className={errors.FirstName ? styles.inputError : styles.input}
                  value={formData.FirstName}
                  onChange={handleChange}
                />
                {errors.FirstName && <p className={styles.errorMessage}>{errors.FirstName}</p>}
              </div>
              
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  name="LastName"
                  placeholder="LastName"
                  className={errors.LastName ? styles.inputError : styles.input}
                  value={formData.LastName}
                  onChange={handleChange}
                />
                {errors.LastName && <p className={styles.errorMessage}>{errors.LastName}</p>}
              </div>
              
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  name="Specialization"
                  placeholder="Specialization"
                  className={errors.Specialization ? styles.inputError : styles.input}
                  value={formData.Specialization}
                  onChange={handleChange}
                />
                {errors.Specialization && <p className={styles.errorMessage}>{errors.Specialization}</p>}
              </div>
              <div className={styles.inputGroup}>
                <input
                  type="text" 
                  name="SMLCRegId"
                  placeholder="SMLC Registration ID"
                  className={errors.SMLCRegId ? styles.inputError : styles.input}
                  value={formData.SMLCRegId}
                  onChange={handleChange}
                />  
                {errors.SMLCRegId && <p className={styles.errorMessage}>{errors.SMLCRegId}</p>} 
              </div>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  name="SMLCLicenseNumber"
                  placeholder="SMLC License Number"
                  className={errors.SMLCLicenseNumber ? styles.inputError : styles.input}
                  value={formData.SMLCLicenseNumber}
                  onChange={handleChange}
                />
                {errors.SMLCLicenseNumber && <p className={styles.errorMessage}>{errors.SMLCLicenseNumber}</p>}
              </div>

              <div className={styles.inputGroup}>
                <input
                  type="text"
                  name="NIC"
                  placeholder="NIC number"  
                  
                  className={errors.NIC ? styles.inputError : styles.input}
                  value={formData.NIC}         
                  onChange={handleChange}
                />
                {errors.NIC && <p className={styles.errorMessage}>{errors.NIC}</p>}
              </div>
              
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  name="ContactNumber"
                  placeholder="Contact Number"
                  className={errors.ContactNumber ? styles.inputError : styles.input}
                  value={formData.ContactNumber}
                  onChange={handleChange}
                />
                {errors.ContactNumber && <p className={styles.errorMessage}>{errors.ContactNumber}</p>}
              </div>
              
              <div className={styles.inputGroup}>
                <input
                  type="email"
                  name="Email"
                  placeholder="Email"
                  className={errors.Email ? styles.inputError : styles.input}
                  value={formData.Email}
                  onChange={handleChange}
                />
                {errors.Email && <p className={styles.errorMessage}>{errors.Email}</p>}
              </div>
              
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  name="Hospital"
                  placeholder="Hospital"
                  className={errors.Hospital ? styles.inputError : styles.input}
                  value={formData.Hospital}
                  onChange={handleChange}
                />
                {errors.Hospital && <p className={styles.errorMessage}>{errors.Hospital}</p>}
              </div>
              
              {/* Password field with toggle visibility */}
              <div className={styles.inputGroup}>
                <div className={styles.passwordInputContainer}>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="Password"
                    placeholder="Password"
                    className={errors.Password ? styles.inputError : styles.input}
                    value={formData.Password}
                    onChange={handleChange}
                    onFocus={() => setIsPasswordFieldActive(true)}
                    onBlur={(e) => {
                      // Only set to false if neither password field has focus
                      if (document.activeElement !== e.target.form?.ConfirmPassword) {
                        setTimeout(() => setIsPasswordFieldActive(false), 100);
                      }
                    }}
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.Password && <p className={styles.errorMessage}>{errors.Password}</p>}
              </div>
              
              {/* Confirm Password field with toggle visibility */}
              <div className={styles.inputGroup}>
                <div className={styles.passwordInputContainer}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="ConfirmPassword"
                    placeholder="Confirm Password"
                    className={errors.ConfirmPassword ? styles.inputError : styles.input}
                    value={formData.ConfirmPassword}
                    onChange={handleChange}
                    onFocus={() => setIsPasswordFieldActive(true)}
                    onBlur={(e) => {
                      // Only set to false if neither password field has focus
                      if (document.activeElement !== e.target.form?.Password) {
                        setTimeout(() => setIsPasswordFieldActive(false), 100);
                      }
                    }}
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.ConfirmPassword && <p className={styles.errorMessage}>{errors.ConfirmPassword}</p>}
              </div>
            </div>
            
            {/* Right Column */}
            <div className={styles.formColumn}>
              <div className={styles.idUploadSection}>
                <div className={styles.uploadRow}>
                  <span className={styles.uploadLabel}>Copy of ID:</span>
                  <button 
                    type="button" 
                    className={styles.uploadButton}
                    onClick={() => setShowUploadModal(true)}
                  >
                    Upload
                  </button>
                </div>
                
                {uploadedFile && (
                  <div className={styles.fileInfo}>
                    <span>File: {uploadedFile.name}</span>
                  </div>
                )}
                {errors.uploadedFile && <p className={styles.errorMessage}>{errors.uploadedFile}</p>}
              </div>
              
              <div className={styles.availabilitySection}>
                <h3 className={styles.sectionTitle}>Availability:</h3>
                <div className={styles.checkboxGrid}>
                  {daysOfWeek.map((day) => (
                    <div key={day} className={styles.checkboxItem}>
                      <label className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={formData.availability.includes(day)}
                          onChange={() => handleCheckboxChange(day)}
                          className={styles.checkbox}
                        />
                        <span className={styles.checkboxText}>{day}</span>
                      </label>
                    </div>
                  ))}
                </div>
                {errors.availability && <p className={styles.errorMessage}>{errors.availability}</p>}
              </div>
              
              <div className={styles.timeSlotSection}>
                <div className={styles.dropdownContainer}>
                  <button 
                    className={styles.dropdownButton} 
                    onClick={() => setShowTimeDropdown(!showTimeDropdown)}
                  >
                    {selectedTime}
                    <span className={styles.dropdownArrow}>›</span>
                  </button>
                  {showTimeDropdown && (
                    <div className={styles.dropdownMenu}>
                      {timeSlots.map((time) => (
                        <div
                          key={time}
                          className={styles.dropdownItem}
                          onClick={() => {
                            setSelectedTime(time);
                            setShowTimeDropdown(false);
                          }}
                        >
                          {time}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Password Requirements - Only show when password fields are active */}
              {isPasswordFieldActive && (
                <div className={styles.passwordRequirements}>
                  <h4 className={styles.requirementsTitle}>Password Requirements:</h4>
                  <ul className={styles.requirementsList}>
                    <li className={formData.Password.length >= 8 ? styles.metRequirement : styles.requirement}>
                      At least 8 characters
                    </li>
                    <li className={/[A-Z]/.test(formData.Password) ? styles.metRequirement : styles.requirement}>
                      At least 1 uppercase letter
                    </li>
                    <li className={/[a-z]/.test(formData.Password) ? styles.metRequirement : styles.requirement}>
                      At least 1 lowercase letter
                    </li>
                    <li className={/\d/.test(formData.Password) ? styles.metRequirement : styles.requirement}>
                      At least 1 number
                    </li>
                    <li className={/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(formData.Password) ? styles.metRequirement : styles.requirement}>
                      At least 1 special character
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          {errors.general && <p className={styles.errorMessage}>{errors.general}</p>}
          
          <button 
            className={styles.registerBtn} 
            onClick={handleRegister} 
            disabled={loading}
          >
            {loading ? "Processing..." : "Request Verification"}
          </button>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Upload ID Copy</h3>
              <button 
                className={styles.closeButton} 
                onClick={() => setShowUploadModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.uploadIcon}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 16V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 12L12 8L16 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className={styles.uploadText}>
                Upload ID Copy
                <span className={styles.uploadFormat}>(PNG/ PDF format is accepted)</span>
              </p>
              <input
                type="file"
                id="fileUpload"
                className={styles.fileInput}
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileUpload}
              />
              <label htmlFor="fileUpload" className={styles.browseButton}>
                Browse Files
              </label>
            </div>
          </div>
        </div>
      )}
    </div>

  );}
  
