"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import styles from "./AdminReg.module.css";

export default function PatientRegistration() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Admin",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear the error for this field when the user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.FirstName.trim()) newErrors.FirstName = "First Name is required.";
    if (!formData.LastName.trim()) newErrors.LastName = "Last Name is required.";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format.";
    }
    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (!passwordPattern.test(formData.password)) {
      newErrors.password = "Must be 6+ chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char.";
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
      const response = await fetch("https://localhost:7021/api/User/AdminRegistration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, status: "Active" }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Registration failed. Please try again.");
      }
      
      const data = await response.text();
      alert("Registration Successful!");
      setFormData({
        FirstName: "",
        LastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "Admin",
      });
      setErrors({});
      router.push("/Admin/AdminDashboard");
    } catch (err) {
      setErrors(prev => ({ ...prev, general: err.message }));
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
              alt="PresCrypt Logo" 
              width={130}
              height={40}
              className={styles.logo}
            />
          </div>
        
          <h2 className={styles.title}>JOIN US FOR A HEALTHIER TOMORROW!</h2>
          <p className={styles.subtitle}>Create your account</p>

          {/* Role Dropdown */}
          <div className={styles.dropdownContainer}>
            <button 
              type="button"
              className={styles.dropdownButton} 
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            >
              {formData.role || "Choose your Role"}
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
                      if (role === "Doctor") {
                        router.push("/Auth/DoctorRegistration");
                      } else if (role === "Patient") {
                        router.push("/Auth/PatientRegistration");
                      }
                      if (errors.role) {
                        setErrors({ ...errors, role: "" });
                      }
                    }}
                  >
                    {role}
                  </div>
                ))}
              </div>
            )}
            {errors.role && <p className={styles.errorMessage}>{errors.role}</p>}
          </div>

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
              {errors[name] && <p className={styles.errorMessage}>{errors[name]}</p>}
            </div>
          ))}

          {/* Password Fields */}
          {[
            { name: "password", show: showPassword, setShow: setShowPassword, placeholder: "Password" },
            { name: "confirmPassword", show: showConfirmPassword, setShow: setShowConfirmPassword, placeholder: "Confirm Password" }
          ].map(({ name, show, setShow, placeholder }) => (
            <div key={name} className={styles.inputGroup} style={{ position: "relative" }}>
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
              {errors[name] && <p className={styles.errorMessage}>{errors[name]}</p>}
            </div>
          ))}

          {errors.general && <p className={styles.errorMessage}>{errors.general}</p>}
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
          <Image src="/registerImage.jpg" alt="Doctor and Patient Illustration" width={320} height={330} />
        </div>
      </div>
    </div>
  );
}