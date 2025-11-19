# Chat Bot Two-Way Communication Setup

## Overview
Your chat bot now supports **two-way communication** with Google Chat. When someone replies in Google Chat, those messages automatically appear in your website chat UI.

## How It Works

### 1. **Visitor Sends Message** (Website → Google Chat)
```
User types in chat widget
  → POST /api/chat
  → Saves to Supabase (chat_sessions + chat_messages tables)
  → Sends to Google Chat webhook
  → Sends email notification
  → Returns session info to UI
```

### 2. **Agent Replies** (Google Chat → Website)
```
Agent replies in Google Chat
  → POST /api/chat/inbound (Google Chat webhook)
  → Saves reply to Supabase with session/thread info
  → Real-time trigger fires
  → UI receives message via Supabase Realtime
  → Message appears in chat widget
```

### 3. **Fallback Polling**
If real-time doesn't work (firewall, Supabase config, etc.), the UI polls every 5 seconds:
```
setInterval (5s)
  → GET /api/chat/messages?sessionKey=xxx
  → Fetches all messages for session
  → Displays any new messages
```

## Setup Requirements

### ✅ Already Configured
- [x] Supabase client (browser + server)
- [x] Environment variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
- [x] Database tables (chat_sessions, chat_messages)
- [x] Outbound webhook (website → Google Chat)
- [x] Inbound endpoint (/api/chat/inbound)
- [x] Real-time subscription in UI
- [x] Polling fallback

### 🔧 Google Chat Configuration Needed

1. **Configure Google Chat App/Bot** with webhook URL:
   ```
   https://yourdomain.com/api/chat/inbound
   ```

2. **Set up authentication header** in Google Chat app config:
   - Add custom header: `x-goog-chat-secret: YOUR_SECRET`
   - Or: `Authorization: Bearer YOUR_SECRET`
   - Set `GOOGLE_CHAT_INBOUND_SECRET` in your `.env.local`

3. **Enable Supabase Realtime** on your database:
   - Go to Supabase Dashboard → Database → Replication
   - Enable replication for `chat_messages` table
   - Set row-level security policies to allow anon reads

### 🧪 Testing

1. **Test Outbound** (Website → Google Chat):
   ```bash
   # Send a test message from your chat widget
   # Check Google Chat space for the message
   ```

2. **Test Inbound** (Google Chat → Website):
   ```bash
   # Reply in Google Chat
   # Check browser console for "Realtime subscription status"
   # Message should appear in chat widget within 5 seconds (polling fallback)
   ```

3. **Verify Session Linking**:
   ```bash
   # Check console for session key in outbound message
   # Reply in Google Chat
   # Verify reply is linked to same session in Supabase
   ```

## Debugging

### Real-time not working?
1. Check browser console for "Realtime subscription status"
2. Verify Supabase replication is enabled
3. Check network tab for WebSocket connection
4. Polling should work as fallback (every 5 seconds)

### Messages not appearing?
1. Check `/api/chat/messages?sessionKey=XXX` returns messages
2. Verify `session_id` in chat_messages matches session
3. Check `google_thread_name` is being set correctly

### Thread not linking?
1. Ensure Google Chat sends `thread.name` or `threadKey` in webhook payload
2. Check `/api/chat/inbound` is receiving and parsing thread info
3. Verify `recordAgentMessage` is matching sessions correctly

## Environment Variables

```bash
# Supabase (required for two-way chat)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Google Chat Outbound (website → Google Chat)
GOOGLE_CHAT_WEBHOOK_URL=https://chat.googleapis.com/v1/spaces/YOUR_SPACE/messages?key=XXX

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
| `/api/chat/messages` | GET | Fetch all messages for a session |

## Database Schema

### chat_sessions
```sql
- id (uuid, primary key)
- session_key (text, unique) -- Links website session to Google Chat thread
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

1. **Enable Supabase Realtime** on `chat_messages` table
2. **Configure Google Chat webhook** to point to `/api/chat/inbound`
3. **Test end-to-end** by sending a message and replying in Google Chat
4. **Monitor logs** in browser console and server logs for any errors

---

Built with ❤️ for Crib Network
