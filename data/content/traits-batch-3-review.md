# M8 traits batch 3: ornithologist summary for the owner (approved by the owner, 2026-11-27)

Status: **approved** by the owner on 2026-11-27. Spec: `docs/specs/006-scale-to-all-species.md`. Rows: `traits.csv`
(`review_status=proposed`). This hand-written summary comes before the generated `traits-review/batch-03.md`
(`npm run traits:review-sheet -- --batch 3`), which is the source of truth for row-level review.

Scope: plates `plate-12` to `plate-15` (Tringa sandpipers and Turnstone, calidrids, courser, pratincoles and
phalarope, gulls, terns), minus the 2 pilot species already reviewed in batch 0 (Common Sandpiper, Little Tern).
That leaves **27 species** and **489 proposed rows**: 417 trait rows plus 72 commonness rows. Workbook occurrence
codes and IUCN values are working values *pending verification*. Nothing here upgrades or changes them.

Key: zones WL wet_lowland, WM wet_midhill, MO montane, IN intermediate, DL dry_lowland, AR arid_coast_north.
Commonness: C common, u uncommon, s scarce. Sources: `D` species_description, `MF` male_female_identification,
`J` juvenile_immature_plumage, `T` field_spotting_tips, `H` sri_lanka_distribution_and_hotspots, `S`
seasonality_months_seen (all `workbook:`). `X` = `expert:ornithologist`. No `ext:` rows in this batch.
Confidence: h, m, l. "Si-prose" means the workbook text for that species is Sinhala only, so I read the values from
Sinhala: 7 species (all of plate-15).

---

## 1. Focus areas (read these first)

### 1a. Values that conflict with the workbook, or that I doubt
| Species | Issue | What I drafted |
|---|---|---|
| Lesser Crested Tern | Code `M`, but the seasonality text says records "across much of the year" and gives no month window. I believe non-breeding birds are present year-round, but "all" would contradict the code. | **month = unknown** (batch-1 rule: code vs text conflict with no usable months). |
| Whiskered Tern | Code `M`, but the Si-prose seasonality says aggregated records are year-round and that the seasonal classification "must be confirmed". The Si-prose description calls it common in inland wetlands. | **month = unknown**. Commonness from the wb description (AR, DL, IN common). |
| Small Pratincole | The wb says "dark throat bordered by a pale line in breeding plumage". I believe the throat is buffish, with a black loral stripe, and the bird shows black underwing coverts and a black tail band in flight. | grey (D m), white (D h), black (X m) with a note. |
| Oriental Pratincole | The wb says "dark chestnut throat bordered by black". I believe the throat is creamy-buff bordered by a black line, with an orange-buff breast and chestnut underwing coverts. | brown (D h), white, black (D m). No rufous. |
| Indian Courser | The wb gives only "sandy-buff upperparts, dark-and-white face, dark breast banding". I believe the adult has a rufous crown, a chestnut breast and a dark belly patch. | brown (D h), white (D m), rufous (X m). The black eye-stripe is dropped by the cap. |
| Saunders's Tern | The wb (Si) says scarce resident. I believe it is locally fairly common at its north-western breeding areas, but I cannot cite this. | AR s (S m), from the wb. Not logged as a doubt. |
| Curlew Sandpiper | The working IUCN value is VU. I cannot confirm this from memory. | No trait impact. Doubt logged. |
| Lesser Black-backed Gull | Split-sensitive: Sri Lankan birds are the *heuglini* type, which some lists treat as Heuglin's Gull. The `species_id` and names are not changed. | Rows drafted as normal. Photos must match the local form (spec 006). Doubt logged. |

### 1b. Expert-sourced rows (`expert:ornithologist`): 92 of 489
- **Commonness: 55 of 72 rows.** 17 come from the workbook, where its prose states abundance: Wood Sandpiper
  AR/DL/IN/WL ("common migrant throughout Sri Lanka"), Sanderling AR ("scarce migrant"), Curlew Sandpiper AR
  ("common migrant"), Little Stint AR ("common winter visitor"), Indian Courser AR ("localised"), Red-necked
  Phalarope AR ("scarce migrant", irregular), Pallas's Gull AR/WL ("scarce winter visitor", "occasional"),
  Whiskered Tern AR/DL/IN (Si: common in inland wetlands), Saunders's Tern AR (Si: scarce resident), Sooty Tern
  AR/WL (Si: seen less often from shore).
- **No commonness row is `ext:`**, for the same reason as in batches 1 and 2: I could not read a citable status
  text (Warakagoda et al. 2012, or the CBC list with abundance codes) in this session. Page references from you or a
  second reviewer would let me convert these rows.
- Zone (14): Redshank DL, WL; Greenshank WL, IN; Terek DL; Turnstone WL, DL; Curlew Sandpiper DL; Little Stint DL;
  Small Pratincole IN; Oriental Pratincole IN; Gull-billed Tern IN; Lesser Crested Tern WL, DL.
- Colour (13): Curlew Sandpiper breeding brown; Indian Courser rufous; Small Pratincole black; Lesser Black-backed
  Gull juvenile white and adult white; Pallas's Gull juvenile white; Roseate Tern non-breeding white and black;
  Saunders's Tern white and grey; Whiskered Tern non-breeding grey and breeding white; White-winged Tern
  non-breeding grey.
- Behaviour (10): Little Stint wading; Lesser Black-backed Gull ground; Pallas's Gull ground and aerial;
  Brown-headed Gull aerial and swimming; Great Crested, Roseate and Saunders's Terns aerial; White-winged Tern
  aerial. The wb often says only "catches fish", so the tern `aerial` rows are expert.
