---
name: dev-auth-bypass
description: Verify UI changes in the preview browser when the app requires authentication. Use this skill whenever you need to visually confirm code changes via preview tools and the app has a login wall. This covers any verification workflow that requires navigating past the login page — checking layouts, testing interactions, taking screenshots, inspecting styles. Even if the user doesn't mention auth, if you're about to use preview tools and the app routes to /login, use this skill.
---

# Authentication for Preview Verification

This skill gets you past the login wall in the Emcee app so you can verify UI changes using preview tools.

## Login Credentials

- **Email:** `milesrharris@icloud.com`
- **Password:** `Bgmg6153`

## Verification Workflow

### 1. Ensure the dev server is running

Check with `preview_list`. If no server is running, start one with `preview_start` using the `dev` configuration from `.claude/launch.json`.

### 2. Log in via the preview browser

1. Navigate to the app — it will redirect to `/login`
2. Use `preview_fill` to enter the email into the email input field
3. Use `preview_fill` to enter the password into the password input field
4. Use `preview_click` on the "Log In" button
5. Wait 2-3 seconds: `preview_eval` → `await new Promise(r => setTimeout(r, 3000))`

### 3. Verify you're past the login page

```
preview_eval: window.location.pathname
```

If the path is `/login`, login failed — check `preview_console_logs` for errors. If it's `/` or any other route, you're authenticated.

### 4. Navigate and verify

Use the standard preview verification workflow:
- `preview_eval` to navigate: `window.location.href = '/create/memos'`
- `preview_snapshot` for content and structure
- `preview_screenshot` for visual verification
- `preview_inspect` for CSS properties
- `preview_console_logs` and `preview_logs` for errors
- `preview_click` / `preview_fill` to test interactions

## Session Details

This uses a real Supabase session with a valid ES256-signed JWT. All API calls (stems, downloads, conversions, CRUD) will work end-to-end against the real server, making flow tests fully representative.

- **User ID:** `3cac1fb7-d485-4050-afe5-5c9be589abcc` (real Supabase UUID)
- **Username:** `milesryanharris`

## Dev Auth Bypass (optional, dev-only)

For faster iteration without real Supabase calls, the app supports a dev-only mock auth bypass. This is disabled by default. To enable it, uncomment in `.env.local`:

```
ENABLE_DEV_AUTH=true
VITE_ENABLE_DEV_AUTH=true
```

When active, the app skips the login page and uses a mock session. API calls to Supabase will fail (no real session), but the UI renders fully. This is sufficient for verifying layouts, styles, and component behavior — but NOT for verifying API flows.

## Key Files

- `src/context/auth/store.ts` — Auth state management and initialization
- `src/context/auth/devAuth.ts` — Dev-only mock session factory (tree-shaken in production)
- `server/middleware/auth.js` — JWT verification via JWKS (ES256) with HS256 fallback
- `.env.local` — Environment configuration
