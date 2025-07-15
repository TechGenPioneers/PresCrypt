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

/**
 * Sends payload to backend to generate PDF and returns the Blob.
 * @param {object} pdfPayload
 * @returns {Blob}
 */
export async function generatePdf(pdfPayload) {
  const response = await axios.post("https://localhost:7021/api/PatientPdf/generate", pdfPayload, {
    responseType: "blob", 
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data; 
}

export async function generateAppointmentReport(payload) {
  const response = await axios.post(
    "https://localhost:7021/api/PatientPDF/Reports/Generate",
    payload,
    {
      responseType: "blob", // Important for binary PDF
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data; // This is the blob
}

export const sendPatientContactUs = async (dataload) => {
  return await axios.post(`${BASE_URL}/Patient/ContactUs`, dataload);
};