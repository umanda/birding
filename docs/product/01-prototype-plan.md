# 01 — Prototype plan (Phase 1: Discover)

Status: Draft, awaiting product-owner approval (revised after owner decisions on Photo ID and login)
Date: 2026-11-13
Inputs: `00-decisions.md` (fixed), workbook v1.0 (`data/source/Sri_Lanka_Birds_Mobile_App_Database_v1.xlsx`).
Companion docs (written in parallel): `02-identification-design.md` (ornithologist), `docs/design/` (UX).

Labels used below: **[Fact]** = from the workbook or `00-decisions.md`; **[Assumption]** = analyst's judgement, to be confirmed.

## 1. Vision and personas

A free, bilingual (Sinhala/English, Tamil later) field guide that lets anyone in Sri Lanka
name the bird in front of them, in the field, without signal and without an account. It pairs a
trustworthy species guide with a simple question-based identifier; photo identification follows in the next stage.

| Persona | Context | Primary need | Key constraint |
|---|---|---|---|
| **Nimali, local beginner** (adult, Sinhala-first) | Garden, temple, wetland weekends | "What is this bird?" in Sinhala | Low birding vocabulary, mid-range Android, patchy data |
| **Kasun, school student / Wildlife Society member** | Field trips, school projects | Look up species, keep a list, learn endemics | Shared or parent's phone, often offline, limited data budget |
| **Emma, foreign tourist** | 1–2 week trip, Yala / Sinharaja / Horton Plains | Identify and tick endemics, English names | Roaming off, unfamiliar avifauna, wants it fast |
| **Ruwan, guide / serious birder** | Daily field use, clients | Fast search by any name, accurate status codes, life list | Zero tolerance for wrong data; will judge credibility |

Wildlife photographers (uploaders) are a **later** persona and are not designed for in the prototype.

## 2. Feature list (MoSCoW and release)

Releases: **P** = Prototype / web MVP (private), **Next** = next stage after MVP (with PWA), **N** = native Android+iOS (Expo), **L** = later.

| # | Feature | MoSCoW | Release | Offline? | Account? | Notes |
|---|---|---|---|---|---|---|
| F1 | Species browse (by plate order, 43 plates) | Must | P | Yes | No | [Fact] 295 species, 43 plates, `plate_order` exists |
| F2 | Search: Sinhala, English, scientific (partial, NFC-normalised Sinhala) | Must | P | Yes | No | Never alter displayed Sinhala |
| F3 | Species page: names, occurrence badge, IUCN, ID text, distribution, M/F/juvenile images, sources | Must | P | Yes | No | Show "pending verification" honestly |
| F4 | Step-by-step ID (size, colour, habitat, region) → ranked shortlist | Must | P | Yes | No | **Blocked on structured traits** (see §5); logic owned by ornithologist |
| F5 | Life list, local-first (tick species, date, optional note) | Must | P | Yes | No | Works signed-out |
| F6 | Social sign-in (Google) + life list sync | Must | P | Sign-in and sync need network | Yes | Only account features; see §3 |
| F7 | Image source/licence register per image (M/F/juvenile) | Must | P | n/a (internal) | — | Also prepares Photo ID training data (§4) |
| F8 | Language toggle si/en, UI strings externalised for Tamil | Must | P | Yes | No | Tamil content later |
| F9 | Filters: occurrence (E/R/M…), IUCN | Should | P | Yes | No | Cheap once F1/F2 exist |
| F10 | Install as PWA, full offline cache of data + images | Should | Next | Yes | No | Image pack size to be measured |
| F11 | **Photo ID**: top-3 suggestions + user confirms | **Must (next stage)** | Next | Architect to decide | Architect to decide | Not in MVP [Fact]; see §4 |
| F12 | Life list export (CSV) | Could | Next | Yes | No | |
| F13 | Sightings with GPS / map | Could | N | Yes | No | Privacy for sensitive species to be decided |
| F14 | Native apps (Android, iOS) | Must (for that release) | N | Yes | — | Expo, one codebase [Fact] |
| F15 | Sound ID | Won't (now) | L | — | — | No audio data in workbook |
| F16 | User photo uploads (photographers), moderation, credits | Won't (now) | L | Upload needs network | Yes | Needs backend: storage, moderation, licence grant |
| F17 | Tamil language content | Won't (now) | L | Yes | No | Needs Tamil names/text from a qualified source |
| F18 | eBird export / community features | Won't (now) | L | — | — | |

