import axios from "axios";
const BASE_URL = "https://localhost:7021/api";


export const addPayment = async (paymentPayload) => {
  return await axios.post(`${BASE_URL}/Payment/add`, paymentPayload);
};

export const createAppointment = async (appointmentData) => {
  return await axios.post(`${BASE_URL}/Appointments`, appointmentData);
};

export const sendFailureEmail = async (emailPayload) => {
  return await axios.post(`${BASE_URL}/PatientEmail`, emailPayload);
};

export const sendFailureNotification = async (notificationPayload) => {
  return await axios.post(`${BASE_URL}/PatientNotification/send`, notificationPayload);
};

export const sendEmail = async (emailPayload) => {
  return await axios.post(`${BASE_URL}/PatientEmail`, emailPayload);
};


export const sendNotification = async (notificationPayload) => {
  return await axios.post(`${BASE_URL}/PatientNotification/send`, notificationPayload);
};


// New PDF generation service
export const generatePdf = async (pdfPayload) => {
  try {
    const response = await axios.post(`${BASE_URL}/PatientPDF/generate`, pdfPayload, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};