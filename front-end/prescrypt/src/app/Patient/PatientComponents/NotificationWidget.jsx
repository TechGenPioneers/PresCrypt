// components/NotificationWidget.jsx
"use client";
import React, { useState } from "react";
import { IconButton, Badge, Popover, Typography, Box, List, ListItem, Divider } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useNotification } from "./NotificationContext";

const NotificationWidget = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { notifications } = useNotification();

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const open = Boolean(anchorEl);

  return (
    <Box sx={{ position: "relative" }}>
      <IconButton onClick={handleOpen}>
        <Badge badgeContent={notifications.length} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Box sx={{ p: 2, minWidth: 300 }}>
          <Typography variant="h6">Notifications</Typography>
          <Divider sx={{ my: 1 }} />
          <List>
            {notifications.length === 0 ? (
              <ListItem>No notifications</ListItem>
            ) : (
              notifications.map((n) => (
                <ListItem key={n.id} sx={{ flexDirection: "column", alignItems: "flex-start" }}>
                  <Typography fontWeight="bold">{n.title}</Typography>
                  <Typography variant="body2">{n.content}</Typography>
                </ListItem>
              ))
            )}
          </List>
        </Box>
      </Popover>
    </Box>
  );
};

export default NotificationWidget;
