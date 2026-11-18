# Trait vocabulary (step-by-step ID, M5 pilot)

Owner: ornithologist. Status: **proposed**. Every Sinhala label below is a **DRAFT** written by
the ornithologist and must be checked by a bilingual reviewer before it ships. English labels
follow `docs/product/02-identification-design.md` §1.

Validation applies to `data/content/traits.csv` and `data/content/id-test-sightings.csv`.
Codes are case-sensitive.

## CSV columns (`traits.csv`)

`species_id,trait,value,plumage_key,source,confidence,review_status,note`

- `species_id`: must exist in `content/content.json`. A species ships in `traits.json` only when it is listed in
  `data/content/traits-batches.csv` (the ledger, spec 006; batch 0 is the 34 pilot species). Each of the seven
  traits then has a `reviewed` row or is named in the ledger's `unknown_traits` (`trait` or `trait:plumage_key`,
  `|`-separated), never both. `data/content/traits-pilot.csv` is historical: the original pilot list, no longer read.
- `trait`: one of `zone`, `habitat`, `size`, `colour`, `behaviour`, `month`, `commonness`.
- `plumage_key`: blank (the row applies to every plumage), or one of `male`, `female`,
  `juvenile`, `adult`, `breeding`, `non_breeding`, `eclipse`, `morph_<name>` (pilot uses
  `morph_white`, `morph_dark`). Used with `colour` and `size` only. All other traits leave it blank.
- `source`: `workbook:<column>` (the Identification/Distribution column the value was read from,
  e.g. `workbook:species_description`), `ext:<name>` (a named external reference, e.g.
  `ext:wikipedia/Indian_peafowl`), or `expert:ornithologist` (my field knowledge. These values are
  unverified and need confirming against Warakagoda et al. 2012 or eBird).
- `confidence`: `high` | `medium` | `low`.
- `review_status`: `proposed` | `reviewed`. Everything in the pilot is `proposed`.
- `note`: free text. Notes use `;` rather than `,`, so no CSV quoting is needed.

## zone (question 1, "Where in Sri Lanka?")

| value | English | Sinhala (DRAFT) |
|---|---|---|
| `wet_lowland` | Wet lowlands (Colombo, Galle, Sinharaja) | තෙත් කලාප පහතරට |
| `wet_midhill` | Wet mid-hills (Kandy, Kitulgala) | තෙත් කලාප මැදකඳුකරය |
| `montane` | Montane (Nuwara Eliya, Horton Plains) | උඩරට කඳුකරය |
| `intermediate` | Intermediate zone | අතරමැදි කලාපය |
| `dry_lowland` | Dry lowlands (Anuradhapura, Yala, Wilpattu) | වියළි කලාප පහතරට |
| `arid_coast_north` | Arid coast & north (Mannar, Jaffna, Puttalam, Hambantota) | ශුෂ්ක වෙරළ සහ උතුර |

Mapping rule I used: Bundala, Tissa and Chilaw count as `arid_coast_north`, and Yala counts as
`dry_lowland` (per the §1 examples). The zone polygons are still undecided (§1), and those
choices will shift the edges.

## habitat (question 2, "Where was it?")

| value | English | Sinhala (DRAFT) |
|---|---|---|
| `town_garden` | Town / garden | නගරය / ගෙවත්ත |
| `forest` | Forest | වනාන්තරය |
| `open_country` | Open country / paddy / scrub | විවෘත බිම් / කුඹුරු / පඳුරු |
| `freshwater` | Fresh water (tank, marsh, river) | මිරිදිය (වැව, වගුරු, ගඟ) |
| `coast` | Coast (beach, lagoon, mudflat, saltpan, sea) | වෙරළ (කලපුව, මඩ තලාව, ලුණු ලේවාය, මුහුද) |

Paddy fields are tagged `open_country`, as in §1. Paddy birds that are also on water get `freshwater` too.

## size (question 3, "How big?")

| value | Range (cm) | Reference pilot species (`names.en`) | Reference `names.si` (verbatim from content.json) | Class label, Sinhala (DRAFT) |
|---|---|---|---|---|
| `XS` | < 12 | Purple Sunbird · Purple-rumped Sunbird | දම් කුඩුකොන් · මහ දම් කුඩුකොන් | ඉතා කුඩා |
| `S` | 12 to < 17 | House Sparrow | ගේකුරුල්ලා | කුඩා |
| `M` | 17 to < 22 | Red-vented Bulbul · Oriental Magpie-robin | කොණ්ඩයා · පොල්කිච්චා | මධ්‍යම |
| `L` | 22 to < 30 | Common Myna · White-throated Kingfisher | මයිනා · පිළිහුඩුවා | තරමක් විශාල |
| `XL` | 30 to < 45 | House Crow · Red-wattled Lapwing | කොළඹ කපුටා · කිරලා | විශාල |
| `XXL` | 45 to < 70 | Indian Pond-heron · Eastern Cattle Egret | කණ කොකා · එළ ගව කොකා | ඉතා විශාල |
| `XXXL` | ≥ 70 | Indian Peafowl | මොනරා | අති විශාල |

Reference birds must be pilot species whose size rows fall in **only** that class. The UI label
is the class label plus the reference names, which are taken from content.json at build time.
The pairs are owner-approved. Indian Pond-heron uses the species entry "කණ කොකා", not the
plate title "කණ-කොකා". Peafowl's class comes from an external length (flag F2).

