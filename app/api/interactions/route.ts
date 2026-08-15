import { NextResponse } from "next/server";
import { getStoredUserFromRequest, toggleInteraction } from "@/services/auth-store";

export async function POST(request: Request) {
  const user = await getStoredUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ message: "Login required." }, { status: 401 });
  }

  const body = (await request.json()) as {
    outfitId?: string;
    type?: "like" | "save";
  };

  if (!body.outfitId || (body.type !== "like" && body.type !== "save")) {
    return NextResponse.json({ message: "Invalid interaction." }, { status: 400 });
  }

  return NextResponse.json(
    await toggleInteraction({
      userId: user.id,
      outfitId: body.outfitId,
      type: body.type
    })
  );
}
