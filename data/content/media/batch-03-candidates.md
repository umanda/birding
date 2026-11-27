# Batch 3 photo candidates (M8, spec 006)

Status: **proposed; research complete for all 27 species**. No images were downloaded into the repo, no `.webp` files were created and `licences.csv` was not edited. The owner reviews every candidate before any row is added.

Species: the 27 batch-3 species (plates 12 to 15), taken from `traits-plan.csv` (batch 3) and the plumage lists in the batch-3 traits summary (`traits-batch-3-review.md`, branch `m8-b3`). None is on `sensitive-species.csv`, but the traits summary proposes eight sensitive candidates. Seven are in this batch and are treated as sensitive here (locality at zone level only for Sri Lankan photos): **Great Crested Tern, Roseate Tern, Saunders's Tern, Bridled Tern, Sooty Tern** (colony breeders), **Indian Courser** (NT, local ground-nester) and **Small Pratincole** (colonial sandbar nester). No proposed photo shows a nest, egg or chick.

How these were checked (same practice as batches 1 and 2 and the M2 pilot):
- **Licence and author.** Read from the Wikimedia Commons API (`extmetadata`: Artist, LicenseShortName) or the iNaturalist API (`photos.license_code`, `attribution`, `user.login`), which is the metadata of the file page itself. Re-check the file page at ingest time.
- **Visual review.** I looked at a 500 px preview of every candidate marked "viewed". ID and plumage come from field marks in the image, backed by research grade and agreement count on iNat. Rows marked "not viewed" are fallbacks only.
- **Rejected.** Watermarked images, text or arrow overlays, wrong-plumage labels and birds too small or too soft to show the marks.
- **Pixel size.** iNat originals were not measured (the API returns no dimensions). Many are ≤ 2048 px.
- **Plumage order.** Migrants: non-breeding first; breeding only where the traits sheet keys it. Large gulls: immature first.
- **Licence URLs.** CC0 1.0: https://creativecommons.org/publicdomain/zero/1.0/ · CC BY 4.0: https://creativecommons.org/licenses/by/4.0/ · CC BY-SA 4.0: https://creativecommons.org/licenses/by-sa/4.0/ · CC BY 2.0: https://creativecommons.org/licenses/by/2.0/ · CC BY-SA 2.0: https://creativecommons.org/licenses/by-sa/2.0/ (iNat "cc-by" / "cc-by-sa": confirm the version on the photo page).

Confidence: **High** = diagnostic marks clearly visible; **Medium** = correct, but a mark is hidden or there is a quality issue; **Low** = fallback only.

## Summary

| # | Species | Plumages | Candidates found (viewed) | Gaps / weak |
|---|---|---|---|---|
| 1 | Common Redshank | non-breeding | 3 (all SL) | – |
| 2 | Marsh Sandpiper | non-breeding | 2 (SL) | – |
| 3 | Common Greenshank | non-breeding | 2 (SL) | – |
| 4 | Green Sandpiper | adult | 2 (SL; one CC0) | – |
| 5 | Terek Sandpiper | non-breeding | 2 (SL) | Main bird is **leg-flagged**; alt is soft (CC0) |
| 6 | Wood Sandpiper | adult | 2 (SL) | – |
| 7 | Ruddy Turnstone | non-breeding, breeding | non-breeding 1 (SL), breeding 2 (India; SL soft) | – |
| 8 | Sanderling | non-breeding | 2 (India) | Only open SL record is tiny in frame |
| 9 | Curlew Sandpiper | non-breeding, breeding | non-breeding 1 (SL), breeding 1 (SL, soft) | Breeding medium only |
| 10 | Little Stint | non-breeding | 2 (SL) | – |
| 11 | Indian Courser (sensitive) | adult | 2 (India) | **No open SL photo** (both SL records are CC BY-NC) |
| 12 | Small Pratincole (sensitive) | adult (rest, flight) | rest 1 (SL), flight 1 (India) | – |
| 13 | Oriental Pratincole | breeding, non-breeding | breeding 2 (Thailand, India), non-breeding/flight 2 (SL) | No SL breeding adult |
| 14 | Red-necked Phalarope | non-breeding | 2 (India soft; Spain distant) | **Weak**; no SL record (expected gap) |
| 15 | Lesser Black-backed Gull | immature, adult | immature 1 (India, low), adult 2 (SL, India) | **Immature weak**; *heuglini* ID of immature not confirmable |
| 16 | Pallas's Gull | immature, adult non-breeding, adult hooded | 2 + 1 + 1 (all India) | No open SL photo (SL records are CC BY-NC) |
| 17 | Brown-headed Gull | non-breeding, first-winter, breeding | non-breeding 2 (SL), breeding 1 (SL CC0) | **First-winter: none found** |
| 18 | Gull-billed Tern | non-breeding, breeding | non-breeding 2 (SL), breeding 1 (Russia) | No SL/South Asian breeding adult |
| 19 | Caspian Tern | non-breeding, breeding | non-breeding 2 (SL; Gambia), breeding 1 (India flock) | Breeding medium only |
| 20 | Lesser Crested Tern | non-breeding, breeding | non-breeding 2 (India), juvenile/1st-year 1 (SL) | **Breeding: none acceptable** |
| 21 | Great Crested Tern (sensitive) | breeding, non-breeding | non-breeding 1 (SL), breeding 1 (Palau) | Breeding photo is a Pacific subspecies |
| 22 | Roseate Tern (sensitive) | breeding, non-breeding | breeding 2 (Indonesia, Taiwan) | **No open SL record**; non-breeding weak (distant, Kerala) |
| 23 | Saunders's Tern (sensitive) | breeding adult | 2 (Saudi Arabia; Kerala) | SL CC0 record **looks like Little Tern** to me; ID check needed |
| 24 | Bridled Tern (sensitive) | adult | 2 (India) | SL open records distant or blurred |
| 25 | Sooty Tern (sensitive) | adult | 2 (Australia) | SL record distant (at sea); underside views only |
| 26 | Whiskered Tern | non-breeding, breeding | non-breeding 2 (SL; Kerala), breeding 1 (Poland) | No SL breeding adult |
| 27 | White-winged Tern | non-breeding, breeding | non-breeding 2 (SL), breeding 2 (Poland) | – |

