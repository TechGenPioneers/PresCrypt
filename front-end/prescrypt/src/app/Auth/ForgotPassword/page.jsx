"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { forgotPassword } from "../../../utils/api"; // Backend API function

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();  

  const handleResetRequest = async () => {
    setError(null);
    setMessage("");
    if (!email) {
      setError("Email is required.");
      return;
    }

    try {
      setLoading(true);
      const response = await forgotPassword({ email });

      if (response && response.success) {
        setMessage("Password reset link sent to your email.");
      } else {
        setError(response?.message || "User not found.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="bg-white shadow-lg rounded-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-teal-700 text-center">Forgot Password?</h2>
        <p className="text-gray-600 text-center mb-6">Enter your email to receive a reset link.</p>

        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-400 focus:outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        {message && <p className="text-green-500 text-sm mb-3">{message}</p>}

        <button
          className="w-full py-2 bg-teal-500 text-white font-bold rounded-md hover:bg-teal-600 transition disabled:opacity-50"
          onClick={handleResetRequest}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <p className="text-sm text-center text-gray-600 mt-4">
          <Link href="/Auth/Login" className="text-teal-600 hover:underline">Back to Login</Link>
        </p>
      </div>
    </div>
  );
}
