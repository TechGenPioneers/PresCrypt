import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import axios from "axios"; // <- Don't forget to install axios if not already

const PaymentAtLocation = ({
  totalCharge,
  hospital,
  specialization,
  appointmentDate,
  appointmentTime,
  doctorId,
  patientId,
  hospitalId,
  doctorName,
  selectedMethod,
}) => {
  const [checkbox1Checked, setCheckbox1Checked] = useState(false);
  const [checkbox2Checked, setCheckbox2Checked] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCheckbox1Change = (event) => {
    setCheckbox1Checked(event.target.checked);
  };

  const handleCheckbox2Change = (event) => {
    setCheckbox2Checked(event.target.checked);
  };

  const handleConfirmBooking = async () => {
    if (!checkbox1Checked || !checkbox2Checked) {
      alert("Please mark both confirmations before proceeding.");
      return;
    }

    const appointmentData = {
      patientId: patientId || "P021",
      doctorId: doctorId || "D009",
      hospitalId: hospitalId || "H027",
      date: appointmentDate,
      time: appointmentTime,
      charge: totalCharge,
      status: "Pending",
      typeOfAppointment: "Consultation",
    };

    try {
      await axios.post("https://localhost:7021/api/Appointments", appointmentData);
      setDialogOpen(true); // Show success dialog
      setCheckbox1Checked(false); // Reset checkboxes
      setCheckbox2Checked(false);
    } catch (error) {
      console.error("Appointment creation failed:", error);
      alert("Failed to confirm booking. Please try again.");
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    // Redirect after closing the dialog
    window.location.href = "http://localhost:3000/Patient/PatientAppointments";
  };

  return (
    <div className="w-full max-w-[600px] p-10 border-2 border-[#B9E9EC] rounded-md">
      <h3 className="underline font-semibold text-lg mb-4">Appointment Summary</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>PaymentID</span>
          <span>PA21-345</span>
        </div>
        <div className="flex justify-between">
          <span>Total bill payment for the appointment</span>
          <span>Rs. {totalCharge}.00</span>
        </div>
        <div className="flex justify-between">
          <span>Doctor’s Name</span>
          <span>Dr. {doctorName}</span>
        </div>
        <div className="flex justify-between">
          <span>Specialization</span>
          <span>{specialization}</span>
        </div>
        <div className="flex justify-between">
          <span>Venue</span>
          <span>{hospital}</span>
        </div>
        <div className="flex justify-between">
          <span>Building/Room</span>
          <span>TBD - Ask From the Reception</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Date</span>
          <span>{appointmentDate}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Time</span>
          <span>{appointmentTime}</span>
        </div>

        <p className="text-xs text-justify text-gray-600 mt-2">
          Be sure to be on time confirming your booking. You can do your payment at the above location
          on the appointed date and get treatments from your doctor. Further details emailed once you
          confirm the booking. After that, provide it at the reception and do the payments.
        </p>
      </div>

      {selectedMethod === "location" && (
        <div className="mt-6 space-y-3 text-sm text-gray-700">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="accent-green-600"
              checked={checkbox1Checked}
              onChange={handleCheckbox1Change}
            />
            I confirm that I read the appointment summary and try to attend on time.
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="accent-green-600"
              checked={checkbox2Checked}
              onChange={handleCheckbox2Change}
            />
            I am aware that not attending the appointment without prior notice to the hospital may affect my future bookings with PresCrypt.
          </label>
        </div>
      )}

      <button
        className="mt-6 bg-[#D3F2F1] text-black border-2 border-black rounded-md py-2 px-4 w-full font-semibold"
        onClick={handleConfirmBooking}
      >
        Confirm the Booking
      </button>

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Booking Confirmation</DialogTitle>
        <DialogContent>
          <p>Your appointment has been successfully confirmed!</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PaymentAtLocation;
