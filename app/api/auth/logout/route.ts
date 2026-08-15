import { NextResponse } from "next/server";
import { clearSession, SESSION_COOKIE, sessionTokenFromRequest } from "@/services/auth-store";

export async function POST(request: Request) {
  await clearSession(sessionTokenFromRequest(request));
  const response = NextResponse.json({ user: null });
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });
  return response;
}
