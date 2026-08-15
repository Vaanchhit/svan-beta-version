import { NextResponse } from "next/server";
import { getFeed } from "@/services/mock-api";
import { getStoredUserFromRequest } from "@/services/auth-store";

export async function GET(request: Request) {
  return NextResponse.json(await getFeed(await getStoredUserFromRequest(request)));
}
