import axiosInstance from "../utils/axiosInstance";

const BASE_URL = "/Appointments";

const AppointmentService = {
  async getAppointmentsByDoctor(
    doctorId,
    date = "",
    hospitalName = "",
    status = ""
  ) {
    const queryParams = [];

    if (date) queryParams.push(`date=${encodeURIComponent(date)}`);
    if (hospitalName)
      queryParams.push(`hospitalName=${encodeURIComponent(hospitalName)}`);
    if (status) queryParams.push(`status=${encodeURIComponent(status)}`);

    const queryString =
      queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

    const endpoint = `${BASE_URL}/by-doctor/${doctorId}${queryString}`;
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

  async markTodayAppointmentComplete(patientId) {
    const endpoint = `${BASE_URL}/complete-today/${patientId}`;
    const response = await axiosInstance.put(endpoint);
    return response.data;
  },
};

export default AppointmentService;
