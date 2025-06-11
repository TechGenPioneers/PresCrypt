// components/DoctorRegistrationForm.jsx
"use client";
import { useState } from "react";
import PersonalInfoForm from "../components/PersonalInfoForm";
import ProfessionalInfoForm from "../components/ProfessionalInfoForm";
import StepIndicator from "../components/StepIndicator";
import SuccessMessage from "../components/SuccessMessage";

export default function DoctorRegistrationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [registrationSuccess, setRegistrationSuccess] = useState(null);
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

  const handleNextStep = () => setCurrentStep(2);
  const handlePrevStep = () => setCurrentStep(1);

  if (registrationSuccess) {
    return <SuccessMessage {...registrationSuccess} />;
  }

  return (
    <div className="w-full max-w-4xl bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-8">
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="PresCrypt Logo" className="h-12" />
        </div>

        <h2 className="text-2xl font-bold text-center text-green-800 mb-2">
          JOIN US FOR A HEALTHIER TOMORROW!
        </h2>
        <p className="text-gray-600 text-center mb-6">Create your account</p>

        <StepIndicator currentStep={currentStep} />

        {currentStep === 1 ? (
          <PersonalInfoForm
            formData={formData}
            setFormData={setFormData}
            onNext={handleNextStep}
          />
        ) : (
          <ProfessionalInfoForm
            formData={formData}
            setFormData={setFormData}
            onPrev={handlePrevStep}
            onSuccess={setRegistrationSuccess}
          />
        )}
      </div>
    </div>
  );
}