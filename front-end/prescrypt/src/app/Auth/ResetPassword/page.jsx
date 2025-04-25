"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // Get URL parameters
import { resetPassword } from "../../../utils/api"; // API call

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams(); // Get query params
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token || !email) {
      setError("Invalid or expired reset link.");
    }
  }, [token, email]);

  const handleResetPassword = async () => {
    setError(null);

    if (!newPassword || !confirmPassword) {
      setError("Both fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await resetPassword({ email, token, newPassword });

      if (response.success) {
        setSuccess(true);
        setTimeout(() => router.push("/Auth/Login"), 3000); // Redirect after success
      } else {
        setError(response.message || "Failed to reset password.");
      }
    } catch (err) {
      setError("Error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center text-teal-700 mb-4">Reset Password</h2>

        {error && <p className="text-red-500 text-sm text-center mb-3">{error}</p>}
        {success ? (
          <p className="text-green-500 text-sm text-center">Password reset successful! Redirecting...</p>
        ) : (
          <>
            <input
              type="password"
              placeholder="New Password"
              className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-md"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-md"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              className="w-full py-2 bg-teal-500 text-white font-bold rounded-md hover:bg-teal-600 transition"
              onClick={handleResetPassword}
              disabled={loading}
            >
              {loading ? "Resetting Password..." : "Reset Password"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
