import { NextResponse } from 'next/server';

// This simulates login success. In real app, verify credentials and issue JWT.
export async function POST(req) {
  const body = await req.json();
  const { token, role } = body;

  if (!token || !role) {
    return NextResponse.json({ error: "Token or role missing" }, { status: 400 });
  }

  const response = NextResponse.json({ message: "Cookie set successfully" });

  // Set HTTP-only cookies
  response.cookies.set("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
  });

  response.cookies.set("role", role, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return response;
}
