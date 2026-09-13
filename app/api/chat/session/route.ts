import { NextResponse } from "next/server";
import {
  clearChatSessionCookie,
  createChatSessionToken,
  setChatSessionCookie,
} from "@/lib/chat/session-cookie";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function privateJson(body: unknown) {
  const response = NextResponse.json(body);
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  response.headers.set("Vary", "Cookie");
  return response;
}

export async function POST() {
  const response = privateJson({ success: true });
  setChatSessionCookie(response, createChatSessionToken());
  return response;
}

export async function DELETE() {
  const response = privateJson({ success: true });
  clearChatSessionCookie(response);
  return response;
}