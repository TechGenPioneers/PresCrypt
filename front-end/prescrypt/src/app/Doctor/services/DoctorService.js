import axiosInstance from "../utils/axiosInstance"; 

export const getDoctorIdFromServer = async () => {
  const username = localStorage.getItem("username");

  if (!username) return null;

  try {
    const response = await axiosInstance.get(`/Doctor/GetDoctorId`, {
      params: { username },
    });

    const doctorId = response.data?.doctorId;
    if (doctorId) {
      localStorage.setItem("doctorId", doctorId);
      return doctorId;
    }

    return null;
  } catch (err) {
    console.error("Error fetching doctorId:", err);
    return null;
  }
};
