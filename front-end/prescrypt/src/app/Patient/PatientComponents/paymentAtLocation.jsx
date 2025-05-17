import React, { useState, useEffect, useContext } from "react";
import PaymentConfirmation from "./paymentConfirmation";
import {
  addPayment,
  createAppointment,
  sendFailureEmail,
  sendFailureNotification,
} from "../services/PatientPaymentServices";
import { AppointmentContext } from "../Bookings/Payments/[id]/page";

const PaymentAtLocation = ({selectedMethod, totalCharge, onlineFee}) => {
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
    patientId = "P021",
    email = "dewminkasmitha30@gmail.com",
  } = useContext(AppointmentContext);

  const doctorName = `${doctorFirstName} ${doctorLastName}`;

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

  const handleConfirmBooking = async () => {
    if (selectedMethod === "location") {
      if (!checkbox1Checked || !checkbox2Checked) {
        alert("Please confirm both checkboxes to proceed.");
        return;
      }
      handleCreateAppointment();
    } else if (selectedMethod === "online") {
      if (!payhereReady) {
        alert("Payment gateway is not ready yet. Please wait.");
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
          handleCreateAppointment();
        };

        window.payhere.onDismissed = function () {
          console.log("Payment dismissed");
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
        alert("Failed to initiate payment.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCreateAppointment = async () => {
    const paymentPayload = {
      paymentId,
      paymentAmount: totalCharge,
      paymentMethod: selectedMethod === "online" ? "Card" : "Location",
      paymentStatus: selectedMethod === "online" ? "Done" : "Pending",
    };

    try {
      await addPayment(paymentPayload);

      const appointmentData = {
        patientId: patientId || "P021",
        doctorId: doctorId || "D008",
        hospitalId: hospitalId || "H027",
        date: appointmentDate,
        time: appointmentTime,
        paymentId,
        charge: totalCharge,
        status: "Pending",
        typeOfAppointment: selectedMethod === "online" ? "Online" : "PayAtLocation",
      };

      await createAppointment(appointmentData);
      setCheckbox1Checked(false);
      setCheckbox2Checked(false);
      setConfirmationOpen(true);
    } catch (error) {
      console.error("Failed to save appointment:", error);
      alert("Error occurred. Try again.");
    }
  };

  const handleCloseConfirmation = () => {
    setConfirmationOpen(false);
    window.location.href = "/Patient/PatientAppointments";
  };

  return (
    <div className="w-full max-w-[600px] p-10 border-2 border-[#B9E9EC] rounded-md">
      <h3 className="underline font-semibold text-lg mb-4">Appointment Summary</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between"><span>PaymentID</span><span>{paymentId}</span></div>
        <div className="flex justify-between"><span>Total Charge</span><span>Rs. {totalCharge}.00</span></div>
        <div className="flex justify-between"><span>Doctor</span><span>Dr. {doctorName}</span></div>
        <div className="flex justify-between"><span>Specialization</span><span>{specialization}</span></div>
        <div className="flex justify-between"><span>Hospital</span><span>{hospitalName}</span></div>
        <div className="flex justify-between"><span>Date</span><span>{appointmentDate}</span></div>
        <div className="flex justify-between"><span>Time</span><span>{appointmentTime}</span></div>
        <p className="text-xs mt-2 text-gray-600">
          Be on time. You can pay online or at the location and receive treatment.
        </p>
      </div>

      {selectedMethod === "location" && (
        <div className="mt-6 space-y-3 text-sm text-gray-700">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="accent-green-600" checked={checkbox1Checked} onChange={() => setCheckbox1Checked(!checkbox1Checked)} />
            I confirm that I read the appointment summary and will attend on time.
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="accent-green-600" checked={checkbox2Checked} onChange={() => setCheckbox2Checked(!checkbox2Checked)} />
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

      <PaymentConfirmation
        open={confirmationOpen}
        handleClose={handleCloseConfirmation}
        email={email}
        totalCharge={totalCharge}
        platformCharge={onlineFee}
      />
    </div>
  );
};

export default PaymentAtLocation;
