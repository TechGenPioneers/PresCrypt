"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Box,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import DownloadIcon from "@mui/icons-material/Download";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ImageIcon from "@mui/icons-material/Image";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

const ViewHealthRecordsDialog = ({
  open,
  onClose,
  appointmentId,
}) => {
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get file icon based on file extension
  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return <PictureAsPdfIcon sx={{ color: '#d32f2f' }} />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <ImageIcon sx={{ color: '#2e7d79' }} />;
      default:
        return <InsertDriveFileIcon sx={{ color: '#666' }} />;
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Fetch attachments from API
  const fetchAttachments = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get patientId from localStorage
      const patientId = localStorage.getItem('patientId');
      
      if (!patientId) {
        throw new Error('Patient ID not found in localStorage');
      }

      console.log('Fetching attachments for patient ID:', patientId);

      // Using axios style fetch similar to medical history
      const response = await fetch(`https://localhost:7021/api/PatientAttachment/${patientId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          // 'Authorization': `Bearer ${token}`,
        },
      });

      console.log('API Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const attachmentResponse = await response.json();
      console.log('API Response data:', attachmentResponse);
      
      if (attachmentResponse.data && Array.isArray(attachmentResponse.data.observations)) {
        const formattedAttachments = attachmentResponse.data.observations.map((att, index) => {
          if (!att.attachmentValue) return null;
          
          try {
            const byteCharacters = atob(att.attachmentValue);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            
            const fileType = 'application/pdf'; // Assuming PDF
            const blob = new Blob([byteArray], { type: fileType });
            const objectUrl = URL.createObjectURL(blob);

            return {
              id: att.observationUuid || index,
              fileName: `Attachment-${att.observationUuid ? att.observationUuid.slice(0, 8) : index}.pdf`,
              name: `Attachment-${att.observationUuid ? att.observationUuid.slice(0, 8) : index}.pdf`,
              fileSize: blob.size,
              size: blob.size,
              type: fileType,
              uploadDate: att.obsDatetime || new Date().toISOString(),
              downloadUrl: objectUrl,
              url: objectUrl,
            };
          } catch (decodeError) {
            console.error('Error decoding attachment:', decodeError);
            return null;
          }
        }).filter(Boolean);
        
        console.log('Formatted attachments:', formattedAttachments);
        setAttachments(formattedAttachments);
      } else {
        console.log('No observations found in response');
        setAttachments([]);
      }
    } catch (err) {
      console.error('Error fetching attachments:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch attachments when dialog opens
  useEffect(() => {
    if (open) {
      fetchAttachments();
    }
  }, [open]);

  const handleDownloadRecord = (attachment) => {
    // Handle download record logic here
    console.log(`Downloading attachment:`, attachment);
    
    // Use the blob URL created from the attachment
    if (attachment.url || attachment.downloadUrl) {
      const link = document.createElement('a');
      link.href = attachment.url || attachment.downloadUrl;
      link.download = attachment.fileName || attachment.name || 'attachment.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.error('No download URL available for attachment');
    }
  };

  const handleDownloadAll = () => {
    attachments.forEach((attachment) => {
      handleDownloadRecord(attachment);
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "40px",
          padding: "40px 20px",
          border: "2px solid #5da9a7",
          backgroundColor: "#fffdfd",
          boxShadow: "0px 6px 30px rgba(0, 0, 0, 0.15)",
          minHeight: "500px",
        },
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{ position: "absolute", top: 16, right: 16, zIndex: 1 }}
      >
        <CloseIcon fontSize="large" />
      </IconButton>

      <DialogContent className="flex flex-col items-center text-center">
        <DescriptionOutlinedIcon sx={{ fontSize: 80, color: "#5da9a7" }} />
        <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold", color: "#2e7d79" }}>
          Health Records Available
        </Typography>

        <Divider sx={{ width: "100%", mt: 3, mb: 3 }} />

        {/* Attachments Section */}
        <Box sx={{ width: "100%", maxHeight: "300px", overflowY: "auto" }}>
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
              <CircularProgress size={40} sx={{ color: "#5da9a7" }} />
              <Typography sx={{ ml: 2, alignSelf: "center" }}>
                Loading attachments...
              </Typography>
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Error loading attachments: {error}
            </Alert>
          )}

          {!loading && !error && attachments.length === 0 && (
            <Typography variant="body2" sx={{ color: "#777", py: 4 }}>
              No attachments found for this patient.
            </Typography>
          )}

          {!loading && !error && attachments.length > 0 && (
            <>
              <Typography variant="h6" sx={{ mb: 2, color: "#2e7d79" }}>
                Attachments ({attachments.length})
              </Typography>
              
              <List sx={{ width: "100%" }}>
                {attachments.map((attachment, index) => (
                  <ListItem
                    key={attachment.id || index}
                    sx={{
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      mb: 1,
                      "&:hover": {
                        backgroundColor: "#f5f5f5",
                      },
                    }}
                  >
                    <ListItemIcon>
                      {getFileIcon(attachment.fileName || attachment.name || '')}
                    </ListItemIcon>
                    <ListItemText
                      primary={attachment.fileName || attachment.name || 'Unknown File'}
                      secondary={
                        <Box>
                          {attachment.description && (
                            <Typography variant="body2" color="text.secondary">
                              {attachment.description}
                            </Typography>
                          )}
                          <Typography variant="caption" color="text.secondary">
                            {attachment.fileSize ? formatFileSize(attachment.fileSize) : ''}
                            {attachment.uploadDate && (
                              <span>
                                {attachment.fileSize ? ' • ' : ''}
                                {new Date(attachment.uploadDate).toLocaleDateString()}
                              </span>
                            )}
                          </Typography>
                        </Box>
                      }
                    />
                    <IconButton
                      onClick={() => handleDownloadRecord(attachment)}
                      sx={{ 
                        color: "#5da9a7",
                        "&:hover": {
                          backgroundColor: "#f0f8f7",
                        }
                      }}
                    >
                      <DownloadIcon />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </Box>

        <Divider sx={{ width: "100%", mt: 2, mb: 2 }} />

        <Typography variant="body2" sx={{ color: "#777", fontSize: "12px" }}>
          Records include: Medical reports, Prescriptions, Lab results, Treatment notes
        </Typography>

        <Typography variant="body2" sx={{ color: "#1976d2", fontSize: "12px", mt: 1 }}>
          ⚕️ Synced via OpenMRS API
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", mt: 2, gap: 2 }}>
        <Button
          onClick={attachments.length > 1 ? handleDownloadAll : () => attachments.length === 1 ? handleDownloadRecord(attachments[0]) : null}
          variant="contained"
          startIcon={<DownloadIcon />}
          disabled={attachments.length === 0 || loading}
          sx={{
            backgroundColor: "#5da9a7",
            "&:hover": {
              backgroundColor: "#4c9995",
            },
            "&:disabled": {
              backgroundColor: "#ccc",
              color: "#888",
            },
            borderRadius: "8px",
            padding: "10px 20px",
            fontWeight: 600,
          }}
        >
          {attachments.length > 1 ? "Download All" : "Download"}
        </Button>

        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: "#5da9a7",
            color: "#5da9a7",
            "&:hover": {
              borderColor: "#4c9995",
              backgroundColor: "#f0f8f7",
            },
            borderRadius: "8px",
            padding: "10px 20px",
            fontWeight: 600,
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewHealthRecordsDialog;