## 3. Login vs offline-first (resolved by owner)

[Fact] Owner decision 7: browse, search, species pages and step-by-step ID work **signed-out and offline**. Sign-in is only for
account features. The life list saves locally first.

| Capability | Needs account? | Works offline? |
|---|---|---|
| Browse, search, species pages, step-by-step ID | No | Yes, always |
| Life list — record, view, filter | No | Yes, stored on device |
| Life list — backup / multi-device sync | Yes (Google sign-in) | Changes queue; sync when online |
| Photo ID (next stage) | To be decided by architect | To be decided by architect |
| Photo uploads (later) | Yes | Queued upload |

Product rules:
- No sign-in prompt at launch. Offer sign-in from the life list ("Back up your list") only.
- On first sign-in, the local signed-out list **merges** into the account; nothing is lost, duplicates are merged by `species_id`.
- Once signed in, the session persists offline; an expired token never blocks any feature, it only pauses sync.
- Signing out asks whether to keep or clear the local copy (shared phones). [Assumption]
- Trade-off accepted: usage metrics will only cover signed-in users unless anonymous, offline-safe analytics are added (Q6).

## 4. Photo ID — next stage (not MVP)

[Fact] Photo ID is a must for the stage after the MVP. Nothing Photo-ID-specific is built in the prototype.

**Prepare now (in the MVP):**
- Every image collected for species pages (F7) gets a register row: `species_id`, plumage (male / female / juvenile / adult-unsexed),
  file, source URL, author, licence, date retrieved, and a separate flag "may be used for model training" (display rights ≠ training rights).
- Aim for M/F/juvenile coverage where plumages differ (ornithologist flags which species differ). [Fact] Today 0 of 1770 slots have an `asset_url`.

**Product-level notes for the next stage:**
- 295 classes, with plumage variants; [Assumption] a useful classifier needs roughly 50–200+ licensed field photos per class — far more than the species-page images, so a training-data source must be found.
- [Assumption] Target "correct species in top 3" ≥ 80% on a held-out Sri Lankan test set for common species; expect weaker results for females/juveniles and look-alike groups.
- UX: photo → crop → top 3 suggestions (reference image, si/en names, confidence band, occurrence badge) → user confirms, or "None of these" → step-by-step ID. Never auto-add to life list.

**Architect questions (Phase 2, so the MVP does not block it):** on-device vs server vs hybrid per release and the offline behaviour of each;
model size budget (browser cache, mid-range Android); build vs fine-tune vs third-party API (cost, licence, privacy);
training-image sourcing and licence records; accuracy measurement before release; whether photos leave the device and retention/consent.

## 5. Data gap table (Must features)

