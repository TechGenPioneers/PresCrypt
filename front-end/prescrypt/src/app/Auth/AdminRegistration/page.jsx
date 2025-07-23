"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import styles from "./AdminReg.module.css";
import useAuthGuard from "@/utils/useAuthGuard";
import { CheckCircle, X } from "lucide-react";

export default function AdminRegistration() {
  useAuthGuard(["Admin"]); // Ensure only Admin can access this page
  const router = useRouter();
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Admin",
  });
  const [isVisible, setIsVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear the error for this field when the user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
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
        "Must be 6+ chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char.";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    // Set the errors state with the new errors
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    // Validate the form and check if there are any errors
    if (!validateForm()) {
      return; // Stop if validation fails
    }

    setLoading(true);
    try {
      const response = await fetch(
        "https://localhost:7021/api/User/AdminRegistration",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, status: "Active" }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Registration failed. Please try again.");
      }

      const data = await response.text();
      setIsVisible(true);
      setFormData({
        FirstName: "",
        LastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "Admin",
      });
      setErrors({});
    } catch (err) {
      setErrors((prev) => ({ ...prev, general: err.message }));
    } finally {
      setLoading(false);
    }
  };

  const handleDone = () => {
    setIsVisible(false);
    router.push("/Admin/AdminDashboard");
  };

  return (
    <div className={styles.container}>
      <div className={styles.registerBox}>
        <div className={styles.formSection}>
          <div className={styles.logoContainer}>
            <Image
              src="/logo.png"
              alt="PresCrypt Logo"
              width={130}
              height={40}
              className={styles.logo}
            />
          </div>

          <h2 className={styles.title}>Admin Registration</h2>
          <p className={styles.subtitle}>Create your account</p>

          {/* Input Fields */}
          {[
            { name: "FirstName", placeholder: "First Name" },
            { name: "LastName", placeholder: "Last Name" },
            { name: "email", placeholder: "Email", type: "email" },
          ].map(({ name, placeholder, type = "text" }) => (
            <div key={name} className={styles.inputGroup}>
              <input
                type={type}
                name={name}
                placeholder={placeholder}
                className={errors[name] ? styles.inputError : styles.input}
                value={formData[name]}
                onChange={handleChange}
              />
              {errors[name] && (
                <p className={styles.errorMessage}>{errors[name]}</p>
              )}
            </div>
          ))}

          {/* Password Fields */}
          {[
            {
              name: "password",
              show: showPassword,
              setShow: setShowPassword,
              placeholder: "Password",
            },
            {
              name: "confirmPassword",
              show: showConfirmPassword,
              setShow: setShowConfirmPassword,
              placeholder: "Confirm Password",
            },
          ].map(({ name, show, setShow, placeholder }) => (
            <div
              key={name}
              className={styles.inputGroup}
              style={{ position: "relative" }}
            >
              <input
                type={show ? "text" : "password"}
                name={name}
                placeholder={placeholder}
                className={errors[name] ? styles.inputError : styles.input}
                value={formData[name]}
                onChange={handleChange}
              />
              <span className={styles.eyeIcon} onClick={() => setShow(!show)}>
                {show ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
              {errors[name] && (
                <p className={styles.errorMessage}>{errors[name]}</p>
              )}
            </div>
          ))}

          {errors.general && (
            <p className={styles.errorMessage}>{errors.general}</p>
          )}
          <button
            type="button"
            className={styles.registerBtn}
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? "Registering..." : "Create Account"}
          </button>
        </div>

        <div className={styles.imageSection}>
          <Image
            src="/registerImage.jpg"
            alt="Doctor and Patient Illustration"
            width={320}
            height={330}
          />
        </div>
      </div>
      {isVisible && (
        <div className="min-h-screen bg-[#f3faf7] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            {/* Popup Container */}
            <div className="bg-white rounded-2xl shadow-2xl border-2 border-[#09424D] max-w-md w-full mx-4 overflow-hidden">
              {/* Header */}
              <div className="bg-[#E9FAF2] px-6 py-4 border-b border-[#09424D] relative">
                <button
                  onClick={handleDone}
                  className="absolute top-4 right-4 text-[#09424D] hover:bg-[#A9C9CD] rounded-full p-1 transition-colors"
                >
                  <X size={20} />
                </button>
                <h2 className="text-xl font-bold text-[#09424D] pr-8">
                  Success!
                </h2>
              </div>

              {/* Content */}
              <div className="px-6 py-8 text-center">
                <div className="flex justify-center mb-6">
                  <div className="bg-[#E9FAF2] rounded-full p-4 border-2 border-[#09424D]">
                    <CheckCircle size={48} className="text-[#09424D]" />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-[#09424D] mb-4">
                  Admin Account Created Successfully!
                </h3>

                <p className="text-gray-600 mb-8 leading-relaxed">
                  Your admin account has been created and is ready to use.
                </p>

                {/* Done Button */}
                <button
                  onClick={handleDone}
                  className="w-full bg-[#A9C9CD] text-[#09424D] py-3 px-6 rounded-lg font-semibold text-lg hover:bg-[#91B4B8] transition-colors duration-200 border-2 border-[#09424D] shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
