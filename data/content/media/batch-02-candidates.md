# Batch 2 photo candidates (M8, spec 006)

Status: **approved by the owner on 2026-11-27**. No images were downloaded into the repo, no `.webp` files were created and `licences.csv` was not edited. The owner reviews every candidate before any row is added.

Species: the 33 batch-2 species (plates 7 to 11), taken from the batch-2 traits review sheet (`data/content/traits-review/batch-02.md`, PR #121). None is on `sensitive-species.csv`, but three are treated as sensitive here (locality given at zone level only): **Indian Swiftlet** (cave nest colonies), **Great Stone-curlew** (few, ground-nesting on river and coast sandbars), **Slaty-legged Crake** (scarce, secretive). The owner may want to add them to `sensitive-species.csv`.

How these were checked (same practice as batch 1 and the M2 pilot):
- **Licence and author.** Read from the Wikimedia Commons API (`extmetadata`: Artist, LicenseShortName) or the iNaturalist API (`photos.license_code`, `attribution`), which is the metadata of the file page itself. Re-check the file page at ingest time.
- **Visual review.** I looked at a preview of every candidate marked "viewed". ID and plumage come from field marks in the image, backed by research grade and agreement count on iNat. Rows marked "not viewed" are fallbacks only.
- **Rejected.** Watermarked images and wrong-plumage labels.
- **Pixel size.** iNat originals were not measured (the API returns no dimensions). Many are ≤ 2048 px.
- **Plumage order.** Migrant shorebirds: non-breeding first; breeding only where the traits sheet keys it (seen on arrival or departure).
- **Licence URLs.** CC0 1.0: https://creativecommons.org/publicdomain/zero/1.0/ · CC BY 4.0: https://creativecommons.org/licenses/by/4.0/ · CC BY-SA 4.0: https://creativecommons.org/licenses/by-sa/4.0/ · CC BY-SA 3.0: https://creativecommons.org/licenses/by-sa/3.0/ · CC BY-SA 2.0: https://creativecommons.org/licenses/by-sa/2.0/ · CC BY 2.0: https://creativecommons.org/licenses/by/2.0/ · CC BY-NC 4.0: https://creativecommons.org/licenses/by-nc/4.0/ (iNat "cc-by-nc"; confirm the version on the photo page).

Confidence: **High** = diagnostic marks clearly visible; **Medium** = correct, but a mark is hidden or there is a quality issue; **Low** = fallback only.

## Summary

| # | Species | Plumages | Candidates found (viewed) | Gaps / weak |
|---|---|---|---|---|
| 1 | Indian Swiftlet (sensitive) | adult | 2 (SL, CC BY) | Flight shots only; zone-level locality |
| 2 | Alpine Swift | adult | 3 (SL, CC BY) | – |
| 3 | Brown-backed Needletail | adult | 2 (India CC0; SL silhouettes) | Medium only; bird small in frame |
| 4 | Little Swift | adult | 2 (SL) | Medium: soft flight shot; alt is at a nest |
| 5 | Asian Palm-swift | adult | 2 (SL, CC BY) | – |
| 6 | Crested Treeswift | male, female | male 3, female 2 | Best SL pair are **Commons crops that remove a watermark** (owner decision); open alts are Thailand (male) and an Indian composite (female) |
| 7 | Sri Lanka Swallow (E) | adult | 3 (all SL) | – |
| 8 | Hill Swallow | adult | 2 (SL, CC BY) | – |
| 9 | Watercock | male, female | male 3, female 2 | Good male and female are Indian; SL male is in moult |
| 10 | Common Moorhen | adult, juvenile | adult 2 (SL), juvenile 1 (England) | No SL juvenile |
| 11 | Slaty-legged Crake (sensitive) | adult | 1 (SL, CC BY) | Single medium photo; zone-level locality |
| 12 | Purple Swamphen | adult, juvenile | adult 2 (SL, grey-headed form) | **Juvenile: none** |
| 13 | Eurasian Coot | adult, juvenile | adult 1 (India), juvenile 1 (Turkey) | No usable SL photo (the only one is watermarked) |
| 14 | Great Stone-curlew (sensitive) | adult | 2 (SL, location hidden) | – |
| 15 | Indian Stone-curlew | adult | 2 (SL, CC BY) | – |
| 16 | Crab Plover | adult, juvenile | adult 2 (India) | **Juvenile: none**; no open SL photo |
| 17 | Black-winged Stilt | adult | 2 (SL) | – |
| 18 | Pied Avocet | adult | 2 (India) | Both SL photos watermarked |
| 19 | Yellow-wattled Lapwing | adult | 2 (SL, CC BY) | – |
| 20 | Eurasian Oystercatcher | adult (non-breeding) | 2 (Belgium; SL flight) | SL photo is distant |
| 21 | Grey Plover | non_breeding, breeding | non-breeding 1 (SL CC0), breeding 1 (USA) | CC0 file needs a full-size watermark check |
| 22 | Common Ringed Plover | adult (non-breeding) | 2 (France, Zanzibar) | No open SL record |
| 23 | Kentish Plover | breeding, non_breeding | breeding 2, non-breeding 1 (all SL) | Breeding = resident *seebohmi* (July/June birds) |
| 24 | Little Ringed Plover | breeding, non_breeding | breeding 2, non-breeding 1 (all SL) | Non-breeding medium (still fairly dark) |
| 25 | Greater Sand-Plover | non_breeding, breeding | non-breeding 2 (SL CC0; India), breeding 1 (England) | **Breeding weak** (worn bird) |
| 26 | Siberian Sand-Plover | non_breeding, breeding | non-breeding 2 (SL), breeding 1 per taxon option | **Taxonomy doubt: all SL records on iNat are Tibetan Sand-Plover**; breeding photo depends on the decision |
| 27 | Greater Painted-snipe | female, male | female 2, male 2 (India, S. Africa) | No usable SL photo (birds hidden) |
| 28 | Pheasant-tailed Jacana | breeding, non_breeding | breeding 2 (SL), non-breeding 1 (Kerala) | No SL non-breeding |
| 29 | Pin-tailed Snipe | adult | 2 (SL, CC BY) | Species ID not confirmable from photos (vs Common Snipe) |
| 30 | Black-tailed Godwit | non_breeding, breeding | non-breeding 1 (SL), breeding 1 (England) | Breeding bird partly moulted |
| 31 | Bar-tailed Godwit | adult (non-breeding) | 1 (SL CC0) | iNat ID appears under both godwits; check before use |
| 32 | Eurasian Curlew | adult | 3 (India, Bahrain) | A Commons label error found (curlew filed as Whimbrel) |
| 33 | Eurasian Whimbrel | adult | 3 (SL flight, SL soft, India) | No sharp standing SL bird |

Totals: 33 species, 33 with at least one viewed candidate. **2 plumage gaps** with no acceptable candidate (Purple Swamphen juvenile, Crab Plover juvenile). **3 weak or conditional fills** (Crested Treeswift female needs the watermark-crop decision or uses a composite; Greater Sand-Plover breeding is a worn bird; Siberian Sand-Plover breeding depends on the taxon decision). No CC BY-NC candidate is proposed. The one endemic (Sri Lanka Swallow) has 3 Sri Lankan photos. 16 species have a Sri Lankan main photo for every plumage.

## Gaps and owner decisions

1. **No acceptable candidate:** Purple Swamphen juvenile; Crab Plover juvenile. Next steps: check CC BY-NC SL records (owner allows NC with the "replace before launch" flag), or ask Sri Lankan photographers (Mannar crab plover flocks hold many juveniles in winter).
2. **Taxonomy doubt, Siberian Sand-Plover (`slb-anarhynchus-mongolus`):** iNat places all 30 open SL sand-plover records in **Tibetan Sand-Plover (*A. atrifrons*)**, none in Siberian. I believe Sri Lanka's wintering birds are mainly the Tibetan group, but I am not certain whether Siberian is confirmed for Sri Lanka. **Confirm with the CBC checklist, Avibase and eBird** before ingesting. Non-breeding SL photos are usable either way; the breeding photo must match the decision. This should be added to `workbook-doubts.csv` (not edited here). The workbook name is unchanged.
3. **Split-sensitive, Purple Swamphen:** Sri Lankan birds are the grey-headed form (*poliocephalus*, Grey-headed Swamphen in AviList/Clements). Both proposed photos show the grey-headed form; never use a European or Australasian swamphen photo for this species.
4. **Watermark-crop decision, Crested Treeswift:** the best male and female (Thimindu Goonatillake, CC BY-SA 2.0) are Commons "(cropped)" derivatives that cut off the photographer's watermark. The licence allows adaptation, but batch 1 rejected his watermarked files. Owner to decide: use the crops (with full attribution), ask the photographer for clean copies, or use the open alternatives (Thailand male; Indian composite female).
5. **CC0 "no rights reserved" accounts in Mannar and Bundala:** many CC0 SL shorebird photos carry a visible "© Wilmot Senaratne" watermark (rejected: Coot, Watercock female, Pied Avocet ×2, Grey Plover 2016, Greater Sand-Plover Kalpitiya). Four proposed CC0 photos showed no watermark at 500 px (Grey Plover 676393260, Little Ringed Plover 676396095, Greater Sand-Plover 676907866, Bar-tailed Godwit 676391252). **Check each at full size before ingest**, and consider confirming the CC0 intent with the account owner, as the watermark and the CC0 waiver conflict.
6. **Sensitive locations (zone level only):** I treated **Indian Swiftlet** (cave nest colonies), **Great Stone-curlew** and **Slaty-legged Crake** as sensitive. None is on `sensitive-species.csv`; I suggest the owner adds them. Their sections give zone-level places only; their iNat pages show finer places (Great Stone-curlew is already hidden on iNat), which must not be copied into credits. Two proposed photos show birds at or near nests (Little Swift alt, a common species; one rejected treeswift); the owner may prefer to avoid nest photos generally.
7. **Possible misidentifications found:**
   - iNat 535826663 (Indian Swiftlet record, south-west coast): looks like an Asian Palm-swift.
   - iNat 676391252 (Talaimannar): looks like a Bar-tailed, not a Black-tailed Godwit; the API returned it under both names.
   - Commons "Whimbrel (Numenius phaeopus) Bahrain.jpg" (Charles J. Sharp): the bird is a **Eurasian Curlew**.
   - Commons Kasambe Watercock "Male … (11)" and "(14)": filename says male, description says female.
   - Commons Charles J. Sharp "Eurasian coot juvenile" (Saint-Omer) is a downy chick.
8. **Pin-tailed Snipe ID:** I cannot confirm Pin-tailed vs Common Snipe from the photos; they are iNat research grade with 3 agreements. The owner may want an expert check or a photo showing the tail pins or underwing.
9. **Licence or metadata conflicts:** Grey-headed Swamphen juvenile (Abdullahgirach, Commons) has an "AG" logo and EXIF "All images are copyright" (rejected). The Polonnaruwa Sri Lanka Swallow file has a GIMP "Public Domain" EXIF tag; the Commons licence (CC BY-SA 4.0) governs. Older iNat records (melianie_max_and_asker, Jacky Judas) show "CC BY" without a version; confirm it on the photo page.
10. **Subspecies to confirm (I am not certain):** Alpine Swift SL form (*bakeri*?); Brown-backed Needletail (*indicus*, shared with SW India?); Common Moorhen SL ssp (*orientalis*?); Eurasian Oystercatcher winterers (*longipes*?); Common Ringed Plover winterers (*tundrae*?); Black-tailed Godwit winterers (*melanuroides* / *limosa*?); Little Ringed Plover breeding photos (*jerdoni* vs *curonicus* not separable). Kentish *seebohmi* and Curlew *orientalis* are from the workbook or the file labels. Check against Avibase or the CBC list before recording any subspecies.
11. **Not Sri Lanka (allowed for non-endemics):** Needletail main; Treeswift alts; Watercock main male and female; Moorhen juvenile; Coot (both); Crab Plover; Pied Avocet; Oystercatcher main; Grey Plover breeding; Common Ringed Plover; Greater Sand-Plover breeding and non-breeding alt; Siberian/Tibetan breeding; Painted-snipe (all); Jacana non-breeding; Black-tailed Godwit breeding; Eurasian Curlew (all); Whimbrel alt 2.
12. **Weaker fills to review first:** Needletail (small in frame), Little Swift (soft), Slaty-legged Crake (grass across), Little Ringed Plover non-breeding (still dark), Oystercatcher SL (distant), Black-tailed Godwit breeding (partly moulted), Whimbrel (flight only).

---

## 1. Indian Swiftlet (`slb-aerodramus-unicolor`) — treat as sensitive (cave nest colonies)
Plumages: **adult** (sexes alike). Locality is given at **zone level only**, even though iNat shows the place. Do not use any photo taken at a nest cave. All 6 open SL records are flight shots.
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| adult | [iNat photo 327973182](https://www.inaturalist.org/photos/327973182) (obs [187530629](https://www.inaturalist.org/observations/187530629), 2 agreements) | Griha Hasanov | CC BY 4.0 | Sri Lanka (montane / hill zone; finer place withheld) | Medium-high, viewed. Plain dark brown swiftlet, slightly paler grey-brown underparts, shallow-notched tail, wings half open, sharp | Flight shot against the sky; rump not shown; 2 agreements (swiftlet ID is mainly by range in SL) |
| adult (alt) | [iNat photo 257090528](https://www.inaturalist.org/photos/257090528) (obs [149215853](https://www.inaturalist.org/observations/149215853)) | avocat | CC BY 4.0 | Sri Lanka (wet zone; finer place withheld) | Low-medium, viewed. Shape and plain brown tone | Soft, grey sky; 1 agreement |
Rejected: iNat 474465253 and 474468932 (Mark Clarke): bird tiny in frame. iNat 535826663 (MATVEY KALACHEV, south-west coast): pale, slim, with a long thin pointed tail; it looks to me like an **Asian Palm-swift, not a swiftlet** (possible misidentification on iNat). Not viewed: avocat 257542385, 257090860.

## 2. Alpine Swift (`slb-tachymarptis-melba`)
Plumages: **adult**. Sri Lankan birds are a local resident form (I believe ssp. *bakeri*; not stated on the source, confirm against Avibase).
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| adult | [iNat photo 31887873](https://www.inaturalist.org/photos/31887873) (obs [20685765](https://www.inaturalist.org/observations/20685765), 2 agreements) | Matthew Blissett | CC BY 4.0 | Nuwara Eliya, Sri Lanka (montane) | High, viewed. Large swift from below: **white belly patch enclosed by a dark breast band**, dark vent and tail, long scythe wings. Sharp | Grey sky; the white throat is small at this angle |
| adult (alt) | [iNat photo 62548089](https://www.inaturalist.org/photos/62548089) (obs [39425676](https://www.inaturalist.org/observations/39425676), 3 agreements) | William Stephens | CC BY 4.0 | Badulla, Sri Lanka (wet mid-hill) | Medium, viewed. White belly, dark breast band | Soft, grey sky, smaller in frame |
| adult (alt 2) | [iNat photo 658529974](https://www.inaturalist.org/photos/658529974) (obs [360868722](https://www.inaturalist.org/observations/360868722), 2 agreements) | Tim | CC BY 4.0 | Moneragala, Sri Lanka | Medium, viewed. White belly, side view | Small in frame |

## 3. Brown-backed Needletail (`slb-hirundapus-giganteus`)
Plumages: **adult**. Only 2 open SL records, both silhouettes. Sri Lankan and south-west Indian birds are the same subspecies (*indicus*, as I recall; confirm), so an Indian photo is a fair stand-in.
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| adult | [Commons "Brown backed needletail-Hirundapus giganteus.jpg"](https://commons.wikimedia.org/wiki/File:Brown_backed_needletail-Hirundapus_giganteus.jpg) (3216×2122) | Davidvraju | CC0 | Not stated (uploader appears to be in India; taken 2026-01-17) | Medium, viewed. Bulky needletail shape, dark body, **white undertail "horseshoe"** and pale throat visible | Bird small in frame (crop from the 3216 px original); place not stated (owner check) |
| adult (SL alt) | [iNat photo 328909372](https://www.inaturalist.org/photos/328909372) (obs [187998486](https://www.inaturalist.org/observations/187998486)) | Griha Hasanov | CC BY 4.0 | Kandy District, Sri Lanka (wet mid-hill) | Low-medium, viewed. Two birds, heavy cigar shape, the white vent is just visible on one | Near-silhouettes against a white sky; 1 agreement |
Rejected: iNat 613055606 (dhfischer, Sinharaja edge): black silhouette. Mike Prince Commons 50965239147: tiny in frame. Not viewed: Davidvraju's other two CC0 files (same session), Kasambe (Anshi, 1025 px), TonyCastro (Thailand, a different subspecies).

## 4. Little Swift (`slb-apus-affinis`)
Plumages: **adult**. Open SL records are mostly distant flight shots or birds at nests.
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| adult | [iNat photo 264399029](https://www.inaturalist.org/photos/264399029) (obs [153109237](https://www.inaturalist.org/observations/153109237), 2 agreements) | avocat | CC BY 4.0 | Ratnapura District, Sri Lanka (wet lowland) | Medium, viewed. Small black swift, **broad white rump**, square tail | Pale grey sky, a little soft |
| adult (alt) | [iNat photo 330818616](https://www.inaturalist.org/photos/330818616) (obs [188931668](https://www.inaturalist.org/observations/188931668)) | Mayela y Ramón | CC BY-SA 4.0 | Dambulla, Sri Lanka (dry zone) | Medium, viewed. Close view: white throat, sooty body | **Bird clinging at its nest** (common species, not sensitive, but the owner may prefer to avoid nest photos); rump not visible |
Rejected: Mark Clarke 473293321 and Lasse W. 620553641 (tiny); Jan Ebr 483390183 (blurred); Wolfgang Ahlmer 741047077 (rump hidden, backlit); Jean Jacques Godon 470971687 (dark, blurred colony at a rock overhang). Not viewed: Commons PJeganathan Vontimitta series (India, CC BY-SA 4.0), a fallback if a sharper bird is wanted.

## 5. Asian Palm-swift (`slb-cypsiurus-balasiensis`)
Plumages: **adult**.
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| adult | [iNat photo 325286538](https://www.inaturalist.org/photos/325286538) (obs [186170799](https://www.inaturalist.org/observations/186170799), 2 agreements) | Griha Hasanov | CC BY 4.0 | Sri Lanka (Koppaveli, as given on iNat) | High, viewed. Slim pale grey-brown swift, very thin wings, **long deeply forked tail** (spread), sharp | Flight shot against the sky (normal for the species) |
| adult (alt) | [iNat photo 170424793](https://www.inaturalist.org/photos/170424793) (obs [101999990](https://www.inaturalist.org/observations/101999990), 3 agreements) | Andrew Simon | CC BY 4.0 | Anuradhapura, Sri Lanka (dry zone) | Medium-high, viewed. Slim shape, long forked tail | Grey sky, softer |
Not viewed: Mickey Wu Kitulgala set (3 agreements), Vihansith Kulatunga (CC BY-SA).

## 6. Crested Treeswift (`slb-hemiprocne-coronata`)
Plumages: **male, female** (the male has chestnut ear-coverts; matching the traits draft).
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| male | [Commons "Hemiprocne coronata male by Thimindu Goonatillake (cropped).jpg"](https://commons.wikimedia.org/wiki/File:Hemiprocne_coronata_male_by_Thimindu_Goonatillake_(cropped).jpg) (729×592) | Thimindu Goonatillake | CC BY-SA 2.0 | Not stated (Sri Lankan photographer; Flickr 5927196390, 2011) | High, viewed. Crest, **chestnut ear-coverts**, blue-grey body, long crossed tail | **Commons crop that removes the photographer's watermark from the original** (licence allows adaptation, but owner decision); 729 px only; place not stated |
| male (open alt) | [Commons "Hemiprocne coronata 447054079.jpg"](https://commons.wikimedia.org/wiki/File:Hemiprocne_coronata_447054079.jpg) = iNat [447054079](https://www.inaturalist.org/photos/447054079) (1800×1340) | Griha Hasanov | CC BY 4.0 | Chiang Mai, Thailand (from the file's coordinates) | High, viewed. Crest, chestnut ear-coverts, pale belly, long tail, on a wire | Not Sri Lanka (allowed for a non-endemic; species is monotypic as far as I know, confirm); wire perch |
| male (SL alt) | [iNat photo 196614529](https://www.inaturalist.org/photos/196614529) (obs [116475105](https://www.inaturalist.org/observations/116475105), 3 agreements) | desertnaturalist | CC BY 4.0 | Yala NP, Sri Lanka (dry lowland) | Medium, viewed. Shape, crest, chestnut face patch | Backlit against the sky, dull colours |
| female | [Commons "Hemiprocne coronata female by Thimindu Goonatillake (cropped).jpg"](https://commons.wikimedia.org/wiki/File:Hemiprocne_coronata_female_by_Thimindu_Goonatillake_(cropped).jpg) (842×625) | Thimindu Goonatillake | CC BY-SA 2.0 | Not stated (Flickr 5926633547, 2011) | High, viewed. Crest, dark grey face mask with thin white moustache, **no chestnut**, blue-grey body | Same watermark-crop issue; 842 px; place not stated |
| female (alt) | [Commons Shantanu Kuveskar male/female composite](https://commons.wikimedia.org/wiki/File:Crested_treeswift_(Hemiprocne_coronata)_Male_Female_Photographs_by_Shantanu_Kuveskar.jpg) (1000×666) | Shantanu Kuveskar | CC BY-SA 4.0 | Mangaon, Maharashtra, India | Medium, viewed. Side-by-side head studies: male with chestnut, female without | Two-panel composite (crop the right panel for the female, ~500 px); head only |
Rejected: the uncropped Thimindu originals (watermark "© Thimindu Goonatillake flickr.com/thimindu"). Griha Hasanov iNat 325793367 (SL): head-on, sex not determinable. Nilgala CC0 714446571: bird sits behind a lump on the branch that may be its tiny nest; sex unclear. Christoph Moning 92417529 and Wolfgang Ahlmer 737746486: distant flight shots. J.M. Garg files (watermark policy from the pilot). **No open, unwatermarked Sri Lankan female found.**

## 7. Sri Lanka Swallow (`slb-cecropis-hyperythra`) — endemic, SL photos only
Plumages: **adult** (sexes alike).
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| adult | [Commons "Cecropis hyperythra, Polonnaruwa, Sri Lanka 1.jpg"](https://commons.wikimedia.org/wiki/File:Cecropis_hyperythra,_Polonnaruwa,_Sri_Lanka_1.jpg) (1600×1200) | mayela_y_ramon | CC BY-SA 4.0 | Polonnaruwa, Sri Lanka (dry zone) | High, viewed. Two birds on gravel: glossy dark blue upperparts and cap, **deep rufous underparts and cheeks**, rufous rump just visible, long tail streamers | Two birds overlap (keep as a pair or crop the front bird). The file's embedded EXIF has a GIMP "Public Domain" tag; the Commons licence (CC BY-SA 4.0) governs, re-check at ingest |
| adult (alt) | [Commons "Cecropis hyperythra 62169697.jpg"](https://commons.wikimedia.org/wiki/File:Cecropis_hyperythra_62169697.jpg) (2048×1537) | William Stephens | CC BY 4.0 | Sri Lanka (place not given on Commons; iNat source) | High, viewed. Wings raised: entirely rufous underparts **and rufous underwing coverts**, dark blue cap, on a roof | Roof-sheet perch; back hidden |
| adult (alt 2) | [iNat photo 544541174](https://www.inaturalist.org/photos/544541174) (obs [302161104](https://www.inaturalist.org/observations/302161104), 3 agreements) | MATVEY KALACHEV | CC BY 4.0 | Matara, Sri Lanka (wet lowland) | Medium-high, viewed. Flight from below: rufous underparts and underwing, deep fork | Flight view only |
Also viewed: [Commons Tero Linjama 447544947](https://commons.wikimedia.org/wiki/File:Cecropis_hyperythra_447544947.jpg) (CC0, Sri Lanka): blue back and rufous rump on a wire, medium (small, from behind), a good CC0 fallback for the rump. William Stephens iNat 62546154 (Kandy): SL Swallow beside a juvenile Barn Swallow on a wire (a useful comparison, but two species in one frame). Rejected: Olga Bobrovskaya 558200661 (small, white sky); Daniel Benák 244251271 (motion blur).

## 8. Hill Swallow (`slb-hirundo-domicola`)
Plumages: **adult**. Sri Lankan and south Indian birds are *domicola* (treated as a species by some lists, otherwise a subspecies of Pacific Swallow *H. tahitica*). Use SL or south Indian photos only.
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| adult | [iNat photo 31887977](https://www.inaturalist.org/photos/31887977) (obs [20685787](https://www.inaturalist.org/observations/20685787), **6 agreements**) | Matthew Blissett | CC BY 4.0 | Nuwara Eliya, Sri Lanka (montane) | High, viewed. **Rufous forehead and throat, glossy blue-black crown and back, dusky grey-brown underparts** (no breast band), standing on mud | None notable |
| adult (alt) | [iNat photo 62545796](https://www.inaturalist.org/photos/62545796) (obs [39424505](https://www.inaturalist.org/observations/39424505), 2 agreements) | William Stephens | CC BY 4.0 | Panvila, Kandy, Sri Lanka (wet mid-hill) | Medium-high, viewed. Two birds on a wire: rufous face and throat, dusky underparts, short tail | Wire perch; one bird a little fluffed |
Not viewed: Christoph Moning (Matale, 6 photos), Judy Gallagher (Horton Plains, CC BY-SA), several CC0 Horton Plains records.

## 9. Watercock (`slb-gallicrex-cinerea`)
Plumages: **male** (breeding: slate-black with red frontal shield), **female** (brown, scaly; the non-breeding male is similar). Only 5 open SL records; the best SL male is in moult.
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| male | [Commons Tisha Mukherjee 04](https://commons.wikimedia.org/wiki/File:Watercock_in_Bhigwan_August_2025_by_Tisha_Mukherjee_04.jpg) (6000×4000) | Tisha Mukherjee | CC BY-SA 4.0 | Bhigwan, Maharashtra, India | High, viewed. Breeding male: slate-black body with buff-fringed wing feathers, **red frontal shield and horn**, yellow bill tip, greenish legs, full bird | Not Sri Lanka (allowed for a non-endemic) |
| male (alt) | [Commons Kasambe DSCN7229 (1)](https://commons.wikimedia.org/wiki/File:Watercock_Gallicrex_cinerea_male_by_Dr._Raju_Kasambe_DSCN7229_(1).jpg) (3018×2092) | Dr. Raju Kasambe | CC BY-SA 4.0 | Dombivli, Thane, Maharashtra, India | High, viewed. Same marks, in tall grass | Legs hidden in grass |
| male (SL alt) | [iNat photo 113036707](https://www.inaturalist.org/photos/113036707) (obs [69638168](https://www.inaturalist.org/observations/69638168), 5 agreements) | Eamon Corbett | CC BY 4.0 | Hambantota District, Sri Lanka | Medium, viewed. Male moulting into breeding dress: dark slate head and neck, scaly wings, yellowish bill | **Red shield not visible** (moult); in grass |
| female | [Commons Kasambe "Female … DSCN5823 (10)"](https://commons.wikimedia.org/wiki/File:Watercock_Gallicrex_cinerea_Female_by_Dr_Raju_Kasambe_DSCN5823_(10).jpg) (4608×3456) | Dr. Raju Kasambe | CC BY-SA 4.0 | Thane district, Maharashtra, India | High, viewed. Buff-brown, scaly dark-centred upperparts, plain buff face and neck, yellow bill, wading | Grass across the front |
| female (alt) | [Commons "Watercock Gallicrex cinerea female by Vedant Kasambe.jpg"](https://commons.wikimedia.org/wiki/File:Watercock_Gallicrex_cinerea_female_by_Vedant_Kasambe.jpg) (2647×1636) | Vedant Raju Kasambe | CC BY-SA 4.0 | Not stated (India likely) | Medium-high, viewed. Walking on stems, full bird, scaly upperparts | Slightly soft; place not stated |
Rejected: iNat 698044806 (CC0, Bundala): **watermark "© Wilmot Senaratne - 2018"**. Kasambe "Male … DSCN5823 (11)" and "(14)": filename says male but the description says female (label conflict; not used). Not viewed: spacegecko 348177190 (Hambantota, 2 agreements; URL failed), avocat 260942832.

## 10. Common Moorhen (`slb-gallinula-chloropus`)
Plumages: **adult, juvenile**. The Sri Lankan subspecies is not stated on the source (I believe *orientalis*; confirm). Juveniles look much alike across the range, so a European juvenile is a fair stand-in.
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| adult | [iNat photo 62657262](https://www.inaturalist.org/photos/62657262) (obs [39488270](https://www.inaturalist.org/observations/39488270), 5 agreements) | William Stephens | CC BY 4.0 | Hambantota, Sri Lanka | Medium-high, viewed. Swimming: slate-black body, **red shield and bill with yellow tip**, white flank line just visible, by a lotus leaf | Undertail not shown; plants in the foreground |
| adult (alt) | [iNat photo 329289465](https://www.inaturalist.org/photos/329289465) (obs [188186507](https://www.inaturalist.org/observations/188186507), 3 agreements) | Griha Hasanov | CC BY 4.0 | Ruhunupura, Hambantota, Sri Lanka | Medium-high, viewed. Two adults swimming: red shield, white flank line, **white undertail sides** | Two birds, side light |
| juvenile | [Commons "Common Moorhen (Gallinula chloropus) juvenile.jpg"](https://commons.wikimedia.org/wiki/File:Common_Moorhen_(Gallinula_chloropus)_juvenile.jpg) (4721×3147) | Charles J. Sharp | CC BY-SA 3.0 | Wolvercote, Oxfordshire, England | Medium-high, viewed. Brown upperparts, grey-buff face and underparts, pale throat, dull bill, white flank line | Not Sri Lanka (nominate *chloropus*); the bill is starting to redden, so it is an older juvenile/first-winter |
Rejected: melianie_max_and_asker iNat 6272314 (SL): adult with **downy chicks**, not juveniles. No open SL juvenile found.

## 11. Slaty-legged Crake (`slb-rallina-eurizonoides`) — treat as sensitive (scarce, secretive)
Plumages: **adult**. Locality at **zone level only**. Only 1 open SL record. The photo supports the traits doubt: the head and breast are **chestnut**, not slate-grey as the workbook says.
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| adult | [iNat photo 617424646](https://www.inaturalist.org/photos/617424646) (obs [339406348](https://www.inaturalist.org/observations/339406348), 1 agreement) | rashidchan | CC BY 4.0 | Sri Lanka (wet zone; finer place withheld) | Medium, viewed. Chestnut head and neck, plain olive-brown back, **bold black-and-white barred flanks and belly**, grey legs | Grass stems cross the bird; 1 agreement (the marks are diagnostic among SL rails); iNat shows a district, which must not be copied into credits |
No second open candidate was searched outside Sri Lanka yet; Indian or SE Asian Commons photos could be a fallback (the species varies little).

## 12. Purple Swamphen (`slb-porphyrio-porphyrio`)
Plumages: **adult, juvenile**. **Split-sensitive:** Sri Lankan birds are the grey-headed form *poliocephalus* (Grey-headed Swamphen in AviList/Clements/iNat). The workbook keeps *Porphyrio porphyrio*; I am not changing the name, but **photos must show the grey-headed form**, not the European nominate (all-blue head) or the Australasian black-backed forms.
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| adult | [iNat photo 6272271](https://www.inaturalist.org/photos/6272271) (obs [5102311](https://www.inaturalist.org/observations/5102311), **6 agreements**) | melianie_max_and_asker | CC BY | Southern Province, Sri Lanka | High, viewed. **Pale grey head**, purple-blue neck and body, red bill and shield, walking over lotus pads | Bill partly hidden by a lotus bud; legs hidden. iNat licence version to confirm (older record) |
| adult (alt) | [iNat photo 62657267](https://www.inaturalist.org/photos/62657267) (obs [39488271](https://www.inaturalist.org/observations/39488271), 5 agreements) | William Stephens | CC BY 4.0 | Hambantota, Sri Lanka | High, viewed. Grey head, turquoise-blue wings, red shield and legs, full bird in warm light | Head down (feeding) |
| juvenile | **none acceptable** | – | – | – | – | Gap: open photos found show adults with downy chicks, not the grey-brown juvenile |
Rejected (juvenile slot): [Commons "Grey-headed swamphen juvenile.jpg"](https://commons.wikimedia.org/wiki/File:Grey-headed_swamphen_juvenile.jpg) (Abdullahgirach): an ideal juvenile, but it has an **"AG" logo watermark** and EXIF "All images are copyright ABDULLAH GIRACH" (conflicts with CC BY-SA 4.0). [Commons "Twisty Feed.jpg"](https://commons.wikimedia.org/wiki/File:Twisty_Feed.jpg) (Chamara Ranathunga, Diyasaru Uyana, SL): adult feeding a **downy chick**, too young. Sagnik Dutta Roy iNat 485138076 and white_cheeked_barbet 545447655 (India): adults with chicks / tiny chick. Not viewed: Joseph Morlan SL records (batch 1 found his iNat photos carry a watermark).

## 13. Eurasian Coot (`slb-fulica-atra`)
Plumages: **adult, juvenile**. Only 1 open SL record and it is watermarked. Indian birds are the same subspecies (nominate *atra*), so Indian adults are used.
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| adult | [iNat photo 574590798](https://www.inaturalist.org/photos/574590798) (obs [317951554](https://www.inaturalist.org/observations/317951554), 5 agreements) | Tejas M | CC BY 4.0 | Talegaon Dabhade, Maharashtra, India | High, viewed. Sooty-black body, **white bill and frontal shield**, red eye, clean reflection | Not Sri Lanka |
| juvenile | [Commons "Fulica atra - Common coot 23.jpg"](https://commons.wikimedia.org/wiki/File:Fulica_atra_-_Common_coot_23.jpg) (4250×2859) | Zeynel Cebeci | CC BY-SA 4.0 | Eskibaraj Dam Lake, Adana, Turkey | High, viewed. Grey-brown upperparts, **whitish throat and breast**, small greyish bill without a shield | Not Sri Lanka (same nominate subspecies) |
| juvenile (alt) | [Commons "Eurasian coot (Fulica atra) juvenile Bürgerpark.jpg"](https://commons.wikimedia.org/wiki/File:Eurasian_coot_(Fulica_atra)_juvenile_B%C3%BCrgerpark.jpg) (6000×4000) | Charles J. Sharp | CC BY-SA 4.0 | Bremen, Germany | Not viewed (fallback) | – |
Rejected: iNat 698310697 (CC0, Nawadankulama, SL): **watermark "© Wilmot Senaratne - 2016"**. Commons Charles J. Sharp "Eurasian coot (Fulica atra) juvenile.jpg" (Saint-Omer): a **downy chick**, not a juvenile. JJ Harrison "Fulica atra juvenile.jpg": Tasmania, ssp. *australis* (different form). Surabhi Srivastava iNat 160679190: too distant and blurred.

## 14. Great Stone-curlew (`slb-esacus-recurvirostris`) — treat as sensitive (few birds; nests on open sandbars)
Plumages: **adult**. Locality at **zone level only**. iNat already hides the place for most SL records.
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| adult | [iNat photo 113139640](https://www.inaturalist.org/photos/113139640) (obs [69694385](https://www.inaturalist.org/observations/69694385), 4 agreements) | Eamon Corbett | CC BY 4.0 | Sri Lanka (location hidden on iNat; dry / coastal zone) | High, viewed. **Huge upturned black bill with yellow base, bold black-and-white face, big yellow eye**, plain grey-brown back with dark wing panel, full bird | Low plants cross the feet |
| adult (alt) | [iNat photo 8759838](https://www.inaturalist.org/photos/8759838) (obs [6870402](https://www.inaturalist.org/observations/6870402), 5 agreements) | Jacky Judas | CC BY | Sri Lanka (location hidden on iNat) | Medium, viewed. Face pattern and bill on a river bank | Distant; a branch arches over the bird. iNat licence version to confirm |
Not viewed: Алёна Осипова 454919651 (2 agreements), Tom Heijnen 409801529, several CC0 records.

## 15. Indian Stone-curlew (`slb-burhinus-indicus`)
Plumages: **adult**.
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| adult | [iNat photo 62169550](https://www.inaturalist.org/photos/62169550) (obs [39206426](https://www.inaturalist.org/observations/39206426)) | William Stephens | CC BY 4.0 | Anuradhapura, Sri Lanka (dry zone) | High, viewed. Close, sharp: streaked sandy-brown, **large yellow eye, pale brow and dark eye-stripe, short black-tipped bill with yellow base, white wing bar** | 1 agreement (the ID is unambiguous in SL); crouched pose hides the legs |
| adult (alt) | [iNat photo 327248321](https://www.inaturalist.org/photos/327248321) (obs [187162304](https://www.inaturalist.org/observations/187162304), 2 agreements) | Griha Hasanov | CC BY 4.0 | Ragama, Sri Lanka (wet lowland) | Medium, viewed. Full bird standing on grass, long yellow legs, wing pattern | Small in frame |
Not viewed: Tom Heijnen 409883927 (Anuradhapura, URL failed), CC0 Kala Wewa 721260548.

## 16. Crab Plover (`slb-dromas-ardeola`)
Plumages: **adult, juvenile**. No open-licence SL record on iNat. The species is monotypic, so Indian photos are a fair stand-in.
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| adult | [Commons "Crab plover 1.jpg"](https://commons.wikimedia.org/wiki/File:Crab_plover_1.jpg) (3874×3259) | afsarnayakkan | CC BY-SA 4.0 | Kannur, Kerala, India | High, viewed. White body, **black mantle and primaries, heavy black dagger bill**, black eye patch, long blue-grey legs | Not Sri Lanka. "Crab plover 7.jpg" (same author) is a near-duplicate of the same bird |
| adult (alt) | [Commons Kasambe DSCN9287](https://commons.wikimedia.org/wiki/File:Crab_Plover_Dromas_ardeola_by_Dr._Raju_Kasambe_DSCN9287.jpg) (2131×1417) | Dr. Raju Kasambe | CC BY-SA 4.0 | Khijadiya, Jamnagar, Gujarat, India | Medium, viewed. Bird on tidal mud | Hazy, back-lit |
| juvenile | **none acceptable** | – | – | – | – | Gap: no open photo labelled or clearly showing a juvenile (grey mantle, streaked grey crown) |
Also viewed: [Commons Savithri Singh AMSM7466](https://commons.wikimedia.org/wiki/File:Crab_Plover_AMSM7466.jpg) (CC0, place not stated): a roosting and flying flock, the typical way the species is seen; juveniles may be in it but are too small to confirm. Not viewed: gailhampshire (Mauritius, CC BY 2.0), Donald Macauley (Kenya, CC BY-SA 2.0).

## 17. Black-winged Stilt (`slb-himantopus-himantopus`)
Plumages: **adult** (traits draft has no sex split; the male's glossy black back is shown first; the female's back is browner).
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| adult | [iNat photo 681295220](https://www.inaturalist.org/photos/681295220) (obs [372818994](https://www.inaturalist.org/observations/372818994), 2 agreements) | Judy Gallagher | CC BY-SA 4.0 | Mannar Island, Sri Lanka (arid north) | High, viewed. Wading with its reflection: white body, black back and wings, **very long pink-red legs**, fine black bill | Portrait crop (tall frame) |
| adult (alt) | [iNat photo 615431708](https://www.inaturalist.org/photos/615431708) (obs [338419838](https://www.inaturalist.org/observations/338419838), 2 agreements) | Egor Dyukarev | CC BY 4.0 | Hambantota District, Sri Lanka | Medium-high, viewed. Glossy black back (male), white head, pink legs | Legs partly in water |
Also viewed: Emanuele Santarelli 564719601 (Anuradhapura, CC BY-SA): browner-backed bird (female type), soft; a possible female illustration. Not viewed: Vihansith Kulatunga 119631189 (3 agreements; URL failed). Rejected: Joseph Morlan records (watermark risk from batch 1); Tom Heijnen 410140593 (tiny).

## 18. Pied Avocet (`slb-recurvirostra-avosetta`)
Plumages: **adult**. Scarce migrant; only 2 open SL records and both are scans of old prints with a **"© Wilmot Senaratne" watermark** (iNat 661941948 and 697670449, Bundala); rejected. Monotypic species, so an Indian winter photo is used.
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| adult | [Commons Kasambe DSCN8124 01](https://commons.wikimedia.org/wiki/File:Pied_Avocet_Recurvirostra_avosetta_by_Dr._Raju_Kasambe_DSCN8124_01.jpg) (3927×2551) | Dr. Raju Kasambe | CC BY-SA 4.0 | Navi Mumbai, Maharashtra, India | High, viewed. White body, **black cap and hindneck, black wing bars, fine upturned bill**, blue-grey legs, wading | Not Sri Lanka; warm evening light |
| adult (alt) | [Commons Kasambe DSCN3743 (5)](https://commons.wikimedia.org/wiki/File:Pied_Avocet_Recurvirostra_avosetta_by_Dr._Raju_Kasambe_DSCN3743_(5).jpg) (3833×2706) | Dr. Raju Kasambe | CC BY-SA 4.0 | Thane district, Maharashtra, India | High, viewed. Standing side view, same marks | Not Sri Lanka |

## 19. Yellow-wattled Lapwing (`slb-vanellus-malabaricus`)
Plumages: **adult**.
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| adult | [iNat photo 262736101](https://www.inaturalist.org/photos/262736101) (obs [152211805](https://www.inaturalist.org/observations/152211805), 4 agreements) | avocat | CC BY 4.0 | Uda Walawe, Moneragala, Sri Lanka (dry zone) | High, viewed. **Black cap with white border, yellow wattles, yellow legs**, sandy-brown back, white belly, full bird on short grass | None notable |
| adult (alt) | [iNat photo 196989693](https://www.inaturalist.org/photos/196989693) (obs [116684749](https://www.inaturalist.org/observations/116684749), 2 agreements) | desertnaturalist | CC BY 4.0 | Yala NP, Sri Lanka | Medium, viewed. Same marks | Slightly soft and dark |
Rejected: Daniel Benák 244250215 (dim, blurred); Eamon Corbett 112949400 (bird from behind); Shaan Aroeste 178266538 (phone shot, small).

## 20. Eurasian Oystercatcher (`slb-haematopus-ostralegus`)
Plumages: **adult**, shown in **non-breeding** dress (white throat bar), as seen in Sri Lanka in the northern winter. Very rare visitor; the only open SL record is a distant flight shot (Christoph Moning). The wintering subspecies in South Asia is not stated on the source (I believe mainly *longipes*; confirm); the plumage differences are small.
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| adult (non-breeding) | [Commons "Haematopus ostralegus (non-breeding plumage).jpg"](https://commons.wikimedia.org/wiki/File:Haematopus_ostralegus_(non-breeding_plumage).jpg) (3197×2397) | Hans Hillewaert | CC BY-SA 4.0 | Dudzele, Belgium | High, viewed. Black head and back, **white winter throat bar**, long orange-red bill, red eye, pink legs, walking | Not Sri Lanka; nominate subspecies |
| adult (SL alt) | [iNat photo 92420320](https://www.inaturalist.org/photos/92420320) (obs [57915487](https://www.inaturalist.org/observations/57915487), 4 agreements) | Christoph Moning | CC BY 4.0 | Hambantota District, Sri Lanka | Low-medium, viewed. Flight: broad white wing bar, white rump, orange bill | Distant, small in frame. Documents the rare SL occurrence |
Not used: Reflectitur Photons iNat 29059836 (Mirissa, SL): **CC BY-NC** (not viewed).

## 21. Grey Plover (`slb-pluvialis-squatarola`)
Plumages: **non_breeding** (first), **breeding** (traits sheet: seen on arrival and departure).
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| non_breeding | [iNat photo 676393260](https://www.inaturalist.org/photos/676393260) (obs [370254448](https://www.inaturalist.org/observations/370254448), 2 agreements) | "no rights reserved" | CC0 1.0 | Talaimannar, Mannar, Sri Lanka (arid north) | High, viewed. Grey-brown spangled upperparts, pale face, **heavy black bill**, whitish belly with the first black flecks of spring moult (4 April) | No watermark in the 500 px preview, but several other CC0 ("no rights reserved") records from Mannar and Bundala carry "© Wilmot Senaratne" and the API hides the CC0 account name, so they may be the same account; **check the full-size file for a watermark** |
| non_breeding (alt) | [Commons "Grey Plover Non-breeding Souss-Massa Park Oct25 A7CR 08164.jpg"](https://commons.wikimedia.org/wiki/File:Grey_Plover_Non-breeding_Souss-Massa_Park_Oct25_A7CR_08164.jpg) (4038×3028) | Timothy A. Gonsalves | CC BY-SA 4.0 | Souss-Massa NP, Morocco | Not viewed (fallback, labelled non-breeding) | – |
| breeding | [Commons "Pluvialis squatarola (summer plumage).jpg"](https://commons.wikimedia.org/wiki/File:Pluvialis_squatarola_(summer_plumage).jpg) (3048×2285) | Hans Hillewaert | CC BY-SA 3.0 | Sanibel Island, Florida, USA | High, viewed. **Black face and underparts bordered white**, white crown, chequered black-and-white upperparts, on a beach | Not Sri Lanka and a New World population; breeding plumage looks the same to the field observer (confirm the owner accepts) |
Rejected: iNat 690100362 (CC0, Talaimannar 2016): **watermark "© Wilmot Senaratne - 2016"**. spacegecko 348185092 (Hambantota): small in frame. Not viewed: Bundala CC0 691670141.

## 22. Common Ringed Plover (`slb-charadrius-hiaticula`)
Plumages: **adult**, shown in **non-breeding** dress (traits draft: "non-breeding as seen here"). **No open SL record on iNat** (0 results).
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| adult (non-breeding) | [Commons "Common ringed plover Saint-Jean-de-Monts 01.jpg"](https://commons.wikimedia.org/wiki/File:Common_ringed_plover_Saint-Jean-de-Monts_01.jpg) (4536×3024) | Alexis Lours | CC BY 4.0 | Saint-Jean-de-Monts, France | High, viewed. Winter plumage: brown breast band, white collar and forehead, **orange legs and orange bill base** (the key against Little Ringed) | Not Sri Lanka. Subspecies of SL winterers not stated on the source (likely *tundrae*; confirm) |
| adult (alt) | [Commons "Common Ringed Plover Seaweed Kizimkazi Zanzibar Nov26 A7CR 17943.jpg"](https://commons.wikimedia.org/wiki/File:Common_Ringed_Plover_Seaweed_Kizimkazi_Zanzibar_Nov26_A7CR_17943.jpg) (2679×2009) | Timothy A. Gonsalves | CC BY-SA 4.0 | Kizimkazi, Zanzibar, Tanzania (wintering grounds, November) | High, viewed. Dark breast band, bright orange legs, on seaweed | Raindrops on the back; bill base dark at this angle |

## 23. Kentish Plover (`slb-anarhynchus-alexandrinus`)
Plumages: **breeding**, **non_breeding** (per traits draft). The resident Sri Lankan breeder is ssp. *seebohmi* (named in the workbook seasonality text); winter migrants are the nominate. The breeding slot should show the **resident seebohmi**, so a Sri Lankan bird photographed in the breeding season is used.
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| breeding | [iNat photo 407286523](https://www.inaturalist.org/photos/407286523) (obs [229446875](https://www.inaturalist.org/observations/229446875)) | Marco Chan | CC BY 4.0 | Sri Lanka (place not given; 6 July, so a resident *seebohmi*) | Medium-high, viewed. Rufous-washed crown, dark eye-stripe, **dark lateral breast patches**, white collar and underparts, sandy back; crisp | 1 agreement; crouched on sand; sex not certain (the male's black frontal bar is not clear) |
| breeding (alt) | [iNat photo 113139526](https://www.inaturalist.org/photos/113139526) (obs [69694384](https://www.inaturalist.org/observations/69694384), 2 agreements) | Eamon Corbett | CC BY 4.0 | Arugam Bay, Sri Lanka (east coast; 9 June) | Medium, viewed. Breeding male: black frontal bar, eye-stripe and breast patch | Dusk light, soft |
| non_breeding | [iNat photo 259777998](https://www.inaturalist.org/photos/259777998) (obs [150632412](https://www.inaturalist.org/observations/150632412)) | avocat | CC BY 4.0 | Yala, Hambantota, Sri Lanka (22 January) | Medium-high, viewed. Pale sandy upperparts, white collar, **brownish incomplete breast patches**, dark legs, clean sandy background | January bird might be a resident in early breeding dress rather than a winter migrant; 1 agreement |
Not viewed: MATVEY KALACHEV 537693597 (Palatupana, Feb), Judy Gallagher 692414075 (Mannar, CC BY-SA). CC0 Bundala/Vankalai/Palatupana records not used until checked for the Wilmot Senaratne watermark.

## 24. Little Ringed Plover (`slb-thinornis-dubius`)
Plumages: **breeding** (resident *jerdoni*), **non_breeding** (migrant *curonicus*), per traits draft. Breeding birds in Feb to April could be either subspecies; *jerdoni* is slightly smaller with a broader yellow eye-ring, which I cannot separate reliably in photos.
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| breeding | [iNat photo 62169447](https://www.inaturalist.org/photos/62169447) (obs [39206413](https://www.inaturalist.org/observations/39206413)) | William Stephens | CC BY 4.0 | Wilpattu Block 1, Puttalam, Sri Lanka (4 Feb) | High, viewed. **Bright yellow eye-ring**, black mask and breast band, white forehead bar, pinkish legs, full bird | 1 agreement (ID unambiguous); subspecies not determinable |
| breeding (alt) | [iNat photo 676396095](https://www.inaturalist.org/photos/676396095) (obs [370256249](https://www.inaturalist.org/observations/370256249)) | "no rights reserved" | CC0 1.0 | Vankalai Sanctuary, Mannar, Sri Lanka (3 April) | High, viewed. Same marks, close side view | Same CC0 account issue: check the full-size file for a watermark |
| non_breeding | [iNat photo 262144353](https://www.inaturalist.org/photos/262144353) (obs [151890308](https://www.inaturalist.org/observations/151890308)) | avocat | CC BY 4.0 | Hambantota, Sri Lanka (23 January) | Medium, viewed. Duller brown breast band and mask, yellow eye-ring still visible, pale legs | Not a full winter plumage (band still dark); a cleaner non-breeding bird is wanted |
Rejected: Mickey Wu 623223805 and Tim 623531807 (distant); Judy Gallagher 681901239 (soft, grass across the bird).

## 25. Greater Sand-Plover (`slb-anarhynchus-leschenaultii`)
Plumages: **non_breeding** (first), **breeding** (seen on arrival and departure). Only 2 open SL records (both CC0).
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| non_breeding | [iNat photo 676907866](https://www.inaturalist.org/photos/676907866) (obs [370531215](https://www.inaturalist.org/observations/370531215)) | "no rights reserved" | CC0 1.0 | Talaimannar, Mannar, Sri Lanka (5 April) | High, viewed. Plain grey-brown upperparts, white underparts with grey-brown breast patches, **long heavy bill and long greyish legs** | 1 agreement; check the full-size file for a watermark (same CC0 account) |
| non_breeding (alt) | [Commons Tisha Mukherjee 01](https://commons.wikimedia.org/wiki/File:Greater_Sand-Plover_by_Tisha_Mukherjee_01.jpg) (4402×2935) | Tisha Mukherjee | CC BY-SA 4.0 | Bakkhali, West Bengal, India | Medium-high, viewed. Non-breeding, long bill, in wet grass | Not Sri Lanka; grass around the legs |
| breeding | [Commons "2024-07-26 Anarhynchus leschenaultii leschenaultii, Newbiggin, Northumberland 1.jpg"](https://commons.wikimedia.org/wiki/File:2024-07-26_Anarhynchus_leschenaultii_leschenaultii,_Newbiggin,_Northumberland_1.jpg) (2800×2100) | MPF | CC BY-SA 4.0 | Newbiggin, England (vagrant; labelled ssp. *leschenaultii*) | Low-medium, viewed. Black mask, faint rufous breast band, long bill | **Worn, faded plumage**; the chestnut band is weak. A better breeding bird is wanted |
Rejected: iNat 677250739 (CC0, Kalpitiya): **watermark "© Wilmot Senaratne 2024"**.

## 26. Siberian Sand-Plover (`slb-anarhynchus-mongolus`) — taxonomy doubt, owner decision needed
Plumages: **non_breeding**, **breeding** (per traits draft). **Split warning:** iNat places **all 30 open SL sand-plover records in Tibetan Sand-Plover (*A. atrifrons*)** and none in Siberian (*A. mongolus*). As far as I know, the birds wintering in Sri Lanka and India are mainly the Tibetan group (*atrifrons*, *pamirensis*, *schaeferi*), while Siberian (*mongolus*, *stegmanni*) winters mainly from SE Asia to Australasia. I am not certain whether Siberian has been confirmed in Sri Lanka. **Confirm against the CBC checklist, Avibase and eBird SL records before choosing photos.** The workbook name is not changed here (and the Sinhala name is already marked "to be confirmed").
- Non-breeding birds of the two species are almost impossible to separate in photos, so a SL photo is a fair "as seen here" image whatever the outcome.
- Breeding males differ: Tibetan has an **all-black forehead** (no white), Siberian usually shows **white forehead patches** and a black upper border to the chestnut band. The breeding slot must match the decided taxon.
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| non_breeding | [iNat photo 62657544](https://www.inaturalist.org/photos/62657544) (obs [39488334](https://www.inaturalist.org/observations/39488334), 2 agreements) | William Stephens | CC BY 4.0 | Hambantota, Sri Lanka (iNat ID: Tibetan) | High, viewed. Sandy-brown, pale brow, grey-brown breast patches, **short stubby black bill**, dark legs | Taxon (see above) |
| non_breeding (alt) | [iNat photo 330361419](https://www.inaturalist.org/photos/330361419) (obs [188708080](https://www.inaturalist.org/observations/188708080), 2 agreements) | Griha Hasanov | CC BY 4.0 | Batticaloa, Sri Lanka (iNat ID: Tibetan) | High, viewed. Clean side view on sand, plain sky | Taxon |
| breeding (if Tibetan) | [Commons Vedant Kasambe DSC 5787 "in breeding plumage"](https://commons.wikimedia.org/wiki/File:Lesser_Sand_Plover_Charadrius_mongolus_in_breeding_plumage_best_by_Vedant_Kasambe_DSC_5787.jpg) (1946×1215) | Vedant Raju Kasambe | CC BY-SA 4.0 | Not stated (uploader is in Maharashtra, India) | High, viewed. Chestnut breast band and nape, black mask, **dark forehead without white** (Tibetan type) | Place not stated; file is titled "Charadrius mongolus" (old lumped name) |
| breeding (if Siberian) | [Commons "Charadrius mongolus P4233532.jpg"](https://commons.wikimedia.org/wiki/File:Charadrius_mongolus_P4233532.jpg) (800×600) | Alnus | CC BY-SA 3.0 | Yunlin County, Taiwan (Siberian range), April 2008 | Low-medium, viewed. Rufous breast band, dark mask | Not a full breeding male; 800 px only. A better Siberian-type male is needed if the taxon stays *mongolus* |
Also viewed: Judy Gallagher 747745623 (Bundala, CC BY-SA): non-breeding, good. Imran Shah Deosai (Pakistan, Tibetan breeding grounds): a dull female-type, not used.

## 27. Greater Painted-snipe (`slb-rostratula-benghalensis`)
Plumages: **female** (brighter: chestnut neck, dark green back), **male** (duller, golden braces), per traits draft. Only 2 open SL records, both birds hidden in grass. African birds are the same species (the Australian form is split), so non-SL photos are used.
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| female | [Commons Kasambe "Female DSCN5302 (21)"](https://commons.wikimedia.org/wiki/File:Greater_Painted_Snipe_Rostratula_benghalensis_Female_DSCN5302_(21).jpg) (4608×3456) | Dr. Raju Kasambe | CC BY 4.0 | Not stated (India, from the uploader's series) | Medium-high, viewed. Dark chestnut-maroon head and neck, **white spectacle and white shoulder strap**, dark greenish back, full bird at a wet margin | Dim light; place not stated |
| female (alt) | [Commons Derek Keats "female (12366878013)"](https://commons.wikimedia.org/wiki/File:Greater_Painted-snipe,_Rostratula_benghalensis_-_female_(12366878013).jpg) (1280×836) | Derek Keats | CC BY 2.0 | Kruger NP, South Africa | High, viewed. Head-and-neck close-up: chestnut neck, white eye patch, strap | Head only; 1280 px; Africa |
| male | [Commons Bernard Dupont "male, Kruger NP (53247730001)"](https://commons.wikimedia.org/wiki/File:Greater_Painted-snipe_(Rostratula_benghalensis)_male,_Kruger_NP_(53247730001).jpg) (4706×3090) | Bernard DUPONT | CC BY-SA 2.0 | Kruger NP, South Africa | High, viewed. Grey-brown head with buff spectacle, **golden-buff spots and braces on the wings**, white underparts, green legs, full bird | Not Sri Lanka |
| male (alt) | [Commons Kasambe "male DSCN5302 (10)"](https://commons.wikimedia.org/wiki/File:Greater_Painted_Snipe_Rostratula_benghalensis_male_DSCN5302_(10).jpg) (4608×3456) | Dr. Raju Kasambe | CC BY 4.0 | Not stated (India) | Medium, viewed. Male bathing; buff spectacle and spotted wing | Splashing pose; low evening light |
Rejected: avocat iNat 262354362 and Edmundas Greimas 377618085/377618565 (SL): birds hidden in grass. Charles J. Sharp "male in flight Faiyum": title says male, description says female (label conflict).

## 28. Pheasant-tailed Jacana (`slb-hydrophasianus-chirurgus`)
Plumages: **breeding**, **non_breeding** (per traits draft).
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| breeding | [iNat photo 62170850](https://www.inaturalist.org/photos/62170850) (obs [39206923](https://www.inaturalist.org/observations/39206923), 5 agreements) | William Stephens | CC BY 4.0 | Karuwalagaswewa, Puttalam, Sri Lanka | High, viewed. Chocolate body, white face and wings, **golden-yellow hindneck**, very long black tail, walking on lily pads | Lotus buds in the foreground |
| breeding (alt) | [iNat photo 348036628](https://www.inaturalist.org/photos/348036628) (obs [197585358](https://www.inaturalist.org/observations/197585358), 3 agreements) | spacegecko | CC BY 4.0 | Hambantota, Sri Lanka | High, viewed. Taking off: white wings fully spread, golden nape, long tail (shows the flight pattern) | Flight pose |
| non_breeding | [Commons "Pheasant-tailed jacana (Hydrophasianus chirurgus).jpg"](https://commons.wikimedia.org/wiki/File:Pheasant-tailed_jacana_(Hydrophasianus_chirurgus).jpg) (3330×2220) | Charles J. Sharp | CC BY-SA 4.0 | Vembanad Lake, Kerala, India | High, viewed. Brown crown and upperparts, white face and underparts, **dark eye-stripe running down into a breast necklace**, golden side of neck, short tail | Not Sri Lanka. Supports the traits doubt: the necklace is dark, not chestnut |
Also viewed: Eamon Corbett 113036876 (Hambantota, June, 8 agreements): breeding bird in grass, golden nape hidden. Mickey Wu 623514834: distant. Not used: J.M. Garg non-breeding files (watermark policy from the pilot). No open SL non-breeding photo found.

## 29. Pin-tailed Snipe (`slb-gallinago-stenura`)
Plumages: **adult**. **ID caution:** Pin-tailed and Common Snipe are very hard to separate in still photos (pin tail feathers and underwing are rarely visible). These are iNat research grade, but I cannot confirm Pin-tailed from the images alone. Common Snipe is in a later batch, so the owner may prefer to keep only high-agreement records here.
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| adult | [iNat photo 62657255](https://www.inaturalist.org/photos/62657255) (obs [39488264](https://www.inaturalist.org/observations/39488264), 3 agreements) | William Stephens | CC BY 4.0 | Hambantota, Sri Lanka | Medium-high, viewed. Striped head, long straight bill, cryptic brown-and-buff upperparts with **narrow pale fringes on the scapulars** (fits Pin-tailed), full bird on grass | Species ID from photo uncertain (see above) |
| adult (alt) | [iNat photo 62657373](https://www.inaturalist.org/photos/62657373) (obs [39488299](https://www.inaturalist.org/observations/39488299), 3 agreements) | William Stephens | CC BY 4.0 | Hambantota, Sri Lanka | Medium, viewed. Head and back pattern, at the water's edge | Grass across the body; same ID caveat |
Rejected: William Stephens 62657395 (second photo of obs 39488299): bird hidden in grass. Not viewed: Tom Heijnen 409801447, Judy Gallagher 747744289 and 681905806 (CC BY-SA), avocat 262102957.

## 30. Black-tailed Godwit (`slb-limosa-limosa`)
Plumages: **non_breeding** (first), **breeding** (seen on arrival and departure). Wintering birds in South Asia are mostly ssp. *melanuroides* or *limosa* (not stated on the source; confirm).
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| non_breeding | [iNat photo 62169443](https://www.inaturalist.org/photos/62169443) (obs [39206408](https://www.inaturalist.org/observations/39206408), 3 agreements) | William Stephens | CC BY 4.0 | Wilpattu Block 1, Puttalam, Sri Lanka | High, viewed. Plain grey-brown, **long straight bicoloured bill**, pale brow, long legs, wings half raised showing the black tail band | Wings raised (shakes after bathing) |
| non_breeding (alt) | [Commons "Black-tailed godwit (Limosa limosa) non breeding.jpg"](https://commons.wikimedia.org/wiki/File:Black-tailed_godwit_(Limosa_limosa)_non_breeding.jpg) (3642×2428) | Charles J. Sharp | CC BY-SA 4.0 | Titchwell Marsh, Norfolk, England | Not viewed (fallback, labelled non-breeding) | – |
| breeding | [Commons "Black-tailed godwit (Limosa limosa) male breeding.jpg"](https://commons.wikimedia.org/wiki/File:Black-tailed_godwit_(Limosa_limosa)_male_breeding.jpg) (3358×2239) | Charles J. Sharp | CC BY-SA 4.0 | Titchwell Marsh, Norfolk, England | Medium-high, viewed. **Orange-chestnut head and neck**, barred flanks, bicoloured bill, wading | Partly moulted (grey feathers in the back); European bird. EXIF holds the photographer's contact details (stripped at ingest) |
**Possible misidentification:** iNat 676391252 (CC0, Talaimannar, 3 agreements), returned under Black-tailed Godwit and also under Bar-tailed, looks to me like a **Bar-tailed Godwit** (streaked crown, dark-centred scapulars, slightly upturned bill, short legs). Not used for Black-tailed; see 31.

## 31. Bar-tailed Godwit (`slb-limosa-lapponica`)
Plumages: **adult**, shown in **non-breeding** dress (traits draft: "non-breeding as seen here"). Scarce in SL; 1 open SL record.
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| adult (non-breeding) | [iNat photo 676391252](https://www.inaturalist.org/photos/676391252) (obs [370254256](https://www.inaturalist.org/observations/370254256), 3 agreements) | "no rights reserved" | CC0 1.0 | Talaimannar, Mannar, Sri Lanka (4 April) | High, viewed. **Streaked brown upperparts with dark feather centres**, slightly upturned pink-based bill, shorter legs than Black-tailed, wading | The observation appears under both godwit names in the API, so **check the current iNat ID**; check the full-size file for a watermark (CC0 account) |
| adult (alt) | [Commons "Pfuhlschnepfe.jpg"](https://commons.wikimedia.org/wiki/File:Pfuhlschnepfe.jpg) (2364×1576) | Hobbyfotowiki | CC0 | Kiel, Germany (labelled non-breeding) | Not viewed (fallback) | – |

## 32. Eurasian Curlew (`slb-numenius-arquata`)
Plumages: **adult**. Winterers in South Asia are mainly the eastern ssp. *orientalis* (white underwing and rump, very long bill). Open SL records are distant or from CC0 Mannar accounts.
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| adult | [Commons "Eurasian Curlew (Numenius arquata orientalis), Sajnekhali, West Bengal.jpg"](https://commons.wikimedia.org/wiki/File:Eurasian_Curlew_(Numenius_arquata_orientalis),_Sajnekhali,_West_Bengal.jpg) (1600×1969) | Anirnoy | CC BY-SA 4.0 | Sajnekhali, Sundarbans, West Bengal, India (labelled *orientalis*) | High, viewed. **Very long down-curved bill**, plain head (no crown stripes), streaked breast, white belly, wings raised | Wings half open (stretching); portrait frame |
| adult (alt) | [Commons "Whimbrel (Numenius phaeopus) Bahrain.jpg"](https://commons.wikimedia.org/wiki/File:Whimbrel_(Numenius_phaeopus)_Bahrain.jpg) (1770×1180) | Charles J. Sharp | CC BY-SA 4.0 | Dohat Arad, Bahrain | High, viewed. Full bird wading, long evenly curved bill, plain head | **Commons label error: titled "Whimbrel" but the bird is a Eurasian Curlew** (bill length, no crown stripes). Only use after the owner agrees; the owner may report the label |
| adult (alt 2, flight) | [Commons Vedant Kasambe DSC 3984 02](https://commons.wikimedia.org/wiki/File:Eurasian_Curlew_Numenius_arquata_by_Vedant_Raju_Kasambe_DSC_3984_02.jpg) (2997×2100) | Vedant Raju Kasambe | CC BY-SA 4.0 | Thane Creek, Maharashtra, India | Medium-high, viewed. Flight: **white wedge up the back**, barred tail, long bill | Flight only |
Also viewed (SL): Tom Heijnen 410046501 (Mannar): curlew beside Little Egrets, small in frame (medium-low). Rejected: Shaan Aroeste 184444337 (phone shot, tiny). CC0 Vankalai records not used until checked for watermarks.

## 33. Eurasian Whimbrel (`slb-numenius-phaeopus`)
Plumages: **adult**.
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| adult | [iNat photo 108500446](https://www.inaturalist.org/photos/108500446) (obs [67193188](https://www.inaturalist.org/observations/67193188), 3 agreements) | Andrew Simon | CC BY 4.0 | Wattala, Sri Lanka (wet lowland coast) | High, viewed. Flight, sharp: **dark crown with pale brow**, shorter kinked bill than Curlew, barred wings and tail | Flight only (no standing SL bird of this quality found) |
| adult (alt) | [iNat photo 256824757](https://www.inaturalist.org/photos/256824757) (obs [149077288](https://www.inaturalist.org/observations/149077288), 2 agreements) | avocat | CC BY 4.0 | Negombo, Sri Lanka | Medium, viewed. Two birds at a mangrove edge: striped crown, bill length | Hazy, soft |
| adult (alt 2) | [Commons "Whimbrel-Numenius phaeopus.jpg"](https://commons.wikimedia.org/wiki/File:Whimbrel-Numenius_phaeopus.jpg) (2359×1794) | Vinay bhat | CC BY-SA 4.0 | Chitrapu Estuary, Mangalore, India | Medium, viewed. Standing side view | Small in frame (crop needed) |
Rejected: MATVEY KALACHEV 537690051 (Palatupana: small in frame at a pool); Aleksandr Gromov 602678381 (silhouette on rocks). Not viewed: Hobbyfotowiki CC0 Salalah and Fuerteventura files (fallbacks).
