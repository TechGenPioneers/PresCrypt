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

export const loginUser = async (loginData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/User/Login`, loginData, {
      headers: {
        'Content-Type': 'application/json'
      },
      validateStatus: (status) => status < 500 // Don't throw for 400 errors
    });

    console.log('Full response:', response); // Debug response

    // Successful login (2xx status)
    if (response.data.token) {
      return {
        success: true,
        token: response.data.token,
        user: response.data.user
      };
    }

    // Handle special cases (like pending approval)
    if (response.data.message?.includes("pending approval")) {
      return {
        success: false,
        message: response.data.message,
        user: response.data.user
      };
    }

    // Default error case
    return {
      success: false,
      message: response.data.message || "Login failed"
    };

  } catch (error) {
    console.error('Login error details:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || "Login service unavailable"
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