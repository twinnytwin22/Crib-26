import { NextRequest, NextResponse } from "next/server";
import {
  buildGoogleChatMessagesUrl,
  getChatAccessToken,
  getGoogleChatAuthMode,
  getGoogleChatSpaceName,
} from "@/lib/google/chat-api";

const DIAGNOSTICS_SECRET =
  process.env.GOOGLE_CHAT_INBOUND_SECRET || process.env.SANITY_WEBHOOK_SECRET;

function isAuthorized(req: NextRequest) {
  if (!DIAGNOSTICS_SECRET) return false;
  const token =
    req.headers.get("x-chat-diagnostics-secret") ||
    req.nextUrl.searchParams.get("secret");
  return token === DIAGNOSTICS_SECRET;
}

async function callGoogleChat(url: URL, token: string, init?: RequestInit) {
  try {
    const response = await fetch(url, {
      ...init,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
      cache: "no-store",
    });

    const body = await response.text();
    return {
      ok: response.ok,
      status: response.status,
      body: body.slice(0, 2000),
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      body: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = await getChatAccessToken();
  const spaceName = getGoogleChatSpaceName();

  if (!token || !spaceName) {
    return NextResponse.json({
      authMode: getGoogleChatAuthMode(),
      space: spaceName,
      tokenAvailable: Boolean(token),
      error: "Google Chat token or space is unavailable",
    });
  }

  const spaceUrl = new URL(`https://chat.googleapis.com/v1/${spaceName}`);
  const messagesUrl = buildGoogleChatMessagesUrl();
  messagesUrl?.searchParams.set("pageSize", "1");

  return NextResponse.json({
    authMode: getGoogleChatAuthMode(),
    space: spaceName,
    tokenAvailable: true,
    checks: {
      spaceGet: await callGoogleChat(spaceUrl, token),
      messagesList: messagesUrl
        ? await callGoogleChat(messagesUrl, token)
        : { ok: false, status: 0, body: "Messages URL unavailable" },
    },
  });
}
