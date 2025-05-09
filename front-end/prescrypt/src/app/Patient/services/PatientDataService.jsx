import axios from "axios";

//fetch profile image of a patient
export const getProfileImage = async (patientId) => {
  const response = await axios.get(
    `https://localhost:7021/api/Patient/profileImage/${patientId}`,
    { responseType: "arraybuffer" }
  );
  const base64Image = Buffer.from(response.data, "binary").toString("base64");
  return `data:image/jpeg;base64,${base64Image}`;
};


//fetch patientName and join date of a patient
export const getPatientDetails = async (patientId) => {
  const response = await axios.get(
    `https://localhost:7021/api/Patient/profileNavbarDetails/${patientId}`
  );
  return response.data;
};
