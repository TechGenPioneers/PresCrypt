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
      maxWidth="xs"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "24px",
          padding: "24px 20px 20px 20px",
          border: "2px solid #047857",
          backgroundColor: "#fffdfd",
          boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.12)",
          margin: "16px",
          minWidth: "320px",
          maxWidth: "400px",
        },
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{ 
          position: "absolute", 
          top: 12, 
          right: 12, 
          color: "#047857",
          padding: "4px",
          "&:hover": { backgroundColor: "rgba(4, 120, 87, 0.08)" }
        }}
      >
        <CloseIcon fontSize="medium" />
      </IconButton>

      <DialogContent 
        className="flex flex-col items-center text-center"
        sx={{ padding: "8px 16px 16px 16px" }}
      >
        <WarningAmberOutlinedIcon sx={{ fontSize: 56, color: "#00897B", mb: 1.5 }} />
        <Typography
          variant="h6"
          sx={{ 
            fontWeight: "600", 
            color: "#00897B",        
            fontSize: "1.1rem",
            mb: 1
          }}
        >
          Alert
        </Typography>
        <Typography
          variant="body2"
          sx={{ 
            color: "#555", 
            fontWeight: "500",
            lineHeight: 1.4,
            fontSize: "0.95rem"
          }}
        >
          {message}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", padding: "0 20px 4px 20px" }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            backgroundColor: "#00897B", 
            color: "#fff",
            borderRadius: "20px",
            px: 4,
            py: 1,
            fontWeight: "600",
            fontSize: "0.9rem",
            textTransform: "none",
            boxShadow: "0px 3px 8px rgba(0, 137, 123, 0.3)", 
            "&:hover": { 
              backgroundColor: "#00796B", 
              boxShadow: "0px 4px 12px rgba(0, 121, 107, 0.4)" 
            }
          }}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertDialogBox;