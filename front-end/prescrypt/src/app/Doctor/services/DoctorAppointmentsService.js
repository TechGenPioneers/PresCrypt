import axiosInstance from "../utils/axiosInstance";

const BASE_URL = "/Appointments";

const AppointmentService = {
  async getAppointmentsByDoctor(doctorId, date = "") {
    const endpoint = `${BASE_URL}/by-doctor/${doctorId}${date ? `?date=${date}` : ""}`;
    const response = await axiosInstance.get(endpoint);
    return response.data;
  },

  async getAvailabilityByDoctor(doctorId, date) {
    const endpoint = `${BASE_URL}/availability/${date}`;
    const response = await axiosInstance.get(endpoint, {
      params: { doctorId },
    });
    return response.data;
  },
};

export default AppointmentService;
