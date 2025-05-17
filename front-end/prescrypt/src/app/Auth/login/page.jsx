// app/auth/login/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import AuthCard from "../components/AuthCard";
import AuthForm from "../components/AuthForm";
import PasswordInput from "../components/PasswordInput";
import Notification from "../components/Notification";
import { loginUser } from "@/utils/api";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setNotification(null);

    if (!formData.email || !formData.password) {
      setError("Email and Password are required.");
      return;
    }

    try {
      setLoading(true);
      const response = await loginUser(formData);

      if (!response) {
        setError("No response from server.");
        return;
      }

      if (
        (response.user?.role === "DoctorPending") ||
        (response.user?.role === "Doctor" && response.user?.emailVerified === false) ||
        (response.message?.toLowerCase().includes("pending approval")) ||
        (response.message?.toLowerCase().includes("not verified"))
      ) {
        showPendingNotification();
        return;
      }

      if (!response.success) {
        setError(response.message || "Invalid email or password.");
        return;
      }

      await completeLogin(response);
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const completeLogin = async (response) => {
    localStorage.setItem("token", response.token);
    localStorage.setItem("userId", response.user?.id);
    localStorage.setItem("userRole", response.user?.role);

    await fetch("/api/set-cookie", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: response.token, role: response.user?.role }),
    });

    switch (response.user?.role) {
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
        router.push("/Auth/MainPage");
    }
  };

  const showPendingNotification = () => {
    setNotification({
      type: "pending",
      message: "Your doctor account is pending approval. Please wait for confirmation."
    });

    setTimeout(() => router.push("/Auth/MainPage"), 3000);
  };

  const getRegistrationUrl = () => {
    return role === "doctor" ? "/Auth/DoctorRegistration" : "/Auth/PatientRegistration";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white relative">
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <AuthCard imageSrc="/loginimage.jpg" imageAlt="Login Illustration">
        <h2 className="text-2xl font-bold text-teal-700 text-center mb-2">
          WELCOME BACK!
        </h2>
        <p className="text-gray-600 text-center mb-6">
          {role === "doctor" ? "READY TO HELP PATIENTS?" : "YOUR HEALTH JOURNEY AWAITS!"}
        </p>

        <AuthForm onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-400 focus:outline-none"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <PasswordInput
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            error={error}
            required
          />

          <p className="text-sm text-center text-teal-600 hover:underline mt-2">
            <Link href="/Auth/ForgotPassword">Forgot Password?</Link>
          </p>

          <button
            type="submit"
            className="w-full py-2 bg-teal-500 text-white font-bold rounded-md hover:bg-teal-600 transition disabled:opacity-50 mt-4"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </AuthForm>

        <p className="text-gray-600 text-sm text-center mt-4">Not registered yet?</p>
        <Link href={getRegistrationUrl()}>
          <button className="w-full py-2 mt-2 border border-teal-500 text-teal-500 font-bold rounded-md hover:bg-teal-500 hover:text-white transition">
            Create an Account
          </button>
        </Link>
      </AuthCard>
    </div>
  );
}