"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X, Eye, EyeOff, ChevronDown, Search, Plus, Trash2, CheckCircle } from "lucide-react";
import styles from "./doctorReg.module.css";

export default function DoctorRegistration() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    Gender: "",
    Specialization: "",
    SLMCRegId: "",
    NIC: "",
    ContactNumber: "",
    Email: "",
    Password: "",
    ConfirmPassword: "",
    Charge: "",
    hospitalSchedules: [],
  });

  const [currentSchedule, setCurrentSchedule] = useState({
    hospital: "",
    hospitalId: "",
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
  const [registrationSuccess, setRegistrationSuccess] = useState(null);

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i % 12 || 12;
    const ampm = i < 12 ? "AM" : "PM";
    return [`${hour}:00 ${ampm}`, `${hour}:30 ${ampm}`];
  }).flat();

  const genderOptions = ["Male", "Female"];
  const [hospitals, setHospitals] = useState([]);

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

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await fetch("https://localhost:7021/api/User/GetAllHospitals");
        if (!response.ok) throw new Error("Failed to fetch hospitals");
        const data = await response.json();
        setHospitals(data);
      } catch (error) {
        console.error("Error fetching hospitals:", error);
      }
    };
    fetchHospitals();
  }, []);

  const filteredHospitals = hospitals.filter(h =>
    h.hospitalName.toLowerCase().includes(hospitalSearchTerm.toLowerCase()) ||
    h.city.toLowerCase().includes(hospitalSearchTerm.toLowerCase())
  );

  const filteredSpecializations = specializations.filter(s =>
    s.toLowerCase().includes(specializationSearchTerm.toLowerCase())
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const addHospitalSchedule = () => {
    const newErrors = {};
    if (!currentSchedule.hospitalId) newErrors.hospitalSchedule = "Hospital is required";

    const hasValidAvailability = Object.values(currentSchedule.availability).some(
      times => times?.startTime && times?.endTime
    );

    if (!hasValidAvailability) {
      newErrors.hospitalSchedule = "At least one availability slot required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newSchedule = {
      hospitalId: currentSchedule.hospitalId,
      hospitalName: currentSchedule.hospital,
      availability: Object.fromEntries(
        Object.entries(currentSchedule.availability)
          .filter(([_, times]) => times?.startTime && times?.endTime)
          .map(([day, times]) => [day, {
            startTime: times.startTime,
            endTime: times.endTime
          }])
      )
    };

    setFormData(prev => ({
      ...prev,
      hospitalSchedules: [...prev.hospitalSchedules, newSchedule]
    }));

    setCurrentSchedule({
      hospital: "",
      hospitalId: "",
      availability: {},
    });
    setErrors(prev => ({ ...prev, hospitalSchedule: "" }));
  };

  const removeHospitalSchedule = (index) => {
    setFormData(prev => ({
      ...prev,
      hospitalSchedules: prev.hospitalSchedules.filter((_, i) => i !== index)
    }));
  };

  const handleDayAvailability = (day, isSelected) => {
    setCurrentSchedule(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: isSelected ? { startTime: "", endTime: "" } : undefined
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
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, uploadedFile: "File size must be less than 5MB" }));
      } else if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
        setErrors(prev => ({ ...prev, uploadedFile: "Only JPEG, PNG, or PDF files allowed" }));
      } else {
        setUploadedFile(file);
        setErrors(prev => ({ ...prev, uploadedFile: "" }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Step 1 validation
    if (currentStep === 1) {
      if (!formData.FirstName.trim()) newErrors.FirstName = "First name required";
      if (!formData.LastName.trim()) newErrors.LastName = "Last name required";
      if (!formData.Gender) newErrors.Gender = "Gender required";
      if (!formData.Specialization) newErrors.Specialization = "Specialization required";
      if (formData.Specialization === "Other" && !otherSpecialization.trim()) {
        newErrors.otherSpecialization = "Please specify specialization";
      }
      if (!formData.SLMCRegId.trim()) newErrors.SLMCRegId = "SLMC registration required";
      if (!formData.NIC.trim()) newErrors.NIC = "NIC number required";
      if (!/^\d{10}$/.test(formData.ContactNumber)) newErrors.ContactNumber = "Invalid phone number (10 digits)";
      if (!formData.Email.trim()) newErrors.Email = "Email required";
      if (!/^\S+@\S+\.\S+$/.test(formData.Email)) newErrors.Email = "Invalid email format";
      if (!formData.Charge) newErrors.Charge = "Consultation charge required";
      else if (isNaN(parseFloat(formData.Charge))) newErrors.Charge = "Invalid charge amount";
      if (!uploadedFile) newErrors.uploadedFile = "ID copy required";
      if (!formData.Charge) {
        newErrors.Charge = "Consultation charge required";
      } else {
        const chargeValue = parseFloat(formData.Charge);
        if (isNaN(chargeValue)) {
          newErrors.Charge = "Invalid charge amount";
        } else if (chargeValue <= 0) {
          newErrors.Charge = "Charge must be greater than 0";
        }
      }
    }
    // Step 2 validation
    else {
      if (formData.hospitalSchedules.length === 0) {
        newErrors.hospitalSchedules = "At least one hospital schedule required";
      }
      if (!formData.Password) newErrors.Password = "Password required";
      else if (formData.Password.length < 8) newErrors.Password = "Minimum 8 characters";
      else if (!/[A-Z]/.test(formData.Password)) newErrors.Password = "Need uppercase letter";
      else if (!/[a-z]/.test(formData.Password)) newErrors.Password = "Need lowercase letter";
      else if (!/[0-9]/.test(formData.Password)) newErrors.Password = "Need number";
      else if (!/[^A-Za-z0-9]/.test(formData.Password)) newErrors.Password = "Need special character";

      if (!formData.ConfirmPassword) newErrors.ConfirmPassword = "Confirm password";
      else if (formData.Password !== formData.ConfirmPassword) {
        newErrors.ConfirmPassword = "Passwords don't match";
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

      // Add all basic fields
      formDataToSend.append("FirstName", formData.FirstName);
      formDataToSend.append("LastName", formData.LastName);
      formDataToSend.append("Gender", formData.Gender);
      formDataToSend.append("Specialization", 
        formData.Specialization === "Other" ? otherSpecialization : formData.Specialization);
      formDataToSend.append("SLMCRegId", formData.SLMCRegId);
      formDataToSend.append("NIC", formData.NIC);
      formDataToSend.append("ContactNumber", formData.ContactNumber);
      formDataToSend.append("Email", formData.Email);
      formDataToSend.append("Password", formData.Password);
      formDataToSend.append("ConfirmPassword", formData.ConfirmPassword);
      formDataToSend.append("Charge", formData.Charge);

      // Add hospital schedules as JSON string
      formDataToSend.append("hospitalSchedules", JSON.stringify(formData.hospitalSchedules));

      // Add file if exists
      if (uploadedFile) {
        formDataToSend.append("SLMCIdImage", uploadedFile);
      }

      const response = await fetch("https://localhost:7021/api/User/DoctorRegistration", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      const result = await response.json();
      setRegistrationSuccess({
        message: "Your request has been sent successfully!",
        details: "We will confirm your identity and inform you via email once your account is approved.",
        requestId: result.requestId
      });
    } catch (err) {
      console.error("Registration error:", err);
      setErrors({
        general: err.message || "Registration failed. Please check your data and try again."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setRegistrationSuccess(null);
    router.push("/Auth/login");
  };

  return (
    <div className={styles.container}>
      {registrationSuccess ? (
        <div className={styles.successContainer}>
          <div className={styles.successContent}>
            <CheckCircle size={64} className={styles.successIcon} />
            <h2 className={styles.successTitle}>Registration Submitted</h2>
            <p className={styles.successMessage}>{registrationSuccess.message}</p>
            <p className={styles.successDetails}>{registrationSuccess.details}</p>
            {registrationSuccess.requestId && (
              <div className={styles.requestIdBox}>
                <span className={styles.requestIdLabel}>Request ID:</span>
                <span className={styles.requestIdValue}>{registrationSuccess.requestId}</span>
              </div>
            )}
            <button 
              className={styles.successButton}
              onClick={handleSuccessClose}
            >
              Return to Login
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.registerBox}>
          <div className={styles.formSection}>
            <div className={styles.logoContainer}>
              <Image
                src="/logo.png"
                alt="PresCrypt Logo"
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
                      name="SLMCRegId"
                      placeholder="SLMC License Number"
                      className={errors.SLMCRegId ? styles.inputError : styles.input}
                      value={formData.SLMCRegId}
                      onChange={handleChange}
                    />
                    {errors.SLMCRegId && <p className={styles.errorMessage}>{errors.SLMCRegId}</p>}
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
                    <div className={styles.chargeInputContainer}>
                      <span className={styles.currencySymbol}>Rs.</span>
                      <input
                        type="number"
                        name="Charge"
                        placeholder="Consultation Charge"
                        step="0.01"
                        min="0"
                        className={errors.Charge ? styles.inputError : styles.input}
                        value={formData.Charge}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.Charge && <p className={styles.errorMessage}>{errors.Charge}</p>}
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
                            className={
                              !currentSchedule.hospital
                                ? `${styles.dropdownButton} ${styles.inputError}`
                                : styles.dropdownButton
                            }
                            onClick={() => {
                              setShowHospitalDropdown(!showHospitalDropdown);
                              setHospitalSearchTerm("");
                            }}
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
                                  autoFocus
                                />
                                <Search size={16} className={styles.searchIcon} />
                              </div>
                              <div className={styles.dropdownList}>
                                {filteredHospitals.length > 0 ? (
                                  filteredHospitals.map((hospital) => (
                                    <div
                                      key={hospital.hospitalId}
                                      className={styles.dropdownItem}
                                      onClick={() => {
                                        setCurrentSchedule({
                                          ...currentSchedule,
                                          hospital: hospital.hospitalName,
                                          hospitalId: hospital.hospitalId,
                                        });
                                        setShowHospitalDropdown(false);
                                      }}
                                    >
                                      <div className={styles.hospitalName}>{hospital.hospitalName}</div>
                                      <div className={styles.hospitalDetails}>
                                        <span>{hospital.city}</span>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className={styles.noResults}>
                                    No hospitals found matching "{hospitalSearchTerm}"
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        {!currentSchedule.hospital && errors.hospitalSchedule && (
                          <p className={styles.errorMessage}>Please select a hospital</p>
                        )}
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
                                    onChange={(e) =>
                                      updateDayTimeSlot(day, "startTime", e.target.value)
                                    }
                                    className={styles.timeSelect}
                                  >
                                    <option value="">Start Time</option>
                                    {timeOptions.map((time) => (
                                      <option key={`${day}-start-${time}`} value={time}>
                                        {time}
                                      </option>
                                    ))}
                                  </select>

                                  <span className={styles.timeSeparator}>to</span>

                                  <select
                                    value={currentSchedule.availability[day].endTime}
                                    onChange={(e) =>
                                      updateDayTimeSlot(day, "endTime", e.target.value)
                                    }
                                    className={styles.timeSelect}
                                  >
                                    <option value="">End Time</option>
                                    {timeOptions.map((time) => (
                                      <option key={`${day}-end-${time}`} value={time}>
                                        {time}
                                      </option>
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
                      {formData.hospitalSchedules.map((schedule, index) => {
                        const hospital = hospitals.find(h => h.hospitalId === schedule.hospitalId);
                        return (
                          <div key={index} className={styles.scheduleCard}>
                            <div className={styles.scheduleHeader}>
                              <h4>{hospital ? `${hospital.hospitalName}, ${hospital.city}` : schedule.hospitalId}</h4>
                              <button
                                type="button"
                                className={styles.deleteSchedule}
                                onClick={() => removeHospitalSchedule(index)}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                            <div className={styles.scheduleAvailability}>
                              {Object.entries(schedule.availability)
                                .map(([day, times]) => (
                                  <div key={day} className={styles.scheduleDay}>
                                    <strong>{day}:</strong> {times.startTime} - {times.endTime}
                                  </div>
                                ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
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

            <p className={`${styles.loginRedirect} text-center text-gray-600 mb-4`}>
                      Already registered?{" "}
                      <a href="/Auth/login" className={`${styles.loginLink} text-green-500 hover:underline`}>
                        Log in here
                      </a>
                    </p>
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
      )}

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
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 16V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M8 12L12 8L16 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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