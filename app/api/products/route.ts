import { NextResponse } from "next/server";
import { getProductsForSegment } from "@/services/product-catalog";
import type { SegmentKey } from "@/types";

const segmentKeys: SegmentKey[] = ["upper-wear", "lower-wear"];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const outfitId = searchParams.get("outfitId") ?? "";
  const segment = searchParams.get("segment") as SegmentKey | null;

  if (!outfitId || !segment || !segmentKeys.includes(segment)) {
    return NextResponse.json(
      { message: "outfitId and segment are required" },
      { status: 400 }
    );
  }

  const result = await getProductsForSegment(outfitId, segment);

  if (!result) {
    return NextResponse.json({ message: "Outfit segment not found" }, { status: 404 });
  }

  return NextResponse.json(result);
}
