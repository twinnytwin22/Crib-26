---
name: sf-symbol-icon
description: Use real SF Symbol icons from the local SVG library at ~/sf-symbols-svgs/. Use when the user asks to use an SF Symbol by name, replace an icon with an SF Symbol, or references SF Symbols in any way.
---

# SF Symbol Icon Integration

## SVG Source

All 7000+ SF Symbol SVGs are pre-exported at:

```
~/sf-symbols-svgs/<symbol-name>.svg
```

Examples: `calendar.svg`, `play.fill.svg`, `music.note.svg`, `chevron.right.svg`

Every SVG uses `viewBox="0 0 24 24"` and `fill="currentColor"`.

## Workflow

When the user asks to use an SF Symbol (e.g. "use 'calendar' for the schedule icon"):

### Step 1: Read the SVG

Read the file at `~/sf-symbols-svgs/<name>.svg`. If unsure whether the symbol exists, check the directory.

### Step 2: Extract the inner content

From the SVG file, extract everything between `<svg ...>` and `</svg>` — typically a `<title>` and one or more `<path>` elements. **Discard the `<title>` element.** Keep only the `<path>` elements (with their `transform` and `d` attributes intact).

Example source file (`calendar.svg`):
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <title>calendar</title>
  <path transform="matrix(...)" d="M6.67 2.34..." fill="currentColor"/>
</svg>
```

Extract: `<path transform="matrix(...)" d="M6.67 2.34..." fill="currentColor"/>`

### Step 3: Add or update the entry in sf-symbols.js

Open `src/components/icons/sf-symbols.js` and add/replace the entry:

```js
'calendar': {
  paths: '<path transform="matrix(...)" d="M6.67 2.34..." fill="currentColor"/>',
  filled: true,
},
```

Rules:
- Key = the SF Symbol name (e.g. `'calendar'`, `'play.fill'`, `'music.note'`)
- `paths` = the extracted `<path>` element(s) as a string, preserving `transform`, `d`, and `fill` attributes
- `filled: true` = always set for real SF Symbol exports (they are fill-based, not stroke-based)
- No `viewBox` needed — the default `0 0 24 24` matches all exports
- Place the entry in the appropriate category section of the file, or at the end

### Step 4: Use the Icon component

Replace the target inline SVG with:

```jsx
import Icon from '../../components/Icon'  // adjust relative path

<Icon name="calendar" size={20} />
```

The `Icon` component accepts:
- `name` — the SF Symbol name string (must match the key in sf-symbols.js)
- `size` — pixel size (default 20)
- `color` — optional, defaults to `currentColor` (inherits from parent CSS)
- `className` — optional CSS class
- `style` — optional inline styles

## Platform behavior

- **Web**: the `Icon` component renders an inline `<svg>` using the path data from `sf-symbols.js`
- **iOS native**: the `Icon` component uses a Capacitor plugin (`SFSymbolPlugin`) that renders the symbol natively via `UIImage(systemName:)` — the sf-symbols.js entry is only used as a web fallback

## Important notes

- The `.fill` variants are separate files (e.g. `play.svg` vs `play.fill.svg`) — use the correct one
- When replacing an existing inline SVG, match the original `size` value
- Preserve any `className` or `style` props from the original SVG element
- If the inline SVG was conditionally rendered (e.g. play/pause toggle), keep the conditional logic and just swap the SVG for `<Icon>`
- Brand logos (Spotify, Apple Music, Google, etc.) are NOT SF Symbols — do not replace those
