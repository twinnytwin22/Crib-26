-- Keep chat transcripts private. Server routes use the service role key,
-- which bypasses RLS; browsers should not read these tables directly.

alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;
