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

export async function respondToRequest(notificationId, doctorId, accepted) {
  const token = localStorage.getItem("token");

  const response = await fetch("https://localhost:7021/api/AccessRequest/respond-to-access-request", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      doctorId: doctorId,
      patientId: localStorage.getItem("userId"), // or pass explicitly
      accepted: accepted,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to respond to access request");
  }

  return await response.json();
}
