import { useState } from "react";
import RequestReportDialog from "./RequestReportDialog"; // New component

const AppointmentListStat = ({ patientName, age, location, imageUrl, total, accepted, cancelled, patientId, email }) => {
  const [reportDialogOpen, setReportDialogOpen] = useState(false);

  const handleOpenReport = () => setReportDialogOpen(true);
  const handleCloseReport = () => setReportDialogOpen(false);
  

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-[#004d40] mb-4">Health Records History</h2>

      <div className="flex flex-col md:flex-row justify-between items-center bg-white rounded-lg shadow-md p-5 mb-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <img src={imageUrl} alt="Profile" className="w-20 h-20 rounded-full object-cover border border-gray-300" />
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{patientName}</h3>
            <p className="text-gray-500">{age} years old</p>
            <p className="text-gray-500">{location}</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-wrap gap-4 mt-4 md:mt-0 items-center">
          <button
            onClick={handleOpenReport}
            className="bg-[#00796B] text-white px-4 py-2 rounded-md shadow-sm text-sm font-semibold"
          >
            Download Report
          </button>
          <div className="bg-blue-50 text-blue-800 px-4 py-2 rounded-md shadow-sm text-sm font-medium">
            Total Appointments: <span className="font-bold">{total}</span>
          </div>
          <div className="bg-green-50 text-green-800 px-4 py-2 rounded-md shadow-sm text-sm font-medium">
            Completed Appointments: <span className="font-bold">{accepted}</span>
          </div>
          <div className="bg-red-50 text-red-800 px-4 py-2 rounded-md shadow-sm text-sm font-medium">
            Cancelled Appointments: <span className="font-bold">{cancelled}</span>
          </div>
          
        </div>
      </div>

      {/* Dialog Component */}
      <RequestReportDialog open={reportDialogOpen} handleClose={handleCloseReport} patientId={patientId} email={email} />
    </div>
  );
};

export default AppointmentListStat;
