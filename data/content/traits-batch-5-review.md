# M8 traits batch 5: ornithologist summary for the owner (DRAFT)

Status: **proposed**, not reviewed. Spec: `docs/specs/006-scale-to-all-species.md`. Rows: `traits.csv`
(`review_status=proposed`). This hand-written summary comes before the generated `traits-review/batch-05.md`
(`npm run traits:review-sheet -- --batch 5`), which is the source of truth for row-level review.

Scope: plates `plate-20` to `plate-24` (sea-eagles, serpent-eagle, harriers, falcons, kites, Osprey, accipiters,
hawk-eagles, owlets, scops-owls, Boobook, frogmouth, Barn Owl, large owls and nightjars), minus the 2 pilot species
already reviewed in batch 0 (Brahminy Kite, Shikra). That leaves **30 species** and **543 proposed rows**: 437 trait
rows plus 106 commonness rows. Workbook occurrence codes and IUCN values are working values *pending verification*.
Nothing here upgrades or changes them.

Key: zones WL wet_lowland, WM wet_midhill, MO montane, IN intermediate, DL dry_lowland, AR arid_coast_north.
Commonness: C common, u uncommon, s scarce. Sources: `D` species_description, `MF` male_female_identification,
`J` juvenile_immature_plumage, `T` field_spotting_tips, `H` sri_lanka_distribution_and_hotspots, `S`
seasonality_months_seen (all `workbook:`). `X` = `expert:ornithologist`. `E` = `ext:` (cited in the row note with
its URL). Confidence: h, m, l. All 30 species have English prose; none is Sinhala-only. Serendib Scops-owl has a blank
`juvenile_immature_plumage` cell; its colours use a blank key, so nothing is unknown.

---

## 1. Focus areas (read these first)

### 1a. Sizes from external references (`ext:`): 3 rows, 2 species
The workbook gives no length for Black-winged Kite or Besra. Following the spec (size never `expert:`), each `size`
row cites a published length with its URL in the note. Both are `medium` confidence. No size is unknown.

| Species | Class | Cited value | Source | Caveat |
|---|---|---|---|---|
| Black-winged Kite | XL | Size: 31-35 cm | `ext:singaporebirds/black-winged-kite` | other web sources give 30-37 cm. All sit inside XL (30 to < 45). |
| Besra | L, XL | 29 to 36 cm | `ext:wikipedia/Besra` | spans the 30 cm edge, so 2 rows. The wb only says "slightly larger than Shikra". |

