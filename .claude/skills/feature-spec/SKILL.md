---
name: feature-spec
description: Write a feature spec and slice it into thin PRs before any code is written. Use when starting a new feature, or when asked to plan, scope or break down work.
---

# Feature spec

Create `docs/specs/NNN-<feature-name>.md` (next free number) with these sections.
Keep it to one or two pages.

```markdown
# NNN — <Feature name>
Status: Draft | Approved | Done

## Problem
Who has what problem, in one paragraph.

## User stories
- As a <persona>, I want <goal>, so that <benefit>.

## Acceptance criteria
- Given <context>, when <action>, then <result>.
(Include offline, empty and error cases.)

## UX
Flow (Mermaid) and wireframe link in `docs/design/`.

## Data
Which tables/fields are used. Any missing data, and who supplies it.

## Out of scope
What we are deliberately not doing.

## PR slices
1. <title> — <one-line purpose> (~N lines)
2. ...

## Open questions
```

## Rules
- Involve `ornithologist` for any bird-content or identification logic.
- Involve `ui-ux-designer` for any screen.
- Each PR slice must be independently mergeable and leave `main` working.
- Mark the spec `Approved` only after the user agrees.
