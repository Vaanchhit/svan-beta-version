import { NextResponse } from "next/server";
import { getOutfit } from "@/services/mock-api";
import { getStoredUserFromRequest } from "@/services/auth-store";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const result = await getOutfit(id, await getStoredUserFromRequest(request));

  if (!result) {
    return NextResponse.json({ message: "Outfit not found" }, { status: 404 });
  }

  return NextResponse.json(result);
}
