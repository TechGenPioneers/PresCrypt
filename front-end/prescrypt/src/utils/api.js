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
      validateStatus: (status) => status < 500
    });

    console.log('Full response:', response);

    if (response.data.token) {
      // Store ONLY in localStorage - REMOVE COOKIES
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userRole", response.data.user.role);
      if (response.data.user.username) {
        localStorage.setItem("username", response.data.user.username);
      }

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


//Logout Function
export const logout = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/User/logout`, {}, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    // Clear localStorage only
    localStorage.clear();
    
  } catch (error) {
    console.error("Logout error:", error);
    // Clear localStorage even on error
    localStorage.clear();
    throw error;
  }
};
// export const logout = async () => {
//   try {
//     console.log("🔄 Starting logout process...");
    
//     // Debug BEFORE clearing
//     console.log("BEFORE logout - localStorage contents:");
//     console.log("Token exists:", !!localStorage.getItem('token'));
//     console.log("Role exists:", !!localStorage.getItem('userRole'));
//     console.log("Username exists:", !!localStorage.getItem('username'));
//     console.log("Total items:", localStorage.length);

//     // Clear localStorage FIRST
//     localStorage.removeItem('token');
//     localStorage.removeItem('userRole');
//     localStorage.removeItem('username');
//     localStorage.clear(); // Clear everything else too

//     // Debug AFTER clearing
//     console.log("AFTER clearing - localStorage contents:");
//     console.log("Token exists:", !!localStorage.getItem('token'));
//     console.log("Role exists:", !!localStorage.getItem('userRole'));
//     console.log("Username exists:", !!localStorage.getItem('username'));
//     console.log("Total items:", localStorage.length);

//     // Make API call
//     const response = await axios.post(`${API_BASE_URL}/User/logout`, {}, {
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     });
    
//     console.log("✅ Logout API call successful");
    
//     // Force redirect to login
//     window.location.href = '/Auth/login?session=expired';
    
//   } catch (error) {
//     console.error("❌ Logout error:", error);
//     // Ensure localStorage is cleared even on API error
//     localStorage.clear();
//     // Force redirect even on error
//     window.location.href = '/Auth/login?session=expired';
//   }
// };