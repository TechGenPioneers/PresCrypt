import React from "react";

const PaymentAtLocation = ({
  totalCharge,
  hospital,
  specialization,
  appointmentDate,
  appointmentTime,
  doctorName,
  selectedMethod,
}) => {
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
          confirm the booking. After that provide it at the reception and do the payments.
        </p>
      </div>

      {/* ✅ Show this only if user selected 'location' */}
      {selectedMethod === "location" && (
        <div className="mt-6 space-y-3 text-sm text-gray-700">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="accent-green-600" />
            I confirm that I read the appointment summary and try to attend on time.
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="accent-green-600" />
            I am aware that not attending to the appointment without prior notice to the hospital may affect to my future bookings with PresCrypt.
          </label>
        </div>
      )}

      <button className="mt-6 bg-[#D3F2F1] text-black border-2 border-black rounded-md py-2 px-4 w-full font-semibold">
        Confirm the Booking
      </button>
    </div>
  );
};

export default PaymentAtLocation;
