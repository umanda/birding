---
name: offline-first
description: Offline-first principles for the mobile app — bundled data, local storage, no network dependency, battery and size budgets. Use when designing or implementing any feature, storage, media or sync logic.
---

# Offline-first

Birders are often in forests, wetlands and national parks with no signal.
The app must be fully useful in airplane mode.

## Principles
1. **Local is the source of truth.** All species data, search and identification
   run on-device from a bundled database. The network is an optional enhancement.
2. **Ship content with the app**, or as a one-time downloadable pack with clear
   size shown before download, resumable, and verified by checksum.
3. **Never block the UI on the network.** No spinners waiting for a server in core flows.
4. **User data is saved locally first** (sightings, lists, notes) and survives app
   restarts and updates. Sync, if ever added, is background and conflict-safe.
5. **Content updates are versioned**: the app knows its content version and can
   apply a newer pack atomically, keeping the old one on failure.

## Budgets (initial targets, refine in ADRs)
- Cold start to usable home screen: < 2 s on a mid-range Android.
- Search results: < 100 ms per keystroke.
- Images: compressed (WebP/AVIF), sized for screen; thumbnails separate from full size.
- Location (if used) only on demand; no background GPS.

## Every feature checklist
- [ ] Works in airplane mode
- [ ] Handles first launch with no network
- [ ] Clear UI when an optional online feature is unavailable
- [ ] Tested offline by `qa-engineer`
