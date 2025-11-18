import { NextRequest, NextResponse } from "next/server";
import { recordAgentMessage } from "@/lib/providers/supabase/chat-storage";

const INBOUND_SECRET = process.env.GOOGLE_CHAT_INBOUND_SECRET;

function isAuthorized(req: NextRequest) {
  if (!INBOUND_SECRET) {
    console.warn(
      "GOOGLE_CHAT_INBOUND_SECRET is not configured; inbound route is unsecured."
    );
    return true;
  }

  const headerToken =
    req.headers.get("x-goog-chat-secret") || req.headers.get("authorization");

  if (!headerToken) {
    return false;
  }

  if (headerToken.startsWith("Bearer ")) {
    return headerToken.slice(7) === INBOUND_SECRET;
  }

  return headerToken === INBOUND_SECRET;
}

function isPingEvent(body: any) {
  const type = body?.type;
  return type && type !== "MESSAGE";
}

export async function GET() {
  return NextResponse.json({ ok: true });
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch (error) {
    console.error("Invalid inbound chat payload", error);
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (isPingEvent(body)) {
    return NextResponse.json({ success: true });
  }

  const messageText = body?.message?.text?.trim();
  const senderType = body?.message?.sender?.type;

  if (!messageText || senderType === "BOT") {
    return NextResponse.json({ success: true });
  }

  const threadName = body?.message?.thread?.name ?? null;
  const threadKey =
    body?.message?.thread?.threadKey || body?.message?.threadKey || null;
  const senderDisplayName = body?.message?.sender?.displayName ?? null;
  const senderEmail = body?.message?.sender?.email ?? null;

  try {
    await recordAgentMessage({
      message: messageText,
      threadName,
      threadKey,
      senderDisplayName,
      senderEmail,
      messageMetadata: {
        space: body?.space?.name ?? null,
        raw_event_type: body?.type ?? null,
      },
    });
  } catch (error) {
    console.error("Failed to persist Google Chat reply", error);
    return NextResponse.json(
      { error: "Failed to store message" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
