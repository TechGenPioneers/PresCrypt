"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, Calendar } from "lucide-react";
import DatePicker from "react-datepicker";
import { format } from 'date-fns';
import "react-datepicker/dist/react-datepicker.css";
import styles from "./patientReg.module.css";

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
    dob: "",
    role: "Patient",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Clear error as user types
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, dob: date });
    setErrors({ ...errors, dob: "" });
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
    if (!formData.contactNumber.trim()) newErrors.contactNumber = "Contact Number is required.";
    if (!formData.address.trim()) newErrors.address = "Address is required.";
    if (!formData.dob) newErrors.dob = "Date of Birth is required.";
    if (!formData.role) newErrors.role = "Role is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch("https://localhost:7021/api/User/PatientRegistration", {
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
          dob: formData.dob?.toISOString().split('T')[0],
          status: true,
        }),
      });

      const data = await response.text();
      if (!response.ok) throw new Error(data);

      alert("Registration Successful!");
      setFormData({
        FirstName: "",
        LastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        contactNumber: "",
        address: "",
        dob: "",
        role: "Patient",
      });
      setErrors({});
      router.push("../Patient/PatientDashboard");
    } catch (err) {
      setErrors({ general: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${styles.container} flex flex-col items-center justify-center min-h-screen bg-gray-100`}>
      <div className={`${styles.registerBox} bg-white shadow-md rounded-lg p-8 flex flex-col md:flex-row`}>
        {/* Left Side - Registration Form */}
        <div className={`${styles.formSection} flex-1`}>
          <div className={`${styles.logoContainer} flex justify-center mb-6`}>
            <Image
              src="/logo.png"
              alt="PresCrypt Logo"
              width={130}
              height={40}
              className="object-contain"
            />
          </div>

          <h2 className={`${styles.title} text-2xl font-bold text-center text-gray-800 mb-2`}>JOIN US FOR A HEALTHIER TOMORROW!</h2>
          <p className={`${styles.subtitle} text-center text-gray-600 mb-6`}>Create your account</p>

          {/* Role Dropdown */}
          <div className={`${styles.dropdownContainer} relative mb-4`}>
            <button
              className={`${styles.dropdownButton} w-full bg-gray-200 text-gray-700 py-2 px-4 rounded focus:outline-none`}
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            >
              {formData.role || "Choose your Role"}
            </button>
            {showRoleDropdown && (
              <div className={`${styles.dropdownMenu} absolute w-full bg-white border border-gray-300 rounded mt-1 z-10`}>
                {["Patient", "Doctor", "Admin"].map((role) => (
                  <div
                    key={role}
                    className={`${styles.dropdownItem} px-4 py-2 hover:bg-gray-100 cursor-pointer`}
                    onClick={() => {
                      setFormData({ ...formData, role });
                      setShowRoleDropdown(false);
                      if (role === "Doctor") {
                        router.push("/Auth/DoctorRegistration");
                      } else if (role === "Admin") {
                        router.push("/Auth/AdminRegistration");
                      }
                      setErrors({ ...errors, role: "" });
                    }}
                  >
                    {role}
                  </div>
                ))}
              </div>
            )}
            {errors.role && <p className={`${styles.errorMessage} text-red-500 text-sm mt-1`}>{errors.role}</p>}
          </div>

          {/* Input Fields */}
          {[
            { name: "FirstName", placeholder: "First Name" },
            { name: "LastName", placeholder: "Last Name" },
            { name: "email", placeholder: "Email", type: "email" },
            { name: "contactNumber", placeholder: "Contact Number" },
          ].map(({ name, placeholder, type = "text" }) => (
            <div key={name} className={`${styles.inputGroup} mb-4`}>
              <input
                type={type}
                name={name}
                placeholder={placeholder}
                className={`w-full bg-gray-100 border ${errors[name] ? "border-red-500" : "border-gray-300"} rounded py-2 px-4 focus:outline-none`}
                value={formData[name]}
                onChange={handleChange}
              />
              {errors[name] && <p className={`${styles.errorMessage} text-red-500 text-sm mt-1`}>{errors[name]}</p>}
            </div>
          ))}

          {/* Date of Birth */}
          <div className={`${styles.inputGroup} mb-4`}>
            <div className="relative">
               <label htmlFor="dob" className="block text-gray-0 mb-2">Date of Birth</label>
              <DatePicker
                selected={formData.dob}
                onChange={handleDateChange}
                PlaceholderText="Date of Birth"
                className={`w-full bg-gray-100 border ${errors.dob ? "border-red-500" : "border-gray-300"
                  } rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                dateFormat="MMMM d, yyyy"
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"
                maxDate={new Date()}
                minDate={new Date(1900, 0, 1)}
                yearDropdownItemNumber={100}
                scrollableYearDropdown
                withPortal
                isClearable
                clearButtonClassName="text-gray-400 hover:text-gray-600"
                todayButton="Today"
                popperClassName="shadow-lg rounded-lg border border-gray-200"
                popperPlacement="bottom-start"
                customInput={
                  <div className="relative">
                    <input
                      className={`w-full bg-gray-100 border ${errors.dob ? "border-red-500" : "border-gray-300"
                        } rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      value={formData.dob ? format(formData.dob, 'MMMM d, yyyy') : ''}
                      readOnly
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  </div>
                }
              />
              {errors.dob && (
                <p className={`${styles.errorMessage} text-red-500 text-sm mt-1`}>
                  {errors.dob}
                </p>
              )}
            </div>
          </div>

          {/* Address Textarea */}
          <div className="mb-4">
            <textarea
              name="address"
              placeholder="Address"
              rows="3"
              className={`w-full bg-gray-100 border ${errors.address ? "border-red-500" : "border-gray-300"} rounded py-2 px-4 focus:outline-none resize-none`}
              value={formData.address}
              onChange={handleChange}
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
          </div>

          {/* Password Fields */}
          {[{ name: "password", show: showPassword, setShow: setShowPassword }, { name: "confirmPassword", show: showConfirmPassword, setShow: setShowConfirmPassword }].map(({ name, show, setShow }) => (
            <div key={name} className={`${styles.inputGroup} mb-4 relative`}>
              <input
                type={show ? "text" : "password"}
                name={name}
                placeholder={name === "password" ? "Password" : "Confirm Password"}
                className={`w-full bg-gray-100 border ${errors[name] ? "border-red-500" : "border-gray-300"} rounded py-2 px-4 focus:outline-none`}
                value={formData[name]}
                onChange={handleChange}
              />
              <span
                className={`${styles.eyeIcon} absolute right-3 top-2.5 cursor-pointer`}
                onClick={() => setShow(!show)}
              >
                {show ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
              {errors[name] && <p className={`${styles.errorMessage} text-red-500 text-sm mt-1`}>{errors[name]}</p>}
            </div>
          ))}

          {errors.general && <p className={`${styles.errorMessage} text-red-500 text-sm mb-4`}>{errors.general}</p>}

          <button
            className={`${styles.registerBtn} w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none`}
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? "Registering..." : "Create Account"}
          </button>
          <p className={`${styles.loginRedirect} text-center text-gray-600 mb-4`}>
            Already registered?{" "}
            <a href="/Auth/login" className={`${styles.loginLink} text-green-500 hover:underline`}>
              Log in here
            </a>
          </p>
        </div>

        <div className={`${styles.imageSection} flex-1 hidden md:flex justify-center items-center`}>
          <Image src="/registerImage.jpg" alt="Doctor and Patient Illustration" width={320} height={330} />
        </div>
      </div>
    </div>
  );
}