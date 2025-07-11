"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie"; // ✅ Make sure this is imported

export default function Verify2FA() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const handleVerify = async () => {
    setError("");

    if (!code) {
      setError("Please enter the verification code.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        "https://localhost:7021/api/User/Verify2FA",
        { email, code },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.success) {
        // ✅ Save token and role to cookies (MUST for session to persist)
        Cookies.set("token", res.data.token, { expires: 1 });
        Cookies.set("role", res.data.user.role, { expires: 1 });

        // ✅ Optionally store in localStorage (only for UI purposes)
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userRole", res.data.user.role);

        // ✅ Redirect based on role
        if (res.data.user.role == "Admin") {
          router.push("/Admin/AdminDashboard");
        } else if (res.data.user.role == "Doctor") {
          router.push("/Doctor/DoctorDashboard");
        } else if (res.data.user.role == "Patient") {
          router.push("/Patient/PatientDashboard");
        } else {
          router.push("/Auth/MainPage");
        }
      } else {
        setError(res.data.message || "Invalid code");
      }
    } catch (err) {
      console.error("Verification error:", err);
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Verify 2FA Code</h1>
        <p className="mb-4 text-center">Enter the code sent to your email</p>

        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="6-digit code"
          className="w-full p-2 border rounded mb-4"
          maxLength={6}
        />

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full bg-teal-800 text-white p-2 rounded hover:bg-teal-600 disabled:bg-gray-400"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </div>
    </div>
  );
}
