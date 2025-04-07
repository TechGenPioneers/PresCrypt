"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X, Eye, EyeOff, ChevronDown, Search, Plus, Trash2 } from "lucide-react";
import styles from "./doctorReg.module.css";

export default function DoctorRegistration() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    Gender: "",
    Specialization: "",
    SMLCLicenseNumber: "",
    NIC: "",
    ContactNumber: "",
    Email: "",
    Password: "",
    ConfirmPassword: "",
    role: "Doctor",
    hospitalSchedules: [],
  });

  const [currentSchedule, setCurrentSchedule] = useState({
    hospital: "",
    charge: "",
    availability: {},
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordFieldActive, setIsPasswordFieldActive] = useState(false);
  const [showHospitalDropdown, setShowHospitalDropdown] = useState(false);
  const [hospitalSearchTerm, setHospitalSearchTerm] = useState("");
  const [showSpecializationDropdown, setShowSpecializationDropdown] = useState(false);
  const [specializationSearchTerm, setSpecializationSearchTerm] = useState("");
  const [otherSpecialization, setOtherSpecialization] = useState("");

  const daysOfWeek = [
    "Monday", 
    "Tuesday", 
    "Wednesday", 
    "Thursday", 
    "Friday", 
    "Saturday", 
    "Sunday"
  ];

  const timeOptions = [
    "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", 
    "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", 
    "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", 
    "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", 
    "8:00 PM", "8:30 PM", "9:00 PM"
  ];

  const genderOptions = ["Male", "Female"];

  const hospitals = [
    { id: 1, name: "None" },
    { id: 2, name: "National Hospital of Sri Lanka - Colombo" },
    { id: 3, name: "Lady Ridgeway Hospital - Colombo" },
    { id: 4, name: "Teaching Hospital Karapitiya - Galle" },
    { id: 5, name: "Kandy General Hospital - Kandy" },
    { id: 6, name: "Jaffna Teaching Hospital - Jaffna" },
    { id: 7, name: "Colombo South Teaching Hospital - Kalubowila" },
    { id: 8, name: "Teaching Hospital Anuradhapura" },
    { id: 9, name: "Teaching Hospital Kurunegala" },
    { id: 10, name: "Colombo North Teaching Hospital - Ragama" },
    { id: 11, name: "Base Hospital Awissawella" },
    { id: 12, name: "District General Hospital Negombo" },
    { id: 13, name: "Base Hospital Homagama" },
    { id: 14, name: "District General Hospital Gampaha" },
    { id: 15, name: "Base Hospital Panadura" },
    { id: 16, name: "District Hospital Moratuwa" }
  ];

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
    "Other"
  ];

  const filteredHospitals = hospitalSearchTerm 
    ? hospitals.filter(h => h.name.toLowerCase().includes(hospitalSearchTerm.toLowerCase()))
    : hospitals;

  const filteredSpecializations = specializationSearchTerm
    ? specializations.filter(s => s.toLowerCase().includes(specializationSearchTerm.toLowerCase()))
    : specializations;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const addHospitalSchedule = () => {
    if (!currentSchedule.hospital || !currentSchedule.charge) {
      setErrors({...errors, hospitalSchedule: "Please select a hospital and enter charge"});
      return;
    }

    const hasAvailability = Object.values(currentSchedule.availability).some(
      day => day && day.startTime && day.endTime
    );

    if (!hasAvailability) {
      setErrors({...errors, hospitalSchedule: "Please add at least one available day with time slots"});
      return;
    }

    setFormData({
      ...formData,
      hospitalSchedules: [...formData.hospitalSchedules, currentSchedule],
    });

    setCurrentSchedule({
      hospital: "",
      charge: "",
      availability: {},
    });

    setErrors({...errors, hospitalSchedule: ""});
  };

  const removeHospitalSchedule = (index) => {
    const updatedSchedules = [...formData.hospitalSchedules];
    updatedSchedules.splice(index, 1);
    setFormData({...formData, hospitalSchedules: updatedSchedules});
  };

  const handleDayAvailability = (day, isSelected) => {
    setCurrentSchedule(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: isSelected 
          ? { startTime: "", endTime: "" }
          : undefined
      }
    }));
  };

  const updateDayTimeSlot = (day, field, value) => {
    setCurrentSchedule(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability[day],
          [field]: value
        }
      }
    }));
  };

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const validateForm = () => {
    let newErrors = {};
    
    if (currentStep === 1) {
      if (!formData.FirstName.trim()) newErrors.FirstName = "First Name is required.";
      if (!formData.LastName.trim()) newErrors.LastName = "Last Name is required.";
      if (!formData.Gender) newErrors.Gender = "Gender is required.";
      if (!formData.Specialization) newErrors.Specialization = "Specialization is required.";
      if (formData.Specialization === "Other" && !otherSpecialization.trim()) {
        newErrors.otherSpecialization = "Please specify your specialization.";
      }
      if (!formData.SMLCLicenseNumber.trim()) newErrors.SMLCLicenseNumber = "SMLC License Number is required.";
      
      if (!formData["NIC"]?.trim()) {
        newErrors["NIC"] = "NIC Number is required.";
      }
      
      if (!formData.ContactNumber.trim()) {
        newErrors.ContactNumber = "Contact Number is required.";
      } else if (!/^\d{10}$/.test(formData.ContactNumber.replace(/\D/g, ''))) {
        newErrors.ContactNumber = "Please enter a valid 10-digit phone number.";
      }
      
      if (!formData.Email.trim()) {
        newErrors.Email = "Email is required.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email)) {
        newErrors.Email = "Invalid email format.";
      }
      
      if (!uploadedFile) newErrors.uploadedFile = "Please upload your ID.";
    } else {
      if (formData.hospitalSchedules.length === 0) {
        newErrors.hospitalSchedules = "Please add at least one hospital schedule";
      }
      
      if (!formData.Password) {
        newErrors.Password = "Password is required.";
      } else if (formData.Password.length < 8) {
        newErrors.Password = "Password must be at least 8 characters long.";
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/.test(formData.Password)) {
        newErrors.Password = "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.";
      }
      
      if (!formData.ConfirmPassword) {
        newErrors.ConfirmPassword = "Please confirm your password.";
      } else if (formData.Password !== formData.ConfirmPassword) {
        newErrors.ConfirmPassword = "Passwords do not match.";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateForm()) {
      setCurrentStep(2);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
    window.scrollTo(0, 0);
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        if (key === 'hospitalSchedules') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      }
      
      if (formData.Specialization === "Other") {
        formDataToSend.set("Specialization", otherSpecialization);
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
          <div className={styles.stepIndicator}>
            <div className={`${styles.step} ${currentStep === 1 ? styles.activeStep : ''}`}>1</div>
            <div className={styles.stepLine}></div>
            <div className={`${styles.step} ${currentStep === 2 ? styles.activeStep : ''}`}>2</div>
          </div>

          {/* Role Dropdown */}
          <div className={styles.dropdownContainer}>
            <button 
              className={styles.dropdownButton} 
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            >
              {formData.role || "Choose your Role"}
              <ChevronDown size={18} className={styles.dropdownIcon} />
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

          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className={styles.formColumns}>
              {/* Left Column */}
              <div className={styles.formColumn}>
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    name="FirstName"
                    placeholder="First Name"
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
                    placeholder="Last Name"
                    className={errors.LastName ? styles.inputError : styles.input}
                    value={formData.LastName}
                    onChange={handleChange}
                  />
                  {errors.LastName && <p className={styles.errorMessage}>{errors.LastName}</p>}
                </div>
                
                {/* Gender Dropdown */}
                <div className={styles.inputGroup}>
                  <div className={styles.dropdownContainer}>
                    <button 
                      className={errors.Gender ? `${styles.dropdownButton} ${styles.inputError}` : styles.dropdownButton} 
                      onClick={() => setShowGenderDropdown(!showGenderDropdown)}
                      type="button"
                    >
                      {formData.Gender || "Select Gender"}
                      <ChevronDown size={18} className={styles.dropdownIcon} />
                    </button>
                    {showGenderDropdown && (
                      <div className={styles.dropdownMenu}>
                        {genderOptions.map((gender) => (
                          <div
                            key={gender}
                            className={styles.dropdownItem}
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
                  </div>
                  {errors.Gender && <p className={styles.errorMessage}>{errors.Gender}</p>}
                </div>
                
                {/* Specialization Dropdown */}
                <div className={styles.inputGroup}>
                  <div className={styles.dropdownContainer}>
                    <button 
                      className={errors.Specialization ? `${styles.dropdownButton} ${styles.inputError}` : styles.dropdownButton} 
                      onClick={() => setShowSpecializationDropdown(!showSpecializationDropdown)}
                      type="button"
                    >
                      {formData.Specialization || "Select Specialization"}
                      <ChevronDown size={18} className={styles.dropdownIcon} />
                    </button>
                    {showSpecializationDropdown && (
                      <div className={styles.dropdownMenu}>
                        <div className={styles.searchContainer}>
                          <input
                            type="text"
                            placeholder="Search specializations..."
                            value={specializationSearchTerm}
                            onChange={(e) => setSpecializationSearchTerm(e.target.value)}
                            className={styles.searchInput}
                          />
                          <Search size={16} className={styles.searchIcon} />
                        </div>
                        <div className={styles.dropdownList}>
                          {filteredSpecializations.map((specialization) => (
                            <div
                              key={specialization}
                              className={styles.dropdownItem}
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
                  </div>
                  {errors.Specialization && <p className={styles.errorMessage}>{errors.Specialization}</p>}
                </div>
                
                {/* Other Specialization field */}
                {formData.Specialization === "Other" && (
                  <div className={styles.inputGroup}>
                    <input
                      type="text"
                      placeholder="Specify your specialization"
                      value={otherSpecialization}
                      onChange={(e) => setOtherSpecialization(e.target.value)}
                      className={errors.otherSpecialization ? styles.inputError : styles.input}
                    />
                    {errors.otherSpecialization && <p className={styles.errorMessage}>{errors.otherSpecialization}</p>}
                  </div>
                )}
              </div>
              
              {/* Right Column */}
              <div className={styles.formColumn}>
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

                {/* ID Upload Section */}
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
              </div>
            </div>
          )}

          {/* Step 2: Hospital Schedules & Authentication */}
          {currentStep === 2 && (
            <div className={styles.formColumns}>
              {/* Left Column - Hospital Schedules */}
              <div className={styles.formColumn}>
                <div className={styles.hospitalScheduleSection}>
                  <h3 className={styles.sectionTitle}>Hospital Schedules</h3>
                  
                  {/* Current Hospital Schedule Form */}
                  <div className={styles.scheduleForm}>
                    <div className={styles.inputGroup}>
                      <div className={styles.dropdownContainer}>
                        <button 
                          className={!currentSchedule.hospital ? `${styles.dropdownButton} ${styles.inputError}` : styles.dropdownButton} 
                          onClick={() => setShowHospitalDropdown(!showHospitalDropdown)}
                          type="button"
                        >
                          {currentSchedule.hospital || "Select Hospital"}
                          <ChevronDown size={18} className={styles.dropdownIcon} />
                        </button>
                        {showHospitalDropdown && (
                          <div className={styles.dropdownMenu}>
                            <div className={styles.searchContainer}>
                              <input
                                type="text"
                                placeholder="Search hospitals..."
                                value={hospitalSearchTerm}
                                onChange={(e) => setHospitalSearchTerm(e.target.value)}
                                className={styles.searchInput}
                              />
                              <Search size={16} className={styles.searchIcon} />
                            </div>
                            <div className={styles.dropdownList}>
                              {filteredHospitals.map((hospital) => (
                                <div
                                  key={hospital.id}
                                  className={styles.dropdownItem}
                                  onClick={() => {
                                    setCurrentSchedule({...currentSchedule, hospital: hospital.name});
                                    setShowHospitalDropdown(false);
                                  }}
                                >
                                  {hospital.name}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className={styles.inputGroup}>
                      <div className={styles.chargeInputContainer}>
                        <span className={styles.currencySymbol}>Rs.</span>
                        <input
                          type="number"
                          placeholder="Consultation Charge"
                          className={!currentSchedule.charge ? styles.inputError : styles.input}
                          value={currentSchedule.charge}
                          onChange={(e) => setCurrentSchedule({...currentSchedule, charge: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className={styles.availabilitySection}>
                      <h4 className={styles.subSectionTitle}>Availability</h4>
                      <div className={styles.checkboxGrid}>
                        {daysOfWeek.map((day) => (
                          <div key={day} className={styles.checkboxItem}>
                            <label className={styles.checkboxLabel}>
                              <input
                                type="checkbox"
                                checked={!!currentSchedule.availability[day]}
                                onChange={(e) => handleDayAvailability(day, e.target.checked)}
                                className={styles.checkbox}
                              />
                              <span className={styles.checkboxText}>{day}</span>
                            </label>
                            
                            {currentSchedule.availability[day] && (
                              <div className={styles.timeSlotContainer}>
                                <select
                                  value={currentSchedule.availability[day].startTime}
                                  onChange={(e) => updateDayTimeSlot(day, 'startTime', e.target.value)}
                                  className={styles.timeSelect}
                                >
                                  <option value="">Start Time</option>
                                  {timeOptions.map(time => (
                                    <option key={`${day}-start-${time}`} value={time}>{time}</option>
                                  ))}
                                </select>
                                
                                <span className={styles.timeSeparator}>to</span>
                                
                                <select
                                  value={currentSchedule.availability[day].endTime}
                                  onChange={(e) => updateDayTimeSlot(day, 'endTime', e.target.value)}
                                  className={styles.timeSelect}
                                >
                                  <option value="">End Time</option>
                                  {timeOptions.map(time => (
                                    <option key={`${day}-end-${time}`} value={time}>{time}</option>
                                  ))}
                                </select>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      className={styles.addScheduleButton}
                      onClick={addHospitalSchedule}
                    >
                      <Plus size={16} /> Add Hospital Schedule
                    </button>
                    
                    {errors.hospitalSchedule && (
                      <p className={styles.errorMessage}>{errors.hospitalSchedule}</p>
                    )}
                  </div>
                  
                  {/* Display Added Schedules */}
                  <div className={styles.addedSchedules}>
                    {formData.hospitalSchedules.map((schedule, index) => (
                      <div key={index} className={styles.scheduleCard}>
                        <div className={styles.scheduleHeader}>
                          <h4>{schedule.hospital}</h4>
                          <button
                            type="button"
                            className={styles.deleteSchedule}
                            onClick={() => removeHospitalSchedule(index)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p>Charge: Rs. {schedule.charge}</p>
                        <div className={styles.scheduleAvailability}>
                          {Object.entries(schedule.availability)
                            .filter(([_, times]) => times && times.startTime && times.endTime)
                            .map(([day, times]) => (
                              <div key={day} className={styles.scheduleDay}>
                                <strong>{day}:</strong> {times.startTime} - {times.endTime}
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Right Column - Authentication */}
              <div className={styles.formColumn}>
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
                
                {/* Password Requirements */}
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
          )}
          
          {errors.general && <p className={styles.errorMessage}>{errors.general}</p>}
          
          <div className={styles.buttonGroup}>
            {currentStep === 2 && (
              <button 
                className={styles.backBtn} 
                onClick={handlePrevStep}
                type="button"
              >
                Back
              </button>
            )}
            
            {currentStep === 1 ? (
              <button 
                className={styles.nextBtn} 
                onClick={handleNextStep}
                type="button"
              >
                Next
              </button>
            ) : (
              <button 
                className={styles.registerBtn} 
                onClick={handleRegister} 
                disabled={loading}
                type="button"
              >
                {loading ? "Processing..." : "Request Verification"}
              </button>
            )}
          </div>
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
                type="button"
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
  );
}