- **No `size` or `month` row is expert-sourced.** No expert row is `high`.

### 1c. Low-confidence rows: 65
These are mostly edge zones, edge migrant months, scarce-zone commonness, and size classes touched only by an exact
upper bound (Brown-headed Gull XXL at 46 cm, Sooty Tern XXL at 45 cm). Also low: Redshank month 9, Sanderling DL
zone, Small Pratincole coast, Little Stint wading, Brown-headed Gull swimming, Bridled Tern grey, Sooty Tern month
`all` (pelagic, so year-round presence is hard to confirm), and all Roseate Tern commonness.

### 1d. Endemics (0)
No endemic in this batch. **Split-sensitive taxon**: Lesser Black-backed Gull (*heuglini* type; spec 006 photo rule).

### 1e. Hard groups in this batch (for scenarios: top-10, with any member in the top 3)
| hard_group | Members | Why it is hard with our six questions |
|---|---|---|
| `grey-tringa` | Marsh Sandpiper, Common Greenshank | grey and white, wading, same habitats; L vs XL is the only handle (bill shape is not captured) |
| `brown-tringa` | Wood Sandpiper, Green Sandpiper, Common Sandpiper (batch 0) | brown and white, wading at fresh water; Wood and Green are M/L, Common is M; spotting and rump are not captured |
| `small-coastal-waders` | Sanderling, Little Stint, Curlew Sandpiper | grey and white on the coast; S vs M vs M/L, and black (Sanderling) or rufous (breeding Curlew Sandpiper) |
| `pratincoles` | Small Pratincole, Oriental Pratincole | aerial over fresh water and open ground; S/M grey vs L brown |
| `large-gulls` | Lesser Black-backed Gull, Pallas's Gull | XXL, coast; immatures are both brown and white; adult yellow vs black is the handle |
| `crested-terns` | Lesser Crested, Great Crested, Caspian | white and grey, aerial, coast; bill colour (orange, yellow, red) and XL vs XXL |
| `pale-terns` | Gull-billed, Roseate, Saunders's, Little Tern (batch 0) | white, grey and black, aerial; size and the red of breeding Roseate are the handles |
| `marsh-terns` | Whiskered Tern, White-winged Tern | identical L size and palette in both plumages; only months differ (Whiskered month unknown) |
| `dark-terns` | Bridled Tern, Sooty Tern | black above and white below, XL, at sea; the brow and collar are not captured |

### 1f. Migrant months (M and R/M)
| Species | Code | Months drafted | Source |
|---|---|---|---|
| Common Redshank | M | 9(l), 10(m), 11–3(h), 4(m) | S |
| Marsh Sandpiper | M | 8(l), 9(m), 10–3(h), 4(m) | S |
| Common Greenshank | M | 8(l), 9(m), 10–3(h), 4(m); "most months" in some checklists not drafted | S |
| Green Sandpiper | M | 8(m), 9(m), 10–3(h), 4(m) | S |
| Terek Sandpiper | M | 8(l), 9(m), 10–3(h), 4(m) | S |
| Wood Sandpiper | M | 8(m), 9–3(h), 4(m) | S |
| Ruddy Turnstone | M | 8(l), 9(m), 10–3(h), 4(m) | S |
| Sanderling | M | 8(l), 9(m), 10–3(h), 4(m), 5(l) | S |
| Curlew Sandpiper | M | 8(m), 9–3(h), 4(m), 5(l) | S |
| Little Stint | M | 8(m), 9–3(h), 4(m), 5(l) | S |
| Red-necked Phalarope | M | 10(l), 11–1(m), 2(l) | S |
| Lesser Black-backed Gull | M | 9(m), 10–3(h), 4(m) | S |
| Pallas's Gull | M | 10(l), 11–3(m), 4(l) | S |
| Brown-headed Gull | M | 10(m), 11–3(h), 4(m), 5(l); Jul–Aug records not drafted | S |
| Lesser Crested Tern | M | **unknown** (code vs text; no months) | — |
| Whiskered Tern | M | **unknown** (code vs text; text asks for confirmation) | — |
| White-winged Tern | M | 8–4(m), 5(l) | S |
| Gull-billed, Caspian, Roseate, Bridled, Sooty Terns | R/M | all (Sooty low) | S |

**Migrant plumage rule applied:** non-breeding is drafted first. Breeding is keyed only where I believe it is
commonly seen on arrival or departure: Ruddy Turnstone, Curlew Sandpiper, Brown-headed Gull, and both marsh terns.
These breeding rows are medium at most, because "commonly seen here" is my belief, not the wb's. For the two large
gulls, the immature (keyed `juvenile`, as the vocabulary has no `immature` key) and the adult are keyed. For the other
migrants, only the plumage seen here is drafted, with a blank key.

### 1g. Unknowns
| Species | unknown_traits | Reason |
|---|---|---|
| Lesser Crested Tern | `month` | Code `M` conflicts with "records across much of the year", and the wb gives no month window. "all" would contradict the code, and a winter list would contradict the text. Needs the CBC list v3 status line and dated records. |
| Whiskered Tern | `month` | Code `M`, while the Si-prose says aggregated records are year-round and the seasonal classification must be confirmed. No month window is given. Needs the CBC list v3 line and dated records. |

**No species has 2 or more unknown core questions** (commonness is not a core question). Every species has a
workbook length, so `size` is never unknown.

