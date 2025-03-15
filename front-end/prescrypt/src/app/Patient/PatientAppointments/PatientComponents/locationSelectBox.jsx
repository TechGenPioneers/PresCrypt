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

const locations = [
  { district: "Battaramulla", hospitals: ["Nawaloka Hospital", "Santa Dora Hospital"] },
  { district: "Maharagama", hospitals: ["Asia Hospital"] },
  { district: "Colombo", hospitals: ["National Hospital of Sri Lanka", "Durdans Hospital", "Asiri Surgical Hospital"] },
  { district: "Thalawathugoda", hospitals: ["Hemas Hospital"] },
  { district: "Athurugiriya", hospitals: ["Hemas Hospital"] },
];

const LocationDialog = ({ open, handleClose, onSelect }) => {
  const [search, setSearch] = useState("");

  const filteredLocations = locations
    .map(({ district, hospitals }) => {
      // Check if district matches the search query
      const districtMatch = district.toLowerCase().includes(search.toLowerCase());
      // Check if any hospital matches the search query
      const filteredHospitals = hospitals.filter(hospital =>
        hospital.toLowerCase().includes(search.toLowerCase())
      );

      // If district matches, include all hospitals; otherwise, show only filtered ones
      return {
        district,
        hospitals: districtMatch ? hospitals : filteredHospitals,
      };
    })
    // Remove districts that have no matching hospitals or district name match
    .filter(({ hospitals }) => hospitals.length > 0);

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b">
        <DialogTitle className="text-xl font-semibold text-green-700">Select Location</DialogTitle>
        <IconButton onClick={handleClose} className="text-green-700">
          <CloseIcon />
        </IconButton>
      </div>

      {/* Search Bar */}
      <DialogContent className="min-h-[300px] flex flex-col">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search for location or clinic..."
          className="mb-4"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Locations List */}
        <div className="flex-grow overflow-y-auto">
          <List>
            {filteredLocations.length === 0 ? (
              <p className="text-green-700 text-center py-4">No results found</p>
            ) : (
              filteredLocations.map(({ district, hospitals }, index) => (
                <div key={index} className="mb-3">
                  {/* District Name */}
                  <Typography variant="h6" className="font-semibold text-gray-700">
                    {district.toUpperCase()}
                  </Typography>
                  {/* Hospitals List */}
                  {hospitals.map((hospital, i) => (
                    <ListItemButton
                      key={i}
                      onClick={() => onSelect(hospital)}
                      className="hover:bg-gray-100 rounded-md"
                    >
                      <ListItemText primary={hospital} />
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
