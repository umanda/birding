# 0003 — Auth and life-list sync backend

- Status: Proposed
- Date: 2026-11-13

## Context
Only account features need a backend: Google sign-in (#8, Apple before iOS) and life-list
backup/sync (F6). User photo uploads come later (F16). The life list is local-first. It saves offline and
signed-out, and merges into the account automatically on sign-in (#17), with duplicates merged by
`species_id`. An expired token must never block a feature, only pause sync. The app is free, so the
backend needs a usable free tier and a clear upgrade path. Checked on 2026-11-13.

## Options
| | Supabase | Firebase (Auth + Firestore) | Appwrite Cloud | PocketBase (self-host) |
|---|---|---|---|---|
| Free tier | 50k MAU, 500 MB DB, 1 GB storage, 5 GB egress. **Pauses after 7 days idle** | Auth + Firestore on Spark. **Cloud Storage needs Blaze (billing) since Feb 2026** | Generous, smaller ecosystem | Free software, but we run a server |
| Data model / security | Postgres + **row-level security** in SQL | NoSQL + security rules | Collections + permissions | SQLite + rules |
| Offline sync | None built in; we write a small outbox (below) | Built-in offline cache (its own store, separate from ours) | None built in | None |
| Future photos | Storage buckets + RLS policies, same auth | Storage (needs billing) | Storage | Files |
| Lock-in | Low: plain Postgres, open source, self-hostable | High: proprietary APIs/data model | Medium | Low, but ops burden |
| Web/Expo | `supabase-js` (one dep), OAuth redirect on web, `signInWithIdToken` on native | JS SDK is heavy on web; RN needs native modules | SDKs exist | JS SDK |
| Simplicity | One dashboard, SQL migrations in repo | Simple start, rules/indexes drift | OK | Server, backups, TLS |

## Decision
Use **Supabase** (Auth with the Google provider, Postgres, and later Storage). The only client dependency is `@supabase/supabase-js`.

**Sync model (local-first, last-write-wins per row):**
- Local sightings use the ADR 0006 store and schema: IndexedDB through `idb` on web (chosen over Dexie
  because it is smaller), expo-sqlite on native. Sync relies on the client UUID `id`, `species_id`, `updated_at`,
  `deleted_at` (soft delete) and `synced_at`. A row is dirty when `synced_at` is null or `updated_at > synced_at`.
- Server table `sightings`: the same columns plus `user_id uuid default auth.uid()` and `server_updated_at`
  (set by a trigger). RLS: select/insert/update only where `user_id = auth.uid()`. No hard deletes.
- **Push:** upsert all dirty rows by `id`, then set `synced_at`. **Pull:** rows with
  `server_updated_at > last_cursor`. The local row is replaced if the remote `updated_at` is newer.
  Sync runs on sign-in, app foreground, reconnect, and after each save (debounced).
- **Life list = distinct `species_id` over non-deleted sightings.** Duplicate species are impossible
  by construction. The first sign-in merge is just "push all local rows, then pull". Nothing is lost, and the
  same sighting never doubles because UUIDs are stable. All of this is pure functions in
  `features/life-list/sync.ts`, unit-tested with fake clocks and fake remote data.
- **Session:** Supabase persists the session (localStorage on web; `expo-sqlite/kv-store` on native, so no
  AsyncStorage dependency). A failed
  refresh while offline keeps the user "signed in, sync paused". We sign out only on an explicit user action or
  an auth error from the server while online. Signing out asks whether to keep or clear local data (plan §3).
- **Migrations:** SQL files in `supabase/migrations/`, applied with the Supabase CLI. RLS policies have tests
  (pgTAP or a script that runs as two users) before the M7 demo.
- **Projects:** `birding-dev` (previews) and `birding-prod`. The anon key is public by design. The service key
  never goes in the client or the repo.

## Consequences
- We write about 150 lines of sync code instead of adopting a sync engine (PowerSync and similar). That is fine
  for one small table. Revisit if we add shared or collaborative data.
- **Free-tier pause:** an idle prototype project pauses after 7 days. Sync then fails gracefully (local-first)
  until someone resumes it in the dashboard. Before public launch, either upgrade to Pro (~USD 25/month) or
  accept manual resumes. Owner decides.
- Photo uploads (F16) later use Supabase Storage with per-user RLS paths. Moderation and licence grants
  need their own ADR.
- Native: Google uses `@react-native-google-signin/google-signin` + `signInWithIdToken`, and iOS adds Sign in
  with Apple. Both are decided in the native-phase spec.
- Photo ID (F11, next stage) does not need this backend unless it runs server-side. That is a separate ADR.
