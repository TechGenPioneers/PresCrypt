"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import jwt_decode from "jwt-decode";

export default function useAuthGuard(allowedRoles = []) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/Auth/MainPage"); // Not logged in
      return;
    }

    try {
      const decoded = jwt_decode(token);
      const now = Date.now() / 1000;

      if (decoded.exp < now) {
        // Token expired
        localStorage.removeItem("token");
        router.push("/Auth/MainPage");
        return;
      }

      if (!allowedRoles.includes(decoded.role)) {
        // Role not allowed
        router.push("/Auth/MainPage");
      }
    } catch (err) {
      console.error("Invalid token", err);
      router.push("/Auth/MainPage");
    }
  }, []);
}
