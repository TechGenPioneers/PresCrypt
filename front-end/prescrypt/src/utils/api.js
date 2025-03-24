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

// Patient Login
export const loginPatient = async (loginData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/Patient/Login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || "Login failed");
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login failed");
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
