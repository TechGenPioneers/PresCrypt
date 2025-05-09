import axios from "axios";

// Get all notifications for a patient
export const getNotifications = async (userId) => {
  const res = await axios.get(
    `https://localhost:7021/api/PatientNotification/${userId}`
  );
  return res.data;
};

// Mark a notification as read
export const markAsRead = async (id) => {
  return await axios.post(
    "https://localhost:7021/api/PatientNotification/mark-as-read",
    id,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

// Respond to a doctor's request to review a prescription
export const respondToRequest = async (notificationId, doctorId, accepted) => {
  return await axios.post("https://localhost:7021/api/PatientNotification/respond-request", {
    notificationId,
    doctorId,
    accepted,
  });
};
