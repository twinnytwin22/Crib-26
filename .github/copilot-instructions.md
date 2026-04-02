# Project Guidelines

## Build And Test
- Install dependencies with `npm install`.
- Start local development with `npm run dev`.
- Run lint checks with `npm run lint` before finalizing changes.
- Build for production verification with `npm run build`.
- Use `node scripts/test-chat.mjs` for manual chat webhook sanity checks when touching chat/inbound flow.

## Architecture
- This is a Next.js App Router project (`app/`) with TypeScript and Tailwind CSS v4.
- Keep route handlers in `app/api/**/route.ts`; keep UI in `components/` and providers/integrations in `lib/providers/`.
- Supabase chat persistence schema is managed via SQL migrations in `supabase/migrations/`.
- External integrations are split by provider: Sanity (`lib/providers/sanity/`), Stripe (`lib/providers/stripe/`), Supabase (`lib/providers/supabase/`).

## Conventions
- Preserve server/client boundaries using `"use server"` and `"use client"` exactly where needed.
- Follow existing shadcn/ui + CVA patterns in `components/ui/` for variants and `forwardRef` composition.
- Prefer the `@/*` import alias and keep types explicit for API inputs/outputs.
- Do not hardcode secrets; rely on `.env.local` variables used by chat/contact integrations.
- When changing chat persistence behavior, keep compatibility with `supabase/migrations/0001_chat_sessions.sql`.

## Ops Notes
- `next.config.ts` includes security headers and CORS headers for `/api/*`; preserve these unless intentionally changing security behavior.
- Remote image domains are restricted (`cdn.sanity.io`, `images.unsplash.com`) and should remain explicit.
- Contact and chatbot setup docs live in `CONTACT_FORM_SETUP.md` and `CHATBOT_SETUP.md`; update them if integration behavior changes.
