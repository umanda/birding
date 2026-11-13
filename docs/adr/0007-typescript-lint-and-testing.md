# 0007 — TypeScript, lint/format, testing, validation and tooling

- Status: Proposed
- Date: 2026-11-13

## Context
Expo + React Native + react-native-web + Expo Router (web first, native later), GitHub Actions CI. We need a small, boring toolchain that enforces `clean-code` (no `any`, validate at boundaries, tests next to code) without config sprawl. Versions below are to verify at scaffold time (Expo SDK, TypeScript 5.x, ESLint 9, Jest 29/30, Playwright).

## Options
| Area | Options | Notes |
|---|---|---|
| Lint/format | ESLint flat + `eslint-config-expo` + Prettier / Biome | Biome is faster but lacks Expo/React Native/hooks rule parity |
| Unit/component | Jest + `jest-expo` + RNTL / Vitest | Vitest needs custom RN transforms; `jest-expo` is the Expo-supported path |
| Validation | zod / valibot / hand-written guards | zod: most familiar, infers types. valibot: smaller bundle. Guards: no inference, verbose for big shapes |
| Package manager | npm / pnpm / bun | Expo works with all; npm is the default in `create-expo-app` and docs |

## Decision
**1. tsconfig.** Extend `expo/tsconfig.base` (provides `jsx: react-native`, bundler module resolution, `esModuleInterop`, `skipLibCheck`, `resolveJsonModule`, Expo types). We add:
`strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `noFallthroughCasesInSwitch`, `noUnusedLocals`, `noUnusedParameters`, `exactOptionalPropertyTypes` (drop it if third-party typings fight us), and `paths: { "@/*": ["./src/*"] }`. Expo Router resolves `@/` through tsconfig paths. Typed routes enabled via `experiments.typedRoutes`.

**2. Lint/format.** ESLint 9 flat config (`eslint.config.js`) with `eslint-config-expo/flat`, plus `@typescript-eslint` rules: `no-explicit-any`, `no-non-null-assertion`, `consistent-type-imports`, `no-console` (warn), and `import/no-default-export` except under `src/app/` (Expo Router requires default exports for routes). **Prettier** for formatting with `eslint-config-prettier` to avoid rule conflicts; `.prettierrc` has only `singleQuote`, `trailingComma: all`, `printWidth: 100`. Biome rejected for now: weaker RN/hooks coverage and the Expo template already ships ESLint.

**3. Testing.**
- Unit/component: **Jest + `jest-expo` preset + `@testing-library/react-native`**, tests next to code (`thing.test.ts`). Chosen for zero-config Expo compatibility, not speed.
- Pure domain logic (search, ID filtering, import transforms) is tested with plain Jest, no RN renderer.
- E2E web: **Playwright** (Chromium in CI; add WebKit later) against the Expo web export, including an offline test (`context.setOffline(true)` after first load). 
- E2E native: **Maestro** flows, added only when native builds start; not in the prototype.
- Coverage: no global percentage gate. Expectation: all domain logic and validators covered, including unhappy paths (empty, offline, malformed input); one component test per screen's key state; E2E for the 3 core journeys (search, step-by-step ID, life list offline). Report coverage in CI for domain folders only.

**4. Runtime validation.** **zod** at every boundary: content import (xlsx rows to JSON/SQLite), local storage reads, and the sync API. Types for those shapes are `z.infer`, so there is one source. Inside the app we trust the types. Revisit valibot only if bundle size is measured as a problem.

**5. Domain typing conventions.**
- String-literal unions, derived from the data dictionary, never enums: `type IucnCategory = 'LC' | 'NT' | 'VU' | 'EN' | 'CR' | 'DD' | 'NE'`; `OccurrenceCode` likewise. Define a `const` tuple and derive the type (`as const`) so zod (`z.enum`) and the type share one list.
- Branded ids only for `SpeciesId` and `PlateId` (`string & { __brand: 'SpeciesId' }`), created solely by the validator. Nothing else is branded.
- Blank means unknown: model as optional or `null`, never as an empty string or invented default.
- Types `PascalCase`, functions/vars `camelCase`, constants `SCREAMING_SNAKE`. Files `kebab-case` (`find-species-by-plate.ts`); route files follow Expo Router naming. One concept per file, named exports, explicit return types on exported functions, `type` over `interface`.

**6. Git hooks.** `simple-git-hooks` + `lint-staged` (eslint --fix, prettier --write on staged files) on pre-commit, and `commitlint` (`@commitlint/config-conventional`) on commit-msg. Typecheck and tests run in CI, not in hooks, to keep commits fast.

**7. Package manager.** **npm** (Expo's default and documented path, fewest EAS/CI surprises). Commit `package-lock.json`; CI uses `npm ci`. Pin Node via `.nvmrc` (current LTS, verify).

### Scripts
| Script | Runs |
|---|---|
| `npm run lint` | `eslint . && prettier --check .` |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | `jest` (jest-expo preset) |
| `npm run test:e2e` | `playwright test` (needs web export or dev server) |
| `npm run validate:content` | Script that parses the workbook-derived content with the zod schemas and fails on any violation or unknown code |

CI order: lint, typecheck, validate:content, test, then test:e2e.

## Consequences
- Easier: one lint/format story that matches the Expo template; types and runtime checks share one definition; strict indexing catches real data bugs.
- Harder: `noUncheckedIndexedAccess` adds narrowing code; Jest is slower than Vitest; zod adds a small bundle cost on the client (import schemas only where needed, import-time validation can run in Node scripts).
- Next: scaffold must confirm versions, ESLint flat config compatibility with `eslint-config-expo`, and that `@/` works in Jest (`moduleNameMapper`) and Metro.
