This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Chat persistence setup

Two-way chat logging relies on Supabase. Before enabling the chat widget storage helpers, run the migration in `supabase/migrations/0001_chat_sessions.sql` inside your Supabase project (SQL Editor or `supabase db push`). After the tables exist, set `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` (server-only) so the API route can insert sessions and messages.

### Google Chat inbound replies

1. Create a Google Chat app/webhook that points to `POST /api/chat/inbound`.
2. Set `GOOGLE_CHAT_INBOUND_SECRET` in `.env.local` and configure the same shared secret in Google Chat so only trusted events can call the endpoint.
3. Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are populated so the chat widget can subscribe to Supabase Realtime updates in the browser.
4. When Google Chat users reply in the matching thread, the webhook stores the agent message in Supabase, and the widget receives it over Realtime.
