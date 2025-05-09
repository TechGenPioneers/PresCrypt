"use client";
import React, { useState, useEffect } from "react";
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
import { FaChevronRight, FaUserMd } from "react-icons/fa";
import { fetchSpecializations } from "../services/AppointmentsFindingService"; 

const SpecializationDialog = ({ open, handleClose, onSelect }) => {
  const [search, setSearch] = useState("");
  const [specializations, setSpecializations] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    const getData = async () => {
      try {
        const data = await fetchSpecializations();
        // Add icon here since we kept it null in the service layer
        setSpecializations(data.map((item) => ({ ...item, icon: <FaUserMd /> })));
      } catch (err) {
        setError("Unable to load specializations.");
      }
    };

    getData();
  }, [open]);

  const filteredSpecializations = specializations.filter((spec) =>
    spec.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      sx={{ "& .MuiDialog-paper": { border: "2px solid #4CAF50", borderRadius: "30px" } }}
    >
      <div className="flex justify-between items-center px-5 py-3 border-b border-gray-300">
        <IconButton onClick={handleClose} className="text-gray-500">
          <CloseIcon />
        </IconButton>
      </div>

      <DialogContent>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search for service or specialist"
          className="mb-4 rounded-md border"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div>
          <h6 className="text-xs font-semibold relative top-4 mb-6 text-green-800">
            Most Popular Specialities and Services
          </h6>
        </div>

        <List className="flex flex-col gap-3">
          {filteredSpecializations.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No results found</p>
          ) : (
            filteredSpecializations.map((spec, index) => (
              <ListItemButton
                key={index}
                onClick={() => onSelect(spec.name)}
                className="flex items-center p-4 shadow-sm hover:bg-gray-100"
                sx={{
                  border: "1px solid #4CAF50",
                  borderRadius: "10px",
                }}
              >
                <div className="flex items-center space-x-3 flex-1">
                  <div className="text-blue-500 text-xl">{spec.icon}</div>
                  <ListItemText primary={spec.name} className="font-medium" />
                </div>
                <FaChevronRight className="text-gray-500 text-lg ml-auto" />
              </ListItemButton>
            ))
          )}
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default SpecializationDialog;
