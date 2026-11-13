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

## Formatting
Let the formatter and linter decide. Don't argue style in reviews.
