---
name: structural-integrity
description: Maintain functional integrity of the Emcee codebase. Before making any non-cosmetic change, assess what could break. After making changes, verify nothing broke. Keep structure.md updated when functional changes are made. Trigger this skill on any code change that affects behavior — route changes, data layer modifications, auth logic, API contracts, database schema, external tool integrations, or component wiring. Skip for purely cosmetic changes (CSS-only, copy text, spacing, colors, font changes).
---

# Structural Integrity

This skill protects the Emcee codebase from regressions by enforcing a three-phase discipline: assess before changing, verify after changing, and keep the architecture reference (`structure.md`) up to date.

## When to Apply

Apply on any change that affects **behavior** — routes, data flow, auth, database schema, imports/exports, external tool invocations, or component wiring. Skip for purely cosmetic changes (CSS-only, copy text, spacing, colors, fonts, animations).

## Phase 1 — Pre-Change Assessment

Before editing any files:

### 1. Read `structure.md`

Read `structure.md` at the repo root to understand the current architecture. This is your map of the system.

### 2. Identify affected zones

Determine which zone(s) the change touches:

| Zone | Files |
|------|-------|
| Backend routes | `server/routes/*.js`, `server/index.js` |
| Backend libs | `server/lib/*.js`, `server/db.js` |
| Auth system | `server/middleware/auth.js`, `src/context/auth/`, `src/lib/data/helpers.ts` |
| Data layer | `src/lib/data/*.ts` (especially `cache.ts` and `index.ts`) |
| Shared utilities | `src/utils/api.js`, `src/utils/storage.js` |
| Database schema | `src/types/Database.ts`, Supabase migrations |
| External tools | yt-dlp, FFmpeg, Demucs invocations in server routes |
| Frontend pages | `src/pages/**/*.jsx` (only if changing data calls or wiring) |

### 3. Trace dependencies

For each affected zone, check what depends on it. Key chains:

- **Data layer chain:** `pages` -> `cache.ts` -> entity modules (`songs.ts`, `demos.ts`, etc.) -> `supabase` client -> `helpers.ts`
- **API chain:** `pages` -> `apiFetch()` (`src/utils/api.js`) -> server routes -> auth middleware -> server libs
- **Auth chain:** `auth store` (`src/context/auth/store.ts`) -> supabase client; `AuthProvider` -> auth store + migrate + hydrate
- **Export chain:** Entity modules are imported by `cache.ts`, which re-exports wrapped versions. `index.ts` barrel-exports from all entity modules directly. Adding, removing, or renaming a function in any entity module must be reflected in `cache.ts` if it has a cached wrapper there.
- **Type chain:** `Database.ts` types are imported by every data module — changing a table type ripples to all modules that use `Tables<>` / `TablesInsert<>` / `TablesUpdate<>`.
- **Auth middleware:** All `/api/*` routes pass through `server/middleware/auth.js` — any change to middleware affects every route.

### 4. State the risk

Write one sentence summarizing what could break before proceeding. Example: "Renaming `getSongs` in `songs.ts` would break `cache.ts` re-export and every page that imports it."

## Phase 2 — Make the Change

No special process. Write the code.

## Phase 3 — Post-Change Verification

### Step 1: Static checks

Run whichever checks are relevant to the change:

- **TypeScript files changed:** `npx tsc --noEmit` — catches broken imports, type mismatches
- **Frontend bundle affected** (imports, exports, new modules): `npx vite build` — catches dead imports, syntax errors
- **Backend files changed:** Verify no syntax/import errors (e.g., `node -e "import('./server/index.js')"` or check server logs after restart)
- **Data layer files changed:** Confirm `src/lib/data/index.ts` and `src/lib/data/cache.ts` export chains are intact — grep for the function name in both files

If static checks fail, fix them before proceeding to flow verification.

### Step 2: Identify affected flows

Using the zones identified in Phase 1, look up which user flows need runtime verification:

| Files touched | Flows to verify |
|---|---|
| `server/routes/stems.js`, `server/lib/stemCache.js`, `src/pages/resources/StemExtractor.jsx` | Stem Extraction |
| `server/routes/download.js`, `src/pages/resources/YoutubeDownloader.jsx` | Media Download |
| `server/routes/convert.js`, `src/pages/resources/AudioConverter.jsx` | Audio Conversion |
| `src/pages/manage/Songs.jsx`, `src/pages/create/NewSong.jsx`, `src/lib/data/songs.ts` | Song CRUD |
| `src/pages/manage/Demos.jsx`, `src/lib/data/demos.ts` | Demo CRUD |
| `src/pages/create/Memos.jsx`, `src/lib/data/memos.ts` | Memo CRUD |
| `src/pages/resources/Mixer.jsx` | Mixer |
| `src/pages/Home.jsx` | Dashboard |
| `src/pages/resources/Files.jsx`, `src/lib/data/files.ts` | Files List |
| `src/pages/create/Lyrics.jsx`, `src/lib/data/lyrics.ts` | Lyrics CRUD |
| `src/pages/resources/Calendar.jsx`, `src/lib/data/calendar_entries.ts` | Calendar |
| `src/lib/data/cache.ts`, `src/utils/storage.js` | **ALL** data-dependent flows |
| `src/utils/api.js`, `server/middleware/auth.js`, `src/context/auth/*` | **ALL** API-dependent flows |
| `server/lib/jobQueue.js`, `server/lib/jobTracker.js` | Stem Extraction + Media Download + Audio Conversion |
| `server/index.js` | **ALL** server-dependent flows |

