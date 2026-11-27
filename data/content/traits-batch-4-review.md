# M8 traits batch 4: ornithologist summary for the owner (approved by the owner, 2026-11-27)

Status: **approved** by the owner on 2026-11-27. Spec: `docs/specs/006-scale-to-all-species.md`. Rows: `traits.csv`
(`review_status=proposed`). This hand-written summary comes before the generated `traits-review/batch-04.md`
(`npm run traits:review-sheet -- --batch 4`), which is the source of truth for row-level review.

Scope: plates `plate-16` to `plate-19` (flamingo, storks, ibises, spoonbill, pelican, cormorants, darter, bitterns,
night-heron, Little Heron, herons and egrets), minus the 4 pilot species already reviewed in batch 0 (Little
Cormorant, Indian Pond-heron, Western Reef-Heron, Eastern Cattle Egret). That leaves **23 species** and **429 proposed
rows**: 351 trait rows plus 78 commonness rows. Workbook occurrence codes and IUCN values are working values *pending
verification*. Nothing here upgrades or changes them.

Key: zones WL wet_lowland, WM wet_midhill, MO montane, IN intermediate, DL dry_lowland, AR arid_coast_north.
Commonness: C common, u uncommon, s scarce. Sources: `D` species_description, `MF` male_female_identification,
`J` juvenile_immature_plumage, `T` field_spotting_tips, `H` sri_lanka_distribution_and_hotspots, `S`
seasonality_months_seen (all `workbook:`). `X` = `expert:ornithologist`. `E` = `ext:` (cited in the row note with
its URL). Confidence: h, m, l. All 23 species have English prose; none is Sinhala-only.

---

## 1. Focus areas (read these first)

### 1a. Sizes from external references (`ext:`): 12 rows, 11 species
The workbook has **no length** for any of the 9 plate-16 species, nor for Great Cormorant or Indian Cormorant. Following
the spec (size never `expert:`) and the batch-2 Jacana precedent, each `size` row cites a published length with its
URL in the note. All are `medium` confidence. No size is unknown.

| Species | Class | Cited value | Source (`ext:` name, URL in the row) | Caveat |
|---|---|---|---|---|
| Greater Flamingo | XXXL | range length 80-150 cm | `ext:animaldiversity/Phoenicopterus_roseus` | Wikipedia gives 110-150 cm *tall*; class is the same either way |
| Painted Stork | XXXL | Length: 93-102 cm | `ext:oiseaux-birds/painted-stork` | Wikipedia and ADW give the same figures as *standing height* |
| Asian Openbill | XXXL | 81 cm long (68 cm tall) | `ext:wikipedia/Asian_openbill` | single figure, no range |
| Asian Woolly-necked Stork | XXXL | Length: 86-95 cm | `ext:oiseaux-birds/woolly-necked-stork` | page covers *C. episcopus* in the wide sense, including the African *microscelis* that is now split. Wikipedia gives 75-92 cm *tall*. |
| Black-headed Ibis | XXL, XXXL | 65-76 cm in length | `ext:wikipedia/Black-headed_ibis` | range spans the 70 cm boundary, so 2 rows |
| Glossy Ibis | XXL | 48-66 cm long | `ext:wikipedia/Glossy_ibis` | |
| Black-necked Stork | XXXL | 110-137 cm in length | `ext:animaldiversity/Ephippiorhynchus_asiaticus` | Wikipedia gives the same range as *height* |
| Lesser Adjutant | XXXL | length 87-93 cm | `ext:wikipedia/Lesser_adjutant` | |
| Eurasian Spoonbill | XXXL | 78-85 cm | `ext:kentwildlifetrust/european-spoonbill` | other web sources give 70-95 cm. All are ≥ 70 except a stray "70-80 cm". |
| Great Cormorant | XXXL | 70-102 cm | `ext:wikipedia/Great_cormorant` | worldwide range. The lower bound sits on the class edge, so confirm for the South Asian form. |
| Indian Cormorant | XXL | male 510-535 mm, female 475-510 mm | `ext:wikipedia/Indian_cormorant` | measurements table |

None of these is the regional field guide. **Warakagoda et al. 2012 or Rasmussen & Anderton 2012 page numbers would
let you upgrade all 12 rows**, and I could not read either book in this session. Only Great Cormorant (70 cm lower bound) and
Black-headed Ibis (65-76 cm) are near a class edge. Every other class would survive any published figure I saw.

### 1b. Values that conflict with the workbook, or that I doubt
| Species | Issue | What I drafted |
|---|---|---|
| Little Heron | The wb says "dark greenish-black above with rich chestnut sides and neck". This describes the American Green Heron. I believe Sri Lankan birds (the *javanica* group) have a grey neck and underparts. | grey (X m), black (D m), green (D m). No rufous. Doubt logged. |
| Little Heron | `names.si` "කඩොල් කොකා" is identical to Western Reef-Heron's `names.si` (batch 0). | Not changed. Doubt logged for a native reviewer. |
| Greater Flamingo | Code `M`, months "broadly Oct-Mar", "irregular". I believe non-breeding flocks stay through the south-west monsoon in some years, but I cannot cite this. | Months 10 (l), 11-2 (m), 3 (l), from the wb. Doubt logged. |
| Glossy Ibis | Code `M`, "regular migrant, broadly Oct-Apr". I believe breeding has been recorded in Sri Lanka and small numbers may stay all year, but I cannot cite this. | Months 10 (m), 11-3 (h), 4 (m), from the wb. Doubt logged. |
| Lesser Adjutant | The wb says "dark grey-brown plumage". In life I see the upperparts as glossy blackish. | grey (D m), not black. Doubt logged (minor). |
| IUCN values | From memory I expected higher categories for Painted Stork, Oriental Darter and Black-necked Stork. I checked the current Wikipedia infobox citations (BirdLife assessments from 2023 to 2025): Painted Stork LC, Darter LC, Black-necked Stork LC, Lesser Adjutant NT, Asian Woolly-necked Stork NT. They **match the workbook**. | No doubt logged. The values are still "working", pending the factsheet check. |