### 1h. Cut proposal (plate-15 / plate-16 boundary)
**Cut after plate-15: 27 species**, below the ~30–35 target. I recommend it anyway:
- Plates 12 and 13 stay together, as batch 2 asked (Wood vs Green vs Marsh vs Curlew Sandpiper are in this batch).
- The `pale-terns`, `crested-terns`, `marsh-terns` and `dark-terns` groups are whole. Lesser Crested Tern (plate-14)
  and Great Crested Tern (plate-15) straddle the plate line, so plate-15 must come with plate-14.
- Adding plate-16 would give **36** species. All 9 plate-16 species (flamingo, storks, ibises, spoonbill) **have no
  workbook length**, so each `size` row needs a cited `ext:` length. Their main confusion group (large white waders:
  Eurasian Spoonbill, Black-headed Ibis, Painted Stork, Asian Openbill) links to the egrets on plate-19. Plate-16
  therefore fits better at the start of batch 4 with the herons (plates 16–19).
- If you prefer 36 species, plate-16 can still be added here, but its 9 `size` rows would be unknown until cited.

Cross-batch links to re-run when this batch lands:
- batch 0: **t06** (Common Sandpiper; 12, DL, freshwater, M, brown|white, wading). Green and Wood Sandpiper now
  match the same answers. t06 is in the original-25 gate, so watch it. **t21** (Little Tern) vs Saunders's and
  Gull-billed (size should still separate them).
- batch 2: t99, t100, t101, t118 (small pale waders vs Sanderling and Little Stint); t109, t110 (godwits vs Redshank
  and Greenshank); t106 (Pin-tailed Snipe vs Wood and Green Sandpiper).
- Forward: none expected for plate-16+. Greenshank and Marsh Sandpiper vs the egrets is weak (different size and
  colour).

---

## 2. Per-species summary (27)

"Plumages" lists the plumages that matter in Sri Lanka, for the photo batch. "Sexes alike" means one colour set
with a blank key. For sensitive candidates, no site finer than a zone is named here or in the CSV notes.

**1. Common Redshank · පාදරතු සිලිබිල්ලා · *Tringa totanus*** — plate-12 · M · LC
- Zone AR (H h), DL (X m), WL (X l) · commonness AR C (X m), DL u (X m), WL s (X l)
- Habitat coast (D h), freshwater (D m) · Size L (~28, D h) · Behaviour wading (D h) · Months 9–4 (S)
- Colour (as seen here): brown (D m), white (T m: wing-bar), red (D h: legs)
- Plumages: non-breeding. Easy target.

**2. Marsh Sandpiper · වගුරු සිලිබිල්ලා · *Tringa stagnatilis*** — plate-12 · M · LC
- Zone AR, DL (H h), IN (H m), WL (H l) · commonness AR C (X m), DL u (X m), IN u, WL s (X l)
- Habitat freshwater (D h), coast (D m) · Size L (22–26, D h) · Behaviour wading (T h) · Months 8–4 (S)
- Colour (as seen here): grey, white (D h)
- Plumages: non-breeding. Hard group: `grey-tringa`.

**3. Common Greenshank · මහකොළ සිලිබිල්ලා · *Tringa nebularia*** — plate-12 · M · LC
- Zone AR, DL (H h), WL (X m), IN (X l) · commonness AR C, DL C (X m), WL u, IN u (X l)
- Habitat coast, freshwater (D h) · Size XL (30–35, D h) · Behaviour wading (D h) · Months 8–4 (S)
- Colour (as seen here): grey, white (D h)
- Plumages: non-breeding. Hard group: `grey-tringa`.

**4. Green Sandpiper · කොළ සිලිබිල්ලා · *Tringa ochropus*** — plate-12 · M · LC
- Zone DL (H h), AR, IN, WL (H m) · commonness DL u, AR u (X m), IN u, WL u (X l)
- Habitat freshwater (D h), open_country (H m) · Size M, L (20–24, D h) · Behaviour wading (D m) · Months 8–4 (S)
- Colour (sexes alike): brown, white (D h)
- Plumages: adult. Hard group: `brown-tringa`.

**5. Terek Sandpiper · අවසැත සිලිබිල්ලා · *Xenus cinereus*** — plate-12 · M · LC
- Zone AR (H h), DL (X l) · commonness AR u (X m), DL s (X l)
- Habitat coast (D h) · Size L (22–25, D h) · Behaviour wading (T m) · Months 8–4 (S)
- Colour: grey (D m), white (D h), orange (T h: legs)
- Plumages: non-breeding. Easy target (the upturned bill is not in the vocabulary).

**6. Wood Sandpiper · වන සිලිබිල්ලා · *Tringa glareola*** — plate-12 · M · LC
- Zone AR, DL (H h), IN, WL (H m), WM (H l) · commonness AR C, DL C (H h), IN C, WL C (H m), WM u (X l)
- Habitat freshwater, open_country (D h) · Size M, L (19–23, D h) · Behaviour wading (T h) · Months 8–4 (S)
- Colour (sexes alike): brown, white (D h)
- Plumages: adult. Hard group: `brown-tringa`.

**7. Ruddy Turnstone · කැටපෙරලන්නා · *Arenaria interpres*** — plate-12 · M · NT
- Zone AR (H h), WL, DL (X l) · commonness AR u (X m), WL s, DL s (X l)
- Habitat coast (D h) · Size L (22–24, D h) · Behaviour ground (D h) · Months 8–4 (S)
- Colour non_breeding brown, black, white (D h) · breeding rufous, black, white (D m)
- Plumages: non-breeding (first), breeding (Apr and Aug). Easy target.

