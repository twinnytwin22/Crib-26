import { randomUUID } from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseServerClient } from "./server-client";

const MAX_PREVIEW_LENGTH = 300;

type ChatMessageRole = "visitor" | "agent" | "system";
type ChatMessageSource = "web" | "google_chat" | "email" | "other";

interface ChatSessionRecord {
  id: string;
  session_key: string;
  google_thread_name?: string | null;
}

interface ChatMessageRecord {
  id: string;
  role: ChatMessageRole;
  content: string;
  created_at: string;
  source: ChatMessageSource;
  metadata?: Record<string, unknown> | null;
}

export interface RecordVisitorMessageOptions {
  email?: string;
  message: string;
  clientMessageId: string;
  visitorIdentifier?: string;
  threadName?: string | null;
  source?: ChatMessageSource;
  sessionMetadata?: Record<string, unknown> | null;
  messageMetadata?: Record<string, unknown> | null;
}

export interface RecordVisitorMessageResult {
  sessionId?: string;
  sessionKey?: string;
  messageId?: string;
  inserted?: boolean;
}

export interface RecordAgentMessageOptions {
  message: string;
  googleMessageName: string;
  threadName?: string | null;
  threadKey?: string | null;
  senderDisplayName?: string | null;
  senderEmail?: string | null;
  messageMetadata?: Record<string, unknown> | null;
}

export interface ChatSessionWithMessages {
  session: ChatSessionRecord;
  messages: ChatMessageRecord[];
}

export async function updateSessionThreadName(
  sessionKey: string,
  threadName: string
) {
  const supabase = getSupabaseServerClient();
  if (!supabase) return;

  await supabase
    .from("chat_sessions")
    .update({
      google_thread_name: threadName,
      updated_at: nowISO(),
    })
    .eq("session_key", sessionKey);
}

function normalizeEmail(value?: string | null) {
  return value?.trim().toLowerCase() || undefined;
}

function buildSessionKey(visitorIdentifier?: string) {
  if (visitorIdentifier?.trim()) {
    return visitorIdentifier.trim();
  }
  return undefined;
}

function nowISO() {
  return new Date().toISOString();
}

function preview(message: string) {
  return message.slice(0, MAX_PREVIEW_LENGTH);
}

function isMissingVisitorMessageRpc(error: { code?: string; message?: string } | null) {
  return (
    error?.code === "PGRST202" ||
    Boolean(error?.message?.includes("record_visitor_chat_message"))
  );
}

/**
 * Temporary compatibility path for deployments where the application update
 * arrives before migration 0003. It preserves availability, but lacks the
 * transaction/constraint guarantees supplied by the RPC and should disappear
 * once every environment has the migration.
 */
async function recordVisitorMessageLegacy(
  supabase: SupabaseClient,
  options: RecordVisitorMessageOptions,
  sessionKey: string,
  normalizedEmail?: string
): Promise<RecordVisitorMessageResult | undefined> {
  const { data: session, error: sessionError } = await supabase
    .from("chat_sessions")
    .upsert(
      {
        session_key: sessionKey,
        visitor_email: normalizedEmail ?? null,
        last_message_at: nowISO(),
        last_message_preview: preview(options.message),
        updated_at: nowISO(),
      },
      { onConflict: "session_key" }
    )
    .select("id, session_key, google_thread_name")
    .single();

  if (sessionError || !session) {
    throw sessionError ?? new Error("Unable to create chat session");
  }

  const clientMessageMetadata = {
    ...(options.messageMetadata ?? {}),
    client_message_id: options.clientMessageId,
  };
  const { data: existing } = await supabase
    .from("chat_messages")
    .select("id")
    .eq("session_id", session.id)
    .eq("source", options.source || "web")
    .contains("metadata", { client_message_id: options.clientMessageId })
    .maybeSingle();

  if (existing) {
    return {
      sessionId: session.id,
      sessionKey: session.session_key,
      messageId: existing.id,
      inserted: false,
    };
  }

  const { data: message, error: messageError } = await supabase
    .from("chat_messages")
    .insert({
      session_id: session.id,
      role: "visitor",
      source: options.source || "web",
      content: options.message,
      email: normalizedEmail ?? null,
      metadata: clientMessageMetadata,
      created_at: nowISO(),
    })
    .select("id")
    .single();

  if (messageError || !message) {
    throw messageError ?? new Error("Unable to record chat message");
  }

  console.warn("Chat is using the pre-migration compatibility writer");
  return {
    sessionId: session.id,
    sessionKey: session.session_key,
    messageId: message.id,
    inserted: true,
  };
}

async function findSessionByKey(sessionKey?: string | null) {
  const supabase = getSupabaseServerClient();
  if (!supabase || !sessionKey) return { supabase, session: null } as const;

  const { data: session } = await supabase
    .from("chat_sessions")
    .select("id, session_key, google_thread_name")
    .eq("session_key", sessionKey)
    .maybeSingle();

  return { supabase, session } as const;
}

