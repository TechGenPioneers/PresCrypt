"use client";
import React, { useState, useEffect, useContext, useRef } from "react";
import PaymentConfirmation from "./paymentConfirmation";
import AlertDialogBox from "./alertDialogBox";
import {
  addPayment,
  createAppointment,
  sendFailureEmail,
  sendFailureNotification,
} from "../services/PatientPaymentServices";
import { AppointmentContext } from "../Bookings/Payments/[id]/page";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  TextField,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const PaymentAtLocation = ({ selectedMethod, totalCharge, onlineFee }) => {
  const {
    paymentId,
    hospitalName,
    specialization,
    appointmentDate,
    appointmentTime,
    doctorFirstName,
    doctorLastName,
    hospitalId,
    doctorId,
    patientId,
    email,
  } = useContext(AppointmentContext);

  const doctorName = `${doctorFirstName} ${doctorLastName}`;

  const [checkbox1Checked, setCheckbox1Checked] = useState(false);
  const [checkbox2Checked, setCheckbox2Checked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [payhereReady, setPayhereReady] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState(Array(6).fill(""));
  const [payhereOrderId, setPayhereOrderId] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const inputRefs = useRef([]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.payhere.lk/lib/payhere.js";
    script.async = true;
    script.onload = () => setPayhereReady(true);
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  useEffect(() => {
    setCheckbox1Checked(false);
    setCheckbox2Checked(false);
  }, [selectedMethod]);

  const handleConfirmBooking = async () => {
    if (loading) return; // Prevent multiple clicks
    
    if (selectedMethod === "location") {
      if (!checkbox1Checked || !checkbox2Checked) {
        setAlertMessage("Please mark both checkboxes to confirm your booking.");
        setAlertOpen(true);
        return;
      }
      setLoading(true);
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(otp);

      try {
        await fetch("https://localhost:7021/api/PatientEmail/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        });
        setOtpDialogOpen(true);
      } catch (error) {
        console.error("Failed to send OTP:", error);
        setAlertMessage("Failed to send OTP. Please try again.");
        setAlertOpen(true);
      } finally {
        setLoading(false);
      }
    } else if (selectedMethod === "online") {
      handleOnlinePayment();
    } else {
      setAlertMessage("Please select a payment method to proceed.");
      setAlertOpen(true);
    }
  };

  const handleVerifyOtp = () => {
    if (enteredOtp.join("") === generatedOtp) {
      setOtpDialogOpen(false);
      handleCreateAppointment();
    } else {
      setAlertMessage("Incorrect OTP. Please try again.");
      setAlertOpen(true);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...enteredOtp];
    newOtp[index] = value;
    setEnteredOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleCreateAppointment = async (orderId) => {
    const paymentPayload = {
      paymentId,
      paymentAmount: totalCharge,
      paymentMethod: selectedMethod === "online" ? "Card" : "Location",
      paymentStatus: selectedMethod === "online" ? "Done" : "Pending",
      payHereObjectId: orderId,
    };
    console.log("Creating payment with payload:", paymentPayload);
    try {
      await addPayment(paymentPayload);
      const appointmentData = {
        patientId,
        doctorId,
        hospitalId: hospitalId,
        date: appointmentDate,
        time: appointmentTime,
        charge: totalCharge,
        status: "Pending",
        typeOfAppointment: selectedMethod === "online" ? "Online" : "PayAtLocation",
        paymentId,
      };
      console.log("Creating appointment with data:", appointmentData);
      await createAppointment(appointmentData);
      setCheckbox1Checked(false);
      setCheckbox2Checked(false);
      setConfirmationOpen(true);
    } catch (error) {
      console.error("Failed to save appointment:", error);
      setAlertMessage("Failed to save appointment. Please try again.");
      setAlertOpen(true);
    }
  };

  const handleOnlinePayment = async () => {
    if (!payhereReady) {
      setAlertMessage("Payment gateway is not ready yet. Please wait.");
      setAlertOpen(true);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/payhere-process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: totalCharge,
          item: `Booking for Dr. ${doctorName} on ${appointmentDate}`,
          first_name: "Dewmin",
          last_name: "Deniyegedara",
          email,
          phone: "0771234567",
          address: "Colombo 07",
          city: "Colombo",
          country: "Sri Lanka",
        }),
      });

      const obj = await res.json();

      window.payhere.onCompleted = function (orderId) {
        handleCreateAppointment(orderId);
        setPayhereOrderId(orderId);
      };

      window.payhere.onDismissed = function () {
        console.log("Payment dismissed");
        setLoading(false);
      };

      window.payhere.onError = async function (error) {
        console.error("Payment error:", error);
        try {
          await sendFailureEmail({
            receptor: email,
            title: "Payment Failed",
            message: `Your payment for Dr. ${doctorName} on ${appointmentDate} at ${appointmentTime} in ${hospitalName} has failed.`,
          });
          await sendFailureNotification({
            patientId,
            title: "Payment Failed",
            type: "Payment",
            message: `Online payment for Dr. ${doctorName} on ${appointmentDate} at ${appointmentTime} failed.`,
          });
        } catch (notifyError) {
          console.error("Failed to send failure notifications", notifyError);
        }
        alert("Payment failed. Please try again or choose pay at location.");
        setLoading(false);
      };

      const payment = {
        sandbox: true,
        merchant_id: obj.merchant_id,
        return_url: "http://localhost:3000",
        cancel_url: "http://localhost:3000",
        notify_url: "",
        order_id: obj.order_id,
        items: obj.items,
        amount: obj.amount,
        currency: obj.currency,
        hash: obj.hash,
        first_name: obj.first_name,
        last_name: obj.last_name,
        email: obj.email,
        phone: obj.phone,
        address: obj.address,
        city: obj.city,
        country: obj.country,
        delivery_address: "",
        delivery_city: "",
        delivery_country: "",
      };

      window.payhere.startPayment(payment);
    } catch (err) {
      console.error("Payment init error:", err);
      alert("Failed to initiate payment.");
      setLoading(false);
    }
  };

  const handleCloseConfirmation = () => {
    setConfirmationOpen(false);
    window.location.href = "/Patient/PatientAppointments";
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
        <div className="h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full mb-6"></div>
        
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Appointment Summary
        </h3>
        
        <div className="bg-gray-50 rounded-xl p-6 space-y-4 text-sm mb-6">
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-gray-600 font-medium">Payment ID</span>
            <span className="font-semibold text-gray-800">{paymentId}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-gray-600 font-medium">Total Charge</span>
            <span className="font-semibold text-gray-800">Rs. {totalCharge}.00</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-gray-600 font-medium">Doctor</span>
            <span className="font-semibold text-gray-800">Dr. {doctorName}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-gray-600 font-medium">Specialization</span>
            <span className="font-semibold text-gray-800">{specialization}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-gray-600 font-medium">Hospital</span>
            <span className="font-semibold text-gray-800">{hospitalName}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-gray-600 font-medium">Date</span>
            <span className="font-semibold text-gray-800">{appointmentDate}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600 font-medium">Time</span>
            <span className="font-semibold text-gray-800">{appointmentTime}</span>
          </div>
        </div>

        {selectedMethod === "location" && (
          <div className="bg-blue-50 rounded-xl p-6 space-y-4 text-sm text-gray-700 mb-6 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold text-blue-800">Please confirm the following:</span>
            </div>
            <label className="flex items-start gap-3 cursor-pointer hover:bg-blue-100 rounded-lg p-2 transition-colors">
              <input 
                type="checkbox" 
                checked={checkbox1Checked} 
                onChange={() => setCheckbox1Checked(!checkbox1Checked)}
                className="mt-1 w-4 h-4 text-green-600 rounded focus:ring-green-500"
              />
              <span>I confirm that I have read the appointment summary and will attend on time.</span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer hover:bg-blue-100 rounded-lg p-2 transition-colors">
              <input 
                type="checkbox" 
                checked={checkbox2Checked} 
                onChange={() => setCheckbox2Checked(!checkbox2Checked)}
                className="mt-1 w-4 h-4 text-green-600 rounded focus:ring-green-500"
              />
              <span>I'm aware that not attending without notice may affect future bookings.</span>
            </label>
          </div>
        )}

        <button
          className={`w-full font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 disabled:cursor-not-allowed ${
            loading 
              ? 'bg-green-400 text-white opacity-50' 
              : 'bg-green-700 hover:bg-green-600 text-white'
          }`}
          onClick={handleConfirmBooking}
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Processing...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Confirm the Booking
            </>
          )}
        </button>

        <PaymentConfirmation
          open={confirmationOpen}
          handleClose={handleCloseConfirmation}
          email={email}
          totalCharge={totalCharge}
          platformCharge={onlineFee}
          paymentId ={paymentId}
        />
      </div>

      <Dialog
        open={otpDialogOpen}
        onClose={() => setOtpDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "20px",
            padding: "20px",
            border: "2px solid #4CAF50",
            boxShadow: "0px 8px 24px rgba(76, 175, 80, 0.2)",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, textAlign: "center", pb: 1 }}>
          Enter OTP
          <IconButton onClick={() => setOtpDialogOpen(false)} sx={{ position: "absolute", right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2, textAlign: "center" }}>
            Please enter the 6-digit OTP sent to your email: <strong>{email}</strong>
          </Typography>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              marginTop: "12px",
            }}
          >
            {enteredOtp.map((digit, index) => (
              <TextField
                key={index}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                inputProps={{
                  maxLength: 1,
                  style: {
                    textAlign: "center",
                    width: "48px",
                    height: "30px",
                    border: "1px solid #4CAF50",
                    borderRadius: "8px",
                    fontSize: "20px",
                  },
                }}
                inputRef={(el) => (inputRefs.current[index] = el)}
                variant="outlined"
              />
            ))}
          </div>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", pt: 2 }}>
          <Button
            onClick={handleVerifyOtp}
            variant="contained"
            sx={{
              backgroundColor: "#4CAF50",
              borderRadius: "10px",
              fontWeight: 600,
              px: 4,
              py: 1,
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#43A047",
              },
            }}
          >
            Verify OTP
          </Button>
        </DialogActions>
      </Dialog>

      <AlertDialogBox
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
        message={alertMessage}
      />
    </>
  );
};

export default PaymentAtLocation;