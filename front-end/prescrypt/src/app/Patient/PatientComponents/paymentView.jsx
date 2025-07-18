import React, { useState, useContext } from "react";
import { AppointmentContext } from "../Bookings/Payments/[id]/page";
import PaymentAtLocation from "./paymentAtLocation";

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

  const buttonBaseClass =
    "border-2 rounded-xl py-4 px-8 font-semibold transition-all duration-300 shadow-sm hover:shadow-lg";

  return (
    <div className="p-8 flex flex-wrap justify-between gap-12 w-full max-w-7xl mx-auto">
      {/* Left Section */}
      <div className="flex flex-col space-y-12 flex-1 min-w-[320px] max-w-[480px]">
        {/* Payment Method Selection */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
          <div className="h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full mb-6"></div>
          <h2 className="text-xl font-bold text-gray-800 mb-6">Choose Payment Method</h2>
          
          <div className="flex flex-col space-y-4">
            <button
              className={`${buttonBaseClass} ${
                selectedMethod === "location"
                  ? "bg-green-200 border-green-600 text-green-800 shadow-lg ring-2 ring-green-200"
                  : "bg-white border-black text-black hover:bg-green-100 hover:border-green-600 hover:text-green-700"
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
                  ? "bg-green-200 border-green-600 text-green-800 shadow-lg ring-2 ring-green-200"
                  : "bg-white border-black text-black hover:bg-green-100 hover:border-green-600 hover:text-green-700"
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
    </div>
  );
};

export default PaymentView;