async function findSessionByThread(threadName?: string | null) {
  const supabase = getSupabaseServerClient();
  if (!supabase || !threadName) {
    return { supabase, session: null } as const;
  }

  const { data: session } = await supabase
    .from("chat_sessions")
    .select("id, session_key, google_thread_name")
    .eq("google_thread_name", threadName)
    .maybeSingle();

  return { supabase, session } as const;
}

async function insertMessage(
  supabase: SupabaseClient,
  sessionId: string,
  role: ChatMessageRole,
  content: string,
  source: ChatMessageSource,
  metadata: Record<string, unknown> | null,
  email?: string | null,
  externalMessageId?: string | null
) {
  return supabase
    .from("chat_messages")
    .insert({
      session_id: sessionId,
      role,
      source,
      content,
      email: email ?? null,
      metadata,
      external_message_id: externalMessageId ?? null,
      created_at: nowISO(),
    })
    .select("id")
    .single();
}

async function externalMessageAlreadyStored(
  supabase: SupabaseClient,
  sessionId: string,
  source: ChatMessageSource,
  externalMessageId?: string | null
) {
  if (!externalMessageId) return false;

  const { data, error } = await supabase
    .from("chat_messages")
    .select("id")
    .eq("session_id", sessionId)
    .eq("source", source)
    .eq("external_message_id", externalMessageId)
    .maybeSingle();

  if (error) {
    console.error("Failed to check existing chat message", error);
    return false;
  }

  return Boolean(data);
}

/**
 * Persists a visitor message so future Google Chat replies can be stitched
 * back into the same Supabase session.
 */
export async function recordVisitorMessage(
  options: RecordVisitorMessageOptions
): Promise<RecordVisitorMessageResult | undefined> {
  const normalizedEmail = normalizeEmail(options.email);
  const sessionKey =
    buildSessionKey(options.visitorIdentifier) ?? randomUUID();

  const { supabase } = await findSessionByKey(sessionKey);
  if (!supabase) {
    return undefined;
  }

  const { data, error } = await supabase.rpc("record_visitor_chat_message", {
    p_session_key: sessionKey,
    p_message: options.message,
    p_client_message_id: options.clientMessageId,
    p_email: normalizedEmail ?? null,
    p_source: options.source || "web",
    p_session_metadata: options.sessionMetadata ?? null,
    p_message_metadata: options.messageMetadata ?? null,
  });
  const result = Array.isArray(data) ? data[0] : data;

  if (error && isMissingVisitorMessageRpc(error)) {
    return recordVisitorMessageLegacy(
      supabase,
      options,
      sessionKey,
      normalizedEmail
    );
  }
  if (error) {
    console.error("Failed to persist visitor chat message", error);
    throw new Error(error.message);
  }
  if (!result?.session_id) {
    console.error("Visitor chat persistence returned no session");
    return undefined;
  }

  return {
    sessionId: result.session_id,
    sessionKey: result.session_key,
    messageId: result.message_id,
    inserted: result.inserted === true,
  };
}

/**
 * Records an agent (Google Chat) reply and links the thread to an existing
 * session using either the thread key or thread name.
 */
export async function recordAgentMessage(
  options: RecordAgentMessageOptions
) {
  const byKey = await findSessionByKey(options.threadKey);
  const supabase = byKey.supabase ?? getSupabaseServerClient();

  if (!supabase) {
    throw new Error("Supabase client unavailable");
  }

  let session: ChatSessionRecord | null = byKey.session ?? null;

  if (!session && options.threadName) {
    const lookup = await findSessionByThread(options.threadName);
    session = lookup.session;
  }

  if (!session) {
    throw new Error("Inbound reply does not match an existing chat session");
  }

  if (
    session.google_thread_name &&
    options.threadName &&
    session.google_thread_name !== options.threadName
  ) {
    throw new Error("Inbound reply thread does not match the session binding");
  }

  const { error: threadUpdateError } = await supabase
    .from("chat_sessions")
    .update({
      google_thread_name: options.threadName ?? session.google_thread_name ?? null,
      last_message_at: nowISO(),
      last_message_preview: preview(options.message),
      updated_at: nowISO(),
    })
    .eq("id", session.id);

  if (threadUpdateError) {
    throw threadUpdateError;
  }

  const metadata: Record<string, unknown> = {
    sender_display_name: options.senderDisplayName ?? null,
    sender_email: options.senderEmail ?? null,
    ...(options.messageMetadata ?? {}),
  };

  if (
    await externalMessageAlreadyStored(
      supabase,
      session.id,
      "google_chat",
      options.googleMessageName
    )
  ) {
    return null;
  }

  return insertMessage(
    supabase,
    session.id,
    "agent",
    options.message,
    "google_chat",
    metadata,
    options.senderEmail ?? null,
    options.googleMessageName
  );
}

export async function getSessionWithMessages(
  sessionKey: string
): Promise<ChatSessionWithMessages | null> {
  const { supabase, session } = await findSessionByKey(sessionKey);
  if (!supabase || !session) {
    return null;
  }

  const { data: messages, error } = await supabase
    .from("chat_messages")
    .select("id, role, content, created_at, source, metadata")
    .eq("session_id", session.id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to fetch chat messages", error);
    return null;
  }

  return {
    session,
    messages: messages ?? [],
  };
}
