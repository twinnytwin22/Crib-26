-- Opaque access tokens for MCP clients and OAuth client-credentials grants.
-- Only a SHA-256 digest is persisted, so a database export cannot be used as
-- a bearer-token list.
create table if not exists public.access_tokens (
  id uuid primary key default gen_random_uuid(),
  token_hash text not null unique,
  token_prefix text not null,
  name text not null,
  token_type text not null check (token_type in ('mcp', 'oauth')),
  subject text,
  scopes text[] not null default '{}',
  expires_at timestamptz,
  last_used_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists access_tokens_active_lookup_idx
  on public.access_tokens (token_hash)
  where revoked_at is null;

alter table public.access_tokens enable row level security;
