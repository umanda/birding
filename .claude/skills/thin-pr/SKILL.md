---
name: thin-pr
description: Check that a branch is a thin, single-purpose change and open a GitHub pull request for it. Use when a change is ready for review, or when asked to open, split or prepare a PR.
---

# Thin PR

## 1. Check thinness
Run `git diff --stat origin/main...HEAD`.

A PR is thin when:
- It has **one purpose**, describable in one sentence without "and".
- It changes **< 200 lines** (excluding lockfiles, generated files, data snapshots).
  Up to 400 is acceptable only with a reason in the description.
- It touches **one layer or one feature slice** where possible.

If not thin, split it. Typical splits, each its own PR, in order:
1. Refactor/preparation with no behaviour change
2. Types / schema / migration
3. Domain logic + unit tests
4. UI wired to the logic + tests
5. Feature flag removal / docs

## 2. Pre-flight
- Lint, type-check and tests pass locally.
- `code-reviewer` agent has approved, or its "Must fix" items are resolved.
- Branch is rebased on `origin/main`.

## 3. Open the PR
```bash
git push -u origin HEAD
gh pr create --title "<conventional commit title>" --body-file <file>
```
Fill `.github/pull_request_template.md`: What, Why, How to test, Screenshots
(for UI), Checklist. Link the spec or issue. Keep the description short.

## 4. After review
Address comments in new commits (no force-push during review), then squash-merge.
