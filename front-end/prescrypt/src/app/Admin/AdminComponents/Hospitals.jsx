"use client";
import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import {
  AddNewHospital,
  DeleteHospital,
  GetAllHospitals,
  UpdateHospital,
} from "../service/AdminHospitals";
import {
  X,
  Building2,
  Phone,
  DollarSign,
  MapPin,
  Building,
  Trash2,
  Plus,
} from "lucide-react";

const Hospitals = () => {
  const [dateTime, setDateTime] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDone, setDone] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [newHospital, setNewHospital] = useState({
    hospitalName: "",
    number: "",
    charge: "",
    address: "",
    city: "",
  });
  const [showAddModal, setShowAddModal] = useState(false);

  // Get all hospitals
  const getHospitals = async () => {
    try {
      const data = await GetAllHospitals();
      setHospitals(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch hospitals", error);
    }
  };

  useEffect(() => {
    const updateDateTime = () => setDateTime(new Date());
    getHospitals();
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 60000); // fallback timeout
    return () => clearTimeout(timer);
  }, []);

  if (!dateTime) return null;

  const formattedDate = dateTime.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const filteredHospitals = hospitals.filter(
    (hospital) =>
      hospital.hospitalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hospital.hospitalId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hospital.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInputChange = (field, value) => {
    setSelectedHospital((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdate = async () => {
    setDone(true);
    // Handle update logic here
    try {
      const response = await UpdateHospital(selectedHospital);
      if (response.status == 204) {
        setIsModalOpen(false);
        selectedHospital(null);
        getHospitals();
      }
    } catch (error) {
      console.error("Failed to update hospitals", error);
    }
    setDone(false);
  };

  const handleDelete = async (hospitalId) => {
    setDone(true);
    try {
      const response = await DeleteHospital(hospitalId);
      if (response.status === 204 || response.status === 200) {
        setIsModalOpen(false);
        setSelectedHospital(null);
        getHospitals(); // refresh list
      }
    } catch (error) {
      console.error("Failed to delete hospital:", error);
    }
    setDone(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleAddHospital = async () => {
    setDone(true);
    try {
      await AddNewHospital(newHospital);
      getHospitals();
      setShowAddModal(false);
      setNewHospital({
        hospitalName: "",
        number: "",
        charge: "",
        address: "",
        city: "",
      });
    } catch (err) {
      console.error("Failed to add hospital:", err);
    }
    setDone(false);
  };

  return (
    <div className="p-6 bg-white border-t-[15px] border-l-[15px] border-r-[15px] border-[#E9FAF2]">
      <h1 className="text-3xl font-bold text-slate-800 mb-1">Hospitals</h1>
      <p className="text-[#09424D] text-sm">{formattedDate}</p>

      {/* Search Input */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-6 mb-4 w-full">
        {/* Search Input */}
        <div className="relative w-full md:w-2/3 mb-3 md:mb-0">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by Hospital ID, Name or City..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 bg-[#F4FAF7] text-sm text-[#094A4D] placeholder:text-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B5D9DB] transition-all"
          />
        </div>

        {/* Add Hospital Button */}
        <div className="ml-10 w-full md:w-1/4 flex items-center gap-4">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-10 py-3 bg-[#A9C9CD] text-[#09424D] rounded-xl text-sm font-medium shadow hover:bg-[#91B4B8] transition-all"
          >
            Add Hospital
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 max-h-[400px] overflow-y-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="sticky top-0 bg-[#B5D9DB] z-5 shadow text-[#094A4D]">
            <tr>
              <th className="p-4 text-left font-semibold">Hospital ID</th>
              <th className="p-4 text-left font-semibold">Name</th>
              <th className="p-4 text-left font-semibold">Address</th>
              <th className="p-4 text-left font-semibold">Contact Number</th>
              <th className="p-4 text-left font-semibold">Charge</th>
              <th className="p-4 text-left font-semibold">City</th>
              <th className="p-4 text-left font-semibold">Action</th>
            </tr>
          </thead>

          {filteredHospitals.length === 0 ? (
            loading ? (
              <tbody>
                <tr>
                  <td colSpan={6}>
                    <div className="flex items-center justify-center h-[300px]">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="w-16 h-16 border-4 border-[#E9FAF2] border-t-[#50d094] rounded-full animate-spin"></div>
                        <p className="text-slate-600 text-lg font-medium">
                          Loading Hospitals...
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td colSpan={6}>
                    <div className="flex items-center justify-center h-[300px]">
                      <p className="text-slate-600 text-lg font-medium">
                        No Hospitals Found.
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
            )
          ) : (
            <tbody>
              {filteredHospitals.map((hospital, index) => (
                <tr
                  key={hospital.hospitalId}
                  className={`transition-all ${
                    index % 2 === 0 ? "bg-[#F7FCFA]" : "bg-white"
                  } hover:bg-[#E9FAF2]`}
                >
                  <td className="p-4 text-[#094A4D] font-medium">
                    {hospital.hospitalId}
                  </td>
                  <td className="p-4 font-semibold text-[#094A4D]">
                    {hospital.hospitalName}
                  </td>
                  <td className="p-4 text-slate-600">{hospital.address}</td>
                  <td className="p-4 text-slate-600">{hospital.number}</td>
                  <td className="p-4 text-slate-600">Rs. {hospital.charge}</td>
                  <td className="p-4 text-slate-600">{hospital.city}</td>
                  <td className="p-4">
                    <button
                      onClick={() => {
                        setSelectedHospital(hospital); // pass the current hospital data
                        setIsModalOpen(true);
                      }}
                      className="px-4 py-2 bg-[#B5D9DB] text-[#094A4D] rounded-lg hover:bg-[#A2C5C7] transition font-medium shadow-sm"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
      {isModalOpen && selectedHospital && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto">
            {/* Header */}

            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#09424D] rounded-xl flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Update Hospital
                  </h2>
                  <p className="text-sm text-gray-500">
                    Modify hospital information
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {confirmDelete ? (
                  <>
                    <button
                      onClick={async () => {
                        await handleDelete(selectedHospital.hospitalId);
                        setConfirmDelete(false);
                      }}
                      className="flex items-center justify-center gap-2 px-3 py-1 text-sm text-white bg-red-600 hover:bg-red-700 rounded-md"
                      disabled={isDone}
                    >
                      {isDone ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Deleting...</span>
                        </>
                      ) : (
                        <span>Confirm Delete</span>
                      )}
                    </button>

                    <button
                      onClick={() => setConfirmDelete(false)}
                      className="px-3 py-1 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 border border-red-00 rounded hover:bg-red-100"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Hospital
                  </button>
                )}

                <button
                  onClick={handleCancel}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-6 space-y-5">
              {/* Hospital ID */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  Hospital ID
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed focus:outline-none"
                  value={selectedHospital.hospitalId}
                  placeholder="Auto-generated ID"
                  readOnly
                />
              </div>

              {/* Hospital Name */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Building className="w-4 h-4 text-gray-400" />
                  Hospital Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#09424D] focus:border-transparent transition-all duration-200 outline-none"
                  value={selectedHospital.hospitalName}
                  onChange={(e) =>
                    handleInputChange("hospitalName", e.target.value)
                  }
                  placeholder="Enter hospital name"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Phone className="w-4 h-4 text-gray-400" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:[#09424D] focus:border-transparent transition-all duration-200 outline-none"
                  value={selectedHospital.number}
                  onChange={(e) => handleInputChange("number", e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>

              {/* Charge */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <p className="w-4 h-4 text-gray-400">Rs.</p>
                  Charge
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#09424D] focus:border-transparent transition-all duration-200 outline-none"
                  value={selectedHospital.charge}
                  onChange={(e) => handleInputChange("charge", e.target.value)}
                  placeholder="Enter charge amount"
                  min="0"
                  step="0.01"
                />
              </div>

              {/* Address */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  Address
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#09424D] focus:border-transparent transition-all duration-200 outline-none"
                  value={selectedHospital.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Enter hospital address"
                />
              </div>

              {/* City */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Building className="w-4 h-4 text-gray-400" />
                  City
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#09424D] focus:border-transparent transition-all duration-200 outline-none"
                  value={selectedHospital.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="Enter city name"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-100">
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={isDone}
                className={`flex-1 px-4 py-3 flex items-center justify-center gap-2  bg-[#A9C9CD] text-[#09424D] hover:bg-[#91B4B8] rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl ${
                  isDone ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isDone ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Updating...</span>
                  </>
                ) : (
                  <span>Update Hospital</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white rounded-t-2xl border-b border-gray-100 p-6 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#09424D] rounded-xl flex items-center justify-center shadow-lg">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Add New Hospital
                    </h2>
                    <p className="text-sm text-gray-500">
                      Create a new hospital record
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 group"
                >
                  <X className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
                </button>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-6 space-y-6">
              {/* Hospital Name */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Building2 className="w-4 h-4 text-[#09424D]" />
                  Hospital Name
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter hospital name"
                  value={newHospital.hospitalName}
                  onChange={(e) =>
                    setNewHospital({
                      ...newHospital,
                      hospitalName: e.target.value,
                    })
                  }
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#09424D] focus:border-transparent transition-all duration-200 outline-none placeholder-gray-400"
                />
              </div>

              {/* Hospital Number */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Phone className="w-4 h-4 text-[#09424D]" />
                  Hospital Number
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={newHospital.number}
                  onChange={(e) =>
                    setNewHospital({ ...newHospital, number: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#09424D] focus:border-transparent transition-all duration-200 outline-none placeholder-gray-400"
                />
              </div>

              {/* Charge */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <p className="w-4 h-4 text-[#09424D]">Rs</p>
                  Charge
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="0.00"
                    value={newHospital.charge}
                    onChange={(e) =>
                      setNewHospital({
                        ...newHospital,
                        charge: parseFloat(e.target.value) || "",
                      })
                    }
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#09424D] focus:border-transparent transition-all duration-200 outline-none placeholder-gray-400"
                    min="0"
                    step="0.01"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                    Rs
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <MapPin className="w-4 h-4 text-[#09424D]" />
                  Address
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter hospital address"
                  value={newHospital.address}
                  onChange={(e) =>
                    setNewHospital({ ...newHospital, address: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#09424D] focus:border-transparent transition-all duration-200 outline-none placeholder-gray-400"
                />
              </div>

              {/* City */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Building className="w-4 h-4 text-[#09424D]" />
                  City
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter city name"
                  value={newHospital.city}
                  onChange={(e) =>
                    setNewHospital({ ...newHospital, city: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#09424D] focus:border-transparent transition-all duration-200 outline-none placeholder-gray-400"
                />
              </div>

              {/* Required Fields Note */}
              <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                <span className="text-red-500">*</span>
                <span>Required fields</span>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white rounded-b-2xl border-t border-gray-100 p-6">
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddHospital}
                  className="flex-1 px-4 py-3 bg-[#A9C9CD] text-[#09424D] hover:bg-[#91B4B8] rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  {isDone ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Adding...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Add Hospital</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hospitals;
