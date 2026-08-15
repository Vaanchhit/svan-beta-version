import { NextResponse } from "next/server";
import { authenticate, SESSION_COOKIE, SESSION_DAYS } from "@/services/auth-store";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
    };
    const { token, user } = await authenticate(body.email ?? "", body.password ?? "");
    const response = NextResponse.json({ user });
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_DAYS * 24 * 60 * 60
    });
    return response;
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Could not log in." },
      { status: 401 }
    );
  }
}
