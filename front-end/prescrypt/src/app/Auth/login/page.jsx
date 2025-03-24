"use client"; // Required for event handlers in Next.js

import { useState } from "react";
import { useRouter } from "next/navigation"; // Import Next.js router
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react"; // Import icons
import { loginPatient } from "../../../utils/api"; // Import API function

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter(); // Initialize Next.js router

  const handleLogin = async () => {
    setError(null);
    if (!email || !password) {
      setError("Email and Password are required.");
      return;
    }

    try {
      setLoading(true);
      const response = await loginPatient({ email, password });

      console.log("API Response:", response); // Debugging

      if (response && response.success) {
        console.log("Login successful:", response);
        router.push("/Patient/PatientDashboard"); // Redirect
      } else {
        setError(response?.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden max-w-3xl w-full">
        {/* Left: Form Section */}
        <div className="flex flex-col justify-center p-8 w-full md:w-1/2">
          <h2 className="text-2xl font-bold text-teal-700 text-center mb-2">WELCOME BACK!</h2>
          <p className="text-gray-600 text-center mb-6">YOUR HEALTH JOURNEY AWAITS!</p>

          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-400 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password Field with Toggle */}
          <div className="relative w-full mb-3">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-400 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <p className="text-sm text-center text-teal-600 cursor-pointer hover:underline mt-2">
            <Link href="/Auth/ForgotPassword">Forgot Password?</Link>
          </p>

          {/* Login Button - Navigates only on success */}
          <button
            className="w-full py-2 bg-teal-500 text-white font-bold rounded-md hover:bg-teal-600 transition disabled:opacity-50"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-gray-600 text-sm text-center mt-4">Not registered yet?</p>
          <Link href="/Auth/PatientRegistration">
            <button className="w-full py-2 mt-2 border border-teal-500 text-teal-500 font-bold rounded-md hover:bg-teal-500 hover:text-white transition">
              Create an Account
            </button>
          </Link>
        </div>

        {/* Right: Image Section */}
        <div className="hidden md:flex justify-center items-center p-6 md:w-1/2">
          <Image src="/loginimage.jpg" alt="Login Illustration" width={350} height={300} />
        </div>
      </div>
    </div>
  );
}
