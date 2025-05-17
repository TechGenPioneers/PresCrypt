import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out" });

  // Remove cookies by setting them with expired maxAge
  response.cookies.set("token", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0),
  });

  response.cookies.set("role", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0),
  });

  return response;
}
