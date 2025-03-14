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

const specializations = [
  "General Practitioner",
  "Dental Care",
  "Orthopedics",
  "Cancer Diseases",
  "Gynaecologist",
  "Psychotherapy",
  "Injury Care",
  "All Dermatologists",
];

const SpecializationDialog = ({ open, handleClose, onSelect }) => {
  const [search, setSearch] = useState("");

  const filteredSpecializations = specializations.filter((spec) =>
    spec.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b">
        <DialogTitle className="text-xl font-semibold">Select Specialization</DialogTitle>
        <IconButton onClick={handleClose} className="text-gray-500">
          <CloseIcon />
        </IconButton>
      </div>

      {/* Search Bar (Full Width) */}
      <DialogContent>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search specialization..."
          className="mb-4"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Specialization List */}
        <List>
          {filteredSpecializations.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No results found</p>
          ) : (
            filteredSpecializations.map((specialization, index) => (
              <ListItemButton
                key={index}
                onClick={() => onSelect(specialization)}
                className="hover:bg-gray-100 rounded-md"
              >
                <ListItemText primary={specialization} />
              </ListItemButton>
            ))
          )}
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default SpecializationDialog;
