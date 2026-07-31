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

const WELCOME_MESSAGE =
  "Welcome to CRIB Support. Website visitor messages are delivered to this space in their own threads. Reply in the matching thread to send a response back to the visitor.";

const HELP_MESSAGE =
  "CRIB Support routes website chat inquiries into this space. When an inquiry arrives, reply in its thread to respond to that visitor. You can also contact support@cribnetwork.io for setup help.";

function chatResponse(text: string) {
  return NextResponse.json({ text });
}

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

  if (body?.type === "ADDED_TO_SPACE") {
    return chatResponse(WELCOME_MESSAGE);
  }

  // Google Chat sends lifecycle events that do not need a visible response.
  if (body?.type && body.type !== "MESSAGE") {
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
    return !messageText && senderType !== "BOT"
      ? chatResponse(HELP_MESSAGE)
      : NextResponse.json({ success: true });
  }

  const threadName = eventMessage?.thread?.name ?? null;
  const threadKey =
    eventMessage?.thread?.threadKey || eventMessage?.threadKey || null;
  const senderDisplayName = eventMessage?.sender?.displayName ?? null;
  const senderEmail = eventMessage?.sender?.email ?? null;

  if (/^\/?help\b/i.test(messageText)) {
    return chatResponse(HELP_MESSAGE);
  }

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
    return chatResponse(
      "Thanks — CRIB Support received your message, but it could not be synchronized to the website conversation. Please try again shortly or contact support@cribnetwork.io."
    );
  }

  return chatResponse(
    "Thanks — your reply has been recorded. If this message belongs to a website visitor, send it in that visitor's thread so it can be delivered to the correct conversation."
  );
}
