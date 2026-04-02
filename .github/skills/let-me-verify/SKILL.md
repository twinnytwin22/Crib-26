---
name: let-me-verify
description: Logic-only code review of implemented changes. Triggers ONLY on the exact phrase "let-me-verify" in the user's command. Does NOT start servers, use preview tools, or run functional tests. Performs static checks, import chain verification, data flow tracing, type safety audit, edge case analysis, API contract alignment, security scan, dependency impact check, and state/side effect review. After the review, prompts the user to verify on their end.
---

# Let Me Verify

A thorough logic-only code review that confirms implemented changes work correctly without starting servers, using preview tools, or running functional tests. After completing the review, prompt the user to verify visually/functionally on their end.

## When to Apply

**Only** when the user's command contains the exact phrase `let-me-verify`. No variations.

Do **not** apply for purely cosmetic changes (CSS-only, copy text, spacing, colors, fonts, animations).

## What This Skill Does NOT Do

- Start dev or production servers
- Use preview tools (no browser, no screenshots, no snapshots)
- Run functional or integration tests
- Interact with the running application

## Workflow

### Step 0: Identify What Changed

1. Run `git diff --name-only` to get the list of changed files (include `--cached` if changes are staged)
2. Classify each file into zones:

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

3. Determine change scope using the proportional effort table below to decide which steps to run.

### Step 1: Static Checks

Run whichever checks are relevant (these do **not** require a running server):

- **TypeScript files changed:** `npx tsc --noEmit` — catches broken imports, type mismatches, missing properties
- **Frontend bundle affected** (imports, exports, new modules): `npx vite build` — catches dead imports, syntax errors, bundle failures
- **Backend files changed:** `node -e "import('./server/index.js')"` — catches syntax/import errors

If static checks fail, **stop and fix immediately** — report as a BLOCKER.

### Step 2: Import/Export Chain Integrity

For every function, component, or type that was **renamed, deleted, or had its signature changed**:

1. Grep across the codebase for the old name — any remaining references are bugs
2. Check `src/lib/data/cache.ts` — if the function has a cached wrapper, verify the wrapper is updated
3. Check `src/lib/data/index.ts` — verify barrel exports are intact
4. Check that no file imports a symbol that no longer exists

Key chains to verify:
- **Data layer chain:** `pages` -> `cache.ts` -> entity modules -> `supabase` client -> `helpers.ts`
- **API chain:** `pages` -> `apiFetch()` (`src/utils/api.js`) -> server routes -> auth middleware -> server libs
- **Export chain:** Entity modules -> `cache.ts` (cached wrappers) + `index.ts` (barrel exports)

### Step 3: Data Flow Tracing

For each changed function:

1. **Read callers** — grep for the function name, then read each calling file
2. **Read callees** — read what the function calls downstream
3. Verify the **data shape flowing in** matches what the function expects
4. Verify the **data shape flowing out** matches what callers expect
5. Pay special attention to transformations — if a function maps data from one shape to another, verify both sides

### Step 4: Type Safety Audit

1. Check that function parameter types and return types align across boundaries
2. If `Database.ts` types changed, trace the ripple through all modules using `Tables<>` / `TablesInsert<>` / `TablesUpdate<>`
3. Verify mapper functions (e.g., `toAppSong`, `toDbRow`) still match both DB schema and app-level types
4. Check for any implicit `any` types introduced by the change

### Step 5: Edge Case Analysis

For each changed function, read the actual code paths and consider:

- What happens if input is `null` or `undefined`?
- What happens with empty arrays or empty strings?
- What happens on error paths (network failure, Supabase error, missing data)?
- Boundary conditions (first item, last item, max length, zero values)
- Race conditions in async code (concurrent calls, component unmount during fetch)
- Does error handling produce user-friendly messages, not raw exceptions?

### Step 6: API Contract Alignment

Read `api-structure.md` at the repo root for the full API reference.

- If **frontend code changed:** verify `apiFetch()` calls match server route signatures (method, path, body shape, response shape)
- If **server routes changed:** verify frontend callers send the right data and handle the response correctly
- Check Zod validation schemas match what the frontend sends
- Verify SSE event shapes match what frontend `EventSource` handlers expect

### Step 7: Security Scan

- **Input validation:** Are user inputs validated before use?
- **Auth:** Do new/changed endpoints use auth middleware? Do new data queries scope by `user_id`?
- **Injection:** Any string concatenation in SQL queries, shell commands (`child_process`), or URLs?
- **Storage paths:** Are they scoped by userId, using UUIDs not user-supplied filenames?
- **Secrets:** No hardcoded credentials, API keys, or tokens in changed code?
- **localStorage:** New keys use `scopedKey()` via `src/utils/storage.js` helpers?

