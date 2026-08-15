import { NextResponse } from "next/server";
import { createAccount, SESSION_COOKIE, SESSION_DAYS } from "@/services/auth-store";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
      displayName?: string;
    };
    const { token, user } = await createAccount({
      email: body.email ?? "",
      password: body.password ?? "",
      displayName: body.displayName ?? ""
    });
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
      { message: error instanceof Error ? error.message : "Could not create account." },
      { status: 400 }
    );
  }
}
