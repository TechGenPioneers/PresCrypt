import axios from "axios";
import useAuthGuard from "@/utils/useAuthGuard";

const ReportUrl = "https://localhost:7021/api/AdminReport";

const GetAllDetails = async () => {
  useAuthGuard("Admin"); // Ensure the user is authenticated as an Admin
  //get the all doctors patients and specialty Details
  try {
    const response = await axios.get(`${ReportUrl}/GetAll`);
    return response.data;
  } catch (error) {
    console.error("Failed to get the data", error);
    throw error;
  }
};

//get filter data
const GetReportDetails = async (reportDetails) => {
  try {
    const response = await axios.post(ReportUrl, reportDetails);
    console.log("Report Details Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to get the data", error);
    throw error;
  }
};

export { GetAllDetails, GetReportDetails };
