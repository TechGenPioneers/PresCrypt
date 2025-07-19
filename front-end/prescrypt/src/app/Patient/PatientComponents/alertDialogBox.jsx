"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

const AlertDialogBox = ({ open, onClose, message }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "40px",
          padding: "40px 20px",
          border: "2px solid #047857",
          backgroundColor: "#fffdfd",
          boxShadow: "0px 6px 30px rgba(0, 0, 0, 0.15)",
        },
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{ position: "absolute", top: 16, right: 16, color: "#047857" }}
      >
        <CloseIcon fontSize="large" />
      </IconButton>

      <DialogContent className="flex flex-col items-center text-center">
        <WarningAmberOutlinedIcon sx={{ fontSize: 80, color: "#047857" }} />
        <Typography
          variant="h6"
          sx={{ mt: 2, fontWeight: "bold", color: "#047857" }}
        >
          Alert
        </Typography>
        <Typography
          variant="body1"
          sx={{ mt: 1, color: "#555", maxWidth: "480px", fontWeight: "bold" }}
        >
          {message}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", mt: 2 }}>
        <Button
            onClick={onClose}
            variant="contained"
            sx={{
                backgroundColor: "#2e7d32",
                color: "#fff",
                "&:hover": { backgroundColor: "#1b5e20" },
                borderRadius: "999px", // fully rounded
                px: 5,
                py: 1.5,
                fontWeight: "bold",
                fontSize: "1rem",
                textTransform: "none",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            }}
            >
            Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertDialogBox;
