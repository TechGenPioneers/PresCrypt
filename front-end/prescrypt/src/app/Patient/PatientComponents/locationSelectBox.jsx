"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import axios from "axios";

const LocationDialog = ({ open, handleClose, onSelect }) => {
  const [search, setSearch] = useState("");
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    if (open) {
      const fetchHospitals = async () => {
        try {
          const response = await axios.get("https://localhost:7021/api/Hospital/locations"); // Replace with actual URL if different
          const data = response.data;
          const formatted = Object.entries(data).map(([city, hospitals]) => ({
            district: city,
            hospitals,
          }));
          setLocations(formatted);
        } catch (error) {
          console.error("Error fetching hospital data", error);
        }
      };

      fetchHospitals();
    }
  }, [open]);

  const filteredLocations = locations
    .map(({ district, hospitals }) => {
      const districtMatch = district.toLowerCase().includes(search.toLowerCase());
      const filteredHospitals = hospitals.filter(h =>
        h.toLowerCase().includes(search.toLowerCase())
      );

      return {
        district,
        hospitals: districtMatch ? hospitals : filteredHospitals,
      };
    })
    .filter(({ hospitals }) => hospitals.length > 0);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      sx={{
        "& .MuiDialog-paper": {
          border: "2px solid #4CAF50",
          borderRadius: "30px",
        },
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center px-5 py-3 border-b border-gray-300">
        <IconButton onClick={handleClose} className="text-gray-500">
          <CloseIcon />
        </IconButton>
      </div>

      <DialogContent className="min-h-[300px] flex flex-col">
        {/* Search */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search for location or clinic..."
          className="mb-4 rounded-md border"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Title */}
        <Typography
          variant="subtitle2"
          className="text-green-800 font-semibold mb-6"
        >
          Available Locations
        </Typography>

        {/* Hospital List */}
        <div className="flex-grow overflow-y-auto">
          <List>
            {filteredLocations.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No results found
              </p>
            ) : (
              filteredLocations.map(({ district, hospitals }, index) => (
                <div key={index} className="mb-5">
                  {/* City/District Heading */}
                  <Typography
                    variant="h6"
                    className="font-semibold text-gray-700 mb-2 pl-3"
                  >
                    {district.toUpperCase()}
                  </Typography>

                  {/* Hospitals under city */}
                  {hospitals.map((hospital, i) => (
                    <ListItemButton
                      key={i}
                      onClick={() => onSelect(hospital)}
                      className="flex items-center space-x-3 border rounded-[20px] border-green-700 px-6 py-4 mb-2 shadow-sm hover:bg-gray-100"
                    >
                      <LocationOnIcon className="text-green-500 text-xl" />
                      <ListItemText
                        primary={hospital}
                        className="font-medium"
                      />
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
