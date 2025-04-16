import React, { useState, useEffect } from "react";
import axios from "axios";
import PaymentConfirmation from "./paymentConfirmation"; // Import the confirmation component

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
  email = "dewminkasmitha30@gmail.com", // email passed as a prop or default
}) => {
  const [checkbox1Checked, setCheckbox1Checked] = useState(false);
  const [checkbox2Checked, setCheckbox2Checked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [payhereReady, setPayhereReady] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.payhere.lk/lib/payhere.js";
    script.async = true;
    script.onload = () => {
      setPayhereReady(true);
      console.log("PayHere script loaded.");
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    setCheckbox1Checked(false);
    setCheckbox2Checked(false);
  }, [selectedMethod]);

  const handleCheckbox1Change = (e) => setCheckbox1Checked(e.target.checked);
  const handleCheckbox2Change = (e) => setCheckbox2Checked(e.target.checked);

  const handleConfirmBooking = async () => {
    if (selectedMethod === "location") {
      if (!checkbox1Checked || !checkbox2Checked) {
        alert("Please mark both confirmations before proceeding.");
        return;
      }
      handleCreateAppointment();
    } else if (selectedMethod === "online") {
      if (!payhereReady) {
        alert("Payment gateway not ready yet. Please try again in a few seconds.");
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
            email: email,
            phone: "0771234567",
            address: "Colombo 07",
            city: "Colombo",
            country: "Sri Lanka",
          }),
        });
        
        const obj = await res.json();
        
      

        window.payhere.onCompleted = function (orderId) {
          console.log("Payment completed. OrderID:", orderId);
          handleCreateAppointment();
        };

        window.payhere.onDismissed = function () {
          console.log("Payment dismissed");
        };

        window.payhere.onError = function (error) {
          console.error("Payment error:", error);
        };

        const payment = {
          sandbox: true,
          merchant_id: obj.merchant_id,
          return_url: "http://localhost:3000",
          cancel_url: "http://localhost:3000",
          notify_url: "http://sample.com/notify",
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
          delivery_address: "No. 46, Galle road, Kalutara South",
          delivery_city: "Kalutara",
          delivery_country: "Sri Lanka",
        };

        window.payhere.startPayment(payment);
      } catch (err) {
        console.error("Payment init error:", err);
        alert("Failed to load payment gateway.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCreateAppointment = async () => {
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
      setCheckbox1Checked(false);
      setCheckbox2Checked(false);
      setConfirmationOpen(true);
    } catch (error) {
      console.error("Appointment creation failed:", error);
      alert("Failed to confirm booking. Please try again.");
    }
  };

  const handleCloseConfirmation = () => {
    setConfirmationOpen(false);
    window.location.href = "http://localhost:3000/Patient/PatientAppointments";
  };

  return (
    <div className="w-full max-w-[600px] p-10 border-2 border-[#B9E9EC] rounded-md">
      <h3 className="underline font-semibold text-lg mb-4">Appointment Summary</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between"><span>PaymentID</span><span>PA21-345</span></div>
        <div className="flex justify-between"><span>Total bill payment</span><span>Rs. {totalCharge}.00</span></div>
        <div className="flex justify-between"><span>Doctor</span><span>Dr. {doctorName}</span></div>
        <div className="flex justify-between"><span>Specialization</span><span>{specialization}</span></div>
        <div className="flex justify-between"><span>Venue</span><span>{hospital}</span></div>
        <div className="flex justify-between"><span>Building/Room</span><span>TBD</span></div>
        <div className="flex justify-between"><span>Date</span><span>{appointmentDate}</span></div>
        <div className="flex justify-between"><span>Time</span><span>{appointmentTime}</span></div>
        <p className="text-xs text-justify text-gray-600 mt-2">
          Be on time confirming your booking. You can pay online or at the location and get treatments.
        </p>
      </div>

      {selectedMethod === "location" && (
        <div className="mt-6 space-y-3 text-sm text-gray-700">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="accent-green-600" checked={checkbox1Checked} onChange={handleCheckbox1Change} />
            I confirm that I read the appointment summary and will attend on time.
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="accent-green-600" checked={checkbox2Checked} onChange={handleCheckbox2Change} />
            I’m aware that not attending without notice may affect future bookings.
          </label>
        </div>
      )}

      <button
        className="mt-6 bg-[#D3F2F1] text-black border-2 border-black rounded-md py-2 px-4 w-full font-semibold"
        onClick={handleConfirmBooking}
        disabled={loading}
      >
        {loading ? "Processing..." : "Confirm the Booking"}
      </button>

      {/* Success Dialog */}
      <PaymentConfirmation
        open={confirmationOpen}
        handleClose={handleCloseConfirmation}
        email={email}
      />
    </div>
  );
};

export default PaymentAtLocation;
