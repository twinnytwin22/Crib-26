import {
  getSessionWithMessages,
  recordAgentMessage,
  updateSessionThreadName,
} from "@/lib/providers/supabase/chat-storage";
import {
  buildGoogleChatMessagesUrl,
  getChatReadAccessToken,
  getGoogleChatAuthMode,
  getGoogleChatSpaceName,
  GOOGLE_CHAT_SPACE,
} from "@/lib/google/chat-api";

type GoogleChatMessage = {
  name?: string;
  text?: string;
  createTime?: string;
  sender?: {
    type?: string;
    displayName?: string;
    email?: string;
  };
  thread?: {
    name?: string;
    threadKey?: string;
  };
};

type GoogleChatListResponse = {
  messages?: GoogleChatMessage[];
};

const syncFailureLogCache = new Map<string, number>();
const SYNC_FAILURE_LOG_INTERVAL_MS = 60_000;

async function logSyncFailure(response: Response) {
  const body = await response.text();
  const cacheKey = `${response.status}:${body.slice(0, 200)}`;
  const now = Date.now();
  const lastLoggedAt = syncFailureLogCache.get(cacheKey) ?? 0;
  if (now - lastLoggedAt < SYNC_FAILURE_LOG_INTERVAL_MS) {
    return;
  }

  syncFailureLogCache.set(cacheKey, now);
  console.error("Google Chat message sync failed", {
    status: response.status,
    authMode: getGoogleChatAuthMode(),
    space: getGoogleChatSpaceName(),
    body,
  });
}

function isAgentReply(message: GoogleChatMessage, sessionKey: string) {
  const text = message.text?.trim();
  if (!text) return false;
  if (message.sender?.type === "BOT") return false;
  if (text.includes("New Website Chat")) return false;
  if (text.includes(`Session Key: ${sessionKey}`)) return false;
  return true;
}

function belongsToThread(
  message: GoogleChatMessage,
  sessionKey: string,
  threadName?: string | null
) {
  return (
    message.thread?.threadKey === sessionKey ||
    Boolean(threadName && message.thread?.name === threadName)
  );
}

export async function syncGoogleChatThreadReplies(sessionKey: string) {
  if (!GOOGLE_CHAT_SPACE) return;

  const sessionData = await getSessionWithMessages(sessionKey);
  if (!sessionData) return;

  const token = await getChatReadAccessToken();
  const url = buildGoogleChatMessagesUrl();
  if (!token || !url) return;

  url.searchParams.set("pageSize", "100");
  url.searchParams.set("orderBy", "createTime DESC");

  const savedThreadName = sessionData.session.google_thread_name ?? null;
  if (savedThreadName) {
    url.searchParams.set("filter", `thread.name = "${savedThreadName}"`);
  }

  let messages: GoogleChatMessage[] = [];
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      await logSyncFailure(response);
      return;
    }

    const data = (await response.json()) as GoogleChatListResponse;
    messages = Array.isArray(data.messages) ? data.messages : [];
  } catch (error) {
    console.error("Google Chat message sync error", error);
    return;
  }

  let threadName = savedThreadName;
  if (!threadName) {
    const anchor = messages.find((message) =>
      message.text?.includes(`Session Key: ${sessionKey}`)
    );
    threadName = anchor?.thread?.name ?? null;
    if (threadName) {
      await updateSessionThreadName(sessionKey, threadName);
    }
  }

  const replies = messages.filter(
    (message) =>
      belongsToThread(message, sessionKey, threadName) &&
      isAgentReply(message, sessionKey)
  );

  for (const reply of replies) {
    await recordAgentMessage({
      message: reply.text!.trim(),
      threadName: reply.thread?.name ?? threadName,
      threadKey: sessionKey,
      senderDisplayName: reply.sender?.displayName ?? null,
      senderEmail: reply.sender?.email ?? null,
      messageMetadata: {
        google_message_name: reply.name ?? null,
        google_create_time: reply.createTime ?? null,
        sync_source: "google_chat_messages_list",
      },
    });
  }
}
