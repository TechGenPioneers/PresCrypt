import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export function middleware(req) {
  const token = req.cookies.get('token')?.value;
  const role = req.cookies.get('role')?.value;
  const { pathname } = req.nextUrl;

  // Protect dashboard routes
  if (
    ["/AdminDashboard", "/DoctorDashboard", "/PatientDashboard"].includes(pathname)
  ) {
    if (!token || !role) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Prevent logged-in users from accessing login/register
  if (
    ["/login", "/register"].includes(pathname) &&
    token &&
    role
  ) {
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
    "/login",
    "/register",
  ],
};