One more `ext:` row: Besra male `rufous` (Wikipedia: "white, barred reddish brown below"; the wb says only "finely
barred"). **Warakagoda et al. 2012 or Rasmussen & Anderton 2012 page numbers would let you upgrade all 4 rows.** I
could not read either book in this session.

Workbook sizes that need a look:
- Crested Serpent-eagle "about 55-75 cm" looks like a range-wide figure. I believe the Sri Lankan form (*spilogaster*)
  is at the small end, so the `XXXL` row may be wrong. It is `medium`; the `XXL` row is `high`.
- Peregrine "34-58 cm depending on sex and subspecies" gives XL and XXL, which is fine.
- Serendib Scops-owl "16.5-17 cm" touches 17 cm, so it gets S and M (17 is lower-bound M).

### 1b. Values that conflict with the workbook, or that I doubt
| Species | Issue | What I drafted |
|---|---|---|
| Western Marsh-harrier | The wb says "adult male is pale grey with black wing tips". I believe adult male *aeruginosus* has a brown back and belly with grey wings and tail. "Pale grey" fits Pallid or Montagu's better. | male grey, black (MF h), brown (X m). Doubt logged. |
| Black Kite | The wb says "regularly seen over Colombo and other urban areas". I believe Black Kite is local and uncommon in Sri Lanka, and Brahminy Kite is the usual Colombo kite. I cannot cite this. The wb gives no adult colour at all. | wb zones kept at medium; adult brown (X m); every commonness row u (X l). Doubt logged. |
| Osprey | Code `M`, but months read "broadly June-April in some datasets". This means oversummering birds, not a strict winter visitor. | Months 6-8 (l), 9-10 (m), 11-2 (h), 3-4 (m), from the wb. Code not changed. Doubt logged. |
| Rufous-bellied Eagle | The wb says "dark brown above". In life the hood and upperparts look blackish. | brown (D m) with a note. Minor doubt. |
| Peregrine Falcon | The resident Shaheen (*peregrinator*) has rufous underparts; migrant *calidus* is white below. With the 3-colour cap, only one of the two fits. | adult grey, black (D h), rufous (X m). **Owner question 2.** |
| Common Kestrel | `names.si` is "තහවුරු කළ යුතුයි" (one of the 7 spec placeholders). The wb puts it in the lowlands only. I believe the resident birds are mainly in the hills (cliffs, grassland). | Sinhala shown as-is. montane (X m) added. |
| IUCN values | Grey-headed Fish-eagle NT, Rufous-bellied Eagle NT, Chestnut-backed Owlet NT, Serendib Scops-owl EN. These match what I expect. I did not re-check the factsheets. | No doubt logged. The values are still "working". |

### 1c. Expert-sourced rows (`expert:ornithologist`): 136 of 543
- **Commonness: 92 of 106 rows.** 14 come from the workbook, where its prose states abundance: Crested Serpent-eagle
  WL/IN/WM/DL ("common resident"), Rufous-bellied Eagle WL/WM ("uncommon and local"), Legge's Hawk-eagle WM/MO/WL
  ("rare and local", read as scarce) and Brown Boobook WL/WM/IN/DL/MO ("common breeding resident", "less common at
  higher elevations").
- **No commonness row is `ext:`**, as in batches 1-4. I could not read a citable status text (Warakagoda et al. 2012,
  or the CBC list with abundance codes) in this session.
- Zone (19): Fish-eagle IN; Serpent-eagle MO; both harriers IN; Kestrel MO; Black-winged Kite AR, WL; Peregrine DL;
  Besra IN; Crested Goshawk IN, DL; Jungle Owlet AR; Indian Scops-owl WM; Oriental Scops-owl IN; Eagle-owl IN; Indian
  Nightjar IN; Jerdon's Nightjar WL; Jungle Nightjar WL, IN.
- Habitat (2): Serpent-eagle open_country; Peregrine open_country (cliffs fit no habitat value).
- Colour (11): Sea-eagle adult black; Fish-eagle juvenile white; Rufous-bellied juvenile brown; Marsh-harrier male
  brown; Montagu's male and female white; Black-winged Kite juvenile grey; Peregrine adult rufous; Black Kite adult
  brown; Besra male and female white.
- Behaviour (12): mostly `perched_open` for owls and raptors that the wb does not describe perching, plus Crested
  Goshawk and Legge's `aerial`, Indian Scops-owl `tree_bush` and Jungle Nightjar `ground`.
- **No `size` or `month` row is expert-sourced.** No expert row is `high`.

### 1d. Low-confidence rows: 76
Mostly edge zones (Serpent-eagle MO, Rufous-bellied MO, Peregrine DL, Jungle Nightjar WL and IN), scarce or edge
commonness, edge migrant months (Marsh-harrier 9 and 4, Montagu's 4, Osprey 6-8), and Black Kite and Barn Owl
commonness, where I have no good basis.

### 1e. Endemics (2)
Sri Lanka Chestnut-backed Owlet and Sri Lanka Serendib Scops-owl: **photos from Sri Lanka only**.
**Distinct Sri Lankan forms for photos:** Changeable Hawk-eagle *ceylanensis* (crested; the spec names it), Peregrine
Shaheen *peregrinator* for the resident plumage, Eastern Barn Owl (split from Western Barn Owl: photos must be
*javanica* group, not European *alba*), Oriental Scops-owl *leggei* (both morphs), Black Kite *govinda* (not the
migrant black-eared *lineatus*).

### 1f. Hard groups in this batch (for scenarios: top-10, with any member in the top 3)
| hard_group | Members | Why it is hard with our six questions |
|---|---|---|
| `fish-eagles` | White-bellied Sea-eagle, Grey-headed Fish-eagle, Osprey | Brown or grey with white, XXL, perched by water. Grey (Fish-eagle) and black (Osprey eye-stripe) are the only colour handles. Juvenile Sea-eagle is brown/white like the Osprey. |
| `harriers` | Western Marsh-harrier, Montagu's Harrier | Both quarter low over open country. Males are grey/black, females and juveniles are brown. Only size (XXL vs XL/XXL) and the male's brown (Marsh) separate them. The regular Pallid Harrier is not in this guide, so real-world confusion is wider. |
| `accipiters` | Shikra (b0), Besra, Crested Goshawk | Grey/rufous males and brown/white females and juveniles, L to XXL, in trees. Habitat (Shikra town_garden; Besra and Goshawk forest) and size decide. |
| `forest-eagles` | Changeable Hawk-eagle, Legge's Hawk-eagle, Crested Serpent-eagle, Rufous-bellied Eagle, Black Eagle | Changeable and Legge's have identical brown/white adults and white/brown juveniles. Only size (Legge's XXXL only), zone and commonness separate them. Serpent-eagle shares brown/white plus yellow. |
| `brown-kites` | Black Kite, Brahminy Kite juvenile (b0) | Both XXL/XL brown, aerial, near towns and water. |
| `falcons` | Common Kestrel, Peregrine Falcon | Grey/black males and adults, XL, aerial, open country. Rufous appears in both (Kestrel back, Shaheen underparts). |
| `small-owls` | Jungle Owlet, Chestnut-backed Owlet, Indian Scops-owl, Oriental Scops-owl, Serendib Scops-owl | Small brown or rufous owls in trees. The questions have no "at night" behaviour (spec known limitation), and ear tufts and voice are not captured. Zone is the main handle. |
| `large-owls` | Brown Wood-owl, Spot-bellied Eagle-owl, Brown Fish-owl | Brown/white, XXL, forest, tree_bush. Yellow (Fish-owl eyes) and freshwater (Fish-owl) are the only handles. Wood-owl vs Eagle-owl differ only by zone and commonness. |
| `nightjars` | Indian Nightjar, Jerdon's Nightjar, Jungle Nightjar, Sri Lanka Frogmouth | Cryptic brown/grey, M to XL. Size (Indian M/L, Jerdon's L, Jungle L/XL), zone and rufous (Jerdon's collar, Frogmouth female) separate them. |

Easy targets: Black-winged Kite (grey/white/black, hovering), Eastern Barn Owl (white face, open country), Brown
Boobook (brown/white/yellow in gardens).

### 1g. Migrant months (M and mixed codes)
| Species | Code | Months drafted | Source |
|---|---|---|---|
| Western Marsh-harrier | M | 9 (l), 10 (m), 11-2 (h), 3 (m), 4 (l) | S ("broadly September/October to March/April") |
| Montagu's Harrier | M | 10 (m), 11-2 (h), 3 (m), 4 (l) | S ("approximately October-March/April") |
| Osprey | M | 6-8 (l), 9-10 (m), 11-2 (h), 3-4 (m) | S ("broadly June-April in some datasets"); doubt logged |
| Common Kestrel | R/M | all (m) | S |
| Peregrine Falcon | R/M | all (h) | S (resident Shaheen year-round) |
| all others | R or E | all | S |

**Migrant plumage rule applied:** harriers key male, female and juvenile, because females and juveniles ("ringtails")
are most of what is seen here. Osprey keys adult and juvenile.

### 1h. Unknowns
**None.** Every species has a reviewed-source row for all six questions plus commonness. Size came from the workbook
for 28 species and from a cited `ext:` reference for 2 (see 1a). No species has 2 or more unknown core questions.

### 1i. Cut (plate-24 / plate-25 boundary)
**Cut after plate-24: 30 species**, inside the ~30-35 target.
- Plates 20-22 are the diurnal raptors. Their groups (forest eagles, accipiters, harriers, fish-eagles, falcons, brown
  kites) run across all three plates and link to the batch-0 Shikra and Brahminy Kite. Ending at plate 22 would give
  only 16 species.
- Plates 23-24 are the owls, frogmouth and nightjars. The `small-owls` group crosses plates 23 and 24 (Barn Owl,
  large owls), and the `nightjars` group joins the plate-23 Frogmouth to the plate-24 nightjars. Both stay whole.
- Plate 25 (Malabar Trogon, Indian Roller, bee-eaters) starts a new set of groups.

Cross-batch links to re-run when this batch lands:
- **batch 0 (original-25 gate, watch closely):**
  - **t12** (Asian Koel female; 5, WL, town_garden, XL, brown|white, tree_bush). Brown Boobook (WL, town_garden, XL,
    brown/white/yellow, tree_bush, WL common) matches every answer. **High risk.**
  - t20 (Shikra; WL, town_garden, grey|rufous, tree_bush). Besra male (grey/white/rufous, tree_bush, WL) misses only on
    habitat. Medium risk.
  - t13 (Brahminy Kite; WL, coast, XL, rufous|white, aerial). Rufous-bellied Eagle (rufous/brown/white, aerial, WL)
    differs in habitat and size; Kestrel female (rufous/white, coast, XL, aerial) differs in zone. Low risk.
  - t18 (Paradise-flycatcher; DL, forest, M, black|white, tree_bush). Jungle Owlet (DL, forest, M, brown/white,
    tree_bush) shares white. Low risk.
  - t15 (Red-wattled Lapwing; DL, open_country, XL, brown|black|white, ground). Indian Nightjar female
    (brown/grey/black, ground, DL) differs in size. Low risk.
- Batches 1-4 are unmerged and their sightings are not on this branch, so I could not check them here. Re-run all
  batch gates after rebasing.

If t12 drops out of its gate, the fix belongs to the conditional slice 9 (weights or commonness tie-breaks), not to
the data.

---

## 2. Per-species summary (30)

"Plumages" lists the plumages that matter in Sri Lanka, for the photo batch. "Sexes alike" means one colour set
with a blank key. For sensitive species and candidates, no site finer than a zone is named here or in the CSV notes.

**1. White-bellied Sea-eagle · මුහුදු රාජාලියා · *Icthyophaga leucogaster*** — plate-20 · R · LC
- Zone AR, DL (H h), WL, IN (H m) · commonness AR C, DL C (X m), WL u (X l), IN u (X m)
- Habitat coast, freshwater (D h) · Size XXL, XXXL (D h, 66-85 cm) · Behaviour perched_open, aerial (T h) · Month all (S h)
- Colour adult white, grey (D h), black (X m) · juvenile brown (J h), white (J m)
- Plumages: adult, juvenile/immature. Hard group: `fish-eagles`.

**2. Grey-headed Fish-eagle · වැව් රාජාලියා · *Icthyophaga ichthyaetus*** — plate-20 · R · NT
- Zone DL (H h), IN (X l) · commonness DL u (X m), IN s (X l)
- Habitat freshwater (D h), forest (T m) · Size XXL, XXXL (D h, 61-74 cm) · Behaviour perched_open (T h), aerial (D m) · Month all (S h)
- Colour adult grey, brown (D h), white (D m) · juvenile brown (J h), white (X l)
- Plumages: adult, juvenile. Hard group: `fish-eagles`. Sensitive candidate (NT, tree nester at tanks).

**3. Crested Serpent-eagle · සර්ප රාජාලියා · *Spilornis cheela*** — plate-20 · R · LC
- Zone WL, IN (H h), WM, DL (H m), MO (X l) · commonness WL, IN C (H h), WM, DL C (H m), MO u (X l)
- Habitat forest (D h), open_country (X m) · Size XXL (D h), XXXL (D m) · Behaviour aerial (T h), perched_open (D h) · Month all (S h)
- Colour adult brown, white, yellow (D h) · juvenile brown, white (J m)
- Plumages: adult, juvenile. Hard group: `forest-eagles`. Size doubt (1a).

**4. Rufous-bellied Eagle · බඩරතු රාජාලියා · *Lophotriorchis kienerii*** — plate-20 · R · NT
- Zone WL, WM (H h), MO (H l) · commonness WL u, WM u (H h), MO s (X l)
- Habitat forest (D h) · Size XXL (D h, 46-61 cm) · Behaviour tree_bush (D h), aerial (T m) · Month all (S h)
- Colour adult rufous (D h), brown, white (D m) · juvenile white (J m), brown (X m)
- Plumages: adult, juvenile (pale, very different). Hard group: `forest-eagles`. Sensitive candidate (NT).

**5. Western Marsh-harrier · වගුරු උකුස්සා · *Circus aeruginosus*** — plate-20 · M · LC
- Zone AR (H h), DL (H m), IN (X l) · commonness AR u, DL u (X m), IN s (X l)
- Habitat freshwater, open_country (D h) · Size XXL (D h, 48-56 cm) · Behaviour aerial (T h) · Months 9-4 (S)
- Colour male grey, black (MF h), brown (X m) · female brown (MF h), white (D m) · juvenile brown (J h), rufous (J m)
- Plumages: female/juvenile first, adult male. Hard group: `harriers`. Doubt: male description.

**6. Montagu's Harrier · අළු වගුරු උකුස්සා · *Circus pygargus*** — plate-20 · M · LC
- Zone AR (H h), DL (H m), IN (X l) · commonness AR u (X m), DL s, IN s (X l)
- Habitat open_country (D h), freshwater (H m) · Size XL, XXL (D h, 40-48 cm) · Behaviour aerial (T h) · Months 10-4 (S)
- Colour male grey, black (MF h), white (X m) · female brown (MF h), white (X m) · juvenile brown, rufous (J h)
- Plumages: female, juvenile, adult male. Hard group: `harriers`.

**7. Common Kestrel · තහවුරු කළ යුතුයි · *Falco tinnunculus*** — plate-21 · R/M · LC
- Zone DL (H h), AR, IN (H m), MO (X m) · commonness DL, AR, MO u (X m), IN s (X l)
- Habitat open_country (D h), coast (D m), town_garden (D l) · Size XL (D h, 32-39 cm) · Behaviour aerial (T h), perched_open (D m) · Month all (S m)
- Colour male grey, rufous (MF h), black (MF m) · female rufous (D h), brown, white (m) · juvenile rufous, brown, white (J m)
- Plumages: male, female. Hard group: `falcons`. Sinhala name is a placeholder (spec list).

**8. Black-winged Kite · පහන් උකුස්සා · *Elanus caeruleus*** — plate-21 · R · LC
- Zone DL (H h), IN (H m), AR, WL (X m) · commonness DL, IN C (X m), AR u (X l), WL u (X m)
- Habitat open_country (D h) · Size XL (E m) · Behaviour perched_open, aerial (D h) · Month all (S h)
- Colour adult grey, white, black (D h) · juvenile brown (J h), grey (X m), white (J m)
- Plumages: adult, juvenile. Easy target.

**9. Peregrine Falcon · මහ කොණ්ඩ උකුස්සා · *Falco peregrinus*** — plate-21 · R/M · LC
- Zone MO, WM, AR (H m), DL (X l) · commonness MO u (X m), WM u, AR u, DL s (X l)
- Habitat open_country (X m), coast (D m), town_garden (D l) · Size XL, XXL (D h) · Behaviour aerial (T h), perched_open (X m) · Month all (S h)
- Colour adult grey, black (D h), rufous (X m) · juvenile brown (J h), white (J l)
- Plumages: adult Shaheen, adult *calidus*, juvenile. Hard group: `falcons`. Sensitive candidate (Shaheen eyries).

**10. Osprey · මහ උකුස්සා · *Pandion haliaetus*** — plate-21 · M · LC
- Zone WL, AR (H h), DL (H m), IN (H l) · commonness WL, AR u (X m), DL u, IN s (X l)
- Habitat coast, freshwater (D h) · Size XXL (D h, 54-58 cm) · Behaviour aerial, perched_open (T h) · Months 6-4 (S)
- Colour adult white, brown (D h), black (D m) · juvenile brown (J h), white (J m)
- Plumages: adult, juvenile. Hard group: `fish-eagles`. Doubt: months vs code M.

**11. Black Kite · කළු උකුස්සා · *Milvus migrans*** — plate-21 · R · LC
- Zone WL, IN, DL, AR (H m) · commonness all u (X l)
- Habitat town_garden, open_country (h), coast, freshwater (H m) · Size XXL (D h, 48-60 cm) · Behaviour aerial (T h), perched_open (X m) · Month all (S h)
- Colour adult brown (X m) · juvenile brown (J h), white (J m)
- Plumages: adult (*govinda*), juvenile. Hard group: `brown-kites`. Doubt: Colombo and abundance.

**12. Besra · පුංචි කුරුළුගොයා · *Tachyspiza virgata*** — plate-22 · R · LC
- Zone WL, WM (H h), MO (H m), IN (X l) · commonness WL, WM u (X m), MO u, IN s (X l)
- Habitat forest (D h) · Size L, XL (E m) · Behaviour tree_bush (D h), aerial (T m) · Month all (S h)
- Colour male grey (MF h), white (X m), rufous (E m) · female brown (MF h), white (X m) · juvenile brown (J h), white (J m)
- Plumages: male, female, juvenile. Hard group: `accipiters`. Photo gap likely.

**13. Crested Goshawk · කොණ්ඩ උකුස්සා · *Lophospiza trivirgata*** — plate-22 · R · LC
- Zone WL, WM (H h), MO (H m), IN (X m), DL (X l) · commonness WL, WM u (X m), MO, IN u, DL s (X l)
- Habitat forest (D h) · Size XL, XXL (D h, 38-48 cm) · Behaviour tree_bush (T m), aerial (X m) · Month all (S h)
- Colour adult brown, white (D h) · juvenile brown (J h), white (J m)
- Plumages: adult, juvenile. Hard group: `accipiters`.

**14. Black Eagle · කළු රාජාලියා · *Ictinaetus malaiensis*** — plate-22 · R · LC
- Zone WM, MO (H h), WL (H m) · commonness all u (X m)
- Habitat forest (D h) · Size XXL, XXXL (D h, 65-80 cm) · Behaviour aerial (T h) · Month all (S h)
- Colour adult black (D h), brown (D m) · juvenile brown (J h), white (J m)
- Plumages: adult (in flight). Hard group: `forest-eagles`.

**15. Changeable Hawk-eagle · මහ රාජාලියා · *Nisaetus cirrhatus*** — plate-22 · R · LC
- Zone DL, WL (H h), WM, IN (H m) · commonness DL, IN C, WL, WM u (X m)
- Habitat forest (D h), open_country (D m) · Size XXL, XXXL (D h, 60-72 cm) · Behaviour tree_bush, aerial (D m), perched_open (X m) · Month all (S h)
- Colour adult brown, white (D h) · juvenile white (J h), brown (J m)
- Plumages: adult, juvenile (white-headed). *ceylanensis* photos only. Hard group: `forest-eagles`.

**16. Legge's Hawk-eagle · මහ කොණ්ඩ රාජාලියා · *Nisaetus kelaarti*** — plate-22 · R · LC · **sensitive (listed)**
- Zone WM (H h), MO (H m), WL (H l) · commonness all s (H)
- Habitat forest (D h) · Size XXXL (D h, 70-72 cm) · Behaviour aerial (X m) · Month all (S h)
- Colour adult brown, white (D h) · juvenile white (J m), brown (J h)
- Plumages: adult, juvenile. Hard group: `forest-eagles`. Scarce target. The wb names a recent site record; not
  repeated.

**17. Jungle Owlet · වන බස්සා · *Glaucidium radiatum*** — plate-23 · R · LC
- Zone DL, IN (H h), AR (X l) · commonness DL, IN C (X m), AR u (X l)
- Habitat forest (D h), open_country (D m) · Size M (D h, ~19 cm) · Behaviour tree_bush (D m), perched_open (X m) · Month all (S h)
- Colour (sexes alike): brown, white (D h)
- Plumages: adult. Hard group: `small-owls`.

**18. Indian Scops-owl · බස්සා · *Otus bakkamoena*** — plate-23 · R · LC
- Zone WL, IN, DL (H m), WM (X m) · commonness WL, IN, DL C (X m), WM u (X l)
- Habitat town_garden, forest (D h) · Size L (D h, 23-25 cm) · Behaviour tree_bush (X m) · Month all (S h)
- Colour (sexes alike): brown (D h), grey (D m)
- Plumages: adult. Hard group: `small-owls`.

**19. Oriental Scops-owl · පුංචි බස්සා · *Otus sunia*** — plate-23 · R · LC
- Zone DL (H h), WL (H l), IN (X m) · commonness DL u (X m), IN u, WL s (X l)
- Habitat forest (D h), town_garden (D m) · Size M (D h, 17-19 cm) · Behaviour tree_bush (D m) · Month all (S h)
- Colour morph_rufous rufous (D h) · morph_grey grey, brown (D h)
- Plumages: rufous morph, grey morph (*leggei*). Hard group: `small-owls`.

**20. Sri Lanka Chestnut-backed Owlet · මුකලන් බස්සා · *Glaucidium castanotum*** — plate-23 · E · NT
- Zone WL, WM (H h), MO (H m) · commonness WL, WM u (X m), MO s (X l)
- Habitat forest (D h) · Size M (D h, 19-21 cm) · Behaviour tree_bush (D h), perched_open (X l) · Month all (S h)
- Colour (sexes alike): rufous, brown, white (D h)
- Plumages: adult. Sri Lankan photos only. Hard group: `small-owls`. Sensitive candidate (endemic, NT).

**21. Sri Lanka Serendib Scops-owl · පඩුවන් බස්සා · *Otus thilohoffmanni*** — plate-23 · E · EN · **sensitive (listed)**
- Zone WL (H h), WM (H m) · commonness WL s (X m), WM s (X l)
- Habitat forest (D h) · Size S, M (D h, 16.5-17 cm) · Behaviour tree_bush (D h) · Month all (S h)
- Colour (sexes alike): rufous (D h), black (D m)
- Plumages: adult. Sri Lankan photos only; photo gap likely (spec R1). Hard group: `small-owls`. Scarce target. The
  wb names 5 localities; none is repeated here or in the CSV.

**22. Brown Boobook · උකුසු බකමූණා · *Ninox scutulata*** — plate-23 · R · LC
- Zone WL (H h), WM, IN, DL (H m), MO (H l) · commonness WL C (H h), WM, IN, DL C (H m), MO u (H m)
- Habitat forest, town_garden (D h) · Size XL (D h, 30-33 cm) · Behaviour tree_bush (D h), perched_open (T h) · Month all (S h)
- Colour (sexes alike): brown, white (D h), yellow (T m)
- Plumages: adult. Easy target, but see t12 (1i).

**23. Sri Lanka Frogmouth · ගෙඹිතුඩියා · *Batrachostomus moniliger*** — plate-23 · R · LC
- Zone WL (H h), WM (H m) · commonness WL u (X m), WM u (X l)
- Habitat forest (D h) · Size L (D h, 23-25 cm) · Behaviour tree_bush (D h) · Month all (S h)
- Colour male grey, brown (MF h) · female rufous (MF h), brown (MF m)
- Plumages: male, female. Hard group: `nightjars`. Sensitive candidate (roost-site fidelity; the wb warns against
  flushing).

**24. Eastern Barn Owl · අළු බකමූණා · *Tyto javanica*** — plate-24 · R · LC
- Zone WL, IN, DL, AR (H m) · commonness all u (X l)
- Habitat open_country, town_garden (D h) · Size XL (D h, 33-39 cm) · Behaviour aerial (T h), perched_open (X m) · Month all (S h)
- Colour (sexes alike): white (D m), brown (D h), grey (D m)
- Plumages: adult. *javanica* photos only. Easy target.

**25. Brown Wood-owl · වන බකමූණා · *Strix leptogrammica*** — plate-24 · R · LC
- Zone WL (H h), WM, MO (H m) · commonness WL u (X m), WM, MO u (X l)
- Habitat forest (D h) · Size XXL (D h, 45-48 cm) · Behaviour tree_bush (D h) · Month all (S h)
- Colour (sexes alike): brown, white (D h)
- Plumages: adult. Hard group: `large-owls`.

**26. Spot-bellied Eagle-owl · මහ බකමූණා / උලමා · *Ketupa nipalensis*** — plate-24 · R · LC · **sensitive (listed)**
- Zone DL (H h), WL, WM (H m), IN (X m) · commonness DL s (X m), WL, WM, IN s (X l)
- Habitat forest (D h) · Size XXL (D h, 50-60 cm) · Behaviour tree_bush (D m) · Month all (S h)
- Colour (sexes alike): brown, white (D h)
- Plumages: adult, juvenile (pale, downy; optional). Hard group: `large-owls`. Scarce target. The wb names protected
  areas; not repeated.

**27. Brown Fish-owl · මහ බකමූණා · *Ketupa zeylonensis*** — plate-24 · R · LC
- Zone DL, WL (H h), IN, WM (H m) · commonness DL C (X m), WL, IN u (X m), WM u (X l)
- Habitat freshwater, forest (D h) · Size XXL (D h, 48-58 cm) · Behaviour tree_bush (T h), perched_open (X l) · Month all (S h)
- Colour (sexes alike): brown (D h), white (D m), yellow (T m)
- Plumages: adult. Hard group: `large-owls`.

**28. Indian Nightjar · පුංචි බිම්බස්සා · *Caprimulgus asiaticus*** — plate-24 · R · LC
- Zone DL (H h), AR (H m), IN (X m) · commonness DL C (X m), AR, IN u (X l)
- Habitat open_country (D h) · Size M, L (D h, 21-23 cm) · Behaviour ground (T h), aerial (D m) · Month all (S h)
- Colour male brown, grey (D h), white (MF h) · female brown (D h), grey, black (D m)
- Plumages: male (white patches), female. Hard group: `nightjars`.

**29. Jerdon's Nightjar · පෙඳදිග බිම්බස්සා · *Caprimulgus atripennis*** — plate-24 · R · LC
- Zone DL, IN (H h), WL (X l) · commonness DL C (X m), IN C, WL u (X l)
- Habitat open_country (D h), forest (D m) · Size L (D h, ~26 cm) · Behaviour ground (H m), perched_open (T m), aerial (X m) · Month all (S h)
- Colour male brown, rufous (D h), white (MF h) · female brown (D h), rufous (MF h), grey (D m)
- Plumages: male, female. Hard group: `nightjars`.

**30. Jungle Nightjar · කදුර බිම්බස්සා · *Caprimulgus indicus*** — plate-24 · R · LC
- Zone WM (H h), MO (H m), WL, IN (X l) · commonness WM u (X m), MO u, WL s, IN s (X l)
- Habitat forest (D h), open_country (H m) · Size L, XL (D h, 28-32 cm) · Behaviour ground (X m), aerial (D m) · Month all (S h)
- Colour male grey, brown (D h), white (MF h) · female grey, brown (D h), black (D m)
- Plumages: male, female. Hard group: `nightjars`.

---

## 3. Proposed ledger lines (add to `traits-batches.csv` only after owner approval)
`reviewed_by` and `reviewed_at` are placeholders. No species has unknown traits.

```csv
slb-icthyophaga-leucogaster,5,,owner,YYYY-MM-DD,M8 batch 5
slb-icthyophaga-ichthyaetus,5,,owner,YYYY-MM-DD,M8 batch 5
slb-spilornis-cheela,5,,owner,YYYY-MM-DD,M8 batch 5
slb-lophotriorchis-kienerii,5,,owner,YYYY-MM-DD,M8 batch 5
slb-circus-aeruginosus,5,,owner,YYYY-MM-DD,M8 batch 5
slb-circus-pygargus,5,,owner,YYYY-MM-DD,M8 batch 5
slb-falco-tinnunculus,5,,owner,YYYY-MM-DD,M8 batch 5
slb-elanus-caeruleus,5,,owner,YYYY-MM-DD,M8 batch 5; size from ext source
slb-falco-peregrinus,5,,owner,YYYY-MM-DD,M8 batch 5
slb-pandion-haliaetus,5,,owner,YYYY-MM-DD,M8 batch 5
slb-milvus-migrans,5,,owner,YYYY-MM-DD,M8 batch 5
slb-tachyspiza-virgata,5,,owner,YYYY-MM-DD,M8 batch 5; size from ext source
slb-lophospiza-trivirgata,5,,owner,YYYY-MM-DD,M8 batch 5
slb-ictinaetus-malaiensis,5,,owner,YYYY-MM-DD,M8 batch 5
slb-nisaetus-cirrhatus,5,,owner,YYYY-MM-DD,M8 batch 5
slb-nisaetus-kelaarti,5,,owner,YYYY-MM-DD,M8 batch 5
slb-glaucidium-radiatum,5,,owner,YYYY-MM-DD,M8 batch 5
slb-otus-bakkamoena,5,,owner,YYYY-MM-DD,M8 batch 5
slb-otus-sunia,5,,owner,YYYY-MM-DD,M8 batch 5
slb-glaucidium-castanotum,5,,owner,YYYY-MM-DD,M8 batch 5
slb-otus-thilohoffmanni,5,,owner,YYYY-MM-DD,M8 batch 5
slb-ninox-scutulata,5,,owner,YYYY-MM-DD,M8 batch 5
slb-batrachostomus-moniliger,5,,owner,YYYY-MM-DD,M8 batch 5
slb-tyto-javanica,5,,owner,YYYY-MM-DD,M8 batch 5
slb-strix-leptogrammica,5,,owner,YYYY-MM-DD,M8 batch 5
slb-ketupa-nipalensis,5,,owner,YYYY-MM-DD,M8 batch 5
slb-ketupa-zeylonensis,5,,owner,YYYY-MM-DD,M8 batch 5
slb-caprimulgus-asiaticus,5,,owner,YYYY-MM-DD,M8 batch 5
slb-caprimulgus-atripennis,5,,owner,YYYY-MM-DD,M8 batch 5
slb-caprimulgus-indicus,5,,owner,YYYY-MM-DD,M8 batch 5
```

---

## 4. Draft test sightings for batch 5 (append to `id-test-sightings.csv` after approval)

There are 45 scenarios (**t225-t269**; t26-t224 are reserved by the unmerged batches 1-4). Every one of the 30
species is a target at least once. Every hard-group member has at least one sighting with its `hard_group`,
including the 2 batch-0 members (t247 Brahminy Kite juvenile, t251 Shikra). 4 are easy (blank `hard_group`) and 41
are hard.

Composition:
- **Common share: 17 of 45 (38%)**, well under the spec's ~60%. Raptors and owls are mostly uncommon, so the batch
  cannot reach 60% without padding the set with repeats. These ratings come from my proposed commonness, so the
  check is also partly circular until commonness is reviewed. **Owner question 5.**
- **`scenario_source` gap:** all 45 are `scenario_source=drafter`, so the spec's at-least-20% share from someone else
  is **not met**. The owner or a guide should write about 10 to 12 more, with `scenario_source=other`, or `plates` if
  written from plates or photos **before** reading `traits.csv`. Prefer common targets: Crested Serpent-eagle,
  Changeable Hawk-eagle, White-bellied Sea-eagle, Black-winged Kite, Brown Boobook, Jungle Owlet, Indian Scops-owl,
  Brown Fish-owl, Indian and Jerdon's Nightjar. That would also lift the common share.

```csv
sighting_id,month,zone,habitat,size,colours,behaviour,expected_species_id,demo,scenario_source,hard_group
t225,2,arid_coast_north,coast,XXL,white|grey,perched_open,slb-icthyophaga-leucogaster,no,drafter,fish-eagles
t226,8,dry_lowland,freshwater,XXXL,brown|white,aerial,slb-icthyophaga-leucogaster,no,drafter,fish-eagles
t227,5,dry_lowland,freshwater,XXL,grey|brown|white,perched_open,slb-icthyophaga-ichthyaetus,no,drafter,fish-eagles
t228,1,wet_lowland,coast,XXL,white|brown|black,aerial,slb-pandion-haliaetus,no,drafter,fish-eagles
t229,12,arid_coast_north,coast,XXL,white|brown,perched_open,slb-pandion-haliaetus,no,drafter,fish-eagles
t230,7,wet_lowland,forest,XXL,brown|white|yellow,aerial,slb-spilornis-cheela,no,drafter,forest-eagles
t231,3,intermediate,forest,XXL,brown|white|yellow,perched_open,slb-spilornis-cheela,no,drafter,forest-eagles
t232,9,wet_midhill,forest,XXL,rufous|brown|white,aerial,slb-lophotriorchis-kienerii,no,drafter,forest-eagles
t233,4,wet_midhill,forest,XXXL,black|brown,aerial,slb-ictinaetus-malaiensis,no,drafter,forest-eagles
t234,6,dry_lowland,forest,XXL,brown|white,tree_bush,slb-nisaetus-cirrhatus,no,drafter,forest-eagles
t235,10,intermediate,forest,XXXL,white|brown,perched_open,slb-nisaetus-cirrhatus,no,drafter,forest-eagles
t236,2,wet_midhill,forest,XXXL,brown|white,aerial,slb-nisaetus-kelaarti,no,drafter,forest-eagles
t237,12,arid_coast_north,freshwater,XXL,brown|white,aerial,slb-circus-aeruginosus,no,drafter,harriers
t238,1,dry_lowland,open_country,XXL,grey|black|brown,aerial,slb-circus-aeruginosus,no,drafter,harriers
t239,2,arid_coast_north,open_country,XL,grey|black|white,aerial,slb-circus-pygargus,no,drafter,harriers
t240,11,arid_coast_north,open_country,XL,brown|rufous,aerial,slb-circus-pygargus,no,drafter,harriers
t241,1,dry_lowland,open_country,XL,grey|rufous|black,aerial,slb-falco-tinnunculus,no,drafter,falcons
t242,7,montane,open_country,XL,rufous|brown|white,perched_open,slb-falco-tinnunculus,no,drafter,falcons
t243,5,montane,open_country,XL,grey|black|rufous,aerial,slb-falco-peregrinus,no,drafter,falcons
t244,3,dry_lowland,open_country,XL,grey|white|black,perched_open,slb-elanus-caeruleus,no,drafter,
t245,9,intermediate,open_country,XL,grey|white|black,aerial,slb-elanus-caeruleus,no,drafter,
t246,6,wet_lowland,town_garden,XXL,brown,aerial,slb-milvus-migrans,no,drafter,brown-kites
t247,6,wet_lowland,coast,XXL,brown,aerial,slb-haliastur-indus,no,drafter,brown-kites
t248,8,wet_lowland,forest,L,grey|white|rufous,tree_bush,slb-tachyspiza-virgata,no,drafter,accipiters
t249,4,wet_midhill,forest,XL,brown|white,tree_bush,slb-tachyspiza-virgata,no,drafter,accipiters
t250,10,wet_lowland,forest,XL,brown|white,tree_bush,slb-lophospiza-trivirgata,no,drafter,accipiters
t251,1,intermediate,town_garden,L,grey|rufous,tree_bush,slb-tachyspiza-badia,no,drafter,accipiters
t252,3,dry_lowland,forest,M,brown|white,perched_open,slb-glaucidium-radiatum,no,drafter,small-owls
t253,7,wet_lowland,forest,M,rufous|brown|white,tree_bush,slb-glaucidium-castanotum,no,drafter,small-owls
t254,2,wet_lowland,town_garden,L,brown|grey,tree_bush,slb-otus-bakkamoena,no,drafter,small-owls
t255,5,dry_lowland,forest,M,rufous,tree_bush,slb-otus-sunia,no,drafter,small-owls
t256,11,dry_lowland,forest,M,grey|brown,tree_bush,slb-otus-sunia,no,drafter,small-owls
t257,1,wet_lowland,forest,S,rufous|black,tree_bush,slb-otus-thilohoffmanni,no,drafter,small-owls
t258,9,wet_lowland,town_garden,XL,brown|white|yellow,perched_open,slb-ninox-scutulata,no,drafter,
t259,4,dry_lowland,open_country,XL,white|brown|grey,aerial,slb-tyto-javanica,no,drafter,
t260,6,wet_lowland,forest,XXL,brown|white,tree_bush,slb-strix-leptogrammica,no,drafter,large-owls
t261,2,dry_lowland,forest,XXL,brown|white,tree_bush,slb-ketupa-nipalensis,no,drafter,large-owls
t262,8,dry_lowland,freshwater,XXL,brown|white|yellow,tree_bush,slb-ketupa-zeylonensis,no,drafter,large-owls
t263,10,wet_lowland,forest,L,rufous|brown,tree_bush,slb-batrachostomus-moniliger,no,drafter,nightjars
t264,3,dry_lowland,open_country,M,brown|grey|white,ground,slb-caprimulgus-asiaticus,no,drafter,nightjars
t265,5,intermediate,open_country,L,brown|rufous|white,perched_open,slb-caprimulgus-atripennis,no,drafter,nightjars
t266,12,wet_midhill,forest,L,grey|brown|white,aerial,slb-caprimulgus-indicus,no,drafter,nightjars
t267,7,wet_lowland,forest,L,grey|brown,tree_bush,slb-batrachostomus-moniliger,no,drafter,nightjars
t268,1,wet_lowland,coast,XXXL,white|grey|black,aerial,slb-icthyophaga-leucogaster,no,drafter,fish-eagles
t269,11,dry_lowland,open_country,XXL,brown,perched_open,slb-milvus-migrans,no,drafter,brown-kites
```

The scenarios I expect to be weakest:
- t234 (Changeable adult) vs Legge's (same colours, XXXL) and Crested Goshawk adult (brown/white, XXL, forest,
  tree_bush). t236 (Legge's) vs Changeable, which is commoner in WM. **Legge's is the likeliest top-3 miss.**
- t260 (Wood-owl) vs Eagle-owl: identical answers in WL. t261 (Eagle-owl, DL) vs Brown Fish-owl (DL common).
- t246, t269 (Black Kite brown) vs juvenile Brahminy Kite, juvenile harriers and juvenile Black Eagle.
- t254 (Indian Scops-owl) vs Jungle Owlet; t252 (Jungle Owlet) vs Indian Scops-owl and Boobook.
- t226 (juvenile Sea-eagle) vs juvenile Osprey and juvenile hawk-eagles.
- t249 (Besra female) vs Crested Goshawk: identical brown/white, forest, tree_bush, both XL.

Scarce targets, which are reported but not gated: t236 (Legge's), t257 (Serendib), t261 (Eagle-owl).

---

## 5. Workbook doubts (for `workbook-doubts.csv`). Nothing has been changed.

```csv
species_id,field,doubt,suggested_source
slb-circus-aeruginosus,species_description,Says adult male is pale grey with black wing tips; I believe adult male aeruginosus has a brown back and belly with grey wings and tail (pale grey fits Pallid or Montagu's). Tagged grey and black from the wb plus brown (expert),Warakagoda et al. 2012; Rasmussen & Anderton 2012
slb-milvus-migrans,sri_lanka_distribution_and_hotspots,Says regularly seen over Colombo and other urban areas; I believe the resident govinda is local and uncommon and Brahminy Kite is the usual Colombo kite. Cannot cite. Zones kept at medium,CBC Sri Lanka Bird List v3 (2022); dated CBC records
slb-pandion-haliaetus,seasonality_months_seen,Code M but months broadly June-April; suggests regular oversummering. Months drafted from the wb only; code not changed,CBC Sri Lanka Bird List v3 (2022)
slb-spilornis-cheela,species_description,Length about 55-75 cm looks range-wide; Sri Lankan spilogaster may be smaller. XXXL row kept at medium,Warakagoda et al. 2012
slb-lophotriorchis-kienerii,species_description,Says dark brown above; in life the hood and upperparts look blackish. Minor. Tagged brown from the wb,Warakagoda et al. 2012
slb-falco-tinnunculus,sri_lanka_distribution_and_hotspots,Places the species in the lowlands only; I believe resident birds are mainly in the hills (cliffs and grassland). Montane added as expert medium,CBC Sri Lanka Bird List v3 (2022); dated CBC records
```

**Length gaps (not doubts, recorded for the workbook owner):** `species_description` has no length for Black-winged
Kite or Besra. The rows use cited `ext:` lengths (1a).

**Sinhala and plate-title notes (shown as-is, not changed):**
- Common Kestrel `names.si` is "තහවුරු කළ යුතුයි" (already on the spec's list of 7).
- Spot-bellied Eagle-owl "මහ බකමූණා / උලමා" and Brown Fish-owl "මහ බකමූණා" share "මහ බකමූණා". Please confirm both
  are intended.
- Plate titles that differ from the species' `names.si`: plate-20 "මොන්ටගු හරිකුස්සා" vs Montagu's Harrier
  "අළු වගුරු උකුස්සා"; plate-21 "කළු පියාකුස්සා" vs Black Kite "කළු උකුස්සා"; plate-23 "ශ්‍රී ලංකා මැඩිමුහුණා" vs
  Sri Lanka Frogmouth "ගෙඹිතුඩියා"; plate-24 "කඳුකර බිම්බස්සා" vs Jungle Nightjar "කදුර බිම්බස්සා".
- Jerdon's Nightjar "පෙඳදිග බිම්බස්සා": a native reviewer should check the first word.

A native reviewer should say which forms are intended.

---

## 6. Sensitive-species candidates (for `sensitive-species.csv`). Owner decides.
Already listed: Serendib Scops-owl, Spot-bellied Eagle-owl and Legge's Hawk-eagle (`obscure_location`). Their CSV
notes and sheet blocks name no site below zone level.

| species_id | Reason | My recommendation |
|---|---|---|
| slb-batrachostomus-moniliger | Long-used day roosts; birders and photographers seek them (the wb warns against flushing) | add (`obscure_location`) |
| slb-glaucidium-castanotum | Endemic, NT, small wet-zone range | add |
| slb-lophotriorchis-kienerii | NT; scarce forest eagle; nest trees are sensitive | add |
| slb-icthyophaga-ichthyaetus | NT; nests in large trees at tanks | add |
| slb-falco-peregrinus | Resident Shaheen eyries on cliffs | consider |
| slb-strix-leptogrammica, slb-ketupa-zeylonensis | Known day roosts | consider |
| all other raptors and owls | Nests are rarely public, but they are disturbance-sensitive | do not list each one. Prefer a general rule that no note or credit names a raptor or owl nest or roost. |

I kept site names out of the CSV notes for the 3 listed species and for the Frogmouth. For other species I quoted the
wb's sites (national parks, wetlands, forest reserves), as in batches 1-4. The workbook prose already shipped in
`species-text.json` names sites for Serendib Scops-owl, Legge's Hawk-eagle and Spot-bellied Eagle-owl. This raises
the same open question as batches 1, 3 and 4: does the "no site finer than zone" rule cover the displayed workbook
prose too?

---

## 7. Questions for the owner
1. **Doubts (section 5):** do you accept the 6 doubts for `workbook-doubts.csv`, especially Marsh-harrier male and
   Black Kite abundance?
2. **Peregrine colours:** the cap allows 3. Keep rufous (resident Shaheen, which most people see in the hills) or use
   white (migrant *calidus*, seen on the coast)? A second set would need a `morph_` key, which is not really a morph.
3. **Kestrel montane zone** (expert, medium): keep it, or follow the wb (lowlands only)?
4. **Serpent-eagle XXXL row:** keep it (wb range) or drop it after a regional-guide check?
5. **Scenario mix:** this batch reaches only 38% common targets. Accept a lower common share for the raptor and owl
   batch, or should more common-target scenarios be written (ideally by you or a guide, which also fixes the 20%
   `other` gap)?
6. **Sensitive list (section 6):** add the 4 "add" species, and adopt a general "no raptor or owl nest or roost" rule?
7. **t12 (Koel female) vs Brown Boobook:** if the original-25 gate fails, do you prefer a slice-9 tie-break, or
   keeping Boobook `town_garden` at medium? (It is `high` from the wb today.)

---

## 8. Validator notes
- I could **not** run `npm run traits:review-sheet -- --batch 5`, `npm run validate:content`, jest or git (no shell
  in this session). `traits-review/batch-05.md` was **written by hand to match `renderBatchSheet`** in
  `tools/content/review-sheet.ts`. Regenerate it with the command before committing; CI fails if a single character
  differs.
- I checked the rows by hand against `tools/content/traits.ts`:
  - vocabulary values;
  - plumage keys (`adult`, `juvenile`, `male`, `female`, `morph_rufous`, `morph_grey`);
  - ≤ 3 colours per key;
  - no blank and named keys mixed for colour, and size is always blank-keyed;
  - no `all` mixed with months;
  - every zone row has exactly one commonness row (106 = 106);
  - no duplicates;
  - no row has more than 8 fields, and no note has a comma, quote or `|`.
- Batches 1-4 (PRs #115, #121, #123 and the batch-4 draft) are not on `main`. Their rows and plan lines will conflict
  textually with these appends at the end of `traits.csv` and `traits-plan.csv`. Merge one at a time and rebase, as
  the spec says.
