# Sri Lanka Birds — project guide for Claude

Offline-first, mobile-first bird identification and field-guide app for the
birds of Sri Lanka (295 species, 43 plates). Bilingual: Sinhala and English.

## Source of truth

- Species data: `data/source/Sri_Lanka_Birds_Mobile_App_Database_v1.xlsx` (see the `bird-data` skill).
- Product decisions: `docs/product/`. Architecture decisions: `docs/adr/`.
- Feature specs: `docs/specs/`. Each spec is sliced into thin PRs before coding.

## How we work (phases)

1. **Discover** — `product-analyst`, `ornithologist`, `ui-ux-designer` produce the
   prototype plan, feature list and UX flows. Stop for user approval.
2. **Decide** — `solution-architect`, `database-engineer`, `typescript-expert`
   propose the tech stack as ADRs. Stop for user approval.
3. **Build** — per feature: `feature-spec` → `mobile-developer` implements one
   slice → `qa-engineer` adds tests → `code-reviewer` reviews → `thin-pr` opens the PR.

Never skip an approval gate. Never start phase 3 work without an approved spec.

## Non-negotiables

- **Thin PRs**: one purpose, aim < 200 changed lines (excluding lockfiles/generated
  data). Split otherwise. See `thin-pr` skill.
- **Git**: never commit to `main`; branch `type/short-desc`; Conventional Commits.
  See `git-workflow` skill.
- **Simple code**: readable over clever; small functions; no speculative
  abstractions. See `clean-code` skill.
- **Offline-first**: every core feature works in airplane mode. See `offline-first` skill.
- **Data integrity**: never invent, translate or "fix" bird data (names, Sinhala
  text, status codes). Blank means unknown. Changes go through `ornithologist`.
- **Media rights**: no image or audio ships without a verified licence and attribution.

## Agents

| Agent | Use for |
|---|---|
| product-analyst | Features, user stories, prototype scope, acceptance criteria |
| ornithologist | Bird data accuracy, ID traits, taxonomy, Sri Lankan context |
| ui-ux-designer | Flows, wireframes, design system, accessibility, Sinhala typography |
| solution-architect | Tech stack, ADRs, module boundaries, offline/sync design |
| database-engineer | Schema, xlsx → SQLite import, search/indexing, migrations |
| typescript-expert | Types, tooling, lint/tsconfig, type-safe data access |
| mobile-developer | Implementing feature slices |
| qa-engineer | Test strategy, unit/integration/E2E tests, offline test cases |
| code-reviewer | Reviews diffs for correctness, simplicity and PR thinness |
