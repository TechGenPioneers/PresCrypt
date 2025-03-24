"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItemButton,
  ListItemText,
  TextField,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const locations = [
  { district: "Battaramulla", hospitals: ["Nawaloka Hospital", "Kingsbury Hospital"] },
  { district: "Maharagama", hospitals: ["Asia Hospital"] },
  { district: "Colombo", hospitals: ["Durdans Hospital", "Asiri Surgical Hospital", "Asiri General Hospital"] },
  { district: "Thalawathugoda", hospitals: ["Hemas Hospital"] },
  { district: "Athurugiriya", hospitals: ["Hemas Hospital"] },
];

const LocationDialog = ({ open, handleClose, onSelect }) => {
  const [search, setSearch] = useState("");

  const filteredLocations = locations
    .map(({ district, hospitals }) => {
      const districtMatch = district.toLowerCase().includes(search.toLowerCase());
      const filteredHospitals = hospitals.filter((hospital) =>
        hospital.toLowerCase().includes(search.toLowerCase())
      );

      return {
        district,
        hospitals: districtMatch ? hospitals : filteredHospitals,
      };
    })
    .filter(({ hospitals }) => hospitals.length > 0);

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" sx={{ "& .MuiDialog-paper": { border: "2px solid #4CAF50", borderRadius: "30px" } }} >
      {/* Header */}
      <div className="flex justify-between items-center px-5 py-3 border-b border-gray-300">
        <IconButton onClick={handleClose} className="text-gray-500">
          <CloseIcon />
        </IconButton>
      </div>

      {/* Search Bar */}
      <DialogContent className="min-h-[300px] flex flex-col">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search for location or clinic..."
          className="mb-4 rounded-md border"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Title */}
        <div>
          <h6 className="text-xs font-semibold relative top-4 mb-6 text-green-800">
            Available Locations
          </h6>
        </div>

        {/* Locations List */}
        <div className="flex-grow overflow-y-auto">
          <List>
            {filteredLocations.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No results found</p>
            ) : (
              filteredLocations.map(({ district, hospitals }, index) => (
                <div key={index} className="mb-5">
                  {/* District Name */}
                  <Typography variant="h6" className="font-semibold text-gray-700 mb-2 pl-3">
                    {district.toUpperCase()}
                  </Typography>

                  {/* Hospitals List */}
                  {hospitals.map((hospital, i) => (
                    <ListItemButton
                      key={i}
                      onClick={() => onSelect(hospital)}
                      className="flex items-center space-x-3 border rounded-[20px] border-green-700 px-6 py-4 mb-2 shadow-sm hover:bg-gray-100"
                    >
                      <LocationOnIcon className="text-green-500 text-xl" />
                      <ListItemText primary={hospital} className="font-medium" />
                    </ListItemButton>
                  ))}
                </div>
              ))
            )}
          </List>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LocationDialog;
