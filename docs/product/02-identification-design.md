# Identification design (ornithologist, Phase 1 Discover)

Date: 2026-11-13. Status: **proposal for owner review**. Scope note from owner: Photo ID is
**next stage**, not MVP. Step-by-step ID, trait schema and media needs are MVP.

Source: `data/source/Sri_Lanka_Birds_Mobile_App_Database_v1.xlsx` (295 species, 43 plates).
All workbook occurrence/IUCN values are themselves marked *pending verification*; nothing
below upgrades them. Values I add from outside the workbook are tagged and need review.

## 1. Step-by-step ID: the questions, in order

The aim is that a beginner answers in under 30 s, and that every question can be skipped
with **"Not sure"**. Month is never asked; it comes from the device date (editable).

| # | Question | Choices (icons + Sinhala/English labels) | Why here |
|---|---|---|---|
| 0 | *(automatic)* **When** | Today's month; user can change it | Migrant seasonality (63 M + 23 R/M-type species) is the strongest filter and costs no effort. |
| 1 | **Where in Sri Lanka?** | Map with 6 zones: Wet lowlands (Colombo, Galle, Sinharaja) · Wet mid-hills (Kandy, Kitulgala) · Montane (Nuwara Eliya, Horton Plains) · Intermediate · Dry lowlands (Anuradhapura, Yala, Wilpattu) · Arid coast & north (Mannar, Jaffna, Puttalam, Hambantota). "Use my location" sets it coarsely. | Separates wet-zone/montane endemics from dry-zone species and from north-west migrant shorebird sites. Easy: everyone knows where they are. |
| 2 | **Where was it?** (habitat) | Town/garden · Forest · Open country/paddy/scrub · Fresh water (tank, marsh, river) · Coast (beach, lagoon, mudflat, saltpan, sea) | Big split (waterbirds vs. land birds) that beginners answer reliably. |
| 3 | **How big?** | 7 silhouettes against familiar birds (table below) | Size is very discriminating but often misjudged, so it comes after the easy questions and is scored softly. |
| 4 | **Main colours** (pick up to 3) | Fixed palette of 12: black, white, grey, brown, rufous/chestnut, orange, yellow, green, blue, purple/glossy, red, pink | Highly discriminating, but lighting and dimorphism make it error-prone, so it is matched against **every plumage** of the species. |
| 5 | **What was it doing?** | On the ground · Swimming · Wading in shallows/mud · In a tree or bush · Perched in the open (wire, post, bare branch) · Flying/soaring overhead | Separates swifts/swallows/raptors in flight, waders and ground birds. Cheap to answer. |

After each answer the app shows the live top results, so many users can stop after Q2 or Q3.
Results can then be narrowed with optional "more detail" chips (bill shape, tail length) in
a later release. I do not recommend more than 5 questions for the MVP.

**Size classes** (by the workbook `length_cm` of the reference bird, Identification sheet):

| Class | Range (cm) | Reference bird shown | Workbook length |
|---|---|---|---|
| XS | < 12 | Purple Sunbird / white-eye | 10 cm; 10–12 cm |
| S | 12–17 | House Sparrow | 14–15 cm |
| M | 17–22 | Red-vented Bulbul | 20 cm |
| L | 22–30 | Common Myna | 23–25 cm |
| XL | 30–45 | House Crow | 40 cm |
| XXL | 45–70 | Indian Pond-heron / Black Kite | 45–48 cm; 48–60 cm |
| XXXL | > 70 | Great Egret / Indian Peafowl | 80–104 cm; Peafowl length not parsed (see 7) |

**Zone boundaries** need a citable polygon source (the Department of Agriculture agro-ecological
zone map is the usual one). Its licence must be confirmed before shipping. Elevation band
(lowland < ~300 m, mid 300–1000 m, montane > 1000 m) can also be derived from GPS if the
user allows it.

## 2. Ranking, in plain language

1. **Every species starts in the list.** Each answer adds points for a match and takes away a
   little for a mismatch. No single answer removes a species, because people misjudge size,
   lighting changes colours, and our data has gaps.
2. **"Close" counts.** Size one class away gets partial credit. Colours count if they match
   *any* plumage of the species (male, female, juvenile, breeding, non-breeding).
3. **"Not sure" and blank data are neutral.** A species with an unknown trait is neither
   rewarded nor punished, and the result card says "data incomplete".
4. **Season and place matter most.** A migrant outside its months, or a species outside its
   zones, is pushed well down but stays reachable ("unusual here/now"). Vagrants exist and our
   month data is partly unverified.
