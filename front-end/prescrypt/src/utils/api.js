const API_BASE_URL = "https://localhost:7021/api"; // Ensure this matches your backend
import axios from "axios";

export const registerPatient = async (patientData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/Patient/Registration`, patientData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};

export const loginPatient = async (loginData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/Patient/login`, loginData);
    //console.log("Login successful:", response.data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};
