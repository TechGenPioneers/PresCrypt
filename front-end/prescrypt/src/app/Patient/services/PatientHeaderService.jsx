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
// export const respondToRequest = async (notificationId, doctorId, accepted) => {
//   return await axios.post(`${BASE_URL}/PatientNotification/respond-request`, {
//     notificationId,
//     doctorId,
//     accepted,
//   });
// };

export async function respondToRequest(notificationId, doctorId, accepted) {
  const token = localStorage.getItem("token");

  const response = await fetch("https://localhost:7021/api/Doctor/respond-to-request", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      notificationId,
      doctorId,
      accepted,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to respond to access request");
  }

  return await response.json();
}
