---
name: changelog
description: Analyze all code changes since the last Git commit, summarize them as a structured changelog entry, append to devnotes.txt, and generate a commit message. Use when the user says "changelog", asks to summarize recent changes, or requests a devnotes update.
---

# Changelog

Generate a structured changelog entry from uncommitted Git changes and append it to `devnotes.txt`.

## Trigger

Run this skill when the user issues the command **changelog** (or asks to summarize changes / update devnotes).

## Workflow

### 1. Gather Git State

Run these commands in parallel:

```bash
git log --oneline -5
git diff --stat HEAD
git diff HEAD
git status --short
```

Also check for untracked directories/files that contain new code (e.g. `git status` showing `??` entries). Read key new files to understand their purpose.

### 2. Read devnotes.txt

- Read the last ~100 lines to understand the current formatting style and the most recent version number.
- The file uses a consistent format with `=====` section headers, numbered problem/solution pairs, and bullet-pointed file lists.

### 3. Determine Version Number

- Look at the last version entry heading (e.g. `V5.3`) and increment the minor version (e.g. `V5.4`).
- If the changes are major enough (new architecture, breaking changes), increment the major version instead.

### 4. Write the Changelog Entry

Append to the end of `devnotes.txt` using this template:

```
=====================================
  V{X.Y} — {Short Title}
=====================================
  Date: {date range}
  Base commit: {hash} ({previous version title})

  ========================================
    SUMMARY
  ========================================

    {2-5 sentence overview of what changed and why}

  ========================================
    PROBLEMS & SOLUTIONS
  ========================================

    {Numbered list. Each item has:}
    {N}. {Problem title}
       PROBLEM: {What was wrong or missing}
       SOLUTION: {What was done to fix it}

  ========================================
    CHANGES BY AREA
  ========================================

    --- {Area Name} ---

    • {filename}
      {1-2 line description of what changed}

  ========================================
    NEW FILES
  ========================================

    • {path} — {brief description}

  ========================================
    FULL FILE LIST
  ========================================

    --- New ({count} files) ---
    • {path}

    --- Modified ({count} files) ---
    • {path}
```

### 5. Generate Commit Message

After appending to devnotes, provide a commit message following this format:

```
V{X.Y} — {short title, same as devnotes heading}

{2-4 sentence description of the key changes, focusing on the "why"
rather than the "what". Mention the most impactful changes first.}
```

### 6. Present Results

- Confirm the devnotes entry was appended successfully
- Display the suggested commit message in a code block
- Do NOT commit automatically — wait for the user to request it

## Style Rules

- Match the existing indentation in devnotes.txt (4-space indent for bullets, 7-space indent for continuation lines)
- Use `•` for bullet points, not `-`
- Section headers use `========` borders
- Keep descriptions concise — 1-2 lines per file change
- Group changes by area (Server, Client, Build, etc.)
- Number problems sequentially
- Always include the base commit hash and previous version reference