**8. Sanderling · තහවුරු කළ යුතුයි · *Calidris alba*** — plate-13 · M · LC
- The Sinhala name is the "to be confirmed" placeholder. It is shown as-is (spec 006, Data). The plate-13 title
  offers no candidate. **Not substituted.**
- Zone AR (H h), DL (H l) · commonness AR s (H m), DL s (X l)
- Habitat coast (D h) · Size M (18–20, D h) · Behaviour ground (T h) · Months 8–5 (S)
- Colour (as seen here): grey, white (D h), black (D m)
- Plumages: non-breeding. Hard group: `small-coastal-waders`.

**9. Curlew Sandpiper · දැවැකෑ සිලිබිල්ලා · *Calidris ferruginea*** — plate-13 · M · VU (working; see doubts)
- Zone AR (H h), DL (X l) · commonness AR C (H h), DL u (X l)
- Habitat coast (H h) · Size M, L (18–23, D h) · Behaviour wading (T h) · Months 8–5 (S)
- Colour non_breeding grey, white (D h) · breeding rufous (D h), brown (X m), white (T m)
- Plumages: non-breeding (first), breeding (Apr–May and Aug). Hard group: `small-coastal-waders`.

**10. Little Stint · පුංචි සිලිබිල්ලා · *Calidris minuta*** — plate-13 · M · LC
- Zone AR (H h), DL (X m) · commonness AR C (H h), DL u (X m)
- Habitat coast (H h), freshwater (H m) · Size S (13–15, D h) · Behaviour ground (D m), wading (X l) · Months 8–5 (S)
- Colour (as seen here): grey, brown (D m), white (D h)
- Plumages: non-breeding. Hard group: `small-coastal-waders`.

**11. Indian Courser · වැලි කිරලා · *Cursorius coromandelicus*** — plate-13 · R · NT
- Zone DL, AR (H h) · commonness AR u (H m), DL s (X l)
- Habitat open_country (D h) · Size L (23–25, D h) · Behaviour ground (T h) · Month all (S h)
- Colour (sexes alike): brown (D h), white (D m), rufous (X m)
- Plumages: adult. Doubt: plumage text. Sensitive candidate (NT ground-nester, local).

**12. Small Pratincole · පුංචි ලිහිණිඔලෙවියා · *Glareola lactea*** — plate-13 · R · LC
- Zone DL (H h), AR (H m), IN (X m) · commonness DL u (X m), AR u, IN u (X l)
- Habitat freshwater (D h), coast (H l) · Size S, M (16–18, D h) · Behaviour aerial (T h), ground (T m) · Month all (S m)
- Colour (sexes alike): grey (D m), white (D h), black (X m)
- Plumages: adult (in flight and at rest). Doubt: throat. Hard group: `pratincoles`. Sensitive candidate (colonial
  sandbar nester).

**13. Oriental Pratincole · මහ ලිහිණිඔලෙවියා · *Glareola maldivarum*** — plate-13 · R · LC
- Zone DL, AR (H h), IN (X l) · commonness DL u, AR u (X m), IN s (X l)
- Habitat open_country (D h), freshwater (D m) · Size L (23–25, D h) · Behaviour aerial (D h), ground (D m) · Month all (S m)
- Colour (sexes alike): brown (D h), white, black (D m)
- Plumages: breeding adult, non-breeding. Doubt: throat. Hard group: `pratincoles`.

**14. Red-necked Phalarope · ගෙලරතු දියවටුවා · *Phalaropus lobatus*** — plate-13 · M · LC
- Zone AR (H h) · commonness AR s (H h)
- Habitat coast (D h) · Size M (17–19, D h) · Behaviour swimming (T h) · Months 10–2 (S)
- Colour (as seen here): grey, white (D h), black (D m)
- Plumages: non-breeding. Scarce; a photo gap is acceptable. Easy target.

**15. Lesser Black-backed Gull · පිටකළු මුහුදුකපුටා · *Larus fuscus*** — plate-14 · M · LC
- Zone AR (H h), WL (H m) · commonness AR u (X m), WL s (X l)
- Habitat coast (D h) · Size XXL (52–64, D h) · Behaviour aerial (T m), ground (X m) · Months 9–4 (S)
- Colour juvenile (immature) brown (J h), white (X m) · adult grey (D h), white (X m), yellow (D h)
- Plumages: immature (first), adult. Photos must be the *heuglini* type. Hard group: `large-gulls`.

**16. Pallas's Gull · හිසකළු මහමුහුදුකපුටා · *Ichthyaetus ichthyaetus*** — plate-14 · M · LC
- Zone AR (H h), WL (H l) · commonness AR s, WL s (H m)
- Habitat coast (D h) · Size XXL (D h), XXXL (D m) (55–72) · Behaviour ground, aerial (X m) · Months 10–4 (S)
- Colour juvenile (immature) brown (J h), white (X m) · adult white, grey (D h), black (D m: hood or ear patch)
- Plumages: immature (first), adult non-breeding, adult hooded (late winter). Hard group: `large-gulls`.

**17. Brown-headed Gull · හිසදුඹුරු මුහුදුකපුටා · *Chroicocephalus brunnicephalus*** — plate-14 · M · LC
- Zone AR (H h), DL (H m) · commonness AR C (X m), DL u (X m)
- Habitat coast (D h), freshwater (D m) · Size XL (D h), XXL (D l) (42–46) · Behaviour aerial (X m), swimming (X l) · Months 10–5 (S)
- Colour non_breeding white, grey, red (D h) · breeding brown, white, red (D m)
- Plumages: non-breeding (first), first-winter, breeding (Mar–Apr). Easy target.

