import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://localhost:7021/api"; 

// Patient Registration
export const registerPatient = async (patientData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/Patient/Registration`, patientData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};

// Patient Login
export const loginPatient = async (loginData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/Patient/Login`, loginData);
    return response.data;
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
