"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  List,
  ListItemButton,
  ListItemText,
  TextField,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { FaUserMd, FaTooth, FaBone, FaRibbon, FaVenus, FaBrain, FaAmbulance, FaHeartbeat, FaChild, FaLungs, FaEye, FaUserNurse , FaChevronRight} from "react-icons/fa";

const specializations = [
  { name: "General Practitioner", icon: <FaUserMd /> },
  { name: "Dental Care", icon: <FaTooth /> },
  { name: "Orthopedics", icon: <FaBone /> },
  { name: "Cancer Diseases", icon: <FaRibbon /> },
  { name: "Gynaecology", icon: <FaVenus /> },
  { name: "Psychotherapy", icon: <FaBrain /> },
  { name: "Injury Care", icon: <FaAmbulance /> },
  { name: "Cardiology", icon: <FaHeartbeat /> },
  { name: "Pediatrics", icon: <FaChild /> },
  { name: "Pulmonology", icon: <FaLungs /> },
  { name: "Ophthalmology", icon: <FaEye /> },
  { name: "Neurology", icon: <FaBrain /> },
  {name: "Psychiatry", icon: <FaBrain />},
  { name: "All Dermatologists", icon: <FaUserNurse /> },
];

const SpecializationDialog = ({ open, handleClose, onSelect }) => {
  const [search, setSearch] = useState("");

  const filteredSpecializations = specializations.filter((spec) =>
    spec.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" sx={{ "& .MuiDialog-paper": { border: "2px solid #4CAF50", borderRadius: "30px" } }}>
      {/* Header */}
      <div className="flex justify-between items-center px-5 py-3 border-b border-gray-300">
        <IconButton onClick={handleClose} className="text-gray-500">
          <CloseIcon />
        </IconButton>
      </div>

      {/* Search Bar */}
      <DialogContent>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search for service or specialist"
          className="mb-4 rounded-md border"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Specialization List */}
        <div>
          <h6 className="text-xs font-semibold relative top-4 mb-6 text-green-800">
            Most Popular Specialities and Services
          </h6>
        </div>
        <List className="space-y-3"> {/* Added space-y-2 for vertical spacing between items */}
          {filteredSpecializations.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No results found</p>
          ) : (
            filteredSpecializations.map((spec, index) => (
              <ListItemButton
                key={index}
                onClick={() => onSelect(spec.name)}
                className="flex items-center space-x-4 p-4 mb-4 shadow-sm hover:bg-gray-100 space-y-3"
                sx={{
                  border: "1px solid #4CAF50",  // Green border
                  borderRadius: "10px",         // Rounded corners
                }}
              >
                {/* Left side: Icon + Text */}
                <div className="flex items-center space-x-3">
                  <div className="text-blue-500 text-xl">{spec.icon}</div>
                  <ListItemText primary={spec.name} className="font-medium" />
                </div>

                {/* Right side: Chevron Arrow */}
                <FaChevronRight className="text-gray-500 text-lg ml-auto" /> {/* ml-auto aligns the arrow to the right */}
              </ListItemButton>
            ))
          )}
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default SpecializationDialog;
