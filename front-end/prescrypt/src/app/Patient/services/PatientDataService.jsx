import axios from "axios";
const BASE_URL = "https://localhost:7021/api";

// Fetch profile image of a patient
export const getProfileImage = async (patientId) => {
  const response = await axios.get(`${BASE_URL}/Patient/profileImage/${patientId}`, {
    responseType: "arraybuffer",
  });
  const base64Image = Buffer.from(response.data, "binary").toString("base64");
  return `data:image/jpeg;base64,${base64Image}`;
};

// Fetch patient name and join date
export const getPatientDetails = async (patientId) => {
  const response = await axios.get(`${BASE_URL}/Patient/profileNavbarDetails/${patientId}`);
  return response.data;
};
