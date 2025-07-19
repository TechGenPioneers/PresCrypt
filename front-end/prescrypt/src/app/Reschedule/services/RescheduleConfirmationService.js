// src/services/RescheduleConfirmationService.js
import axios from "axios";

const API_BASE_URL = "https://localhost:7021/api";

const RescheduleConfirmationService = {
  confirmAppointment: async (appointmentId) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/Appointments/${appointmentId}/reschedule-confirm`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  cancelAppointment: async (appointmentId) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/Appointments/cancel/${appointmentId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default RescheduleConfirmationService;
