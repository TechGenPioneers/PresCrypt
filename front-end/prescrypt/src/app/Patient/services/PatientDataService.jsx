import axios from "axios";
const BASE_URL = "https://localhost:7021/api";


export const getProfileImage = async (patientId) => {
  try {
    const response = await axios.get(`${BASE_URL}/Patient/profileImage/${patientId}`, {
      responseType: "arraybuffer",
    });
    const base64Image = Buffer.from(response.data, "binary").toString("base64");
    return `data:image/jpeg;base64,${base64Image}`;
  } catch (error) {
    if (error.response && error.response.status === 404) {
     
      return "/default-avatar.png"; 
    } else {
      console.error("Unexpected error fetching profile image:", error);
      throw error; 
    }
  }
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
      responseType: "blob",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data; 
}

export const sendPatientContactUs = async (dataload) => {
  return await axios.post(`${BASE_URL}/Patient/ContactUs`, dataload);
};


export const getPatientIdByEmail = async (email) => {
  const res = await fetch(`${BASE_URL}/Patient/id-by-email?email=${email}`);
  if (!res.ok) {
    throw new Error("Failed to fetch patient ID by email");
  }
  const data = await res.json();
  return data; 
};


export const addDoctorCharge = async (doctorId, doctorCharge) => {
  try {
    const response = await axios.post(`${BASE_URL}/Doctor/AddCharge`, {
      doctorId: doctorId,
      chargeToAdd: doctorCharge,
    });

    return response.data;
  } catch (error) {
    console.error("Error updating doctor charge:", error);
    throw error;
  }
};


export const getAppointmentSummary = async (patientId) => {
  try {
    const response = await axios.get(`${BASE_URL}/Appointments/summary/${patientId}`);
    return response.data; 
  } catch (error) {
    console.error("Error fetching appointment summary:", error);
    throw error;
  }
};
