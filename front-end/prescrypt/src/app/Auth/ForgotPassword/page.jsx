'use client';
import { useState } from "react";
import InputField from "../components/InputField";
import SubmitButton from "../components/SubmitButton";
import CardLayout from "../components/CardLayout";
import Alert from "../components/Alert";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setMessage("");
  
    if (!email) {
      setError("Please enter your email.");
      return;
    }
  
    setLoading(true);
    try {
      const response = await fetch("https://localhost:7021/api/User/ForgotPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send reset link.");
      }
  
      const data = await response.json();
      setMessage(data.message || "Reset link sent to your email.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <CardLayout>
      <h2 className="text-2xl font-semibold text-center text-teal-700">Forgot Password</h2>
      <p className="text-center text-sm text-gray-600 mb-4">Enter your email to reset your password.</p>

      <InputField
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {error && <Alert type="error" message={error} />}
      {message && <Alert type="success" message={message} />}

      <SubmitButton onClick={handleSubmit} text="Send Reset Link" loading={loading} />
    </CardLayout>
  );
}
