---
name: front-end-design
description: "Use when building or redesigning React/Next.js UI with strong visual direction, responsive behavior, and production-ready component code. Triggers on: front-end design, ui redesign, landing page polish, visual refresh, responsive layout, hero section redesign."
---

# Front-End Design Skill

## Goal
Ship intentional, non-generic UI updates that match existing product language while improving hierarchy, accessibility, and responsiveness.

## Workflow
1. Read the target page/component and identify current visual constraints (layout, spacing scale, typography, colors, motion, data states).
2. Define a design direction before coding: type system, color tokens, spacing rhythm, and motion rules.
3. Implement in small, testable edits: structure first, styling second, animation third.
4. Validate at mobile and desktop breakpoints and keep keyboard/focus behavior intact.
5. Run lint/build checks when changes affect shared components or layouts.

## Design Rules
- Avoid generic defaults and visually interchangeable layouts.
- Prefer explicit design tokens (CSS variables or Tailwind token classes) over ad hoc one-off values.
- Keep contrast and readability strong; ensure interactive elements have visible focus states.
- Use motion with intent (entrance timing, state transitions), not decorative overuse.
- Match existing design system constraints when working inside established components.

## Implementation Patterns For This Workspace
- For App Router pages, keep page structure in `app/**/page.tsx` and reusable sections in `components/`.
- Reuse shadcn/ui primitives from `components/ui/` and extend with CVA variants instead of duplicating components.
- Use `app/globals.css` for shared tokens/utilities and component-local classes for scoped styling.
- Keep animation work aligned with existing `framer-motion` usage patterns.

## Done Checklist
- Visual hierarchy is clearer than before.
- Mobile and desktop layouts both render correctly.
- Focus, hover, and disabled states are defined.
- No regressions to existing content/data flow.
- Relevant lint/build checks pass.

## Example Prompts
- `/front-end-design Redesign app/page.tsx hero with a bold editorial style and improve mobile spacing.`
- `/front-end-design Refresh components/Services.tsx cards with clearer hierarchy and better hover/focus states.`
- `/front-end-design Update typography and section rhythm across app/page.tsx and components/Hero.tsx.`
