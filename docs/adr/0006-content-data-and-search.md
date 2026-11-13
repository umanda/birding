# 0006 — Content data pipeline, content model, search and user data

- Status: Proposed
- Date: 2026-11-13

## Context
Workbook v1.0 holds 295 species, 43 plates and 11 sheets. Rules: source values are never mutated, blank stays NULL, Sinhala is NFC for search only, and the app must work offline, signed-out, on web first and then native (Expo, TypeScript, ADR in parallel).

Measured with `py` + openpyxl (UTF-8 bytes of non-blank cells):

| Sheet | Rows | Bytes |
|---|---|---|
| Identification (prose) | 295 | 297,546 |
| Distribution (prose) | 295 | 125,987 |
| Conservation | 295 | 172,490 |
| Taxonomy | 295 | 104,811 |
| Species (names) | 295 | 64,921 |
| Species Sources / Plates / Ref. sources | 347 / 43 / 11 | 112,140 / 3,238 / 2,429 |
| Media (1770 slots) | 1,770 | 638,353 (almost all blank-asset search URLs) |
| Workbook total | | 1,525,893 |

- App-relevant text excluding Media search URLs is about 0.9 MB raw JSON (about 250 KB gzipped). Search index inputs (names only) are about 65 KB.
- Distinct values: occurrence 6 codes, IUCN 4 in use (LC/NT/VU/EN; vocabulary has 8), media_type 2, plumage_or_age 3, `plate_order` 9, `taxonomy_match` 2, `occurrence_verification_status` 1, `iucn_verification_status` 1.
- Unicode: 0 non-NFC cells today. ZWJ/ZWNJ (U+200D/U+200C) appear in 31 Species, 67 Identification, 46 Distribution cells, so ZWJ handling is real (Sinhala rakaransaya/yansaya).
- Media search URLs are discovery links, not assets. They stay in the source and the register; they are not bundled for display.

## Options
Pipeline language:

| Option | Pros | Cons |
|---|---|---|
| (a) Node/TS build script (`xlsx`/exceljs) emitting JSON | One language and one toolchain; shares the types and NFC/search-key code with the app, so the build and runtime cannot diverge; runs in CI via `npm run content:build` | xlsx parsing in Node is a little clumsier than openpyxl |
| (b) Python script | openpyxl is the reference reader; the bird-data skill already uses it | Second runtime in CI; types and normalisation code duplicated in TS |

Runtime store:

| Option | Pros | Cons |
|---|---|---|
| SQLite via expo-sqlite | Real SQL, FTS5, same engine on native | Web support is the weak point (see below); needs a prebuilt DB asset plus wasm; heavy for 295 rows |
| Plain bundled JSON + in-memory indexes | Identical on web, PWA, Android, iOS; trivially offline (cache one file); load plus index build is milliseconds for ~0.9 MB; easy to diff in review | Whole dataset in memory (about 3 to 5 MB, fine); no ad-hoc SQL |

expo-sqlite web status: unverified. WebSearch was not available in this session, so this is from memory. Web support was alpha, based on wa-sqlite, needing wasm bundling in Metro and, for OPFS/SharedArrayBuffer persistence, COOP/COEP headers that complicate static hosting. Re-check the current Expo SDK docs before reversing this ADR.

## Decision
1. **Pipeline (a)**: `tools/content/build.ts` reads the xlsx, validates, and writes `content/content.v{N}.json` (typed, deterministic key order, so the build is idempotent and diffs are reviewable) plus `validation-report.json`. Source cells are copied verbatim; derived values (search keys, `size_class`) go into new fields.
2. **Runtime store: bundled JSON plus in-memory indexes** (Maps by `species_id`, `plate_id`, occurrence). No SQLite for content now. 295 rows and <100 ms search do not justify the web/wasm risk. Revisit if content passes about 20 MB or needs ad-hoc queries. Because the JSON is normalised like tables, a later move to SQLite is mechanical.
3. **User data** in a separate store (below).

### Content model (types mirror the workbook keys)
- `Plate {plate_id PK, plate_number, title: LText}`
- `Species {species_id PK, plate_id FK, plate_order, scientific_name, authority}`
- `Name {species_id FK, lang: en|si|ta|sci, kind: primary|alt|source, text, search_key}`. Tamil is added later as rows, with no schema change. Alternates will come from the ornithologist.
- `Taxonomy {species_id PK/FK, avilist_name, clements_2026_name, birdlife_v10_name, match, change_note, avibase_id, ...}` copied as-is.
- `Conservation {species_id PK/FK, occurrence_code, occurrence_verification, iucn_working, iucn_verification, factsheet_url, ...}`. Codes are kept as the exact strings (`R+(M)`).
- `SpeciesText {species_id FK, field (description|male_female|juvenile|tips|distribution|seasonality), lang, text}`. One language per species-field in the source; `lang` is tagged by the importer. Detection is by script (Sinhala block U+0D80-0DFF) and is recorded, not guessed. Mixed or ambiguous cells fail the build for manual tagging. Reviewed translations arrive later as additional rows with `method`, `status`, `reviewer` (per 02-identification-design); the UI prefers the user's language when `status = published`, else shows the original with a notice.
- `Trait {species_id FK, field, value, plumage_key, prominence?, status?, source, confidence, review_status, reviewed_by, reviewed_at}`. A value-row design as in 02 section 3. Only `review_status = reviewed` is used for scoring. Stored in a separate `traits.json` so ornithologist `data` commits do not touch the workbook-derived file.
- `Media {media_id PK, species_id FK, kind, plumage_key, discovery_url}` is the source slot, kept separate from `MediaAsset {asset_id, media_id/species_id FK, plumage_key, file, source_url, author, licence, attribution, retrieved_at, display_ok, training_ok}`. Only `MediaAsset` rows are rendered, and only with licence and attribution non-null.
- `Source {source_id PK, species_id FK, url, ...}` and `Reference {reference_id PK, ...}`.

