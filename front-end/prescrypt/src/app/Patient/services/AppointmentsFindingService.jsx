import axios from "axios";
const BASE_URL = "https://localhost:7021/api";

// Fetch doctors matching the search criteria
export const findDoctors = async ({ specialization = "", hospitalName = "", name = "" }) => {
  try {
    const response = await axios.get(`${BASE_URL}/Doctor/search`, {
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

// Fetch specializations of doctors
export const fetchSpecializations = async () => {
  try {
    const res = await fetch(`${BASE_URL}/Doctor/specializations`);
    if (!res.ok) throw new Error("Failed to fetch specializations");
    const data = await res.json();
    return data.map((name) => ({ name, icon: null }));
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// Fetch hospital locations
export const fetchHospitalLocations = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/Hospital/locations`);
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


// Fetch list of doctor names
export const fetchDoctorNames = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/Doctor/doctors`);
    return response.data;
  } catch (error) {
    console.error("Error fetching doctor names:", error.message);
    throw error;
  }
};


// Fetch appointments of a patient for calendar
export const getAppointmentsByPatientId = async (patientId) => {
  try {
    const response = await axios.get(`${BASE_URL}/patient/appointments/${patientId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw error;
  }
};

export const getAppointmentsByDate = async (startDate, endDate, patientId) => {
  try {
    const response = await axios.get(`${BASE_URL}/Appointments/Appointments/GetByDateRange`, {
      params: {
        startDate,
        endDate,
        patientId, 
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching appointments by date range", error);
    throw error;
  }
};


// Fetch doctor details for appointment card
export const fetchDoctorDetails = async (doctorId) => {
  const response = await fetch(`${BASE_URL}/Doctor/book/${doctorId}`);
  if (!response.ok) throw new Error("Failed to fetch doctor details");
  return await response.json();
};

// Fetch appointment count for each day
export const fetchAppointmentCounts = async (doctorId, dates) => {
  const response = await fetch(`${BASE_URL}/Appointments/count-by-dates`, {
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

// Fetch appointments by patient
export const getAppointmentsByPatient = async (patientId) => {
  const res = await axios.get(`${BASE_URL}/Appointments/patient/${patientId}`);
  return res.data;
};

// Cancel an appointment
export const deleteAppointment = async (appointmentId) => {
  const response = await axios.put(`${BASE_URL}/Appointments/cancel/${appointmentId}`);
  return response.data; 
};
// Send appointment email
export const sendEmail = async (payload) => {
  return await axios.post(`${BASE_URL}/PatientEmail`, payload);
};

// Send in-app notification
export const sendNotification = async (payload) => {
  return await axios.post(`${BASE_URL}/PatientNotification/send`, payload);
};


export const getAppointmentsByPatientIdAndDate = async (patientId, date) => {
  try {
    const response = await axios.get(`${BASE_URL}/Appointments/patient/${patientId}/date/${date}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching appointments by patient and date:", error);
    throw error;
  }
};