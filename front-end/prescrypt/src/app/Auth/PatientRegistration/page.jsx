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
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

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
    gender: "", // Added gender field
    role: "Patient",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

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

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, dob: date });
    setErrors({ ...errors, dob: "" });
  };

  const handleGenderChange = (gender) => {
    setFormData({ ...formData, gender });
    setErrors({ ...errors, gender: "" });
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
    if (!formData.gender) newErrors.gender = "Gender is required."; // Added gender validation
    if (!formData.role) newErrors.role = "Role is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enhanced function to parse backend validation errors
  const parseBackendErrors = (errorResponse) => {
    try {
      // Try to parse as JSON first
      let parsedError;
      if (typeof errorResponse === 'string') {
        try {
          parsedError = JSON.parse(errorResponse);
        } catch {
          parsedError = errorResponse;
        }
      } else {
        parsedError = errorResponse;
      }

      // Handle different error response formats
      if (parsedError && typeof parsedError === 'object') {
        const backendErrors = {};
        
        // Format 1: { "errors": { "Email": ["Email already exists"], "FirstName": ["Invalid name"] } }
        if (parsedError.errors) {
          Object.keys(parsedError.errors).forEach(field => {
            const fieldErrors = parsedError.errors[field];
            if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
              // Map backend field names to frontend field names if needed
              const frontendFieldName = mapBackendFieldToFrontend(field);
              backendErrors[frontendFieldName] = fieldErrors[0]; // Take first error
            }
          });
        }
        
        // Format 2: { "Email": "Email already exists", "Password": "Weak password" }
        else if (!parsedError.message && !parsedError.title) {
          Object.keys(parsedError).forEach(field => {
            if (typeof parsedError[field] === 'string') {
              const frontendFieldName = mapBackendFieldToFrontend(field);
              backendErrors[frontendFieldName] = parsedError[field];
            }
          });
        }
        
        // Format 3: { "message": "Validation failed", "details": {...} }
        else if (parsedError.details) {
          Object.keys(parsedError.details).forEach(field => {
            const frontendFieldName = mapBackendFieldToFrontend(field);
            backendErrors[frontendFieldName] = parsedError.details[field];
          });
        }

        // If we found field-specific errors, return them
        if (Object.keys(backendErrors).length > 0) {
          console.log('Parsed backend errors:', backendErrors);
          return { fieldErrors: backendErrors };
        }
      }

      // If no field-specific errors found, return general message
      const generalMessage = parsedError?.message || parsedError?.title || parsedError || "Registration failed.";
      console.log('General backend error:', generalMessage);
      return { generalMessage };

    } catch (error) {
      console.error('Error parsing backend response:', error);
      return { generalMessage: errorResponse || "An error occurred during registration." };
    }
  };

  // Helper function to map backend field names to frontend field names
  const mapBackendFieldToFrontend = (backendField) => {
    const fieldMapping = {
      'Email': 'email',
      'email': 'email',
      'Password': 'password',
      'password': 'password',
      'ConfirmPassword': 'confirmPassword',
      'confirmPassword': 'confirmPassword',
      'FirstName': 'FirstName',
      'firstName': 'FirstName',
      'LastName': 'LastName',
      'lastName': 'LastName',
      'ContactNumber': 'contactNumber',
      'contactNumber': 'contactNumber',
      'PhoneNumber': 'contactNumber',
      'phoneNumber': 'contactNumber',
      'Address': 'address',
      'address': 'address',
      'DateOfBirth': 'dob',
      'dateOfBirth': 'dob',
      'DOB': 'dob',
      'dob': 'dob',
      'Gender': 'gender',
      'gender': 'gender',
      'Role': 'role',
      'role': 'role'
    };
    
    return fieldMapping[backendField] || backendField;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setSnackbarMessage("Please fix the form errors before submitting.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);
    // Clear previous errors
    setErrors({});

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
            gender: formData.gender, // Added gender to the request
            status: "Active",
          }),
        }
      );

      const data = await response.text();
      
      if (!response.ok) {
        // Parse backend errors
        const { fieldErrors, generalMessage } = parseBackendErrors(data);
        
        if (fieldErrors && Object.keys(fieldErrors).length > 0) {
          // Set field-specific errors
          setErrors(prevErrors => ({ ...prevErrors, ...fieldErrors }));
          setSnackbarMessage("Please fix the validation errors below.");
          setSnackbarSeverity("error");
        } else {
          // Set general error
          setErrors(prevErrors => ({ ...prevErrors, general: generalMessage }));
          setSnackbarMessage(generalMessage);
          setSnackbarSeverity("error");
        }
        setSnackbarOpen(true);
        throw new Error(generalMessage || "Registration failed.");
      }

      // Success case
      let responseData;
      try {
        responseData = JSON.parse(data);
      } catch {
        // If response is not JSON, treat as success with text response
        responseData = { token: data };
      }

      setSnackbarMessage("Registration Successful! Redirecting to dashboard...");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      
      // Store tokens if available
      if (responseData.token) {
        localStorage.setItem("token", responseData.token);
      }
      if (responseData.role) {
        localStorage.setItem("userRole", responseData.role);
      }
      if (responseData.username) {
        localStorage.setItem("username", responseData.username);
      }

      // Keep loading state active during redirect
      setTimeout(() => {
        router.push("../Patient/PatientDashboard");
      }, 2000); // Increased timeout to show success message longer
      
    } catch (err) {
      console.error('Registration error:', err);
      // Error handling is already done above, no need to duplicate
      setLoading(false); // Stop loading on error
    }
    // Note: Don't set loading to false on success - keep it until redirect
  };

  return (
    <>
      {/* Backdrop with blur effect and loading spinner */}
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        }}
        open={loading}
      >
        <div className="flex flex-col items-center justify-center">
          <CircularProgress 
            color="inherit" 
            size={60}
            thickness={4}
            sx={{
              color: '#14b8a6', // Teal color to match your theme
              marginBottom: 2
            }}
          />
          <p className="text-white text-lg font-medium mt-4">
            {snackbarSeverity === 'success' && snackbarOpen 
              ? 'Loading Dashboard...' 
              : 'Creating Your Account...'
            }
          </p>
          <p className="text-gray-300 text-sm mt-2">
            Please wait while we set up your account
          </p>
        </div>
      </Backdrop>

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
          onChange={handleDateChange}
          error={errors.dob}
        />
        {/* Added Gender Selection */}
        <FormSelect
          options={["Male", "Female"]}
          selected={formData.gender}
          onChange={handleGenderChange}
          error={errors.gender}
          placeholder="Select Gender"
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
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating Account..." : "Create Account"}
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
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={snackbarSeverity === 'success' ? 3000 : 6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          className="mt-4"
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbarSeverity}
            className={`w-full max-w-md ${
              snackbarSeverity === "success" ? "bg-teal-600" : "bg-red-600"
            } text-white font-medium rounded-lg shadow-lg`}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </RegistrationLayout>
    </>
  );
}