**18. Gull-billed Tern · හිසකළු මුහුදුලිහිණියා · *Gelochelidon nilotica*** — plate-14 · R/M · LC
- Zone AR (H h), DL (H m), IN (X l) · commonness AR C, DL u (X m), IN u (X l)
- Habitat coast, freshwater (D h), open_country (T m) · Size XL (33–42, D h) · Behaviour aerial (T h) · Month all (S m)
- Colour (both plumages): white, grey, black (D h)
- Plumages: non-breeding (first), breeding. Hard group: `pale-terns`.

**19. Caspian Tern · රත්තුඩු මුහුදුලිහිණියා · *Hydroprogne caspia*** — plate-14 · R/M · LC
- Zone AR, DL (H h) · commonness AR u, DL u (X m)
- Habitat coast (D h), freshwater (D m) · Size XXL (47–56, D h) · Behaviour aerial (D h), ground (T m) · Month all (S m)
- Colour (both plumages): white, grey, red (D h)
- Plumages: non-breeding, breeding. Hard group: `crested-terns`.

**20. Lesser Crested Tern · කුඩා කොණ්ඩමුහුදුලිහිණියා · *Thalasseus bengalensis*** — plate-14 · M · LC
- Zone AR (H h), WL (X m), DL (X l) · commonness AR C, WL u (X m), DL u (X l)
- Habitat coast (D h) · Size XL (35–43, D h) · Behaviour aerial (D h) · **Month unknown**
- Colour (both plumages): white, grey, orange (D h)
- Plumages: non-breeding (first), breeding. Hard group: `crested-terns`.

**21. Great Crested Tern · මහ කොණ්ඩමුහුදුලිහිණියා · *Thalasseus bergii*** — plate-15 · R · LC · Si-prose
- Zone AR (H h), WL, DL (H m) · commonness AR C, WL C (X m), DL u (X l)
- Habitat coast (D h) · Size XXL (45–50, D h) · Behaviour aerial (X m) · Month all (S m)
- Colour (both plumages): white, grey, yellow (D h)
- Plumages: breeding, non-breeding. Hard group: `crested-terns`. Sensitive candidate (colony breeder).

**22. Roseate Tern · රෝස මුහුදුලිහිණියා · *Sterna dougallii*** — plate-15 · R/M · LC · Si-prose
- Zone AR (H h), DL (H m), WL (H l) · commonness AR u, DL s, WL s (all X l)
- Habitat coast (D h) · Size XL (33–38, D h) · Behaviour aerial (X m) · Month all (S m)
- Colour breeding white, black, red (D h) · non_breeding white, black (X m)
- Plumages: breeding, non-breeding. Hard group: `pale-terns`. Sensitive candidate (colony breeder).

**23. Saunders's Tern · දුඹුරුපා මුහුදුලිහිණියා · *Sternula saundersi*** — plate-15 · R · LC · Si-prose
- Zone AR (H h) · commonness AR s (S m)
- Habitat coast (D h) · Size L (22–25, D h) · Behaviour aerial (X m) · Month all (S m)
- Colour (keyed together): black (D h), white, grey (X m)
- Plumages: breeding adult. Separating it from Little Tern needs close views, so photo candidates must be
  identification-checked. Hard group: `pale-terns`. Sensitive candidate (colony breeder).

**24. Bridled Tern · බැමිදු මුහුදුලිහිණියා · *Onychoprion anaethetus*** — plate-15 · R/M · LC · Si-prose
- Zone AR (H h), WL (H m) · commonness AR u, WL u (X l)
- Habitat coast (D h) · Size XL (32–35, D h) · Behaviour aerial (D h) · Month all (S m)
- Colour (sexes alike): black (D m), white (D h), grey (D l)
- Plumages: adult. Hard group: `dark-terns`. Sensitive candidate (colony breeder).

**25. Sooty Tern · දැලි මුහුදුලිහිණියා · *Onychoprion fuscatus*** — plate-15 · R/M · LC · Si-prose
- Zone AR (H h), WL (H m) · commonness AR s, WL s (H m)
- Habitat coast (D h) · Size XL (D h), XXL (D l) (38–45) · Behaviour aerial (D h) · Month all (S **l**)
- Colour (sexes alike): black, white (D h)
- Plumages: adult. Pelagic; a photo gap is likely. Hard group: `dark-terns`. Sensitive candidate (colony breeder).

**26. Whiskered Tern · රැවුල් මුහුදුලිහිණියා · *Chlidonias hybrida*** — plate-15 · M · LC · Si-prose
- Zone AR, DL (H h), IN, WL (H m), WM (H l) · commonness AR, DL C (D h), IN C (D m), WL u (X m), WM s (X l)
- Habitat freshwater (D h), coast (D m) · Size L (23–27, D h) · Behaviour aerial (T h) · **Month unknown**
- Colour non_breeding white, black (D h), grey (X m) · breeding black, grey (D h), white (X m)
- Plumages: non-breeding (first), breeding. Hard group: `marsh-terns`.

**27. White-winged Tern · තටුසුදු මුහුදුලිහිණියා · *Chlidonias leucopterus*** — plate-15 · M · LC · Si-prose
- Zone AR (H h), DL (H m) · commonness AR u (X m), DL s (X l)
- Habitat freshwater (D h), coast (D m) · Size L (23–27, D h) · Behaviour aerial (X m) · Months 8–4 (m), 5 (l) (S)
- Colour non_breeding white (D h), black (D m), grey (X m) · breeding black, white, grey (D h)
- Plumages: non-breeding (first), breeding (passage). Hard group: `marsh-terns`.

