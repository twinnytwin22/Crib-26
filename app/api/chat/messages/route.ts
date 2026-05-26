import { NextRequest, NextResponse } from "next/server";
import { getSessionWithMessages } from "@/lib/providers/supabase/chat-storage";
import { getChatSessionToken } from "@/lib/chat/session-cookie";
import { syncGoogleChatThreadReplies } from "@/lib/google/chat-thread-sync";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function privateJson(body: unknown, init?: ResponseInit) {
  const response = NextResponse.json(body, init);
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  response.headers.set("Vary", "Cookie");
  return response;
}

/**
 * GET /api/chat/messages
 * Fetches messages for the chat session owned by the current browser cookie.
 */
export async function GET(req: NextRequest) {
  try {
    const sessionKey = getChatSessionToken(req);

    if (!sessionKey) {
      return privateJson({ success: true, session: null, messages: [] });
    }

    await syncGoogleChatThreadReplies(sessionKey);

    const sessionData = await getSessionWithMessages(sessionKey);

    if (!sessionData) {
      return privateJson(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    const formattedMessages = sessionData.messages.map((msg) => ({
      id: msg.id,
      content: msg.content,
      sender: msg.role === "visitor" ? "user" : "bot",
      timestamp: new Date(msg.created_at),
      source: msg.source,
    }));

    return privateJson({
      success: true,
      session: {
        id: sessionData.session.id,
        threadName: sessionData.session.google_thread_name,
      },
      messages: formattedMessages,
    });
  } catch (error) {
    console.error("Failed to fetch chat messages", error);
    return privateJson(
      { error: "Unable to fetch messages" },
      { status: 500 }
    );
  }
}
