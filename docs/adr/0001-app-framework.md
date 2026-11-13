# 0001 — App framework: Expo + React Native (web via react-native-web), Expo Router

- Status: Proposed
- Date: 2026-11-13

## Context
Owner decision #4 sets the order: web first, then a PWA, then Android and iOS, all from one codebase with
React Native and Expo. Every core feature has to work offline and signed-out (#7). The
web build has to run on mid-range Android phones over patchy data. We need a framework, a router,
a way to build and host the web/PWA, a path to native builds, and performance budgets.

Versions checked on 2026-11-13: **Expo SDK 58** (stable 2026-10-15, React Native 0.88). It needs
Node 22.13+, 24.3+ or 26+. SDK 58 changed the default `web.output` to `server`, so we have to set `static` explicitly.
Expo ships three SDKs a year, so we plan one SDK upgrade per release (SDK 59 is expected around Q1 2027).

## Options
| Option | Fit (web→PWA→native) | Maturity | Offline | Size | Team skill | Cost |
|---|---|---|---|---|---|---|
| **Expo + RN + react-native-web + Expo Router** | One codebase for all three targets; owner's choice | High; Expo is the RN-recommended framework | SW on web, files/SQLite on native | Web JS heavier than plain React (~+150 KB gz) | TS/React | Free; EAS free tier |
| React (Vite) web now, Expo later | Best web DX and size | High | SW | Smallest | TS/React | Free, but **two UIs** and a rewrite for native |
| Capacitor + web app | One web UI wrapped natively | High | SW / native FS | Small | Web | Free; native feel is weaker and it is not the owner's choice |
| Flutter | One codebase | High | Good | Large web bundle, weak web text/SEO | Dart (new) | Free |

**Challenge, briefly:** Expo is the right call for one codebase. The cost is a heavier, less "webby" first
release (react-native-web primitives, larger JS). We accept that and enforce it with the budgets below.
If the web stays the main product for a long time, revisit this ADR. Do not switch now.

## Decision
- **Expo SDK 58** with **React Native 0.88**, **react-native-web** and **Expo Router** (file-based routes in
  `src/app/`). TypeScript strict, as set out in ADR 0007. Use the New Architecture only (the SDK default).
- **Web build:** `web.output: "static"` and no API routes. Species (295) and plate (43) routes use
  `generateStaticParams`, so `npx expo export --platform web` produces plain HTML/JS/CSS in `dist/`.
  No server.
- **PWA:** `public/manifest.json`, the manifest and SW registration in `src/app/+html.tsx`, and a Workbox
  `generateSW` step after export, following the Expo PWA guide. Caching rules are in ADR 0004.
- **Hosting:** Cloudflare Workers static assets (free, 20k files / 25 MiB per file). Previews are in ADR 0005.
- **Native (release N):** EAS Build (free plan: 15 Android + 15 iOS builds a month on a low-priority queue;
  `eas build --local` as a fallback), EAS Submit, and EAS Update for JS/data hot-fixes. Use development builds,
  not Expo Go, once any native module is added. Add Sign in with Apple before iOS ships (#8).
- **Node:** 24 LTS in `.nvmrc` and CI. Move to 26 LTS when Expo and CI are green on it.
- **Dependency rule:** use Expo SDK modules first (`expo-localization`, `expo-font`, `expo-file-system`).
  Any other runtime dependency needs one line of justification in its PR.

## Budgets (checked in CI where possible, see ADR 0005)
| Budget | Target |
|---|---|
| Web first load, JS (gzip) | ≤ 450 KB initial route; species data loads per ADR 0006 |
| Web app shell precache (JS, CSS, fonts, data, thumbnails) | ≤ 10 MB |
| Web cold start, repeat visit from SW cache, mid-range Android | ≤ 2 s to interactive |
| Native install size (Android APK/AAB download) | ≤ 40 MB without the optional photo pack |
| Native cold start, mid-range Android (e.g. 4 GB RAM) | ≤ 2.5 s |
| Search keystroke → results | ≤ 100 ms (UX 2.4); step-by-step ranking ≤ 1 s (F4) |
| Memory, native steady state | ≤ 250 MB |

## Consequences
- One codebase and one router for all targets. Web deep links (`/species/<species_id>`) come for free.
- Every web-only API (SW, Cache Storage) and native-only API (file system) sits behind a small
  `src/shared/platform/*.web.ts` / `*.native.ts` pair, so features stay platform-agnostic.
- Each SDK upgrade is its own thin PR (`chore/expo-sdk-NN`). Follow the Expo/Router migration guides.
- Next: scaffold the app (ADR 0002 layout) with `web.output: "static"`. The first slice proves that
  `expo export` plus a Workbox SW works offline on a real Android phone.
