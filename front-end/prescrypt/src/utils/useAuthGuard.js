
'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

export default function useAuthGuard(expectedRole) {
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    let logoutTimeout;
    
    const verifyAuth = () => {
      if (pathname.startsWith('/Auth')) return;
      
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('userRole');
      const username = localStorage.getItem('username');
      
      
      if (!token || !role) {
        router.replace(`/Auth/login?session=expired`);
        return;
      }
      
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp < currentTime) {
          localStorage.clear();
          router.replace(`/Auth/login?session=expired`);
          return;
        }
        
        // Auto logout when token expires
        const timeLeft = decoded.exp * 1000 - Date.now();
        logoutTimeout = setTimeout(() => {
          localStorage.clear();
          router.replace(`/Auth/login?session=expired`);
        }, timeLeft);
        
        if (expectedRole && !expectedRole.includes(role)) {
          router.replace('/Auth/MainPage');
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.clear();
        router.replace(`/Auth/login?session=expired`);
      }
    };
    
    verifyAuth();
    
    return () => {
      if (logoutTimeout) clearTimeout(logoutTimeout);
    };
  }, [pathname, router, expectedRole]);
}