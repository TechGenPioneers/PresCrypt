import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://localhost:7021/api";

// Patient Registration
export const registerPatient = async (patientData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/Patient/Registration`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patientData),
    });
    
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || "Registration failed");
    }
    
    return await response.json();
  } catch (error) {
    throw new Error(error.message || "An error occurred");
  }
};

// Common Login for all roles
export const loginUser = async (loginData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/User/Login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData),
    });
    
    // Parse the JSON response regardless of success or failure
    const data = await response.json();
    
    // If response is not ok, we still want to return the data for proper handling
    if (!response.ok) {
      // If the error contains user info (like for pending doctors), return it
      if (data.user) {
        return {
          success: false,
          message: data.message || "Login failed",
          user: data.user
        };
      }
      // Otherwise return the error message
      return {
        success: false,
        message: data.message || "Login failed"
      };
    }
    
    // Success case
    return data;
  } catch (error) {
    console.error("Login error:", error);
    // Handle network errors or JSON parsing errors
    return { 
      success: false, 
      message: "Login service unavailable. Please try again later." 
    };
  }
};

// Forgot Password (Send Reset Email)
export const forgotPassword = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/Patient/ForgotPassword`, data);
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: "Error sending reset email." };
  }
};

// Reset Password (After clicking reset link)
export const resetPassword = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/Patient/ResetPassword`, data);
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: "Error resetting password." };
  }
};