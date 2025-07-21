import { useState } from "react";
import RequestReportDialog from "./RequestReportDialog";
import useAuthGuard from "@/utils/useAuthGuard";

const AppointmentListStat = ({
  patientName,
  age,
  location,
  imageUrl,
  total,
  accepted,
  cancelled,
  rescheduled,
  patientId,
  email,
  onFilterSelect, 
}) => {
  useAuthGuard(["Patient"]);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);

  const handleOpenReport = () => setReportDialogOpen(true);
  const handleCloseReport = () => setReportDialogOpen(false);

  const pending = total - accepted - cancelled;

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-[#004d40] mb-4">Health Records History</h2>

      <div className="flex flex-col md:flex-row justify-between items-center bg-white rounded-lg shadow-md p-5 mb-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <img
            src={imageUrl}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover border border-gray-300"
          />
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{patientName}</h3>
            <p className="text-gray-500">{age} years old</p>
            <p className="text-gray-500">{location}</p>
          </div>
        </div>

        {/* Right Section: Filter Buttons */}
        <div className="flex flex-wrap gap-3 mt-4 md:mt-0 items-center">
          {/* Download Button */}
          <button
            onClick={handleOpenReport}
            className="bg-[#00796B] text-white px-4 py-2 rounded-md shadow-sm text-sm font-semibold"
          >
            Download Report
          </button>

          {/* Status Filter Buttons */}
          <div
            className="cursor-pointer w-24 px-6 py-2 rounded-md bg-blue-100 hover:bg-blue-200 text-center"
            onClick={() => onFilterSelect("all")}
          >
            <p className="text-base font-bold text-blue-700">{total}</p>
            <p className="text-sm text-blue-700">All</p>
          </div>

          <div
            className="cursor-pointer w-24 px-4 py-2 rounded-md bg-green-100 hover:bg-green-200 text-green-700 flex flex-col items-center justify-center"
            onClick={() => onFilterSelect("completed")}
          >
            <p className="text-base font-bold">{accepted}</p>
            <p className="text-sm">Completed</p>
          </div>


          <div
            className="cursor-pointer w-24 px-6 py-2 rounded-md bg-yellow-100 hover:bg-yellow-200 text-center"
            onClick={() => onFilterSelect("pending")}
          >
            <p className="text-base font-bold text-yellow-700">{pending}</p>
            <p className="text-sm text-yellow-700">Pending</p>
          </div>

          <div
            className="cursor-pointer w-24 px-6 py-2 rounded-md bg-red-100 hover:bg-red-200 text-center flex flex-col items-center justify-center"
            onClick={() => onFilterSelect("rescheduled")}
          >
            <p className="text-base font-bold text-red-700">{rescheduled}</p>
            <p className="text-sm text-red-700">Rescheduled</p>
          </div>

          <div
            className="cursor-pointer w-24 px-6 py-2 rounded-md bg-red-100 hover:bg-red-200 text-center flex flex-col items-center justify-center"
            onClick={() => onFilterSelect("cancelled")}
          >
            <p className="text-base font-bold text-red-700">{cancelled}</p>
            <p className="text-sm text-red-700">Cancelled</p>
          </div>
        </div>
      </div>

      {/* Dialog for Report Download */}
      <RequestReportDialog
        open={reportDialogOpen}
        handleClose={handleCloseReport}
        patientId={patientId}
        email={email}
      />
    </div>
  );
};

export default AppointmentListStat;
