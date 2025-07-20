import axios from "axios";
const BASE_URL = "https://localhost:7021/api";

export const sendDoctorContactUs = async (dataload) => {
  return await axios.post(`${BASE_URL}/Patient/ContactUs`, dataload);
};

