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

// Respond to a doctor's request to review a prescription
export const respondToRequest = async (notificationId, doctorId, accepted) => {
  return await axios.post(`${BASE_URL}/PatientNotification/respond-request`, {
    notificationId,
    doctorId,
    accepted,
  });
};
