import axiosInstance from "../utils/axiosInstance"; 

const BASE_URL = "/DoctorPatient";

const DoctorPatientsService = {
  async getPatientsByType(doctorId, type) {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/patient-details/${doctorId}`, {
        params: { type },
      });
      return response.data;
    } catch (err) {
      if (err.response?.status === 404) {
        return [];
      }
      throw err;
    }
  },
};

export default DoctorPatientsService;
