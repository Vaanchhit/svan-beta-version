import { NextResponse } from "next/server";
import { getAuthUserFromRequest } from "@/services/auth-store";

export async function GET(request: Request) {
  return NextResponse.json({ user: await getAuthUserFromRequest(request) });
}