### Validation (any failure exits non-zero and fails CI)
- Unique `plate_id`, `species_id`, `media_id`, `source_id`, `reference_id`; row counts must equal the Plates `species_count` and the expected 295/43/1770/347/11.
- FK integrity: Species.plate_id, every per-species sheet has exactly one row for each species, Media/Sources species_id exist; `(plate_id, plate_order)` unique.
- Controlled vocabularies from the Code Lists sheet: occurrence in {E,R,M,R/M,R+M,R+(M)}; IUCN in the 8 codes; media_type, plumage_or_age. Unknown code means failure, with no remapping.
- Required non-blank: `species_id`, `plate_id`, `english_name`, `accepted_scientific_name`, `occurrence_code`. A blank `sinhala_name` or `iucn` is a warning that stays NULL, not a failure. The expected warning list is committed, so a new blank fails.
- NFC: report any non-NFC source cell as a warning (the data is NFC today). Search keys are always derived. A stored value must not differ from the source cell, checked by a round-trip test comparing the output with a fresh workbook read, which enforces the "no altered Sinhala" metric.
- `asset_url` non-blank requires licence and attribution; a trait vocabulary violation fails.
- Output carries `content_version`, `schema_version`, `source_sha256`, and counts.

### Search
- Index built at load from `Name` rows and `search_key`s. Key function (shared by build and app): NFC, then lowercase, strip `U+200B-U+200D`/`U+FEFF`/`U+2060`, strip combining marks for Latin only, collapse spaces and punctuation. Sinhala is never otherwise altered. The display string is the untouched original.
- Sinhala compare: NFC then remove ZWJ/ZWNJ on both sides, so typing with or without rakaransaya joiners matches. Prefix matching runs on Unicode code points (`Array.from`), not UTF-16 units.
- Match order: exact, then prefix (sorted-array binary search per word), then word-prefix of any token, then fuzzy. English and scientific fuzzy use a hand-rolled Damerau-Levenshtein capped at distance 1 for 4 to 6 characters and 2 above, only over candidates sharing the first character or a trigram, so there is no linear scan cost beyond about 2,000 name rows. Sinhala gets prefix and substring only, with no edit distance, since edit distance over Sinhala syllables is unreliable without review.
- Library: none for the MVP, about 100 lines of code, tested against the acceptance queries in 01 section 6. Fallback candidate if fuzzy quality disappoints: MiniSearch (about 8 KB, no deps). Not FlexSearch/Fuse, which handle Sinhala segmentation poorly or scan linearly.
- Target: under 100 ms on a mid-range Android, expected well under 10 ms for about 2,000 keys; add a perf test.

### User data (life list)
- Never mixed with content; keyed only by `species_id` (plus `content_version` seen, for diagnostics).
- Web/PWA: IndexedDB (via `idb`, per ADR 0003), because localStorage is small, synchronous and easily evicted. Request `navigator.storage.persist()`. Native: expo-sqlite (stable on native) behind one `LifeListRepository` interface, with an in-memory fake for tests. If the architect wants one store everywhere, AsyncStorage/MMKV are acceptable only for tiny data, not for a growing sightings table.
- Schema `sighting {id uuid PK, species_id, seen_at, note, lat_rounded?, lon_rounded?, created_at, updated_at, deleted_at, synced_at}`. Soft delete and UUIDs make the merge-on-sign-in and offline sync idempotent (merge by `species_id`, keep all sightings). Location is stored rounded only (decision 12).
- Migrations: numbered, forward-only (`0001_init`, ...), tracked with `PRAGMA user_version` (SQLite) or the IndexedDB version number. Each migration has a test that opens the previous version fixture and checks that data survives.
- Content updates never migrate user data. Species ids that vanish stay in the list as "retired" (see below).

### Versioning and updates
- `content_version` is `YYYY.MM.DD-n` and `schema_version` is an integer. The JSON is a build asset and is precached by the service worker or bundled in the native binary, so offline always works from the last good copy.
- Update flow: the app checks a tiny `content/manifest.json` (version, sha256, URL) when online, downloads to a staging copy, validates the hash and `schema_version <= supported`, then swaps atomically at next start. If the schema is newer than the app, it keeps the old content and prompts for an app update.
- A `species_id` rename or removal needs an `aliases` list (`old_id -> new_id`) in the content file, applied to the life list on load. The validator fails the build if an id disappears without an alias.
- Rule: schema changes ship as numbered content-schema migrations with a test; content changes are `data` commits.

## Consequences
- Easier: one TypeScript codebase, same code on web and native, trivially offline, small and diffable artifact, builds fail loudly on bad data.
- Harder: no SQL for content; tooling work to build the validator and a round-trip test; fuzzy search is our code to maintain.
- Next: M0 ticket for `tools/content` (parse, validate, emit, report), including the script-based language tagging; confirm the web target of the user store with the architect; re-verify expo-sqlite web status before any switch.
- Open points: Media `asset_url` is entirely blank, so MediaAsset starts empty; the Sinhala alternates and Tamil names have no source yet; whether to ship the Taxonomy notes and long source notes at all (172 KB Conservation is mostly notes) or lazy-load them on the species page.
