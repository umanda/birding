# 0005 — CI, quality gates and preview deploys

- Status: Accepted
- Date: 2026-11-13

## Context
We work in thin PRs (aim < 200 lines) and never commit to `main` (CLAUDE.md). Every PR needs fast,
automated checks and a clickable web preview, so the owner can review on a phone. Tooling choices
(tsc config, linter, formatter, test runner) are in ADR 0007, and content validation scripts are in ADR 0006.
This ADR wires those tools into CI and covers branch protection and hosting previews.

## Options
| Topic | Option | Pros | Cons |
|---|---|---|---|
| CI | **GitHub Actions** | Repo is on GitHub, free for public and generous for private | — |
| Preview host | **Cloudflare Workers Builds (Git integration)** | Free, posts PR comment with per-branch + per-commit URL, no secrets in GitHub, same host as prod | Builds twice (Actions + Cloudflare); previews public by default |
| | Netlify deploy previews | Mature previews | Credit-based free plan; second vendor |
| | Vercel Hobby | Great previews | Hobby is non-commercial only; second vendor |
| | GitHub Pages | Simplest | No PR previews |

## Decision
**`.github/workflows/ci.yml`**, on `pull_request` and push to `main`, one job on `ubuntu-latest`, Node from `.nvmrc`:
1. `npm ci` (cached). npm is the package manager unless ADR 0007 says otherwise.
2. `npm run lint`: lint + format check (ADR 0007)
3. `npm run typecheck`: `tsc --noEmit`
4. `npm test`: unit tests (pure domain logic: ranking, search normalisation, sync merge)
5. `npm run validate:content` (name per ADR 0007): workbook → data validation (counts 295/43, Sinhala
   identical to workbook, codes copied exactly; ADR 0006) + media register checks (ADR 0004)
6. `npm run build:web`: `expo export --platform web` + Workbox SW generation
7. `npm run budget`: fails if initial JS, shell precache, thumbnails or any image exceed ADR 0001/0004
   budgets (small script over `dist/`, no extra service)
8. `npm run test:e2e`: Playwright smoke test over `dist/`, including an offline check (ADR 0007). Starts with M1.

A job-level `timeout-minutes: 15`. Target is under 5 minutes per PR. Pin actions by major version and let
Dependabot (weekly, grouped) update actions and npm.

**Preview and production:** a Cloudflare Worker with static assets from `dist/` (ADR 0001), connected
via Workers Builds. `main` deploys production. Every other branch gets a preview URL commented on its
PR. Previews use the `birding-dev` Supabase project (ADR 0003) via build-time env vars. Production uses
`birding-prod`. Add Google OAuth redirect URLs for the preview domain pattern in the dev project.

**Branch protection (GitHub ruleset on `main`):** require a PR, require the `ci` status check to pass and be up
to date, squash merge only (Conventional Commit title), no force pushes or deletions, linear history.
Required approvals = 0 while the owner is the only human (GitHub does not allow approving your own PR). Raise this to 1 when a second
human reviewer joins. The `code-reviewer` agent review stays mandatory by process.

**Later (not now):** an EAS Build workflow on tags, plus Maestro, when native starts (release N).

## Consequences
- Every PR shows red/green for all gates plus a link to try it on a phone.
- The PR template (`.github/pull_request_template.md`) should link the preview and list which gates are relevant.
- Previews are public URLs. Because MVP images are public-source and the MVP is private, previews can be put
  behind Cloudflare Access (free for small teams) if the owner wants that (owner question).
- Cloudflare has to be connected to the GitHub repo once by the owner (GitHub App install).
  No deploy tokens are stored in GitHub.
