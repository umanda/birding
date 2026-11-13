---
name: clean-code
description: Coding standards for this repo — simple, readable, clean TypeScript. Use whenever writing, refactoring or reviewing code.
---

# Clean code standards

The goal is code a new contributor understands in one read.

## Simplicity
- Write the simplest code that passes the tests. YAGNI: no "might need later" code.
- Prefer plain functions and data over classes, inheritance and patterns.
- Add a dependency only when it removes real complexity. Ask first.
- Duplicate twice before abstracting; abstract on the third time.

## Readability
- Names say what and why: `findSpeciesByPlate`, `isEndemic`, not `getData`, `flag`.
- Functions do one thing, are short (aim < 25 lines), take ≤ 3 params (use an object beyond that).
- Early returns over nested `if`s. No nested ternaries.
- No magic numbers or strings; name them as constants.
- Comments explain **why**, never what. Delete commented-out code.

## Structure
- Feature folders: `src/features/<feature>/` with its components, hooks, logic, tests.
- Shared code goes in `src/shared/` only once two features need it.
- Pure domain logic separate from UI and storage, so it is trivially testable.
- Tests live next to the code: `thing.ts` + `thing.test.ts`.

## Safety
- Handle the unhappy path: empty, null, offline, error.
- Validate data at boundaries, trust types inside.
- No `any`, no swallowed errors, no `console.log` left behind.

## Project conventions (checked in every review)
- **Files** are kebab-case: `search-index.ts`, `use-theme.ts`.
- **Types**: `type` aliases, not `interface`; no enums; explicit return types on every export
  (`React.JSX.Element` for components).
- **Exports** are named, except the default export each `src/app/**` route needs. Routes stay
  thin: they re-export a screen from `src/features/<feature>/`.
- **Boundaries**: `shared/*` never imports `features/*`. Shared UI takes `language` and `t` as props.
- **Tests** sit next to the code. Never put tests or helpers under `src/app/` (every file there
  becomes a route).
- **Text styling**: every `Text` uses `typeStyle(name, language)` from `shared/theme` so Sinhala
  gets Noto Sans Sinhala and its taller line-height. Never truncate Sinhala (`numberOfLines`).
- **No raw values**: colours, sizes and spacing come from `tokens.ts` / `useTheme()`.
- **Accessibility**: roles, labels and state on every interactive element (e.g. radios use
  `checked`, not `selected`); 44pt minimum targets; colour is never the only signal.
- **Bundle**: no zod (or other build-time libraries) in client code; use small type guards.
- **Bird text** (names, status words) comes from the workbook or `content.json` verbatim — never
  invent Sinhala. New Sinhala UI strings are listed in the PR for native-speaker review.

## Formatting
Let the formatter and linter decide. Don't argue style in reviews.
