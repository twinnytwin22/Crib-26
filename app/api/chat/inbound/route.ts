import { NextRequest, NextResponse } from "next/server";
import { recordAgentMessage } from "@/lib/providers/supabase/chat-storage";

// PRE-ROLLOUT: Rotate this value in both the deployed environment and the
// Google Chat endpoint configuration. Never log it or expose it to the client.
const INBOUND_SECRET = process.env.GOOGLE_CHAT_INBOUND_SECRET;

type GoogleChatEvent = {
  type?: string;
  message?: {
    text?: string;
    thread?: {
      name?: string;
      threadKey?: string;
    };
    threadKey?: string;
    sender?: {
      type?: string;
      displayName?: string;
      email?: string;
    };
  };
  space?: {
    name?: string;
  };
  chat?: {
    messagePayload?: {
      message?: GoogleChatEvent["message"];
      space?: {
        name?: string;
      };
    };
    space?: {
      name?: string;
    };
  };
};

function getEventMessage(body: GoogleChatEvent) {
  return body?.message ?? body?.chat?.messagePayload?.message;
}

function getEventSpaceName(body: GoogleChatEvent) {
  return (
    body?.space?.name ??
    body?.chat?.messagePayload?.space?.name ??
    body?.chat?.space?.name ??
    null
  );
}

function logInbound(label: string, payload: Record<string, unknown>) {
  try {
    console.log(`[chat inbound] ${label}`, JSON.stringify(payload, null, 2));
  } catch {
    // no-op if logging fails
  }
}

function isAuthorized(req: NextRequest) {
  if (!INBOUND_SECRET) {
    console.warn(
      "GOOGLE_CHAT_INBOUND_SECRET is not configured; inbound route is disabled."
    );
    return false;
  }

  const headerToken =
    req.headers.get("x-goog-chat-secret") || req.headers.get("authorization");
  const urlToken =
    req.nextUrl.searchParams.get("secret") ||
    req.nextUrl.searchParams.get("token");

  if (!headerToken && !urlToken) {
    return false;
  }

  if (headerToken?.startsWith("Bearer ")) {
    return headerToken.slice(7) === INBOUND_SECRET;
  }

  return headerToken === INBOUND_SECRET || urlToken === INBOUND_SECRET;
}

function isPingEvent(body: GoogleChatEvent) {
  if (body?.chat?.messagePayload?.message) {
    return false;
  }
  const type = body?.type;
  return type && type !== "MESSAGE";
}

export async function GET() {
  return NextResponse.json({ ok: true });
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    logInbound("unauthorized", {
      hasSecret: Boolean(INBOUND_SECRET),
      hasAuthorizationHeader: Boolean(req.headers.get("authorization")),
      hasGoogleChatSecretHeader: Boolean(
        req.headers.get("x-goog-chat-secret")
      ),
      hasUrlToken: Boolean(
        req.nextUrl.searchParams.get("secret") ||
          req.nextUrl.searchParams.get("token")
      ),
    });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: GoogleChatEvent;
  try {
    body = await req.json();
    const eventMessage = getEventMessage(body);
    logInbound("received", {
      type: body?.type,
      payloadFormat: body?.chat?.messagePayload
        ? "workspace_add_on"
        : "chat_interaction",
      threadName: eventMessage?.thread?.name,
      threadKey: eventMessage?.thread?.threadKey ?? eventMessage?.threadKey,
      senderType: eventMessage?.sender?.type,
      senderDisplayName: eventMessage?.sender?.displayName,
      space: getEventSpaceName(body),
      rawKeys: Object.keys(body || {}),
    });
  } catch (error) {
    console.error("Invalid inbound chat payload", error);
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (isPingEvent(body)) {
    return NextResponse.json({ success: true });
  }

  const eventMessage = getEventMessage(body);
  const messageText = eventMessage?.text?.trim();
  const senderType = eventMessage?.sender?.type;

  if (!messageText || senderType === "BOT") {
    logInbound("ignored", {
      reason: !messageText ? "no-text" : "bot-sender",
      senderType,
    });
    return NextResponse.json({ success: true });
  }

  const threadName = eventMessage?.thread?.name ?? null;
  const threadKey =
    eventMessage?.thread?.threadKey || eventMessage?.threadKey || null;
  const senderDisplayName = eventMessage?.sender?.displayName ?? null;
  const senderEmail = eventMessage?.sender?.email ?? null;

  try {
    logInbound("persisting", {
      messageText,
      threadName,
      threadKey,
      senderDisplayName,
      senderEmail,
    });
    await recordAgentMessage({
      message: messageText,
      threadName,
      threadKey,
      senderDisplayName,
      senderEmail,
      messageMetadata: {
        space: getEventSpaceName(body),
        raw_event_type:
          body?.type ??
          (body?.chat?.messagePayload ? "WORKSPACE_ADD_ON_MESSAGE" : null),
      },
    });
    logInbound("persisted", {
      threadName,
      threadKey,
      senderEmail,
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
