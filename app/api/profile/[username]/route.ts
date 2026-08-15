import { NextResponse } from "next/server";
import { getProfile } from "@/services/mock-api";
import { getStoredUserFromRequest } from "@/services/auth-store";

export async function GET(
  request: Request,
  context: { params: Promise<{ username: string }> }
) {
  const { username } = await context.params;
  const viewer = await getStoredUserFromRequest(request);
  if (username === "me" && !viewer) {
    return NextResponse.json({ message: "Login required." }, { status: 401 });
  }
  const result = await getProfile(username === "me" && viewer ? viewer.username : username, viewer);

  if (!result) {
    return NextResponse.json({ message: "Profile not found" }, { status: 404 });
  }

  return NextResponse.json(result);
}