| Feature | Needs | Workbook has [Fact] | Gap / who supplies |
|---|---|---|---|
| F1 Browse | Species, plate, order | Plates (43), Species (295) with `plate_order` | None |
| F2 Search | si/en/scientific names | Species names; Taxonomy (AviList/Clements/BirdLife) | Alternate/colloquial Sinhala names not present; ornithologist to advise |
| F3 Species page text | ID + distribution in both languages | Identification & Distribution prose: **~267/295 English, ~28 Sinhala** (single language per species) | **Each species has text in one language only.** Missing language must not be machine-published; reviewed translation (mostly en→si) or show the available language with a notice |
| F3 Images | M/F/juvenile images with licence + attribution | 1770 slots (6/species), **0 asset_url**, search links only | **All images missing.** Need file, source URL, author, licence, date per image, plus "plumage differs?" flag so empty slots are hidden |
| F3 Status | Occurrence, IUCN | Occurrence (R174 M63 E35 R/M19 R+M3 R+(M)1); IUCN (LC262 NT21 VU10 EN2) | IUCN values are "working", unverified — label as such |
| F4 Step-by-step ID | Structured traits: size class, main colours, habitat(s), region(s)/elevation | Only free prose (mostly English) | **No structured traits.** Ornithologist defines vocabulary (`02-identification-design.md`) and populates rows; reviewed as `data` commits |
| F4 Region filter | Region/zone per species | Distribution prose only | Region vocabulary (e.g. wet/dry/intermediate zone, hills) + per-species values |
| F5/F6 Life list | Stable species key | `species_id` | None (user data is new) |
| F7 Image register | Licence fields, training-rights flag | None | New register; owner decides acceptable sources (Q4) |
| F8 Tamil-ready | Tamil names/text | None | Later; design schema/strings for it now |
| F11 Photo ID (next) | Licensed training images per class incl. plumages | None | Training set + licence records; source to be decided |

## 6. User stories and acceptance criteria (MVP)

**F1/F2 Browse and search** — As Ruwan, I want to find a species by any name so I can answer clients quickly.
- Given airplane mode and no account, when I type "Sri Lanka Junglefowl", then the species appears in the results.
- Given I type Sinhala in a different Unicode composition, when I search, then matching species are found (NFC) and the original Sinhala is displayed unchanged.
- Given I type "Gallus laf", when I search, then partial scientific-name matches appear.
- Given no match, when I search, then I see "No species found" and a link to step-by-step ID.

**F3 Species page** — As Nimali, I want to see what male, female and young look like so I can match my bird.
- Given a species with distinct plumages and images available, when I open it offline, then I see labelled Male / Female / Juvenile images, each with credit and licence.
- Given an image slot has no verified asset, then that slot is hidden or shows "No image yet" — never a broken image or a search link presented as content.
- Given a field is blank in the data, then it reads "Not recorded" (not inferred).
- Given the selected language's ID text is missing, then the text in the other language is shown with a note "Not yet available in <language>".
- Given any species, then the occurrence badge shows the exact code (e.g. `R+(M)`) and IUCN is labelled "global status, working value".

**F4 Step-by-step ID** — As Emma, I want to answer a few simple questions so I can narrow down the bird without knowing names.
- Given airplane mode and no account, when I choose size, colour, habitat and region, then I get a ranked shortlist within 1 second.
- Given I skip a question, then it does not filter results.
- Given my answers exclude every species, then I see the closest matches and an option to relax a filter.
- Given a shortlist, when I tap a species, then its page opens and I can return to my answers unchanged.

**F5 Life list (local-first)** — As Emma, I want to tick birds I've seen so I can count my endemics, without creating an account.
- Given I am signed out and offline, when I add a species with today's date, then it appears in my list immediately and survives an app restart.
- Given my list, when I filter by Endemic, then I see my count out of 35.
- Given I add a species already on my list, then I am offered to add another sighting, not a duplicate tick.
- Given I am signed out, when I open the life list, then I see an optional "Back up your list — sign in with Google" prompt that I can dismiss.

**F6 Sign-in and sync** — As Kasun, I want to sign in with Google so my list is backed up and on my other device.
- Given I have a signed-out local list and I am online, when I sign in, then my local entries merge into my account with no loss and no duplicate species.
- Given I am signed in and add entries offline, when connectivity returns, then they sync without duplicates and show as synced.
- Given I am signed in and offline for 14 days, when I open the app, then every feature works and I am not forced to re-authenticate.
- Given I tap sign-in while offline, then I see "Sign-in needs a connection" and my local list is unaffected.
- Given sign-in fails or is cancelled, then I return to the life list with local data intact.

