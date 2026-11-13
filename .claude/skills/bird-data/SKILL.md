---
name: bird-data
description: Structure, meaning and integrity rules of the Sri Lanka birds database workbook (Sri_Lanka_Birds_Mobile_App_Database_v1.xlsx). Use whenever reading, importing, validating, displaying or changing species data.
---

# Sri Lanka birds database

Workbook: `Sri_Lanka_Birds_Mobile_App_Database_v1.xlsx` (export v1.0, 2026-11-13).

## Sheets
| Sheet | Rows | Key | Notes |
|---|---|---|---|
| Plates | 43 | `plate_id` | Plate number and English/Sinhala titles |
| Species | 295 | `species_id` (e.g. `slb-gallus-lafayettii`) | FK `plate_id`, `plate_order`, English/Sinhala/scientific names |
| Taxonomy | 295 | `species_id` | AviList 2026, Clements 2026, BirdLife v10 names, Avibase id |
| Conservation | 295 | `species_id` | Sri Lanka occurrence code, IUCN category, BirdLife URL |
| Identification | 295 | `species_id` | Description, male/female, juvenile, field tips — **prose, mostly Sinhala** |
| Distribution | 295 | `species_id` | Distribution & hotspots, seasonality — **prose, mostly Sinhala** |
| Media | 1770 | `media_id` | 6 slots/species (photo/illustration × male/female/juvenile). **All `asset_url` blank**; only search links |
| Species Sources | 347 | `source_id` | Per-species reference URLs |
| Reference Sources | 11 | `reference_id` | General references and caveats |
| Code Lists | — | — | Definitions of codes below |
| Data Dictionary | — | — | Field types and constraints |

Import order: Plates → Species → Taxonomy / Conservation / Identification / Distribution → Media / Sources.

## Codes
- Occurrence (`sri_lanka_occurrence_code`): `E` Endemic (green), `R` Resident (orange),
  `M` Migrant (blue), `R/M`, `R+M`, `R+(M)` — preserve exactly. Counts: R 174, M 63, E 35, R/M 19, R+M 3, R+(M) 1.
- IUCN (`iucn_category_working`): LC, NT, VU, EN, CR, DD, NE, EX — global status,
  **not** the same as occurrence. Working values, not independently verified.

## Integrity rules
1. `species_id` is the stable key. Never key on common names.
2. Never translate, auto-correct or overwrite Sinhala text. Normalise to NFC for
   search only, keep the original for display.
3. Blank = unknown. Never infer values.
4. Many fields are marked pending verification; surface this honestly, don't hide it.
5. Discovery/search URLs are **not** licensed assets. No media ships without
   a verified `asset_url`, licence and attribution.
6. Content changes are proposed by or reviewed by the `ornithologist` agent and
   committed with the `data` commit type.

## Reading the workbook
Use Python + openpyxl (`read_only=True, data_only=True`), and run with
`-X utf8` on Windows so Sinhala prints correctly.
