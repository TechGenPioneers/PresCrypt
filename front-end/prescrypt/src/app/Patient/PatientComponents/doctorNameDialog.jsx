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
import { fetchDoctorNames } from "../services/AppointmentsFindingService"; 
import { FaUserMd } from "react-icons/fa"; // optional icon for doctors

const DoctorNameDialog = ({ open, handleClose, onSelect }) => {
  const [search, setSearch] = useState("");
  const [doctorNames, setDoctorNames] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    const getData = async () => {
      try {
        const data = await fetchDoctorNames();
        setDoctorNames(data);
      } catch (err) {
        setError("Unable to load doctors.");
      }
    };

    getData();
  }, [open]);

  const filteredDoctors = doctorNames.filter((doc) =>
    doc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      sx={{ "& .MuiDialog-paper": { border: "2px solid #4CAF50", borderRadius: "30px" } }}
    >
      {/* Header with close icon */}
      <div className="flex justify-between items-center px-5 py-3 border-b border-gray-300">
        <IconButton onClick={handleClose} className="text-gray-500">
          <CloseIcon />
        </IconButton>
      </div>

      <DialogContent>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by doctor name"
          className="mb-4 rounded-md border"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {filteredDoctors.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No doctors found</p>
        ) : (
          <List className="flex flex-col gap-3">
            {filteredDoctors.map((name, index) => (
              <ListItemButton
                key={index}
                onClick={() => onSelect(name)}
                className="flex items-center p-4 shadow-sm hover:bg-gray-100"
                sx={{
                  border: "1px solid #4CAF50",
                  borderRadius: "10px",
                }}
              >
                <div className="flex items-center space-x-3 flex-1">
                  <div className="text-blue-500 text-xl"><FaUserMd /></div>
                  <ListItemText primary={name} className="font-medium" />
                </div>
              </ListItemButton>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DoctorNameDialog;
