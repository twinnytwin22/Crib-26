-- Chat persistence schema for Supabase
-- Run inside your Supabase/Postgres project once before enabling chat storage

create extension if not exists "pgcrypto";

create table if not exists public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  session_key text not null unique,
  visitor_email text,
  google_thread_name text,
  last_message_at timestamptz not null default now(),
  last_message_preview text,
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.chat_sessions(id) on delete cascade,
  role text not null check (role in ('visitor','agent','system')),
  source text not null default 'web',
  content text not null,
  email text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_chat_sessions_email
  on public.chat_sessions using btree (lower(coalesce(visitor_email, '')));

create index if not exists idx_chat_sessions_google_thread
  on public.chat_sessions using btree (google_thread_name);

create index if not exists idx_chat_sessions_last_message
  on public.chat_sessions using btree (last_message_at desc);

create index if not exists idx_chat_messages_session_time
  on public.chat_messages using btree (session_id, created_at);

comment on table public.chat_sessions is 'Visitors and Google Chat threads for site chat widget.';
comment on table public.chat_messages is 'Chronological log of chat messages tied to chat_sessions.';
