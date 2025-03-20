"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import styles from "./patientReg.module.css";

export default function PatientRegistration() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    contactNumber: "",
    nic: "",
    bloodGroup: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Clear error as user types
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
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
    if (!formData.contactNumber.trim()) newErrors.contactNumber = "Contact Number is required.";
    if (!formData.nic.trim()) newErrors.nic = "NIC is required.";
    //if (!formData.bloodGroup.trim()) newErrors.bloodGroup = "Blood Group is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch("https://localhost:7021/api/Patient/Registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email.toLowerCase(),
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          contactNumber: formData.contactNumber,
          nic: formData.nic,
          bloodGroup: formData.bloodGroup,
          status: "Active",
        }),
      });

      const data = await response.text();
      if (!response.ok) throw new Error(data);

      alert("Registration Successful!");
      setFormData({ fullName: "", email: "", password: "", confirmPassword: "", contactNumber: "", nic: "", bloodGroup: "" });
      setErrors({});
    } catch (err) {
      setErrors({ general: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.registerBox}>
        {/* Left Side - Registration Form */}
        <div className={styles.formSection}>
          <h2 className={styles.title}>JOIN US FOR A HEALTHIER TOMORROW!</h2>
          <p className={styles.subtitle}>Create your account</p>

          {[
            { name: "fullName", placeholder: "Full Name" },
            { name: "email", placeholder: "Email", type: "email" },
            { name: "contactNumber", placeholder: "Contact Number" },
            { name: "nic", placeholder: "NIC" },
           
          ].map(({ name, placeholder, type = "text" }) => (
            <div key={name} className={styles.inputGroup}>
              <input type={type} name={name} placeholder={placeholder} className={errors[name] ? styles.inputError : styles.input} value={formData[name]} onChange={handleChange} />
              {errors[name] && <p className={styles.errorMessage}>{errors[name]}</p>}
            </div>
          ))}

          {[{ name: "password", show: showPassword, setShow: setShowPassword }, { name: "confirmPassword", show: showConfirmPassword, setShow: setShowConfirmPassword }].map(({ name, show, setShow }) => (
            <div key={name} className={styles.inputGroup} style={{ position: "relative" }}>
              <input type={show ? "text" : "password"} name={name} placeholder={name === "password" ? "Password" : "Confirm Password"} className={errors[name] ? styles.inputError : styles.input} value={formData[name]} onChange={handleChange} />
              <span className={styles.eyeIcon} onClick={() => setShow(!show)}>{show ? <EyeOff size={20} /> : <Eye size={20} />}</span>
              {errors[name] && <p className={styles.errorMessage}>{errors[name]}</p>}
            </div>
          ))}

          {errors.general && <p className={styles.errorMessage}>{errors.general}</p>}
          <button className={styles.registerBtn} onClick={handleRegister} disabled={loading}>{loading ? "Registering..." : "Create Account"}</button>
          <div className={styles.inputGroup}>
            <input type="text" name="fullName" placeholder="Full Name" className={errors.fullName ? styles.inputError : styles.input} value={formData.fullName} onChange={handleChange} />
            {errors.fullName && <p className={styles.errorMessage}>{errors.fullName}</p>}
          </div>

          <div className={styles.inputGroup}>
            <input type="email" name="email" placeholder="Email" className={errors.email ? styles.inputError : styles.input} value={formData.email} onChange={handleChange} />
            {errors.email && <p className={styles.errorMessage}>{errors.email}</p>}
          </div>

          <div className={styles.inputGroup}>
            <input type="password" name="password" placeholder="Password" className={errors.password ? styles.inputError : styles.input} value={formData.password} onChange={handleChange} />
            {errors.password && <p className={styles.errorMessage}>{errors.password}</p>}
          </div>

          <div className={styles.inputGroup}>
            <input type="password" name="confirmPassword" placeholder="Confirm Password" className={errors.confirmPassword ? styles.inputError : styles.input} value={formData.confirmPassword} onChange={handleChange} />
            {errors.confirmPassword && <p className={styles.errorMessage}>{errors.confirmPassword}</p>}
          </div>

          <div className={styles.inputGroup}>
            <input type="text" name="contactNumber" placeholder="Contact Number" className={errors.contactNumber ? styles.inputError : styles.input} value={formData.contactNumber} onChange={handleChange} />
            {errors.contactNumber && <p className={styles.errorMessage}>{errors.contactNumber}</p>}
          </div>

          <div className={styles.inputGroup}>
            <input type="text" name="nic" placeholder="NIC" className={errors.nic ? styles.inputError : styles.input} value={formData.nic} onChange={handleChange} />
            {errors.nic && <p className={styles.errorMessage}>{errors.nic}</p>}
          </div>

          <div className={styles.inputGroup}>
            <input type="text" name="bloodGroup" placeholder="Blood Group" className={errors.bloodGroup ? styles.inputError : styles.input} value={formData.bloodGroup} onChange={handleChange} />
            {errors.bloodGroup && <p className={styles.errorMessage}>{errors.bloodGroup}</p>}
          </div>

          {errors.general && <p className={styles.errorMessage}>{errors.general}</p>}

          <button className={styles.registerBtn} onClick={handleRegister} disabled={loading}>
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
