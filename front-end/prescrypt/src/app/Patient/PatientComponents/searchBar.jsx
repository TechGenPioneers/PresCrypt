import { useState, useEffect } from "react";
import { CircularProgress, Fade } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import SpecializationDialog from "./specializationBox";
import LocationDialog from "./locationSelectBox";
import DoctorNameDialog from "./doctorNameDialog";
import AlertBoxDialog from "./alertDialogBox";
import { findDoctors } from "../services/AppointmentsFindingService";

const SearchBar = ({ setDoctors }) => {
  const [specializationOpen, setSpecializationOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [doctorNameOpen, setDoctorNameOpen] = useState(false);

  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedName, setSelectedName] = useState("");

  const [loading, setLoading] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const isNameSearchActive = selectedName.trim().length > 0;
  const isCategorySearchActive =
    selectedSpecialization.trim().length > 0 || selectedLocation.trim().length > 0;

  const handleFindDoctor = async () => {
  const patientStatus = localStorage.getItem("status"); 
  if (patientStatus === "Inactive") {
    setAlertMessage("You Status has been marked as Inactive. Please contact us for more assistance.");
    setAlertOpen(true);
    return;
  }

  if (!selectedName && (!selectedSpecialization || !selectedLocation)) {
    setAlertMessage("Please select a specialization and location or a doctor to make an appointment.");
    setAlertOpen(true);
    return;
  }

  setLoading(true);
  try {
    const doctorsData = await findDoctors({
      specialization: selectedSpecialization,
      hospitalName: selectedLocation,
      name: selectedName,
    });

    setDoctors(doctorsData);
    console.log("Doctors found:", doctorsData);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    setAlertMessage("Failed to fetch doctor details. Please try again.");
    setAlertOpen(true);
  } finally {
    setLoading(false);
  }
};


  
  useEffect(() => {
    localStorage.removeItem("selectedSpecialization");
    localStorage.removeItem("selectedLocation");
    localStorage.removeItem("selectedName");

    setSelectedSpecialization("");
    setSelectedLocation("");
    setSelectedName("");
  }, []);

  useEffect(() => {
    if (selectedSpecialization) localStorage.setItem("selectedSpecialization", selectedSpecialization);
  }, [selectedSpecialization]);

  useEffect(() => {
    if (selectedLocation) localStorage.setItem("selectedLocation", selectedLocation);
  }, [selectedLocation]);

  useEffect(() => {
    if (selectedName) localStorage.setItem("selectedName", selectedName);
  }, [selectedName]);

  return (
    <div className="bg-[#E8F4F2] p-6 rounded-md">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">
        Search for available appointments
      </h2>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left column */}
        <div className="flex flex-col gap-4 w-full md:w-1/2">
          {/* Specialization */}
          <button
            className={`w-full p-4 text-md border rounded-md text-gray-700 shadow-sm text-left ${
              isNameSearchActive
                ? "bg-gray-200 border-gray-300 cursor-not-allowed"
                : "bg-white border-green-700"
            }`}
            onClick={() => !isNameSearchActive && setSpecializationOpen(true)}
            disabled={isNameSearchActive}
          >
            <span className="text-gray-400 text-sm">Specialization / Category</span>
            <br />
            <span className="font-medium text-green-700 flex items-center justify-between">
              {selectedSpecialization || "Find Your Category"}
              {selectedSpecialization && !isNameSearchActive && (
                <CloseIcon
                  fontSize="small"
                  className="cursor-pointer ml-2 text-gray-400 hover:text-gray-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSpecialization("");
                  }}
                />
              )}
            </span>
          </button>

          {/* Doctor Name selection via dialog with smooth transition */}
          <Fade in={showNameInput} timeout={400}>
            <div>
              <button
                className={`w-full p-4 text-md border rounded-md text-gray-700 shadow-sm text-left ${
                  isCategorySearchActive
                    ? "bg-gray-200 border-gray-300 cursor-not-allowed"
                    : "bg-white border-green-700"
                }`}
                onClick={() => !isCategorySearchActive && setDoctorNameOpen(true)}
                disabled={isCategorySearchActive}
              >
                <span className="text-gray-400 text-sm">Doctor Name</span>
                <br />
                <span className="font-medium text-green-700 flex items-center justify-between">
                  {selectedName || "Select Doctor Name"}
                  {selectedName && !isCategorySearchActive && (
                    <CloseIcon
                      fontSize="small"
                      className="cursor-pointer ml-2 text-gray-400 hover:text-gray-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedName("");
                      }}
                    />
                  )}
                </span>
              </button>
            </div>
          </Fade>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4 w-full md:w-1/2">
          {/* Location */}
          <button
            className={`w-full p-4 text-md border rounded-md text-gray-700 shadow-sm text-left ${
              isNameSearchActive
                ? "bg-gray-200 border-gray-300 cursor-not-allowed"
                : "bg-white border-green-700"
            }`}
            onClick={() => !isNameSearchActive && setLocationOpen(true)}
            disabled={isNameSearchActive}
          >
            <span className="text-gray-400 text-sm">Location or remote appointment</span>
            <br />
            <span className="font-medium text-green-700 flex items-center justify-between">
              {selectedLocation || "Find Your Location"}
              {selectedLocation && !isNameSearchActive && (
                <CloseIcon
                  fontSize="small"
                  className="cursor-pointer ml-2 text-gray-400 hover:text-gray-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedLocation("");
                  }}
                />
              )}
            </span>
          </button>

          {/* Buttons positioned below location */}
          <div className="flex gap-4 justify-end">
            <button
              className="px-6 py-3 border border-gray-300 rounded-md text-white bg-red-600 hover:bg-gray-500 shadow-sm"
              onClick={() => setShowNameInput(!showNameInput)}
            >
              More Options
            </button>

            <button
              className="px-6 py-3 border border-gray-300 rounded-md text-white bg-teal-600 hover:bg-teal-700 shadow-sm flex justify-center items-center relative min-w-[160px]"
              onClick={handleFindDoctor}
              disabled={loading}
            >
              {loading && (
                <CircularProgress
                  size={24}
                  thickness={4}
                  color="inherit"
                  className="absolute left-4"
                />
              )}
              Find My Doctor
            </button>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <SpecializationDialog
        open={specializationOpen}
        handleClose={() => setSpecializationOpen(false)}
        onSelect={(val) => {
          setSelectedSpecialization(val);
          setSpecializationOpen(false);
        }}
      />

      <LocationDialog
        open={locationOpen}
        handleClose={() => setLocationOpen(false)}
        onSelect={(val) => {
          setSelectedLocation(val);
          setLocationOpen(false);
        }}
      />

      <DoctorNameDialog
        open={doctorNameOpen}
        handleClose={() => setDoctorNameOpen(false)}
        onSelect={(val) => {
          setSelectedName(val);
          setDoctorNameOpen(false);
        }}
        TransitionComponent={Fade}
        transitionDuration={300}
      />
      <AlertBoxDialog
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
        message={alertMessage}
       />
    </div>
  );
};

export default SearchBar;