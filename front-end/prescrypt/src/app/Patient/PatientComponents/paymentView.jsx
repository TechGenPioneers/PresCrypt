import React, { useState, useContext } from "react";
import { AppointmentContext } from "../Bookings/Payments/[id]/page";
import PaymentAtLocation from "./paymentAtLocation";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const RefundPolicyDialog = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "20px",
          padding: "24px 20px",
          border: "2px solid #4CAF50",
          backgroundColor: "#fffdfd",
          boxShadow: "0px 6px 30px rgba(0, 0, 0, 0.15)",
          minWidth: "400px",
          maxWidth: "500px",
        },
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{ 
          position: "absolute", 
          top: 12, 
          right: 12,
          color: "#4CAF50",
          "&:hover": { backgroundColor: "rgba(76, 175, 80, 0.1)" }
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent className="flex flex-col items-center text-center" sx={{ pt: 2 }}>
        <InfoOutlinedIcon sx={{ fontSize: 60, color: "#4CAF50", mb: 2 }} />
        <Typography
          variant="h6"
          sx={{ fontWeight: "700", color: "#2E7D32", mb: 3 }}
        >
          Refund Policy
        </Typography>
        
        <div className="text-left w-full space-y-3">
          <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded-r-lg">
            <Typography
              variant="body2"
              sx={{ color: "#B71C1C", fontWeight: "600", fontSize: "0.9rem" }}
            >
              • Cancelling 2 Pay At Location appointments within two weeks will result in permanent inactivation of the patient account automatically by the system but still you can appeal the decision through the contact us page.
            </Typography>
          </div>
          
          <div className="bg-green-50 border-l-4 border-green-400 p-3 rounded-r-lg">
            <Typography
              variant="body2"
              sx={{ color: "#2E7D32", fontWeight: "500", fontSize: "0.9rem" }}
            >
              • Cancelling Online Paid booking before 48 hours to the appointment will result in full appointment payment refund.
            </Typography>
          </div>
          
          <div className="bg-orange-50 border-l-4 border-orange-400 p-3 rounded-r-lg">
            <Typography
              variant="body2"
              sx={{ color: "#E65100", fontWeight: "500", fontSize: "0.9rem" }}
            >
              • Cancelling Online Paid booking within 48 hours to the appointment will result in 80% of the appointment payment refund.
            </Typography>
          </div>
        </div>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", pt: 2 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            backgroundColor: "#00897B",  
            color: "#fff",
            "&:hover": { backgroundColor: "#00796B" },  
            borderRadius: "20px",
            px: 4,
            py: 1,
            fontWeight: "600",
            fontSize: "0.9rem",
            textTransform: "none",
            boxShadow: "0px 3px 8px rgba(76, 175, 80, 0.3)",
          }}
        >
          I Understood and Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const PaymentView = () => {
  const {
    hospitalCharge,
    doctorCharge,
  } = useContext(AppointmentContext);

  const onlineFee = 200.0;
  const hospitalFee = parseFloat(hospitalCharge) || 0;
  const doctorFee = parseFloat(doctorCharge) || 0;
  const totalCharge = hospitalFee + doctorFee + onlineFee;

  const [selectedMethod, setSelectedMethod] = useState(null);
  const [refundPolicyOpen, setRefundPolicyOpen] = useState(false);

  const buttonBaseClass =
    "border-2 rounded-xl py-4 px-8 font-semibold transition-all duration-300 shadow-sm hover:shadow-lg";

  return (
    <div className="p-8 flex flex-wrap justify-between gap-12 w-full max-w-7xl mx-auto">
      {/* Left Section */}
      <div className="flex flex-col space-y-12 flex-1 min-w-[320px] max-w-[480px]">
        {/* Payment Method Selection */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
          <div className="h-1 bg-gradient-to-r from-teal-400 to-teal-600 rounded-full mb-6"></div>
          <h2 className="text-xl font-bold text-gray-800 mb-6">Choose Payment Method</h2>
          
          <div className="flex flex-col space-y-4">
            <button
              className={`${buttonBaseClass} ${
                selectedMethod === "location"
                  ? "bg-teal-200 border-teal-600 text-teal-800 shadow-lg ring-2 ring-teal-200"
                  : "bg-white border-black text-black hover:bg-green-100 hover:border-teal-600 hover:text-teal-700"
              }`}
              onClick={() => setSelectedMethod("location")}
            >
              <div className="flex items-center justify-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Pay at the Location
              </div>
            </button>
            
            <button
              className={`${buttonBaseClass} ${
                selectedMethod === "online"
                  ? "bg-teal-200 border-teal-600 text-teal-800 shadow-lg ring-2 ring-teal-200"
                  : "bg-white border-black text-black hover:bg-teal-100 hover:border-teal-600 hover:text-teal-700"
              }`}
              onClick={() => setSelectedMethod("online")}
            >
              <div className="flex items-center justify-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Online Payment
              </div>
            </button>
          </div>

          {/* Refund Policy Button */}
          <div className="mt-6 text-center">
            <button
              className="px-4 py-2 border border-teal-300 rounded-md text-white bg-teal-600 hover:bg-teal-700 shadow-sm flex justify-center items-center mx-auto min-w-[180px] transition-all duration-200"
              onClick={() => setRefundPolicyOpen(true)}
            >
              <InfoOutlinedIcon sx={{ fontSize: 18, mr: 1 }} />
              View Our Refund Policy
            </button>
          </div>
        </div>

        {/* Pricing Breakdown */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
          <div className="h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mb-6"></div>
          <h3 className="text-xl font-bold text-gray-800 mb-6">Payment Breakdown</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Doctor Fee</span>
              <span className="font-semibold text-gray-800">Rs. {doctorFee}.00</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Hospital Fee</span>
              <span className="font-semibold text-gray-800">Rs. {hospitalFee}.00</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Online Handling Fee (PresCrypt)</span>
              <span className="font-semibold text-gray-800">Rs. {onlineFee}.00</span>
            </div>
            <div className="flex justify-between items-center py-4 bg-blue-50 rounded-xl px-4 border-2 border-blue-200">
              <span className="text-lg font-bold text-blue-800">Total charges</span>
              <span className="text-lg font-bold text-blue-800">Rs. {totalCharge}.00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex-1 min-w-[320px] max-w-[480px]">
        <PaymentAtLocation
          selectedMethod={selectedMethod}
          totalCharge={totalCharge}
          onlineFee={onlineFee}
        />
      </div>

      {/* Refund Policy Dialog */}
      <RefundPolicyDialog
        open={refundPolicyOpen}
        onClose={() => setRefundPolicyOpen(false)}
      />
    </div>
  );
};

export default PaymentView;