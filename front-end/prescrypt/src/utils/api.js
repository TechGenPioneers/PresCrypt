const API_BASE_URL = "https://localhost:7021/api"; // Ensure this matches your backend
import axios from "axios";

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
    throw new Error(error.message || "An error occurred");
  }
};
