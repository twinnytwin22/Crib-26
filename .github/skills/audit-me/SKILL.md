---
name: audit-me
description: 'Run performance-focused code audits for React/Electron apps. Use when reducing repeated code, extracting reusable hooks/helpers, removing dead paths, and shipping lighter builds without changing behavior.'
argument-hint: 'Target area to audit (for example: components/radio or lib/stores)'
user-invocable: true
---

# Performance Audit Refactor

## Outcome
Produce a measurable code-tightening pass that:
- Replaces repetitive logic with reusable hooks/helpers
- Removes dead or redundant code paths
- Keeps runtime behavior and UX unchanged
- Reduces shipped surface area (code and dependencies)

## When to Use
Use this skill when prompts include terms like:
- performance audit
- remove slop code
- deduplicate logic
- extract reusable hooks/helpers
- lighten bundle or package only what we need
- tighten code without breaking functionality

## Required Inputs
- Audit scope (single file, folder, or feature)
- Safety level:
  - conservative: minimal structural change
  - balanced: moderate extraction and cleanup
  - aggressive: larger refactors with stricter dead-code pruning
- Success constraints (for example: no visual changes, no API changes)

If inputs are missing, always ask whether the audit is repo-wide or folder-specific.
Default behavior when not specified:
- Scope: repo-wide (include available workspace context)
- Safety level: balanced

## Procedure
1. Baseline and guardrails
- Confirm the scope and constraints.
- Capture baseline checks before editing:
  - typecheck
  - lint
  - build
  - tests if present
- Track the baseline command results so post-refactor validation can be compared directly.
- Record initial indicators:
  - duplicated patterns found
  - obvious dead branches/imports
  - heavy dependencies likely unused in scope

2. Scan for high-value cleanup targets
- Prioritize repeated patterns that appear 3+ times:
  - repeated useEffect/useMemo/useCallback blocks
  - repeated state derivation or mapping logic
  - repeated formatting/parsing/validation snippets
  - repeated UI composition wrappers
- Find removable code:
  - unused imports/exports/types
  - unreachable branches and obsolete flags
  - stale helpers no longer referenced

3. Decide extraction strategy
- Extract to a hook when logic is stateful or lifecycle-driven.
- Extract to a helper when logic is pure and deterministic.
- Keep logic local when reuse count is low or extraction harms readability.
- Prefer feature-local placement first, then shared lib when cross-feature reuse is proven.

4. Implement minimal safe refactor
- Apply smallest change set that removes duplication.
- Preserve public interfaces unless explicitly approved.
- Avoid broad renames unless they reduce real maintenance cost.
- Remove pointless lines and wrappers that do not add clarity or behavior.

5. Package-surface tightening
- Check imports and dependency usage in changed scope.
- Remove optional code paths and utility layers that are no-ops.
- Remove dependencies confirmed as unused project-wide when they affect shipped output, then validate lockfile impact.

6. Verify no-regression
- Re-run baseline checks.
- Always run lint and build as required validation gates.
- If UI-related changes were made, verify key interaction paths manually.
- Confirm no new type/lint/build errors introduced by refactor.

7. Report with evidence
- Summarize what was removed/extracted and why.
- Provide before/after impact with concrete counts when possible:
  - duplicate blocks consolidated
  - lines removed
  - files touched
  - dependencies removed/flagged
- Call out residual risks and follow-up opportunities.

## Decision Points
- Extract now vs leave local:
  - extract only when it improves both reuse and readability
- Shared helper vs feature-local helper:
  - choose shared only when at least 2 feature areas use it
- Dependency removal now vs later:
  - remove now if usage is confirmed zero, especially when it reduces shipped output
  - otherwise mark for staged cleanup

## Completion Criteria
Consider the audit complete only when all are true:
- Duplication in scope is reduced with reusable abstractions where justified
- Dead/redundant code identified in scope is removed
- Lint and build succeed (typecheck/tests when available)
- Behavior remains unchanged under stated constraints
- Final report includes measurable impact and remaining risks

## Non-Negotiables
- Always ask the user whether the task is repo-wide or folder-specific before execution.
- If no scope answer is provided, proceed repo-wide using available workspace context.
- If no safety level is provided, run in balanced mode.
- Always run lint and build to test and track work.
- Always remove confirmed unused dependencies when they affect what is shipped.

## Quality Bar
- Prefer clarity over cleverness
- Avoid over-abstraction
- Keep patches focused and reviewable
- Optimize for maintainability first, micro-optimizations second
