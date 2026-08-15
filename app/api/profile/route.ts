import { NextResponse } from "next/server";
import { getProfile } from "@/services/mock-api";
import { getStoredUserFromRequest } from "@/services/auth-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const viewer = await getStoredUserFromRequest(request);
  const username = searchParams.get("username") ?? viewer?.username;
  if (!username) {
    return NextResponse.json({ message: "Login required." }, { status: 401 });
  }
  const result = await getProfile(username, viewer);

  if (!result) {
    return NextResponse.json({ message: "Profile not found" }, { status: 404 });
  }

  return NextResponse.json(result);
}
