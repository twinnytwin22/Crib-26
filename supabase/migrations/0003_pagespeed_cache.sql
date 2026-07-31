-- Shared PageSpeed cache. One scan result is retained per normalized domain for one hour.
-- Server routes use the Supabase service role; browser clients have no access.

create table if not exists public.pagespeed_domain_cache (
  domain text primary key,
  scanned_url text not null,
  result jsonb not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);

create index if not exists idx_pagespeed_domain_cache_expires_at
  on public.pagespeed_domain_cache (expires_at);

alter table public.pagespeed_domain_cache enable row level security;

comment on table public.pagespeed_domain_cache is 'One-hour server-side PageSpeed Insights cache, keyed by normalized domain.';
