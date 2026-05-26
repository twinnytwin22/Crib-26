# Chat Bot Two-Way Communication Setup

## Overview
Your chat bot now supports **two-way communication** with Google Chat. When someone replies in Google Chat, those messages automatically appear in your website chat UI.

## How It Works

### 1. **Visitor Sends Message** (Website → Google Chat)
```
User types in chat widget
  → POST /api/chat
  → Sets an HttpOnly visitor session cookie
  → Saves to Supabase (chat_sessions + chat_messages tables)
  → Sends to Google Chat
  → Sends email notification
  → Returns session info to UI
```

### 2. **Agent Replies** (Google Chat → Website)
```
Agent replies in Google Chat
  → POST /api/chat/inbound (Google Chat app HTTP endpoint)
  → Saves reply to Supabase with session/thread info
  → UI polls the cookie-owned message endpoint
  → Message appears in chat widget
```

### 3. **Message Polling**
After a session exists, the UI polls every 5 seconds:
```
setInterval (5s)
  → GET /api/chat/messages
  → Fetches messages for the browser's HttpOnly chat session cookie
  → Displays any new messages
```

## Setup Requirements

### ✅ Already Configured
- [x] Supabase client (browser + server)
- [x] Environment variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
- [x] Database tables (chat_sessions, chat_messages)
- [x] Outbound delivery (website → Google Chat)
- [x] Inbound endpoint (/api/chat/inbound)
- [x] Cookie-owned message polling in UI
- [x] RLS migration to keep browser clients from reading chat tables directly

### 🔧 Google Chat Configuration Needed

1. **Configure Google Chat App/Bot** with HTTP endpoint URL:
   ```
   https://yourdomain.com/api/chat/inbound
   ```

2. **Set up authentication header** in Google Chat app config:
   - Add custom header: `x-goog-chat-secret: YOUR_SECRET`
   - Or: `Authorization: Bearer YOUR_SECRET`
   - Or configure the endpoint URL as `/api/chat/inbound?secret=YOUR_SECRET`
   - Set `GOOGLE_CHAT_INBOUND_SECRET` in your `.env.local`

3. **Run Supabase migrations**:
   - Run `supabase/migrations/0001_chat_sessions.sql`
   - Run `supabase/migrations/0002_chat_session_security.sql`
   - Browser clients should not read `chat_sessions` or `chat_messages` directly.

### 🧪 Testing

1. **Test Outbound** (Website → Google Chat):
   ```bash
   # Send a test message from your chat widget
   # Check Google Chat space for the message
   ```

2. **Test Inbound** (Google Chat → Website):
   ```bash
   # Reply in Google Chat
   # Message should appear in chat widget within 5 seconds
   ```

3. **Verify Session Linking**:
   ```bash
   # Reply in Google Chat
   # Verify reply is linked to the same session in Supabase
   ```

## Debugging

### Replies not appearing?
1. Verify the Google Chat app points to `/api/chat/inbound`
2. Verify `GOOGLE_CHAT_INBOUND_SECRET` is configured
3. Confirm the browser still has the `crib_chat_session` cookie
4. Polling runs every 5 seconds after a session exists

### Messages not appearing?
1. Check `/api/chat/messages` returns messages from the same browser/session cookie
2. Verify `session_id` in chat_messages matches session
3. Check `google_thread_name` is being set correctly

### Thread not linking?
1. Ensure Google Chat sends `thread.name` or `threadKey` in the event payload
2. Check `/api/chat/inbound` is receiving and parsing thread info
3. Verify `recordAgentMessage` is matching sessions correctly

## Environment Variables

```bash
# Supabase (required for two-way chat)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Google Chat Outbound (website → Google Chat)
GOOGLE_CHAT_SPACE=AAAA... # or CHAT_SPACE_ID=AAAA...
GOOGLE_CHAT_WEBHOOK_URL=https://chat.googleapis.com/v1/spaces/YOUR_SPACE/messages?key=XXX
GOOGLE_CHAT_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
# Or split credentials:
GOOGLE_CHAT_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_CHAT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Google Chat Inbound (Google Chat → website)
GOOGLE_CHAT_INBOUND_SECRET=your-secret-token

# Email notifications (optional)
CHAT_FORWARD_EMAIL=support@yourdomain.com
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
```

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/chat` | POST | Send message from website to Google Chat |
| `/api/chat/inbound` | POST | Receive replies from Google Chat |
| `/api/chat/messages` | GET | Fetch messages for the current session cookie |

## Database Schema

### chat_sessions
```sql
- id (uuid, primary key)
- session_key (text, unique) -- Opaque visitor session token; do not expose in the UI
- google_thread_name (text) -- Google Chat thread identifier
- visitor_email (text)
- last_message_at (timestamptz)
- last_message_preview (text)
- metadata (jsonb)
```

### chat_messages
```sql
- id (uuid, primary key)
- session_id (uuid, foreign key)
- role (enum: visitor, agent, system)
- source (enum: web, google_chat, email, other)
- content (text)
- email (text)
- metadata (jsonb)
- created_at (timestamptz)
```

## Next Steps

1. **Run both Supabase migrations**
2. **Configure a Google Chat app HTTP endpoint** to point to `/api/chat/inbound`
3. **Test end-to-end** by sending a message and replying in Google Chat
4. **Monitor logs** in browser console and server logs for any errors

---

Built with ❤️ for Crib Network
