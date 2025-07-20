"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import LogoSection from "../components/LogoSection";
import StepIndicator from "../components/StepIndicator";
import RoleDropdown from "../components/RoleDropdown";
import PersonalInfoForm from "../components/PersonalInfoForm";
import HospitalScheduleForm from "../components/HospitalSchedule";
import PasswordForm from "../components/PasswordForm";
import SuccessMessage from "../components/SuccessMessage";
import UploadModal from "../components/UploadModal";
import { Button } from "@mui/material";
import Link from "next/link";
import HealthcareAnimatedBackground from "../../Components/MainPage/AnimatedWaveBackground";

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
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [otherSpecialization, setOtherSpecialization] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, uploadedFile: "File size must be less than 5MB" }));
      } else if (!["image/jpeg", "image/png", "application/pdf"].includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          uploadedFile: "Only JPEG, PNG, or PDF files allowed",
        }));
      } else {
        setUploadedFile(file);
        setErrors((prev) => ({ ...prev, uploadedFile: "" }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

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
      if (!/^\d{10}$/.test(formData.ContactNumber))
        newErrors.ContactNumber = "Invalid phone number (10 digits)";
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
    } else {
      if (formData.hospitalSchedules.length === 0) {
        newErrors.hospitalSchedules = "At least one hospital schedule required";
      }
      if (!formData.Password) newErrors.Password = "Password required";
      else if (formData.Password.length < 8) newErrors.Password = "Minimum 8 characters";
      else if (!/[A-Z]/.test(formData.Password)) newErrors.Password = "Need uppercase letter";
      else if (!/[a-z]/.test(formData.Password)) newErrors.Password = "Need lowercase letter";
      else if (!/[0-9]/.test(formData.Password)) newErrors.Password = "Need number";
      else if (!/[^A-Za-z0-9]/.test(formData.Password))
        newErrors.Password = "Need special character";

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

      formDataToSend.append("FirstName", formData.FirstName);
      formDataToSend.append("LastName", formData.LastName);
      formDataToSend.append("Gender", formData.Gender);
      formDataToSend.append(
        "Specialization",
        formData.Specialization === "Other" ? otherSpecialization : formData.Specialization
      );
      formDataToSend.append("SLMCRegId", formData.SLMCRegId);
      formDataToSend.append("NIC", formData.NIC);
      formDataToSend.append("ContactNumber", formData.ContactNumber);
      formDataToSend.append("Email", formData.Email);
      formDataToSend.append("Password", formData.Password);
      formDataToSend.append("ConfirmPassword", formData.ConfirmPassword);
      formDataToSend.append("Charge", formData.Charge);
      formDataToSend.append("hospitalSchedules", JSON.stringify(formData.hospitalSchedules));

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
        details:
          "We will confirm your identity and inform you via email once your account is approved.",
        requestId: result.requestId,
      });
    } catch (err) {
      console.error("Registration error:", err);
      setErrors({
        general: err.message || "Registration failed. Please check your data and try again.",
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
    <div className="relative min-h-screen overflow-hidden">
      {/* Fixed Animated Background */}
      <HealthcareAnimatedBackground />
      <div className="flex justify-center items-center min-h-screen p-4 relative z-10">
        {registrationSuccess ? (
          <SuccessMessage
            registrationSuccess={registrationSuccess}
            handleSuccessClose={handleSuccessClose}
          />
        ) : (
          <div className="bg-white/80 rounded-xl overflow-hidden max-w-7xl w-full">
            <div className="flex-1 p-6 flex flex-col">
              <LogoSection />
              <StepIndicator currentStep={currentStep} />
              <RoleDropdown formData={formData} setFormData={setFormData} />
              {currentStep === 1 ? (
                <PersonalInfoForm
                  formData={formData}
                  setFormData={setFormData}
                  errors={errors}
                  setErrors={setErrors}
                  uploadedFile={uploadedFile}
                  setUploadedFile={setUploadedFile}
                  setShowUploadModal={setShowUploadModal}
                  otherSpecialization={otherSpecialization}
                  setOtherSpecialization={setOtherSpecialization}
                />
              ) : (
                <div className="flex flex-col md:flex-row gap-8 mb-6">
                  <HospitalScheduleForm
                    formData={formData}
                    setFormData={setFormData}
                    currentSchedule={currentSchedule}
                    setCurrentSchedule={setCurrentSchedule}
                    errors={errors}
                    setErrors={setErrors}
                  />
                  <PasswordForm
                    formData={formData}
                    setFormData={setFormData}
                    errors={errors}
                    setErrors={setErrors}
                  />
                </div>
              )}
              {errors.general && <p className="text-red-500 text-xs mb-4">{errors.general}</p>}
              <p className="text-center text-gray-600 mb-4">
                Already registered?{" "}
                <Link href="/Auth/login" className="text-green-500 hover:underline">
                  Log in here
                </Link>
              </p>
              <div className="flex flex-col md:flex-row gap-4 mt-4">
                {currentStep === 2 && (
                  <Button
                    variant="outlined"
                    sx={{
                      color: "#14b8a6",
                      borderColor: "#14b8a6",
                      "&:hover": {
                        borderColor: "#0d9488",
                        backgroundColor: "#f0fdfa",
                      },
                    }}
                    onClick={handlePrevStep}
                    fullWidth
                  >
                    Back
                  </Button>
                )}
                {currentStep === 1 ? (
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#14b8a6",
                      color: "#fff",
                      "&:hover": {
                        backgroundColor: "#0d9488",
                      },
                    }}
                    onClick={handleNextStep}
                    fullWidth
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#14b8a6",
                      color: "#fff",
                      "&:hover": {
                        backgroundColor: "#0d9488",
                      },
                    }}
                    onClick={handleRegister}
                    disabled={loading}
                    fullWidth
                  >
                    {loading ? "Processing..." : "Request Verification"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
        <UploadModal
          showUploadModal={showUploadModal}
          setShowUploadModal={setShowUploadModal}
          handleFileUpload={handleFileUpload}
        />
      </div>
    </div>
  );
}