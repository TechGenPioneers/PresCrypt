import { useState, useEffect } from "react";
import axios from "axios";
import SpecializationDialog from "./specializationBox";
import LocationDialog from "./locationSelectBox.jsx";
import { CircularProgress } from "@mui/material"; // Import MUI CircularProgress

const SearchBar = ({ setDoctors }) => {
  const [specializationOpen, setSpecializationOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [hospitalCharge, setHospitalCharge] = useState(""); // State to hold hospital charge

  // This function is triggered when the "Find my Doctor" button is clicked
  const handleFindDoctor = async () => {
    if (!selectedSpecialization || !selectedLocation) {
      alert("Please select both specialization and location.");
      return;
    }

    setLoading(true); // Show loading spinner when fetching data

    try {
      const response = await axios.get("https://localhost:7021/api/Doctor/search", {
        params: {
          specialization: selectedSpecialization,
          hospitalName: selectedLocation,
        },
      });

      console.log("Fetched doctors:", response.data); // Debugging: Check the response data
      setDoctors(response.data); // Pass the fetched doctor data to the parent component's setDoctors

      // Check if response.data has at least one doctor
      if (response.data && response.data.length > 0) {
        // Set hospital charge from the first doctor in the response data
        setHospitalCharge(response.data[0].charge);
        localStorage.setItem("hospitalCharge", response.data[0].charge); // Store in localStorage
      }

      
    } catch (error) {
      console.error("Error fetching doctors:", error);
      alert("Failed to fetch doctor details. Please try again.");
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  // Clear localStorage and reset selected specialization and location on page refresh
  useEffect(() => {
    localStorage.removeItem("selectedSpecialization");
    localStorage.removeItem("selectedLocation");

    setSelectedSpecialization("");
    setSelectedLocation("");
  }, []); // Empty dependency array to run only once when component mounts

  // Save selected specialization and location to localStorage when they change
  useEffect(() => {
    if (selectedSpecialization) {
      localStorage.setItem("selectedSpecialization", selectedSpecialization);
    }
  }, [selectedSpecialization]);

  useEffect(() => {
    if (selectedLocation) {
      localStorage.setItem("selectedLocation", selectedLocation);
    }
  }, [selectedLocation]);

  useEffect(() => {
    if (hospitalCharge) {
      localStorage.setItem("hospitalCharge", hospitalCharge);
    }
  }, [hospitalCharge]);

  return (
    <div className="bg-[#E8F4F2] p-6 rounded-md">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">Search for available appointments</h2>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex flex-col gap-4">
          <button
            className="p-4 text-md border border-green-700 rounded-md text-gray-700 bg-white shadow-sm text-left"
            onClick={() => setSpecializationOpen(true)}
          >
            <span className="text-gray-400 text-sm">Specialization / Category</span>
            <br />
            <span className="font-medium text-green-700">{selectedSpecialization || "Find Your Category"}</span>
          </button>
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <button
            className="p-4 text-md border border-green-700 rounded-md text-gray-700 bg-white shadow-sm text-left"
            onClick={() => setLocationOpen(true)}
          >
            <span className="text-gray-400 text-sm">Location or remote appointment</span>
            <br />
            <span className="font-medium text-green-700">{selectedLocation || "Find Your Location"}</span>
          </button>
          <button
            className="self-end w-1/2 p-3 border border-gray-300 rounded-md text-white bg-green-700 shadow-sm hover:bg-green-600 flex justify-center items-center"
            onClick={handleFindDoctor}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Find my Doctor"}
          </button>
        </div>
      </div>

      <SpecializationDialog
        open={specializationOpen}
        handleClose={() => setSpecializationOpen(false)}
        onSelect={(spec) => {
          setSelectedSpecialization(spec); // Update state
          setSpecializationOpen(false);
        }}
      />

      <LocationDialog
        open={locationOpen}
        handleClose={() => setLocationOpen(false)}
        onSelect={(loc) => {
          setSelectedLocation(loc); // Update state
          setLocationOpen(false);
        }}
      />
    </div>
  );
};

export default SearchBar;