### Step 8: Dependency Impact Check

1. For each changed file, grep for all files that import from it
2. Read each importing file to confirm it still works with the changes
3. **Special focus on shared files:** `cache.ts`, `api.js`, `storage.js`, `auth/store.ts`, `helpers.ts` — if one of these changed, list all affected consumers
4. Verify no circular dependencies were introduced

### Step 9: State and Side Effect Review

- **localStorage:** Any new keys? Are they using `scopedKey()`? Could they conflict with existing keys?
- **IndexedDB:** Any new stores? Proper scoping?
- **Zustand stores:** State shape changes? Missing selector updates?
- **Async operations:** Proper cleanup on unmount? AbortController usage? Race conditions between rapid state changes?
- **Event listeners:** Added with cleanup? No memory leaks?
- **Timers/intervals:** Cleared on unmount?

### Step 10: Structure.md Update

If the change was **functional** (new route, changed data flow, new table, changed auth, new external tool usage, new data module):
- Update the relevant section of `structure.md`
- Set the "Last updated" date in the header

If the change was a bugfix that did not alter architecture, no update is needed.

## Proportional Effort

| Change scope | Steps to run | Steps to skip |
|---|---|---|
| One-line bugfix in single file | 0, 1, 2, 3 (callers only), 5 (error path only) | 4, 6, 7, 8, 9, 10 |
| Single component behavioral change | 0, 1, 2, 3, 5, 8 | 4 (unless types changed), 6 (unless API calls changed), 7, 9 (unless state changed), 10 |
| Data layer change (entity module) | All steps | None |
| Shared utility change (cache.ts, api.js, storage.js) | All steps | None |
| Auth change | All steps | None |
| Server route change | 0, 1 (server syntax), 2, 3, 5, 6, 7, 8, 10 | 4 (unless TS files changed), 9 (unless client state changed) |
| Multiple files across zones | All steps | None |
| New feature / major refactor | All steps | None |

## Findings Report

At the end of verification, produce this report:

```
## Verification Report

**Scope:** [one-line summary of what changed]
**Steps run:** [list of step numbers]

### Findings

| # | Severity | Step | Finding |
|---|----------|------|---------|
| 1 | BLOCKER  | 1    | tsc --noEmit failed: Property 'x' does not exist on type 'Y' |
| 2 | WARNING  | 5    | getSongs() does not handle empty array case at songs.ts:42 |
| 3 | NOTE     | 7    | New localStorage key uses scopedKey() correctly |

### Verdict: PASS / PASS WITH WARNINGS / FAIL

[If FAIL: list blockers that must be fixed before proceeding]
[If PASS WITH WARNINGS: list warnings for the user to consider]
[If PASS: confirm logic review found no issues]
```

After the report, prompt the user: **"Logic review complete. Please verify visually/functionally on your end."**

## Known Architectural Notes

Keep these in mind during logic review:

- **Supabase-only data layer:** All data goes through `src/lib/data/*.ts` with `cache.ts` as the orchestrator. Any `apiFetch('/api/files')` references are bugs — use `dataCache.getFiles()` and `getFileAudioUrl()`.
- **WebSocket system is disabled:** `server/index.js` has a commented-out WebSocket server. `src/utils/ws.js` exists but is unused.
- **Job tracking is dual:** In-memory maps for SSE progress + Supabase `jobs` table for persistence. Both must be updated for job-related changes.
- **Profile scoping:** All localStorage keys are namespaced by active profile ID via `scopedKey()` in `src/utils/storage.js`. New localStorage usage must use scoped helpers.

## Key Files

- `structure.md` — Architecture reference (read at Step 0, update at Step 10)
- `api-structure.md` — API contract reference for Step 6
- `src/lib/data/cache.ts` — Cache orchestrator, most complex dependency hub
- `src/lib/data/index.ts` — Barrel export for all data modules
- `src/types/Database.ts` — Supabase schema types, source of truth for all tables
- `server/index.js` — Server entry, middleware stack, route mounting
- `server/middleware/auth.js` — Auth logic affecting all API routes
- `src/context/auth/store.ts` — Frontend auth state management
- `src/utils/api.js` — API client with auth header injection
- `src/utils/storage.js` — Profile-scoped localStorage and IndexedDB utilities
