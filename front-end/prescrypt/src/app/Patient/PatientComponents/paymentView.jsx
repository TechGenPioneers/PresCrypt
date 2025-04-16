import React, { useState } from "react";
import PaymentAtLocation from "./paymentAtLocation";

const PaymentView = ({
  hospitalCharge,
  doctorCharge,
  hospital,
  specialization,
  appointmentDate,
  appointmentTime,
  doctorName,
}) => {
  const onlineFee = 200.0;
  const hospitalFee = parseFloat(hospitalCharge) || 0;
  const doctorFee = parseFloat(doctorCharge) || 0;
  const totalCharge = hospitalFee + doctorFee + onlineFee;

  const [selectedMethod, setSelectedMethod] = useState(null);

  const buttonBaseClass =
    "border-2 rounded-md py-2 px-6 font-semibold transition-colors duration-200";

  return (
    <div className="p-6 flex flex-wrap justify-between gap-8 w-full max-w-6xl mx-auto">
      {/* Left Section */}
      <div className="flex flex-col space-y-10 flex-1 min-w-[280px] max-w-[450px]">
        <div className="flex flex-col space-y-4">
          <button
            className={`${buttonBaseClass} ${
              selectedMethod === "location"
                ? "bg-green-200 border-green-600 text-green-800"
                : "bg-white border-black text-black hover:bg-green-100 hover:border-green-600 hover:text-green-700"
            }`}
            onClick={() => setSelectedMethod("location")}
          >
            Pay at the Location
          </button>
          <button
            className={`${buttonBaseClass} ${
              selectedMethod === "online"
                ? "bg-green-200 border-green-600 text-green-800"
                : "bg-white border-black text-black hover:bg-green-100 hover:border-green-600 hover:text-green-700"
            }`}
            onClick={() => setSelectedMethod("online")}
          >
            Online Payment
          </button>
        </div>

        <div className="border-2 border-[#B9E9EC] rounded-md p-6">
          <h3 className="text-lg font-semibold mb-4">Total Amount</h3>
          <div className="flex justify-between mb-2">
            <span>Doctor Fee</span>
            <span>Rs. {doctorFee}.00</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Hospital Fee</span>
            <span>Rs. {hospitalFee}.00</span>
          </div>
          <div className="flex justify-between mb-4">
            <span>Online Handling Fee (PresCrypt)</span>
            <span>{onlineFee}.00</span>
          </div>
          <div className="flex justify-between font-bold text-blue-700 text-lg">
            <span>Total charges</span>
            <span>Rs. {totalCharge}.00</span>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex-1 min-w-[300px] max-w-[450px]">
        <PaymentAtLocation
          totalCharge={totalCharge}
          hospital={hospital}
          specialization={specialization}
          appointmentDate={appointmentDate}
          doctorName={doctorName}
          appointmentTime={appointmentTime}
          selectedMethod={selectedMethod}
        />
      </div>
    </div>
  );
};

export default PaymentView;
