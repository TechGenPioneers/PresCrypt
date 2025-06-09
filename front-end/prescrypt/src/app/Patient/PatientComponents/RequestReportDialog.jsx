"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Button,
  IconButton,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { getAppointmentsByDate } from "../services/AppointmentsFindingService";
import { generateAppointmentReport } from "../services/PatientDataService";

const RequestReportDialog = ({ open, handleClose }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDownloadReport = async () => {
    setLoading(true);
    try {
      const appointments = await getAppointmentsByDate(
        startDate.toISOString().split("T")[0],
        endDate.toISOString().split("T")[0]
      );

      const pdfBlob = await generateAppointmentReport(appointments);

      const url = window.URL.createObjectURL(new Blob([pdfBlob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "AppointmentReport.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();

      handleClose();
    } catch (error) {
      console.error("Failed to generate report:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "20px",
          border: "2px solid #4CAF50",
          boxShadow: "0 0 20px rgba(0, 128, 0, 0.2)",
        },
      }}
    >
      <div className="bg-white rounded-3xl p-2">
        <DialogTitle className="font-semibold text-lg text-green-700 relative">
          Request Appointment Report
          <IconButton
            onClick={handleClose}
            className="
             left-65 text-gray-500 hover:text-gray-800"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>


        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box display="flex" flexDirection="column" gap={3} className="py-2 px-1">
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                renderInput={(params) => (
                  <div className="rounded-md">{params.input}</div>
                )}
              />
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                renderInput={(params) => (
                  <div className="rounded-md">{params.input}</div>
                )}
              />
            </Box>
          </LocalizationProvider>
        </DialogContent>

        <DialogActions className="px-6 pb-4">
          <Button
            onClick={handleClose}
            className="text-gray-600 hover:text-black"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleDownloadReport}
            disabled={loading || !startDate || !endDate}
            className="!bg-green-600 !hover:bg-green-700 !text-white px-4 py-2 rounded-lg font-semibold"
          >
            {loading ? (
              <Box display="flex" alignItems="center" gap={1}>
                <CircularProgress size={20} color="inherit" />
                Generating...
              </Box>
            ) : (
              "Download Report"
            )}
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  );
};

export default RequestReportDialog;