When a change touches multiple zones, union the affected flows and deduplicate.

### Step 3: Run flow verification

Flow verification uses preview tools and requires the dev-auth-bypass skill for authentication. There are two tiers — always run the appropriate tier for each affected flow.

**Before starting:** Ensure the dev server is running (`preview_list` / `preview_start`). Authenticate using real Supabase login (see Authentication section below). Confirm you are not on `/login`.

#### Tier 1 — Smoke test (always run for affected pages)

For each affected page:

1. Navigate: `preview_eval` → `window.location.href = '<route>'`
2. **Wait 3 seconds:** `preview_eval` → `await new Promise(r => setTimeout(r, 3000))` — many errors come from async operations (API calls, data fetches, lazy imports) that fire after the initial render. Checking immediately will miss these.
3. Structure: `preview_snapshot` → verify key elements are present (headings, buttons, lists/empty states)
4. Errors: `preview_console_logs` → filter for `error|Error|uncaught|TypeError|ReferenceError|Failed|500|404` (ignore React dev warnings, Vite HMR messages, deprecation notices)
5. Network: `preview_network` with `filter: 'failed'` → check for failed API requests

**Real auth note:** The app uses real Supabase auth (no dev bypass). API calls hit the real server and return real data, so flow tests are fully representative. When changes touch API endpoints or data-fetching code, also verify by:
- Grepping for any remaining references to deleted/renamed endpoints (e.g., `grep -r 'api/files' src/`)
- Confirming all data-fetching calls use the correct abstraction layer (`dataCache.*` / entity modules) rather than raw `apiFetch()` to deleted routes

If any smoke test fails, stop and fix before running flow tests.

#### Tier 2 — Flow test (run when critical-path files were modified)

Run the full interaction sequence for each directly affected flow. A flow test is required when the changed file is listed in the "Files touched" column of the zone-to-flow table above. If the change is in a shared file (cache.ts, api.js, etc.), pick the most relevant flow to test fully and smoke-test the rest.

**Flow: Stem Extraction** — Route: `/resources/stem-extractor`
1. Verify upload zone renders (drop area with upload text)
2. Verify "Select from App Files" button is present
3. If server is running: upload a test audio file or click an app file
4. Verify processing begins — progress UI appears OR a meaningful error message is shown (not a blank failure or crash)
5. If Demucs is unavailable: confirm the error is user-friendly, not a 500 or unhandled exception
6. If processing completes: verify stem tabs appear with playback controls

**Flow: Media Download** — Route: `/resources/media-downloader`
1. Verify URL input field, format toggle (MP3/WAV), and Download button are present
2. Download button should be disabled with no URL entered
3. Fill an invalid URL (e.g., "not-a-url") → click Download
4. Verify a user-visible error appears (not a crash or blank state)
5. If yt-dlp is available: fill a real short YouTube URL → verify progress UI appears

**Flow: Audio Conversion** — Route: `/resources/audio-converter`
1. Verify upload zone and format selector render
2. Verify "Select from App Files" button is present
3. If server is running: submit without a file or with wrong format → verify meaningful error, not a crash

**Flow: Song CRUD** — Route: `/manage/songs`
1. Verify song list or empty state renders
2. Navigate to create a new song → fill title "Test Song - Verify" → save
3. Verify the song appears in the list
4. Open the song detail → verify it loads
5. Delete "Test Song - Verify" → verify it disappears from the list

**Flow: Demo CRUD** — Route: `/manage/demos`
1. Verify demo list or empty state renders
2. Check that recording/upload controls are present and interactive

**Flow: Memo CRUD** — Route: `/create/memos`
1. Verify memo list or empty state renders
2. Verify record button is present and interactive (click it, check state change)

**Flow: Mixer** — Route: `/resources/mixer`
1. Verify track lanes or upload area renders
2. Check that audio controls (play, volume) are present
3. If stems exist from a prior extraction: verify they load in the mixer