### 1c. Expert-sourced rows (`expert:ornithologist`): 102 of 429
- **Commonness: 64 of 78 rows.** 14 come from the workbook, where its prose states abundance: Asian Woolly-necked
  Stork DL/IN ("generally uncommon and local"), Black-necked Stork DL/AR ("scarce and local"), Lesser Adjutant DL
  ("uncommon and local"), Great Cormorant DL/AR ("less frequently encountered", "locally uncommon"), Indian Cormorant
  DL/AR/IN ("common at extensive freshwater wetlands and coastal lagoons"), Little Egret WL/IN/DL/AR ("common and
  widespread").
- **No commonness row is `ext:`**, as in batches 1-3: I could not read a citable status text (Warakagoda et al. 2012,
  or the CBC list with abundance codes) in this session.
- Zone (16): Painted Stork IN; Openbill WM; Glossy Ibis DL; Pelican IN; Indian Cormorant DL, AR, IN, WL (the wb
  names no region at all); Darter AR, IN; Cinnamon Bittern IN, WM; Yellow Bittern IN; Night-heron DL, IN; Grey Heron
  IN.
- Habitat (1): Cinnamon Bittern open_country (paddy; the wb says marshes and reedbeds only).
- Colour (10): Flamingo adult white; Glossy Ibis adult brown; Spoonbill juvenile white; Darter female black; Cinnamon
  Bittern female rufous; Yellow Bittern male black and female yellow; Black Bittern female white; Little Heron adult
  grey; Purple Heron juvenile rufous.
- Behaviour (11): Painted Stork aerial; Openbill ground, aerial; Woolly-necked ground; Adjutant wading, aerial; Great
  and Indian Cormorant perched_open; Yellow Bittern wading, aerial; Black Bittern wading.
- **No `size` or `month` row is expert-sourced.** No expert row is `high`.

### 1d. Low-confidence rows: 39
Mostly edge zones (Openbill WM, Cinnamon Bittern WM, Black Bittern WM, Darter WL, Indian Cormorant WL), scarce or
edge commonness, edge migrant months (Flamingo 10 and 3), "seen when flushed" `aerial` rows for the bitterns,
Indian Cormorant breeding white (a tiny ear tuft) and Painted Stork and Openbill `aerial` (soaring).

### 1e. Endemics (0)
No endemic in this batch. **Split-sensitive taxa for photos:** Asian Woolly-necked Stork (the African form is split, so
photos must be Asian *episcopus*) and Little Heron (the AviList *atricapilla* concept: photos must be South Asian birds,
not American Green Heron or a Striated Heron from elsewhere).

### 1f. Hard groups in this batch (for scenarios: top-10, with any member in the top 3)
| hard_group | Members | Why it is hard with our six questions |
|---|---|---|
| `white-egrets` | Little Egret, Medium Egret, Great Egret, Eastern Cattle Egret (b0), Western Reef-Heron white morph (b0) | All white, all wading. Little vs Medium share XXL and white/yellow/black, and Medium vs Great share XXXL with the same three colours. Bill and leg colour detail and gape line are not captured. The group is kept whole. |
| `large-white-waders` | Painted Stork, Asian Openbill, Black-headed Ibis, Eurasian Spoonbill | White with black, XXL/XXXL, wading. Pink (Painted Stork) and grey (Openbill) are the only colour handles. Bill shape is not captured. |
| `dark-storks` | Asian Woolly-necked Stork, Black-necked Stork, Lesser Adjutant | Black and white, XXXL, wetlands. Woolly-necked and Black-necked share black/white/red. Zone and commonness decide. |
| `cormorants` | Little Cormorant (b0), Indian Cormorant, Great Cormorant, Oriental Darter | Little and Indian are both XXL with identical breeding (black) and non-breeding (brown/white) palettes. Only commonness separates them. Great and Darter are XXXL. |
| `small-bitterns` | Cinnamon Bittern, Yellow Bittern | Both XL in the same marsh habitat. Females and juveniles are both brown. Rufous vs yellow/black only in males. |
| `stocky-herons` | Black-crowned Night-heron, Little Heron, Indian Pond-heron (b0) | Grey and black adults, brown/white streaky juveniles, XL/XXL, at the water's edge |
| `large-herons` | Grey Heron, Purple Heron | XXXL, wading, both grey. Rufous (Purple) and white/black (Grey) are the handles. |

Easy targets: Greater Flamingo (pink), Glossy Ibis (dark glossy), Spot-billed Pelican, Black Bittern (black and yellow).

### 1g. Migrant months (M and mixed codes)
| Species | Code | Months drafted | Source |
|---|---|---|---|
| Greater Flamingo | M | 10 (l), 11-2 (m), 3 (l) | S ("broadly Oct-Mar", irregular) |
| Glossy Ibis | M | 10 (m), 11-3 (h), 4 (m) | S ("broadly Oct-Apr") |
| Cinnamon Bittern | R+(M) | all (m) | S |
| Yellow Bittern | R+M | all (m) | S |
| Black Bittern | R+M | all (m) | S |
| all others | R | all | S |

**Migrant plumage rule applied:** Flamingo keys adult and juvenile, because immatures make up much of what is seen here
(my belief, based on the wb "pink develops over several years"). Glossy Ibis keys adult and juvenile. Breeding plumages
are keyed only where they change the colours a beginner picks: Spoonbill (yellow breast patch), Indian Cormorant
(black vs brown/white). The three white egrets use a blank key, because breeding adds only white plumes.

### 1h. Unknowns
**None.** Every species has a reviewed-source row for all six questions plus commonness. Size came from the workbook
for 12 species and from a cited `ext:` reference for the other 11 (see 1a). No species has 2 or more unknown core
questions.

### 1i. Cut (plate-19 / plate-20 boundary)
**Cut after plate-19: 23 species**, below the ~30-35 target. I recommend it:
- Plate 20 starts the raptors (sea-eagles, Crested Serpent-eagle, Rufous-bellied Eagle, harriers). Their confusion
  groups (large brown eagles, harriers, accipiters) run across plates 20 onwards. Taking a few plate-20 species here
  would split them, and the spec expects raptors to be one of the slowest batches.
- Plate-16 joins the herons, as batch 3 proposed. The `white-egrets` group (plate-19 plus the batch-0 Cattle Egret and
  Reef-Heron) and the `large-white-waders` group (plate-16) are both whole.
- Small bitterns, night-heron and Little Heron (plate-18) link to the batch-0 Pond-heron, and the cormorants
  (plate-17) link to the batch-0 Little Cormorant. Both groups stay whole.

Cross-batch links to re-run when this batch lands:
- **batch 0 (original-25 gate, watch closely):**
  - **t17** (Little Cormorant; 3, WL, freshwater, XXL, black, swimming). Indian Cormorant breeding now gives the same
    answers. Only commonness (Little WL common vs Indian WL uncommon) keeps Little first. **High risk.**
  - **t16** (Western Reef-Heron dark morph; 12, AR, coast, XXL, grey|white, wading). Adult Night-heron (grey/black/white,
    XXL, coast, wading, AR) and Little Heron (grey, XL/XXL, coast, wading, AR) now match closely. **High risk.**
  - t09 (Pond-heron breeding; rufous|white, XXL). Purple Heron (XXXL) and Cinnamon Bittern (XL) differ in size. Low risk.
  - t22 (Cattle Egret; white|orange, ground). Only Cattle Egret has orange. Low risk.
- batch 1: t37, t38 (Northern Pintail; brown/white, XXL, swimming, AR). Non-breeding and juvenile Indian Cormorant
  (brown|white, XXL, swimming, coast and fresh water, AR). Medium risk.
- batch 2: **t107** (Pheasant-tailed Jacana breeding; 5, AR, freshwater, XXL, black|white|yellow, wading). Little
  Egret and Medium Egret (white/black/yellow, XXL, wading, AR, common) and male Black Bittern (black/yellow/white, XXL)
  match all three colours. **High risk.** Also t111, t112 (curlews; brown|white, wading, coast): juvenile Little
  Heron, juvenile Night-heron and juvenile Glossy Ibis now share these answers. Medium risk. t116 (Black-winged Stilt;
  white|black|pink): Painted Stork differs in size (XXXL vs XL). Low risk.
- batch 3: none expected. Greenshank vs the egrets differs in size and colour.

If t17, t16 or t107 drop out of their gates, the fix belongs to the conditional slice 9 (weights or commonness
tie-breaks), not to the data.

---

## 2. Per-species summary (23)

"Plumages" lists the plumages that matter in Sri Lanka, for the photo batch. "Sexes alike" means one colour set
with a blank key. For sensitive species and candidates, no site finer than a zone is named here or in the CSV notes.

**1. Greater Flamingo · සියක්කාරයා · *Phoenicopterus roseus*** — plate-16 · M · LC
- Zone AR (H h) · commonness AR u (X m)
- Habitat coast (D h) · Size XXXL (E m) · Behaviour wading (D h) · Months 10 (l), 11-2 (m), 3 (l) (S)
- Colour adult pink, black (D h), white (X m) · juvenile grey, brown (J h), white (J m)
- Plumages: adult, immature. Easy target. Doubt: seasonality.

**2. Painted Stork · ඇලි මානාවා · *Mycteria leucocephala*** — plate-16 · R · LC
- Zone AR, DL (H h), IN (X m) · commonness AR C, DL C (X m), IN u (X l)
- Habitat freshwater (D h), coast (D m) · Size XXXL (E m) · Behaviour wading (T h), aerial (X l) · Month all (S h)
- Colour adult white, black, pink (D h) · juvenile brown, grey (J m)
- Plumages: adult, juvenile. Hard group: `large-white-waders`. Sensitive candidate (colonial nester).

**3. Asian Openbill · වෙල්ලිහිණි කොකා · *Anastomus oscitans*** — plate-16 · R · LC
- Zone WL, DL, AR (H h), IN (H m), WM (X l) · commonness WL, DL, AR, IN C (X m), WM u (X l)
- Habitat freshwater, open_country (D h) · Size XXXL (E m) · Behaviour wading (D h), ground (X m), aerial (X l) · Month all (S h)
- Colour adult white, grey (D h), black (T h) · juvenile brown, grey (J m)
- Plumages: adult, juvenile. Hard group: `large-white-waders`.

**4. Asian Woolly-necked Stork · පාදිලි මානාවා · *Ciconia episcopus*** — plate-16 · R · NT
- Zone DL, IN (H h) · commonness DL u (H h), IN u (H m)
- Habitat freshwater (D h), open_country (D m), forest (H m) · Size XXXL (E m) · Behaviour wading (D m), ground (X m) · Month all (S h)
- Colour adult black, white, red (D h) · juvenile brown, white (J m)
- Plumages: adult. Asian *episcopus* photos only. Hard group: `dark-storks`. Sensitive candidate (NT, scarce).

**5. Black-headed Ibis · සුදු දෑතුඩුවා · *Threskiornis melanocephalus*** — plate-16 · R · LC
- Zone WL, DL, AR (H h), IN (H m) · commonness WL, DL, AR C (X m), IN C (X l)
- Habitat freshwater, coast (D h), open_country (D m) · Size XXL, XXXL (E m) · Behaviour wading (D h) · Month all (S h)
- Colour adult white, black (D h) · juvenile white (D m), grey (J m)
- Plumages: adult, juvenile. Hard group: `large-white-waders`. Consider for the sensitive list (colonial nester).

**6. Glossy Ibis · සිළුටු දෑතුඩුවා · *Plegadis falcinellus*** — plate-16 · M · LC
- Zone AR (H h), DL (X l) · commonness AR u (X m), DL s (X l)
- Habitat freshwater (D h), open_country, coast (D m) · Size XXL (E m) · Behaviour wading (D h) · Months 10-4 (S)
- Colour adult black (T m), purple (D h), brown (X m) · juvenile brown (J h)
- Plumages: adult (non-breeding first), juvenile. Easy target. Doubt: code and months.

**7. Black-necked Stork · අලි මානාවා · *Ephippiorhynchus asiaticus*** — plate-16 · R · LC · **sensitive (listed)**
- Zone DL (H h), AR (H m) · commonness DL s, AR s (H h)
- Habitat freshwater (D h), open_country (D m) · Size XXXL (E m) · Behaviour wading (T h) · Month all (S h)
- Colour adult black, white, red (D h) · juvenile brown (J h)
- Plumages: adult male, adult female (iris only, so one colour set), juvenile. Hard group: `dark-storks`. Scarce target.

**8. Lesser Adjutant · නටු මානාවා · *Leptoptilos javanicus*** — plate-16 · R · NT · **sensitive (listed)**
- Zone DL (H h), AR (H m) · commonness DL u (H m), AR s (X l)
- Habitat freshwater, open_country (D h), forest (D m) · Size XXXL (E m) · Behaviour ground (T m), wading (X m), aerial (X l) · Month all (S m)
- Colour adult grey (D m), white (D h), yellow (D m) · juvenile brown (J m)
- Plumages: adult. Hard group: `dark-storks`. Doubt: plumage tone.

**9. Eurasian Spoonbill · හැඳිආලාවා · *Platalea leucorodia*** — plate-16 · R · LC
- Zone AR, DL (H h) · commonness AR u, DL u (X m)
- Habitat coast (H h), freshwater (D h) · Size XXXL (E m) · Behaviour wading (T h) · Month all (S m)
- Colour non_breeding white, black (D h) · breeding white, black (D h), yellow (D m) · juvenile white (X m), pink, black (J m)
- Plumages: non-breeding, breeding, juvenile (pink bill). Hard group: `large-white-waders`. Sensitive candidate
  (small breeding colonies).

**10. Spot-billed Pelican · අළු පැස්තුඩුවා · *Pelecanus philippensis*** — plate-17 · R · NT
- Zone DL, AR (H h), WL (H m), IN (X m) · commonness DL C, AR C (X m), WL u (X l), IN u (X m)
- Habitat freshwater (D h), coast (D m) · Size XXXL (D h, 125-150 cm) · Behaviour swimming (D m), aerial, tree_bush (H m) · Month all (S h)
- Colour adult white, grey (D h), black (D m) · juvenile brown, grey (J m)
- Plumages: adult, immature. Easy target. Sensitive candidate (NT colonial tree nester).

**11. Great Cormorant · මහ දියකාවා · *Phalacrocorax carbo*** — plate-17 · R · LC
- Zone DL (H h), AR (H m) · commonness DL u (H h), AR u (S m)
- Habitat freshwater (D h), coast (D m) · Size XXXL (E m) · Behaviour swimming (D h), perched_open (X m) · Month all (S h)
- Colour adult black (D h), white (D m) · juvenile brown, white (J h)
- Plumages: adult (breeding white patches), juvenile. Hard group: `cormorants`.

**12. Indian Cormorant · දාර දියකාවා · *Phalacrocorax fuscicollis*** — plate-17 · R · LC
- Zone DL, AR, IN (X m), WL (X l). The wb names no region. · commonness DL C (H h), AR C, IN C (H m), WL u (X l)
- Habitat freshwater, coast (H h) · Size XXL (E m) · Behaviour swimming (D h), perched_open (X m) · Month all (S h)
- Colour breeding black (D h), white (D l) · non_breeding brown (D h), white (D m) · juvenile brown (J h), white (J m)
- Plumages: breeding, non-breeding. Hard group: `cormorants` (identical answers to Little Cormorant; see t17).

**13. Oriental Darter · හංකාවා · *Anhinga melanogaster*** — plate-17 · R · LC
- Zone DL (H h), WL (H l), AR, IN (X m) · commonness DL C (X m), WL u (X l), AR u (X m), IN u (X l)
- Habitat freshwater (H h), coast (H m) · Size XXXL (D h, 85-97 cm) · Behaviour swimming, perched_open (T h) · Month all (S h)
- Colour male black, white, brown (D h) · female brown (MF h), white (D m), black (X m) · juvenile brown (J h)
- Plumages: male, female. Hard group: `cormorants`. Sensitive candidate (nests in mixed heronries).

**14. Cinnamon Bittern · තඹල මැටි කොකා · *Botaurus cinnamomeus*** — plate-18 · R+(M) · LC
- Zone WL, AR (H h), DL (H m), IN (X m), WM (X l) · commonness WL u, AR u (X m), DL u, IN u, WM s (X l)
- Habitat freshwater (D h), open_country (X m) · Size XL (D h, ~38 cm) · Behaviour wading (T m), tree_bush, aerial (T l) · Month all (S m)
- Colour male rufous (D h), brown (D m) · female brown (MF h), rufous (X m) · juvenile brown (J h)
- Plumages: male, female. Hard group: `small-bitterns`.

**15. Yellow Bittern · කහ මැටි කොකා · *Botaurus sinensis*** — plate-18 · R+M · LC
- Zone WL, AR (H h), DL (H m), IN (X m) · commonness WL, AR, DL u (X m), IN u (X l)
- Habitat freshwater (D h), open_country (D m) · Size XL (D h, ~38 cm) · Behaviour tree_bush (T m), wading (X m), aerial (X l) · Month all (S m)
- Colour male yellow, brown (MF m), black (X m) · female brown (MF h), yellow (X m) · juvenile brown (J h)
- Plumages: male, female (juvenile optional). Hard group: `small-bitterns`.

**16. Black-crowned Night-heron · රෑ කොකා · *Nycticorax nycticorax*** — plate-18 · R · LC
- Zone AR, WL (H h), DL (X m), IN (X l) · commonness AR, WL, DL u (X m), IN u (X l)
- Habitat freshwater (H h), coast (H m) · Size XXL (D h, 58-65 cm) · Behaviour tree_bush (D h), wading (T m) · Month all (S h)
- Colour adult grey, black (D h), white (D m) · juvenile brown (J h), white (J m)
- Plumages: adult, juvenile. Hard group: `stocky-herons`. Consider for the sensitive list (day roosts and colonies).
  Roost sites in the wb are not repeated here.

**17. Black Bittern · කළු මැටි කොකා · *Botaurus flavicollis*** — plate-18 · R+M · LC
- Zone WL, AR (H h), DL (H m), WM (H l) · commonness WL u (X l), AR s, DL s, WM s (X l)
- Habitat freshwater (D h), forest, coast (D m) · Size XXL (D h, 58-66 cm) · Behaviour tree_bush (T m), wading (X m), aerial (T l) · Month all (S m)
- Colour male black, yellow (D h), white (D m) · female brown, yellow (MF h), white (X m) · juvenile brown (J h)
- Plumages: male, female. Easy target. Photo gap likely (secretive).

**18. Little Heron · කඩොල් කොකා · *Butorides atricapilla*** — plate-18 · R · LC
- Zone WL, AR, DL (H m), IN (H l) · commonness WL, AR, DL u (X m), IN u (X l)
- Habitat coast (H h), freshwater (D h) · Size XL, XXL (D h, 40-48 cm) · Behaviour perched_open (T h), wading (T m) · Month all (S h)
- Colour adult grey (X m), black, green (D m) · juvenile brown (J h), white (J m)
- Plumages: adult, juvenile. South Asian photos only (see 1e). Hard group: `stocky-herons`. Doubts: description and
  Sinhala name.

**19. Grey Heron · කළු කොකා · *Ardea cinerea*** — plate-19 · R · LC
- Zone DL, AR (H h), WL (H m), IN (X m) · commonness DL C, AR C (X m), WL u (X m), IN u (X l)
- Habitat freshwater, coast (D h), open_country (D m) · Size XXXL (D h, 90-98 cm) · Behaviour wading (T h), aerial (T m) · Month all (S h)
- Colour adult grey, white, black (D h) · juvenile grey (J h), brown (J m)
- Plumages: adult, juvenile. Hard group: `large-herons`.

**20. Purple Heron · කරවල් කොකා · *Ardea purpurea*** — plate-19 · R · LC
- Zone AR, DL (H h), WL, IN (H m) · commonness AR, DL, WL C (X m), IN u (X l)
- Habitat freshwater (D h), open_country, coast (D m) · Size XXXL (D h, 78-90 cm) · Behaviour wading (T h) · Month all (S h)
- Colour adult rufous, grey (D h), purple (D m) · juvenile brown (J h), rufous (X m)
- Plumages: adult, juvenile. Hard group: `large-herons`.

**21. Little Egret · පුංචි සුදු කොකා · *Egretta garzetta*** — plate-19 · R · LC
- Zone WL, IN, DL, AR (H m) · commonness all four C (H h)
- Habitat freshwater, coast, open_country (D h), town_garden (H m) · Size XXL (D h, 55-65 cm) · Behaviour wading (D h) · Month all (S h)
- Colour (sexes alike): white, black, yellow (D h)
- Plumages: non-breeding, breeding (nape plumes). Hard group: `white-egrets`.

**22. Medium Egret · මැදි සුදු කොකා · *Ardea intermedia*** — plate-19 · R · LC
- Zone WL, IN, DL, AR (H m) · commonness all four C (X m)
- Habitat freshwater, open_country (D h), coast (D m) · Size XXL (D h), XXXL (D m) (65-72 cm) · Behaviour wading (D h) · Month all (S h)
- Colour (sexes alike): white, yellow, black (D h)
- Plumages: non-breeding, breeding. Hard group: `white-egrets`.

**23. Great Egret · මහ සුදු කොකා · *Ardea alba*** — plate-19 · R · LC
- Zone AR, DL (H h), WL, IN (H m) · commonness all four C (X m)
- Habitat freshwater, coast (D h), open_country (D m) · Size XXXL (D h, 80-104 cm) · Behaviour wading (D h) · Month all (S h)
- Colour (sexes alike): white, yellow, black (D h)
- Plumages: non-breeding, breeding. Hard group: `white-egrets`. I believe Sri Lankan birds are the Asian *modesta*
  form, which some lists split as Eastern Great Egret. If so, photos should match it. Check the workbook Taxonomy
  sheet. The `species_id` and names are not changed.

---

## 3. Proposed ledger lines (add to `traits-batches.csv` only after owner approval)
`reviewed_by` and `reviewed_at` are placeholders. No species has unknown traits.

```csv
slb-phoenicopterus-roseus,4,,owner,YYYY-MM-DD,M8 batch 4; size from ext source
slb-mycteria-leucocephala,4,,owner,YYYY-MM-DD,M8 batch 4; size from ext source
slb-anastomus-oscitans,4,,owner,YYYY-MM-DD,M8 batch 4; size from ext source
slb-ciconia-episcopus,4,,owner,YYYY-MM-DD,M8 batch 4; size from ext source
slb-threskiornis-melanocephalus,4,,owner,YYYY-MM-DD,M8 batch 4; size from ext source
slb-plegadis-falcinellus,4,,owner,YYYY-MM-DD,M8 batch 4; size from ext source
slb-ephippiorhynchus-asiaticus,4,,owner,YYYY-MM-DD,M8 batch 4; size from ext source
slb-leptoptilos-javanicus,4,,owner,YYYY-MM-DD,M8 batch 4; size from ext source
slb-platalea-leucorodia,4,,owner,YYYY-MM-DD,M8 batch 4; size from ext source
slb-pelecanus-philippensis,4,,owner,YYYY-MM-DD,M8 batch 4
slb-phalacrocorax-carbo,4,,owner,YYYY-MM-DD,M8 batch 4; size from ext source
slb-phalacrocorax-fuscicollis,4,,owner,YYYY-MM-DD,M8 batch 4; size from ext source
slb-anhinga-melanogaster,4,,owner,YYYY-MM-DD,M8 batch 4
slb-botaurus-cinnamomeus,4,,owner,YYYY-MM-DD,M8 batch 4
slb-botaurus-sinensis,4,,owner,YYYY-MM-DD,M8 batch 4
slb-nycticorax-nycticorax,4,,owner,YYYY-MM-DD,M8 batch 4
slb-botaurus-flavicollis,4,,owner,YYYY-MM-DD,M8 batch 4
slb-butorides-atricapilla,4,,owner,YYYY-MM-DD,M8 batch 4
slb-ardea-cinerea,4,,owner,YYYY-MM-DD,M8 batch 4
slb-ardea-purpurea,4,,owner,YYYY-MM-DD,M8 batch 4
slb-egretta-garzetta,4,,owner,YYYY-MM-DD,M8 batch 4
slb-ardea-intermedia,4,,owner,YYYY-MM-DD,M8 batch 4
slb-ardea-alba,4,,owner,YYYY-MM-DD,M8 batch 4
```

---

## 4. Draft test sightings for batch 4 (append to `id-test-sightings.csv` after approval)

There are 53 scenarios (**t172-t224**; t26-t171 are reserved by the unmerged batches 1-3). Every one of the 23
species is a target at least once. Every hard-group member has at least one sighting with its `hard_group`, including
the 4 batch-0 members (t188, t196, t204, t205), so each lookalike has its own sighting. 7 are easy (blank `hard_group`)
and 46 are hard.

Composition:
- **Common share:** 32 of 53 (60.4%) target a species rated common in at least one zone. Without the 4 batch-0
  targets it is 29 of 49 (59.2%), just under 60%. These ratings come from my proposed commonness, so the check is
  partly circular until commonness is reviewed.
- **`scenario_source` gap:** all 53 are `scenario_source=drafter`, so the spec's at-least-20% share from someone else
  is **not met**. The owner or a guide should write about 11 to 14 more, with `scenario_source=other`, or `plates` if
  written from plates or photos **before** reading `traits.csv`. Prefer common targets: Little, Medium and Great
  Egret, Indian Cormorant, Grey and Purple Heron, Openbill, Black-headed Ibis, Painted Stork. That would also lift the
  common share above 60%.

```csv
sighting_id,month,zone,habitat,size,colours,behaviour,expected_species_id,demo,scenario_source,hard_group
t172,1,arid_coast_north,coast,XXXL,pink|black|white,wading,slb-phoenicopterus-roseus,no,drafter,
t173,12,arid_coast_north,coast,XXXL,grey|brown|white,wading,slb-phoenicopterus-roseus,no,drafter,
t174,3,dry_lowland,freshwater,XXXL,white|black|pink,wading,slb-mycteria-leucocephala,no,drafter,large-white-waders
t175,8,wet_lowland,open_country,XXXL,white|grey|black,wading,slb-anastomus-oscitans,no,drafter,large-white-waders
t176,6,dry_lowland,freshwater,XXXL,black|white|red,wading,slb-ciconia-episcopus,no,drafter,dark-storks
t177,2,wet_lowland,freshwater,XXL,white|black,wading,slb-threskiornis-melanocephalus,no,drafter,large-white-waders
t178,1,arid_coast_north,freshwater,XXL,black|purple|brown,wading,slb-plegadis-falcinellus,no,drafter,
t179,7,dry_lowland,freshwater,XXXL,black|white|red,wading,slb-ephippiorhynchus-asiaticus,no,drafter,dark-storks
t180,9,dry_lowland,open_country,XXXL,grey|white|yellow,ground,slb-leptoptilos-javanicus,no,drafter,dark-storks
t181,2,arid_coast_north,coast,XXXL,white|black,wading,slb-platalea-leucorodia,no,drafter,large-white-waders
t182,4,dry_lowland,freshwater,XXXL,white|grey|black,swimming,slb-pelecanus-philippensis,no,drafter,
t183,10,dry_lowland,freshwater,XXXL,black|white,swimming,slb-phalacrocorax-carbo,no,drafter,cormorants
t184,1,dry_lowland,freshwater,XXL,black,swimming,slb-phalacrocorax-fuscicollis,no,drafter,cormorants
t185,11,arid_coast_north,coast,XXL,brown|white,swimming,slb-phalacrocorax-fuscicollis,no,drafter,cormorants
t186,3,dry_lowland,freshwater,XXXL,black|white|brown,swimming,slb-anhinga-melanogaster,no,drafter,cormorants
t187,5,dry_lowland,freshwater,XXXL,brown|white|black,perched_open,slb-anhinga-melanogaster,no,drafter,cormorants
t188,6,wet_lowland,freshwater,XXL,black,perched_open,slb-microcarbo-niger,no,drafter,cormorants
t189,8,wet_lowland,freshwater,XL,rufous|brown,wading,slb-botaurus-cinnamomeus,no,drafter,small-bitterns
t190,1,wet_lowland,freshwater,XL,yellow|brown|black,tree_bush,slb-botaurus-sinensis,no,drafter,small-bitterns
t191,10,arid_coast_north,freshwater,XL,brown|rufous,wading,slb-botaurus-cinnamomeus,no,drafter,small-bitterns
t192,2,wet_lowland,freshwater,XXL,grey|black|white,tree_bush,slb-nycticorax-nycticorax,no,drafter,stocky-herons
t193,7,arid_coast_north,coast,XXL,brown|white,wading,slb-nycticorax-nycticorax,no,drafter,stocky-herons
t194,12,wet_lowland,freshwater,XXL,black|yellow|white,wading,slb-botaurus-flavicollis,no,drafter,
t195,4,arid_coast_north,coast,XL,grey|black|green,perched_open,slb-butorides-atricapilla,no,drafter,stocky-herons
t196,9,wet_lowland,freshwater,XXL,brown|white,wading,slb-ardeola-grayii,no,drafter,stocky-herons
t197,1,dry_lowland,freshwater,XXXL,grey|white|black,wading,slb-ardea-cinerea,no,drafter,large-herons
t198,5,arid_coast_north,freshwater,XXXL,rufous|grey|purple,wading,slb-ardea-purpurea,no,drafter,large-herons
t199,8,arid_coast_north,coast,XXXL,grey|white,aerial,slb-ardea-cinerea,no,drafter,large-herons
t200,3,wet_lowland,open_country,XXXL,rufous|grey,wading,slb-ardea-purpurea,no,drafter,large-herons
t201,2,wet_lowland,freshwater,XXL,white|black|yellow,wading,slb-egretta-garzetta,no,drafter,white-egrets
t202,6,dry_lowland,open_country,XXL,white|yellow|black,wading,slb-ardea-intermedia,no,drafter,white-egrets
t203,10,arid_coast_north,coast,XXXL,white|yellow|black,wading,slb-ardea-alba,no,drafter,white-egrets
t204,12,intermediate,open_country,XXL,white|yellow,ground,slb-ardea-coromanda,no,drafter,white-egrets
t205,1,arid_coast_north,coast,XXL,white,wading,slb-egretta-gularis,no,drafter,white-egrets
t206,9,arid_coast_north,coast,XXL,white|black|yellow,wading,slb-egretta-garzetta,no,drafter,white-egrets
t207,11,wet_lowland,open_country,XXXL,white|yellow,wading,slb-ardea-intermedia,no,drafter,white-egrets
t208,4,dry_lowland,freshwater,XXXL,white|yellow|black,wading,slb-ardea-alba,no,drafter,white-egrets
t209,7,dry_lowland,freshwater,XXXL,white|black,wading,slb-platalea-leucorodia,no,drafter,large-white-waders
t210,1,arid_coast_north,coast,XXL,white|black,wading,slb-threskiornis-melanocephalus,no,drafter,large-white-waders
t211,2,intermediate,freshwater,XXXL,white|grey|black,wading,slb-anastomus-oscitans,no,drafter,large-white-waders
t212,3,intermediate,freshwater,XXXL,black|white|red,wading,slb-ciconia-episcopus,no,drafter,dark-storks
t213,12,dry_lowland,open_country,XXXL,grey|white|yellow,wading,slb-leptoptilos-javanicus,no,drafter,dark-storks
t214,6,arid_coast_north,coast,XXXL,white|black|pink,wading,slb-mycteria-leucocephala,no,drafter,large-white-waders
t215,8,dry_lowland,freshwater,XXXL,white|grey|black,aerial,slb-pelecanus-philippensis,no,drafter,
t216,5,wet_lowland,freshwater,XL,grey|black|green,wading,slb-butorides-atricapilla,no,drafter,stocky-herons
t217,3,wet_lowland,freshwater,XXL,brown|yellow|white,tree_bush,slb-botaurus-flavicollis,no,drafter,
t218,10,wet_lowland,town_garden,XXL,white|black|yellow,wading,slb-egretta-garzetta,no,drafter,white-egrets
t219,6,wet_lowland,freshwater,XXXL,grey|white|black,wading,slb-ardea-cinerea,no,drafter,large-herons
t220,9,dry_lowland,open_country,XXXL,white|black,ground,slb-anastomus-oscitans,no,drafter,large-white-waders
t221,11,intermediate,freshwater,XXL,black,perched_open,slb-phalacrocorax-fuscicollis,no,drafter,cormorants
t222,1,dry_lowland,freshwater,XXXL,brown|grey,wading,slb-mycteria-leucocephala,no,drafter,large-white-waders
t223,4,dry_lowland,open_country,XXL,white|black,wading,slb-threskiornis-melanocephalus,no,drafter,large-white-waders
t224,2,intermediate,freshwater,XXL,white|yellow|black,wading,slb-ardea-intermedia,no,drafter,white-egrets
```

The scenarios I expect to be weakest:
- t184, t221 (Indian Cormorant breeding) vs Little Cormorant: identical answers. Indian wins only where its commonness
  is higher (DL and IN common for both, so it is a tie). t188 and the batch-0 t17 carry the mirror risk.
- t201, t206, t218 (Little Egret) vs Medium Egret: identical XXL and colours. t202, t224 (Medium) vs Little Egret
  and Cattle Egret. t207 (Medium at XXXL) vs Great Egret.
- t177, t210, t223 (Black-headed Ibis white|black) vs Spoonbill and Little Egret.
- t176, t212 (Woolly-necked) vs Black-necked Stork (same colours, XXXL, wading).
- t195, t216 (Little Heron) vs Night-heron and the Reef-Heron dark morph.
- t193 (juvenile Night-heron) vs juvenile Little Heron and non-breeding Pond-heron.

Scarce targets, which are reported but not gated: t179 (Black-necked Stork).

---

## 5. Workbook doubts (for `workbook-doubts.csv`). Nothing has been changed.

```csv
species_id,field,doubt,suggested_source
slb-butorides-atricapilla,species_description,Says adult has rich chestnut sides and neck; this fits American Green Heron. I believe Sri Lankan birds (javanica group) have a grey neck and underparts with a dark cap and greenish-grey upperparts. Not tagged rufous,Warakagoda et al. 2012; Rasmussen & Anderton 2012
slb-butorides-atricapilla,names.si,Sinhala name is identical to Western Reef-Heron names.si; one of the two may be unintended,Native Sinhala reviewer; CBC Sinhala bird names list
slb-phoenicopterus-roseus,seasonality_months_seen,Code M with months broadly Oct-Mar; I believe non-breeding flocks stay through the south-west monsoon in some years; months drafted from the wb only,CBC Sri Lanka Bird List v3 (2022); dated CBC records
slb-plegadis-falcinellus,sri_lanka_occurrence_code,Code M; I believe breeding has been recorded in Sri Lanka and small numbers may be present year-round; cannot cite,CBC Sri Lanka Bird List v3 (2022); published breeding records
slb-leptoptilos-javanicus,species_description,Dark grey-brown plumage; I see the upperparts as glossy blackish in life. Minor. Tagged grey from the wb,Warakagoda et al. 2012
```

**Length gaps (not doubts, recorded for the workbook owner):** `species_description` has no length for the 9 plate-16
species, Great Cormorant or Indian Cormorant. The rows use cited `ext:` lengths (1a). Adding lengths to the workbook
would let the rows switch to `workbook:species_description`.

**Sinhala and plate-title notes (shown as-is, not changed):**
- Plate-16 title "යුරේසියා හැඳිආලාවා" adds "Eurasian" to Eurasian Spoonbill's `names.si` "හැඳිආලාවා". These look
  consistent.
- Plate-17 title "පෙරදිගු අහිකාවා" differs from Oriental Darter `names.si` "හංකාවා".
- Painted Stork `names.si` "ඇලි මානාවා" and Black-necked Stork `names.si` "අලි මානාවා" differ by one vowel sign.
  Please confirm both are intended.
- Grey Heron `names.si` "කළු කොකා" contains "කළු" (black) for a grey bird. It may be a traditional name. Please check.
- Little Heron and Western Reef-Heron share "කඩොල් කොකා" (doubt above).

A native reviewer should say which forms are intended.

---

## 6. Sensitive-species candidates (for `sensitive-species.csv`). Owner decides.
Already listed: Black-necked Stork and Lesser Adjutant (`obscure_location`). Their CSV notes and blocks name no site
below zone level.

| species_id | Reason | My recommendation |
|---|---|---|
| slb-pelecanus-philippensis | NT; breeds colonially in waterside trees; colonies are disturbance-sensitive | add (`obscure_location`) |
| slb-mycteria-leucocephala | Colonial tree nester, often in mixed heronries | add |
| slb-platalea-leucorodia | Small, local breeding colonies | add |
| slb-anhinga-melanogaster | Nests in mixed heronries with cormorants and herons (wb) | add |
| slb-ciconia-episcopus | NT; scarce and local (wb) | add |
| slb-nycticorax-nycticorax | Communal day roosts and colonies (wb names roost sites) | consider |
| slb-threskiornis-melanocephalus | Colonial tree nester | consider |
| slb-anastomus-oscitans, slb-phalacrocorax-carbo, slb-phalacrocorax-fuscicollis, slb-ardea-cinerea, slb-ardea-purpurea, slb-egretta-garzetta, slb-ardea-intermedia, slb-ardea-alba | Common species, but they share the same mixed heronries | do not list each one. Prefer a general rule that no note or credit names a heronry or nesting colony. |

I kept site names out of the CSV notes for the 5 "add" species, Night-heron and the 2 listed species. For other
species I quoted the wb's foraging sites (national parks, wetlands), as in batches 1-3. The workbook prose already
shipped in `species-text.json` names sites for Pelican, Painted Stork, Spoonbill, Darter, Night-heron, Black-necked
Stork and Lesser Adjutant. This raises the same open question as batches 1 and 3: does the "no site finer than zone"
rule cover the displayed workbook prose too?

---

## 7. Validator notes
- I could **not** run `npm ci`, `npm run traits:review-sheet -- --batch 4` or `npm run validate:content` (no shell
  in this session). **`validate:content` will fail until `traits-review/batch-04.md` is generated**, because
  `traits-plan.csv` now plans batch 4.
- I checked the rows by hand against `tools/content/traits.ts`:
  - vocabulary values;
  - plumage keys (`adult`, `juvenile`, `male`, `female`, `breeding`, `non_breeding`);
  - ≤ 3 colours per key;
  - no blank and named keys mixed for colour, and size is always blank-keyed;
  - no `all` mixed with months;
  - every zone row has exactly one commonness row (78 = 78);
  - no duplicates;
  - no row has more than 8 fields.
- Batches 1-3 (PRs #115, #121, #123) are not on `origin/main`. Their rows and plan lines will conflict textually with
  these appends at the end of `traits.csv` and `traits-plan.csv`. Merge one at a time and rebase, as the spec says.
