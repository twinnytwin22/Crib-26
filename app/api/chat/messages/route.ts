import { NextRequest, NextResponse } from "next/server";
import { getSessionWithMessages } from "@/lib/providers/supabase/chat-storage";

/**
 * GET /api/chat/messages?sessionKey=xxx
 * Fetches all messages for a given chat session, including agent replies from Google Chat
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionKey = searchParams.get("sessionKey");

    if (!sessionKey) {
      return NextResponse.json(
        { error: "sessionKey is required" },
        { status: 400 }
      );
    }

    const sessionData = await getSessionWithMessages(sessionKey);

    if (!sessionData) {
      return NextResponse.json(
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

    return NextResponse.json({
      success: true,
      session: {
        id: sessionData.session.id,
        key: sessionData.session.session_key,
        threadName: sessionData.session.google_thread_name,
      },
      messages: formattedMessages,
    });
  } catch (error) {
    console.error("Failed to fetch chat messages", error);
    return NextResponse.json(
      { error: "Unable to fetch messages" },
      { status: 500 }
    );
  }
}