**Flow: Dashboard** — Route: `/dashboard`
1. Verify stat cards render with numeric counts (Songs, Demos, Memos)
2. Click one stat card link → verify navigation to the correct page
3. Navigate back to dashboard

**Flow: Files List** — Route: `/manage/files`
1. Verify file list or empty state renders
2. Check filter/sort controls are present and interactive

**Flow: Lyrics CRUD** — Route: `/create/lyrics`
1. Verify lyrics editor or folder list renders
2. Create a test lyric entry → verify it appears → delete it

**Flow: Calendar** — Route: `/resources/schedule`
1. Verify calendar grid or list renders
2. Check that date navigation controls work

### Step 4: Cleanup and report

- **Delete any test data** created during flow tests (e.g., "Test Song - Verify")
- **Report results:** State which flows were tested, at which tier, and whether they passed
- If a flow test was skipped due to missing external tools (Demucs, yt-dlp, FFmpeg), note: "Full flow skipped — [tool] unavailable. Smoke test and error handling verified."

### Proportional effort

Use judgment to scale verification appropriately:

| Change scope | Static checks | Smoke tests | Flow tests |
|---|---|---|---|
| CSS-only / cosmetic | Skip all | Skip all | Skip all |
| One-line bugfix in a single component | File parse check | Affected page only | Skip |
| Single component behavioral change | Relevant checks | Affected page | Affected flow |
| Data layer change (entity module) | tsc + build | All data pages | Affected entity CRUD |
| Shared utility change (cache.ts, api.js, storage.js) | tsc + build | All dependent pages | One representative flow |
| Auth change | tsc + build | Dashboard + one page per section | Auth bypass confirmation |
| Server route change | Server syntax check | Affected page | Affected flow |
| Server lib change (jobQueue, jobTracker) | Server syntax check | All job-dependent pages | One job flow (e.g., stems) |
| New feature / major refactor | Full static suite | All affected pages | All affected flows |

### Update `structure.md`

If the change was **functional** (new route, changed data flow, new table, changed auth, new external tool usage, new data module), update the relevant section of `structure.md` and set the "Last updated" date in the header. If the change was a bugfix that did not alter architecture, no update is needed.

## Authentication

The app uses real Supabase auth. To verify flows in the preview browser, log in with these credentials:

- **Email:** `milesrharris@icloud.com`
- **Password:** `Bgmg6153`

### Login procedure

1. Navigate to the app (it will redirect to `/login`)
2. Use `preview_fill` to enter email and password into the login form
3. Use `preview_click` on the "Log In" button
4. Wait 2-3 seconds, then verify with `preview_eval: window.location.pathname` — should no longer be `/login`

This creates a real Supabase session with a valid JWT. All API calls (stems, downloads, conversions) will work end-to-end against the real server.

### When to use real login vs. console-only checks

- **Always log in** when verifying flows that involve API calls (stem extraction, media download, audio conversion, CRUD operations)
- **Console-only checks are sufficient** for purely frontend rendering issues (component layout, CSS, static content)
- **Server log checks** (`preview_logs`) are useful for backend-only changes but don't replace end-to-end flow verification

## Known Architectural Notes

Keep these in mind when assessing changes:

- **Supabase-only data layer:** All data goes through the Supabase data layer (`src/lib/data/*.ts`) with `cache.ts` as the orchestrator. The old Express `server/routes/files.js` and `server/db.js` have been deleted — any remaining `apiFetch('/api/files')` references are bugs. Frontend pages should use `dataCache.getFiles()` and `getFileAudioUrl()` for file access.
- **WebSocket system is disabled:** `server/index.js` has a fully commented-out WebSocket server. `src/utils/ws.js` exists but is unused. Don't depend on or accidentally re-enable it.
- **Job tracking is dual:** In-memory maps for SSE progress + Supabase `jobs` table for persistence. Both must be updated for job-related changes.
- **Profile scoping:** All localStorage keys are namespaced by active profile ID via `scopedKey()` in `src/utils/storage.js`. New localStorage usage must use the scoped helpers.

## Key Files

- `structure.md` — Architecture reference (keep updated)
- `src/lib/data/cache.ts` — Cache orchestrator, most complex dependency hub
- `src/lib/data/index.ts` — Barrel export for all data modules
- `src/types/Database.ts` — Supabase schema types, source of truth for all tables
- `server/index.js` — Server entry, middleware stack, route mounting
- `server/middleware/auth.js` — Auth logic affecting all API routes
- `src/context/auth/store.ts` — Frontend auth state management
- `src/utils/api.js` — API client with auth header injection
- `src/utils/storage.js` — Profile-scoped localStorage and IndexedDB utilities
- `server/middleware/auth.js` — JWT verification via JWKS (ES256) with HS256 fallback
