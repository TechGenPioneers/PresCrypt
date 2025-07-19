// app/Auth/PatientRegistration/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RegistrationLayout from "../components/RegistrationLayout";
import FormInput from "../components/FormInput";
import PasswordInput from "../components/PasswordInput";
import DatePickerInput from "../components/DatePickerInput";
import FormSelect from "../components/FormSelect";
import SubmitButton from "../components/SubmitButton";
import FormTextarea from "../components/FormTextArea";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

export default function PatientRegistration() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    contactNumber: "",
    address: "",
    dob: null,
    role: "Patient",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };
  const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  };
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // "error", "info", etc.

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, dob: date });
    setErrors({ ...errors, dob: "" });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.FirstName.trim())
      newErrors.FirstName = "First Name is required.";
    if (!formData.LastName.trim())
      newErrors.LastName = "Last Name is required.";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format.";
    }
    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (!passwordPattern.test(formData.password)) {
      newErrors.password =
        "Must be 6+ chars with uppercase, lowercase, number, and special char.";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    if (!formData.contactNumber.trim())
      newErrors.contactNumber = "Contact Number is required.";
    if (!formData.address.trim()) newErrors.address = "Address is required.";
    if (!formData.dob) newErrors.dob = "Date of Birth is required.";
    if (!formData.role) newErrors.role = "Role is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch(
        "https://localhost:7021/api/User/PatientRegistration",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            FirstName: formData.FirstName,
            LastName: formData.LastName,
            email: formData.email.toLowerCase(),
            password: formData.password,
            confirmPassword: formData.confirmPassword,
            contactNumber: formData.contactNumber,
            address: formData.address,
            dob: formData.dob?.toISOString().split("T")[0],
            status: "Active",
          }),
        }
      );

      const data = await response.text();
      if (!response.ok) throw new Error(data);

      setSnackbarMessage("🎉 Registration Successful!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      setTimeout(() => {
        router.push("../Patient/PatientDashboard");
      }, 2000); // Give user time to see the toast
    } catch (err) {
      setErrors({ general: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegistrationLayout
      title="JOIN US FOR A HEALTHIER TOMORROW!"
      subtitle="Create your account"
    >
      <FormSelect
        options={["Patient", "Doctor"]}
        selected={formData.role}
        onChange={(role) => {
          setFormData({ ...formData, role });
          if (role === "Doctor") router.push("/Auth/DoctorRegistration");
          if (role === "Admin") router.push("/Auth/AdminRegistration");
        }}
        error={errors.role}
      />
      <FormInput
        name="FirstName"
        placeholder="First Name"
        value={formData.FirstName}
        onChange={handleChange}
        error={errors.FirstName}
      />
      <FormInput
        name="LastName"
        placeholder="Last Name"
        value={formData.LastName}
        onChange={handleChange}
        error={errors.LastName}
      />
      <FormInput
        name="email"
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
      />
      <FormInput
        name="contactNumber"
        placeholder="Contact Number"
        value={formData.contactNumber}
        onChange={handleChange}
        error={errors.contactNumber}
      />

      <DatePickerInput
        selected={formData.dob}
        onChange={(date) => {
          setFormData({ ...formData, dob: date });
          setErrors({ ...errors, dob: "" });
        }}
        error={errors.dob}
      />
      <FormTextarea
        name="address"
        placeholder="Address"
        value={formData.address}
        onChange={handleChange}
        error={errors.address}
      />
      <PasswordInput
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
      />
      <PasswordInput
        name="confirmPassword"
        placeholder="Confirm Password"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
      />
      {errors.general && (
        <p className="text-red-500 text-sm mb-4">{errors.general}</p>
      )}
      <SubmitButton
        onClick={handleRegister}
        loading={loading}
        disabled={loading}
        text="Create Account"
        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg"
      >
        {loading ? "Registering..." : "Create Account"}
      </SubmitButton>
      <p className="text-center text-gray-600 mt-4">
        Already registered?{" "}
        <a
          href="/Auth/login"
          className="text-teal-600 hover:underline font-medium"
        >
          Log in here
        </a>
      </p>
    </RegistrationLayout>
  );
}
