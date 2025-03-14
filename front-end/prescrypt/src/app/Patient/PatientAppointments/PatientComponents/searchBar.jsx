import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  TextField,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

const specializations = [
  "General Practitioner",
  "Dental Care",
  "Orthopedics",
  "Cancer Diseases",
  "Gynaecologist",
  "Psychotherapy",
  "Injury Care",
  "All Dermatologist",
];

const locations = ["Piliyandala", "Colombo", "Kandy", "Remote Appointment"];

const SearchBar = () => {
  const [openSpecialization, setOpenSpecialization] = useState(false);
  const [openLocation, setOpenLocation] = useState(false);
  const [searchSpecialization, setSearchSpecialization] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  return (
    <div className="mb-6 bg-green-50 w-full px-8 sm:px-6 lg:px-10">
      <h2 className="text-2xl mb-4">Search for available appointments</h2>
      <div className="flex gap-4 mb-4 items-center">
        {/* Specialization Selection */}
        <div className="flex-1">
          <button
            className="w-full p-3 text-lg border border-gray-300 rounded-md text-gray-500 bg-white"
            onClick={() => setOpenSpecialization(true)}
          >
            {selectedSpecialization || "Select Specialization/Category"}
          </button>
        </div>

        {/* Location Selection */}
        <div className="flex-1">
          <button
            className="w-full p-3 text-lg border border-gray-300 rounded-md text-gray-500 bg-white"
            onClick={() => setOpenLocation(true)}
          >
            {selectedLocation || "Select Location"}
          </button>
        </div>

        {/* Buttons */}
        <button className="border border-gray-400 text-gray-700 py-3 px-6 rounded-md">
          More options
        </button>
        <button className="border border-gray-400 text-gray-700 py-3 px-6 rounded-md">
          Calendar
        </button>
      </div>

      {/* Specialization Selection Dialog */}
      <Dialog open={openSpecialization} onClose={() => setOpenSpecialization(false)}>
        <DialogTitle>
          Select Specialization
          <IconButton
            aria-label="close"
            onClick={() => setOpenSpecialization(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            placeholder="Search specialization..."
            value={searchSpecialization}
            onChange={(e) => setSearchSpecialization(e.target.value)}
            sx={{ mb: 2 }}
          />
          <List>
            {specializations
              .filter((spec) =>
                spec.toLowerCase().includes(searchSpecialization.toLowerCase())
              )
              .map((spec, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemButton
                    onClick={() => {
                      setSelectedSpecialization(spec);
                      setOpenSpecialization(false);
                    }}
                  >
                    <ListItemText primary={spec} />
                  </ListItemButton>
                </ListItem>
              ))}
          </List>
        </DialogContent>
      </Dialog>

      {/* Location Selection Dialog */}
      <Dialog open={openLocation} onClose={() => setOpenLocation(false)}>
        <DialogTitle>
          Select Location
          <IconButton
            aria-label="close"
            onClick={() => setOpenLocation(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            placeholder="Search location..."
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            sx={{ mb: 2 }}
          />
          <List>
            {locations
              .filter((loc) =>
                loc.toLowerCase().includes(searchLocation.toLowerCase())
              )
              .map((loc, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemButton
                    onClick={() => {
                      setSelectedLocation(loc);
                      setOpenLocation(false);
                    }}
                  >
                    <ListItemText primary={loc} />
                  </ListItemButton>
                </ListItem>
              ))}
          </List>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SearchBar;
