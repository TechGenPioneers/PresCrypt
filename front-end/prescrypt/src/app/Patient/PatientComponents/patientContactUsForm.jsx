"use client";

import { useState } from "react";
import { sendPatientContactUs } from "../services/PatientDataService"; 
import AlertDialogBox from "./alertDialogBox"; 
import { teal } from "@mui/material/colors";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const TermsDialog = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "20px",
          padding: "20px",
          border: "2px solid #4CAF50",
          backgroundColor: "rgba(255, 253, 253, 0.95)",
          backdropFilter: "blur(10px)",
          boxShadow: "0px 10px 40px rgba(0, 0, 0, 0.2)",
          margin: "16px",
        },
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{ 
          position: "absolute", 
          top: 12, 
          right: 12,
          color: teal[600], // teal-600
          "&:hover": { backgroundColor: "rgba(13, 148, 136, 0.1)" } 
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogTitle sx={{ 
        fontWeight: "700", 
        color: "#0f766e", 
        textAlign: "center",
        fontSize: "1.5rem",
        pb: 2
      }}>
        Terms and Conditions
      </DialogTitle>

      <DialogContent 
        dividers
        sx={{
          maxHeight: "400px",
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#f1f1f1",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#4CAF50",
            borderRadius: "10px",
          },
        }}
      >
        <Typography variant="body1" paragraph sx={{ color: "#0f766e", fontWeight: "500" }}>
          Welcome to our platform! By submitting this form, you agree to the following terms and conditions:
        </Typography>
        <Typography variant="body2" paragraph sx={{ color: "#555", lineHeight: 1.6 }}>
          1. Your personal information will be kept confidential and used only for service purposes.
        </Typography>
        <Typography variant="body2" paragraph sx={{ color: "#555", lineHeight: 1.6 }}>
          2. Submitting false or misleading information may lead to suspension of your account.
        </Typography>
        <Typography variant="body2" paragraph sx={{ color: "#555", lineHeight: 1.6 }}>
          3. We reserve the right to update these terms at any time, with notice on our platform.
        </Typography>
        <Typography variant="body2" paragraph sx={{ color: "#555", lineHeight: 1.6 }}>
          4. You agree not to misuse our services or attempt unauthorized access.
        </Typography>
        <Typography variant="body2" paragraph sx={{ color: "#555", lineHeight: 1.6 }}>
          5. Please describe your full problem descriptively.
        </Typography>
        <Typography variant="body2" paragraph sx={{ color: "#0f766e", fontWeight: "500" }}>
          Thank you for understanding and cooperating.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", pt: 2 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            backgroundColor: "#0d9488", 
            color: "#fff",
            "&:hover": {
              backgroundColor: "#0f766e", 
            },
            borderRadius: "25px",
            padding: "10px 30px",
            fontWeight: "600",
            fontSize: "0.95rem",
            textTransform: "none",
            boxShadow: "0px 4px 15px rgba(13, 148, 136, 0.3)", 
                      }}
        >
          I Understand and Accept
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const ContactUsForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    topic: "",
    message: "",
    termsAccepted: false,
  });

  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const userId = localStorage.getItem("patientId");
  const role = localStorage.getItem("userRole");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.termsAccepted) {
      setAlertMessage("Please accept the terms and conditions to proceed");
      setAlertOpen(true);
      return;
    }

    const dataload = {
      userId: userId,
      role: role ? role.toLowerCase() : "", 
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      topic: formData.topic,
      description: formData.message,
    };

    try {
      console.log("Submitting data:", dataload);
      await sendPatientContactUs(dataload);
      setAlertMessage("Submission successful! We will get back to you soon.");
      setAlertOpen(true);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        topic: "",
        message: "",
        termsAccepted: false,
      });
    } catch (error) {
      console.error("Submission failed", error);
      setAlertMessage("Submission failed.");
      setAlertOpen(true);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center p-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 md:p-8 rounded-3xl shadow-xl w-full max-w-2xl mx-auto space-y-5 border border-green-300/30"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-teal-700 mb-2">Contact Us</h2>
            <p className="text-teal-600/80 text-sm md:text-base">Your Personal Health Hub</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              className="border border-green-300/30 focus:ring-2 focus:ring-green-500/30 focus:border-green-500/50 p-3 rounded-xl w-full bg-white/40 backdrop-blur-sm transition-all duration-200"
              required
            />
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className="border border-green-300/30 focus:ring-2 focus:ring-green-500/30 focus:border-green-500/50 p-3 rounded-xl w-full bg-white/40 backdrop-blur-sm transition-all duration-200"
              required
            />
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
              title="Please enter a valid email address"
              className="border border-green-300/30 focus:ring-2 focus:ring-green-500/30 focus:border-green-500/50 p-3 rounded-xl w-full bg-white/40 backdrop-blur-sm transition-all duration-200"
              required
            />
            <input
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Phone Number"
              pattern="^\d{10,15}$"
              title="Enter a valid phone number (10 to 15 digits)"
              className="border border-green-300/30 focus:ring-2 focus:ring-green-500/30 focus:border-green-500/50 p-3 rounded-xl w-full bg-white/40 backdrop-blur-sm transition-all duration-200"
            />

          </div>

          <select
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            className="border border-green-300/30 focus:ring-2 focus:ring-green-500/30 focus:border-green-500/50 p-3 rounded-xl w-full bg-white/40 backdrop-blur-sm transition-all duration-200"
            required
          >
            <option value="">Select Topic...</option>
            <option value="appointment">Appointment</option>
            <option value="prescription">Prescription</option>
            <option value="technical">Technical Support</option>
            <option value="complaint">Complaint</option>
            <option value="feedback">Feedback</option>
            <option value="other">Other</option>
          </select>

          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell us more..."
            rows={4}
            className="border border-green-300/30 focus:ring-2 focus:ring-green-500/30 focus:border-green-500/50 p-3 rounded-xl w-full bg-white/40 backdrop-blur-sm transition-all duration-200 resize-none"
            required
          />

          <div className="flex items-start space-x-3 p-4 bg-white/30 rounded-xl border border-green-200/30">
            <input
              type="checkbox"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleChange}
              className="mt-1 w-4 h-4 accent-teal-600 rounded"
              required
            />
            <label className="text-sm text-teal-700 leading-relaxed">
              I accept the{" "}
              <span
                onClick={() => setIsTermsOpen(true)}
                className="underline cursor-pointer text-teal-800 hover:text-teal-900 font-medium transition-colors duration-200"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setIsTermsOpen(true);
                  }
                }}
              >
                Terms and Conditions
              </span>
            </label>
          </div>

          <div className="text-center pt-2">
            <button
              type="submit"
              className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-green-800 text-white font-semibold px-8 py-3 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Submit Message
            </button>
          </div>
        </form>
      </div>

      <TermsDialog open={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
      <AlertDialogBox
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
        message={alertMessage}
      />
    </>
  );
};

export default ContactUsForm;