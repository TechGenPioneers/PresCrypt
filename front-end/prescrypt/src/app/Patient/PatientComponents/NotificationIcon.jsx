"use client";
import React, { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CheckIcon from "@mui/icons-material/Check";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useRouter } from "next/navigation"; // <-- important for routing

export default function NotificationIcon({ userId }) {
  const router = useRouter(); // <-- initialize router
  const [connection, setConnection] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Fetch all notifications from DB
  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`https://localhost:7192/api/Notification/${userId}`);
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  useEffect(() => {
    fetchNotifications(); // Load existing notifications

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`https://localhost:7192/notificationHub?userId=${userId || "P001"}`)
      .withAutomaticReconnect()
      .build();

    newConnection
      .start()
      .then(() => {
        console.log("Connected to SignalR hub");

        newConnection.on("ReceiveNotification", (msg) => {
          console.log("New notification received:", msg);
          setNotifications((prev) => [
            { message: msg, isRead: false, id: Date.now() },
            ...prev,
          ]);
        });
      })
      .catch((err) => console.error("SignalR connection failed:", err));

    setConnection(newConnection);

    return () => {
      newConnection.stop();
    };
  }, [userId]);

  const handleClose = () => {
    setAnchorEl(null);

    // Go back to previous URL when menu closes
    router.back();
  };

  const handleMarkAsRead = async (index, notification) => {
    try {
      await axios.post(`https://localhost:7192/api/Notification/mark-as-read`, {
        id: notification.id,
      });

      setNotifications((prev) =>
        prev.map((n, i) => (i === index ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <>
      <IconButton color="inherit">
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
            maxHeight: 300,
            width: '320px',
          },
        }}
      >
        {notifications.length === 0 ? (
          <MenuItem disabled>No notifications</MenuItem>
        ) : (
          notifications.map((n, index) => (
            <MenuItem
              key={n.id || index}
              divider
              sx={{
                bgcolor: n.isRead ? "white" : "#f5f5f5",
              }}
            >
              <ListItemText
                primary={
                  <Typography
                    variant="body2"
                    fontWeight={n.isRead ? "normal" : "bold"}
                  >
                    {n.message}
                  </Typography>
                }
              />
              {!n.isRead && (
                <IconButton
                  size="small"
                  onClick={() => handleMarkAsRead(index, n)}
                >
                  <CheckIcon fontSize="small" />
                </IconButton>
              )}
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
}