**F11 Photo ID — next stage (placeholder)** — As Nimali, I want to photograph a bird and get the top 3 suggestions to confirm.
Acceptance criteria to be written in a feature spec once the architect has decided online/offline behaviour.

## 7. Prototype milestones (each small and demoable)

| M | Increment | Demo |
|---|---|---|
| M0 | Import workbook → app data file (Plates, Species, Conservation, Taxonomy) with validation report | Counts match: 295 / 43 / occurrence and IUCN totals |
| M1 | Web: species list by plate + search (si/en/scientific), no account | Search 3 names in airplane mode (after first load) |
| M2 | Species page: names, badges, Sinhala ID/distribution text, sources | Open 3 species; blanks shown as "Not recorded" |
| M3 | Image register (incl. plumage + training-rights fields) + first 20 species' M/F/juvenile images | Pages show credited images; missing slots hidden |
| M4 | Language toggle si/en, strings externalised | Switch language on any screen |
| M5 | Trait data for a **pilot set of ~30 common species** + step-by-step ID | Identify 5 test birds from the pilot set offline, signed out |
| M6 | Life list, local-only, signed-out | Add offline, restart app, list intact; endemic count |
| M7 | Google sign-in + merge local list + sync | Sign in, list merges; add offline, reconnect, see on second device |
| M8 | Scale traits and images to all 295 | Full guide and step-by-step ID cover all species |

Next stage (not prototype): PWA install + full offline cache; Photo ID spike → feature spec → build.
Order rationale: the signed-out guide (M1–M5) is valuable alone and de-risks data; account features come last.

## 8. Success metrics, risks, open questions

**Success metrics (prototype, measured with test users)** [Assumption — targets to agree]
- Search: correct species in top 5 for ≥ 95% of si/en/scientific test queries, offline.
- Step-by-step ID: target bird in shortlist top 10 for ≥ 70% of pilot test scenarios.
- Field test: 5 users (one per persona + guide) complete "identify and add to life list" unaided, offline, signed-out, in < 2 minutes.
- Sync: 0 lost or duplicated entries across sign-in merge and offline sync tests.
- Data: 0 images without a licence record; 0 altered Sinhala strings (automated check vs workbook).

**Risks**
| Risk | Impact | Mitigation |
|---|---|---|
| No structured traits → step-by-step ID cannot work | Must feature blocked | Pilot 30 species first; ornithologist owns vocabulary |
| No licensed images; public-source images need clearing before launch | Display blocked; legal | Licence register from day 1; replaceable per image |
| Too few licensed images to train Photo ID next stage | Next-stage Must at risk | Record training rights now; find a training-data source early |
| Local→account merge bugs | Lost user lists, trust | Merge by `species_id`; dedicated QA cases |
| Prose exists in one language only (mostly English) | Sinhala-first persona under-served | Q2; never machine-translate silently |
| Offline image pack size (295 × up to 3 images) | Install size, data cost | Measure in M3; compressed sizes; optional download |
| Unverified IUCN / pending fields | Credibility | Label as working values |

**Open questions for the owner**
1. **Sign-in providers:** Google only for the prototype, or also Apple/Facebook (Apple is required on iOS if other social logins are offered)?
2. **Translation:** who reviews translations (mostly English → Sinhala, ~28 species Sinhala → English)? Until then, is showing the available language with a notice acceptable?
3. **Trait data:** can the ornithologist populate structured traits starting with a ~30-species pilot, and who is the human reviewer?
4. **Images:** which public sources are acceptable for the private MVP, and is there a target date/partner (e.g. local photographers) for cleared images — ideally also licensed for Photo ID training?
5. **Students:** is the app intended for users under 13/16? This affects sign-in for sync.
6. **Analytics:** with no forced login, do you want anonymous, offline-safe usage analytics, or none?
7. **Location data:** should life-list entries store GPS, and should sensitive (VU/EN) species locations be hidden?
