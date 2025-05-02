'use client';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';


export default function useAuthGuard(expectedRole) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const verifyAuth = () => {
      // Skip auth check for public routes
      if (pathname.startsWith('/Auth')) return;

      const token = localStorage.getItem('token');
      const role = localStorage.getItem('userRole');

      if (!token || !role) {
        router.replace(`/Auth/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      try {
        const decoded = jwtDecode(token);
        console.log("Decoded Exp:", new Date(decoded.exp * 1000)); 
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
          localStorage.clear(); // Clear expired token and role
          router.replace(`/Auth/login?redirect=${encodeURIComponent(pathname)}`);
          return;
        }

        if (expectedRole && !expectedRole.includes(role)) {
          router.replace('/Auth/MainPage');
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.clear();
        router.replace(`/Auth/login?redirect=${encodeURIComponent(pathname)}`);
      }
    };

    verifyAuth();
  }, [pathname, router, expectedRole]);
}
