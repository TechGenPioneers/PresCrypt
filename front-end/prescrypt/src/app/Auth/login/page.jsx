"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { loginUser } from "../../../utils/api";
import axios from "axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("patient");
  const [notification, setNotification] = useState(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (roleParam && ["patient", "doctor", "admin"].includes(roleParam)) {
      setRole(roleParam);
    }
  }, [searchParams]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setNotification(null);
  
    if (!email || !password) {
      setError("Email and Password are required.");
      return;
    }
  
    try {
      setLoading(true);
      const response = await loginUser({ email, password });
  
      console.log("Full Login Response:", response); // Debugging
  
      if (!response) {
        setError("No response from server.");
        return;
      }
  
      // Check for doctor pending case first
      if (
        (response.user?.role === "DoctorPending") || 
        (response.user?.role === "Doctor" && response.user?.emailVerified === false) ||
        (response.message?.toLowerCase().includes("pending approval")) ||
        (response.message?.toLowerCase().includes("not verified"))
      ) {
        showPendingNotification();
        return;
      }
      
      // Handle general login failures
      if (!response.success) {
        setError(response.message || "Invalid email or password.");
        return;
      }
  
      // If login successful
      localStorage.setItem("token", response.token);
      localStorage.setItem("userId", response.user?.id);
      localStorage.setItem("userRole", response.user?.role);
      localStorage.setItem("userEmail", response.user?.username);
  
      // Debug stored values
      console.log("Stored User Role:", response.user?.role);
  
      // Redirect based on exact role from backend
      switch(response.user?.role) {
        case "Patient":
          router.push("/Patient/PatientDashboard");
          break;
        case "Doctor":
          router.push("/Doctor/DoctorDashboard");
          break;
        case "Admin":
          router.push("/Admin/AdminDashboard");
          break;
        case "DoctorPending":
          showPendingNotification();
          break;
        default:
          router.push("/Auth/MainPage");
      }
  
    } catch (err) {
      console.error("Login Error Details:", err);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const showPendingNotification = () => {
    setNotification({
      type: "pending",
      message: "Your doctor account is pending approval. Please wait for confirmation."
    });
    
    // Redirect after showing notification
    setTimeout(() => router.push("/Auth/MainPage"), 3000);
  };

  const getRegistrationUrl = () => {
    return role === "doctor" ? "/Auth/DoctorRegistration" : "/Auth/PatientRegistration";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      {notification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-green-100 border-l-4 border-green-500 text-black-700 p-4 rounded shadow-lg">
            <div className="flex items-center">
              <div className="py-1">
                <svg className="fill-current h-6 w-6 text-green-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/>
                </svg>
              </div>
              <div>
                <p className="font-bold">Account Pending</p>
                <p className="text-sm">{notification.message}</p>
                <p className="text-sm mt-1">Redirecting to main page...</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden max-w-3xl w-full">
        <div className="flex flex-col justify-center p-8 w-full md:w-1/2">
          <h2 className="text-2xl font-bold text-teal-700 text-center mb-2">
            WELCOME BACK!
          </h2>
          <p className="text-gray-600 text-center mb-6">
            {role === "doctor" ? "READY TO HELP PATIENTS?" : "YOUR HEALTH JOURNEY AWAITS!"}
          </p>

          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-400 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

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

            <button
              type="submit"
              className="w-full py-2 bg-teal-500 text-white font-bold rounded-md hover:bg-teal-600 transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-gray-600 text-sm text-center mt-4">Not registered yet?</p>
          <Link href={getRegistrationUrl()}>
            <button className="w-full py-2 mt-2 border border-teal-500 text-teal-500 font-bold rounded-md hover:bg-teal-500 hover:text-white transition">
              Create an Account
            </button>
          </Link>
        </div>

        <div className="hidden md:flex justify-center items-center p-6 md:w-1/2">
          <Image
            src="/loginimage.jpg"
            alt="Login Illustration"
            width={350}
            height={300}
          />
        </div>
      </div>
    </div>
  );
}