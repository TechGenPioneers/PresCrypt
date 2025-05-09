"use client";

import { useState } from "react";
import axios from "axios";

const ContactUsForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    topic: "",
    message: "",
    termsAccepted: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.termsAccepted) {
      alert("You must accept the terms before submitting.");
      return;
    }

    try {
      await axios.post("https://localhost:7021/api/Patient/ContactUs", formData);
      alert("Message submitted successfully!");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        topic: "",
        message: "",
        termsAccepted: false,
      });
    } catch (error) {
      console.error("Submission failed", error);
      alert("There was a problem submitting the form.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-3xl mx-auto space-y-6 border border-green-200"
    >
      <h2 className="text-3xl font-bold text-center text-green-700">Contact Us</h2>
      <p className="text-center text-green-600">Your Personal Health Hub</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="First Name"
          className="border border-green-300 focus:ring-green-500 focus:border-green-500 p-3 rounded-md w-full"
          required
        />
        <input
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Last Name"
          className="border border-green-300 focus:ring-green-500 focus:border-green-500 p-3 rounded-md w-full"
          required
        />
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email Address"
          className="border border-green-300 focus:ring-green-500 focus:border-green-500 p-3 rounded-md w-full"
          required
        />
        <input
          name="phoneNumber"
          type="tel"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="Phone Number"
          className="border border-green-300 focus:ring-green-500 focus:border-green-500 p-3 rounded-md w-full"
        />
      </div>

      <select
        name="topic"
        value={formData.topic}
        onChange={handleChange}
        className="border border-green-300 focus:ring-green-500 focus:border-green-500 p-3 rounded-md w-full"
        required
      >
        <option value="">Select Topic...</option>
        <option value="appointment">Appointment</option>
        <option value="prescription">Prescription</option>
        <option value="technical">Technical Support</option>
      </select>

      <textarea
        name="message"
        value={formData.message}
        onChange={handleChange}
        placeholder="Tell us more..."
        rows={4}
        className="border border-green-300 focus:ring-green-500 focus:border-green-500 p-3 rounded-md w-full"
        required
      />

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="termsAccepted"
          checked={formData.termsAccepted}
          onChange={handleChange}
          className="accent-green-600"
          required
        />
        <label className="text-sm text-green-700">
          I accept the terms and conditions
        </label>
      </div>

      <div className="text-center">
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-md transition duration-200"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default ContactUsForm;
