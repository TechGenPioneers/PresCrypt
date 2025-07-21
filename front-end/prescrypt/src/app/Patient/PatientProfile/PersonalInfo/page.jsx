"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import {
  Container,
  Paper,
  Button,
  Typography,
  IconButton,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Avatar,
  Divider,
  CircularProgress,
  Alert,
  AppBar,
  Toolbar,
  FormHelperText,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";
import SaveIcon from "@mui/icons-material/Save";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import CakeIcon from "@mui/icons-material/Cake";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BadgeIcon from "@mui/icons-material/Badge";
import axios from 'axios';

const EditProfilePage = ({ patientData, onBack, onSave }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    birthDate: '',
    nic: '',
    phone: '',
    email: '',
    address: '',
    profileImage: null
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // Validation rules
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Full name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        if (!/^[a-zA-Z\s]+$/.test(value.trim())) return 'Name can only contain letters and spaces';
        return '';

      case 'gender':
        if (!value) return 'Gender is required';
        return '';

      case 'birthDate':
        if (!value) return 'Birth date is required';
        const today = new Date();
        const birthDate = new Date(value);
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (birthDate > today) return 'Birth date cannot be in the future';
        if (age > 120 || (age === 120 && monthDiff > 0)) return 'Please enter a valid birth date';
        if (age < 0) return 'Please enter a valid birth date';
        return '';

      case 'nic':
        if (!value.trim()) return 'NIC is required';
        // Sri Lankan NIC validation (old format: 9 digits + V/X, new format: 12 digits)
        const nicRegex = /^(?:\d{9}[VvXx]|\d{12})$/;
        if (!nicRegex.test(value.trim())) {
          return 'Please enter a valid NIC (9 digits + V/X or 12 digits)';
        }
        return '';

      case 'phone':
        if (!value.trim()) return 'Contact number is required';
        // Sri Lankan phone number validation
        const phoneRegex = /^(?:\+94|0)?[1-9]\d{8}$/;
        if (!phoneRegex.test(value.replace(/\s+/g, ''))) {
          return 'Please enter a valid phone number (10 digits starting with 0 or +94)';
        }
        return '';

      case 'email':
        if (!value.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) return 'Please enter a valid email address';
        return '';

      case 'address':
        if (!value.trim()) return 'Address is required';
        if (value.trim().length < 10) return 'Please enter a complete address (at least 10 characters)';
        return '';

      default:
        return '';
    }
  };

  // Validate all fields
  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(field => {
      if (field !== 'profileImage') { // Skip image validation
        const error = validateField(field, formData[field]);
        if (error) newErrors[field] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    // Set default data from the first image if no patientData is provided
    const defaultData = {
      name: 'Dewmin Deniyegedara',
      gender: 'Male',
      birthDate: '07/30/2002',
      nic: '200221203128',
      phone: '0783456756',
      email: 'dewminkasmitha30@gmail.com',
      address: '159e,Katubedda,Moratuwa',
      profileImage: null
    };

    const dataToUse = patientData || defaultData;

    // Format birthDate from MM/DD/YYYY to YYYY-MM-DD for the date input
    const birthParts = dataToUse.birthDate?.split('/');
    const formattedBirthDate = birthParts?.length === 3 
      ? `${birthParts[2]}-${birthParts[0].padStart(2, '0')}-${birthParts[1].padStart(2, '0')}`
      : '';

    setFormData({
      name: dataToUse.name || '',
      gender: dataToUse.gender === 'M' ? 'Male' : dataToUse.gender === 'F' ? 'Female' : '',
      birthDate: formattedBirthDate || '',
      nic: dataToUse.nic || '',
      phone: dataToUse.phone || '',
      email: dataToUse.email || '',
      address: dataToUse.address || '',
      profileImage: dataToUse.profileImage || null
    });

    if (dataToUse.profileImage) {
      setPreviewImage(`data:image/jpeg;base64,${dataToUse.profileImage}`);
    }
  }, [patientData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Update form data
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validate field in real-time
    const fieldError = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: fieldError
    }));

    // Clear success message when user starts editing
    if (success) setSuccess(false);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    // Mark field as touched on blur
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Re-validate field on blur
    const fieldError = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: fieldError
    }));
  };

  const navigateToPersonalInfo = () => {
    router.push('/Patient/PatientProfile');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          profileImage: 'Image size should be less than 5MB'
        }));
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          profileImage: 'Please select a valid image file (JPEG, PNG, or WebP)'
        }));
        return;
      }

      // Clear any previous image errors
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.profileImage;
        return newErrors;
      });

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        // Extract base64 content without the data URI prefix
        const base64String = reader.result.split(',')[1];
        setFormData(prev => ({
          ...prev,
          profileImage: base64String
        }));
      };
      reader.readAsDataURL(file);
    }
    
    // Clear success message when user changes image
    if (success) setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
  
    // Validate entire form
    if (!validateForm()) {
      setLoading(false);
      // Mark all fields as touched to show errors
      const allTouched = {};
      Object.keys(formData).forEach(field => {
        allTouched[field] = true;
      });
      setTouched(allTouched);
      setError("Please fix the errors above before submitting.");
      return;
    }
  
    try {
      // Get patientId from localStorage
      const patientId = localStorage.getItem('patientId');
  
      if (!patientId) {
        setError("Could not find patient ID. Please log in again.");
        setLoading(false);
        return;
      }
  
      const birthDate = formData.birthDate ? new Date(formData.birthDate) : null;
  
      const dataToSend = {
        name: formData.name,
        birthDate: birthDate ? birthDate.toISOString() : null,
        gender: formData.gender,
        email: formData.email,
        nic: formData.nic,
        address: formData.address,
        phone: formData.phone,
        profileImageBase64: formData.profileImage || "",
      };
  
      //
      // ===== THE ONLY CHANGE IS HERE =====
      // The API endpoint is changed from 'http' to 'https' to match the backend's
      // requirement set by `app.UseHttpsRedirection()`.
      //
      await axios.put(`https://localhost:7021/api/PatientProfile/${patientId}`, dataToSend);
  
      // Format data for the parent component for UI update
      const formattedBirthDateForUI = birthDate 
        ? `${(birthDate.getMonth() + 1).toString().padStart(2, '0')}/${
            birthDate.getDate().toString().padStart(2, '0')}/${
            birthDate.getFullYear()}`
        : '';
  
      const updatedData = {
        ...patientData,
        ...formData,
        birthDate: formattedBirthDateForUI,
        profileImage: formData.profileImage || patientData?.profileImage
      };
  
      setSuccess(true);
      if (onSave) {
        onSave(updatedData);
      }
  
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
  
    } catch (err) {
      console.error("Error updating profile:", err);
      if (err.message === 'Network Error' && !err.response) {
        setError("Network Error: Could not connect to API. Ensure backend is running and using HTTPS.");
      } else if (err.response?.status === 400) {
        setError("Invalid data provided. Please check your information and try again.");
      } else if (err.response?.status === 404) {
        setError("Patient record not found. Please contact support.");
      } else if (err.response?.status >= 500) {
        setError("Server error. Please try again later.");
      } else {
        setError("Failed to update profile. Please check your connection and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  
const handleBack = () => {
  // First try to use the onBack prop if provided (for parent component handling)
  if (onBack) {
    onBack();
  } else {
    // If no onBack prop, navigate directly to patient profile
    navigateToPersonalInfo();
  }
};

  // Helper function to check if field has error and is touched
  const hasError = (fieldName) => touched[fieldName] && errors[fieldName];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'transparent' }}>
      {/* App Bar */}
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          backgroundColor: '#5da9a7',
          borderBottom: '1px solid #e0e0e0'
        }}
      >
        
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper
          elevation={2}
          sx={{
            borderRadius: "16px",
            padding: { xs: 3, sm: 4 },
            border: "1px solid #e0e0e0",
            backgroundColor: "#ffffff",
            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.06)",
          }}
        >
          {/* Header */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <PersonIcon sx={{ fontSize: 60, color: "#5da9a7", mb: 1 }} />
            <Typography variant="h5" sx={{ fontWeight: "600", color: "#2e7d79", mb: 1 }}>
              Edit Your Profile
            </Typography>
            <Typography variant="body2" sx={{ color: "#777", mb: 2, textAlign: "center" }}>
              Update your personal information and profile picture
            </Typography>
          </Box>

          <Divider sx={{ width: "100%", mb: 3 }} />

          {/* Alerts */}
          {error && (
            <Alert 
              severity="error" 
              sx={{ mb: 3, borderRadius: '12px' }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}

          {success && (
            <Alert 
              severity="success" 
              sx={{ mb: 3, borderRadius: '12px' }}
              onClose={() => setSuccess(false)}
            >
              Profile updated successfully!
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            {/* Profile Image Section */}
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 4 }}>
              <Box sx={{ position: "relative", mb: 2 }}>
                <Avatar
                  src={previewImage}
                  sx={{ 
                    width: 100, 
                    height: 100, 
                    bgcolor: "#5da9a7",
                    fontSize: "2rem",
                    border: errors.profileImage ? "3px solid #f44336" : "3px solid #f0f0f0"
                  }}
                >
                  {!previewImage && <PersonIcon fontSize="large" />}
                </Avatar>
                
                <IconButton
                  component="label"
                  sx={{
                    position: "absolute",
                    bottom: -5,
                    right: -5,
                    bgcolor: "#5da9a7",
                    color: "white",
                    width: 36,
                    height: 36,
                    "&:hover": { bgcolor: "#4c9995" },
                    boxShadow: "0px 2px 6px rgba(0,0,0,0.15)",
                  }}
                >
                  <CameraAltIcon fontSize="small" />
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageChange}
                  />
                </IconButton>
              </Box>
              <Typography variant="body2" sx={{ color: "#888", textAlign: "center", fontSize: '0.875rem' }}>
                Click the camera icon to change your profile picture
              </Typography>
              {errors.profileImage && (
                <Typography variant="body2" sx={{ color: '#f44336', textAlign: 'center', mt: 1, fontSize: '0.75rem' }}>
                  {errors.profileImage}
                </Typography>
              )}
            </Box>

            {/* Form Fields */}
            <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" } }}>
              {/* Name */}
              <TextField
                name="name"
                label="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                onBlur={handleBlur}
                required
                fullWidth
                error={hasError('name')}
                helperText={hasError('name') ? errors.name : ''}
                InputProps={{
                  startAdornment: <PersonIcon sx={{ color: hasError('name') ? '#f44336' : "#5da9a7", mr: 1 }} />,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    "&:hover fieldset": { borderColor: hasError('name') ? '#f44336' : "#5da9a7" },
                    "&.Mui-focused fieldset": { borderColor: hasError('name') ? '#f44336' : "#5da9a7" },
                  },
                  "& .MuiInputLabel-root.Mui-focused": { color: hasError('name') ? '#f44336' : "#5da9a7" },
                }}
              />

              {/* Gender */}
              <FormControl 
                required 
                fullWidth
                error={hasError('gender')}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    "&:hover fieldset": { borderColor: hasError('gender') ? '#f44336' : "#5da9a7" },
                    "&.Mui-focused fieldset": { borderColor: hasError('gender') ? '#f44336' : "#5da9a7" },
                  },
                  "& .MuiInputLabel-root.Mui-focused": { color: hasError('gender') ? '#f44336' : "#5da9a7" },
                }}
              >
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  label="Gender"
                  startAdornment={<PersonIcon sx={{ color: hasError('gender') ? '#f44336' : "#5da9a7", mr: 1 }} />}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  
                </Select>
                {hasError('gender') && (
                  <FormHelperText>{errors.gender}</FormHelperText>
                )}
              </FormControl>

              {/* Birth Date */}
              <TextField
                name="birthDate"
                label="Birth Date"
                type="date"
                value={formData.birthDate}
                onChange={handleInputChange}
                onBlur={handleBlur}
                required
                fullWidth
                error={hasError('birthDate')}
                helperText={hasError('birthDate') ? errors.birthDate : ''}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: <CakeIcon sx={{ color: hasError('birthDate') ? '#f44336' : "#5da9a7", mr: 1 }} />,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    "&:hover fieldset": { borderColor: hasError('birthDate') ? '#f44336' : "#5da9a7" },
                    "&.Mui-focused fieldset": { borderColor: hasError('birthDate') ? '#f44336' : "#5da9a7" },
                  },
                  "& .MuiInputLabel-root.Mui-focused": { color: hasError('birthDate') ? '#f44336' : "#5da9a7" },
                }}
              />

              {/* NIC */}
              <TextField
                name="nic"
                label="NIC"
                value={formData.nic}
                onChange={handleInputChange}
                onBlur={handleBlur}
                required
                fullWidth
                error={hasError('nic')}
                helperText={hasError('nic') ? errors.nic : ''}
                InputProps={{
                  startAdornment: <BadgeIcon sx={{ color: hasError('nic') ? '#f44336' : "#5da9a7", mr: 1 }} />,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    "&:hover fieldset": { borderColor: hasError('nic') ? '#f44336' : "#5da9a7" },
                    "&.Mui-focused fieldset": { borderColor: hasError('nic') ? '#f44336' : "#5da9a7" },
                  },
                  "& .MuiInputLabel-root.Mui-focused": { color: hasError('nic') ? '#f44336' : "#5da9a7" },
                }}
              />

              {/* Phone */}
              <TextField
                name="phone"
                label="Contact Number"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                onBlur={handleBlur}
                required
                fullWidth
                error={hasError('phone')}
                helperText={hasError('phone') ? errors.phone : ''}
                InputProps={{
                  startAdornment: <PhoneIcon sx={{ color: hasError('phone') ? '#f44336' : "#5da9a7", mr: 1 }} />,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    "&:hover fieldset": { borderColor: hasError('phone') ? '#f44336' : "#5da9a7" },
                    "&.Mui-focused fieldset": { borderColor: hasError('phone') ? '#f44336' : "#5da9a7" },
                  },
                  "& .MuiInputLabel-root.Mui-focused": { color: hasError('phone') ? '#f44336' : "#5da9a7" },
                }}
              />

              {/* Email */}
              <TextField
                name="email"
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleBlur}
                required
                fullWidth
                error={hasError('email')}
                helperText={hasError('email') ? errors.email : ''}
                InputProps={{
                  startAdornment: <EmailIcon sx={{ color: hasError('email') ? '#f44336' : "#5da9a7", mr: 1 }} />,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    "&:hover fieldset": { borderColor: hasError('email') ? '#f44336' : "#5da9a7" },
                    "&.Mui-focused fieldset": { borderColor: hasError('email') ? '#f44336' : "#5da9a7" },
                  },
                  "& .MuiInputLabel-root.Mui-focused": { color: hasError('email') ? '#f44336' : "#5da9a7" },
                }}
              />

              {/* Address */}
              <TextField
                name="address"
                label="Address"
                value={formData.address}
                onChange={handleInputChange}
                onBlur={handleBlur}
                required
                fullWidth
                multiline
                rows={2}
                error={hasError('address')}
                helperText={hasError('address') ? errors.address : ''}
                InputProps={{
                  startAdornment: <LocationOnIcon sx={{ color: hasError('address') ? '#f44336' : "#5da9a7", mr: 1, alignSelf: "flex-start", mt: 1 }} />,
                }}
                sx={{
                  gridColumn: { md: "1 / -1" },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    "&:hover fieldset": { borderColor: hasError('address') ? '#f44336' : "#5da9a7" },
                    "&.Mui-focused fieldset": { borderColor: hasError('address') ? '#f44336' : "#5da9a7" },
                  },
                  "& .MuiInputLabel-root.Mui-focused": { color: hasError('address') ? '#f44336' : "#5da9a7" },
                }}
              />
            </Box>

            <Divider sx={{ width: "100%", mt: 4, mb: 2 }} />

            <Typography variant="body2" sx={{ color: "#777", fontSize: "12px", textAlign: "center", mb: 3 }}>
              🔒 Your information is securely encrypted and stored
            </Typography>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Button
                onClick={handleBack}
                variant="outlined"
                disabled={loading}
                sx={{
                  color: "#5da9a7",
                  borderColor: "#5da9a7",
                  "&:hover": { 
                    backgroundColor: "#f0f8f7",
                    borderColor: "#4c9995"
                  },
                  "&:disabled": { 
                    color: "#a0c4c2",
                    borderColor: "#a0c4c2"
                  },
                  borderRadius: "8px",
                  padding: "10px 24px",
                  fontWeight: 500,
                  minWidth: "120px",
                }}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="contained"
                disabled={loading || Object.keys(errors).some(key => errors[key])}
                startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
                sx={{
                  backgroundColor: "#5da9a7",
                  "&:hover": { backgroundColor: "#4c9995" },
                  "&:disabled": { backgroundColor: "#a0c4c2" },
                  borderRadius: "8px",
                  padding: "10px 24px",
                  fontWeight: 500,
                  minWidth: "120px",
                  boxShadow: "0px 2px 8px rgba(93, 169, 167, 0.25)",
                }}
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default EditProfilePage;