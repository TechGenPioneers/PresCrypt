"use client";

import { useState, useEffect } from "react";
import Header from "../../Components/header/Header";
import Footer from "../../Components/footer/Footer";
import NavBar from "../PatientComponents/navBar";
import Chatbot from "../ChatbotComponents/chatbot";
import Image from 'next/image';

const HelpUsPage = () => {
  const [price, setPrice] = useState(0);
  const [currentSentence, setCurrentSentence] = useState(0);
  const [payhereReady, setPayhereReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});


  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.payhere.lk/lib/payhere.js";
    script.async = true;
    script.onload = () => setPayhereReady(true);
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Validate only price now
  const validate = () => {
    const errs = {};
    if (price <= 0) errs.price = "Contribution amount must be greater than zero";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleContribute = async () => {
    if (!payhereReady) {
      alert("Payment gateway is not ready yet. Please wait.");
      return;
    }

    if (!validate()) {
      alert("Please select a valid contribution amount.");
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
          amount: price,
          item: `Donation to PresCrypt`,
          first_name: "Donor",
          last_name: "Anonymous",
          email: "",
          phone: "",
          address: "",
          city: "",
          country: "Sri Lanka",
        }),
      });

      const obj = await res.json();

      window.payhere.onCompleted = function (orderId) {
        alert("Thank you for your contribution!");
        setPrice(0);
        setErrors({});
      };

      window.payhere.onDismissed = function () {
        console.log("Donation payment dismissed");
      };

      window.payhere.onError = function (error) {
        console.error("Donation payment error:", error);
        alert("Payment failed. Please try again.");
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
      console.error("Error initiating donation payment:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen flex flex-col bg-gray-50">
    <div className="flex flex-grow">
     

     {/* Page content wrapper */}
        <div className="ml-[90px] group-hover:ml-[260px] w-full transition-all duration-300 pt-5 px-10 flex flex-col lg:flex-row justify-between gap-8 mt-10">
        {/* Left Side: Dynamic Text + Info Sections */}
        <div className="flex-1 space-y-6">

            {/* Dynamic Text Section */}
            <h2 className="text-3xl font-bold text-green-700 mb-2 text-center lg:text-left">
               Contribute to Us
            </h2>

            {/* Why Support Section */}
     <div>
            <p className="text-gray-700 text-base leading-relaxed font-serif">
                By supporting PresCrypt, you're helping us revolutionize digital healthcare,
                making essential services accessible to everyone, especially underserved communities while keeping our mission.
            </p>
            </div>

          {/* Our Mission Section */}
            <div className="flex flex-col lg:flex-row items-center gap-10">
            {/* Text */}
            <div className="flex-1 border border-green-300 rounded-lg p-6 bg-green-50 shadow-sm">
                <h3 className="text-xl font-semibold text-green-700 mb-4">Our Mission</h3>
                <p className="text-gray-800 text-base leading-relaxed font-serif">
                Our mission is to simplify prescription management for patients and give doctors quick, easy access to health data. We improve appointment booking process faster and smarter. Using AI we simplified the navigation and simple user queires more helpful for patients. While now focusing on connecting doctors and patients, we plan to expand the platform to hospitals and pharmacies. This will create a complete, seamless healthcare network. Ultimately, we aim to build a more efficient and connected healthcare system that benefits everyone involved.
                </p>
            </div>
            {/* Image */}
            <div className="w-full lg:w-1/2 relative rounded shadow overflow-hidden h-64">
                <Image
                src="/OurMission.jpg"
                alt="Our Mission"
                fill
                className="object-contain rounded"
                />
            </div>
            </div>

            {/* Our Story Section */}
            <div className="flex flex-col lg:flex-row items-center gap-6 mt-12">
            {/* Image */}
            <div className="w-full lg:w-1/2 relative rounded shadow overflow-hidden h-64">
                <Image
                src="/OurStory.jpg"
                alt="Our Story"
                fill
                className="object-cover rounded"
                />
            </div>
            {/* Text */}
            <div className="flex-1 order-1 lg:order-2 border border-green-300 rounded-lg p-6 bg-green-50 shadow-sm">
                <h3 className="text-xl font-semibold text-green-700 mb-4">Our Story</h3>
                <p className="text-gray-800 text-base leading-relaxed font-serif">

               PresCrypt is a healthcare platform created by five passionate second-year students from the University of Moratuwa. It was designed to solve common problems for patients and doctors by making prescription management and communication easier. Using innovative technology, PresCrypt improves healthcare access and delivery.
               <br></br>
               We aim to create a future where healthcare is connected, clear, and available to all.

                </p>
            </div>
            </div>

        </div>

        {/* Right Contribution Box */}
        <div className="w-[450px] bg-white shadow-xl p-8 rounded-xl border border-green-300">
          <h2 className="text-2xl font-bold text-green-600 mb-6 text-center">
            Contribute to Us
          </h2>

          <img
            src="/ContributeUs.jpg"
            alt="Contribute Us"
            className="w-full h-auto mb-6 rounded"
          />

          <div className="text-green-700 text-sm leading-relaxed mb-6">
            <p className="font-semibold mb-2">By Contributing us you help improving our system to:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Improve Healthcare Access</li>
              <li>Chatbot with Multi-language Support</li>
              <li>Implement voice recognition for AI chatbot.</li>
              <li>AI-based Symptom Checker</li>
              <li>Hospital and Pharmacy Implementation with More Advanced features</li>
              <li>EMR Sync (write-back to OpenMRS)</li>
              <li>Grow the systems for pharmacies.</li>
              <li>Deliver and track medicines recommended by doctor</li>
              <li>Payment Tracking & Refund</li>
            </ul>
          </div>

          {/* Contribution Slider */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">
              Contribution Amount: Rs {price}
            </label>
            <input
              type="range"
              min="0"
              max="10000"
              step="100"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full accent-green-600 cursor-pointer"
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price}</p>
            )}
          </div>

          <button
              className={`w-full py-3 rounded text-white font-semibold transition flex items-center justify-center gap-2 ${
                loading
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
              onClick={handleContribute}
              disabled={loading || Object.keys(errors).length > 0}
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Processing...
                </>
              ) : (
                `Contribute Rs ${price}`
              )}
          </button>

        </div>
      </div>
    </div>

  </div>
);

};

export default HelpUsPage;
