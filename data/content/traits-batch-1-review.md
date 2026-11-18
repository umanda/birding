# M8 traits batch 1: ornithologist summary for the owner (DRAFT)

Status: **proposed**, not reviewed. Spec: `docs/specs/006-scale-to-all-species.md`. Rows: `traits.csv`
(`review_status=proposed`). This hand-written summary comes before the generated `traits-review/batch-01.md`
(slice 7). Once slice 7 lands, the generated sheet is the source of truth for row-level review.

Scope: plates `plate-01` to `plate-06`, minus the 5 pilot species already reviewed in batch 0 (Sri Lanka
Junglefowl, Indian Peafowl, Garganey, Spotted Dove, Asian Koel). That leaves **33 species** and **547 proposed
rows**: 435 trait rows plus 112 commonness rows. Workbook occurrence codes and IUCN values are working values
*pending verification*. Nothing here upgrades or changes them.

Key: zones WL wet_lowland, WM wet_midhill, MO montane, IN intermediate, DL dry_lowland, AR arid_coast_north.
Commonness: C common, u uncommon, s scarce. Sources: `D` species_description, `MF` male_female_identification,
`J` juvenile_immature_plumage, `T` field_spotting_tips, `H` sri_lanka_distribution_and_hotspots, `S`
seasonality_months_seen (all `workbook:`). `X` = `expert:ornithologist`. Confidence: h, m, l.
"Si-prose" means the workbook text for that species is Sinhala only, so I read the values from Sinhala.

---

## 1. Focus areas (read these first)

### 1a. Values that conflict with the workbook, or that I doubt
| Species | Issue | What I drafted |
|---|---|---|
| Fulvous Whistling-duck | Code `M`, but the seasonality text says "CBC 2022: R+M". I believe it is rare here. | **month = unknown**. Zones from wb. Commonness `s` (X, l). |
| Indian Spot-billed Duck | The wb says abundant (බහුල) in the dry zone. I believe it is scarce to uncommon in Sri Lanka. The code is `R/M`, but the text says R+M. | Commonness `u` (X, l), against the wb. Please decide. |
| Lesser Whistling-duck | The wb says "chestnut head/neck" and "white wing stripes in flight". I believe the head is buff-grey with a dark crown and the chestnut is on the forewing and flanks, with no white wing-bar. The code is `R`, but the text says R+(M). | rufous kept (D, m) with a note. |
| Green Imperial-pigeon | The wb says "white head and underparts". In life I believe they are pale grey. | green (D, h), grey (X, m), white (D, **l**). |
| Blue-breasted Quail | wb length 15–18 cm looks large to me. I recall about 14 cm. | S (m) and M (**l**). |
| Chestnut-winged Cuckoo | The wb gives "pale underparts with dark barring". I recall adults with an orange-rufous throat and an unbarred white belly. The wb has no months and no region. | white (D, m). **zone + commonness = unknown**. Months 10–4 (X, l). |
| Grey-bellied Cuckoo | The wb does not describe the hepatic (rufous) female. It gives no months. | `morph_hepatic` rufous and white (X, m). Months 10–4 (X; 10 and 4 low). |

### 1b. Expert-sourced rows (`expert:ornithologist`): 145 of 547
- **Commonness: 95 of 112 rows.** Only 17 come from the workbook, where its prose states abundance: Barred
  Buttonquail DL, Lesser Whistling-duck DL/AR, Rock Pigeon (5 zones), Yellow-footed Green-pigeon IN/DL (wb says
  rare), Sri Lanka Green-pigeon MO (wb says rare in the upper hills), Green Imperial-pigeon WL, Greater Coucal (5 zones).
