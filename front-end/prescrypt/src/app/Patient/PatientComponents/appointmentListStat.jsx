const AppointmentListStat = ({ patientName, age, location, imageUrl, total, accepted, cancelled }) => {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-[#004d40] mb-4">Health Records History</h2>

      <div className="flex flex-col md:flex-row justify-between items-center bg-white rounded-lg shadow-md p-5 mb-4">
        {/* Left Section: Profile */}
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

        {/* Right Section: Appointment Stats */}
        <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
          <div className="bg-blue-50 text-blue-800 px-4 py-2 rounded-md shadow-sm text-sm font-medium">
            Total Appointments: <span className="font-bold">{total}</span>
          </div>
          <div className="bg-green-50 text-green-800 px-4 py-2 rounded-md shadow-sm text-sm font-medium">
            Accepted Appointments: <span className="font-bold">{accepted}</span>
          </div>
          <div className="bg-red-50 text-red-800 px-4 py-2 rounded-md shadow-sm text-sm font-medium">
            Cancelled Appointments: <span className="font-bold">{cancelled}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentListStat;
