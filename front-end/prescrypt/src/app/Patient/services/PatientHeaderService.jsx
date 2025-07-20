import axios from "axios";
const BASE_URL = "https://localhost:7021/api";

// Get all notifications for a patient
export const getNotifications = async (userId) => {
  const res = await axios.get(`${BASE_URL}/PatientNotification/${userId}`);
  return res.data;
};

// Mark a notification as read
export const markAsRead = async (id) => {
  return await axios.post(`${BASE_URL}/PatientNotification/mark-as-read`, id, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

//make a notificaiton as reponded
export const markAsResponded = async (id) => {
  return await axios.post(`${BASE_URL}/PatientNotification/mark-as-responded`, id, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};


export const respondToRequest = async ({ doctorId, accepted ,patientId}) => {
  try {

    const response = await axios.post(
      "https://localhost:7021/api/AccessRequest/respond-to-access-request",
      {
        doctorId,
        patientId,
        accepted,
      }
    );
    return response.data;
  } catch (error) {
    console.error("API Error Response:", error.response?.data || error.message);
    throw new Error("Failed to respond to access request");
  }
};

