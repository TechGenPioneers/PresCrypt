import axiosInstance from "../utils/axiosInstance";

const AppointmentsRescheduleService = {
  // Now accepts a formattedDate string directly
  async fetchAvailableHospitals(doctorId, formattedDate) {
    const res = await axiosInstance.get(
      // Use the pre-formatted date string
      `/Appointments/available-hospitals?doctorId=${doctorId}&date=${formattedDate}`
    );
    return res.data || [];
  },

  // Now accepts a formattedDate string directly
  async fetchAppointmentsByDoctor(doctorId, formattedDate) {
    const res = await axiosInstance.get(
      // Use the pre-formatted date string
      `/Appointments/by-doctor/${doctorId}?date=${formattedDate}`
    );
    return res.data || [];
  },

  async rescheduleAppointments(appointmentIds) {
    const payload = { appointmentIds };
    const res = await axiosInstance.post(
      "/Appointments/reschedule-appointments",
      payload
    );
    return res.data;
  },
};

export default AppointmentsRescheduleService;