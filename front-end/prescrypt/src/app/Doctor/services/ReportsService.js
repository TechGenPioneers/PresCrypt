import axiosInstance from "../utils/axiosInstance";
import { format } from "date-fns";

const ReportsService = {
  async generateReport({ fromDate, toDate, patientId, reportType, doctorId }) {
    const formatDate = (date) => (date ? format(date, "yyyy-MM-dd") : null);

    const response = await axiosInstance.post(
      "/DoctorReport/generate-reports",
      {
        from: formatDate(fromDate),
        to: formatDate(toDate),
        patient: patientId,
        reportType,
        doctorId,
      },
      {
        responseType: "blob",
      }
    );

    return response;
  },
};

export default ReportsService;
