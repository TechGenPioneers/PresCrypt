import axiosInstance from "../utils/axiosInstance";

const DoctorDashboardService = {
  async getProfile(doctorId) {
    const response = await axiosInstance.get(`/DoctorDashboard/profile`, {
      params: { doctorId },
    });
    return response.data;
  },

  async getDashboardStats(doctorId) {
    const response = await axiosInstance.get(`/DoctorDashboard/dashboard-stats`, {
      params: { doctorId },
    });
    return response.data;
  },

  async getNotifications(doctorId) {
    const response = await axiosInstance.get(`/DoctorNotifications/doctor/${doctorId}`);
    return response.data;
  },

  async markNotificationAsRead(notificationId) {
    const response = await axiosInstance.post(`/DoctorNotifications/mark-as-read/${notificationId}`);
    return response.data;
  },

  async deleteNotification(notificationId) {
    const response = await axiosInstance.delete(`/DoctorNotifications/${notificationId}`);
    return response.data;
  },

};

export default DoctorDashboardService;
