import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import Cookies from "js-cookie";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const role = req.cookies.get("role")?.value;
  const { pathname } = req.nextUrl;

 if (
    pathname.startsWith("/Admin") ||
    pathname.startsWith("/Doctor") ||
    pathname.startsWith("/Patient")
  ) {
    if (!token || !role) {
      const loginUrl = new URL("/Auth/login", req.url);
      loginUrl.searchParams.set("session", "expired");
      return NextResponse.redirect(loginUrl);
    }
  }

  // Prevent logged-in users from accessing login/register
  if (["Auth/login", "Auth/PatientRegister"].includes(pathname) && token && role) {
    let redirectTo = "/";
    if (role === "admin") redirectTo = "/AdminDashboard";
    else if (role === "doctor") redirectTo = "/DoctorDashboard";
    else if (role === "patient") redirectTo = "/PatientDashboard";

    return NextResponse.redirect(new URL(redirectTo, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/Admin/:path*",
    "/Doctor/:path*",
    "/Patient/:path*",
    "/Auth/login"
    
  ],
};
