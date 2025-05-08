"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Verify2FA() {
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();
  const email = typeof window !== "undefined" ? localStorage.getItem("pending2FAEmail") : "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/Auth/Verify2FA", {
        email,
        code
      });

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.user.id);
        localStorage.setItem("userRole", res.data.user.role);
        localStorage.setItem("userEmail", res.data.user.username);

        router.push(`/${res.data.user.role}/Dashboard`);
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      console.error(err);
      setError("Invalid or expired 2FA code.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-xl font-bold mb-4">Enter 2FA Code</h2>
      <form onSubmit={handleSubmit} className="w-80">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter the 2FA code"
          className="w-full p-2 border border-gray-300 rounded mb-3"
          required
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button
          type="submit"
          className="w-full py-2 bg-teal-500 text-white font-bold rounded hover:bg-teal-600"
        >
          Verify
        </button>
      </form>
    </div>
  );
}
