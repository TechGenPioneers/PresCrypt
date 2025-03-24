"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import styles from "./patientReg.module.css";

export default function PatientRegistration() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    contactNumber: "",
    nic: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch("https://localhost:7021/api/Patient/Registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, status: "Active" }),
      });
      const data = await response.text();
      if (!response.ok) throw new Error(data);
      alert("Registration Successful!");
      setFormData({ fullName: "", email: "", password: "", confirmPassword: "", contactNumber: "", nic: "" });
      setErrors({});
      router.push("/Patient/PatientDashboard");
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
        </div>
        <div className={styles.imageSection}>
          <Image src="/registerImage.jpg" alt="Doctor and Patient Illustration" width={320} height={330} />
        </div>
      </div>
    </div>
  );
}
