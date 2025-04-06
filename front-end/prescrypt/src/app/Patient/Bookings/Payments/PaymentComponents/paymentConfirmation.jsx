"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const PaymentConfirmation = ({ open, handleClose, email }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "30px",
          padding: "20px",
          border: "2px solid #4CAF50",
          backgroundColor: "#fff",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      {/* Close Button */}
      <IconButton
        onClick={handleClose}
        sx={{ position: "absolute", top: 8, right: 8 }}
      >
        <CloseIcon />
      </IconButton>

      {/* Success Icon */}
      <DialogContent className="flex flex-col items-center text-center px-6 pt-6 pb-4">
        <CheckCircleOutlineIcon sx={{ fontSize: 60, color: "#2E7D32" }} />

        <Typography
          variant="h6"
          className="font-bold mt-4"
          sx={{ color: "#00695C" }}
        >
          Your appointment has been successfully booked
        </Typography>

        <Typography variant="body2" className="mt-2 text-gray-600">
          We have sent an email to <strong>{email}</strong> with more
          appointment confirmation details.
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentConfirmation;
