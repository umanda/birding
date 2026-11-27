# M8 traits batch 2: ornithologist summary for the owner (approved by the owner, 2026-11-27)

Status: **approved** by the owner on 2026-11-27. Spec: `docs/specs/006-scale-to-all-species.md`. Rows: `traits.csv`
(`review_status=proposed`). This hand-written summary comes before the generated `traits-review/batch-02.md`
(`npm run traits:review-sheet -- --batch 2`), which is the source of truth for row-level review.

Scope: plates `plate-07` to `plate-11` (swifts and swallows, rails and stone-curlews, pied waders and lapwings,
plovers, painted-snipe, jacana, snipe, godwits and curlews), minus the 4 pilot species already reviewed in batch 0
(Barn Swallow, White-breasted Waterhen, Red-wattled Lapwing, Pacific Golden Plover). That leaves **33 species** and
**587 proposed rows**: 489 trait rows plus 98 commonness rows. Workbook occurrence codes and IUCN values are working
values *pending verification*. Nothing here upgrades or changes them.

Key: zones WL wet_lowland, WM wet_midhill, MO montane, IN intermediate, DL dry_lowland, AR arid_coast_north.
Commonness: C common, u uncommon, s scarce. Sources: `D` species_description, `MF` male_female_identification,
`J` juvenile_immature_plumage, `T` field_spotting_tips, `H` sri_lanka_distribution_and_hotspots, `S`
seasonality_months_seen (all `workbook:`). `X` = `expert:ornithologist`. `W` = `ext:wikipedia/Pheasant-tailed_jacana`.
Confidence: h, m, l. All 33 species have English workbook prose. None of them is Sinhala-only.

---

## 1. Focus areas (read these first)

### 1a. Values that conflict with the workbook, or that I doubt
| Species | Issue | What I drafted |
|---|---|---|
| Indian Swiftlet | The wb distribution text says "Endemic to Sri Lanka". The code is `R`, and the species also breeds in south-west India. The wb puts it only in the highlands, but I believe it forages widely over the wet-zone hills and lowlands too. | Zones MO (H h), WM (X m), WL (X l). Not treated as an endemic. |
| Alpine Swift | Code `R`, but the seasonality text says "usually recorded during the non-breeding season or passage" and asks for a check of the code. I believe a resident population breeds in the hills. | **month = unknown**. |
| Brown-backed Needletail | Code `R`, but the wb calls it "an uncommon or irregular visitor" with unverified months. | **month = unknown**. Commonness WM u (H m). |
| Sri Lanka Swallow | The wb gives 13–14 cm and says it is smaller and shorter-tailed than Barn Swallow. I recall a larger bird with a deeply forked tail (low confidence: I could not find a citable length). The wb's "chestnut forehead and throat" reads like Barn or Hill Swallow. | Size S (D, **m**). Colours rufous, blue, black. |
| Hill Swallow | The wb says "dark brown to blackish upperparts, pale underparts". I believe it has glossy blue-black upperparts, a rufous forehead and throat, and dusky grey-brown underparts. | black (D h), rufous (X m), grey (X m). |
| Slaty-legged Crake | The wb says "slate-grey head and underparts" and "pinkish to reddish legs". I believe it has a chestnut head and breast, a black-and-white barred belly and dark grey legs. The wb text may describe a different crake. | brown (D h), rufous (X m), grey (D **l**). |
| Crab Plover | Code `R`, but the wb says "mainly a non-breeding visitor": it disperses south Aug–Nov, returns Mar–Apr and is most expected Nov–Mar. | **Months 8–4 drafted from the text** (8, 9, 4 low; 10–3 medium). This is a deliberate exception to the batch-1 rule (Fulvous: conflict = unknown), because here the text gives usable months. If you prefer the batch-1 rule, swap the 9 month rows for `month` in `unknown_traits`. |
| Pheasant-tailed Jacana | The wb says the non-breeding bird has a "chestnut hindneck". The external reference and my own knowledge say it has a dark neck stripe and only a trace of golden nape. The wb gives no breeding length. | Non-breeding black (W m) instead of rufous. Breeding size XXL (W m, cited). |
| Siberian Sand-Plover | The wb itself warns that old Lesser Sand-Plover records may not be Siberian after the 2023 split. I believe most sand-plovers wintering in South Asia belong to the Tibetan (*atrifrons*) group, but I cannot confirm this for Sri Lanka. | Zone AR (H m). Months 8–4 (X). **commonness = unknown**. |
| Purple Swamphen | Taxonomy: current lists (AviList and Clements) treat the South Asian birds as Grey-headed Swamphen *P. poliocephalus*. The `species_id` and names are not changed. | Rows drafted as normal. Doubt logged. |
| Great Stone-curlew | The working IUCN value is LC. I believe BirdLife lists it as NT. | No trait impact. Doubt logged. |