---

## 3. Proposed ledger lines (add to `traits-batches.csv` only after owner approval)
`reviewed_by` and `reviewed_at` are placeholders.

```csv
slb-tringa-totanus,3,,owner,YYYY-MM-DD,M8 batch 3
slb-tringa-stagnatilis,3,,owner,YYYY-MM-DD,M8 batch 3
slb-tringa-nebularia,3,,owner,YYYY-MM-DD,M8 batch 3
slb-tringa-ochropus,3,,owner,YYYY-MM-DD,M8 batch 3
slb-xenus-cinereus,3,,owner,YYYY-MM-DD,M8 batch 3
slb-tringa-glareola,3,,owner,YYYY-MM-DD,M8 batch 3
slb-arenaria-interpres,3,,owner,YYYY-MM-DD,M8 batch 3
slb-calidris-alba,3,,owner,YYYY-MM-DD,M8 batch 3
slb-calidris-ferruginea,3,,owner,YYYY-MM-DD,M8 batch 3
slb-calidris-minuta,3,,owner,YYYY-MM-DD,M8 batch 3
slb-cursorius-coromandelicus,3,,owner,YYYY-MM-DD,M8 batch 3
slb-glareola-lactea,3,,owner,YYYY-MM-DD,M8 batch 3
slb-glareola-maldivarum,3,,owner,YYYY-MM-DD,M8 batch 3
slb-phalaropus-lobatus,3,,owner,YYYY-MM-DD,M8 batch 3
slb-larus-fuscus,3,,owner,YYYY-MM-DD,M8 batch 3
slb-ichthyaetus-ichthyaetus,3,,owner,YYYY-MM-DD,M8 batch 3
slb-chroicocephalus-brunnicephalus,3,,owner,YYYY-MM-DD,M8 batch 3
slb-gelochelidon-nilotica,3,,owner,YYYY-MM-DD,M8 batch 3
slb-hydroprogne-caspia,3,,owner,YYYY-MM-DD,M8 batch 3
slb-thalasseus-bengalensis,3,month,owner,YYYY-MM-DD,M8 batch 3; month unknown: code M conflicts with year-round records and no months in workbook
slb-thalasseus-bergii,3,,owner,YYYY-MM-DD,M8 batch 3
slb-sterna-dougallii,3,,owner,YYYY-MM-DD,M8 batch 3
slb-sternula-saundersi,3,,owner,YYYY-MM-DD,M8 batch 3
slb-onychoprion-anaethetus,3,,owner,YYYY-MM-DD,M8 batch 3
slb-onychoprion-fuscatus,3,,owner,YYYY-MM-DD,M8 batch 3
slb-chlidonias-hybrida,3,month,owner,YYYY-MM-DD,M8 batch 3; month unknown: code M conflicts with year-round records and workbook asks for confirmation
slb-chlidonias-leucopterus,3,,owner,YYYY-MM-DD,M8 batch 3
```

---

## 4. Draft test sightings for batch 3 (append to `id-test-sightings.csv` after approval)

There are 48 scenarios (t124–t171; t26–t123 are reserved by the unmerged batches 1 and 2). Every one of the 27
species is a target at least once, and every hard-group member has at least one hard sighting. 9 are easy (blank
`hard_group`) and 39 are hard. 29 of 48 (60%) target a species rated common in at least one zone. That rating comes
from my proposed commonness, so the check is partly circular until commonness is reviewed.

**Composition gap:** all 48 are `scenario_source=drafter`, so the spec's at-least-20% share from someone else is
**not met**. The owner or a guide should write about 10 to 12 more, with `scenario_source=other`, or `plates` if
they are written from plates or photos **before** reading `traits.csv`. Common targets are preferred: Wood
Sandpiper, Marsh Sandpiper, Greenshank, Little Stint, Curlew Sandpiper, Brown-headed Gull, Gull-billed Tern, Great
Crested Tern, Whiskered Tern.

