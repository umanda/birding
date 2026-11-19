# Batch 1 photo candidates (M8, spec 006)

Status: **proposed; research complete for all 33 species**. No images were downloaded into the repo, no `.webp` files were created and `licences.csv` was not edited. The owner reviews every candidate before any row is added.

Species: the 33 batch-1 species (plates 1 to 6, not in the pilot), taken from the batch-1 traits review sheet (`data/content/traits-review/batch-01.md`, PR #115). None of them is on `sensitive-species.csv`. iNaturalist already hides the exact location for some of them (Sri Lanka Wood-pigeon, Sri Lanka Red-faced Malkoha, Green Imperial-pigeon): only "Sri Lanka" is shown.

How these were checked (same practice as the M2 pilot):
- **Licence and author.** Read from the Wikimedia Commons API (`extmetadata`: Artist, LicenseShortName) or the iNaturalist API (`photos.license_code`, `attribution`), which is the metadata of the file page itself. Re-check the file page at ingest time.
- **Visual review.** I looked at a 500 px preview of every candidate marked "viewed". ID and plumage come from field marks in the image, backed by research grade and agreement count on iNat. Rows marked "not viewed" are fallbacks only.
- **Rejected.** Watermarked images (e.g. "© Wilmot Senaratne", "© Joseph Morlan", "© Thimindu Goonatillake") and wrong-plumage labels.
- **Pixel size.** iNat originals were not measured (the API returns no dimensions). Many are ≤ 2048 px.
- **Licence URLs.** CC0 1.0: https://creativecommons.org/publicdomain/zero/1.0/ · CC BY 4.0: https://creativecommons.org/licenses/by/4.0/ · CC BY-SA 4.0: https://creativecommons.org/licenses/by-sa/4.0/ · CC BY-SA 3.0: https://creativecommons.org/licenses/by-sa/3.0/ · CC BY-SA 2.0: https://creativecommons.org/licenses/by-sa/2.0/ · CC BY 2.0: https://creativecommons.org/licenses/by/2.0/ · CC BY-NC 4.0: https://creativecommons.org/licenses/by-nc/4.0/ (iNat "cc-by-nc"; confirm the version on the photo page).

Confidence: **High** = diagnostic marks clearly visible; **Medium** = correct, but a mark is hidden or there is a quality issue; **Low** = fallback only.

## Summary

| # | Species | Plumages | Candidates found (viewed) | Gaps / weak |
|---|---|---|---|---|
| 1 | Painted Francolin | adult | 1 (SL, CC0) | – |
| 2 | Sri Lanka Spurfowl (E) | male, female | male 3, female 2 (all SL) | Good male only CC BY-NC; open-licence males are dark and small |
| 3 | Gray Francolin | adult | 1 (SL, CC BY) | – |
| 4 | Barred Buttonquail | female, male | female 1, male 1 (SL, CC BY) | Male medium (flash, night) |
| 5 | Blue-breasted Quail | male, female | male 1 (Australia, wild) | **Female: none.** No SL open photo |
| 6 | Cotton Pygmy-goose | male, female | male 1, female 2 | Male soft, low resolution |
| 7 | Fulvous Whistling-duck | adult | 1 (India) | No open SL photo |
| 8 | Lesser Whistling-duck | adult | 1 (SL, CC BY) | – |
| 9 | Indian Spot-billed Duck | adult | 2 (India; SL weak) | SL photo small in frame |
| 10 | Eurasian Wigeon | male, female, eclipse | 1 each (Europe/Japan) | – |
| 11 | Northern Pintail | male, female | 1 each (+1 fallback) | – |
| 12 | Northern Shoveler | male, female, eclipse | 1 each | – |
| 13 | Little Grebe | breeding, non_breeding | breeding 2 (SL), non-breeding 1 | Non-breeding medium |
| 14 | Rock Pigeon | adult | 1 (SL, CC BY) | Group image (crop) |
| 15 | Sri Lanka Wood-pigeon (E) | adult | 3 (SL) | – |
| 16 | Eurasian Collared-dove | adult | 2 (SL) | – |
| 17 | Common Emerald Dove | male, female | male 1, female 1 (SL) | Male medium: green back hidden |
| 18 | Orange-breasted Green-pigeon | male, female | 1 each (SL) | – |
| 19 | Yellow-footed Green-pigeon | adult | 1 (SL, CC0) | Soft image |
| 20 | Sri Lanka Green-pigeon (E) | male, female | male 3, female 1 (SL) | – |
| 21 | Green Imperial-pigeon | adult | 2 (SL) | – |
| 22 | Blue-faced Malkoha | adult | 1 (SL, CC BY) | – |
| 23 | Sri Lanka Red-faced Malkoha (E) | adult | 1 (SL, CC BY) | – |
| 24 | Sirkeer Malkoha | adult | 2 (SL CC0; India) | – |
| 25 | Sri Lanka Green-billed Coucal (E) | adult | 1 (SL, CC BY) | A mislabelled Commons file found (it is a Greater Coucal) |
| 26 | Greater Coucal | adult | 1 (SL, CC BY) | – |
| 27 | Chestnut-winged Cuckoo | adult | 1 (SL, CC BY) | – |
| 28 | Jacobin Cuckoo | adult | 1 (SL, CC BY) | White wing patch hidden |
| 29 | Common Hawk-cuckoo | adult, juvenile | adult 1 (India) | **Juvenile: none.** No usable SL open photo; EXIF "all rights reserved" conflict on the adult |
| 30 | Indian Cuckoo | adult | 1 (SL, CC BY) | – |
| 31 | Grey-bellied Cuckoo | male, female, morph_hepatic | male 1 (SL), hepatic 1 | **Grey female: none** |
| 32 | Banded Bay Cuckoo | adult | 1 (SL, CC BY-SA) | Supercilium not clear (medium) |
| 33 | Fork-tailed Drongo-cuckoo | adult, juvenile | adult 1 (SL, CC BY) | **Juvenile: none** |

Totals: 33 species, 33 with at least one candidate (all viewed). 4 plumage gaps with no acceptable candidate (Blue-breasted Quail female, Common Hawk-cuckoo juvenile, Grey-bellied Cuckoo grey female, Drongo-cuckoo juvenile). 1 plumage only CC BY-NC at good quality (Sri Lanka Spurfowl male; open-licence fallbacks are weak). All five endemics have Sri Lankan photos.

## Gaps and owner decisions

1. **No acceptable candidate:** Blue-breasted Quail female; Common Hawk-cuckoo juvenile; Grey-bellied Cuckoo grey female; Fork-tailed Drongo-cuckoo juvenile. Next steps: check CC BY-NC iNat records from Sri Lanka (allowed by the owner), or ask Sri Lankan photographers for CC BY.
2. **NC decision:** Sri Lanka Spurfowl male. The best photo is CC BY-NC (lappuggla); the CC BY and CC0 males are dark and small.
3. **Weaker fills to look at first:** Cotton Pygmy-goose male (soft), Emerald Dove male (green back hidden; a clean copy of the watermarked Thimindu photo would be ideal), Yellow-footed Green-pigeon (soft), Barred Buttonquail male (flash), Little Grebe non-breeding (preening), Banded Bay Cuckoo (supercilium hidden).
4. **Licence or metadata conflicts:** the Common Hawk-cuckoo adult (Drashokk) has EXIF "ALL RIGHTS RESERVED" despite CC BY-SA 4.0 on Commons. Confirm before use.
5. **Subspecies to confirm (I am not certain):** Little Grebe "albescens" label on a Sri Lankan Commons file (I believe SL birds are *capensis*); the Sri Lankan Yellow-footed Green-pigeon subspecies (*phillipsi*?); the Sri Lankan resident Common Hawk-cuckoo (*ciceliae*?). Check against Avibase or the CBC list before recording any ssp.
6. **Sensitive locations:** no batch-1 species is on `sensitive-species.csv`. I suggest the owner consider adding Sri Lanka Green-billed Coucal (globally VU, working value). Its candidate gives only "Sri Lanka".
7. **Not Sri Lanka (allowed for non-endemics):** Fulvous Whistling-duck, Spot-billed Duck (main), the three Palearctic ducks, Blue-breasted Quail, Common Hawk-cuckoo, Grey-bellied hepatic.
8. **Commons label error found:** "Green-billed coucal.jpg" (Amila Tennakoon) shows a Greater Coucal.

---

## 1. Painted Francolin (`slb-francolinus-pictus`)
Plumages: **adult** (sexes nearly alike; traits draft has no plumage split). Sri Lankan birds belong to the local subspecies (ssp. not stated on the source).
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| adult | [iNat photo 713013973](https://www.inaturalist.org/photos/713013973) (obs [389266153](https://www.inaturalist.org/observations/389266153)) | ssrikumar ("no rights reserved") | CC0 1.0 | Nilgala Forest Reserve, Sri Lanka (intermediate zone) | High, viewed. Orange-red face, white-spotted black body, barred tail, orange legs. Full bird. Annotated male | 1 agreement only (the ID is unambiguous). Original size not checked |
Fallback (not viewed): [Commons, Tisha Mukherjee, Bhigwan, India, CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Painted_Francolin_in_Bhigwan_August_2025_by_Tisha_Mukherjee_01.jpg).

## 2. Sri Lanka Spurfowl (`slb-galloperdix-bicalcarata`) — endemic, SL photos only
Plumages: **male, female** (strong dimorphism, matching the traits draft).
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| male | [iNat photo 335969559](https://www.inaturalist.org/photos/335969559) (obs [191502758](https://www.inaturalist.org/observations/191502758), 7 agreements) | lappuggla | CC BY-NC | Sinharaja, Sri Lanka (wet lowland) | High, viewed. White-spotted black front, maroon wings, red bill and legs, full bird in the open | **NC licence** |
| male (open alt) | [iNat photo 623563697](https://www.inaturalist.org/photos/623563697) (obs [342423991](https://www.inaturalist.org/observations/342423991)) | Mickey Wu | CC BY 4.0 | Ratnapura District, Sri Lanka | Medium-low, viewed. Spotted male, red bill, side view | Dark forest floor; bird small in frame; heavy crop needed |
| male (open alt 2) | [iNat photo 469009371](https://www.inaturalist.org/photos/469009371) (obs [261100177](https://www.inaturalist.org/observations/261100177)) | terolinjama | CC0 1.0 | Sinharaja, Sri Lanka | Low, viewed. Male identifiable | Very dark, small in frame. Fallback only |
| female | [Commons](https://commons.wikimedia.org/wiki/File:Sri_Lanka_Spurfowl,_Siharaja_Forest_Reserve,_Sabaragamuwa_Palata,_Sri_Lanka_(cropped).jpg) (cropped, 3161×2671) | Michael Hurben | CC BY-SA 4.0 | Sinharaja, Sri Lanka | High, viewed. Plain maroon-brown body, scaly breast, dark grey head, red bill and legs | Leaves cross the legs. Sex not stated on the page (my ID from plumage) |
| female (alt) | [iNat photo 623564083](https://www.inaturalist.org/photos/623564083) (obs [342423993](https://www.inaturalist.org/observations/342423993)) | Mickey Wu | CC BY 4.0 | Ratnapura District, Sri Lanka | Medium, viewed. Plain brown female, red legs | Small in frame, dim light |

## 3. Gray Francolin (`slb-ortygornis-pondicerianus`)
Plumages: **adult** (sexes alike).
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| adult | [iNat photo 628537258](https://www.inaturalist.org/photos/628537258) (obs [344932643](https://www.inaturalist.org/observations/344932643)) | Aravinth | CC BY 4.0 | Velanai, Jaffna, Sri Lanka (arid north) | High, viewed. Two birds: orange face and throat, fine barring, chestnut tail | Two birds (crop or keep as a pair) |
Rejected: iNat 681421868 (Judy Gallagher, Mannar): washed out, throat pattern not visible. Fallback (not viewed): the Commons Tisha Mukherjee series (India, CC BY-SA 4.0).

## 4. Barred Buttonquail (`slb-turnix-suscitator`)
Plumages: **female, male** (reversed dimorphism: the female has the black bib; traits draft keys both).
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| female | [iNat photo 196574823](https://www.inaturalist.org/photos/196574823) (obs [116452173](https://www.inaturalist.org/observations/116452173)) | desertnaturalist | CC BY 4.0 | Yala NP, Sri Lanka (dry lowland) | High, viewed. Black throat and breast, heavy black-and-white barring, rufous flanks | Front view; dry twigs in the foreground |
| male | [Commons "Turnix suscitator 92422787.jpg"](https://commons.wikimedia.org/wiki/File:Turnix_suscitator_92422787.jpg) = iNat [92422787](https://www.inaturalist.org/photos/92422787) (2048×1365) | Christoph Moning | CC BY 4.0 | Hambantota District, Sri Lanka | Medium, viewed. Buff, barred sides, no black bib, pale eye | Night or flash shot on a sandy track, odd colour cast. Sex inferred from plumage |
Fallback male (not viewed, India): [Commons, Tisha Mukherjee 14, labelled male, CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Barred_Buttonquail_in_Bhigwan_August_2025_by_Tisha_Mukherjee_14.jpg). The Indian subspecies differs slightly from Sri Lankan birds.

## 5. Blue-breasted Quail (`slb-synoicus-chinensis`)
Plumages: **male, female**. Only 2 Sri Lankan iNat research-grade records, both "all rights reserved", so **no Sri Lankan candidate**. Most Commons photos are of captive birds (zoos, butterfly houses, aviaries; 12 excluded).
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| male | [Commons "Blue-breasted Quail Samcem oct04.JPG"](https://commons.wikimedia.org/wiki/File:Blue-breasted_Quail_Samcem_oct04.JPG) (1698×1275) | Aviceda | CC BY-SA 3.0 | Samsonvale Cemetery, Queensland, Australia (wild) | Medium-high, viewed. Slate-blue body, black-and-white throat pattern, chestnut belly, orange legs | Australian population (a different subspecies from South Asian birds; the male pattern is broadly the same). Hunched pose; 1698 px |
| female | **none acceptable** | – | – | – | – | Gap: no wild, open-licence female found |

## 6. Cotton Pygmy-goose (`slb-nettapus-coromandelianus`)
Plumages: **male, female**. The non-breeding (eclipse) male lacks the black breast band; it is not in the traits draft, so it is not requested.
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| male | [iNat photo 676934643](https://www.inaturalist.org/photos/676934643) (obs [370544171](https://www.inaturalist.org/observations/370544171)) | ssrikumar | CC0 1.0 | Kumana NP, Sri Lanka | Medium, viewed. White head and neck, black cap, black breast band, dark green-black back | **Soft and low resolution** (preview only 419 px wide) |
| female | [Commons "Nettapus coromandelianus 331024475.jpg"](https://commons.wikimedia.org/wiki/File:Nettapus_coromandelianus_331024475.jpg) = iNat [331024475](https://www.inaturalist.org/photos/331024475) (2048×1708) | Mayela y Ramón | CC BY-SA 4.0 | Sigiriya, Sri Lanka | Medium-high, viewed. Dusky crown and faint eye-line, brownish neck, no breast band, perched on a branch | A non-breeding male cannot be fully excluded without the wing pattern |
| female (alt) | [Commons Tisha Mukherjee 07](https://commons.wikimedia.org/wiki/File:Cotton_Pygmy-Goose_by_Tisha_Mukherjee_07.jpg) (3410×2436) | Tisha Mukherjee | CC BY-SA 4.0 | Purbasthali, India | Medium, viewed. Eye-stripe, plain body | Bird fairly small in frame |
Rejected: iNat 467473324 (watermark "© Joseph Morlan"); [JJ Harrison "male", Thailand](https://commons.wikimedia.org/wiki/File:Nettapus_coromandelianus_male_-_Bueng_Boraphet.jpg) is a non-breeding male (no breast band), so wrong for the male slot; Jacky Judas pair (iNat 8759744) too dim.

## 7. Fulvous Whistling-duck (`slb-dendrocygna-bicolor`)
Plumages: **adult**. Only 2 Sri Lankan iNat records, both CC BY-NC (not viewed).
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| adult | [Commons Tisha Mukherjee 01](https://commons.wikimedia.org/wiki/File:Fulvous_Whistling-Duck_by_Tisha_Mukherjee_01.jpg) (3654×2609) | Tisha Mukherjee | CC BY-SA 4.0 | Purbasthali, West Bengal, India | High, viewed. Rich fulvous head and neck, dark nape line, streaked neck, white flank stripes; **Lesser Whistling-ducks behind** give a direct comparison | Not Sri Lanka (allowed for a non-endemic). Crop to the main bird or keep the comparison |
Rejected: Kasambe Deepor Beel (distant flock), Mike Prince (43622245305) flight, distant; Jeganathan Pondy IMG 4127 distant.

## 8. Lesser Whistling-duck (`slb-dendrocygna-javanica`)
Plumages: **adult**.
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| adult | [iNat photo 62657643](https://www.inaturalist.org/photos/62657643) (obs [39488348](https://www.inaturalist.org/observations/39488348), 8 agreements) | William Stephens | CC BY 4.0 | Ambalantota, Hambantota, Sri Lanka | High, viewed. Two birds swimming: pale buff head, darker crown, chestnut flanks and wing patch | Two birds; water hyacinth background |
More open SL options (not viewed): Matthew Blissett iNat 31966319 (8 agreements), avocat, Christoph Moning (all CC BY).

## 9. Indian Spot-billed Duck (`slb-anas-poecilorhyncha`)
Plumages: **adult** (sexes alike).
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| adult | [Commons](https://commons.wikimedia.org/wiki/File:Pair_Indian_Spot-billed_Duck_Karanji_Mysore_Dec23_A7C_08342.jpg) (4942×3706) | Timothy A. Gonsalves | CC BY-SA 4.0 | Karanji Lake, Mysore, India | High, viewed. Yellow bill tip, red loral spot, green speculum, white tertials, orange legs. Pair, side view | Not Sri Lanka |
| adult (SL alt) | [Commons "Indian-spot billed ducks.jpg"](https://commons.wikimedia.org/wiki/File:Indian-spot_billed_ducks.jpg) (3424×2287) | Suyothami | CC BY-SA 4.0 | Pannai causeway, Jaffna, Sri Lanka | Medium, viewed. Bill tip and white tertials visible | Bird small in frame, in grass, strong side light |
Rejected: iNat 678626750 (CC0, Vankalai): watermark "© Wilmot Senaratne 2024 Photography".

## 10. Eurasian Wigeon (`slb-mareca-penelope`)
Plumages: **male, female, eclipse** (per traits draft). Sri Lankan iNat photos are all CC BY-NC or watermarked CC0, so these are Palearctic photos of the same species.
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| male | [Commons](https://commons.wikimedia.org/wiki/File:Male_Eurasian_Wigeon_Mareca_penelope,_Finland.jpg) (3629×2525) | Nimged | CC BY-SA 4.0 | Finland | High, viewed. Chestnut head, cream forehead, pinkish breast, grey flanks, white forewing | Bird on grass, not water |
| female | [Commons](https://commons.wikimedia.org/wiki/File:Eurasian_wigeon_(Mareca_penelope)_female_Akureyri.jpg) (4583×3055) | Charles J. Sharp | CC BY-SA 4.0 | Akureyri, Iceland | High, viewed. Rufous-brown, rounded head, small blue-grey black-tipped bill. Quality Image | None |
| eclipse | [Commons "Mareca penelope eclipse.jpg"](https://commons.wikimedia.org/wiki/File:Mareca_penelope_eclipse.jpg) (2500×2048) | Alpsdake | CC BY-SA 3.0 | Fujimae-higata, Nagoya, Japan | Medium-high, viewed. Female-like rufous body, but a white wing panel shows (adult male eclipse) | Sex not stated on the page (my ID from the white forewing) |

## 11. Northern Pintail (`slb-anas-acuta`)
Plumages: **male, female**. As for Wigeon, SL photos are NC or watermarked.
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| male | [Commons](https://commons.wikimedia.org/wiki/File:Male_northern_pintail_at_Llano_Seco.jpg) (4443×2777) | Frank Schulenburg | CC BY-SA 4.0 | California, USA | High, viewed. Chocolate head, white neck stripe, grey body, long pin tail. Quality Image | None |
| female | [Commons](https://commons.wikimedia.org/wiki/File:Northern_Pintail_(female)_-_Anas_acuta,_Reifel_Migratory_Bird_Sanctuary,_Ladner,_British_Columbia.jpg) (4752×3168) | Judy Gallagher | CC BY 2.0 | British Columbia, Canada | High, viewed. Plain buff head, long neck, all-grey bill, scalloped body, pointed tail | None |
| female (alt) | [Commons](https://commons.wikimedia.org/wiki/File:Northern_pintail_(Anas_acuta)_female_01.jpg) (3865×2577) | Nrik kiran | CC BY-SA 4.0 | Nepal | Medium, viewed. Plain face, grey bill | Head-on; body shape less clear |
Rejected: Kaushik mailbox "Northern Pintail (Female)" (wings spread, seen from behind).

## 12. Northern Shoveler (`slb-spatula-clypeata`)
Plumages: **male, female, eclipse** (per traits draft).
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| male | [Commons](https://commons.wikimedia.org/wiki/File:Northern_shoveler_(Spatula_clypeata)_male_Marken.jpg) (5333×3555) | Charles J. Sharp | CC BY-SA 4.0 | Marken, Netherlands | High, viewed. Green head, yellow eye, huge black bill, white breast, chestnut flanks. Quality Image | None |
| female | [Commons](https://commons.wikimedia.org/wiki/File:Northern_shoveler_(Spatula_clypeata)_female_Marken.jpg) (6554×4370) | Charles J. Sharp | CC BY-SA 4.0 | Marken, Netherlands | High, viewed. Mottled brown, spatulate bill with orange sides, orange legs. Quality Image | None |
| eclipse | [Commons](https://commons.wikimedia.org/wiki/File:Northern_Shoveler_(m),_eclipse_plumage_(23491751463).jpg) (2372×1583) | Becky Matsubara | CC BY 2.0 | Colusa NWR, California, USA | Medium-high, viewed. Dark mottled head, **yellow iris** (female is dark-eyed), scaly body | Side light; transitional look |

## 13. Little Grebe (`slb-tachybaptus-ruficollis`)
Plumages: **breeding, non_breeding** (per traits draft). Sri Lankan iNat open-licence photos are all distant (viewed: spacegecko 353102275, Tom Heijnen 410140437, Judy Gallagher 747742606, dhfischer 613778313).
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| breeding | [Commons "PSX 20200504 191431.jpg"](https://commons.wikimedia.org/wiki/File:PSX_20200504_191431.jpg) (5184×3456) | AdrianRanasinghe | CC BY-SA 4.0 | Not stated (taken 2018-12-22) | High, viewed. Chestnut cheeks and neck, pale yellow gape spot, dark crown | Place not stated (owner check); water droplets |
| breeding (SL alt) | [Commons](https://commons.wikimedia.org/wiki/File:Tachybaptus_ruficollis_albescens,_Diyasaru_Uyana_Wetland,_Sri_Lanka.jpg) (1400×934) | Chamara Ranathunga | CC BY-SA 4.0 | Diyasaru Uyana, Colombo, Sri Lanka | Medium-high, viewed. Chestnut neck, yellow gape | Bird shaking, feathers ruffled; 1400 px (below 1600 target). Title says ssp. *albescens*, which I believe is the Indian form; Sri Lankan birds are usually given as *capensis*; confirm before recording ssp |
| non_breeding | [Commons "Non breeding Little Grebe.jpg"](https://commons.wikimedia.org/wiki/File:Non_breeding_Little_Grebe.jpg) (1600×1047) | Vinayak Yardi | CC BY-SA 4.0 | Not stated (India likely) | Medium, viewed. Pale buff-brown neck and face, dark crown, pale gape | Bird preening with a feather in its bill |
Rejected: Kasambe "non-breeding" DSCN6305 (9): striped head and neck, so a **juvenile**, not non-breeding. J.M. Garg files (watermark policy from the pilot).

## 14. Rock Pigeon (`slb-columba-livia`)
Plumages: **adult** (wild-type blue-grey; feral birds vary widely, show the wild type).
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| adult | [iNat photo 62662648](https://www.inaturalist.org/photos/62662648) (obs [39491002](https://www.inaturalist.org/observations/39491002), 6 agreements) | William Stephens | CC BY 4.0 | Ambalantota, Hambantota, Sri Lanka | Medium-high, viewed. Group of wild-type birds: blue-grey, two black wing bars, iridescent neck | Group image; birds partly overlap (crop to one bird) |
More open SL options (not viewed): Philipp Steidle iNat 423753575 (Dambulla, 6 agreements), avocat 258618012 (Nuwara Eliya), Ioannis Magouras 355625833 (Kandy), all CC BY.

## 15. Sri Lanka Wood-pigeon (`slb-columba-torringtoniae`) — endemic, SL photos only
Plumages: **adult** (sexes alike). iNat hides the exact locations ("Sri Lanka" only).
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| adult | [iNat photo 258748577](https://www.inaturalist.org/photos/258748577) (obs [150098970](https://www.inaturalist.org/observations/150098970)) | avocat | CC BY 4.0 | Sri Lanka (location hidden) | High, viewed. Grey head and breast, black-and-white chequered neck patch, dark wings and tail, mossy branch | Seen slightly from below |
| adult (alt) | [iNat photo 329282118](https://www.inaturalist.org/photos/329282118) (obs [188184261](https://www.inaturalist.org/observations/188184261)) | Griha Hasanov | CC BY 4.0 | Sri Lanka (location hidden) | Medium, viewed. Shape, grey head, chequered nape | Dark, backlit |
| adult (alt 2) | [iNat photo 385140172](https://www.inaturalist.org/photos/385140172) (obs [217692865](https://www.inaturalist.org/observations/217692865)) | "no rights reserved" | CC0 1.0 | Sri Lanka (location hidden) | Low-medium, viewed. Neck patch visible | Partly hidden by leaves |

## 16. Eurasian Collared-dove (`slb-streptopelia-decaocto`)
Plumages: **adult**.
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| adult | [iNat photo 676339919](https://www.inaturalist.org/photos/676339919) (obs [370226980](https://www.inaturalist.org/observations/370226980)) | ssrikumar | CC0 1.0 | Mannar, Sri Lanka (arid north) | High, viewed. Pale sandy-grey, black half-collar, red eye, full side view | Plain sky background |
| adult (alt) | [iNat photo 738922931](https://www.inaturalist.org/photos/738922931) (obs [402527232](https://www.inaturalist.org/observations/402527232)) | Wolfgang Ahlmer | CC BY 4.0 | Hambantota District, Sri Lanka | Medium, viewed. Collar and long tail | Bright white background |
Rejected: avocat iNat 262167333 (blurred).

## 17. Common Emerald Dove (`slb-chalcophaps-indica`)
Plumages: **male, female**.
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| male | [iNat photo 92424548](https://www.inaturalist.org/photos/92424548) (obs [57918554](https://www.inaturalist.org/observations/57918554), 6 agreements) | Christoph Moning | CC BY 4.0 | Ratnapura District, Sri Lanka | Medium, viewed. White forehead, red bill, vinous-brown underparts | **Wings spread, front view: the green back is hidden.** A better male is wanted |
| female | [iNat photo 113165977](https://www.inaturalist.org/photos/113165977) (obs [69707377](https://www.inaturalist.org/observations/69707377), 7 agreements) | Eamon Corbett | CC BY 4.0 | Ratnapura District, Sri Lanka | High, viewed. Emerald wing, brown head with no white forehead, red bill | Soft background, fine |
Rejected: [Commons, Thimindu Goonatillake, Sinharaja](https://commons.wikimedia.org/wiki/File:Chalcophaps_indica,_Sinharaja,_Sri_Lanka_1.jpg): an ideal male, but it has a watermark "© Thimindu Goonatillake flickr.com/thimindu". Owner could ask for a clean copy. Amal Balasooriya (Commons): dark, from below.

## 18. Orange-breasted Green-pigeon (`slb-treron-bicinctus`)
Plumages: **male, female**.
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| male | [Commons](https://commons.wikimedia.org/wiki/File:Orange-breasted_green_pigeon_(Treron_bicinctus_leggei)_male.jpg) (2798×1865) | Charles J. Sharp | CC BY-SA 4.0 | Yala NP, Sri Lanka | High, viewed. Lilac and orange breast bands, grey nape, yellow wing edging. Labelled ssp. *leggei* | Twigs in front of the legs |
| female | [iNat photo 111281867](https://www.inaturalist.org/photos/111281867) (obs [68685060](https://www.inaturalist.org/observations/68685060), 6 agreements) | "no rights reserved" | CC0 1.0 | Central Province, Sri Lanka | High, viewed. Grey nape, yellow-green breast with no bands, yellow wing bar | Against the sky |

## 19. Yellow-footed Green-pigeon (`slb-treron-phoenicopterus`)
Plumages: **adult** (traits draft keys sexes together). Sri Lankan birds are a local subspecies (I believe *phillipsi*; not stated on the source, confirm).
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| adult | [iNat photo 713581232](https://www.inaturalist.org/photos/713581232) (obs [389559901](https://www.inaturalist.org/observations/389559901)) | "no rights reserved" (ssrikumar) | CC0 1.0 | Nilgala Forest Reserve, Sri Lanka | Medium, viewed. Grey head, yellow breast and collar, **yellow feet** | Soft, low resolution; 1 agreement |
Other SL records are CC BY-NC (Sri Srikumar, Krzysztof Kasprzyk; not viewed). An Indian open photo could be added if the SL ssp is judged similar.

## 20. Sri Lanka Green-pigeon (`slb-treron-pompadora`) — endemic, SL photos only
Plumages: **male, female**.
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| male | [Commons](https://commons.wikimedia.org/wiki/File:Sri_Lanka_green_pigeon_in_Kandy,_Sri_Lanka_-_02.jpg) (3998×2248) | Satdeep Gill | CC BY 4.0 | Kandy, Sri Lanka | High, viewed. Maroon mantle, yellow face and throat, yellow wing edging, feeding on figs | Head down, feeding |
| male (alt) | [Commons "… - 01.jpg"](https://commons.wikimedia.org/wiki/File:Sri_Lanka_green_pigeon_in_Kandy,_Sri_Lanka_-_01.jpg) (2004×3564) | Satdeep Gill | CC BY 4.0 | Kandy, Sri Lanka | High, viewed. Front view, yellow face, maroon edge | Mantle only at the edge |
| male (alt 2) | [Commons](https://commons.wikimedia.org/wiki/File:Thimindu_2009_12_31_Kaudulla_Pompadour_Green_Pigeon_1.jpg) (1200×800) | Thimindu | CC BY-SA 3.0 | Kaudulla NP, Sri Lanka | High, viewed. Classic side view | 1200 px (below 1600 target) |
| female | [iNat photo 447589661](https://www.inaturalist.org/photos/447589661) (obs [250284470](https://www.inaturalist.org/observations/250284470), 5 agreements) | "no rights reserved" | CC0 1.0 | Ratnapura District, Sri Lanka | High, viewed. All-green back (no maroon), yellow face and throat | Branch crosses the body |
Rejected: avocat iNat 257368072 (flock in a fruiting tree).

## 21. Green Imperial-pigeon (`slb-ducula-aenea`)
Plumages: **adult**. Sri Lankan birds are ssp. *pusilla* (as labelled on Lip Kee Yap's Commons files).
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| adult | [Commons](https://commons.wikimedia.org/wiki/File:Green_imperial_pigeon,_Sri_Lanka_2020-05-03.jpg) (4608×3456) | Ishan Sandamal | CC BY-SA 4.0 | Near Govindupura, Monaragala, Sri Lanka | High, viewed. Pale grey head and underparts, metallic green-bronze back and wings, side view | Twigs in the foreground |
| adult (alt) | [Commons](https://commons.wikimedia.org/wiki/File:WilpattuNationalPark_-_February_2018_-_Green_imperial_pigeon_(1).jpg) (3456×4608) | Rehman Abubakr | CC BY-SA 4.0 | Wilpattu NP, Sri Lanka | Medium, viewed. Size, pale grey head and underparts | Evening light: green gloss not visible |
Rejected: avocat iNat 263637316 (distant, noisy). Not viewed: Icaptures84 (Colombo), Udara-Ranasinghe (Maharagama), Lip Kee Yap *pusilla* set (800 px, CC BY-SA 2.0).

## 22. Blue-faced Malkoha (`slb-phaenicophaeus-viridirostris`)
Plumages: **adult**.
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| adult | [iNat photo 62657158](https://www.inaturalist.org/photos/62657158) (obs [39488089](https://www.inaturalist.org/observations/39488089), 4 agreements) | William Stephens | CC BY 4.0 | Ambalantota, Hambantota, Sri Lanka | High, viewed. Blue eye patch, apple-green bill, long graduated tail with white tips | Twigs around the bird; pale sky |

## 23. Sri Lanka Red-faced Malkoha (`slb-phaenicophaeus-pyrrhocephalus`) — endemic, SL photos only
Plumages: **adult**. iNat hides the exact location.
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| adult | [iNat photo 113165546](https://www.inaturalist.org/photos/113165546) (obs [69707375](https://www.inaturalist.org/observations/69707375), 6 agreements) | Eamon Corbett | CC BY 4.0 | Sri Lanka (location hidden) | High, viewed. Red face patch, green bill, black throat, white belly, long white-tipped tail | Leaves in the foreground at the right |

## 24. Sirkeer Malkoha (`slb-taccocua-leschenaultii`)
Plumages: **adult**.
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| adult | [iNat photo 713015026](https://www.inaturalist.org/photos/713015026) (obs [389266584](https://www.inaturalist.org/observations/389266584)) | ssrikumar ("no rights reserved") | CC0 1.0 | Nilgala Forest Reserve, Sri Lanka | Medium-high, viewed. Plain earth-brown, curved red bill with yellow tip, long tail with pale tips, dark eye-mask | 1 agreement (the ID is unambiguous); branch crosses the body |
| adult (alt) | [Commons "Sirkeer Malkoha (51096008251).jpg"](https://commons.wikimedia.org/wiki/File:Sirkeer_Malkoha_(51096008251).jpg) (1805×1203) | Mike Prince | CC BY 2.0 | India (artist based in Bangalore; place not stated) | Medium, viewed. Shape, red bill, long tail | Bird small in frame; not Sri Lanka |
Rejected: iNat 676940665 (CC0, Kumana): face hidden by twigs. Other SL records are mostly CC BY-NC.

## 25. Sri Lanka Green-billed Coucal (`slb-centropus-chlororhynchos`) — endemic, SL photos only
Plumages: **adult**. Globally threatened (VU, working value): keep the locality at country/zone level even though it is not on `sensitive-species.csv`; owner may want to add it.
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| adult | [Commons "Green-billed Coucal (Centropus chlororhynchos).jpg"](https://commons.wikimedia.org/wiki/File:Green-billed_Coucal_(Centropus_chlororhynchos).jpg) (2048×1563) | desertnaturalist | CC BY 4.0 | Sri Lanka (wet lowland zone) | High, viewed. **Pale ivory-green bill** (the key mark against Greater Coucal), dull purple-black body, dark chestnut wings, dark eye | Branch crosses the tail |
**Misidentification found:** [Commons "Green-billed coucal.jpg" (Amila Tennakoon)](https://commons.wikimedia.org/wiki/File:Green-billed_coucal.jpg) shows a **black bill and red eye: it is a Greater Coucal**, not this species. Do not use it here. The Commons file label could be reported to Commons separately (owner decision).

## 26. Greater Coucal (`slb-centropus-sinensis`)
Plumages: **adult**.
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| adult | [iNat photo 196782438](https://www.inaturalist.org/photos/196782438) (obs [116569454](https://www.inaturalist.org/observations/116569454), 4 agreements) | desertnaturalist | CC BY 4.0 | Yala NP, Sri Lanka | High, viewed. Glossy black body, chestnut wings, red eye, heavy black bill, long tail | None |
More open SL options (not viewed): Vihansith Kulatunga iNat 111929803 (CC BY-SA, 5 agreements), avocat 264216871 (CC BY).

## 27. Chestnut-winged Cuckoo (`slb-clamator-coromandus`)
Plumages: **adult**. Migrant; only 1 open SL record.
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| adult | [iNat photo 92278824](https://www.inaturalist.org/photos/92278824) (obs [57830779](https://www.inaturalist.org/observations/57830779), 4 agreements) | Aravinth | CC BY 4.0 | Kokuvil, Jaffna, Sri Lanka | High, viewed. Black crest, rufous-orange throat, white collar and breast, chestnut wings, long black tail | Branches across the body; dappled light |

## 28. Jacobin Cuckoo (`slb-clamator-jacobinus`)
Plumages: **adult** (pied form; Sri Lankan birds are pied).
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| adult | [iNat photo 113036556](https://www.inaturalist.org/photos/113036556) (obs [69638167](https://www.inaturalist.org/observations/69638167), 6 agreements) | Eamon Corbett | CC BY 4.0 | Wirawila, Hambantota, Sri Lanka | Medium-high, viewed. Black crest and upperparts, white throat and underparts | White wing patch hidden by the branch; leaves in front |
More open SL options (not viewed): William Stephens iNat 62657220 (6 agreements), dhfischer 613778667 (CC BY).

## 29. Common Hawk-cuckoo (`slb-hierococcyx-varius`)
Plumages: **adult, juvenile** (per traits draft). Sri Lankan open-licence photos are poor; the Sri Lankan resident population is often treated as a darker subspecies (*ciceliae*, as I recall; confirm against CBC or Avibase), so an Indian photo is a stand-in.
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| adult | [Commons "Common-hawk Cuckoo at Ganeshgudi, Karnataka.jpg"](https://commons.wikimedia.org/wiki/File:Common-hawk_Cuckoo_at_Ganeshgudi,_Karnataka.jpg) (2562×1708) | Drashokk | CC BY-SA 4.0 | Ganeshgudi, Karnataka, India | High, viewed. Ash-grey upperparts, yellow eye-ring, rufous-washed barred breast, shikra-like shape | Not Sri Lanka. **EXIF says "COPYRIGHT 2022 ALL RIGHTS RESERVED"**, which conflicts with the Commons licence; owner to confirm that the uploader is the author (Commons page states own work) |
| juvenile | **none acceptable** | – | – | – | – | Gap |
Rejected (hawk-cuckoo): iNat 760605380 (CC0): a photo of a computer screen (monitor brand visible). iNat 257090870 (avocat) distant; iNat 763130276 (Chris D Thomas) silhouette; [Gopsuttan, Kerala](https://commons.wikimedia.org/wiki/File:Common_hawk_cuckoo_on_a_perch.jpg) has a signature watermark; Cherthala (Gannu03) silhouette. Most SL iNat photos are CC BY-NC (e.g. dulani 135454803, 5 agreements; not viewed).

## 30. Indian Cuckoo (`slb-cuculus-micropterus`)
Plumages: **adult**.
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| adult | [iNat photo 471363442](https://www.inaturalist.org/photos/471363442) (obs [262372344](https://www.inaturalist.org/observations/262372344), 2 agreements) | Jean Jacques Godon | CC BY 4.0 | Kukulkatuwa, Sri Lanka | High, viewed. Brownish-grey upperparts, broad widely spaced black bars below, yellow eye-ring, **tail with broad black subterminal band** (separates it from Common Cuckoo) | Twig crosses the wing |
Other open SL records: CC0 from Nilgala and Wasgamuwa (iNat 713013640, 713579820, 732002845; not viewed).

## 31. Grey-bellied Cuckoo (`slb-cacomantis-passerinus`)
Plumages: **male, female, morph_hepatic** (per traits draft). The grey female with a rufous-washed breast is hard to show apart from the male in photos.
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| male | [iNat photo 62234728](https://www.inaturalist.org/photos/62234728) (obs [39243466](https://www.inaturalist.org/observations/39243466), 4 agreements) | William Stephens | CC BY 4.0 | Polonnaruwa, Sri Lanka | High, viewed. All-grey head and body, red-brown eye, white-tipped graduated tail | Leaves in the foreground |
| female | **none acceptable** | – | – | – | – | Gap: no open photo clearly labelled or showing the grey female's rufous breast wash |
| morph_hepatic | [Commons "Gray-bellied Cuckoo Cropped.jpg"](https://commons.wikimedia.org/wiki/File:Gray-bellied_Cuckoo_Cropped.jpg) (1821×2731) | Mildeep | CC BY-SA 4.0 | Place not stated (uploader's other files are from Nepal) | High, viewed. Bright rufous hepatic female, barred upperparts, **plain rufous tail and rump** (separates it from Banded Bay Cuckoo), barred white underparts | Not Sri Lanka; place to confirm |
Not viewed: avocat iNat 260237483, Mark Clarke 473550448, dhfischer 613778101 (SL, CC BY).

## 32. Banded Bay Cuckoo (`slb-cacomantis-sonneratii`)
Plumages: **adult**.
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| adult | [iNat photo 707171165](https://www.inaturalist.org/photos/707171165) (obs [386239809](https://www.inaturalist.org/observations/386239809)) | Judy Gallagher | CC BY-SA 4.0 | Kitulgala, Sri Lanka | Medium-high, viewed. Rufous-brown barred upperparts, finely barred whitish underparts, barred tail | Head tilted up; the **white supercilium and dark eye-stripe (the key mark against hepatic Grey-bellied) are not clearly visible**; 1 agreement |
Rejected: avocat iNat 257368182 (Kitulgala, CC BY): underside view against the sky, grey barring; I could not confirm the species from the image.

## 33. Fork-tailed Drongo-cuckoo (`slb-surniculus-dicruroides`)
Plumages: **adult, juvenile** (per traits draft).
| Plumage | Candidate | Author | Licence | Locality | Why good | Risks |
|---|---|---|---|---|---|---|
| adult | [iNat photo 326697523](https://www.inaturalist.org/photos/326697523) (obs [186886168](https://www.inaturalist.org/observations/186886168)) | Griha Hasanov | CC BY 4.0 | Koppaveli, Sri Lanka | High, viewed. Glossy black, slim curved bill, **white-barred undertail coverts and outer tail** (separates it from drongos), forked tail | 2 agreements |
| juvenile | **none acceptable** | – | – | – | – | Gap |
Rejected: CC0 iNat 450108682 (silhouette in a canopy). Not viewed: CC0 iNat 710879334 (Nilgala).
