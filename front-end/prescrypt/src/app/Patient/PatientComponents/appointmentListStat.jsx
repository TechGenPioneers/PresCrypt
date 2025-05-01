const AppointmentListStat = ({ patientName, age, location, total, accepted, cancelled }) => {
    return (
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-primary">Medical History</h2>
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <h3 className="text-lg font-bold">{patientName}</h3>
          <p className="text-gray-600">{age} years old</p>
          <p className="text-gray-600">{location}</p>
        </div>
  
        <div className="flex gap-4 flex-wrap">
          <div className="bg-blue-100 text-blue-900 px-4 py-2 rounded-md shadow-sm">
            Total No. of Appointments: <span className="font-semibold">{total}</span>
          </div>
          <div className="bg-green-100 text-green-900 px-4 py-2 rounded-md shadow-sm">
            Accepted Appointments: <span className="font-semibold">{accepted}</span>
          </div>
          <div className="bg-red-100 text-red-900 px-4 py-2 rounded-md shadow-sm">
            Cancelled Appointments: <span className="font-semibold">{cancelled}</span>
          </div>
        </div>
      </div>
    );
  };
  
  export default AppointmentListStat;
  