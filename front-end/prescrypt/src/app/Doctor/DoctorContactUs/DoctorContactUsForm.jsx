"use client";

import { useState } from "react";
import { sendDoctorContactUs } from "../services/DoctorContactUsService";
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

// Reusable terms dialog
const TermsDialog = ({ open, onClose }) => (
  <Dialog
    open={open}
    onClose={onClose}
    maxWidth="sm"
    fullWidth
    sx={{
      "& .MuiDialog-paper": {
        borderRadius: "20px",
        padding: "30px 20px",
        border: "2px solid #4CAF50",
        backgroundColor: "#fffdfd",
        boxShadow: "0px 6px 30px rgba(0, 0, 0, 0.15)",
      },
    }}
  >
    <IconButton onClick={onClose} sx={{ position: "absolute", top: 16, right: 16 }}>
      <CloseIcon fontSize="large" />
    </IconButton>
    <DialogTitle sx={{ fontWeight: "bold", color: "#4CAF50", textAlign: "center" }}>
      Terms and Conditions
    </DialogTitle>
    <DialogContent dividers>
      <Typography variant="body1" paragraph>
        Welcome to our platform! By using our services, you agree to the following terms and conditions:
      </Typography>
      <Typography variant="body2" paragraph>
        1. Your personal information will be kept confidential and used only for service purposes.
      </Typography>
      <Typography variant="body2" paragraph>
        2. Submitting false or misleading information may lead to suspension of your account.
      </Typography>
      <Typography variant="body2" paragraph>
        3. We reserve the right to update these terms at any time, with notice on our platform.
      </Typography>
      <Typography variant="body2" paragraph>
        4. You agree not to misuse our services or attempt unauthorized access.
      </Typography>
      <Typography variant="body2" paragraph>
        5. For detailed guidelines, please visit our official documentation or contact support.
      </Typography>
    </DialogContent>
    <DialogActions sx={{ justifyContent: "center" }}>
      <Button
        onClick={onClose}
        variant="contained"
        sx={{
          backgroundColor: "#4CAF50",
          color: "#fff",
          "&:hover": { backgroundColor: "#388E3C" },
          borderRadius: "8px",
          padding: "8px 24px",
          fontWeight: 600,
        }}
      >
        I Understood and Accept
      </Button>
    </DialogActions>
  </Dialog>
);

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
      alert("You must accept the terms before submitting.");
      return;
    }

    let userId = null;
    let role = null;

    if (typeof window !== "undefined") {
      userId = localStorage.getItem("doctorId") || localStorage.getItem("patientId");
      const tempRole = localStorage.getItem("userRole");
      role = tempRole.toLowerCase();
    }

    if (!userId || !role) {
      alert("User not identified. Please log in again.");
      return;
    }

    const payload = {
      userId,
      role,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      topic: formData.topic,
      description: formData.message,
    };

    try {
      console.log("Submitting payload:", payload);
      await sendDoctorContactUs(payload); // OR switch based on role if needed
      alert("Message submitted successfully!");
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
      alert("There was a problem submitting the form.");
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-3xl mx-auto space-y-6 border border-green-200"
      >
        <h2 className="text-3xl font-bold text-center text-green-700">Contact Us</h2>
        <p className="text-center text-green-600">Your Personal Health Hub</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
            className="border border-green-300 focus:ring-green-500 focus:border-green-500 p-3 rounded-md w-full"
            required
          />
          <input
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            className="border border-green-300 focus:ring-green-500 focus:border-green-500 p-3 rounded-md w-full"
            required
          />
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="border border-green-300 focus:ring-green-500 focus:border-green-500 p-3 rounded-md w-full"
            required
          />
          <input
            name="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Phone Number"
            className="border border-green-300 focus:ring-green-500 focus:border-green-500 p-3 rounded-md w-full"
          />
        </div>

        <select
          name="topic"
          value={formData.topic}
          onChange={handleChange}
          className="border border-green-300 focus:ring-green-500 focus:border-green-500 p-3 rounded-md w-full"
          required
        >
          <option value="">Select Topic...</option>
          <option value="appointment">Appointment</option>
          <option value="prescription">Prescription</option>
          <option value="technical">Technical Support</option>
          <option value="complaint">Complaint</option>
        </select>

        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Tell us more..."
          rows={4}
          className="border border-green-300 focus:ring-green-500 focus:border-green-500 p-3 rounded-md w-full"
          required
        />

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="termsAccepted"
            checked={formData.termsAccepted}
            onChange={handleChange}
            className="accent-green-600"
            required
          />
          <label className="text-sm text-green-700">
            I accept the{" "}
            <span
              onClick={() => setIsTermsOpen(true)}
              className="underline cursor-pointer text-green-800 hover:text-green-900"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setIsTermsOpen(true);
                }
              }}
            >
              terms and conditions
            </span>
          </label>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-md transition duration-200"
          >
            Submit
          </button>
        </div>
      </form>

      <TermsDialog open={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
    </>
  );
};

export default ContactUsForm;
