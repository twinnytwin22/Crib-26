import { randomUUID } from "crypto";
import type { NextRequest, NextResponse } from "next/server";

export const CHAT_SESSION_COOKIE = "crib_chat_session";
export const CHAT_SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;
const CHAT_SESSION_TOKEN_PREFIX = "cribsess_";

export function createChatSessionToken() {
  return `${CHAT_SESSION_TOKEN_PREFIX}${randomUUID()}`;
}

export function getChatSessionToken(req: NextRequest) {
  const token = req.cookies.get(CHAT_SESSION_COOKIE)?.value?.trim();
  return isValidChatSessionToken(token) ? token : null;
}

export function isValidChatSessionToken(token?: string | null) {
  if (!token) return false;
  return /^cribsess_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(
    token
  );
}

export function setChatSessionCookie(response: NextResponse, token: string) {
  response.cookies.set({
    name: CHAT_SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: CHAT_SESSION_COOKIE_MAX_AGE,
  });
}
