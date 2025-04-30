"use client";

import React, { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CheckIcon from "@mui/icons-material/Check";
import axios from "axios";

export default function NotificationIcon({ userId = "P021" }) {
  const [connection, setConnection] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`https://localhost:7021/api/PatientNotification/${userId}`);
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`https://localhost:7021/patientNotificationHub?userId=${userId}`)
      .withAutomaticReconnect()
      .build();

    newConnection.start()
      .then(() => {
        console.log("Connected to SignalR hub");

        newConnection.on("ReceiveNotification", (msg) => {
          console.log("New Notification", msg);
          setNotifications(prev => [
            {
              id: msg.id,
              title: msg.title,
              message: msg.message,
              date: msg.createdAt,
              isRead: false,
              type: msg.type,
              doctorId: msg.doctorId || null
            },
            ...prev
          ]);
        });
      })
      .catch(err => console.error("SignalR connection failed:", err));

    setConnection(newConnection);

    return () => {
      newConnection.stop();
    };
  }, [userId]);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = async (id) => {
    try {
      await axios.post(
        "https://localhost:7021/api/PatientNotification/mark-as-read",
        id,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const handleResponse = async (id, doctorId, accepted) => {
    try {
      await axios.post("https://localhost:7021/api/PatientNotification/respond-request", {
        notificationId: id,
        doctorId: doctorId,
        accepted: accepted
      });

      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
    } catch (err) {
      console.error("Failed to respond to request", err);
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
            overflowY: 'auto',
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
            <Typography variant="body2" color="text.secondary" textAlign="center">
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

              {/* Accept/Deny buttons for Request type */}
              {n.type === "Request" && (
                <Box display="flex" gap={1} mt={1}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => handleResponse(n.id, n.doctorId, true)}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleResponse(n.id, n.doctorId, false)}
                  >
                    Deny
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
    </>
  );
}
