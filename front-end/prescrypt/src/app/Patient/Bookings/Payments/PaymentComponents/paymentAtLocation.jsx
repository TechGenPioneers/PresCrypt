import React from "react";

const PaymentAtLocation = () => {
  return (
    <div className="w-[400px] p-6 border-2 border-[#B9E9EC] rounded-md">
      <h3 className="underline font-semibold text-lg mb-4">Appointment Summary</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>PaymentID</span>
          <span>PA21-345</span>
        </div>
        <div className="flex justify-between">
          <span>Total bill payment</span>
          <span>Rs. 2030.00</span>
        </div>
        <div className="flex justify-between">
          <span>Doctor’s Name</span>
          <span>Dr.Saman De Silva</span>
        </div>
        <div className="flex justify-between">
          <span>Venue</span>
          <span>Asiri Hospital</span>
        </div>
        <div className="flex justify-between">
          <span>Building/Room</span>
          <span>TBD - Ask From the Reception</span>
        </div>
        <div className="flex justify-between">
          <span>Time</span>
          <span>14.00 PM</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Date</span>
          <span>02/12/2024</span>
        </div>
        <p className="text-xs text-justify text-gray-600 mt-2">
          *Be sure to be on time confirming your booking. You can do your payment at the above location
          on the appointed date and get treatments from your doctor. Further details emailed once you
          confirm the booking. After that provide it at the reception and do the payments.*
        </p>
      </div>

      <button className="mt-6 bg-[#D3F2F1] text-black border-2 border-black rounded-md py-2 px-4 w-full font-semibold">
        Confirm the Booking
      </button>
    </div>
  );
};

export default PaymentAtLocation;
