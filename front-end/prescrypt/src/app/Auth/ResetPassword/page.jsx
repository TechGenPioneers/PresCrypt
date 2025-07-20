"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import SubmitButton from "../components/SubmitButton";
import CardLayout from "../components/CardLayout";
import Alert from "../components/Alert";
import axios from "axios";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = decodeURIComponent(searchParams.get("token") || ""); // Decode URL-encoded token
  const email = decodeURIComponent(searchParams.get("email") || ""); // Decode URL-encoded email

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/; // Changed to 8+ chars

    if (!formData.newPassword) {
      newErrors.newPassword = "Password is required.";
    } else if (!passwordPattern.test(formData.newPassword)) {
      newErrors.newPassword =
        "Must be 8+ chars with uppercase, lowercase, number, and special character.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for the current field when typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    if (!validateForm()) return;

    setLoading(true);
    setMessage("");
    setErrors((prev) => ({ ...prev, submit: "" }));

    try {
      const response = await axios.post(
        "https://localhost:7021/api/User/ResetPassword",
        {
          Email: email,
          Token: token,
          NewPassword: formData.newPassword,
          ConfirmPassword: formData.confirmPassword,
        },
        {
          headers: { "Content-Type": "application/json" },
          timeout: 10000, // 10-second timeout
        }
      );

      if (response.status === 200) {
        setMessage(response.data.message || "Password reset successfully!");
        // Clear form on success
        setFormData({ newPassword: "", confirmPassword: "" });
      }
    } catch (err) {
      let errorMessage = "Failed to reset password. Please try again.";

      if (err.response) {
        // Server responded with error status
        errorMessage =
          err.response.data?.message || `Server error: ${err.response.status}`;
      } else if (err.request) {
        // Request was made but no response
        errorMessage = "No response from server. Check your connection.";
      }

      setErrors((prev) => ({ ...prev, submit: errorMessage }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <CardLayout>
      <h2 className="text-2xl font-semibold text-center text-gray-800">
        Change Your Password
      </h2>
      <p className="text-sm text-gray-600 text-center mb-4">
        Enter a new password below to change your password.
      </p>

      <form onSubmit={handleSubmit}>
        {" "}
        {/* Added form tag for proper submission */}
        {/* New Password Field */}
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            name="newPassword"
            placeholder="New password"
            value={formData.newPassword}
            onChange={handleChange}
            className={`w-full p-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.newPassword
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            autoComplete="new-password" // Important for password managers
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          {errors.newPassword && (
            <p className="text-sm text-red-500 mt-1">{errors.newPassword}</p>
          )}
        </div>
        {/* Confirm Password Field */}
        <div className="relative mb-6">
          {" "}
          {/* Increased margin-bottom */}
          <input
            type={showConfirm ? "text" : "password"}
            name="confirmPassword"
            placeholder="Re-enter new password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`w-full p-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.confirmPassword
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            aria-label={showConfirm ? "Hide password" : "Show password"}
          >
            {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          {errors.confirmPassword && (
            <p className="text-sm text-red-500 mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>
        {errors.submit && (
          <Alert type="error" message={errors.submit} className="mb-4" />
        )}
        {message && <Alert type="success" message={message} className="mb-4" />}
        <SubmitButton
          type="submit" // Changed to type="submit"
          onClick={handleSubmit}
          text="Reset password"
          loading={loading}
          disabled={loading} // Disable during submission
          className="w-full"
        />
      </form>
      <div className="mt-4 text-center">
        <a
          href="/Auth/login"
          className="text-green-800 hover:text-teal-500 text-sm font-medium"
        >
          ← Back to Login
        </a>
      </div>
    </CardLayout>
  );
}
