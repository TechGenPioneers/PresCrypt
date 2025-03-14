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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const locations = [
  "Piliyandala",
  "Colombo",
  "Kandy",
  "Remote Appointment",
  "Galle",
  "Negombo",
  "Kurunegala",
  "Jaffna",
];

const LocationDialog = ({ open, handleClose, onSelect }) => {
  const [search, setSearch] = useState("");

  const filteredLocations = locations.filter((loc) =>
    loc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b">
        <DialogTitle className="text-xl font-semibold">
          Select Location
        </DialogTitle>
        <IconButton onClick={handleClose} className="text-gray-500">
          <CloseIcon />
        </IconButton>
      </div>

      {/* Search Bar (Full Width) */}
      <DialogContent className="min-h-[300px] flex flex-col">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search location..."
          className="mb-4"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Location List (Fixed Height) */}
        <div className="flex-grow overflow-y-auto">
          <List>
            {filteredLocations.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No results found</p>
            ) : (
              filteredLocations.map((location, index) => (
                <ListItemButton
                  key={index}
                  onClick={() => onSelect(location)}
                  className="hover:bg-gray-100 rounded-md"
                >
                  <ListItemText primary={location} />
                </ListItemButton>
              ))
            )}
          </List>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LocationDialog;
