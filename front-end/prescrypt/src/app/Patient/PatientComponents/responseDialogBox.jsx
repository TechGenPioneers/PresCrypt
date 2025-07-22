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
import { updateCancelStatus } from "../services/PatientDataService";
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
        isWithin48Hours,
      };
    }

    if (paymentMethod === "Location") {
      const warningMessage = `Your appointment on ${appointmentDate} at ${appointmentTime} has been successfully cancelled. Please note: Cancelling appointments on short notice may lead to permanent account inactivation.`;
      return {
        refundAmount: null,
        refundMessage: warningMessage,
        refundPercent: null,
        isWithin48Hours: false,
      };
    }

    return null;
  }, [paymentMethod, paymentAmount, hoursUntilAppointment, appointmentDate, appointmentTime, payHereObjectId]);


   useEffect(() => {
    const handleCancelStatusUpdate = async () => {
      if (open && paymentMethod === "Location") {
        const storedPatientId = localStorage.getItem("patientId");

        if (!storedPatientId) {
          console.warn("No patientId found in localStorage");
          return;
        }

        try {
          await updateCancelStatus(storedPatientId);
          console.log("Patient cancel status updated successfully.");
        } catch (error) {
          console.error("Error updating patient cancel status:", error);
        }
      }
    };

    handleCancelStatusUpdate();
  }, [open, paymentMethod]);

  
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
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "20px",
          padding: "24px 20px",
          border: "2px solid #4CAF50",
          backgroundColor: "#fffdfd",
          boxShadow: "0px 6px 30px rgba(0, 0, 0, 0.15)",
          minWidth: "400px",
          maxWidth: "500px",
        },
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          top: 12,
          right: 12,
          color: "#4CAF50",
          "&:hover": { backgroundColor: "rgba(76, 175, 80, 0.1)" }
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent className="flex flex-col items-center text-center" sx={{ pt: 2 }}>
        <CheckCircleOutlineIcon sx={{ fontSize: 60, color: "#4CAF50", mb: 2 }} />
        <Typography
          variant="h6"
          sx={{ fontWeight: "700", color: "#2E7D32", mb: 3 }}
        >
          {message}
        </Typography>

        <div className="text-left w-full space-y-3">
          {/* Payment Method Info */}
          {paymentMethod && (
            <div className="bg-teal-50 border-l-4 border-teal-400 p-3 rounded-r-lg">
              <Typography
                variant="body2"
                sx={{ color: "#2E7D32", fontWeight: "500", fontSize: "0.9rem" }}
              >
                Payment Method: <strong>{paymentMethod}</strong>
              </Typography>
            </div>
          )}

          {/* Appointment Date & Time Info */}
          {appointmentDate && appointmentTime && (
            <div className="bg-teal-50 border-l-4 border-teal-400 p-3 rounded-r-lg">
              <Typography
                variant="body2"
                sx={{ color: "#2E7D32", fontWeight: "500", fontSize: "0.9rem" }}
              >
                Appointment: <strong>{appointmentDate} at {appointmentTime}</strong>
              </Typography>
            </div>
          )}

          {/* Refund Information */}
          {refundInfo && (
            <div className={`border-l-4 p-3 rounded-r-lg ${
              paymentMethod === "Location" 
                ? "bg-red-50 border-red-400" 
                : refundInfo.isWithin48Hours 
                  ? "bg-orange-50 border-orange-400"
                  : "bg-green-50 border-green-400"
            }`}>
              <Typography
                variant="body2"
                sx={{
                  color: paymentMethod === "Location" 
                    ? "#B71C1C" 
                    : refundInfo.isWithin48Hours 
                      ? "#E65100"
                      : "#2E7D32",
                  fontWeight: paymentMethod === "Location" ? "600" : "500",
                  fontSize: "0.9rem"
                }}
              >
                {refundInfo.refundMessage}
              </Typography>
            </div>
          )}
        </div>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", pt: 2 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            backgroundColor: "#0d9488", 
            color: "#fff",
            "&:hover": { backgroundColor: "#0f766e" }, 
            borderRadius: "20px",
            px: 4,
            py: 1,
            fontWeight: "600",
            fontSize: "0.9rem",
            textTransform: "none",
            boxShadow: "0px 3px 8px rgba(13, 148, 136, 0.3)", 

          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResponseDialogBox;