import { useEffect } from "react";
import { useRouter } from "next/router";
import jwt_decode from "jwt-decode";

const useAuthGuard = (expectedRole) => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");

    if (!token) {
      // No token → redirect to login
      router.push("/Auth/login");
      return;
    }

    try {
      const decoded = jwt_decode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        // Token expired
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        router.push("/Auth/login?expired=true");
        return;
      }

      if (userRole !== expectedRole) {
        // Wrong role
        router.push("/Auth/login?unauthorized=true");
      }
    } catch (error) {
      console.error("Invalid token", error);
      router.push("/Auth/login");
    }
  }, []);
};

export default useAuthGuard;