- **I could not source any commonness as `ext:`.** The citable status text (Warakagoda et al. 2012, or the Jetwing
  checklist PDF with Warakagoda's abundance codes) could not be read in this session, because the PDFs could not be
  text-extracted. I did not cite a book I could not check. If you or a second reviewer can supply page references
  (or a text export of the checklist), I will convert these rows to `ext:` with citations.
- Zone (18): Barred Buttonquail IN, AR; Cotton Pygmy-goose IN, WL; Little Grebe WM; Collared-dove AR;
  Orange-breasted Green-pigeon AR, IN, WL; Green Imperial-pigeon IN; Hawk-cuckoo IN; Grey-bellied Cuckoo IN, WL, WM;
  Banded Bay Cuckoo WM; Drongo-cuckoo WM, IN, DL.
- Colour (14): Spurfowl female brown; Buttonquail male and female (4, because the wb gives only the black bib);
  Blue-breasted Quail male brown, rufous; Cotton Pygmy-goose female white; Little Grebe breeding brown;
  Emerald Dove female brown; Green Imperial-pigeon grey; Hawk-cuckoo adult rufous; Grey-bellied hepatic (2).
- Behaviour (4): Rock Pigeon ground, Collared-dove ground, Green-billed Coucal ground, Greater Coucal tree_bush.
- Month (14): Chestnut-winged Cuckoo 10–4 and Grey-bellied Cuckoo 10–4. The wb says only "northern winter".
- No `size` row is expert-sourced. No expert row is `high`.

### 1c. Low-confidence rows: 85
These are mostly edge zones, scarce-zone commonness, edge migrant months, the two expert month sets, Painted
Francolin black, Synoicus size M, Green Imperial-pigeon white, Green-billed Coucal XXL and green (bill), and
Drongo-cuckoo town_garden.

### 1d. Endemics (5)
Sri Lanka Spurfowl, Sri Lanka Wood-pigeon (VU), Sri Lanka Green-pigeon, Sri Lanka Red-faced Malkoha (VU),
Sri Lanka Green-billed Coucal (VU). IUCN values are workbook working values.

### 1e. Hard groups in this batch (for scenarios, scored top-10 and any member in the top 3)
| hard_group | Members | Why it is hard with our six questions |
|---|---|---|
| `quail-buttonquail` | Barred Buttonquail, Blue-breasted Quail | small, brown, ground, grass; usually seen only when flushed |
| `whistling-ducks` | Lesser, Fulvous | same palette; only size (XL vs XXL) separates them |
| `female-dabbling-ducks` | Wigeon, Pintail, Shoveler, Garganey (batch 0), Cotton Pygmy-goose female | all "brown, swimming"; bill shape is not in the vocabulary |
| `green-pigeons` | Orange-breasted, Sri Lanka, Yellow-footed | females are near-identical; tail colour (grey vs green) is not captured |
| `coucals` | Green-billed, Greater | black and rufous; only bill colour and size separate them |
| `grey-cuckoos-shikra` | Common Hawk-cuckoo, Indian Cuckoo, Shikra (batch 0) | grey, barred, in trees; Hawk-cuckoo and Shikra look alike |
| `small-rufous-cuckoos` | Banded Bay Cuckoo, Grey-bellied hepatic female | rufous, barred, size L |
| `collared-spotted-dove` | Eurasian Collared-dove, Spotted Dove (batch 0) | brown/grey doves; the neck mark is small |
| `drongo-cuckoo-drongos` | Fork-tailed Drongo-cuckoo, Black Drongo (batch 0) | all-black, forked tail |
| `forest-gamebirds` | Sri Lanka Spurfowl, Sri Lanka Junglefowl female (batch 0) | brown, black and white, forest floor |

### 1f. Migrant months (M and R/M)
| Species | Code | Months drafted | Source |
|---|---|---|---|
| Fulvous Whistling-duck | M | **unknown** (code vs text conflict) | — |
| Eurasian Wigeon | M | 10(m), 11–3(h), 4(m) | S |
| Northern Pintail | M | 11(m), 12–2(h), 3(m); Oct and Apr not in wb | S |
| Northern Shoveler | M | 10(l), 11–3(h), 4(l) | S |
| Chestnut-winged Cuckoo | M | 10–4, all low | X |
| Grey-bellied Cuckoo | M | 10(l), 11–3(m), 4(l) | X |
| Indian Spot-billed Duck, Common Hawk-cuckoo, Indian Cuckoo | R/M | all | S |

### 1g. Unknowns
| Species | unknown_traits | Reason |
|---|---|---|
| Fulvous Whistling-duck | `month` | Code `M` conflicts with the seasonality text (R+M). Showing "all" would overstate a probably rare bird, and listing winter months would contradict the text. Needs the CBC list v3 line. |
| Chestnut-winged Cuckoo | `zone\|commonness` | The wb says "scattered across several regions" and names no zone. My own knowledge of its zones is too weak to draft. Commonness has no zone to attach to. |

**No species has 2 or more unknown core questions** (commonness is not a core question). No species lacks a
workbook length, so `size` is never unknown in this batch.

### 1h. Cut proposal (plate-06 / plate-07 boundary)
**Keep the cut at plate-06. No confusion group straddles 06/07.** Plate-07 holds swifts and swallows, which have
nothing in common with plate-06 cuckoos. Two groups do reach **later** plates, but their other members are either
already reviewed in batch 0 or sit far away, so extending this batch would not help:
- `grey-cuckoos-shikra`: Shikra (plate-22, batch 0) is reviewed. Besra (*Tachyspiza virgata*, plate-22) joins
  when the raptor batch lands. Re-run t57, t58 and t72 then.
- `drongo-cuckoo-drongos`: Black Drongo (plate-31, batch 0) is reviewed. The other drongos (plate-31) join later.
  Re-run t62 then.

---

## 2. Per-species summary (33)

Plumages that matter in Sri Lanka are listed for the photo batch. "Sexes alike" means one colour set with a blank
key.

**1. Painted Francolin · පනන්කුකුළා · *Francolinus pictus*** — plate-01 · R · LC · Si-prose
- Zone IN (H m), DL (H m) · commonness IN u (X l), DL s (X l)
- Habitat open_country (D h) · Size XL (~31 cm, D h) · Behaviour ground (D h) · Month all (S h)
- Colour (sexes alike): black (D **l**, "fairly dark" read as blackish), white (D m), orange (D m). Brown upperparts dropped by the cap.
- Plumages: adult (sexes alike). Juvenile cell blank in wb.
- Flags: wb text leans on "general francolin ecology"; distribution wording is cautious.

**2. Sri Lanka Spurfowl · වනකුකුළා · *Galloperdix bicalcarata*** — plate-01 · **E** · LC · Si-prose
- Zone WL (H h), WM (H m), MO (H l), DL (H l: riverine only) · commonness WL u, WM u (X m), MO s, DL s (X l)
- Habitat forest (D h) · Size XL (~37 cm, D h) · Behaviour ground (D h) · Month all (S h)
- Colour ♂ rufous, black, white (MF m) · ♀ rufous (MF m), brown (X m)
- Plumages: male, female. Endemic: Sri Lankan photos only (spec R1 gap risk).
- Hard group: `forest-gamebirds`.

**3. Grey Francolin · උස්වටුවා · *Ortygornis pondicerianus*** — plate-01 · R · LC · Si-prose
- Zone AR (H h), DL (H m) · commonness AR C (X m), DL u (X l)
- Habitat open_country (H h) · Size XL (30–35, D h) · Behaviour ground (T h) · Month all (S h)
- Colour (sexes alike): brown, orange (D h), white (D m). Black necklace dropped by the cap.
- Plumages: adult.

**4. Barred Buttonquail · බෝලවටුවා · *Turnix suscitator*** — plate-01 · R · LC · Si-prose
- Zone DL (H h), IN (X m), AR (X m), WL (H m), WM (H m), MO (H l) · commonness DL C (H m: wb says common), IN C, AR C (X m), WL u, WM u, MO s (X l)
- Habitat open_country (H h) · Size S (13–15, D h; female larger, no separate lengths) · Behaviour ground (T h) · Month all (S h)
- Colour ♀ brown (X m), black (MF h, bib), rufous (X m) · ♂ brown (X m), rufous (X l)
- Plumages: female (the brighter sex), male.
- Hard group: `quail-buttonquail`.

**5. Blue-breasted Quail · නිල් වටුවා · *Synoicus chinensis*** — plate-01 · R · LC · Si-prose
- Zone WL (H m), IN (H l), DL (H m) · commonness WL u, IN s, DL u (all X l)
- Habitat open_country (D h) · Size S (D m), M (D **l**) · Behaviour ground (T h) · Month all (S m: "mainly resident, local movements")
- Colour ♂ blue (MF m), brown, rufous (X m) · ♀ brown (MF h)
- Plumages: male, female.
- Doubt: length. Hard group: `quail-buttonquail`.

**6. Cotton Pygmy-goose · මල්සේරුවා · *Nettapus coromandelianus*** — plate-02 · R · LC · Si-prose
- Zone AR (H h), DL (H m), IN (X m), WL (X l) · commonness AR u, DL u (X m), IN u, WL s (X l)
- Habitat freshwater (D h) · Size XL (30–35, D h) · Behaviour swimming (T h) · Month all (S h)
- Colour ♂ white, black (MF h) · ♀ brown (D h), white (X m)
- Plumages: male, female (juvenile is like the female per wb).

**7. Fulvous Whistling-duck · මහ තඹසේරුවා · *Dendrocygna bicolor*** — plate-02 · **M** · LC · Si-prose
- Zone AR (H m), DL (H m) · commonness AR s, DL s (X l)
- Habitat freshwater (H h), open_country (D m) · Size XXL (45–53, D h) · Behaviour swimming (T m)
- Colour (sexes alike): rufous, brown, white (D m)
- **Month: unknown** (see 1g).
- Plumages: adult. Hard group: `whistling-ducks`. Doubt: code vs text, and status.

**8. Lesser Whistling-duck · තඹසේරුවා · *Dendrocygna javanica*** — plate-02 · R · LC · Si-prose
- Zone WL (H m), IN (H m), DL (H h), AR (H h) · commonness DL C (H h), AR C (H m), IN C, WL C (X m)
- Habitat freshwater (D h), open_country (D m) · Size XL (40–43, D h) · Behaviour swimming (T h) · Month all (S h)
- Colour (sexes alike): brown (D h), rufous (D m, see doubt)
- Plumages: adult. Hard group: `whistling-ducks`.

**9. Indian Spot-billed Duck · දෙතිත් තාරාවා · *Anas poecilorhyncha*** — plate-02 · R/M · LC · Si-prose
- Zone DL (H m), AR (H m) · commonness DL u, AR u (X **l**, against the wb's "abundant")
- Habitat freshwater (D h), coast (D m) · Size XXL (55–63, D h) · Behaviour swimming (D m) · Month all (S h)
- Colour (sexes alike): brown (D h), grey (D m), yellow (T m, bill tip)
- Plumages: adult.

**10. Eurasian Wigeon · රන්පට තාරාවා · *Mareca penelope*** — plate-02 · M · LC · Si-prose
- Zone AR (H h), DL (H l) · commonness AR u (X m), DL s (X l)
- Habitat coast, freshwater (H h) · Size XL, XXL (42–50, D h) · Behaviour swimming (D h), ground (T m, grazing) · Months 10–4 (S)
- Colour ♂ rufous, grey, yellow (MF h) · ♀ rufous, brown (MF m) · eclipse rufous, brown (MF m)
- Plumages: male, female, eclipse male (early season). Hard group: `female-dabbling-ducks`.

**11. Northern Pintail · උල්පෙඳ තාරාවා · *Anas acuta*** — plate-02 · M · LC · Si-prose
- Zone AR (H h), DL (H h) · commonness AR C (X m, in season), DL u (X m)
- Habitat freshwater, coast (D h) · Size XXL (D h), XXXL (D m, male tail only) · Behaviour swimming (D h) · Months 11–3 (S)
- Colour ♂ brown, white, grey (MF/D h) · ♀ brown (MF h)
- Plumages: male, female. Hard group: `female-dabbling-ducks`.

**12. Northern Shoveler · පත්තුඩු තාරාවා · *Spatula clypeata*** — plate-02 · M · LC · Si-prose
- Zone AR (H h), DL (H l) · commonness AR u (X m), DL s (X l)
- Habitat coast, freshwater (H h) · Size XL, XXL (44–52, D h) · Behaviour swimming (T h) · Months 10(l), 11–3, 4(l) (S)
- Colour ♂ green, white, rufous (MF h) · ♀ brown (MF h) · eclipse brown (MF m)
- Plumages: male, female, eclipse male. Hard group: `female-dabbling-ducks`.

**13. Little Grebe · ගෙඹිසේරුවා · *Tachybaptus ruficollis*** — plate-02 · R · LC · Si-prose
- Zone WL (H h), WM (X m), IN (H m), DL (H h), AR (H h); MO not tagged · commonness WL, IN, DL, AR C (X m), WM u (X l)
- Habitat freshwater (H h), town_garden (H m) · Size L (23–29, D h) · Behaviour swimming (T h) · Month all (S h)
- Colour breeding rufous (D h), brown (X m), yellow (D m, gape) · non_breeding brown (D h), grey (D m)
- Plumages: breeding, non-breeding. The juvenile (striped face) is like non-breeding and is left out.

**14. Rock Pigeon · ගෙල් පරෙවියා · *Columba livia*** — plate-03 · R · LC
- Zone all 6 (H; WL h, MO l) · commonness 5 zones C (H: "common resident"), MO u (X l)
- Habitat town_garden (H h), open_country (D m), coast (H m) · Size XL (30–35, D h) · Behaviour ground (X m), perched_open (D m) · Month all (S h)
- Colour (sexes alike): grey (D h), black (D m), purple (D m). Feral birds vary.
- Plumages: wild-type adult. Avoid photos of fancy domestic forms.

**15. Sri Lanka Wood-pigeon · මයිලගොයා · *Columba torringtoniae*** — plate-03 · **E** · **VU**
- Zone MO (H h), WM (H m) · commonness MO u (X m), WM s (X l)
- Habitat forest (D h) · Size XL (~40 cm, D h) · Behaviour tree_bush (D h) · Month all (S h)
- Colour (sexes alike): grey (D h), purple (D m), black (D **l**)
- Plumages: adult. Sensitive candidate (section 6). Notes in this file and the CSV name no sites.

**16. Eurasian Collared-dove · මාල කොබෙයියා · *Streptopelia decaocto*** — plate-03 · R · LC
- Zone DL (H h), IN (H m), AR (X m) · commonness AR C (X m), DL u (X m), IN s (X l)
- Habitat open_country, town_garden (D h) · Size XL (31–33, D h) · Behaviour perched_open (T h), ground (X m) · Month all (S h)
- Colour (sexes alike): grey (D h), brown (D m), black (D m, half-collar)
- Plumages: adult. Hard group: `collared-spotted-dove`.

**17. Common Emerald Dove · නිල් කොබෙයියා · *Chalcophaps indica*** — plate-03 · R · LC
- Zone WL, WM (H m), IN, DL (H h) · commonness WL C, WM C, IN u, DL u (X m)
- Habitat forest (D h), town_garden (D m) · Size L (23–28, D h) · Behaviour ground (D h) · Month all (S h)
- Colour ♂ green (D h), rufous (D m), white (MF m) · ♀ green (MF h), brown (X m), grey (MF m)
- Plumages: male, female.

**18. Orange-breasted Green-pigeon · ලැවන් බටගොයා · *Treron bicinctus*** — plate-04 · R · LC · Si-prose
- Zone DL (H h), AR (X l), IN (X m), WL (X l) · commonness DL C (X m), IN u (X m), AR u, WL s (X l)
- Habitat forest (D h) · Size L (~29, D h) · Behaviour tree_bush (D h) · Month all (S h)
- Colour ♂ green (D h), orange (MF h), grey (D m) · ♀ green, yellow (MF h), grey (MF m)
- Plumages: male, female. Hard group: `green-pigeons`.

**19. Yellow-footed Green-pigeon · පාදක බටගොයා · *Treron phoenicopterus*** — plate-04 · R · LC · Si-prose
- Zone IN (H m), DL (H m) · commonness IN s, DL s (H m: wb says very limited and rare)
- Habitat forest (D h), open_country (D m) · Size XL (~33, D h) · Behaviour tree_bush (T h) · Month all (S m)
- Colour (keyed together; female duller): grey, green, yellow (D h)
- Plumages: male (female if one is available). Sri Lankan ssp *phillipsi* per wb/Avibase, so use Sri Lankan or same-subspecies photos. Hard group: `green-pigeons`.

**20. Sri Lanka Green-pigeon · පිතරතු බටගොයා · *Treron pompadora*** — plate-04 · **E** · LC · Si-prose
- Zone WL, WM (H h), IN, DL (H m), MO (H l) · commonness WL C, WM C (X m), IN u (X m), DL u (X l), MO s (H m)
- Habitat forest (D h) · Size L (26–28, D h) · Behaviour tree_bush (D h) · Month all (S h)
- Colour ♂ green (D h), rufous (MF h, maroon mantle), yellow (D h) · ♀ green, yellow (MF h)
- Plumages: male, female. Endemic: Sri Lankan photos only. Hard group: `green-pigeons`.

**21. Green Imperial-pigeon · මහ නිල්ගොයා · *Ducula aenea*** — plate-04 · R · LC · Si-prose
- Zone WL (H h), WM (H m), IN (X m), DL (H m), AR (H l: Tissa by the zone rule) · commonness WL C (H m), WM/IN/DL C (X m), AR u (X l)
- Habitat forest (H h), town_garden (H m) · Size XXL (~45, D m: boundary, as with Grey Hornbill) · Behaviour tree_bush (T h) · Month all (S h)
- Colour (sexes alike): green (D h), grey (X m), white (D l)
- Plumages: adult. Doubt: white vs grey.

**22. Blue-faced Malkoha · වතනිල් මල්කොහා · *Phaenicophaeus viridirostris*** — plate-05 · R · LC
- Zone DL, IN (H h), AR (H m), WL (H l) · commonness DL C (X m), IN u, AR u (X m), WL s (X l)
- Habitat forest, open_country (D h) · Size XL (~39, D h) · Behaviour tree_bush (T h) · Month all (S h)
- Colour (sexes alike): green (D h), grey (D m), blue (D m, eye patch). White tail tips dropped by the cap.
- Plumages: adult.

**23. Sri Lanka Red-faced Malkoha · වතරතු මල්කොහා · *Phaenicophaeus pyrrhocephalus*** — plate-05 · **E** · **VU**
- Zone WL (H h), WM (H m) · commonness WL u (X m), WM s (X l)
- Habitat forest (D h) · Size XL, XXL (40–47, D h) · Behaviour tree_bush (T h) · Month all (S h)
- Colour (sexes alike): black, white, red (D h). The apple-green bill is dropped by the cap.
- Plumages: adult. Sensitive candidate. Endemic: Sri Lankan photos only.

**24. Sirkeer Malkoha · පතන් ඇටි කුකුළා · *Taccocua leschenaultii*** — plate-05 · R · LC
- Zone DL, IN (H h), AR (H m) · commonness DL u (X m), IN u (X l), AR u (X m)
- Habitat open_country (D h), forest (D m) · Size XL (42–43, D h) · Behaviour ground (D h), tree_bush (T m) · Month all (S h)
- Colour (sexes alike): brown (D h), rufous (D m), red (D m, bill)
- Plumages: adult.

**25. Sri Lanka Green-billed Coucal · බට ඇටි කුකුළා · *Centropus chlororhynchos*** — plate-05 · **E** · **VU**
- Zone WL (H h), WM (H m) · commonness WL u (X m), WM s (X l)
- Habitat forest (D h) · Size XL (D m), XXL (D l): "up to about 45 cm" with no lower bound · Behaviour tree_bush (D h), ground (X m) · Month all (S h)
- Colour (sexes alike): black, rufous (D h), green (D **l**, bill only)
- Plumages: adult. Sensitive candidate. Hard group: `coucals`. Endemic: Sri Lankan photos only.

**26. Greater Coucal · ඇටි කුකුළා · *Centropus sinensis*** — plate-05 · R · LC
- Zone WL, IN, DL (H h), WM, AR (H m); MO not tagged · commonness all 5 C (H: "common")
- Habitat open_country, town_garden (D h), forest, freshwater (D m) · Size XXL (48–52, D h) · Behaviour ground (T h), tree_bush (X m) · Month all (S h)
- Colour (sexes alike): black, rufous (D h)
- Plumages: adult. The juvenile (browner, barred) is described in the wb but left out. Hard group: `coucals`.

**27. Chestnut-winged Cuckoo · රතු කොණ්ඩකොහා · *Clamator coromandus*** — plate-06 · M · LC
- **Zone and commonness: unknown** (see 1g)
- Habitat forest (H h), town_garden (H m) · Size XL (33–34, D h) · Behaviour tree_bush (T h) · Months 10–4 (X l)
- Colour (sexes alike): black, rufous (D h), white (D m)
- Plumages: adult. Doubts: barring, and no months in the wb.

**28. Jacobin Cuckoo · කොණ්ඩකොහා · *Clamator jacobinus*** — plate-06 · R · LC
- Zone DL, IN (H h), AR (H m) · commonness all u (X m)
- Habitat open_country (D h), forest, town_garden (D m) · Size XL (~33, D h) · Behaviour perched_open (T h), tree_bush (T m) · Month all (S h)
- Colour (sexes alike): black, white (D h)
- Plumages: adult (dark form).

**29. Common Hawk-cuckoo · උකුසු කොහා · *Hierococcyx varius*** — plate-06 · R/M · LC
- Zone WM (H h), MO (H m), IN (X l), WL, DL (H l: lowland migrants) · commonness WM C (X m), MO u, IN u, WL s, DL s (X l)
- Habitat town_garden, forest (D h) · Size XL (~34, D h) · Behaviour tree_bush (T h) · Month all (S h)
- Colour adult: grey (D h), white (D m), rufous (X m) · juvenile: brown (J h), rufous (J m)
- Plumages: adult, juvenile. The Sri Lankan race is *ciceliae* per the wb, so prefer Sri Lankan photos. Hard group: `grey-cuckoos-shikra`.

**30. Indian Cuckoo · කෝකිලයා · *Cuculus micropterus*** — plate-06 · R/M · LC
- Zone WL, WM, IN, DL (H m); MO not tagged · commonness WL u, WM u (X m), IN u, DL u (X l)
- Habitat forest (D h), town_garden (D m) · Size XL (~33, D h) · Behaviour tree_bush (T h) · Month all (S h)
- Colour (sexes alike): grey, white (D h)
- Plumages: adult. Hard group: `grey-cuckoos-shikra`.

**31. Grey-bellied Cuckoo · හීන් කොහා · *Cacomantis passerinus*** — plate-06 · M · LC
- Zone DL (H h), AR (H m), IN (X m), WL, WM (X l) · commonness DL C (X m, in season), AR u (X m), IN, WL, WM u (X l)
- Habitat open_country (H h), town_garden, forest (H m) · Size L (~23, D h) · Behaviour tree_bush, perched_open (T m) · Months 10(l), 11–3(m), 4(l) (X)
- Colour ♂ grey (MF h), white (D m) · ♀ grey, rufous (MF m) · morph_hepatic rufous, white (X m)
- Plumages: male, female (grey type), hepatic female. Hard group: `small-rufous-cuckoos`.

**32. Banded Bay Cuckoo · වයිරම් කොහා · *Cacomantis sonneratii*** — plate-06 · R · LC
- Zone WL (H h), WM (X m), IN (H m: Ella mapped to IN), DL (H m) · commonness WL u (X m), WM u, IN u (X l), DL s (X l)
- Habitat forest (D h), town_garden (D m) · Size L (~23, D h) · Behaviour tree_bush (D h) · Month all (S h)
- Colour (sexes alike): rufous (D h), brown, white (D m)
- Plumages: adult. Hard group: `small-rufous-cuckoos`.

**33. Fork-tailed Drongo-cuckoo · කවුඩු කොහා · *Surniculus dicruroides*** — plate-06 · R · LC
- Zone WL (H h), WM (X m), IN, DL (X l) · commonness WL u (X m), WM u, IN s, DL s (X l)
- Habitat forest (D h), town_garden (D l) · Size L (25–28, D h) · Behaviour tree_bush (D h) · Month all (S h)
- Colour adult: black (D h) · juvenile: black, white (J m, white-spotted)
- Plumages: adult, juvenile. Hard group: `drongo-cuckoo-drongos`.

---

## 3. Proposed ledger lines (add to `traits-batches.csv` only after owner approval)
`reviewed_by` and `reviewed_at` are placeholders. The validator rejects them until they are filled with the owner
and a real date.

```csv
slb-francolinus-pictus,1,,owner,YYYY-MM-DD,M8 batch 1
slb-galloperdix-bicalcarata,1,,owner,YYYY-MM-DD,M8 batch 1
slb-ortygornis-pondicerianus,1,,owner,YYYY-MM-DD,M8 batch 1
slb-turnix-suscitator,1,,owner,YYYY-MM-DD,M8 batch 1
slb-synoicus-chinensis,1,,owner,YYYY-MM-DD,M8 batch 1
slb-nettapus-coromandelianus,1,,owner,YYYY-MM-DD,M8 batch 1
slb-dendrocygna-bicolor,1,month,owner,YYYY-MM-DD,M8 batch 1; month unknown: code M conflicts with seasonality text R+M
slb-dendrocygna-javanica,1,,owner,YYYY-MM-DD,M8 batch 1
slb-anas-poecilorhyncha,1,,owner,YYYY-MM-DD,M8 batch 1
slb-mareca-penelope,1,,owner,YYYY-MM-DD,M8 batch 1
slb-anas-acuta,1,,owner,YYYY-MM-DD,M8 batch 1
slb-spatula-clypeata,1,,owner,YYYY-MM-DD,M8 batch 1
slb-tachybaptus-ruficollis,1,,owner,YYYY-MM-DD,M8 batch 1
slb-columba-livia,1,,owner,YYYY-MM-DD,M8 batch 1
slb-columba-torringtoniae,1,,owner,YYYY-MM-DD,M8 batch 1
slb-streptopelia-decaocto,1,,owner,YYYY-MM-DD,M8 batch 1
slb-chalcophaps-indica,1,,owner,YYYY-MM-DD,M8 batch 1
slb-treron-bicinctus,1,,owner,YYYY-MM-DD,M8 batch 1
slb-treron-phoenicopterus,1,,owner,YYYY-MM-DD,M8 batch 1
slb-treron-pompadora,1,,owner,YYYY-MM-DD,M8 batch 1
slb-ducula-aenea,1,,owner,YYYY-MM-DD,M8 batch 1
slb-phaenicophaeus-viridirostris,1,,owner,YYYY-MM-DD,M8 batch 1
slb-phaenicophaeus-pyrrhocephalus,1,,owner,YYYY-MM-DD,M8 batch 1
slb-taccocua-leschenaultii,1,,owner,YYYY-MM-DD,M8 batch 1
slb-centropus-chlororhynchos,1,,owner,YYYY-MM-DD,M8 batch 1
slb-centropus-sinensis,1,,owner,YYYY-MM-DD,M8 batch 1
slb-clamator-coromandus,1,zone|commonness,owner,YYYY-MM-DD,M8 batch 1; zone unknown: workbook names no region
slb-clamator-jacobinus,1,,owner,YYYY-MM-DD,M8 batch 1
slb-hierococcyx-varius,1,,owner,YYYY-MM-DD,M8 batch 1
slb-cuculus-micropterus,1,,owner,YYYY-MM-DD,M8 batch 1
slb-cacomantis-passerinus,1,,owner,YYYY-MM-DD,M8 batch 1
slb-cacomantis-sonneratii,1,,owner,YYYY-MM-DD,M8 batch 1
slb-surniculus-dicruroides,1,,owner,YYYY-MM-DD,M8 batch 1
```

---

## 4. Draft test sightings for batch 1 (not in `id-test-sightings.csv` yet; slice 4 adds the columns)

There are 50 scenarios (t26–t75), and every one of the 33 species is a target at least once. 24 are easy (blank
`hard_group`) and 26 are hard. 30 of 50 (60%) target a species rated common in at least one zone. That rating
comes from my own proposed commonness, so the check is partly circular until commonness is reviewed.

**Composition gap:** all 50 are `scenario_source=orn-drafter`. I wrote them with knowledge of the trait rows, so
the spec's at-least-20% independent share is **not met**. Please have the owner or a guide write about 10 to 13
more, from plates or photos and **before** reading `traits.csv`, with `scenario_source=owner-blind` (or
`guide-blind`). Prefer common targets.

```csv
sighting_id,month,zone,habitat,size,colours,behaviour,expected_species_id,demo,scenario_source,hard_group
t26,3,arid_coast_north,open_country,XL,brown|orange|white,ground,slb-ortygornis-pondicerianus,no,orn-drafter,
t27,8,intermediate,open_country,XL,black|white|orange,ground,slb-francolinus-pictus,no,orn-drafter,
t28,6,wet_lowland,forest,XL,rufous|black|white,ground,slb-galloperdix-bicalcarata,no,orn-drafter,forest-gamebirds
t29,1,dry_lowland,open_country,S,brown|black,ground,slb-turnix-suscitator,no,orn-drafter,quail-buttonquail
t30,11,wet_lowland,open_country,S,brown,ground,slb-synoicus-chinensis,no,orn-drafter,quail-buttonquail
t31,2,arid_coast_north,freshwater,XL,white|black,swimming,slb-nettapus-coromandelianus,no,orn-drafter,
t32,7,dry_lowland,freshwater,XL,brown|rufous,swimming,slb-dendrocygna-javanica,no,orn-drafter,whistling-ducks
t33,1,arid_coast_north,freshwater,XXL,rufous|brown|white,swimming,slb-dendrocygna-bicolor,no,orn-drafter,whistling-ducks
t34,5,dry_lowland,freshwater,XXL,brown|grey|yellow,swimming,slb-anas-poecilorhyncha,no,orn-drafter,
t35,1,arid_coast_north,coast,XL,rufous|grey|yellow,swimming,slb-mareca-penelope,no,orn-drafter,
t36,12,arid_coast_north,coast,XL,brown,swimming,slb-mareca-penelope,no,orn-drafter,female-dabbling-ducks
t37,2,arid_coast_north,coast,XXL,brown|white|grey,swimming,slb-anas-acuta,no,orn-drafter,
t38,1,arid_coast_north,freshwater,XXL,brown,swimming,slb-anas-acuta,no,orn-drafter,female-dabbling-ducks
t39,12,arid_coast_north,coast,XL,green|white|rufous,swimming,slb-spatula-clypeata,no,orn-drafter,
t40,2,dry_lowland,freshwater,XL,brown,swimming,slb-spatula-clypeata,no,orn-drafter,female-dabbling-ducks
t41,6,wet_lowland,freshwater,L,brown|grey,swimming,slb-tachybaptus-ruficollis,no,orn-drafter,
t42,4,wet_lowland,town_garden,XL,grey|black,perched_open,slb-columba-livia,no,orn-drafter,
t43,10,montane,forest,XL,grey|purple,tree_bush,slb-columba-torringtoniae,no,orn-drafter,
t44,9,arid_coast_north,open_country,XL,grey|brown|black,perched_open,slb-streptopelia-decaocto,no,orn-drafter,collared-spotted-dove
t45,3,wet_lowland,forest,L,green|rufous,ground,slb-chalcophaps-indica,no,orn-drafter,
t46,7,dry_lowland,forest,L,green|orange|grey,tree_bush,slb-treron-bicinctus,no,orn-drafter,green-pigeons
t47,1,wet_lowland,forest,L,green|yellow,tree_bush,slb-treron-pompadora,no,orn-drafter,green-pigeons
t48,5,intermediate,forest,XL,grey|green|yellow,tree_bush,slb-treron-phoenicopterus,no,orn-drafter,green-pigeons
t49,8,wet_lowland,forest,XXL,green|grey,tree_bush,slb-ducula-aenea,no,orn-drafter,
t50,2,dry_lowland,open_country,XL,green|blue,tree_bush,slb-phaenicophaeus-viridirostris,no,orn-drafter,
t51,3,wet_lowland,forest,XL,black|white|red,tree_bush,slb-phaenicophaeus-pyrrhocephalus,no,orn-drafter,
t52,6,dry_lowland,open_country,XL,brown|rufous,ground,slb-taccocua-leschenaultii,no,orn-drafter,
t53,4,wet_lowland,forest,XL,black|rufous,tree_bush,slb-centropus-chlororhynchos,no,orn-drafter,coucals
t54,9,wet_lowland,town_garden,XXL,black|rufous,ground,slb-centropus-sinensis,no,orn-drafter,coucals
t55,12,wet_midhill,forest,XL,black|rufous|white,tree_bush,slb-clamator-coromandus,no,orn-drafter,
t56,5,dry_lowland,open_country,XL,black|white,perched_open,slb-clamator-jacobinus,no,orn-drafter,
t57,2,wet_midhill,town_garden,XL,grey|rufous|white,tree_bush,slb-hierococcyx-varius,no,orn-drafter,grey-cuckoos-shikra
t58,3,wet_lowland,forest,XL,grey|white,tree_bush,slb-cuculus-micropterus,no,orn-drafter,grey-cuckoos-shikra
t59,12,dry_lowland,open_country,L,grey|white,perched_open,slb-cacomantis-passerinus,no,orn-drafter,
t60,1,dry_lowland,town_garden,L,rufous|white,tree_bush,slb-cacomantis-passerinus,no,orn-drafter,small-rufous-cuckoos
t61,7,wet_lowland,forest,L,rufous|brown|white,tree_bush,slb-cacomantis-sonneratii,no,orn-drafter,small-rufous-cuckoos
t62,10,wet_lowland,forest,L,black,tree_bush,slb-surniculus-dicruroides,no,orn-drafter,drongo-cuckoo-drongos
t63,9,wet_lowland,freshwater,XL,brown|rufous,swimming,slb-dendrocygna-javanica,no,orn-drafter,whistling-ducks
t64,2,dry_lowland,freshwater,L,rufous|brown,swimming,slb-tachybaptus-ruficollis,no,orn-drafter,
t65,11,dry_lowland,town_garden,XL,grey,ground,slb-columba-livia,no,orn-drafter,
t66,4,dry_lowland,open_country,XXL,black|rufous,ground,slb-centropus-sinensis,no,orn-drafter,coucals
t67,6,wet_midhill,forest,XXL,green|grey|white,tree_bush,slb-ducula-aenea,no,orn-drafter,
t68,10,wet_midhill,forest,L,green|rufous|yellow,tree_bush,slb-treron-pompadora,no,orn-drafter,green-pigeons
t69,12,intermediate,forest,L,green|brown|grey,ground,slb-chalcophaps-indica,no,orn-drafter,
t70,8,intermediate,forest,XL,green|grey|blue,tree_bush,slb-phaenicophaeus-viridirostris,no,orn-drafter,
t71,3,dry_lowland,forest,L,green|yellow|grey,tree_bush,slb-treron-bicinctus,no,orn-drafter,green-pigeons
t72,5,wet_midhill,town_garden,XL,brown|rufous,tree_bush,slb-hierococcyx-varius,no,orn-drafter,grey-cuckoos-shikra
t73,7,dry_lowland,open_country,XL,grey|brown|black,perched_open,slb-streptopelia-decaocto,no,orn-drafter,collared-spotted-dove
t74,1,arid_coast_north,open_country,S,brown|rufous,ground,slb-turnix-suscitator,no,orn-drafter,quail-buttonquail
t75,2,arid_coast_north,open_country,XL,brown|orange,ground,slb-ortygornis-pondicerianus,no,orn-drafter,
```

Scenarios I expect to be weakest: t40 (female Shoveler vs Garganey, Lesser Whistling-duck and Cotton
Pygmy-goose female), t47/t71 (female green-pigeons), t57/t72 (Hawk-cuckoo vs Shikra adult and juvenile), and t33
(Fulvous, month neutral). Scarce targets, which are reported but not gated: t27, t30, t33, t48, t55.

---

## 5. Workbook doubts (for `workbook-doubts.csv`, slice 6). Nothing has been changed.

```csv
species_id,field,doubt,suggested_source
slb-dendrocygna-bicolor,occurrence_code,Code M but seasonality text says CBC 2022: R+M; I also believe it is rare in Sri Lanka,CBC Sri Lanka Bird List v3 (2022); CBC rarity list
slb-dendrocygna-javanica,occurrence_code,Code R but seasonality text says CBC 2022: R+(M),CBC Sri Lanka Bird List v3 (2022)
slb-dendrocygna-javanica,species_description,Chestnut head/neck and white wing stripes in flight: I believe head is buff-grey with dark crown and the forewing is chestnut with no white bar,Warakagoda et al. 2012; Rasmussen & Anderton 2012
slb-anas-poecilorhyncha,occurrence_code,Code R/M but seasonality text says CBC 2022: R+M,CBC Sri Lanka Bird List v3 (2022)
slb-anas-poecilorhyncha,sri_lanka_distribution_and_hotspots,Says abundant in the dry zone; I believe it is scarce to uncommon in Sri Lanka,Warakagoda et al. 2012; CBC records
slb-synoicus-chinensis,species_description,Length 15-18 cm looks large; I recall about 14 cm,Warakagoda et al. 2012; Rasmussen & Anderton 2012
slb-ducula-aenea,species_description,White head and underparts; I believe pale grey (pinkish-grey) in life,Warakagoda et al. 2012
slb-clamator-coromandus,species_description,Pale underparts with dark barring; I recall adults with orange-rufous throat and unbarred white belly,Warakagoda et al. 2012
slb-clamator-coromandus,seasonality_months_seen,No months and no region given,CBC records; Warakagoda et al. 2012
slb-cacomantis-passerinus,male_female_identification,Hepatic (rufous barred) female not described,Warakagoda et al. 2012
slb-cacomantis-passerinus,seasonality_months_seen,No months given (northern winter only),CBC records; Warakagoda et al. 2012
slb-cacomantis-sonneratii,species_description,Underparts described as streaked; I believe they are finely barred,Warakagoda et al. 2012
slb-columba-torringtoniae,species_description,Length about 40 cm; I recall nearer 36 cm (low confidence),Warakagoda et al. 2012
slb-centropus-chlororhynchos,species_description,Length given only as up to about 45 cm (no lower bound),Warakagoda et al. 2012
```

**Sinhala plate titles differ from species names (shown as-is, not changed):** plate-02 title "පුංචි ගෙඹිතිරුවා"
vs Little Grebe `names.si` "ගෙඹිසේරුවා"; plate-03 title "පච්ච කොබෙයියා" vs Common Emerald Dove "නිල් කොබෙයියා";
plate-04 title "නීල මහගොයා" vs Green Imperial-pigeon "මහ නිල්ගොයා"; plate-05 title "ඇටි-කුකුළා" vs Greater Coucal
"ඇටි කුකුළා" (a hyphen only, as with Indian Pond-heron). A native reviewer should say which form is intended.

**Juvenile cells blank** (`juvenile_immature_plumage` null) for all plate-01 and plate-02 species in this batch.
Juvenile notes for some of them sit in `male_female_identification` instead.

---

## 6. Sensitive-species candidates (for `sensitive-species.csv`, slice 6). Owner decides.
| species_id | Reason | My recommendation |
|---|---|---|
| slb-centropus-chlororhynchos | Endemic; VU (working IUCN); restricted wet-zone range; secretive and sensitive to playback; nests low in dense cover | add |
| slb-phaenicophaeus-pyrrhocephalus | Endemic; VU (working IUCN); restricted to remnant wet-zone forest | add |
| slb-columba-torringtoniae | Endemic; VU (working IUCN); restricted montane forest | add |
| slb-treron-phoenicopterus | Very local and rare; Sri Lankan ssp *phillipsi*; few known sites | consider |

Note: the workbook's distribution prose for these species (already shipped in `species-text.json`) names
hotspots. If they are added, decide whether the "no site finer than zone" rule also covers the displayed workbook
prose, or only our own sheets, notes and credits. I have kept site names out of this file's blocks and the CSV
notes for all four. No nest, roost or colony sites are recorded anywhere in this batch.

---

## 7. Validator notes
- I could **not** run `npm run validate:content` (no shell in this session). I checked the rows by hand against
  `tools/content/traits.ts`:
  - vocabulary values;
  - plumage keys (`adult`, and `morph_hepatic` via the morph pattern);
  - ≤ 3 colours per key;
  - no blank and named keys mixed;
  - no `all` mixed with months;
  - every commonness row has a matching zone row;
  - no duplicates;
  - no commas in notes.

  Please run it before review.
- Proposed rows are outside the ledger and are ignored by `traits-build.ts`, so `traits.json` does not change.
- Suggested validator additions (not required for these rows):
  1. Enforce "exactly one commonness row per zone row". Today only commonness→zone is checked, not zone→commonness.
  2. Enforce the spec's source rules: `size` never `expert:`, `expert:` only low or medium except `commonness`, and
     `ext:` rows must carry a citation in `note`.
  3. Slice 4: the `scenario_source` and `hard_group` columns, plus the composition checks.