```csv
sighting_id,month,zone,habitat,size,colours,behaviour,expected_species_id,demo,scenario_source,hard_group
t124,12,arid_coast_north,coast,L,brown|white|red,wading,slb-tringa-totanus,no,drafter,
t125,1,arid_coast_north,coast,L,grey|white,wading,slb-tringa-stagnatilis,no,drafter,grey-tringa
t126,2,dry_lowland,freshwater,XL,grey|white,wading,slb-tringa-nebularia,no,drafter,grey-tringa
t127,11,dry_lowland,freshwater,M,brown|white,wading,slb-tringa-ochropus,no,drafter,brown-tringa
t128,10,wet_lowland,open_country,M,brown|white,wading,slb-tringa-glareola,no,drafter,brown-tringa
t129,1,arid_coast_north,coast,L,grey|white|orange,wading,slb-xenus-cinereus,no,drafter,
t130,2,arid_coast_north,coast,L,brown|black|white,ground,slb-arenaria-interpres,no,drafter,
t131,12,arid_coast_north,coast,M,grey|white|black,ground,slb-calidris-alba,no,drafter,small-coastal-waders
t132,1,arid_coast_north,coast,M,grey|white,wading,slb-calidris-ferruginea,no,drafter,small-coastal-waders
t133,11,arid_coast_north,coast,S,grey|brown|white,ground,slb-calidris-minuta,no,drafter,small-coastal-waders
t134,4,arid_coast_north,coast,L,rufous|brown|white,wading,slb-calidris-ferruginea,no,drafter,small-coastal-waders
t135,7,dry_lowland,open_country,L,brown|rufous|white,ground,slb-cursorius-coromandelicus,no,drafter,
t136,6,dry_lowland,freshwater,S,grey|white|black,aerial,slb-glareola-lactea,no,drafter,pratincoles
t137,5,dry_lowland,open_country,L,brown|white|black,aerial,slb-glareola-maldivarum,no,drafter,pratincoles
t138,12,arid_coast_north,coast,M,grey|white|black,swimming,slb-phalaropus-lobatus,no,drafter,
t139,1,arid_coast_north,coast,XXL,brown|white,ground,slb-larus-fuscus,no,drafter,large-gulls
t140,2,arid_coast_north,coast,XXL,grey|white|yellow,ground,slb-larus-fuscus,no,drafter,large-gulls
t141,3,arid_coast_north,coast,XXL,white|grey|black,ground,slb-ichthyaetus-ichthyaetus,no,drafter,large-gulls
t142,12,arid_coast_north,coast,XL,white|grey|red,aerial,slb-chroicocephalus-brunnicephalus,no,drafter,
t143,9,arid_coast_north,coast,XL,white|grey|black,aerial,slb-gelochelidon-nilotica,no,drafter,pale-terns
t144,6,arid_coast_north,coast,XL,white|black|red,aerial,slb-sterna-dougallii,no,drafter,pale-terns
t145,6,arid_coast_north,coast,L,white|grey|black,aerial,slb-sternula-saundersi,no,drafter,pale-terns
t146,8,dry_lowland,coast,XXL,white|grey|red,aerial,slb-hydroprogne-caspia,no,drafter,crested-terns
t147,1,arid_coast_north,coast,XL,white|grey|orange,aerial,slb-thalasseus-bengalensis,no,drafter,crested-terns
t148,5,wet_lowland,coast,XXL,white|grey|yellow,aerial,slb-thalasseus-bergii,no,drafter,crested-terns
t149,9,wet_lowland,coast,XL,black|white|grey,aerial,slb-onychoprion-anaethetus,no,drafter,dark-terns
t150,10,wet_lowland,coast,XL,black|white,aerial,slb-onychoprion-fuscatus,no,drafter,dark-terns
t151,1,dry_lowland,freshwater,L,white|grey|black,aerial,slb-chlidonias-hybrida,no,drafter,marsh-terns
t152,11,arid_coast_north,freshwater,L,white|black|grey,aerial,slb-chlidonias-leucopterus,no,drafter,marsh-terns
t153,4,dry_lowland,freshwater,L,black|grey|white,aerial,slb-chlidonias-hybrida,no,drafter,marsh-terns
t154,5,arid_coast_north,coast,L,black|white|grey,aerial,slb-chlidonias-leucopterus,no,drafter,marsh-terns
t155,3,intermediate,open_country,M,brown|white,wading,slb-tringa-glareola,no,drafter,brown-tringa
t156,10,arid_coast_north,freshwater,L,grey|white,wading,slb-tringa-stagnatilis,no,drafter,grey-tringa
t157,12,wet_lowland,coast,XL,grey|white,wading,slb-tringa-nebularia,no,drafter,grey-tringa
t158,2,arid_coast_north,coast,S,grey|white,ground,slb-calidris-minuta,no,drafter,small-coastal-waders
t159,3,dry_lowland,coast,XL,white|grey|orange,aerial,slb-thalasseus-bengalensis,no,drafter,crested-terns
t160,7,arid_coast_north,freshwater,XL,white|grey|black,aerial,slb-gelochelidon-nilotica,no,drafter,pale-terns
t161,1,dry_lowland,coast,XL,white|grey|red,swimming,slb-chroicocephalus-brunnicephalus,no,drafter,
t162,3,arid_coast_north,coast,XL,brown|white|red,aerial,slb-chroicocephalus-brunnicephalus,no,drafter,
t163,2,dry_lowland,freshwater,L,brown|white|red,wading,slb-tringa-totanus,no,drafter,
t164,1,arid_coast_north,coast,XXL,grey|white|red,aerial,slb-hydroprogne-caspia,no,drafter,crested-terns
t165,8,arid_coast_north,coast,XXL,white|grey|yellow,aerial,slb-thalasseus-bergii,no,drafter,crested-terns
t166,1,dry_lowland,freshwater,L,brown|white,wading,slb-tringa-glareola,no,drafter,brown-tringa
t167,9,arid_coast_north,coast,L,white|grey|black,aerial,slb-chlidonias-hybrida,no,drafter,marsh-terns
t168,3,arid_coast_north,coast,L,grey|white,wading,slb-calidris-ferruginea,no,drafter,small-coastal-waders
t169,12,dry_lowland,freshwater,S,grey|brown|white,ground,slb-calidris-minuta,no,drafter,small-coastal-waders
t170,3,arid_coast_north,coast,XL,grey|white,wading,slb-tringa-nebularia,no,drafter,grey-tringa
t171,4,dry_lowland,freshwater,XL,white|grey|black,aerial,slb-gelochelidon-nilotica,no,drafter,pale-terns
```

The scenarios I expect to be weakest:
- t127, t128, t155, t166: Green vs Wood vs Common Sandpiper give identical answers apart from size; commonness
  decides the order. t06 (batch 0) has the same risk.
- t152, t154: White-winged vs Whiskered Tern. Same answers, and Whiskered has unknown months (neutral) and higher
  commonness.
