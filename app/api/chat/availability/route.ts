import { NextRequest, NextResponse } from "next/server";
import { getOwnerChatAvailability } from "@/lib/google/chat-availability";

export const dynamic = "force-dynamic";

const INBOUND_SECRET = process.env.GOOGLE_CHAT_INBOUND_SECRET;

export async function GET(request: NextRequest) {
  const secret = request.headers.get("x-chat-diagnostics-secret");
  if (!INBOUND_SECRET || secret !== INBOUND_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const availability = await getOwnerChatAvailability();
  return NextResponse.json(availability, {
    headers: { "Cache-Control": "private, no-store, max-age=0" },
  });
}
