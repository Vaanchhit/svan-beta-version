import { NextResponse } from "next/server";
import { getFeed, getOutfit } from "@/services/mock-api";
import { getStoredUserFromRequest } from "@/services/auth-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  const viewer = await getStoredUserFromRequest(request);

  if (!id) return NextResponse.json(await getFeed(viewer));

  const result = await getOutfit(id, viewer);
  if (!result) {
    return NextResponse.json({ message: "Outfit not found" }, { status: 404 });
  }

  return NextResponse.json(result);
}
