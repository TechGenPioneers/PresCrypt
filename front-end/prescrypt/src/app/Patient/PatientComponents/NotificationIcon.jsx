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
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import CloseIcon from "@mui/icons-material/Close";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import {
  getNotifications,
  markAsRead,
  respondToRequest,
  markAsResponded
} from "../services/PatientHeaderService";

export default function NotificationIcon({ patientId }) {
  const [connection, setConnection] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [responded, setResponded] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");

  const [snackOpen, setSnackOpen] = useState(false);
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
              isResponded: false,
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
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const confirmAccept = (notification) => {
    setSelectedNotification(notification);
    setConfirmDialog(true);
    setResponded(false); // Reset responded state when opening dialog
    setResponseMessage(""); // Reset response message
  };

  const handleResponse = async (accepted) => {
    if (!selectedNotification) return;

    try {
      const patientId = localStorage.getItem("patientId");

      if (!patientId) {
        console.error("Missing patientId");
        setResponseMessage("User ID missing. Please login again.");
        return;
      }

      await respondToRequest({
        doctorId: selectedNotification.doctorId,
        patientId: patientId,
        accepted: accepted,
      });

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === selectedNotification.id ? { ...n, isRead: true, isResponded: true } : n
        )
      );

      // Mark as responded in the backend
      await markAsResponded(selectedNotification.id);

      setResponded(true);
      setResponseMessage(
        accepted
          ? "✅ Your response has been sent to the doctor."
          : "❌ You have rejected the request from the doctor."
      );
    } catch (error) {
      console.error("Error responding to access request:", error);
      setResponseMessage("You have already sent a response to this request.");
      setResponded(false);
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <>
      <IconButton 
        color="inherit" 
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: 'rgba(21, 128, 61, 0.1)',
            transform: 'scale(1.05)'
          }
        }}
      >
        <Badge 
          badgeContent={unreadCount} 
          color="error"
          sx={{
            '& .MuiBadge-badge': {
              backgroundColor: '#15803d',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '0.75rem',
              minWidth: '20px',
              height: '20px',
              boxShadow: '0 2px 6px rgba(21, 128, 61, 0.3)'
            }
          }}
        >
          <NotificationsIcon sx={{ fontSize: '1.4rem' }} />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            maxHeight: 450,
            width: 420,
            borderRadius: '16px',
            boxShadow: '0px 6px 30px rgba(0, 0, 0, 0.15)',
            border: '1px solid #dcfce7',
            overflow: 'hidden',
            mt: 1
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box 
          sx={{ 
            backgroundColor: '#15803d',
            color: 'white',
            px: 3,
            py: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Typography variant="h6" fontWeight="600" sx={{ fontSize: '1.1rem' }}>
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <Typography variant="caption" sx={{ 
              backgroundColor: 'rgba(255,255,255,0.2)', 
              px: 1.5, 
              py: 0.5, 
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: '500'
            }}>
              {unreadCount} new
            </Typography>
          )}
        </Box>

        <Box sx={{ maxHeight: 350, overflowY: 'auto' }}>
          {notifications.length === 0 ? (
            <Box p={4} textAlign="center">
              <NotificationsIcon sx={{ fontSize: 48, color: '#E0E0E0', mb: 1 }} />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: '500' }}
              >
                No notifications yet
              </Typography>
            </Box>
          ) : (
            notifications.map((n, index) => (
              <Box
                key={n.id}
                sx={{
                  backgroundColor: n.isRead ? '#ffffff' : '#f0fdf4',
                  borderLeft: n.isRead ? '4px solid transparent' : '4px solid #15803d',
                  p: 2.5,
                  borderBottom: index < notifications.length - 1 ? '1px solid #F0F0F0' : 'none',
                  position: 'relative',
                  transition: 'all 0.2s ease-in-out',
                  minHeight: '120px', // Fixed minimum height to prevent layout shifts
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  '&:hover': {
                    backgroundColor: n.isRead ? '#f9fafb' : '#ecfdf5'
                  }
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                  <Typography 
                    variant="subtitle2" 
                    fontWeight="600"
                    sx={{ 
                      color: '#166534',
                      fontSize: '0.95rem',
                      lineHeight: 1.3
                    }}
                  >
                    {n.title}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    {n.date && (
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <AccessTimeIcon sx={{ fontSize: 14, color: '#757575' }} />
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: '#757575',
                            fontSize: '0.7rem',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {formatTime(n.date)}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
                
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#666',
                    mb: n.type === "Request" ? 2 : 0,
                    lineHeight: 1.4,
                    fontSize: '0.85rem'
                  }}
                >
                  {n.message}
                </Typography>

                {n.type === "Request" && (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => confirmAccept(n)}
                    disabled={n.isResponded}
                    sx={{
                      backgroundColor: n.isResponded ? '#dcfce7' : '#15803d',
                      color: n.isResponded ? '#166534' : 'white',
                      borderRadius: '6px',
                      px: 3,
                      py: 1,
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      textTransform: 'none',
                      border: '1px solid #d1d5db',
                      boxShadow: n.isResponded ? 'none' : '0px 1px 2px rgba(0, 0, 0, 0.05)',
                      minWidth: '130px',
                      cursor: n.isResponded ? 'not-allowed' : 'pointer',
                      '&:hover': {
                        backgroundColor: n.isResponded ? '#dcfce7' : '#16a34a',
                        boxShadow: n.isResponded ? 'none' : '0px 1px 3px rgba(0, 0, 0, 0.1)'
                      },
                      '&:disabled': {
                        backgroundColor: '#dcfce7',
                        color: '#166534',
                        cursor: 'not-allowed'
                      }
                    }}
                  >
                    {n.isResponded ? 'Responded' : 'View Request'}
                  </Button>
                )}

                {!n.isRead && (
                  <IconButton
                    size="small"
                    onClick={() => handleMarkAsRead(n.id)}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: 'rgba(21, 128, 61, 0.1)',
                      color: '#15803d',
                      width: 28,
                      height: 28,
                      '&:hover': {
                        backgroundColor: 'rgba(21, 128, 61, 0.2)',
                        transform: 'scale(1.1)'
                      },
                      transition: 'all 0.2s ease-in-out'
                    }}
                  >
                    <CheckIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            ))
          )}
        </Box>
      </Menu>

      <Dialog
        open={confirmDialog}
        onClose={() => setConfirmDialog(false)}
        maxWidth="sm"
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: '8px',
            padding: '24px 20px',
            border: '2px solid #15803d',
            backgroundColor: '#fffdfd',
            boxShadow: '0px 6px 30px rgba(0, 0, 0, 0.15)',
            minWidth: '400px',
            maxWidth: '500px',
          },
        }}
      >
        <IconButton
          onClick={() => setConfirmDialog(false)}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            color: '#15803d',
            '&:hover': { 
              backgroundColor: 'rgba(21, 128, 61, 0.1)',
              transform: 'scale(1.1)'
            },
            transition: 'all 0.2s ease-in-out'
          }}
        >
          <CloseIcon />
        </IconButton>

        <DialogTitle sx={{ 
          textAlign: 'center', 
          color: '#166534',
          fontWeight: '700',
          fontSize: '1.3rem',
          pt: 2,
          pb: 1
        }}>
          Confirm Access Request
        </DialogTitle>

        <DialogContent sx={{ py: 3, textAlign: 'center' }}>
          <MedicalServicesIcon
            sx={{ 
              fontSize: 80, 
              color: '#15803d', 
              mb: 2,
              filter: 'drop-shadow(0 2px 4px rgba(21, 128, 61, 0.3))'
            }}
          />
          
          <Box className="bg-green-50 border-l-4 border-green-700 p-3 rounded-r-lg mb-3">
            <Typography
              variant="body1"
              sx={{ 
                color: '#166534',
                fontWeight: '500',
                fontSize: '1rem',
                lineHeight: 1.5
              }}
            >
              A Doctor is requesting access to your medical health data.
            </Typography>
          </Box>
          
          {!responded ? (
            <Typography
              variant="body1"
              sx={{ 
                color: '#1976D2',
                fontWeight: '600',
                fontSize: '1.1rem'
              }}
            >
              Do you want to allow this access?
            </Typography>
          ) : (
            <Box sx={{ mt: 3, mb: 2 }}>
              <Typography
                variant="body1"
                sx={{ 
                  color: responseMessage.includes('✅') ? '#15803d' : '#dc2626',
                  fontWeight: '600',
                  fontSize: '1rem',
                  backgroundColor: responseMessage.includes('✅') ? '#f0fdf4' : '#fef2f2',
                  border: `1px solid ${responseMessage.includes('✅') ? '#15803d' : '#dc2626'}`,
                  borderRadius: '8px',
                  padding: '12px 16px'
                }}
              >
                {responseMessage}
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'center', gap: 2, px: 3, pb: 3 }}>
          {!responded ? (
            <>
              <Button
                onClick={() => handleResponse(false)}
                sx={{
                  backgroundColor: '#dc2626',
                  color: '#fff',
                  borderRadius: '6px',
                  px: 3,
                  py: 1.5,
                  fontWeight: '500',
                  fontSize: '0.875rem',
                  textTransform: 'none',
                  border: '1px solid #d1d5db',
                  minWidth: '120px',
                  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
                  '&:hover': { 
                    backgroundColor: '#b91c1c',
                    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)'
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                No, Deny
              </Button>
              <Button
                onClick={() => handleResponse(true)}
                sx={{
                  backgroundColor: '#15803d',
                  color: '#fff',
                  borderRadius: '6px',
                  px: 3,
                  py: 1.5,
                  fontWeight: '500',
                  fontSize: '0.875rem',
                  textTransform: 'none',
                  border: '1px solid #d1d5db',
                  minWidth: '120px',
                  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
                  '&:hover': { 
                    backgroundColor: '#16a34a',
                    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)'
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                Yes, I'm OK
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setConfirmDialog(false)}
              sx={{
                backgroundColor: '#15803d',
                color: '#fff',
                borderRadius: '6px',
                px: 3,
                py: 1.5,
                fontWeight: '500',
                fontSize: '0.875rem',
                textTransform: 'none',
                minWidth: '120px',
                '&:hover': { 
                  backgroundColor: '#16a34a'
                }
              }}
            >
              Close
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}