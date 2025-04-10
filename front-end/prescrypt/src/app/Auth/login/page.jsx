"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { loginUser } from "../../../utils/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("patient");

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

    if (!email || !password) {
      setError("Email and Password are required.");
      return;
    }

    try {
      setLoading(true);
      const response = await loginUser({ email, password });

      console.log("Login Response:", response);

      if (!response) {
        setError("No response from server.");
        return;
      }

      // Handle DoctorPending case
      if (response.message?.includes("pending approval")) {
        setError("Your registration is not confirmed yet. We will reach out to you soon.");
        setTimeout(() => router.push("/"), 3000);
        return;
      }

      // If login successful
      if (response.success) {
        // Store user data in localStorage
        localStorage.setItem("token", response.token || "");
        localStorage.setItem("userId", response.user?.id || "");
        localStorage.setItem("userRole", response.user?.role || "");
        localStorage.setItem("userEmail", response.user?.email || "");

        // Redirect based on actual role from backend (not frontend selection)
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
          default:
            router.push("/");
        }
      } else {
        setError(response.message || "Invalid email or password.");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getRegistrationUrl = () => {
    return role === "doctor" ? "/Auth/DoctorRegistration" : "/Auth/PatientRegistration";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
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
  