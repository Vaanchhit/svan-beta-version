import { NextResponse } from "next/server";
import { searchOutfits } from "@/services/mock-api";
import { getStoredUserFromRequest } from "@/services/auth-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";
  const genre = searchParams.get("genre") ?? "";

  return NextResponse.json(
    await searchOutfits(query, genre, await getStoredUserFromRequest(request))
  );
}
