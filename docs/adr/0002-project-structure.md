# 0002 — Project structure, state, i18n and styling

- Status: Proposed
- Date: 2026-11-13

## Context
There is one Expo app (ADR 0001) with five tabs (UX 01 §1), bundled content from a workbook, and a small amount of
user data (life list). We want feature folders, domain logic as pure functions that are easy to test, and the
fewest libraries possible. We need si/en now with Tamil-ready strings, plus the design tokens from UX 01 §8.

## Options
| Topic | Option | Pros | Cons |
|---|---|---|---|
| Repo | **Single app repo** | Simple, one CI, one lockfile | — |
| | Monorepo (workspaces) | Shared packages | Tooling we don't need |
| State | **React state + Context (settings, session)** | Zero deps | Context re-renders if overused |
| | Zustand / Redux Toolkit | Mature | Not needed for 2 global values |
| i18n | **Tiny in-house `t()` + typed JSON + `Intl.PluralRules`, `expo-localization` for device locale** | ~50 lines, typed keys, no deps | We own interpolation/plurals |
| | i18next + react-i18next | Very mature, plugins | 2 deps, more API than needed |
| Styling | **`StyleSheet` + `tokens.ts` + `useTheme()`** | Platform default, no build step | More verbose than utility classes |
| | NativeWind / Tamagui / Unistyles | Fast authoring | Extra compiler/runtime, upgrade risk each SDK |

## Decision
```
src/
  app/                    Expo Router routes only: thin screens that compose features
    (tabs)/identify|search|browse|life-list|me ; species/[id].tsx ; plate/[id].tsx ; +html.tsx
  features/
    identify/             step-by-step questions + ranking (pure: rank.ts)
    search/               search UI; index/query per ADR 0006
    browse/               plates, filters
    species/              species page, photo tabs, credits
    life-list/            sightings UI + pure merge/sync logic (ADR 0003)
    account/              sign-in, sync status
    settings/             language, theme, text size, offline pack
  shared/
    ui/                   design-system components (Badge, Chip, AnswerCard, SpeciesRow…)
    theme/                tokens.ts (from UX 01 §8), useTheme()
    i18n/                 t(), locales/en.json, si.json (ta.json later)
    data/                 typed content access (ADR 0006/0007)
    platform/             *.web.ts / *.native.ts adapters (SW, file system, storage)
data/source/              workbook (exists)
data/content/             reviewed human-edited inputs (traits, translations, media register; ADR 0004/0006)
tools/content/            pipeline scripts: workbook → app data, validation (ADR 0006)
content/                  generated, versioned app data (content.v{N}.json, manifest; ADR 0006)
public/                   manifest.json, icons, fonts, media (web static, ADR 0004)
docs/                     product, design, adr, specs
```
- **Boundaries:** each feature has an `index.ts` public API. Features may import `shared/*` and other
  features' `index.ts` only. `shared` never imports from `features`. Domain logic (ranking, search
  normalisation, merge) lives in pure `.ts` files with no React and no I/O, and is unit-tested (ADR 0007).
  ADR 0007 enforces the import rules with a lint rule.
- **State:** server/content data is read through `shared/data`. Two Contexts hold global state: `Settings`
  (language, theme, text size, persisted locally) and `Session` (Google user, sync status). Everything else is
  local component state. Add a store library only if a spec shows a real need, in its own ADR.
- **i18n:** keys are like `lifeList.empty`. `en.json` is the source of truth, and TS checks that `si.json` has
  the same keys. Language is a list (`si`, `en`, later `ta`) and is never a boolean. Bird data (names, prose) is
  **not** in i18n files. It comes from content per language, with the "not yet available" fallback (UX 01 §2.5).
  Default language comes from `expo-localization` and the user confirms it on first launch. Set
  `lang` on the root per script so Sinhala line-heights apply.
- **Styling:** `tokens.ts` mirrors the UX 01 §8 YAML exactly (colours light/dark, type scale with
  per-script line-heights, space, radius, sizes). Components use `StyleSheet.create` with values from
  `useTheme()`, and there are no raw hex values outside `tokens.ts`. Fonts: Noto Sans + Noto Sans Sinhala,
  self-hosted and subset, loaded with `expo-font`.

## Consequences
- New features follow one pattern. Reviewers can check boundaries mechanically.
- The in-house `t()` must handle `{name}` interpolation and plurals via `Intl.PluralRules`. If needs grow
  (ICU messages, many plural forms), switch to i18next. The call-site API stays `t(key, vars)`.
- Next: the scaffold PR creates only the folders that the first slice uses. Empty folders are not committed.
