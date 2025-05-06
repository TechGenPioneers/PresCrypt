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
      // TODO: Replace with real API call
      await new Promise((r) => setTimeout(r, 1500));
      setMessage("Reset link sent to your email.");
    } catch (err) {
      setError("Failed to send reset link.");
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
