import axiosInstance from "../utils/axiosInstance";

const PrescriptionsService = {
  async getRecentByDoctor(doctorId) {
    const response = await axiosInstance.get(`/Appointments/recent-by-doctor/${doctorId}`);
    return response.data;
  },

};

export default PrescriptionsService;
