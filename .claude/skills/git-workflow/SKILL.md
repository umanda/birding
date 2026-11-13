---
name: git-workflow
description: Git branching, commit message and history rules for this repo. Use whenever creating branches, committing, rebasing or syncing with main.
---

# Git workflow (trunk-based, short-lived branches)

## Branches
- `main` is always releasable and protected. Never commit or push to it directly.
- One branch per PR: `<type>/<short-kebab-desc>`, e.g. `feat/species-search`,
  `fix/sinhala-sort-order`, `chore/eslint-setup`.
- Branch from fresh `main`; keep it alive for hours or a day or two, not weeks.
- Stay current with `git fetch origin && git rebase origin/main`.

## Commits — Conventional Commits
```
<type>(<optional scope>): <imperative summary, ≤ 72 chars, no period>

<optional body: why, not what>
```
Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `build`, `ci`, `perf`, `style`, `data`.
Use `data` for changes to bird content or the import pipeline.

- One logical change per commit; each commit builds and passes tests.
- Stage specific files (`git add <path>`), never blindly `git add -A`.
- Never commit secrets, `.env`, build output or large binaries outside the agreed media path.
- Never use `--no-verify`, and never force-push shared branches (`--force-with-lease`
  on your own branch only, after a rebase).

## Merging
- Squash-merge PRs so `main` has one commit per PR with a Conventional title.
- Delete the branch after merge.