5. **Common birds first when matches are equal.** A per-zone commonness score (common /
   uncommon / scarce, from eBird Sri Lanka frequency, cited and dated) breaks ties. This is
   honest: a brown bird in a Colombo garden is far more likely a Common Myna than a rarity.
6. **No artificial boost for endemics or threatened species.** Endemic status (E) and IUCN
   category are shown as badges but never change the score. Boosting them would mislead users
   and inflate rare-bird reports.
7. **Group answers.** If the top results belong to one confusion group (section 6), show a
   group card first ("Small sandpiper/stint"), then the members with their key marks.
8. **Transparency.** Each result shows *why* it matched (for example "size ✓ colours ✓ not
   usually here in July").

Weights start equal and are tuned on the pilot set by checking that known sightings rank in the
top 5. The tuning set and results go into the feature spec.

## 3. Structured trait schema (per species)

Every value is a row, not a free-text cell, and carries provenance:
`source` (`wb:<Sheet>.<column>` | `ext:<reference_id or URL>` | `expert:<reviewer>`),
`confidence` (`high` | `medium` | `low`), `review_status` (`proposed` | `reviewed`),
`reviewed_by`, `reviewed_at`. Only `reviewed` values are used in scoring. `proposed` values
are hidden behind a debug flag.

| Field | Allowed values | Multi-value rule |
|---|---|---|
| `length_cm_min`, `length_cm_max` | number | One pair per `plumage_key` if sexes differ (Junglefowl ♂66–73 / ♀35). Add `length_note` (e.g. "excl. streamers"). |
| `size_class` | derived from length, never hand-entered | Can span classes. |
| `colour` | 12-colour palette above | Many; each row has `plumage_key` and `prominence` (`main` / `accent`). |
| `plumage_key` | `adult` · `male` · `female` · `juvenile` · `immature` · `breeding` · `non_breeding` · `eclipse` · `morph:<name>` | Used by colours, length and media. |
| `zone` | `wet_lowland` · `wet_midhill` · `montane` · `intermediate` · `dry_lowland` · `arid_coast_north` | Many; each has `status`: `regular` / `local` / `scarce`. |
| `habitat` | `town_garden` · `forest` · `open_country` · `freshwater` · `coast` (internal subtags allowed, e.g. `coast.mudflat`) | Many. |
| `where_seen` | `ground` · `swimming` · `wading` · `tree_bush` · `perched_open` · `aerial` | Many; mark one `primary`. |
| `month_presence[1..12]` | `present` · `peak` · `scarce` · `absent` · `unknown` | Exactly 12. Residents default to `present` only if the workbook says year-round. |
| `commonness_by_zone` | `common` · `uncommon` · `scarce` | One per zone, with eBird access date. |
| `dimorphism` | `none` · `slight` · `marked` | One. |
| `juvenile_distinct`, `seasonal_plumage` | boolean | One each. |
| `confusion_group_id` | id from section 6 | Zero or one. |
| `sensitivity` | `none` · `obscure_location` · `never_show_location` | One (section 6). |

Occurrence code (E/R/M…) and IUCN stay in their own Conservation fields, copied exactly. They
are never merged into these traits.

## 4. Pilot: 10 species

**Source key.** `ID-B` = Identification.species_description · `ID-C` = male_female_identification ·
`DI-B` = Distribution.sri_lanka_distribution_and_hotspots · `DI-C` = seasonality_months_seen ·
`CO` = Conservation. **[X]** = my field knowledge, *proposed and unverified*. To confirm against
Warakagoda et al. (2012) *Birds of Sri Lanka* (Helm) and eBird Sri Lanka bar charts.
Junglefowl colours come from the Sinhala colour terms in ID-C (medium confidence; I did not read
the full sentence).

| species_id (code) | Length cm | Colours by plumage | Zones | Habitat | Where seen | Months | Dimorph. |
|---|---|---|---|---|---|---|---|
| slb-gallus-lafayettii (E) | ♂66–73, ♀35 (ID-B) | ♂ orange, red, yellow, purple/glossy tail; ♀ brown, black, white (ID-C, med) | all zones, lowland–hills (DI-B) | forest, scrub (DI-B) | ground (ID-B) | 1–12 (DI-C) | marked (ID-C) |
| slb-urocissa-ornata (E, VU) | 42–47 (ID-B) | blue, rufous/chestnut, red (bill, legs), white tail tip (ID-B) | wet_lowland, wet_midhill, montane edge (DI-B) | forest (DI-B) | tree_bush (ID-B "all forest levels") | 1–12 (DI-C) | none (ID-C) |
| slb-actitis-hypoleucos (M) | 18–20 (ID-B) | brown, white (ID-B) | all; coast + inland (DI-B) | freshwater, coast (DI-B) | wading (ID-B) | peak ~Aug/Sep–Apr, some other months (DI-C) | none (ID-C) |
| slb-tachyspiza-badia, Shikra (R) | 26–36 (ID-B) | ♂ grey, rufous barring; ♀ brown, barred (ID-B/C) | wet, intermediate, dry settlements (DI-B) | town_garden, open_country, forest edge (DI-B) | tree_bush; aerial **[X]** | 1–12 (DI-C) | slight–marked (ID-C: size, iris, colour) |
| slb-ardeola-grayii (R+M) | 45–48 (ID-B) | non-br brown streaked, white wings in flight; br maroon-brown (ID-B) | wet + dry zones (DI-B) | freshwater, paddy, town wetlands (DI-B) | wading (ID-B) | 1–12, more in N. winter (DI-C) | none, seasonal plumage (ID-C) |
| slb-eudynamys-scolopaceus, Asian Koel (R) | 39–46 (ID-B) | ♂ black/glossy, red eye; ♀ brown spotted white/buff (ID-B/C) | widespread (DI-B) | town_garden, forest edge (DI-B) | tree_bush (ID-B) | 1–12 (DI-C) | marked (ID-C) |
| slb-terpsiphone-paradisi (R/M) | 19–22 excl. streamers (ID-B) | ♂ black head, chestnut **or** white body; ♀ chestnut, grey (ID-B/C) | resident race mainly dry lowland + lower hills; migrants widespread (DI-B) | forest edge, gardens (DI-B) | tree_bush (ID-B) | resident all year; migrants N. winter (DI-C) | marked + morphs (ID-C) |
| slb-cinnyris-asiaticus, Purple Sunbird (R) | 10 (ID-B) | ♂ br purple/glossy, black; ♀ green/olive, yellow (ID-B) | mainly dry_lowland (DI-B) | open_country, scrub, gardens (DI-B) | tree_bush (ID-B) | 1–12 (DI-C) | marked + eclipse (ID-C/D) |
| slb-corvus-splendens, House Crow (R) | 40 (ID-B) | black, grey (ID-B) | all, esp. towns + coast (DI-B) | town_garden (DI-B) | ground, perched_open **[X]** | 1–12 (DI-C) | none (ID-C) |
| slb-acridotheres-tristis, Common Myna (R) | 23–25 (ID-B) | brown, black, yellow, white patches (ID-B) | widespread (DI-B) | town_garden, open_country (DI-B) | ground **[X]** | 1–12 (DI-C) | none (ID-C) |

Uncertain or open points in the pilot:
- Common Sandpiper: month values beyond "Aug/Sep–Apr" need eBird Sri Lanka charts.
- Shikra and House Crow: `aerial` / `perched_open` are mine **[X]**.
- Purple Sunbird ID-B says the breeding male has a "greyish-brown lower belly". That needs
  checking (flag F7).
- Most zone tags are mapped by me from prose ("wet and dry zones", "widespread"). The prose
  rarely names all six zones, so zone tagging needs a reviewer pass for every species.

## 5. Media needs (male / female / juvenile and more)

The workbook gives 6 slots per species (photo/illustration × male/female/juvenile = 1,770;
all `asset_url` blank). That model is **not enough**. Many Sri Lankan birds differ by season
or morph rather than sex. Proposed slot key = `plumage_key` from section 3, plus an optional
`flight` view for raptors, swifts and shorebirds. Monomorphic species set female =
`same_as_male`, so the slot is not reported as missing.

**Counts from the data.** Phrasing in `male_female_identification` varies between batches,
and the word "dimorphism" appears in only ~16 rows (some saying *no* dimorphism), so a
keyword count is unreliable. **Method:** a reviewer reads column C (and D for juveniles) for
each species and sets `dimorphism`, `juvenile_distinct`, `seasonal_plumage`. This takes about
2 reviewer-days for 295 species. My **field-knowledge estimate [X]**, to replace with the
reviewed figures:

| Need | Approx. species | Examples from the workbook list |
|---|---|---|
| Separate ♂ and ♀ | ~70–75 | Junglefowl, Peafowl, Spurfowl, Garganey/Pintail/Shoveler/Wigeon, green-pigeons, Koel, harriers, Kestrel, Shikra, Besra, all flamebacks/woodpeckers, parakeets, Hanging-parrot, leafbirds, minivets, Iora, Magpie-robin, Indian Robin, Pied Bushchat, Paradise-flycatcher, sunbirds, weavers, House Sparrow, Sparrow-lark, Greater Painted-snipe (female brighter) |
| Distinct juvenile/immature | ~60–80 | eagles and hawk-eagles, Brahminy Kite, Rufous-bellied Eagle, Accipiters, herons/night-heron, storks, gulls, terns, cormorants, Black-hooded Oriole, Koel, munias |
| Breeding vs non-breeding or eclipse | ~35–45 | plovers, godwits, Curlew Sandpiper, Turnstone, terns, gulls, egrets, Pond-heron, Jacana, Watercock, Garganey, Purple Sunbird, Baya Weaver, wagtails |
| Colour morphs | ~5 | Western Reef-heron, Changeable Hawk-eagle, Paradise-flycatcher, Grey-bellied Cuckoo (hepatic ♀) |
| One adult image suffices | ~120–150 | crows, myna, bulbuls, babblers, swiftlets, most kingfishers, owls, Blue Magpie |

That means at least ~480–520 images for full coverage. Every image needs `asset_url`, licence,
attribution, and the `plumage_key` it shows, reviewed by the ornithologist. Wrongly labelled
female/juvenile images are a common error in public image sources.

## 6. Photo ID (next stage): confusion groups and sensitive species

**Group answers.** Return a group rather than one species when the model's top candidates fall
inside one of these groups and the image is not decisive. These groups are also used in
step-by-step results (section 2.7):
- Swifts & swiftlets: Indian Swiftlet, Little Swift, Asian Palm-swift (+ Needletail, Alpine at distance)
- Small plovers: Kentish, Little Ringed, Common Ringed, Greater and Siberian Sand-Plover
- Small sandpipers/stints: Little Stint, Curlew Sandpiper, Sanderling (non-br), Marsh/Wood/Green Sandpiper
- Godwits; Eurasian Curlew vs Whimbrel; Pacific Golden vs Grey Plover (non-br)
- Accipiters: Shikra, Besra, Crested Goshawk; female/juvenile harriers ("ringtails")
- Hawk-eagles and dark raptors: Changeable vs Legge's Hawk-eagle; juvenile eagles
- White egrets: Little, Medium, Great, Eastern Cattle, white-morph Western Reef-heron
- Cormorants: Little, Indian, Great; terns: Lesser vs Great Crested, Little vs Saunders's, Whiskered vs White-winged (non-br), Bridled vs Sooty
- Phylloscopus: Large-billed Leaf-warbler, Greenish Warbler; reed-warblers: Blyth's vs Clamorous
- Prinias & cisticola: Plain, Grey-breasted, Ashy, Jungle, Zitting Cisticola
- Munias (adults and especially all-brown juveniles): Scaly-breasted, White-rumped, Black-throated, Tricoloured, Indian Silverbill
- Pipits/larks: Paddyfield vs Richard's Pipit; Oriental Skylark vs Jerdon's Bushlark
- Female sunbirds and flowerpeckers; female minivets; female ducks (Garganey, Pintail, Shoveler, Wigeon)
- Flamebacks (Black-rumped, Red-backed, Crimson-backed); parakeets (Rose-ringed, Alexandrine, Layard's ♀)
- Nightjars (Indian, Jerdon's, Jungle); scops-owls (Indian, Oriental, Serendib); drongos (Black, White-bellied, Ashy)
- Asian Brown vs Brown-breasted Flycatcher; Sri Lanka vs Indian White-eye; mynas (Common, Sri Lanka, Common Hill)

**Sensitive species: never show precise locations** (follows eBird's sensitive-species practice).
- **Never show** nest, roost or colony locations for *any* species, from users or from us.
- **Obscure user records to ~10 km grid / reserve name only:** Serendib Scops-owl,
  Chestnut-backed Owlet, Sri Lanka Frogmouth and all owl/nightjar day roosts, Sri Lanka
  Whistling-thrush, Spot-winged Thrush, Sri Lanka Thrush, Green-billed Coucal, Red-faced
  Malkoha, Blue Magpie, White-faced Starling, Black-necked Stork, Lesser Adjutant, Crab
  Plover, Great Stone-curlew, Legge's Hawk-eagle, Black Eagle, Rufous-bellied Eagle,
  Grey-headed Fish-eagle.
- **Trade-targeted (no point locations at all):** parakeets, Sri Lanka Hanging-parrot, Common
  Hill Myna, Sri Lanka Myna, Sri Lanka Shama, munias.
- Workbook hotspot text names reserves only (e.g. Serendib: Sinharaja, Kitulgala…), which is
  acceptable. The nest-site details in `seasonality_months_seen` (e.g. Whistling-thrush
  "rock ledges beside waterfalls") are generic, but should be reviewed before display.

## 7. Content review flags (spot-check only; nothing changed)

- **F1 Language is mostly English, not Sinhala.** `species_description` starts in English for
  ~268/295 rows. Only ~27 rows start in Sinhala (sheet rows 2–15, 17, 23–26, 98–100, 102–105,
  i.e. plates 1–2, part of the pigeons, part of the terns). Distribution follows the same
  pattern. So the **main translation need is English → Sinhala**, plus Sinhala → English for
  ~27 rows.
- **F2 Length format is inconsistent.** It uses "සෙ.මී. N" or "N cm" (both parseable), or no
  number at all. ~17 rows have no parseable cm figure: Peafowl, Flamingo, storks, ibises,
  spoonbill, cormorants, Black-winged Kite, Besra, Hanging-parrot, Racket-tailed Drongo.
  Pelican is given in metres.
- **F3 Juvenile placeholders.** Around 20 rows (plates 1–2, several terns) say juvenile details
  were "not obtained in this pass" (confirmed for rows 2–5). Treat them as blank, not as
  "same as adult".
- **F4 IUCN to verify.** Great Stone-curlew is `LC`, but BirdLife lists it NT (since 2013).
  Indian Stone-curlew is `NT`. Check whether these two rows are swapped. Black-necked Stork is
  `LC`, but BirdLife's factsheet showed NT (the 2025 reassessment is unconfirmed). Also verify
  Black-headed Ibis, Oriental Darter and Alexandrine Parakeet (`LC`), and the NT/VU values for
  Rufous-bellied Eagle, Chestnut-backed Owlet, Black-backed Dwarf-kingfisher, Ashy-headed
  Laughing-thrush, Sri Lanka Myna, Dull-blue Flycatcher and Legge's Flowerpecker. The
  workbook's own method ("LC by absence of a tag in Avibase") is weak. Indian Roller and
  Indian Courser `NT` are consistent with the 2025 uplistings. Painted Stork `LC` is consistent
  with BirdLife 2023.
- **F5 Occurrence codes to verify against CBC.** Crab Plover is `R`: CBC image pages call it
  resident, BirdLife calls it a full migrant. Glossy Ibis is `M`, but it now breeds locally,
  so R/M or R+M may fit. Also check Fulvous Whistling-duck `M` and Indian Spot-billed Duck
  `R/M`. Sri Lanka Shama `E` (*Copsychus leggei*) makes 35 endemics, while CBC and other
  sources give 34 or other totals depending on edition. "Sri Lanka Frogmouth" is correctly
  `R`; the UI must not infer endemism from "Sri Lanka" in a name.
- **F6 CBC edition references disagree:** "CBC Country List (2011) convention" (Conservation),
  "CBC 2022" (Distribution, README) and "CBC 2026 printed form" (Taxonomy notes).
- **F7 Doubtful prose.** Besra (row 146) is called "slightly larger than Shikra" with a "strong
  pale supercilium". Besra is generally the smaller of the two, and I would not call the
  supercilium a key mark. Purple Sunbird (row 280) breeding male has a "greyish-brown lower
  belly". Check both against Warakagoda et al. 2012 / Rasmussen & Anderton 2012.
- **F8 Coverage.** 295 species is a subset of the national list. Likely missing common birds
  include Oriental Honey-buzzard, Common Tern, Ruff, Temminck's Stint, Common Snipe, Indian
  Golden Oriole, Marshall's Iora, Large Cuckooshrike, Common Woodshrike and Booted Eagle
  (verify against the CBC checklist; README says reconciliation was deferred). The ID flow must
  offer "Not in this guide yet" and never force a match.

**English/Sinhala text plan.** Keep the source cells untouched. Translations live in a separate
table (`species_id`, field, language, text, `method` = human/machine-draft, `translator`,
`reviewer`, `status` = draft/reviewed/published, date). Machine output is a **draft only**. It
is published only after a bilingual reviewer *and* the ornithologist approve it, using a fixed
glossary (CBC Sinhala names, plumage and habitat terms). Until then, the app shows the original
text with a "Sinhala/English version pending review" note. Tamil later uses the same pipeline.

## Sources consulted for this document
BirdLife DataZone factsheets (Great Thick-knee, Painted Stork, Black-necked Stork, Indian
Courser); reports of the Oct 2025 Red List update (Indian Roller, Indian Courser); Ceylon Bird
Club Images (Crab Plover status); Wikipedia "Sri Lanka shama" (2022 split). Each needs a final
check on iucnredlist.org / CBC before any data change.
