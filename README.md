# Sri Lanka Birds

An offline-first, mobile-first field guide and identification app for the birds
of Sri Lanka, in Sinhala and English.

Status: planning.

## Getting started
Requires Node 24 (see `.nvmrc`).

```bash
npm ci
npm run web          # dev server in the browser
npm run typecheck
npm run build:web    # static export to dist/
```

## Repository layout
- `docs/product/` — product plan, personas, features
- `docs/design/` — UX flows and wireframes
- `docs/adr/` — architecture decision records
- `docs/specs/` — feature specs, each sliced into thin PRs
- `.claude/` — AI agent team and skills (see `CLAUDE.md`)

## Contributing
Short-lived branches, Conventional Commits, small single-purpose PRs.
See `.claude/skills/git-workflow/SKILL.md` and `.claude/skills/thin-pr/SKILL.md`.
