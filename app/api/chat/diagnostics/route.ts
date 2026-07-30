import { NextRequest, NextResponse } from "next/server";
import {
  buildGoogleChatMessagesUrl,
  getChatReadAccessToken,
  getChatWriteAccessToken,
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
    let errorMessage: string | null = null;
    if (!response.ok) {
      try {
        const parsed = JSON.parse(body);
        errorMessage =
          typeof parsed?.error?.message === "string"
            ? parsed.error.message
            : "Google Chat API request failed";
      } catch {
        errorMessage = body.slice(0, 500);
      }
    }
    return {
      ok: response.ok,
      status: response.status,
      error: errorMessage,
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [writeToken, readToken] = await Promise.all([
    getChatWriteAccessToken(),
    getChatReadAccessToken(),
  ]);
  const spaceName = getGoogleChatSpaceName();

  if (!spaceName) {
    return NextResponse.json({
      authMode: getGoogleChatAuthMode(),
      space: spaceName,
      writeTokenAvailable: Boolean(writeToken),
      readTokenAvailable: Boolean(readToken),
      error: "Google Chat space is unavailable",
    });
  }

  const spaceUrl = new URL(`https://chat.googleapis.com/v1/${spaceName}`);
  const messagesUrl = buildGoogleChatMessagesUrl();
  messagesUrl?.searchParams.set("pageSize", "1");

  return NextResponse.json({
    authMode: getGoogleChatAuthMode(),
    space: spaceName,
    writeTokenAvailable: Boolean(writeToken),
    readTokenAvailable: Boolean(readToken),
    checks: {
      outboundAppAccess: writeToken
        ? await callGoogleChat(spaceUrl, writeToken)
        : { ok: false, status: 0, error: "Write token unavailable" },
      publicReplyReadAccess:
        messagesUrl && readToken
          ? await callGoogleChat(messagesUrl, readToken)
          : { ok: false, status: 0, error: "Read token unavailable" },
    },
  });
}
