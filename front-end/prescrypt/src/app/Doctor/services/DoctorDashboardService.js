import axiosInstance from "../utils/axiosInstance";
import * as signalR from "@microsoft/signalr";

const baseUrl = "https://localhost:7021";
const hubEndpoint = "/doctorNotificationHub";

const DoctorDashboardService = {
  async getProfile(doctorId) {
    try {
      const response = await axiosInstance.get(`/DoctorDashboard/profile`, {
        params: { doctorId },
        validateStatus: (status) => status < 500,
      });

      if (!response.data) {
        console.warn("[DoctorDashboardService] Empty profile response");
        return { name: "", doctorImage: "" };
      }

      return {
        name: response.data.name || "",
        doctorImage: response.data.doctorImage || "",
      };
    } catch (error) {
      console.error("[DoctorDashboardService] Profile fetch error:", {
        error: error.message,
        response: error.response?.data,
      });
      return { name: "", doctorImage: "" };
    }
  },

  async getDashboardStats(doctorId) {
    try {
      const response = await axiosInstance.get(
        `/DoctorDashboard/dashboard-stats`,
        {
          params: { doctorId },
          validateStatus: (status) => status < 500,
        }
      );

      if (!response.data) {
        console.warn("[DoctorDashboardService] Empty stats response");
        return {
          upcomingAppointments: 0,
          cancelledAppointments: 0,
          bookedPatients: 0,
          hospitalAppointments: [],
        };
      }

      return {
        upcomingAppointments: response.data.upcomingAppointments || 0,
        cancelledAppointments: response.data.cancelledAppointments || 0,
        bookedPatients: response.data.bookedPatients || 0,
        hospitalAppointments: response.data.hospitalAppointments || [],
      };
    } catch (error) {
      console.error("[DoctorDashboardService] Stats fetch error:", {
        error: error.message,
        response: error.response?.data,
      });
      return {
        upcomingAppointments: 0,
        cancelledAppointments: 0,
        bookedPatients: 0,
        hospitalAppointments: [],
      };
    }
  },

  async getNotifications(doctorId) {
    try {
      const response = await axiosInstance.get(
        `/DoctorNotifications/doctor/${doctorId}`,
        {
          validateStatus: (status) => status < 500,
        }
      );

      if (!Array.isArray(response.data)) {
        console.warn(
          "[DoctorDashboardService] Invalid notifications format:",
          response.data
        );
        return [];
      }

      return response.data.map((notification) => ({
        id: notification.id || Date.now().toString(),
        title: notification.title || "Notification",
        message: notification.message || "",
        type: notification.type || "general",
        isRead: notification.isRead || false,
        createdAt: notification.createdAt
          ? new Date(notification.createdAt)
          : new Date(),
      }));
    } catch (error) {
      console.error("[DoctorDashboardService] Notifications fetch error:", {
        error: error.message,
        response: error.response?.data,
      });
      return [];
    }
  },

  async markNotificationAsRead(notificationId) {
    try {
      const response = await axiosInstance.post(
        `/DoctorNotifications/mark-as-read/${notificationId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        "[DoctorDashboardService] Error marking notification as read:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  async deleteNotification(notificationId) {
    try {
      const response = await axiosInstance.delete(
        `/DoctorNotifications/${notificationId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        "[DoctorDashboardService] Error deleting notification:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  createDoctorSignalRConnection() {
    return new signalR.HubConnectionBuilder()
      .withUrl(`${baseUrl}${hubEndpoint}`, {
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          if (retryContext.elapsedMilliseconds < 60000) {
            return Math.random() * 5000;
          } else {
            return Math.random() * 30000;
          }
        },
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();
  },
};

export default DoctorDashboardService;
