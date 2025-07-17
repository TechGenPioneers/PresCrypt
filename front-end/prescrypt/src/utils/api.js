import axios from "axios";
import Cookies from "js-cookie";

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

// Login User
export const loginUser = async (loginData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/User/Login`, loginData, {
      headers: {
        'Content-Type': 'application/json'
      },
      validateStatus: (status) => status < 500 // Allow custom error handling
    });

    console.log('Full response:', response);

    if (response.data.token) {
      //  Store token and role in cookies
      Cookies.set("token", response.data.token, { expires: 1 }); // 1 day expiry
      Cookies.set("role", response.data.user.role, { expires: 1 });

      return {
        success: true,
        token: response.data.token,
        user: response.data.user
      };
    }

    if (response.data.message?.includes("pending approval")) {
      return {
        success: false,
        message: response.data.message,
        user: response.data.user
      };
    }

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

// Forgot Password
export const forgotPassword = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/Patient/ForgotPassword`, data);
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: "Error sending reset email." };
  }
};

// Reset Password
export const resetPassword = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/Patient/ResetPassword`, data);
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: "Error resetting password." };
  }
};
// export const requestPatientAccess = async (payload) => {
//   try {
//     const response = await axios.post("https://localhost:7021/api/Doctor/request-patient-access", payload);
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || { message: "Request failed" };
//   }
// };

// Logout Function (Optional)
export const logout = () => {
  Cookies.remove("token");
  Cookies.remove("role");
};