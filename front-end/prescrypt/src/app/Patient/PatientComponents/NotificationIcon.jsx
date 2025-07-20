"use client";

import React, { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Menu from "@mui/material/Menu";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CheckIcon from "@mui/icons-material/Check";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices"; // Large icon for dialog
import {
  getNotifications,
  markAsRead,
  respondToRequest,
} from "../services/PatientHeaderService";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

export default function NotificationIcon({ patientId }) {
  const [connection, setConnection] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [responded, setResponded] = useState("");
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [responseMessage, setResponseMessage] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [alreadyRespondedSnackbarOpen, setAlreadyRespondedSnackbarOpen] =
    useState(false);

  const open = Boolean(anchorEl);

  useEffect(() => {
    if (!patientId) {
      console.log("patientId is not ready yet. Skipping connection.");
      return;
    }

    const fetchNotifications = async () => {
      try {
        const data = await getNotifications(patientId);
        setNotifications(data);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    };

    fetchNotifications();

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(
        `https://localhost:7021/patientNotificationHub?patientId=${patientId}`
      )
      .withAutomaticReconnect()
      .build();

    newConnection
      .start()
      .then(() => {
        console.log("Connected to SignalR hub");
        newConnection.on("ReceiveNotification", (msg) => {
          setNotifications((prev) => [
            {
              id: msg.id,
              title: msg.title,
              message: msg.message,
              date: msg.createdAt,
              isRead: false,
              type: msg.type,
              doctorId: msg.doctorId || null,
            },
            ...prev,
          ]);
        });
      })
      .catch((err) => console.error("SignalR connection failed:", err));

    setConnection(newConnection);

    return () => {
      newConnection.stop();
    };
  }, [patientId]);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === selectedNotification.id
            ? { ...n, isRead: true, responseSent: true, accepted: accepted }
            : n
        )
      );
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const confirmAccept = (notification) => {
    setSelectedNotification(notification);
    setConfirmDialog(true);
  };

  const handleResponse = async (accepted) => {
    if (!selectedNotification) return;

    try {
      const patientId = localStorage.getItem("patientId");

      if (!patientId) {
        console.error("Missing patientId");
        alert("User ID missing. Please login again.");
        return;
      }

      await respondToRequest({
        doctorId: selectedNotification.doctorId,
        patientId: patientId,
        accepted: accepted,
      });

      
      setResponded(true); // Mark as responded
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === selectedNotification.id ? { ...n, isRead: true } : n
        )
      );
    } catch (error) {
      console.error("Error responding to access request:", error);
      setAlreadyRespondedSnackbarOpen(true);

      setResponded(false); // Reset state on error
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <>
      <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: 400,
            width: 450,
            padding: 10,
            borderRadius: 16,
            overflowY: "auto",
          },
        }}
      >
        <Box display="flex" alignItems="center" px={1} mb={1}>
          <Typography variant="h6" fontWeight="bold">
            Notifications
          </Typography>
        </Box>

        {notifications.length === 0 ? (
          <Box p={2}>
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
            >
              No notifications
            </Typography>
          </Box>
        ) : (
          notifications.map((n) => (
            <Box
              key={n.id}
              bgcolor={n.isRead ? "#f9f9f9" : "#E8F4F2"}
              borderRadius={2}
              border="1px solid #ccc"
              p={2}
              mb={1}
              display="flex"
              flexDirection="column"
              gap={1}
              position="relative"
            >
              <Typography variant="body1" fontWeight="bold">
                {n.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {n.message}
              </Typography>

              {n.type === "Request" && (
                <Box display="flex" gap={1} mt={1}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => confirmAccept(n)}
                  >
                    View Request
                  </Button>
                </Box>
              )}

              {!n.isRead && (
                <IconButton
                  size="small"
                  onClick={() => handleMarkAsRead(n.id)}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    backgroundColor: "#fff",
                    "&:hover": {
                      backgroundColor: "#e0e0e0",
                    },
                  }}
                >
                  <CheckIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          ))
        )}
      </Menu>

      <Dialog
        open={confirmDialog}
        onClose={() => setConfirmDialog(false)}
        PaperProps={{
          className:
            "rounded-xl p-6 bg-gradient-to-br from-green-50 to-white shadow-2xl w-[90%] max-w-md mx-auto transform scale-100 hover:scale-105 transition duration-300",
        }}
      >
        <DialogTitle className="text-2xl font-bold text-center text-green-800 bg-gradient-to-r from-green-100 to-white p-4 rounded-t-xl">
          Confirm Access
        </DialogTitle>

        <DialogContent className="py-6 text-center text-gray-700 flex flex-col items-center">
          <MedicalServicesIcon
            sx={{ fontSize: 100, color: "#4CAF50" }}
            className="mb-4 animate-pulse"
          />
          <p className="text-lg">
            A Doctor is requesting to access your medical health data.
          </p>
          <p className="text-lg font-medium text-blue-600 mt-2">
            Are you sure you want to allow?
          </p>
          {responseMessage && (
            <p className="mt-4 text-sm text-gray-600">{responseMessage}</p>
          )}
        </DialogContent>

        <DialogActions className="flex flex-col items-center space-y-4 px-4 pb-6">
          {!responded ? (
            <div className="flex space-x-6">
              <Button
                disabled={responded}
                onClick={() => handleResponse(false)}
                className={`px-6 py-3 rounded-lg font-semibold bg-red-500 hover:bg-red-600 text-white transition duration-300 transform hover:scale-105 ${
                  responded ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                No, Deny
              </Button>
              <Button
                disabled={responded}
                onClick={() => handleResponse(true)}
                className={`px-6 py-3 rounded-lg font-semibold bg-green-500 hover:bg-green-600 text-white transition duration-300 transform hover:scale-105 ${
                  responded ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Yes, I’m OK
              </Button>
            </div>
          ) : (
            <p className="text-green-600 font-semibold text-lg">
              ✅ Your response has been sent.
            </p>
          )}
        </DialogActions>
        <Snackbar
          open={alreadyRespondedSnackbarOpen}
          autoHideDuration={4000}
          onClose={() => setAlreadyRespondedSnackbarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <MuiAlert
            onClose={() => setAlreadyRespondedSnackbarOpen(false)}
            severity="info"
            elevation={6}
            variant="filled"
          >
            You have already sent a response to this request.
          </MuiAlert>
        </Snackbar>
      </Dialog>
    </>
  );
}
