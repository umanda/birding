# 002 — Offline web app (PWA)
Status: Done (2026-11-14, PRs #30, #32, #35–#37)

## Problem
M1 works offline only after the first load, and only until the page is reloaded. Birders in
forests and parks need the web app to open with no signal at all, and to install it on the
home screen like an app.

## User stories
- As a birder, I want the app to open and work in airplane mode, even after closing the browser,
  so that I can use it in the field.
- As a birder, I want to install the app on my phone's home screen.
- As a birder, I want to know when a newer version is ready, without losing what I'm doing.

## Acceptance criteria
- Given the app was opened once online, when I reload or reopen it offline (any route: `/`,
  `/search`, `/browse`, `/plate/<id>`, `/species/<id>`), then it loads and works with no network.
- Given offline, then no request fails, including header icons (fixes the M1 back-arrow issue).
- Given a supported browser, then the app is installable: a valid web manifest (name, short name,
  icons 192/512 + maskable, `display: standalone`, theme colours, `lang`), and the service worker
  is registered on production builds only (not in the dev server).
- Given a new deploy, when the new service worker is waiting, then a small, accessible banner
  says "Update available" with a "Reload" button; nothing reloads on its own.
- Precache stays within ADR 0001's ≤ 10 MB shell budget (photos are M2/ADR 0004 runtime caches).

## UX
A one-line update banner at the top of the tab screens (UX 01 states: non-blocking). No other
visible change.

## Data
No content changes. Precache: app shell JS/CSS, fonts, `content.json` (inside the bundle), all
static route HTML (5 tabs, 43 plates), favicon/icons and navigation assets. Species pages are served
from one precached `species/[id].html` template via a navigation fallback: 295 separate pages would be
13.9 MB, over the 10 MB budget. The precache is about 4 MB.

## Out of scope
Photo caching and the "Download offline pack" (M2, ADR 0004). Native apps. Push notifications.

## PR slices
1. Web manifest, icons, `+html.tsx` links (~80 lines + icon files)
2. Workbox `generateSW` after export + production-only registration; precache all routes and
   assets (~100)
3. e2e: offline reload of every route type; remove the back-icon exclusion; precache size check (~80)
4. "Update available" banner (~120)

## Open questions
None.