Totals: 27 species, 27 with at least one viewed candidate. **2 plumage gaps** with no acceptable candidate (Lesser Crested Tern breeding, Brown-headed Gull first-winter). **5 weak or conditional fills** (Red-necked Phalarope; Lesser Black-backed Gull immature; Roseate Tern non-breeding; Saunders's Tern, where the only SL photo needs an ID check; Sooty Tern, where no usable SL photo exists). No CC BY-NC candidate is proposed. There are no endemics in this batch. 9 species have a Sri Lankan main photo for every plumage.

## Gaps and owner decisions

1. **No acceptable candidate:** Lesser Crested Tern breeding (full black cap to the bill; the open photos all show a white forehead); Brown-headed Gull first-winter (not found in this pass). Next steps: check CC BY-NC SL or Indian records (owner allows NC with the "replace before launch" flag) or ask Sri Lankan photographers (Mannar and Kalpitiya tern roosts in March to April).
2. **The CC0 "no rights reserved" accounts are now identified.** The iNat API returns `user.login` for CC0 photos:
   - **`wilmotsenaratne`** is the account behind the watermarked CC0 photos that batch 2 rejected ("© Wilmot Senaratne"). Batch 3 uses **none** of its photos.
   - **`ssrikumar`** is the account behind all four CC0 photos that batch 2 *proposed* (Grey Plover 676393260, Little Ringed Plover 676396095, Greater Sand-Plover 676907866, Bar-tailed Godwit 676391252); I confirmed this from the API. It is not the watermarked account. Its 2026 Mannar and Kumana uploads are CC0, but its **2024 uploads are CC BY-NC** (e.g. Indian Courser 327853511, Pallas's Gull 327846329), so the licence must be read per photo, not per account. Attribution: the API gives no display name for CC0; I suggest crediting "ssrikumar (iNaturalist), CC0" unless the owner prefers "no rights reserved".
   - Batch 3 proposes 6 ssrikumar CC0 photos (Terek alt, Turnstone breeding alt, Curlew Sandpiper breeding, Little Stint alt, Brown-headed Gull breeding, Saunders's SL alt). None showed a watermark at 500 px; check each at full size before ingest.
3. **Split-sensitive, Lesser Black-backed Gull (`slb-larus-fuscus`):** photos must be the *heuglini* type (dark slate mantle, yellow legs). The SL adult (Judy Gallagher, Mannar) and the Kerala adult (iNat ID *L. f. heuglini*) fit. I **rejected** Afsar Nayakkan's Azhikkal photo 346975228 because the front bird has a paler grey mantle and pinkish legs (more like a Steppe/Caspian-type gull). Immature large gulls cannot be safely identified to this taxon from one photo; the proposed immature (Raginipande, Gujarat) relies on the uploader's label.
4. **Saunders's Tern ID check (`slb-sternula-saundersi`):** the only open SL photo (ssrikumar CC0, 676909573, 1 agreement) shows a small tern with a square white forehead, but the **legs look orange-yellow** and the rump and tail look white. To me these fit Little Tern better (Saunders's usually has dark legs and a grey rump and tail). I list it as a **fallback only, pending an expert check**. The proposed main photo is the Jeddah bird (dark legs, short white forehead patch).
5. **Sensitive locations (zone level only):** for the seven sensitive candidates, SL photos are credited at zone level ("arid north coast", "south coast", "dry lowland"). Their iNat pages show finer places; these must not be copied into credits. Non-SL photos keep their stated place. I suggest the owner add these species to `sensitive-species.csv` (the traits summary already proposes this; not edited here).
6. **Leg-flagged bird (Terek Sandpiper main, Judy Gallagher 681907084):** the bird carries a green leg flag. It is a normal ringing mark and the bird is otherwise ideal, but the owner may prefer an unflagged bird for the guide.
7. **Licence or metadata notes:**
   - Charles J. Sharp files (Small Pratincole, Caspian Tern, Great Crested Tern, Whiskered Tern, Sooty Tern) carry the photographer's phone number and website in EXIF; stripped at ingest (same as batch 2).
   - Two Commons files carry a GIMP "Public Domain" ICC/EXIF tag (Saunders's Tern Jeddah crop, Roseate Tern Tanjung Pasir); the Commons licence (CC BY 4.0) governs.
   - The Saunders's Jeddah crop (800×600) is an MPF derivative of hungryholobiont's 2048 px original; attribution must name the original author. Prefer the original file and crop at ingest.
   - The PotMart186 Sooty Tern (Michaelmas Cay) looks heavily processed (very smooth); acceptable as an alt only.
8. **Rejected for watermarks or overlays:** Hari K Patibanda's Indian Courser (name watermark); all **Imran Shah** files (gulls, phalarope, pratincoles, Whiskered and White-winged Terns: "IMRAN SHAH (year)" text); Nandan Sreejith's Heuglin's Gull (date stamp); Edmundas Greimas's Whiskered Tern 379400389 (red arrows drawn on the image).
9. **Subspecies to confirm (I am not certain):** Great Crested Tern SL form (*velox*?; the breeding candidate is Pacific *cristatus*); Roseate Tern SL form (*korustes*?; candidates are *bangsi*); Sooty Tern Indian Ocean form (*nubilosus*?; candidates are *serratus*); Bridled Tern SL form (*antarcticus*?); Whiskered Tern (*hybrida*, as labelled on the SL Commons file); Gull-billed Tern (nominate?); Lesser Crested Tern (nominate *bengalensis*?); Redshank winterers (*ussuriensis* / *terrignotae*?); Sanderling and Turnstone (nominate assumed). Check against Avibase or the CBC list before recording any subspecies. The other species are monotypic as far as I know (confirm).
10. **Not Sri Lanka (allowed for non-endemics):** Turnstone breeding; Sanderling (both); Indian Courser (both); Small Pratincole flight; Oriental Pratincole breeding (both); Phalarope (both); LBBG immature and adult alt; Pallas's Gull (all); Gull-billed breeding; Caspian alt and breeding; Lesser Crested non-breeding (both); Great Crested breeding; Roseate (all); Saunders's main and alt; Bridled (both); Sooty (both); Whiskered breeding and non-breeding alt; White-winged breeding (both).
11. **Weaker fills to review first:** Phalarope (soft, hazy), LBBG immature, Roseate non-breeding (distant), Curlew Sandpiper breeding (soft), Caspian breeding (flock), Terek alt (soft), Sooty alt (processed look).

---

## 1. Common Redshank (`slb-tringa-totanus`)
Plumages: **non-breeding** (migrant; as seen here).
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| non-breeding | [iNat photo 259777933](https://www.inaturalist.org/photos/259777933) (obs [150632396](https://www.inaturalist.org/observations/150632396), 3 agreements) | avocat | CC BY 4.0 | Yala, Hambantota, Sri Lanka (22 January) | High, viewed. Grey-brown upperparts, **bright orange-red legs and red bill base**, white secondaries just visible, feeding at the tide line; clean pale background | Head down (feeding) |
| non-breeding (alt) | [iNat photo 62657140](https://www.inaturalist.org/photos/62657140) (obs [39488081](https://www.inaturalist.org/observations/39488081), 3 agreements) | William Stephens | CC BY 4.0 | Ambalanthota, Hambantota, Sri Lanka | Medium, viewed. Standing side view with reflection, red legs and bill base | Slightly soft, portrait frame |
| non-breeding (alt 2) | [iNat photo 62657357](https://www.inaturalist.org/photos/62657357) (obs [39488295](https://www.inaturalist.org/observations/39488295), 3 agreements) | William Stephens | CC BY 4.0 | Hambantota, Sri Lanka | Medium, viewed. Redshank beside a **Wood Sandpiper** (useful size comparison) | Two species in one frame; crop for the Redshank |
Not used: wilmotsenaratne CC0 records (watermark account). Not viewed: spacegecko 348178288 (3 agreements), Kiwi Shen 459401872 (URL failed).

## 2. Marsh Sandpiper (`slb-tringa-stagnatilis`)
Plumages: **non-breeding**.
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| non-breeding | [iNat photo 62657534](https://www.inaturalist.org/photos/62657534) (obs [39488332](https://www.inaturalist.org/observations/39488332), 4 agreements) | William Stephens | CC BY 4.0 | Hambantota, Sri Lanka | High, viewed. **Needle-fine straight bill**, pale grey upperparts, white face and underparts, long greenish legs, wading | Grass stems in the foreground |
| non-breeding (alt) | [iNat photo 262144186](https://www.inaturalist.org/photos/262144186) (obs [151890282](https://www.inaturalist.org/observations/151890282), 3 agreements) | avocat | CC BY 4.0 | Hambantota, Sri Lanka | Medium, viewed. Standing side view, fine bill | Soft, greenish cast |
Not viewed: Christoph Moning 92419248, Tom Heijnen 410054117, Judy Gallagher 681903564 (CC BY-SA).

## 3. Common Greenshank (`slb-tringa-nebularia`)
Plumages: **non-breeding**.
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| non-breeding | [iNat photo 348178331](https://www.inaturalist.org/photos/348178331) (obs [197660223](https://www.inaturalist.org/observations/197660223), 4 agreements) | spacegecko | CC BY 4.0 | Hambantota, Sri Lanka | High, viewed. **Stout, slightly upturned bill**, grey-brown upperparts, white underparts, long greenish legs, full bird | Algae-covered background |
| non-breeding (alt) | [iNat photo 681307607](https://www.inaturalist.org/photos/681307607) (obs [372825190](https://www.inaturalist.org/observations/372825190), 3 agreements) | Judy Gallagher | CC BY-SA 4.0 | Mannar Island, Sri Lanka (11 March) | Medium-high, viewed. Wading on blue water, upturned bill | Slightly soft; some darker scapulars (early spring moult) |
Rejected: avocat 259935186 (small in frame); Tim 687782940 (soft, small).

## 4. Green Sandpiper (`slb-tringa-ochropus`)
Plumages: **adult** (sexes alike). Only 5 open SL records.
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| adult | [iNat photo 447589885](https://www.inaturalist.org/photos/447589885) (obs [250284487](https://www.inaturalist.org/observations/250284487)) | Tero Linjama | CC0 1.0 | Moneragala District, Sri Lanka (25 November) | High, viewed. **Dark olive-brown upperparts with fine pale spots**, white belly sharply cut from the streaked breast, short pale brow before the eye, standing in a puddle | 1 agreement (ID is clear) |
| adult (alt) | [iNat photo 62170317](https://www.inaturalist.org/photos/62170317) (obs [39206839](https://www.inaturalist.org/observations/39206839)) | William Stephens | CC BY 4.0 | Karuwalagaswewa, Puttalam, Sri Lanka | High, viewed. Close side view on lily pads, dark back, white belly | 1 agreement |
Rejected: avocat 262673069 (grass across the bird). Not viewed: Tom Heijnen 409868321 (URL failed), sturuss CC0 450360298.

## 5. Terek Sandpiper (`slb-xenus-cinereus`)
Plumages: **non-breeding**. Only 5 open SL records, 3 of them from the watermark account.
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| non-breeding | [iNat photo 681907084](https://www.inaturalist.org/photos/681907084) (obs [373140514](https://www.inaturalist.org/observations/373140514), 4 agreements) | Judy Gallagher | CC BY-SA 4.0 | Mannar Island, Sri Lanka (11 March) | High, viewed. **Long upturned bill**, grey upperparts, white underparts, short **orange legs**, on wet sand | Bird carries a **green leg flag** (owner decision); small preview, original size not measured |
| non-breeding (alt) | [iNat photo 676910025](https://www.inaturalist.org/photos/676910025) (obs [370532003](https://www.inaturalist.org/observations/370532003), 2 agreements) | ssrikumar | CC0 1.0 | Talaimannar, Sri Lanka (5 April) | Medium, viewed. Close: upturned orange-based bill, bright orange legs, dark carpal line | Soft (heavy crop); check the full-size file for a watermark |
Not used: wilmotsenaratne CC0 records.

## 6. Wood Sandpiper (`slb-tringa-glareola`)
Plumages: **adult** (sexes alike).
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| adult | [iNat photo 348183449](https://www.inaturalist.org/photos/348183449) (obs [197660279](https://www.inaturalist.org/observations/197660279), 3 agreements) | spacegecko | CC BY 4.0 | Hambantota, Sri Lanka | High, viewed. **Bold white supercilium, heavily white-spotted brown back**, yellowish legs, clean sand and water | None notable |
| adult (alt) | [iNat photo 262144345](https://www.inaturalist.org/photos/262144345) (obs [151890307](https://www.inaturalist.org/observations/151890307), 3 agreements) | avocat | CC BY 4.0 | Hambantota, Sri Lanka | High, viewed. Feeding in shallow water, spotted back, long brow | Grass stems across the legs |
Rejected: Niels Raes 12815143 (a Black-winged Stilt dominates the frame).

## 7. Ruddy Turnstone (`slb-arenaria-interpres`)
Plumages: **non-breeding** (first), **breeding** (April and August, per traits sheet).
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| non-breeding | [iNat photo 62657505](https://www.inaturalist.org/photos/62657505) (obs [39488327](https://www.inaturalist.org/observations/39488327), 4 agreements) | William Stephens | CC BY 4.0 | Hambantota, Sri Lanka (16 February) | High, viewed. Stocky, **dark breast bib, short wedge bill, orange legs**, mottled brown-black upperparts | A few rufous feathers already showing (late winter) |
| breeding | [Commons "Ruddy Turnstone by Tisha Mukherjee 11.jpg"](https://commons.wikimedia.org/wiki/File:Ruddy_Turnstone_by_Tisha_Mukherjee_11.jpg) (3775×2517) | Tisha Mukherjee | CC BY-SA 4.0 | Bakkhali, West Bengal, India (13 May) | High, viewed. **Chestnut-and-black back, black-and-white face pattern**, black breast, orange legs, on sand | Not Sri Lanka; face not fully black-and-white yet (late spring) |
| breeding (SL alt) | [iNat photo 676390478](https://www.inaturalist.org/photos/676390478) (obs [370253178](https://www.inaturalist.org/observations/370253178), 2 agreements) | ssrikumar | CC0 1.0 | Mannar, Sri Lanka (2 April) | Medium, viewed. Group of four in mixed plumage, rufous backs coming in | Soft; several birds; check the full-size file for a watermark |
Not viewed: Christoph Moning 92420254, avocat 259621423. Rejected: Navaneeth Sini George 371589805 (Lakshadweep, distant flock).

## 8. Sanderling (`slb-calidris-alba`)
Plumages: **non-breeding**. Only 1 open SL record (avocat 259778122, five birds tiny on a beach; rejected). The Sinhala name placeholder is unchanged.
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| non-breeding | [Commons "Sanderling Calidris alba by Vedant Kasambe DSC 2070 01.jpg"](https://commons.wikimedia.org/wiki/File:Sanderling_Calidris_alba_by_Vedant_Kasambe_DSC_2070_01.jpg) (2859×1906) | Vedant Raju Kasambe | CC BY-SA 4.0 | Akshi beach, Alibaug, Maharashtra, India | High, viewed. Very pale grey, **black shoulder mark**, black bill and legs, walking on wet sand | Not Sri Lanka; warm low light |
| non-breeding (alt) | [Commons "Sanderling in Bakkhali February 2026 by Tisha Mukherjee 01.jpg"](https://commons.wikimedia.org/wiki/File:Sanderling_in_Bakkhali_February_2026_by_Tisha_Mukherjee_01.jpg) (1868×1252) | Tisha Mukherjee | CC BY-SA 4.0 | Bakkhali, West Bengal, India | Medium, viewed. Two birds: one in side view, one head-on (white face and breast) | Not Sri Lanka; rear bird has darker-centred scapulars (first-winter) |
Also viewed: Tisha Mukherjee "September 2025 01" (juvenile, not needed). Not viewed: Manoj Karingamadathil iNat 70024090 (Kerala, URL failed).

## 9. Curlew Sandpiper (`slb-calidris-ferruginea`)
Plumages: **non-breeding** (first), **breeding** (April to May and August).
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| non-breeding | [iNat photo 62657517](https://www.inaturalist.org/photos/62657517) (obs [39488328](https://www.inaturalist.org/observations/39488328), 4 agreements) | William Stephens | CC BY 4.0 | Hambantota, Sri Lanka | High, viewed. Grey-brown, pale brow, **long evenly down-curved black bill**, black legs, wading | None notable |
| breeding | [iNat photo 676336814](https://www.inaturalist.org/photos/676336814) (obs [370225280](https://www.inaturalist.org/observations/370225280), 3 agreements) | ssrikumar | CC0 1.0 | Mannar, Sri Lanka (arid north; 2 April) | Medium, viewed. Moulting into breeding: **brick-red face and breast**, chestnut-spangled back, down-curved bill | Soft (heavy crop); not full breeding; check the full-size file for a watermark |
Not viewed: spacegecko 348185526 set, Judy Gallagher 666255599 (CC BY-SA), Tero Linjama CC0 447606752.

## 10. Little Stint (`slb-calidris-minuta`)
Plumages: **non-breeding**.
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| non-breeding | [iNat photo 62657521](https://www.inaturalist.org/photos/62657521) (obs [39488329](https://www.inaturalist.org/observations/39488329), 3 agreements) | William Stephens | CC BY 4.0 | Hambantota, Sri Lanka | High, viewed. Tiny, grey-brown with dark-centred coverts, **short straight black bill**, black legs, close and sharp | A twig crosses the lower right |
| non-breeding (alt) | [iNat photo 676397794](https://www.inaturalist.org/photos/676397794) (obs [370256798](https://www.inaturalist.org/observations/370256798), 4 agreements) | ssrikumar | CC0 1.0 | Vankalai, Mannar, Sri Lanka (3 April) | Medium, viewed. Moulting into breeding (rufous fringes) | Soft; spring moult, not winter plumage; check for a watermark |
Not viewed: William Stephens 62657384 set, Tom Heijnen 410140581.

## 11. Indian Courser (`slb-cursorius-coromandelicus`) — treat as sensitive (NT, local ground-nester)
Plumages: **adult** (sexes alike). Only 2 SL records on iNat, both **CC BY-NC** (ssrikumar 2024, thilinahettiarachchi); not used. Monotypic as far as I know, so Indian photos are a fair stand-in. The photos **support the traits doubt**: the adult has a **rufous crown and chestnut breast**, which the workbook omits.
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| adult | [Commons "Indian Courser in Bhigwan August 2025 by Tisha Mukherjee 02.jpg"](https://commons.wikimedia.org/wiki/File:Indian_Courser_in_Bhigwan_August_2025_by_Tisha_Mukherjee_02.jpg) (5229×3486) | Tisha Mukherjee | CC BY-SA 4.0 | Bhigwan, Maharashtra, India | High, viewed. **Rufous crown, black-and-white eye stripes, chestnut breast**, long white legs, full front view | Not Sri Lanka |
| adult (alt) | [Commons "Indian Courser (30055525118).jpg"](https://commons.wikimedia.org/wiki/File:Indian_Courser_(30055525118).jpg) (2033×1525) | Mike Prince | CC BY 2.0 | Not stated (India; uploader in Bangalore) | Medium, viewed. Full side view on bare ground, face pattern | Bird smaller in frame; place not stated |
Rejected: Hari K Patibanda "Osman Sagar" (excellent bird, but a **name watermark**); J.M. Garg (pilot watermark policy).

## 12. Small Pratincole (`slb-glareola-lactea`) — treat as sensitive (colonial sandbar nester)
Plumages: **adult**, at rest and in flight (sexes alike). The rest photo **supports the traits doubt**: the throat is pale buff with a **black loral line**, not a dark throat.
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| adult (rest) | [Commons "Small pratincole (Glareola lactea).jpg"](https://commons.wikimedia.org/wiki/File:Small_pratincole_(Glareola_lactea).jpg) (3011×2007) | Charles J. Sharp | CC BY-SA 4.0 | Sri Lanka (dry lowland; finer place withheld) | High, viewed. Small pale grey pratincole, **black loral stripe, red bill base**, short black legs, on gravel | EXIF holds contact details (stripped at ingest) |
| adult (flight) | [Commons "Flight Small Pratincole Harangi Coorg Apr24 D72 26728.jpg"](https://commons.wikimedia.org/wiki/File:Flight_Small_Pratincole_Harangi_Coorg_Apr24_D72_26728.jpg) (1602×1602) | Timothy A. Gonsalves | CC BY-SA 4.0 | Harangi Reservoir, Coorg, Karnataka, India | High, viewed. Flight: **white secondary panel, black underwing coverts**, black tail tip | Not Sri Lanka |
Not viewed: Christoph Moning iNat 92419518 (SL, 4 agreements; URL failed). Not used: wilmotsenaratne CC0 records; Sultan Ahmed Niloy "family" (chicks).

## 13. Oriental Pratincole (`slb-glareola-maldivarum`)
Plumages: **breeding adult**, **non-breeding**. The breeding photos **support the traits doubt**: a **creamy-buff throat bordered by a black line**, not a chestnut throat; the flight photo shows **chestnut underwing coverts**.
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| breeding | [Commons "Glareola maldivarum - Beung Borapet.jpg"](https://commons.wikimedia.org/wiki/File:Glareola_maldivarum_-_Beung_Borapet.jpg) (4896×3264) | JJ Harrison | CC BY-SA 3.0 | Beung Borapet, Nakhon Sawan, Thailand | High, viewed. **Buff throat with black necklace, red gape**, olive-brown upperparts, long wings, full bird | Not Sri Lanka |
| breeding (alt) | [Commons "Oriental Pratincole by Tisha Mukherjee 01.jpg"](https://commons.wikimedia.org/wiki/File:Oriental_Pratincole_by_Tisha_Mukherjee_01.jpg) (2998×1999) | Tisha Mukherjee | CC BY-SA 4.0 | Baruipur, West Bengal, India | Medium-high, viewed. Three birds on grass, necklace visible on two | Not Sri Lanka; three birds |
| non-breeding | [iNat photo 327247807](https://www.inaturalist.org/photos/327247807) (obs [187162039](https://www.inaturalist.org/observations/187162039), 2 agreements) | Griha Hasanov | CC BY 4.0 | Ragama, Sri Lanka (wet lowland; 14 September) | Medium-high, viewed. Standing on grass: plain brown, faint streaky throat border, white rump visible | Bird smaller in frame |
| flight (SL) | [iNat photo 618793622](https://www.inaturalist.org/photos/618793622) (obs [340079515](https://www.inaturalist.org/observations/340079515)) | Griha Hasanov | CC BY 4.0 | Ragama, Sri Lanka | High, viewed. **Chestnut underwing coverts**, white rump, forked tail | 1 agreement (ID clear) |
Rejected: William Stephens 62657594 (distant flock in a field).

## 14. Red-necked Phalarope (`slb-phalaropus-lobatus`)
Plumages: **non-breeding**. Scarce at sea; **no open SL record** (expected gap per traits sheet).
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| non-breeding | [iNat photo 158656182](https://www.inaturalist.org/photos/158656182) (obs [95558415](https://www.inaturalist.org/observations/95558415), 4 agreements) | Manoj Karingamadathil | CC BY-SA 4.0 | Kuniyan wetland, Kerala, India (20 September) | Medium, viewed. Swimming: **black eye patch, needle bill**, grey-and-white back with buff fringes | Hazy and soft; a first-winter bird moulting from juvenile |
| non-breeding (alt) | [Commons "Phalaropus lobatus Cadiz CS01.jpg"](https://commons.wikimedia.org/wiki/File:Phalaropus_lobatus_Cadiz_CS01.jpg) (6000×4000) | Christoph Sager | CC BY 4.0 | Near Cadiz, Spain (labelled non-breeding, February) | Low-medium, viewed. Winter adult swimming, eye patch | Small in frame (crop from the 6000 px original) |
Rejected: Imran Shah Gilgit-Baltistan files (watermark).

## 15. Lesser Black-backed Gull (`slb-larus-fuscus`) — split-sensitive (*heuglini* type)
Plumages: **immature** (first; keyed `juvenile`), **adult**. Photos must show the *heuglini* type (Heuglin's Gull in some lists). Only 5 open SL records.
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| immature | [Commons "Larus fuscus heuglini, immature, River Gomti, Gujarat.jpg"](https://commons.wikimedia.org/wiki/File:Larus_fuscus_heuglini,_immature,_River_Gomti,_Gujarat.jpg) (2228×2228) | Raginipande | CC BY-SA 4.0 | Dwarka, Gujarat, India (labelled *heuglini*, immature) | Low-medium, viewed. Taking off: white head and body, **dark brown primaries and secondaries, dark tail band**, black bill | **Taxon from the uploader's label only** (immature large gulls are not safely identified from one photo); wings raised |
| adult | [iNat photo 681900107](https://www.inaturalist.org/photos/681900107) (obs [373137290](https://www.inaturalist.org/observations/373137290), 1 agreement) | Judy Gallagher | CC BY-SA 4.0 | Mannar Island, Sri Lanka (11 March) | Medium-high, viewed. **Dark slate-grey mantle, yellow legs, yellow bill with red spot**, walking at the tide edge; primaries in moult (fits *heuglini*) | Slightly soft; iNat ID at species level only |
| adult (alt) | [iNat photo 255368362](https://www.inaturalist.org/photos/255368362) (obs [148307239](https://www.inaturalist.org/observations/148307239), 1 agreement) | Afsar Nayakkan | CC BY 4.0 | Elathur Beach, Kerala, India (iNat ID *L. f. heuglini*) | Medium, viewed. Adult in front with dark grey mantle and yellow bill; an immature and other adults behind | Several gulls in frame; legs at the frame edge |
Rejected: Tom Heijnen 410145627 (distant row on a beach); Nandan Sreejith 607666269 (date stamp on the image); Afsar Nayakkan 346975228 (front bird looks paler-mantled and pink-legged, not *heuglini*); Satheesan.vn "Larus heuglini ckd1/ckd2" (distant mixed flocks); Imran Shah (watermark).

## 16. Pallas's Gull (`slb-ichthyaetus-ichthyaetus`)
Plumages: **immature** (first), **adult non-breeding**, **adult hooded** (late winter). No open SL record: the SL records on iNat are CC BY-NC (ssrikumar 2024, matthieu_gauvain) or unlicensed. Note: `taxon_name=Ichthyaetus ichthyaetus` on the iNat API wrongly matched Grey-headed Fish-eagle; searched by taxon id 144521 instead.
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| immature | [Commons "Pallas's Gull by Tisha Mukherjee 01.jpg"](https://commons.wikimedia.org/wiki/File:Pallas%27s_Gull_by_Tisha_Mukherjee_01.jpg) (3528×2352) | Tisha Mukherjee | CC BY-SA 4.0 | Bakkhali, West Bengal, India (6 September) | Medium-high, viewed. Two juveniles resting on wet sand: **scaly brown back, dusky eye mask, heavy dark-tipped bill** | Not Sri Lanka; two birds overlap |
| immature (alt) | [Commons "Pallas's Gull by Tisha Mukherjee 26.jpg"](https://commons.wikimedia.org/wiki/File:Pallas%27s_Gull_by_Tisha_Mukherjee_26.jpg) (4587×3058) | Tisha Mukherjee | CC BY-SA 4.0 | Bakkhali, West Bengal, India (17 January) | Medium, viewed. Older immature with grey back, black-tipped bill, among **Brown-headed Gulls** (size comparison) | Several species in frame |
| adult non-breeding | [Commons "Pallas's Gull in Bhigwan January 2026 by Tisha Mukherjee 01.jpg"](https://commons.wikimedia.org/wiki/File:Pallas%27s_Gull_in_Bhigwan_January_2026_by_Tisha_Mukherjee_01.jpg) (2705×1813) | Tisha Mukherjee | CC BY-SA 4.0 | Bhigwan, Maharashtra, India | High, viewed. Swimming: **dark-streaked half-hood, white eye crescents, yellow bill with dark band**, grey back, white-tipped black primaries | Not Sri Lanka |
| adult hooded | [Commons "Pallas's Gull in Bakkhali February 2026 by Tisha Mukherjee 03.jpg"](https://commons.wikimedia.org/wiki/File:Pallas%27s_Gull_in_Bakkhali_February_2026_by_Tisha_Mukherjee_03.jpg) (2169×1454) | Tisha Mukherjee | CC BY-SA 4.0 | Bakkhali, West Bengal, India (13 February) | High, viewed. Flight: **full black hood**, yellow-orange bill, white wings with small black tips | Not Sri Lanka; underside only |
Rejected: Imran Shah files (watermark).

## 17. Brown-headed Gull (`slb-chroicocephalus-brunnicephalus`)
Plumages: **non-breeding** (first), **first-winter**, **breeding** (March to April).
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| non-breeding | [iNat photo 410145061](https://www.inaturalist.org/photos/410145061) (obs [230959579](https://www.inaturalist.org/observations/230959579), 3 agreements) | Tom Heijnen | CC BY 4.0 | Pesalai, Mannar, Sri Lanka | High, viewed. Flight: white head with dark ear spot, **black wingtip with white mirrors**, red bill and legs | Flight view only |
| non-breeding (alt) | [iNat photo 681295902](https://www.inaturalist.org/photos/681295902) (obs [372819372](https://www.inaturalist.org/observations/372819372), 2 agreements) | Judy Gallagher | CC BY-SA 4.0 | Mannar Island, Sri Lanka (11 March) | Medium-high, viewed. Standing with wings raised: the wingtip pattern, pale eye, red legs | Slightly soft |
| breeding | [iNat photo 676916361](https://www.inaturalist.org/photos/676916361) (obs [370535591](https://www.inaturalist.org/observations/370535591)) | ssrikumar | CC0 1.0 | Mannar, Sri Lanka (5 April) | High, viewed. **Chocolate-brown hood, pale eye with white eye-ring, dark red bill**, red legs, close | 1 agreement (ID is clear); check the full-size file for a watermark |
| first-winter | **none found** | – | – | – | – | Gap: not found in this pass (needs brown carpal bar and black tail band) |
Rejected: Tom Heijnen 410145685 (busy mixed flock with a large gull).

## 18. Gull-billed Tern (`slb-gelochelidon-nilotica`)
Plumages: **non-breeding** (first), **breeding**.
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| non-breeding | [iNat photo 62657100](https://www.inaturalist.org/photos/62657100) (obs [39488071](https://www.inaturalist.org/observations/39488071), 4 agreements) | William Stephens | CC BY 4.0 | Kalametiya, Sri Lanka (dry lowland coast) | High, viewed. Flight: **short thick black bill, dark ear patch on a white head**, pale grey wings | Flight only |
| non-breeding (alt) | [iNat photo 196783915](https://www.inaturalist.org/photos/196783915) (obs [116570351](https://www.inaturalist.org/observations/116570351), 4 agreements) | desertnaturalist | CC BY 4.0 | Yala NP, Sri Lanka (25 April) | Medium, viewed. Standing: stout bill, long black legs, streaked crown | Soft |
| breeding | [iNat photo 197898756](https://www.inaturalist.org/photos/197898756) (obs [117197449](https://www.inaturalist.org/observations/117197449)) | Griha Hasanov | CC BY 4.0 | Stavropol Krai, Russia (8 May) | High, viewed. Flight: **full black cap**, thick black bill, pale grey wings | Not Sri Lanka; 1 agreement (ID clear); white sky |
Also viewed: Tisha Mukherjee "Bakkhali April 2026 01" and Shino jacob koottanad (both still non-breeding); Tejas M 264239036 and 689988212 (non-breeding).

## 19. Caspian Tern (`slb-hydroprogne-caspia`)
Plumages: **non-breeding**, **breeding**.
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| non-breeding | [iNat photo 409893177](https://www.inaturalist.org/photos/409893177) (obs [230829600](https://www.inaturalist.org/observations/230829600), 3 agreements) | Tom Heijnen | CC BY 4.0 | Mannar, Sri Lanka | Medium-high, viewed. Flight: **huge red bill**, streaked cap, dark undersides to the primaries | Flight from below |
| non-breeding (alt) | [Commons "Caspian tern (Hydroprogne caspia) non-breeding.jpg"](https://commons.wikimedia.org/wiki/File:Caspian_tern_(Hydroprogne_caspia)_non-breeding.jpg) (2677×1784) | Charles J. Sharp | CC BY-SA 4.0 | The Gambia | High, viewed. Standing: massive red bill with dark tip, streaked crown, black legs | Not Sri Lanka; EXIF contact details |
| breeding | [iNat photo 178012459](https://www.inaturalist.org/photos/178012459) (obs [106017418](https://www.inaturalist.org/observations/106017418), 2 agreements) | Paulmathi Vinod | CC BY 4.0 | Chennai, Tamil Nadu, India (11 April) | Medium, viewed. Several adults with **solid black caps and big red bills** among other terns | Flock; soft; crop needed |
Rejected: avocat 259309027 (distant). Not used: Shiv's fotografia "Red-billed traveler" (flock; I could not confirm every bird is Caspian).

## 20. Lesser Crested Tern (`slb-thalasseus-bengalensis`)
Plumages: **non-breeding** (first), **breeding**. Only 8 open SL records (4 from the watermark account).
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| non-breeding | [Commons "Lesser crested tern (Thalasseus bengalensis).jpg"](https://commons.wikimedia.org/wiki/File:Lesser_crested_tern_(Thalasseus_bengalensis).jpg) (3610×2083) | Shino jacob koottanad | CC BY-SA 4.0 | Not stated (5 November; owner check) | High, viewed. Several birds on rocks: **slim orange bill**, white forehead, black rear crown, pale grey back | Place not stated; group |
| non-breeding (alt) | [Commons "Lesser crested tern 4.jpg"](https://commons.wikimedia.org/wiki/File:Lesser_crested_tern_4.jpg) (3087×2648) | Afsarnayakkan | CC BY-SA 4.0 | Azhikkal, Kannur, Kerala, India (27 September) | Medium-high, viewed. Flight: orange bill, white forehead | Not Sri Lanka |
| juvenile / 1st-year (SL) | [iNat photo 744316797](https://www.inaturalist.org/photos/744316797) (obs [405244105](https://www.inaturalist.org/observations/405244105), 2 agreements) | Wolfgang Ahlmer | CC BY 4.0 | Trincomalee District, Sri Lanka (20 August) | Medium, viewed. Flight: orange bill, **dark carpal bar and dark secondaries** (young bird) | Not an adult; for reference only |
| breeding | **none acceptable** | – | – | – | – | Gap: every open photo found shows a white forehead (non-breeding or post-breeding) |
Also viewed: Charles J. Sharp "torresii in flight Michaelmas Cay" (Australian subspecies, white forehead; not used). Rejected: Aleksandr Gromov 602699569 (tiny), Afsar Nayakkan iNat 571503400 (tiny).

## 21. Great Crested Tern (`slb-thalasseus-bergii`) — treat as sensitive (colony breeder)
Plumages: **breeding**, **non-breeding**.
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| non-breeding | [iNat photo 62657092](https://www.inaturalist.org/photos/62657092) (obs [39488070](https://www.inaturalist.org/observations/39488070), 3 agreements) | William Stephens | CC BY 4.0 | Sri Lanka (south coast; finer place withheld) | High, viewed. Flight: **large, dark grey back, yellow bill**, white forehead, shaggy black rear crown | Flight only |
| breeding | [Commons "Great terns (Thalasseus bergii cristatus) breeding Rock Islands.jpg"](https://commons.wikimedia.org/wiki/File:Great_terns_(Thalasseus_bergii_cristatus)_breeding_Rock_Islands.jpg) (4750×3166) | Charles J. Sharp | CC BY-SA 4.0 | Rock Islands, Palau | Medium-high, viewed. Two adults on a branch: **shaggy black crest, yellow bill**, grey back | Not Sri Lanka; Pacific *cristatus* (SL form to confirm); white forehead band still shows; EXIF contact details |
Not viewed: Judy Gallagher Mannar set (CC BY-SA), Vihansith Kulatunga Trincomalee set (CC BY-SA).

## 22. Roseate Tern (`slb-sterna-dougallii`) — treat as sensitive (colony breeder)
Plumages: **breeding**, **non-breeding**. **No open-licence record from Sri Lanka or India on iNat** (0 results).
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| breeding | [Commons "Sterna dougallii bangsi, Tanjung Pasir, Banten, Indonesia 1.jpg"](https://commons.wikimedia.org/wiki/File:Sterna_dougallii_bangsi,_Tanjung_Pasir,_Banten,_Indonesia_1.jpg) (1029×709) | desertnaturalist | CC BY 4.0 | Tanjung Pasir, Banten, Indonesia (7 August) | High, viewed. **Black cap, red bill, red legs**, very pale grey upperparts, long tail | Not Sri Lanka; *bangsi*; 1029 px only |
| breeding (alt) | [Commons "Sterna dougallii bangsi, Baisha, Penghu, Taiwan 1.jpg"](https://commons.wikimedia.org/wiki/File:Sterna_dougallii_bangsi,_Baisha,_Penghu,_Taiwan_1.jpg) (2048×1365) | rururubisco | CC BY 4.0 | Baisha, Penghu, Taiwan (25 June) | High, viewed. Several adults on sand, front bird sharp: black cap, red bill, long white streamers | Not Sri Lanka; *bangsi*; other birds in frame |
| non-breeding | [Commons "Adult Roseate Terns (21987894625).jpg"](https://commons.wikimedia.org/wiki/File:Adult_Roseate_Terns_(21987894625).jpg) (2048×1152) | Mike Prince | CC BY 2.0 | At sea off Kannur, Kerala, India (4 October; place from the same Flickr set) | Low, viewed. Two adults in flight over the sea | **Distant**; marks hard to see. A better non-breeding photo is wanted |
Also viewed: MPF "Sterna dougallii.jpg" (Inner Farne, UK, nominate, among Sandwich Terns; a usable fallback for breeding). Not used: rururubisco Sanxiantai colony photo (birds at a colony).

## 23. Saunders's Tern (`slb-sternula-saundersi`) — treat as sensitive (few colonies); ID check needed
Plumages: **breeding adult**. The traits sheet asks for identification-checked photos (Little Tern is very similar).
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| breeding adult | [Commons "Saunders's Tern (Sternula saundersi), Jeddah, Saudi Arabia.jpg"](https://commons.wikimedia.org/wiki/File:Saunders%27s_Tern_(Sternula_saundersi),_Jeddah,_Saudi_Arabia.jpg) (2048×1365; viewed as the MPF 800 px crop) | hungryholobiont | CC BY 4.0 | Jeddah, Saudi Arabia (25 March) | Medium-high, viewed. **Short square white forehead patch not reaching behind the eye, dark legs**, black-tipped yellow bill | Not Sri Lanka; bird small (crop needed); the crop's EXIF has a GIMP "Public Domain" tag (Commons licence governs) |
| adult (alt) | [Commons "Saunders's tern 2.jpg"](https://commons.wikimedia.org/wiki/File:Saunders%27s_tern_2.jpg) (1440×1080) | Afsarnayakkan | CC BY-SA 4.0 | Mappila Bay, Kannur, Kerala, India (15 August) | Low-medium, viewed. Close resting bird, white forehead, dark outer primaries | Post-breeding (speckled crown); Little vs Saunders's not confirmable from this photo |
| SL fallback | [iNat photo 676909573](https://www.inaturalist.org/photos/676909573) (obs [370531829](https://www.inaturalist.org/observations/370531829), 1 agreement) | ssrikumar | CC0 1.0 | Sri Lanka (arid north coast; finer place withheld) | Low, viewed. Close breeding adult: black cap, square white forehead | **Legs look orange-yellow and rump/tail white: fits Little Tern better**; needs an expert check before any use |
Not viewed: Lintophilip UAE flight (CC BY-SA), Sasidharanmanekkara Ayikkara (Kerala).

## 24. Bridled Tern (`slb-onychoprion-anaethetus`) — treat as sensitive (colony breeder)
Plumages: **adult** (sexes alike).
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| adult | [Commons "Bridled Tern Onychoprion anaethetus 01.jpg"](https://commons.wikimedia.org/wiki/File:Bridled_Tern_Onychoprion_anaethetus_01.jpg) (2678×1785) | Dr. Raju Kasambe | CC BY 4.0 | Mumbai, Maharashtra, India (monsoon, 30 July) | High, viewed. **Brown-grey back, white brow reaching behind the eye, pale collar**, black cap and bill, on a rock | Not Sri Lanka |
| adult (alt) | [Commons "Bridled Tern Onychoprion anaethetus 03.jpg"](https://commons.wikimedia.org/wiki/File:Bridled_Tern_Onychoprion_anaethetus_03.jpg) (3244×2098) | Dr. Raju Kasambe | CC BY 4.0 | Mumbai, Maharashtra, India | High, viewed. Same bird or session, side view on gravel | Not Sri Lanka |
Rejected: Ольга Бобровская iNat 558153694 (SL, three birds tiny in the sky); Afsar Nayakkan iNat 474575963 (blurred); Mike Prince Kerala set (distant).

## 25. Sooty Tern (`slb-onychoprion-fuscatus`) — treat as sensitive (colony breeder)
Plumages: **adult** (sexes alike). Pelagic; the only open SL record (William Stephens, off the south coast, 4 agreements) shows distant birds over rough sea (photos 63098712, 63098713; low, viewed).
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| adult | [Commons "Sooty tern (Onychoprion fuscatus serrata) in flight Michaelmas Cay 2.jpg"](https://commons.wikimedia.org/wiki/File:Sooty_tern_(Onychoprion_fuscatus_serrata)_in_flight_Michaelmas_Cay_2.jpg) (2685×1790) | Charles J. Sharp | CC BY-SA 4.0 | Michaelmas Cay, Queensland, Australia | High, viewed. Flight from below: white underparts, **black cap and broad white forehead not extending behind the eye**, dark underwing trailing edge | Not Sri Lanka; Australasian subspecies; black upperparts not shown |
| adult (alt) | [Commons "Sooty Tern at Michaelmas Cay IMG3497.jpg"](https://commons.wikimedia.org/wiki/File:Sooty_Tern_at_Michaelmas_Cay_IMG3497.jpg) (4689×5000) | PotMart186 | CC BY-SA 4.0 | Michaelmas Cay, Queensland, Australia | Medium-high, viewed. Hovering, wings raised, long forked tail | Looks heavily processed; underside only |
Rejected: Manojk "Sooty Tern from Ezhimala Lighthouse" (a **grounded juvenile**, possibly storm-driven or dead).

## 26. Whiskered Tern (`slb-chlidonias-hybrida`)
Plumages: **non-breeding** (first), **breeding**.
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| non-breeding | [Commons "Whiskered tern (Chlidonias hybrida hybrida) non breeding.jpg"](https://commons.wikimedia.org/wiki/File:Whiskered_tern_(Chlidonias_hybrida_hybrida)_non_breeding.jpg) (2815×1877) | Charles J. Sharp | CC BY-SA 4.0 | Bundala NP, Sri Lanka (25 February) | High, viewed. Wading: **streaked white crown with black rear, pale grey back, dark bill**, red legs | EXIF contact details (stripped at ingest) |
| non-breeding (alt) | [Commons "Whiskered tern(Chlidonias hybrida).jpg"](https://commons.wikimedia.org/wiki/File:Whiskered_tern(Chlidonias_hybrida).jpg) (4224×2832) | Afsarnayakkan | CC BY 4.0 | Kannur, Kerala, India | Medium, viewed. Perched on a post, same marks | Bird small in frame |
| breeding | [Commons "Whiskered tern (Chlidonias hybrida) 2021.jpg"](https://commons.wikimedia.org/wiki/File:Whiskered_tern_(Chlidonias_hybrida)_2021.jpg) (5568×3712) | TRinaud | CC BY 4.0 | Kostrzyn nad Odrą, Poland (26 June) | High, viewed. Flight: **black cap, white cheek stripe, dark grey belly, red bill**, over water lilies | Not Sri Lanka (nominate, the same subspecies as the SL label) |
Rejected: Edmundas Greimas 379400389 (red arrows drawn on the image); ssrikumar 676912502 (age and plumage unclear). Also viewed: William Stephens 62662530 (SL, flight, soft; a fallback). Not viewed: Christoph Moning 92410772.

## 27. White-winged Tern (`slb-chlidonias-leucopterus`)
Plumages: **non-breeding** (first), **breeding** (passage).
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| non-breeding | [iNat photo 92417259](https://www.inaturalist.org/photos/92417259) (obs [57912753](https://www.inaturalist.org/observations/57912753), 4 agreements) | Christoph Moning | CC BY 4.0 | Palatupana, Sri Lanka (22 January) | Medium-high, viewed. Flight over water: **dark ear spot ("headphones")**, white head, dark carpal bar | Second bird in the background; soft |
| non-breeding (alt) | [iNat photo 262354464](https://www.inaturalist.org/photos/262354464) (obs [152002769](https://www.inaturalist.org/observations/152002769), 4 agreements) | avocat | CC BY 4.0 | Hambantota, Sri Lanka | Medium, viewed. Flight, ear spot, pale tail | Motion blur |
| breeding | [Commons "Chlidonias leucopterus Biebrza 1.jpg"](https://commons.wikimedia.org/wiki/File:Chlidonias_leucopterus_Biebrza_1.jpg) (4224×3168) | Frank Vassen | CC BY 2.0 | Biebrza NP, Poland (21 May) | High, viewed. **Black body and head, white forewing, red legs**, with reflection | Not Sri Lanka |
| breeding (alt) | [Commons "White-winged tern (Chlidonias leucopterus) 2021.jpg"](https://commons.wikimedia.org/wiki/File:White-winged_tern_(Chlidonias_leucopterus)_2021.jpg) (5568×3712) | TRinaud | CC BY 4.0 | Kostrzyn nad Odrą, Poland (26 June) | Medium, viewed. Flight: black body, **white rump and tail, white upperwing coverts** | Head moulting (white patches) |
Not viewed: Jan Ebr & Ivana Ebrová Weligama set (1 agreement each; marsh terns at sea are unusual, check the ID).