**Rule:** each class is lower-bound inclusive, so 45 cm is `XXL`. Size comes from the workbook's
`length_cm` range in `species_description`. A species gets **one row per class that its min–max
range touches** (e.g. Shikra 26–36 cm gives `L` and `XL`). Sexes of different size get rows keyed by
`plumage_key`. Lengths exclude tail streamers where the workbook says so. Only the class
labels (ඉතා කුඩා …) are drafts; the reference names are copied from content.json unchanged.

## colour (question 4, pick up to 3)

| value | English | Sinhala (DRAFT) |
|---|---|---|
| `black` | Black | කළු |
| `white` | White | සුදු |
| `grey` | Grey | අළු |
| `brown` | Brown | දුඹුරු |
| `rufous` | Rufous / chestnut | තඹ / පිඟු දුඹුරු |
| `orange` | Orange | තැඹිලි |
| `yellow` | Yellow | කහ |
| `green` | Green | කොළ |
| `blue` | Blue | නිල් |
| `purple` | Purple / glossy | දම් / දිලිසෙන |
| `red` | Red | රතු |
| `pink` | Pink | රෝස |

**Rules:**
- At most **3 colours per species per plumage_key**: the ones a beginner notices first. Large
  body areas come before small bare parts. Accents left out because of the cap are recorded in `note`.
- Term mapping from the prose: olive → `green`; chestnut, maroon and bay → `rufous`; slate and
  ash → `grey`; buff → `brown` or `white`, whichever dominates; golden → `yellow`; glossy
  blue-black → `black`, unless the gloss is the main impression (sunbirds) → `purple`.
- A blank `plumage_key` means the colours apply to all plumages (sexes alike).

## behaviour (question 5, "What was it doing?")

| value | English | Sinhala (DRAFT) |
|---|---|---|
| `ground` | On the ground | බිම මත |
| `swimming` | Swimming | පිහිනමින් |
| `wading` | Wading in shallows / mud | නොගැඹුරු ජලයේ / මඩේ ඇවිදිමින් |
| `tree_bush` | In a tree or bush | ගසක හෝ පඳුරක |
| `perched_open` | Perched in the open (wire, post, bare branch) | විවෘතව වාඩි වී (වයරය, කණුව, හිස් අත්ත) |
| `aerial` | Flying / soaring overhead | ඉහළින් පියාසර කරමින් |

§3 calls this field `where_seen`. In the CSV it is `behaviour`, as the brief asks. The §3
`primary` flag is not carried in the pilot.

## month (question 0, automatic)

| value | Meaning | Sinhala (DRAFT) |
|---|---|---|
| `all` | Present in all 12 months | වසර පුරා |
| `1` … `12` | Present in that month | ජනවාරි, පෙබරවාරි, මාර්තු, අප්‍රේල්, මැයි, ජූනි, ජූලි, අගෝස්තු, සැප්තැම්බර්, ඔක්තෝබර්, නොවැම්බර්, දෙසැම්බර් |

**Rule:** a species has either one `all` row, or one row per month present. Never both. `all` is
used only when the workbook seasonality says resident / year-round (this includes R/M and R+M
species, whose resident populations are present all year). Migrants list their months from the
workbook. Edge months get `medium` or `low` confidence. Absent months simply have no row. A species
with no month rows means "unknown" and is neutral in scoring.

## commonness (tie-breaker; spec 004)

Value format: `<zone>:<level>`, where `<zone>` is one of the zone codes above and `<level>` is one of:

| level | English | Sinhala (DRAFT) |
|---|---|---|
| `common` | Common: expected on most visits to suitable habitat | බහුලයි |
| `uncommon` | Uncommon: regular but needs some luck or the right site | අඩුවෙන් දක්නට ලැබේ |
| `scarce` | Scarce: few records; a surprise | දුර්ලභයි |

**Rules:**
- Exactly one `commonness` row for every `zone` row of the species. No commonness row exists
  for a zone the species is not tagged in.
- For migrants, the level means "in season". Out-of-season handling comes from `month`.
- Source is the workbook where its prose says "common" or "very common". Everywhere else it is
  `expert:ornithologist`. Per owner decision these are reviewed expert ratings, not eBird
  frequencies.

## Changes vs design doc §1 / §3

1. `source` uses `workbook:<column>` / `ext:<name>` / `expert:ornithologist` (brief format)
   instead of §3's `wb:<Sheet>.<column>` / `ext:` / `expert:`.
2. `plumage_key` morph format is `morph_<name>` (brief), not `morph:<name>`. `immature` is not
   used in the pilot.
3. `size` is stored as class rows (XS…XXXL) instead of the §3 `length_cm_min/max` plus a derived
   class. Raw cm values are quoted in `note`.
4. `month` stores presence only (`all` or 1–12). The §3 per-month status values
   (`peak`/`scarce`/`absent`/`unknown`) are not used yet. Edge months use confidence instead.
5. `zone` rows carry no `regular/local/scarce` status. The `commonness` trait replaces it.
6. `commonness` is new (owner decision, spec 004). The §3 colour `prominence` (main/accent) is
   replaced by the 3-colour cap.
