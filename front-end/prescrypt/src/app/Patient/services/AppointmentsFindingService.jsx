import axios from "axios";

const BASE_URL = "https://localhost:7021/api";

//fetch doctors matching the search criteria
export const findDoctors = async ({ specialization = "", hospitalName = "", name = "" }) => {
  try {
    const response = await axios.get("https://localhost:7021/api/Doctor/search", {
      params: {
        specialization: name ? "" : specialization,
        hospitalName: name ? "" : hospitalName,
        name: name || "",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching doctors:", error.message);
    throw error;
  }
};

//find the specializations of doctors
export const fetchSpecializations = async () => {
  try {
    const res = await fetch("https://localhost:7021/api/Doctor/specializations");
    if (!res.ok) throw new Error("Failed to fetch specializations");
    const data = await res.json();
    return data.map((name) => ({ name, icon: null })); 
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

//find the locations of hospitals
export const fetchHospitalLocations = async () => {
  try {
    const response = await axios.get("https://localhost:7021/api/Hospital/locations");
    const data = response.data;
    return Object.entries(data).map(([city, hospitals]) => ({
      district: city,
      hospitals,
    }));
  } catch (error) {
    console.error("Error fetching hospital locations:", error);
    throw error;
  }
};


//fetch the appointments of a patient to the calender
export const getAppointmentsByPatientId = async (patientId) => {
  try {
    const response = await axios.get(`https://localhost:7021/api/patient/appointments/${patientId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw error;
  }
};

//fetch doctor details to the appointmentcard
export const fetchDoctorDetails = async (doctorId) => {
  const response = await fetch(`https://localhost:7021/api/Doctor/book/${doctorId}`);
  if (!response.ok) throw new Error("Failed to fetch doctor details");
  return await response.json();
};

//fetch the appointment count for each day
export const fetchAppointmentCounts = async (doctorId, dates) => {
  const response = await fetch(`https://localhost:7021/api/Appointments/count-by-dates`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ doctorId, dates }),
  });

  if (!response.ok) throw new Error("Failed to fetch appointment counts");
  const rawData = await response.json();

  const normalizedData = {};
  for (const dateTime in rawData) {
    const dateOnly = new Date(dateTime).toISOString().split("T")[0];
    normalizedData[dateOnly] = rawData[dateTime];
  }
  return normalizedData;
};


//fetch appointments for a given patientId
export const getAppointmentsByPatient = async (patientId) => {
  const res = await axios.get(`${BASE_URL}/Appointments/patient/${patientId}`);
  return res.data;
};

//delete a specific appointment
export const deleteAppointment = async (appointmentId) => {
  return await axios.delete(`${BASE_URL}/Appointments/${appointmentId}`);
};

//send appointment email to the patient
export const sendEmail = async (payload) => {
  return await axios.post(`${BASE_URL}/PatientEmail`, payload);
};

//add the notificaton of a patient
export const sendNotification = async (payload) => {
  return await axios.post(`${BASE_URL}/PatientNotification/send`, payload);
};
