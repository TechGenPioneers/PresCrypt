import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out" });

  return NextResponse.json(
    { message: "Logged out successfully" ,clearLocalStorage: true});
}
