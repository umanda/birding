# Product decisions (from the product owner)

Date: 2026-11-13

| # | Topic | Decision |
|---|---|---|
| 1 | Audience & language | Local Sri Lankans and foreign visitors. Sinhala + English now; Tamil later (design for it). |
| 2 | MVP features | Step-by-step ID (size, colour, habitat, region), offline search (Sinhala, English, scientific), species pages, personal life list. **Photo ID is a must for the next stage, not the MVP.** Sound ID later. |
| 3 | Media | MVP may use images from public sources (not a public launch yet). Each species needs **male, female and juvenile** photos where they differ. Later: users (mostly wildlife photographers) upload their own photos. |
| 4 | Platforms | Web first, then PWA, then Android + iOS. React Native with Expo (one codebase). |
| 5 | Business model | Free app with social sign-in (Google etc.). |
| 7 | Login vs offline | Browse, search, species pages and step-by-step ID work **signed-out and offline**. Sign-in is needed only for account features: life list sync (and later uploads). The life list itself saves locally first. |
| 6 | Repository | Source workbook may be committed to the repo. |

## Implications to resolve in planning
- Photo ID (next stage): on-device vs online model, training data and licences — plan the data now (M/F/juvenile images) so it can feed training later.
- Public-source images are fine for a private MVP, but each image's source and licence must be recorded so they can be replaced or cleared before public launch.
- User uploads imply a backend (auth, storage, moderation) — plan for it, likely after MVP.

## Planning answers (2026-11-13)

| # | Topic | Decision |
|---|---|---|
| 8 | Sign-in providers | Google only for the web prototype; add Sign in with Apple before iOS release. |
| 9 | Reviewers | Owner reviews; Ceylon Bird Club contact if available. Agents draft, humans approve translations and traits. |
| 10 | MVP image sources | Wikimedia Commons and iNaturalist (CC licences); every image recorded in a licence register. |
| 11 | Plumage slots | Extend beyond male/female/juvenile with breeding/non-breeding and morph where relevant. |
| 12 | Location | Store rounded location only; never show nest/roost sites; sensitive species ≤ ~10 km precision. |
| 13 | Checklist authority | Latest Ceylon Bird Club checklist edition (year to be confirmed by owner). |
| 14 | eBird data | Not used for now; seasonality from the workbook. Revisit eBird terms later. |
| 15 | Analytics | None in the prototype. |
| 16 | Photo ID entry point | Hidden until the feature ships. |
| 17 | Sign-in merge | Local sightings merge into the account automatically. |
