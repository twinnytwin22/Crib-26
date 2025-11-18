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
}

export interface RecordVisitorMessageOptions {
  email?: string;
  message: string;
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
}

export interface RecordAgentMessageOptions {
  message: string;
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

function normalizeEmail(value?: string | null) {
  return value?.trim().toLowerCase() || undefined;
}

function buildSessionKey(visitorIdentifier?: string, email?: string) {
  if (visitorIdentifier?.trim()) {
    return visitorIdentifier.trim();
  }
  if (email) {
    return email;
  }
  return undefined;
}

function nowISO() {
  return new Date().toISOString();
}

function preview(message: string) {
  return message.slice(0, MAX_PREVIEW_LENGTH);
}

async function upsertSessionFromVisitor(
  supabase: SupabaseClient,
  options: RecordVisitorMessageOptions,
  sessionKey: string,
  normalizedEmail?: string
) {
  const sessionPayload: Record<string, unknown> = {
    session_key: sessionKey,
    visitor_email: normalizedEmail ?? null,
    last_message_at: nowISO(),
    last_message_preview: preview(options.message),
    updated_at: nowISO(),
  };

  if (options.threadName) {
    sessionPayload.google_thread_name = options.threadName;
  }

  if (options.sessionMetadata) {
    sessionPayload.metadata = options.sessionMetadata;
  }

  return supabase
    .from("chat_sessions")
    .upsert(sessionPayload, { onConflict: "session_key" })
    .select("id, session_key, google_thread_name")
    .single();
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
  email?: string | null
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
      created_at: nowISO(),
    })
    .select("id")
    .single();
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
    buildSessionKey(options.visitorIdentifier, normalizedEmail) ?? randomUUID();

  const { supabase } = await findSessionByKey(sessionKey);
  if (!supabase) {
    return undefined;
  }

  const { data: session, error: sessionError } = await upsertSessionFromVisitor(
    supabase,
    options,
    sessionKey,
    normalizedEmail
  );

  if (sessionError || !session) {
    console.error("Failed to upsert chat session", sessionError);
    return undefined;
  }

  const { data: message, error: messageError } = await insertMessage(
    supabase,
    session.id,
    "visitor",
    options.message,
    options.source || "web",
    options.messageMetadata ?? null,
    normalizedEmail ?? null
  );

  if (messageError || !message) {
    console.error("Failed to record chat message", messageError);
    return {
      sessionId: session.id,
      sessionKey: session.session_key,
    };
  }

  return {
    sessionId: session.id,
    sessionKey: session.session_key,
    messageId: message.id,
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

  if (!session && options.threadKey) {
    const { data, error } = await supabase
      .from("chat_sessions")
      .insert({
        session_key: options.threadKey,
        google_thread_name: options.threadName ?? null,
        last_message_at: nowISO(),
        last_message_preview: preview(options.message),
        created_at: nowISO(),
        updated_at: nowISO(),
      })
      .select("id, session_key, google_thread_name")
      .single();

    if (error || !data) {
      throw error ?? new Error("Unable to create chat session for agent reply");
    }
    session = data;
  }

  if (!session) {
    throw new Error("Unable to map agent reply to a chat session");
  }

  await supabase
    .from("chat_sessions")
    .update({
      google_thread_name: options.threadName ?? session.google_thread_name ?? null,
      last_message_at: nowISO(),
      last_message_preview: preview(options.message),
      updated_at: nowISO(),
    })
    .eq("id", session.id);

  const metadata = {
    sender_display_name: options.senderDisplayName ?? null,
    sender_email: options.senderEmail ?? null,
    ...(options.messageMetadata ?? {}),
  };

  return insertMessage(
    supabase,
    session.id,
    "agent",
    options.message,
    "google_chat",
    metadata,
    options.senderEmail ?? null
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
    .select("id, role, content, created_at, source")
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