### 1b. Expert-sourced rows (`expert:ornithologist`): 136 of 587
- **Commonness: 82 of 98 rows.** Only 16 come from the workbook, where its prose states abundance: Little Swift
  WL/IN/DL/AR ("common in lowlands"), Needletail WM ("uncommon or irregular"), Slaty-legged Crake WL ("sightings
  are scarce"), Avocet AR ("scarce/irregular"), Yellow-wattled Lapwing DL/AR ("localised"), Oystercatcher AR ("very
  rare"), Grey Plover AR, Greater Sand-Plover AR and Whimbrel AR/DL ("common migrant"), Common Ringed Plover AR and
  Eurasian Curlew AR ("uncommon migrant").
- **No commonness row is `ext:`**, for the same reason as in batch 1: I could not read a citable status text
  (Warakagoda et al. 2012, or the CBC list with abundance codes) in this session. Page references from you or a
  second reviewer would let me convert these rows.
- Zone (27): Indian Swiftlet WM, WL; Alpine Swift IN, DL; Needletail WL; Palm-swift WM; Treeswift WL; Sri Lanka
  Swallow IN, WL, AR; Watercock IN, AR; Coot IN, AR; Indian Stone-curlew IN; Stilt IN; Yellow-wattled IN; Grey Plover
  WL, DL; Kentish DL; Greater Sand-Plover DL; Painted-snipe DL, IN; Jacana IN; Pin-tailed Snipe IN; Black-tailed
  Godwit DL; Whimbrel WL.
- Colour (6): Treeswift male rufous; Hill Swallow rufous, grey; Slaty-legged Crake rufous; Indian Stone-curlew
  white; Black-tailed Godwit breeding grey.
- Behaviour (10): Sri Lanka Swallow perched_open; Hill Swallow perched_open; Watercock wading, ground; Swamphen
  swimming; Grey Plover wading (as for Pacific Golden Plover in the pilot); Greater Sand-Plover wading;
  Painted-snipe ground; Jacana swimming; Pin-tailed Snipe ground.
- Habitat (2): Indian Swiftlet forest; Great Stone-curlew freshwater.
- Month (9): Siberian Sand-Plover 8–4. The wb gives only "northern-winter months".
- **No `size` row is expert-sourced.** No expert row is `high`.
- `ext:` rows (2): Jacana breeding size XXL and non-breeding black, cited to the Wikipedia article's measurements
  table (a Thailand breeding-season study: mean total length 45.9 cm for males, 50.3 cm for females) and its
  plumage text. Please confirm the citation is acceptable, or point me to a better one such as Rasmussen &
  Anderton 2012.

### 1c. Low-confidence rows: 81
These are mostly edge zones, edge migrant months, scarce-zone commonness, and size classes touched only by an exact
upper bound (Alpine Swift L, Indian Stone-curlew XXL, Avocet XXL, Grey Plover XL, Kentish M, Little Ringed M). Also
low: all Oystercatcher months, Little Swift brown, Slaty-legged Crake grey, Black-tailed Godwit open_country and
Palm-swift coast.

### 1d. Endemics (1)
Sri Lanka Swallow (*Cecropis hyperythra*), code `E`, LC. Photos must be from Sri Lanka only. Indian Swiftlet is
**not** an endemic (code `R`), despite the wb text (see 1a).

### 1e. Hard groups in this batch (for scenarios: top-10, with any member in the top 3)
| hard_group | Members | Why it is hard with our six questions |
|---|---|---|
| `small-swifts` | Indian Swiftlet, Asian Palm-swift, Little Swift | small, brown or black, aerial; the rump and tail shape are not in the vocabulary |
| `large-swifts` | Alpine Swift, Brown-backed Needletail | both are M, brown and white, aerial; only the zone differs, and both have unknown months |
| `swallows` | Sri Lanka Swallow, Hill Swallow, Barn Swallow (batch 0) | blue-black and rufous, aerial; size and underpart colour are the only handles |
| `dark-rails` | Common Moorhen, Eurasian Coot, Watercock (male) | dark XL rails on fresh water; shield colour is the key mark |
| `thick-knees` | Great Stone-curlew, Indian Stone-curlew | big yellow eye, ground; size and grey vs brown separate them |
| `pied-waders` | Black-winged Stilt, Pied Avocet, Crab Plover, Eurasian Oystercatcher | black and white, XL, wading on the coast; bill shape is not captured |
| `lapwings` | Yellow-wattled Lapwing, Red-wattled Lapwing (batch 0) | brown, black and white plovers on dry ground |
| `grey-golden-plovers` | Grey Plover, Pacific Golden Plover (batch 0) | same size and habitat; both show black in breeding plumage |
| `ringed-plovers` | Common Ringed, Little Ringed, Kentish | S/M, brown and white, ground; leg colour and the breast-band are the main marks |
| `sand-plovers` | Greater Sand-Plover, Siberian Sand-Plover | identical palette; L vs M is the only separation (the wb itself says structure is needed) |
| `snipes` | Pin-tailed Snipe, Greater Painted-snipe (male) | cryptic brown, L, wet grass and mud |
| `godwits` | Black-tailed, Bar-tailed | XL, grey-brown, wading; grey vs brown is a weak handle |
| `curlews` | Eurasian Curlew, Whimbrel | brown and white with a decurved bill; XXL vs XL/XXL only |

### 1f. Migrant months (M and R/M)
| Species | Code | Months drafted | Source |
|---|---|---|---|
| Alpine Swift | R | **unknown** (text vs code) | — |
| Brown-backed Needletail | R | **unknown** (irregular; no months) | — |
| Crab Plover | R | 8(l), 9(l), 10–3(m), 4(l) (text vs code; see 1a) | S |
| Pied Avocet | M | 10(l), 11–3(m), 4(l) | S |
| Eurasian Oystercatcher | M | 10–3, all low ("cautious expectation") | S |
| Grey Plover | M | 8(l), 9(m), 10–3(h), 4(m), 5(l) | S |
| Common Ringed Plover | M | 8–9(m), 10–2(h), 3(m) | S |
| Greater Sand-Plover | M | 8(m), 9–3(h), 4(m) | S |
| Siberian Sand-Plover | M | 8(l), 9–3(m), 4(l) | X |
| Pin-tailed Snipe | M | 9(m), 10–3(h), 4(m), 5(l) | S |
| Black-tailed Godwit | M | 8(l), 9(m), 10–3(h), 4(m) | S |
| Bar-tailed Godwit | M | 8(l), 9–3(m), 4(l) | S |
| Eurasian Curlew | M | 8(l), 9(m), 10–3(h), 4(m) | S |
| Whimbrel | M | 8(m), 9–3(h), 4(m); some oversummer (not drafted) | S |
| Slaty-legged Crake, Coot, Stilt, Kentish, Little Ringed | R/M | all | S |

**Migrant plumage rule applied:** non-breeding is drafted first. Breeding is keyed only where it is commonly
seen on arrival or departure: Grey Plover, Greater and Siberian Sand-Plovers, and Black-tailed Godwit. For Kentish
and Little Ringed, the breeding key is the resident subspecies (*seebohmi*, *jerdoni*). For Common Ringed Plover,
Bar-tailed Godwit, Avocet, Oystercatcher, Curlew and Whimbrel, only the plumage seen here is drafted, with a blank key.

### 1g. Unknowns
| Species | unknown_traits | Reason |
|---|---|---|
| Alpine Swift | `month` | Code `R` conflicts with the seasonality text (non-breeding or passage visitor; the code is to be checked). Neither "all" nor a month list can be drafted without contradicting one of them. Needs the CBC list v3 status line and dated records. |
| Brown-backed Needletail | `month` | The wb calls it irregular and says "precise Sri Lankan months require further verification". It gives no months, and code `R` conflicts with "visitor". |
| Siberian Sand-Plover | `commonness` | After the 2023 split, Sri Lankan records may belong mostly to Tibetan Sand-Plover (the wb says this itself). Rating Siberian "common" could be wrong by a whole species. Needs the CBC list after the split, or eBird reviewer data. |

**No species has 2 or more unknown core questions** (commonness is not a core question). Every species has a
workbook length, so `size` is never unknown.

### 1h. Cut proposal (plate-11 / plate-12 boundary)
**Cut after plate-11: 33 species.** Every confusion group in plates 07–11 is complete inside the batch, or its
other member is already reviewed in batch 0.
- Plate-10 (plovers) must stay whole, because the ringed-plover and sand-plover groups both sit inside it. Cutting
  after plate-10 would give only 26 species.
- Plates 12 and 13 form the next tightly linked block: Tringa sandpipers (Redshank, Marsh, Greenshank, Green, Wood,
  Terek, plus Common Sandpiper from batch 0) and calidrids (Sanderling, Curlew Sandpiper, Little Stint). Wood vs
  Green vs Marsh vs Curlew Sandpiper must not be split across batches. Adding only plate-12 (40 species) would
  separate them from plate-13, so they belong together in **batch 3** (14 species, plus terns from plates 14–15).
- Cross-batch links that remain, to re-run when batch 3 lands:
  - small pale waders on sand (Kentish, Little Ringed, Common Ringed vs Sanderling and Little Stint): t99, t100,
    t101, t118;
  - godwits vs Common Redshank and Greenshank (weak): t109, t110;
  - Pin-tailed Snipe vs Wood and Green Sandpiper (weak): t106.

---

## 2. Per-species summary (33)

"Plumages" lists the plumages that matter in Sri Lanka, for the photo batch. "Sexes alike" means one colour set
with a blank key.

**1. Indian Swiftlet · කැදලි වැලිහිණියා · *Aerodramus unicolor*** — plate-07 · R · LC
- Zone MO (H h), WM (X m), WL (X l) · commonness MO C (X m), WM u, WL u (X l)
- Habitat open_country (H m), forest (X m) · Size XS (10–11, D h) · Behaviour aerial (D h) · Month all (S h)
- Colour (sexes alike): brown (D h), grey (D m)
- Plumages: adult in flight. Doubt: "endemic" wording. Hard group: `small-swifts`. Sensitive candidate (colonial
  cave nests). No site names are used in its rows.

**2. Alpine Swift · මහ වැලිහිණියා · *Tachymarptis melba*** — plate-07 · R · LC
- Zone MO, WM (H m), IN, DL (X l) · commonness MO u, WM u, IN s, DL s (all X l)
- Habitat open_country (D h) · Size M (20–22, D h), L (D l) · Behaviour aerial (D h) · **Month unknown**
- Colour (sexes alike): brown, white (D h)
- Plumages: adult. Hard group: `large-swifts`.

**3. Brown-backed Needletail · කටුපෙඳ වැලිහිණියා · *Hirundapus giganteus*** — plate-07 · R · LC
- Zone WM (H m), WL (X l) · commonness WM u (H m), WL s (X l)
- Habitat forest (D h), open_country (D m) · Size M (20–21, D h) · Behaviour aerial (D h) · **Month unknown**
- Colour (sexes alike): brown (D h), white (D m: pale rump. The white undertail horseshoe is not in the wb.)
- Plumages: adult. Hard group: `large-swifts`. Photo gap is likely.

**4. Little Swift · සුදුපිට වැලිහිණියා · *Apus affinis*** — plate-07 · R · LC
- Zone WL, IN, DL (H h), AR, WM (H m), MO (H l) · commonness WL, IN, DL, AR C (H m), WM C (X m), MO u (X l)
- Habitat town_garden (H h), open_country (D h), freshwater (H m) · Size S (12–13, D h) · Behaviour aerial · Month all
- Colour (sexes alike): black, white (D h), brown (D l)
- Plumages: adult. Hard group: `small-swifts`.

**5. Asian Palm-swift · තල් වැලිහිණියා · *Cypsiurus balasiensis*** — plate-07 · R · LC
- Zone WL, IN, DL (H h), AR (H m), WM (X m) · commonness WL, IN, DL, AR C (X m), WM u (X l)
- Habitat town_garden, open_country (H h), coast (H l) · Size S (~13, D h) · Behaviour aerial · Month all
- Colour (sexes alike): brown (D h) only
- Plumages: adult. Hard group: `small-swifts`.

**6. Crested Treeswift · රැක්වැලිහිණියා · *Hemiprocne coronata*** — plate-07 · R · LC
- Zone DL, IN (H h), AR (H m), WL (X l) · commonness DL C (X m), IN u, AR u (X m), WL s (X l)
- Habitat forest (H h), open_country (H m) · Size M (19–21, D h) · Behaviour perched_open (T h), aerial (D h) · Month all
- Colour ♂ grey, white (D m), rufous (X m: chestnut ear-coverts) · ♀ grey, white (D m)
- Plumages: male, female.

**7. Sri Lanka Swallow · බොරරතු වැහිලිහිණියා · *Cecropis hyperythra*** — plate-07 · **E** · LC
- Zone DL (H h), WM (H m), MO (H l), IN, WL (X m), AR (X l) · commonness DL, WM, IN, WL C (X m), MO u, AR u (X l)
- Habitat open_country, town_garden (D h) · Size S (13–14, D **m**) · Behaviour aerial (D h), perched_open (X m) · Month all
- Colour (sexes alike): rufous (D h), blue (D m), black (D m, by the glossy blue-black rule, as for Barn Swallow)
- Plumages: adult. Endemic: Sri Lankan photos only. Hard group: `swallows`. Doubts: length and head colour.

**8. Hill Swallow · කළු වැහිලිහිණියා · *Hirundo domicola*** — plate-07 · R · LC
- Zone MO, WM (H h) · commonness MO C, WM C (X m)
- Habitat open_country (H h), town_garden (D m) · Size S (13–14, D h) · Behaviour aerial (D h), perched_open (X m) · Month all
- Colour (sexes alike): black (D h), rufous (X m), grey (X m)
- Plumages: adult. Hard group: `swallows`. Doubt: plumage text.

**9. Watercock · මහ විල්කුකුළා · *Gallicrex cinerea*** — plate-08 · R · LC
- Zone WL, DL (H m), IN (X m), AR (X l) · commonness WL, DL, IN u (X m), AR s (X l)
- Habitat freshwater, open_country (D h) · Size XL (42–43, D h: male length; the female is smaller, with no wb value) · Behaviour wading (X m), ground (X l) · Month all
- Colour ♂ black, red (MF h), grey (D m) · ♀ brown (MF h). The non-breeding male looks like the female.
- Plumages: breeding male, female. Hard group: `dark-rails`.

**10. Common Moorhen · විල්කුකුළා · *Gallinula chloropus*** — plate-08 · R · LC
- Zone WL, IN, DL, AR (H h), WM (H m) · commonness WL, DL, AR C (X m), IN u (X m), WM u (X l)
- Habitat freshwater (D h), town_garden (D m) · Size XL (30–38, D h) · Behaviour swimming (T h), ground (T m) · Month all
- Colour adult grey, red, white (D h; "slate" mapped to grey, though users may say black) · juvenile brown (J h), white (J m)
- Plumages: adult, juvenile. Hard group: `dark-rails`.

**11. Slaty-legged Crake · දාර කොරවක්කා · *Rallina eurizonoides*** — plate-08 · R/M · LC
- Zone WL (H h), WM (H m) · commonness WL s (H m), WM s (X l)
- Habitat forest (D h) · Size L (25–28, D h) · Behaviour ground (D h) · Month all (S m)
- Colour (sexes alike): brown (D h), rufous (X m), grey (D l)
- Plumages: adult. Doubt: plumage and legs. Sensitive candidate (secretive, playback-sensitive). Photo gap is likely.

**12. Purple Swamphen · කිතුලා · *Porphyrio porphyrio*** — plate-08 · R · LC
- Zone WL, IN, DL, AR (H h) · commonness all 4 C (X m)
- Habitat freshwater (D h), open_country (D m) · Size XL, XXL (40–50, D h) · Behaviour wading (T m), swimming (X l) · Month all
- Colour adult purple (D h), blue (D m), red (D h) · juvenile brown (J h), grey (J m)
- Plumages: adult (the local grey-headed form), juvenile. Doubt: taxonomy (photos should show the grey-headed type).

**13. Eurasian Coot · ඇළ කිමිදුමා · *Fulica atra*** — plate-08 · R/M · LC
- Zone DL (H h), IN, AR (X m), WL (H l) · commonness DL u (X m), IN, AR u (X l), WL s (X l)
- Habitat freshwater (D h) · Size XL (36–39, D h) · Behaviour swimming (D h) · Month all (S h)
- Colour adult black, white (D h) · juvenile grey, brown (J m), white (J h)
- Plumages: adult. Hard group: `dark-rails`.

**14. Great Stone-curlew · මහ ගල්කිරලා · *Esacus recurvirostris*** — plate-08 · R · LC (working; see doubts)
- Zone AR (H h), DL (H m) · commonness AR u (X m), DL u (X l)
- Habitat coast (D h), open_country (D m), freshwater (X m) · Size XXL (53–59, D h) · Behaviour ground (T h) · Month all
- Colour (sexes alike): grey (D h), white (D m), yellow (D h). The black-and-white face is dropped by the cap.
- Plumages: adult. Hard group: `thick-knees`. Sensitive candidate. No site names are used in its rows.

**15. Indian Stone-curlew · ගල්කිරලා · *Burhinus indicus*** — plate-08 · R · NT
- Zone DL, AR (H h), IN (X m) · commonness DL u, AR u (X m), IN s (X l)
- Habitat open_country (D h), coast (D m) · Size XL (40–45, D h), XXL (D l) · Behaviour ground (T h; mostly nocturnal, and the vocabulary has no "night" value) · Month all
- Colour (sexes alike): brown, yellow (D h), white (X m)
- Plumages: adult. Hard group: `thick-knees`.

**16. Crab Plover · කකුළුඔලෙවියා · *Dromas ardeola*** — plate-09 · R (see doubts) · LC
- Zone AR (H h) · commonness AR u (X m)
- Habitat coast (H h) · Size XL (38–41, D h) · Behaviour wading (D m), ground (T m) · Months 8–4 (S; see 1a)
- Colour adult white, black (D h) · juvenile white (J h), grey (J m)
- Plumages: adult, immature. Hard group: `pied-waders`.

**17. Black-winged Stilt · කළු කිරලා · *Himantopus himantopus*** — plate-09 · R/M · LC
- Zone WL, DL, AR (H h), IN (X m) · commonness all 4 C (X m)
- Habitat freshwater, coast (D h), open_country (D m) · Size XL (33–36, D h) · Behaviour wading (T h) · Month all
- Colour (sexes alike): white, black, pink (D h). The female's browner back is in the note.
- Plumages: adult (male), female if available. Hard group: `pied-waders`.

**18. Pied Avocet · අවසැත්තා · *Recurvirostra avosetta*** — plate-09 · M · LC
- Zone AR (H m) · commonness AR s (H m)
- Habitat coast (H h), freshwater (D m) · Size XL (42–45, D h), XXL (D l) · Behaviour wading (D h) · Months 10–4 (S)
- Colour: black, white (D h)
- Plumages: adult. Hard group: `pied-waders`.

**19. Yellow-wattled Lapwing · කහතෙලි කිරලා · *Vanellus malabaricus*** — plate-09 · R · LC
- Zone DL, AR (H h), IN (X m) · commonness DL u, AR u (H m), IN s (X l)
- Habitat open_country (D h) · Size L (26–28, D h) · Behaviour ground (T h) · Month all
- Colour (sexes alike): brown, black, yellow (D h). The white belly is dropped by the cap.
- Plumages: adult. Hard group: `lapwings`.

**20. Eurasian Oystercatcher · මට්ටිකාවා · *Haematopus ostralegus*** — plate-09 · M · NT
- Zone AR (H m) · commonness AR s (H h: "very rare")
- Habitat coast (H h) · Size XL (D h), XXL (D m) (40–47) · Behaviour wading (D m), ground (T m) · Months 10–3 (S, all low)
- Colour: black, white, orange (D h)
- Plumages: non-breeding adult. Vagrant-level; a photo gap is acceptable. Hard group: `pied-waders`.

**21. Grey Plover · අළු මහඔලෙවියා · *Pluvialis squatarola*** — plate-10 · M · VU (working value; I cannot confirm it)
- Zone AR (H h), WL, DL (X l) · commonness AR C (H h), WL s, DL u (X l)
- Habitat coast (H h) · Size L (27–30, D h), XL (D l) · Behaviour ground (D m), wading (X m) · Months 8–5 (S)
- Colour non_breeding grey, white (D h), black (T m: axillaries in flight) · breeding black, white (D h), grey (D m)
- Plumages: non-breeding (first), breeding (Apr/May and Aug). Hard group: `grey-golden-plovers`.

**22. Common Ringed Plover · මහ වළලුඔලෙවියා · *Charadrius hiaticula*** — plate-10 · M · LC
- Zone AR (H h) · commonness AR u (H h)
- Habitat coast (H h) · Size M (17–19, D h) · Behaviour ground (D m) · Months 8–3 (S)
- Colour (as seen here): brown, white (D h), orange (T m)
- Plumages: non-breeding or first-winter. Hard group: `ringed-plovers`.

**23. Kentish Plover · බෝල ඔලෙවියා · *Anarhynchus alexandrinus*** — plate-10 · R/M · LC
- Zone AR (H h), DL (X l) · commonness AR C (X m), DL u (X l)
- Habitat coast (H h) · Size S (15–17, D h), M (D l) · Behaviour ground (D m) · Month all
- Colour breeding brown (D m), white (D h), black (MF h, male) · non_breeding brown (D m), white (D h)
- Plumages: breeding male (resident *seebohmi*), female, non-breeding. Hard group: `ringed-plovers`.

**24. Little Ringed Plover · මාඔලෙවියා · *Thinornis dubius*** — plate-10 · R/M · LC
- Zone DL (H h), AR, WL, IN (H m) · commonness DL, AR C (X m), WL, IN u (X m)
- Habitat freshwater (D h), open_country (D m), coast (H m) · Size S (14–17, D h), M (D l) · Behaviour ground (D m) · Month all
- Colour breeding brown, white, black (D h) · non_breeding brown, white (D h)
- Plumages: breeding (resident *jerdoni*), non-breeding (migrant *curonicus*). Hard group: `ringed-plovers`.

**25. Greater Sand-Plover · මහ වැලිඔලෙවියා · *Anarhynchus leschenaultii*** — plate-10 · M · LC
- Zone AR (H h), DL (X l) · commonness AR C (H h), DL u (X l)
- Habitat coast (H h) · Size L (22–25, D h) · Behaviour ground (D m), wading (X l) · Months 8–4 (S)
- Colour non_breeding brown, white (D h) · breeding rufous (D h), white, black (D/MF m)
- Plumages: non-breeding, breeding (Aug and Apr). Hard group: `sand-plovers`.

**26. Siberian Sand-Plover · තහවුරු කළ යුතුයි · *Anarhynchus mongolus*** — plate-10 · M · LC
- The Sinhala name is the "to be confirmed" placeholder. It is shown as-is (spec 006, Data). The plate-10 title has a
  Sinhala string, which I have **not** substituted. It is listed for the owner in section 5.
- Zone AR (H m) · **commonness unknown**
- Habitat coast (D h) · Size M (19–21, D h) · Behaviour ground (D m) · Months 8–4 (X)
- Colour non_breeding brown (D m), white (D h) · breeding rufous (D h), white, black (D/MF m)
- Plumages: non-breeding, breeding. Photos must be confirmed as *mongolus*/*stegmanni* and not Tibetan. A photo gap
  is likely. Hard group: `sand-plovers`.

**27. Greater Painted-snipe · මල්කැස්වටුවා · *Rostratula benghalensis*** — plate-11 · R · LC
- Zone WL (H h), AR (H m), DL (X m), IN (X l) · commonness WL u, DL u (X m), AR u, IN s (X l)
- Habitat freshwater, open_country (D h) · Size L (23–28, D h) · Behaviour wading (T m), ground (X m) · Month all
- Colour ♀ rufous (MF h), green (D m), white (MF h) · ♂ brown (MF h), white (D m)
- Plumages: female, male. Hard group: `snipes` (the male).

**28. Pheasant-tailed Jacana · බළල්සේරුවා · *Hydrophasianus chirurgus*** — plate-11 · R · LC
- Zone DL, AR (H h), WL (H m), IN (X m) · commonness DL, AR, IN C (X m), WL u (X m)
- Habitat freshwater (D h) · Size non_breeding L, XL (28–31, D h) · breeding XXL (W m) · Behaviour wading (T m), swimming (X l) · Month all
- Colour breeding black, white, yellow (D h) · non_breeding brown, white (D h), black (W m)
- Plumages: breeding, non-breeding.

**29. Pin-tailed Snipe · උල්පෙඳ කැස්වටුවා · *Gallinago stenura*** — plate-11 · M · LC
- Zone DL, AR (H h), WL (H m), IN (X m) · commonness DL, AR u (X m), WL, IN u (X l)
- Habitat freshwater, open_country (D h) · Size L (25–27, D h) · Behaviour wading (D m), ground (X m) · Months 9–5 (S; 5 low)
- Colour: brown (D h), white, black (D m)
- Plumages: adult. Common Snipe is not in this guide. Hard group: `snipes`.

**30. Black-tailed Godwit · පෙඳකළු මහවටුවා · *Limosa limosa*** — plate-11 · M · NT
- Zone AR (H h), DL (X l) · commonness AR C (X m), DL u (X l)
- Habitat coast (H h), freshwater (H m), open_country (H l) · Size XL (36–44, D h) · Behaviour wading (D h) · Months 8–4 (S)
- Colour non_breeding grey, white (D h), black (T m) · breeding rufous (D h), grey (X m), black (D m)
- Plumages: non-breeding, breeding (on arrival and departure). Hard group: `godwits`.

**31. Bar-tailed Godwit · රතු මහවටුවා · *Limosa lapponica*** — plate-11 · M · NT
- Zone AR (H h) · commonness AR s (X m)
- Habitat coast (H h) · Size XL (37–41, D h) · Behaviour wading (D h) · Months 8–4 (S)
- Colour (as seen here): brown, white (D h), grey (D m)
- Plumages: non-breeding. Hard group: `godwits`.

**32. Eurasian Curlew · මහ දැවැටුවා · *Numenius arquata*** — plate-11 · M · NT
- Zone AR (H h), DL (H m) · commonness AR u (H h), DL s (X l)
- Habitat coast (D h) · Size XXL (50–60, D h) · Behaviour wading (D h) · Months 8–4 (S)
- Colour: brown, white (D h)
- Plumages: adult (non-breeding). Hard group: `curlews`.

**33. Eurasian Whimbrel · දැවැටුවා · *Numenius phaeopus*** — plate-11 · M · LC
- Zone AR, DL (H h), WL (X m) · commonness AR C (H h), DL C (H m), WL u (X m)
- Habitat coast (D h) · Size XL (D h), XXL (D m) (40–46) · Behaviour wading (D h), ground (D m) · Months 8–4 (S)
- Colour: brown (D h), white (D m)
- Plumages: adult. Hard group: `curlews`.

---

## 3. Proposed ledger lines (add to `traits-batches.csv` only after owner approval)
`reviewed_by` and `reviewed_at` are placeholders.

```csv
slb-aerodramus-unicolor,2,,owner,YYYY-MM-DD,M8 batch 2
slb-tachymarptis-melba,2,month,owner,YYYY-MM-DD,M8 batch 2; month unknown: code R conflicts with seasonality text (visitor or passage)
slb-hirundapus-giganteus,2,month,owner,YYYY-MM-DD,M8 batch 2; month unknown: irregular and no months in workbook
slb-apus-affinis,2,,owner,YYYY-MM-DD,M8 batch 2
slb-cypsiurus-balasiensis,2,,owner,YYYY-MM-DD,M8 batch 2
slb-hemiprocne-coronata,2,,owner,YYYY-MM-DD,M8 batch 2
slb-cecropis-hyperythra,2,,owner,YYYY-MM-DD,M8 batch 2
slb-hirundo-domicola,2,,owner,YYYY-MM-DD,M8 batch 2
slb-gallicrex-cinerea,2,,owner,YYYY-MM-DD,M8 batch 2
slb-gallinula-chloropus,2,,owner,YYYY-MM-DD,M8 batch 2
slb-rallina-eurizonoides,2,,owner,YYYY-MM-DD,M8 batch 2
slb-porphyrio-porphyrio,2,,owner,YYYY-MM-DD,M8 batch 2
slb-fulica-atra,2,,owner,YYYY-MM-DD,M8 batch 2
slb-esacus-recurvirostris,2,,owner,YYYY-MM-DD,M8 batch 2
slb-burhinus-indicus,2,,owner,YYYY-MM-DD,M8 batch 2
slb-dromas-ardeola,2,,owner,YYYY-MM-DD,M8 batch 2
slb-himantopus-himantopus,2,,owner,YYYY-MM-DD,M8 batch 2
slb-recurvirostra-avosetta,2,,owner,YYYY-MM-DD,M8 batch 2
slb-vanellus-malabaricus,2,,owner,YYYY-MM-DD,M8 batch 2
slb-haematopus-ostralegus,2,,owner,YYYY-MM-DD,M8 batch 2
slb-pluvialis-squatarola,2,,owner,YYYY-MM-DD,M8 batch 2
slb-charadrius-hiaticula,2,,owner,YYYY-MM-DD,M8 batch 2
slb-anarhynchus-alexandrinus,2,,owner,YYYY-MM-DD,M8 batch 2
slb-thinornis-dubius,2,,owner,YYYY-MM-DD,M8 batch 2
slb-anarhynchus-leschenaultii,2,,owner,YYYY-MM-DD,M8 batch 2
slb-anarhynchus-mongolus,2,commonness,owner,YYYY-MM-DD,M8 batch 2; commonness unknown: post-split status in Sri Lanka unclear
slb-rostratula-benghalensis,2,,owner,YYYY-MM-DD,M8 batch 2
slb-hydrophasianus-chirurgus,2,,owner,YYYY-MM-DD,M8 batch 2
slb-gallinago-stenura,2,,owner,YYYY-MM-DD,M8 batch 2
slb-limosa-limosa,2,,owner,YYYY-MM-DD,M8 batch 2
slb-limosa-lapponica,2,,owner,YYYY-MM-DD,M8 batch 2
slb-numenius-arquata,2,,owner,YYYY-MM-DD,M8 batch 2
slb-numenius-phaeopus,2,,owner,YYYY-MM-DD,M8 batch 2
```

---

## 4. Draft test sightings for batch 2 (append to `id-test-sightings.csv` after approval)

There are 48 scenarios (t76–t123; t26–t75 are reserved by the unmerged batch 1). Every one of the 33 species is a
target at least once, and every hard-group member has at least one hard sighting. 10 are easy (blank
`hard_group`) and 38 are hard. 29 of 48 (60%) target a species rated common in at least one zone. That rating comes
from my own proposed commonness, so the check is partly circular until commonness is reviewed.

**Composition gap:** all 48 are `scenario_source=drafter`, so the spec's at-least-20% share from someone else is
**not met**. The owner or a guide should write about 10 to 12 more, with `scenario_source=other`, or `plates` if
they are written from plates or photos **before** reading `traits.csv`. Common targets are preferred: Little Swift,
Sri Lanka Swallow, Moorhen, Stilt, Little Ringed Plover, Whimbrel, Jacana.

```csv
sighting_id,month,zone,habitat,size,colours,behaviour,expected_species_id,demo,scenario_source,hard_group
t76,3,montane,open_country,XS,brown|grey,aerial,slb-aerodramus-unicolor,no,drafter,small-swifts
t77,7,wet_lowland,town_garden,S,black|white,aerial,slb-apus-affinis,no,drafter,small-swifts
t78,9,dry_lowland,town_garden,S,brown,aerial,slb-cypsiurus-balasiensis,no,drafter,small-swifts
t79,2,wet_midhill,open_country,M,brown|white,aerial,slb-tachymarptis-melba,no,drafter,large-swifts
t80,4,wet_lowland,forest,M,brown|white,aerial,slb-hirundapus-giganteus,no,drafter,large-swifts
t81,6,dry_lowland,forest,M,grey|white|rufous,perched_open,slb-hemiprocne-coronata,no,drafter,
t82,1,wet_midhill,town_garden,S,blue|rufous,aerial,slb-cecropis-hyperythra,no,drafter,swallows
t83,5,montane,open_country,S,black|rufous|grey,perched_open,slb-hirundo-domicola,no,drafter,swallows
t84,8,dry_lowland,open_country,S,rufous|black,aerial,slb-cecropis-hyperythra,no,drafter,swallows
t85,7,wet_lowland,open_country,XL,black|red,wading,slb-gallicrex-cinerea,no,drafter,dark-rails
t86,10,wet_lowland,freshwater,XL,grey|red|white,swimming,slb-gallinula-chloropus,no,drafter,dark-rails
t87,2,dry_lowland,freshwater,XL,black|white,swimming,slb-fulica-atra,no,drafter,dark-rails
t88,11,wet_lowland,forest,L,brown|rufous,ground,slb-rallina-eurizonoides,no,drafter,
t89,3,dry_lowland,freshwater,XL,purple|red,wading,slb-porphyrio-porphyrio,no,drafter,
t90,1,arid_coast_north,coast,XXL,grey|white|yellow,ground,slb-esacus-recurvirostris,no,drafter,thick-knees
t91,6,dry_lowland,open_country,XL,brown|yellow,ground,slb-burhinus-indicus,no,drafter,thick-knees
t92,12,arid_coast_north,coast,XL,white|black,wading,slb-dromas-ardeola,no,drafter,pied-waders
t93,8,wet_lowland,freshwater,XL,white|black|pink,wading,slb-himantopus-himantopus,no,drafter,
t94,1,arid_coast_north,coast,XL,black|white,wading,slb-recurvirostra-avosetta,no,drafter,pied-waders
t95,11,arid_coast_north,coast,XL,black|white|orange,wading,slb-haematopus-ostralegus,no,drafter,pied-waders
t96,4,dry_lowland,open_country,L,brown|black|yellow,ground,slb-vanellus-malabaricus,no,drafter,lapwings
t97,12,arid_coast_north,coast,L,grey|white,ground,slb-pluvialis-squatarola,no,drafter,grey-golden-plovers
t98,4,arid_coast_north,coast,L,black|white|grey,ground,slb-pluvialis-squatarola,no,drafter,grey-golden-plovers
t99,1,arid_coast_north,coast,M,brown|white|orange,ground,slb-charadrius-hiaticula,no,drafter,ringed-plovers
t100,6,dry_lowland,freshwater,S,brown|white|black,ground,slb-thinornis-dubius,no,drafter,ringed-plovers
t101,7,arid_coast_north,coast,S,brown|white|black,ground,slb-anarhynchus-alexandrinus,no,drafter,ringed-plovers
t102,12,arid_coast_north,coast,L,brown|white,ground,slb-anarhynchus-leschenaultii,no,drafter,sand-plovers
t103,1,arid_coast_north,coast,M,brown|white,ground,slb-anarhynchus-mongolus,no,drafter,sand-plovers
t104,9,arid_coast_north,coast,L,rufous|white|black,ground,slb-anarhynchus-leschenaultii,no,drafter,sand-plovers
t105,3,wet_lowland,freshwater,L,rufous|green|white,wading,slb-rostratula-benghalensis,no,drafter,snipes
t106,12,dry_lowland,open_country,L,brown|white|black,ground,slb-gallinago-stenura,no,drafter,snipes
t107,5,arid_coast_north,freshwater,XXL,black|white|yellow,wading,slb-hydrophasianus-chirurgus,no,drafter,
t108,11,dry_lowland,freshwater,L,brown|white|black,wading,slb-hydrophasianus-chirurgus,no,drafter,
t109,1,arid_coast_north,coast,XL,grey|white|black,wading,slb-limosa-limosa,no,drafter,godwits
t110,2,arid_coast_north,coast,XL,brown|white,wading,slb-limosa-lapponica,no,drafter,godwits
t111,12,arid_coast_north,coast,XXL,brown|white,wading,slb-numenius-arquata,no,drafter,curlews
t112,10,dry_lowland,coast,XL,brown|white,wading,slb-numenius-phaeopus,no,drafter,curlews
t113,7,wet_midhill,open_country,S,black|rufous,aerial,slb-hirundo-domicola,no,drafter,swallows
t114,2,intermediate,town_garden,S,black|white,aerial,slb-apus-affinis,no,drafter,
t115,12,wet_lowland,freshwater,XL,grey|red|white,ground,slb-gallinula-chloropus,no,drafter,dark-rails
t116,6,arid_coast_north,freshwater,XL,white|black|pink,wading,slb-himantopus-himantopus,no,drafter,pied-waders
t117,3,wet_lowland,freshwater,L,brown|white,ground,slb-rostratula-benghalensis,no,drafter,snipes
t118,2,intermediate,freshwater,S,brown|white,ground,slb-thinornis-dubius,no,drafter,ringed-plovers
t119,3,arid_coast_north,coast,XXL,brown|white,ground,slb-numenius-phaeopus,no,drafter,curlews
t120,9,dry_lowland,forest,M,grey|white,aerial,slb-hemiprocne-coronata,no,drafter,
t121,10,montane,forest,XS,brown,aerial,slb-aerodramus-unicolor,no,drafter,small-swifts
t122,8,arid_coast_north,open_country,L,brown|black|yellow,ground,slb-vanellus-malabaricus,no,drafter,
t123,1,arid_coast_north,freshwater,XL,purple|blue|red,wading,slb-porphyrio-porphyrio,no,drafter,
```

The scenarios I expect to be weakest:
- t79/t80: the two large swifts differ only by zone, and both have unknown months.
- t103: Siberian vs Greater Sand-Plover, separated by size alone.
- t99, t101, t118: the three ringed plovers share a palette.
- t110: Bar-tailed vs Black-tailed Godwit; brown vs grey is weak.
- t117: male Painted-snipe vs Pin-tailed Snipe.
- t92: Crab Plover vs Stilt and Avocet.

Scarce or vagrant targets, which are reported but not gated: t88, t94, t95, t110.

---

## 5. Workbook doubts (for `workbook-doubts.csv`). Nothing has been changed.

```csv
species_id,field,doubt,suggested_source
slb-aerodramus-unicolor,sri_lanka_distribution_and_hotspots,Says Endemic to Sri Lanka but code is R and the species also occurs in south-west India; also limited to highlands though I believe it forages widely over wet-zone hills and lowlands,CBC Sri Lanka Bird List v3 (2022); BirdLife species factsheet
slb-tachymarptis-melba,seasonality_months_seen,Text says usually non-breeding season or passage and asks for the R code to be checked; I believe a resident population breeds in the hills,CBC Sri Lanka Bird List v3 (2022); Warakagoda et al. 2012
slb-hirundapus-giganteus,sri_lanka_distribution_and_hotspots,Called an uncommon or irregular visitor with unverified months while code is R,CBC Sri Lanka Bird List v3 (2022); dated CBC records
slb-cecropis-hyperythra,species_description,Length 13-14 cm and smaller/shorter-tailed than Barn Swallow look wrong to me (low confidence); chestnut forehead and throat reads like Hill or Barn Swallow,Warakagoda et al. 2012; Rasmussen & Anderton 2012
slb-hirundo-domicola,species_description,Dark brown upperparts and pale underparts; I believe glossy blue-black upperparts with rufous forehead and throat and dusky grey-brown underparts,Warakagoda et al. 2012
slb-rallina-eurizonoides,species_description,Slate-grey head and underparts and pinkish-red legs; I believe chestnut head and breast with black-and-white barred belly and dark grey legs,Warakagoda et al. 2012; Rasmussen & Anderton 2012
slb-gallicrex-cinerea,species_description,Length 42-43 cm is the male; female is smaller and no female length is given,Warakagoda et al. 2012
slb-porphyrio-porphyrio,scientific_name,Sri Lankan birds are Grey-headed Swamphen P. poliocephalus in AviList and Clements; check the Taxonomy sheet,Workbook Taxonomy sheet; AviList 2026
slb-esacus-recurvirostris,iucn_category_working,Working value LC; I believe BirdLife lists Great Stone-curlew as Near Threatened,BirdLife DataZone factsheet
slb-dromas-ardeola,sri_lanka_occurrence_code,Code R but seasonality text says mainly a non-breeding visitor (Aug-Apr),CBC Sri Lanka Bird List v3 (2022)
slb-hydrophasianus-chirurgus,species_description,Non-breeding chestnut hindneck; I believe a dark neck stripe with only a trace of golden nape; no breeding length given,Warakagoda et al. 2012; Wikipedia Pheasant-tailed jacana
slb-anarhynchus-mongolus,sri_lanka_distribution_and_hotspots,After the 2023 split most Sri Lankan sand-plover records may be Tibetan (A. atrifrons); the guide may hold the wrong half of the split,CBC list update after the split; eBird Sri Lanka reviewers
slb-pluvialis-squatarola,iucn_category_working,Working value VU; I cannot confirm this from memory,BirdLife DataZone factsheet
```

**Sinhala and plate-title notes (shown as-is, not changed):**
- Plate-07 title "කඳු වැහිලිහිණියා" differs from Hill Swallow `names.si` "කළු වැහිලිහිණියා".
- Plate-08's English title is "Eurasian Stone-curlew", but the plate holds Indian Stone-curlew (*Burhinus
  indicus*). Its Sinhala title "යුරේසියානු ගල්කිරළා" uses ළ, while the species name "ගල්කිරලා" uses ල.
- Plate-10 title "සයිබීරියානු වැලි ඔලෙවියා" exists, while Siberian Sand-Plover `names.si` is "තහවුරු කළ යුතුයි". The
  plate title is a candidate for the owner. **Not substituted.**
- Plate-11 title "යුරේසියා විම්බ්‍රල්" differs from Whimbrel `names.si` "දැවැටුවා".

A native reviewer should say which forms are intended.

---

## 6. Sensitive-species candidates (for `sensitive-species.csv`). Owner decides.
| species_id | Reason | My recommendation |
|---|---|---|
| slb-aerodramus-unicolor | Colonial nests in caves and on cliffs; easily disturbed | consider (`obscure_location` for colonies only) |
| slb-esacus-recurvirostris | Ground-nester on open coasts and sandbars; few pairs; NT per my belief | consider |
| slb-rallina-eurizonoides | Secretive and scarce; sensitive to playback | consider |

No nest, roost or colony site is recorded anywhere in this batch. For these three, the CSV notes and this file name
no site finer than a zone or region. The tern and heron colony species named in the spec come in later batches.

---

## 7. Validator notes
- I could **not** run `npm run traits:review-sheet -- --batch 2` or `npm run validate:content` (no shell in this
  session). **`validate:content` will fail until the batch-2 sheet is generated**, because `traits-plan.csv` now
  plans batch 2 and `checkReviewSheets` requires `traits-review/batch-02.md`.
- I checked the rows by hand against `tools/content/traits.ts`:
  - vocabulary values;
  - plumage keys (`male`, `female`, `adult`, `juvenile`, `breeding`, `non_breeding`);
  - ≤ 3 colours per key;
  - no blank and named keys mixed for colour or size (the Jacana size is keyed on both rows);
  - no `all` mixed with months;
  - every commonness row has a zone row;
  - no duplicates;
  - no commas in notes.
- Batch 1 (PR #115) is not on `origin/main`. Its rows and plan lines will conflict textually with these appends at
  the end of `traits.csv` and `traits-plan.csv`. Merge one at a time and rebase, as the spec says.
