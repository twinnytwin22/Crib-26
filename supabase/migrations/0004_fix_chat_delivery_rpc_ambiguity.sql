-- Fixes the PL/pgSQL output-column ambiguity in migration 0003. This is a
-- follow-up migration because 0003 may already be recorded as applied.

create or replace function public.record_visitor_chat_message(
  p_session_key text,
  p_message text,
  p_client_message_id text,
  p_email text default null,
  p_source text default 'web',
  p_session_metadata jsonb default null,
  p_message_metadata jsonb default null
)
returns table (
  session_id uuid,
  session_key text,
  message_id uuid,
  inserted boolean
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_session public.chat_sessions%rowtype;
  v_message_id uuid;
  v_inserted boolean := false;
begin
  if p_session_key is null or length(trim(p_session_key)) = 0 then
    raise exception 'session key is required';
  end if;
  if p_client_message_id is null or length(trim(p_client_message_id)) = 0 then
    raise exception 'client message id is required';
  end if;

  insert into public.chat_sessions (
    session_key, visitor_email, last_message_at, last_message_preview, metadata
  )
  values (
    p_session_key,
    nullif(lower(trim(p_email)), ''),
    now(),
    left(p_message, 300),
    p_session_metadata
  )
  on conflict on constraint chat_sessions_session_key_key do update set
    visitor_email = coalesce(excluded.visitor_email, public.chat_sessions.visitor_email),
    last_message_at = excluded.last_message_at,
    last_message_preview = excluded.last_message_preview,
    metadata = coalesce(excluded.metadata, public.chat_sessions.metadata),
    updated_at = now()
  returning * into v_session;

  if (
    select count(*)
    from public.chat_messages as chat_message
    where chat_message.session_id = v_session.id
      and chat_message.role = 'visitor'
      and chat_message.created_at >= now() - interval '1 minute'
  ) >= 12 then
    raise exception 'chat rate limit exceeded';
  end if;

  insert into public.chat_messages (
    session_id, role, source, content, email, metadata, external_message_id
  )
  values (
    v_session.id, 'visitor', p_source, p_message,
    nullif(lower(trim(p_email)), ''), p_message_metadata, p_client_message_id
  )
  on conflict (session_id, source, external_message_id) do nothing
  returning id into v_message_id;

  v_inserted := v_message_id is not null;
  if v_message_id is null then
    select chat_message.id into v_message_id
    from public.chat_messages as chat_message
    where chat_message.session_id = v_session.id
      and chat_message.source = p_source
      and chat_message.external_message_id = p_client_message_id;
  end if;

  return query select v_session.id, v_session.session_key, v_message_id, v_inserted;
end;
$$;

revoke all on function public.record_visitor_chat_message(text, text, text, text, text, jsonb, jsonb)
  from public;
grant execute on function public.record_visitor_chat_message(text, text, text, text, text, jsonb, jsonb)
  to service_role;