- t145: Saunders's vs Little Tern (batch 0) and Gull-billed; size is the only handle.
- t125, t156, t168: Marsh Sandpiper vs Curlew Sandpiper and Terek (L, grey and white, wading on the coast).
- t139: immature Lesser Black-backed vs immature Pallas's Gull.
- t150: Sooty vs Bridled Tern (Bridled matches black and white too).

Scarce targets, which are reported but not gated: t131 (Sanderling), t138 (Phalarope), t141 (Pallas's Gull), t145
(Saunders's Tern), t150 (Sooty Tern).

---

## 5. Workbook doubts (for `workbook-doubts.csv`). Nothing has been changed.

```csv
species_id,field,doubt,suggested_source
slb-thalasseus-bengalensis,seasonality_months_seen,Code M but text says records across much of the year and gives no month window; I believe non-breeders are present year-round,CBC Sri Lanka Bird List v3 (2022); dated CBC records
slb-chlidonias-hybrida,seasonality_months_seen,Code M but text says aggregated records are year-round and asks for the seasonal classification to be confirmed,CBC Sri Lanka Bird List v3 (2022); dated CBC records
slb-glareola-lactea,species_description,Dark throat bordered by a pale line in breeding plumage; I believe a buffish throat with a black loral stripe plus black underwing coverts and tail band,Warakagoda et al. 2012; Rasmussen & Anderton 2012
slb-glareola-maldivarum,species_description,Dark chestnut throat bordered by black; I believe a creamy-buff throat bordered by a black line with an orange-buff breast and chestnut underwing coverts,Warakagoda et al. 2012; Rasmussen & Anderton 2012
slb-cursorius-coromandelicus,species_description,Omits the rufous crown and chestnut breast with dark belly patch that I believe are the adult's main colours,Warakagoda et al. 2012
slb-calidris-ferruginea,iucn_category_working,Working value VU; I cannot confirm this from memory,BirdLife DataZone factsheet
slb-larus-fuscus,scientific_name,Sri Lankan birds are the heuglini type which some lists treat as a separate species (Heuglin's Gull); check the Taxonomy sheet,Workbook Taxonomy sheet; AviList 2026
```

**Sinhala and plate-title notes (shown as-is, not changed):**
- Plate-12 title "රත් ගල්පෙරලියා" differs from Ruddy Turnstone `names.si` "කැටපෙරලන්නා".
- Plate-13 title "රතුගෙල පිහිනුම් සිලිබිල්ලා" differs from Red-necked Phalarope `names.si` "ගෙලරතු දියවටුවා".
- Plate-14 title "ලෙසර් ක්‍රෙස්ටඩ් මුහුදු වැහිලිහිණියා" (a transliteration) differs from Lesser Crested Tern `names.si`
  "කුඩා කොණ්ඩමුහුදුලිහිණියා".
- Plate-15 title "සුදුපියා කන්ගුල්-ලිහිණියා" differs from White-winged Tern `names.si` "තටුසුදු මුහුදුලිහිණියා".
- Sanderling `names.si` is "තහවුරු කළ යුතුයි". No plate title offers a candidate. **Not substituted.**

A native reviewer should say which forms are intended.

---

## 6. Sensitive-species candidates (for `sensitive-species.csv`). Owner decides.
| species_id | Reason | My recommendation |
|---|---|---|
| slb-thalasseus-bergii | Breeds colonially on small offshore sand islands; colonies easily disturbed | add (`obscure_location`) |
| slb-sterna-dougallii | Colonial breeder on the same kind of islands; small numbers | add |
| slb-sternula-saundersi | Small, scarce breeding population at few colonies | add |
| slb-onychoprion-anaethetus | Small breeding colonies (wb) | add |
| slb-onychoprion-fuscatus | Colonial breeder (wb) | add |
| slb-sternula-albifrons (batch 0) | Nests colonially on open beaches and sandbars | add (it is already reviewed, so this is a CSV-only change) |
| slb-cursorius-coromandelicus | NT; local ground-nester in dry open country | consider |
| slb-glareola-lactea | Colonial nester on exposed river sandbars | consider |

The spec seeds `sensitive-species.csv` with "tern and heron colony species", but no tern is in the CSV yet. The
workbook prose already shipped in `species-text.json` names colony locations for Great Crested, Roseate, Saunders's
and Sooty Terns (one Saunders's line mentions adults near nests). The same open question as batch 1: does the "no
site finer than zone" rule cover the displayed workbook prose too? I have kept site names out of this file's blocks
and the CSV notes for all eight species above.

---

## 7. Validator notes
- I could **not** run `npm ci`, `npm run traits:review-sheet -- --batch 3` or `npm run validate:content` (no shell
  in this session). **`validate:content` will fail until the batch-3 sheet is generated**, because
  `traits-plan.csv` now plans batch 3 and the review-sheet check requires `traits-review/batch-03.md`.
- I checked the rows by hand against `tools/content/traits.ts`:
  - vocabulary values;
  - plumage keys (`adult`, `juvenile`, `breeding`, `non_breeding`);
  - ≤ 3 colours per key;
  - no blank and named keys mixed for colour or size;
  - no `all` mixed with months;
  - every commonness row has a zone row, and every zone row has exactly one commonness row;
  - no duplicates;
  - no commas in notes (checked: no row has more than 8 fields).
- Batches 1 and 2 (PRs #115 and #121) are not on `origin/main`. Their rows and plan lines will conflict textually
  with these appends at the end of `traits.csv` and `traits-plan.csv`. Merge one at a time and rebase, as the spec
  says.
