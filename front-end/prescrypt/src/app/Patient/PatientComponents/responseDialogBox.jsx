"use client";
import React, { useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import axios from "axios";

const ResponseDialogBox = ({
  open,
  onClose,
  message,
  paymentMethod,
  appointmentDate,
  appointmentTime,
  paymentAmount,
  payHereObjectId,
}) => {
  // Combine appointmentDate + appointmentTime into JS Date object
  const appointmentDateTime = useMemo(() => {
    if (!appointmentDate || !appointmentTime) return null;
    return new Date(`${appointmentDate}T${appointmentTime}`);
  }, [appointmentDate, appointmentTime]);

  // Calculate hours until appointment
  const hoursUntilAppointment = useMemo(() => {
    if (!appointmentDateTime) return null;
    const now = new Date();
    const diffMs = appointmentDateTime - now;
    return diffMs / (1000 * 60 * 60); // ms to hours
  }, [appointmentDateTime]);


  const refundInfo = useMemo(() => {
  if (paymentMethod === "Card") {
    if (!paymentAmount || hoursUntilAppointment === null) return null;

    const isWithin48Hours = hoursUntilAppointment <= 48;
    const refundPercent = isWithin48Hours ? 0.8 : 1.0;
    const refundAmount = Math.round(paymentAmount * refundPercent * 100) / 100;

    const refundMessage = isWithin48Hours
      ? `Your appointment scheduled on ${appointmentDate} at ${appointmentTime} has been cancelled and requested from PayHere with the payment ID: ${payHereObjectId}. You will receive 80% refund due to cancellation within 48 hours. Refunded amount: Rs. ${refundAmount.toFixed(2)}.`
      : `Your appointment scheduled on ${appointmentDate} at ${appointmentTime} has been cancelled and requested from PayHere with the Payment ID: ${payHereObjectId}. You will receive a full refund. Refunded amount: Rs. ${refundAmount.toFixed(2)}.`;

    return {
      refundAmount,
      refundMessage,
      refundPercent: refundPercent * 100,
    };
  }

  if (paymentMethod === "Location") {
    const warningMessage = `Your appointment on ${appointmentDate} at ${appointmentTime} has been successfully cancelled. Please note: Cancelling appointments on short notice may lead to permanent account inactivation.`;
    return {
      refundAmount: null,
      refundMessage: warningMessage,
      refundPercent: null,
    };
  }

  return null;
}, [paymentMethod, paymentAmount, hoursUntilAppointment, appointmentDate, appointmentTime, payHereObjectId]);


  
  useEffect(() => {
  const sendRefundRequest = async () => {
    if (
      open &&
      paymentMethod === "Card" &&
      payHereObjectId &&
      refundInfo?.refundAmount != null
    ) {
      try {
        await axios.post("http://localhost:3000/api/payhere-refund", {
          payment_id: payHereObjectId,
          reason: "Customer changed their mind",
          refund_amount: refundInfo.refundAmount,
        });
        console.log("Refund request sent successfully");
      } catch (error) {
        console.error("Failed to send refund request:", error);
      }
    }
  };

  sendRefundRequest();
}, [open, paymentMethod, payHereObjectId, refundInfo]);



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
          border: "2px solid #4CAF50",
          backgroundColor: "#ffffff",
          boxShadow: "0px 6px 30px rgba(0, 0, 0, 0.15)",
        },
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{ position: "absolute", top: 16, right: 16 }}
      >
        <CloseIcon fontSize="large" />
      </IconButton>

      <DialogContent className="flex flex-col items-center text-center">
        <CheckCircleOutlineIcon sx={{ fontSize: 80, color: "#4CAF50" }} />
        <Typography
          variant="h6"
          sx={{ mt: 2, fontWeight: "bold", color: "#2e7d32" }}
        >
          {message}
        </Typography>

        {paymentMethod && (
          <Typography variant="body1" sx={{ mt: 1, color: "#555" }}>
            Payment Method: <strong>{paymentMethod}</strong>
          </Typography>
        )}

        {appointmentDate && appointmentTime && (
          <Typography variant="body2" sx={{ mt: 0.5, color: "#777" }}>
            Appointment: <strong>{appointmentDate} at {appointmentTime}</strong>
          </Typography>
        )}

        {refundInfo && (
          <Typography variant="body2" sx={{ mt: 2, color: "#d84315", fontWeight: 500 }}>
            {refundInfo.refundMessage}
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", mt: 2 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            backgroundColor: "#4CAF50",
            color: "#fff",
            "&:hover": { backgroundColor: "#43a047" },
            borderRadius: "8px",
            padding: "8px 20px",
            fontWeight: 600,
          }}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResponseDialogBox;
