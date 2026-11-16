# Pilot photo candidates (M2 slice 8)

Status: **proposed**. Every row in `licences.csv` is `status=proposed`, and `display_ok`, `reviewed_by` and `reviewed_at` are blank. The owner reviews each image before any row becomes `reviewed`. No images were downloaded into the repo and no `.webp` files were created.

How these were checked:
- **Licence metadata.** Licence, author and licence URL were read from the Wikimedia Commons API (`extmetadata`: Artist, LicenseShortName, LicenseUrl) or from the iNaturalist v2 API (`photos.license_code`, `attribution`). All 35 Commons files were confirmed in two batch queries.
- **Visual review.** The ornithologist looked at every chosen image (full image or a 960 px / 500 px preview). ID confidence and plumage below come from field marks seen in the image, not from the uploader's label.
- **Rejected candidates.** Watermarked images (e.g. "KREDMIUM", "© sarala jeevanthi", "© J M Garg", "Rison Thumboor", "@indrila's_Photography", "Harzallah Naturaliste", "© Wilmot Senaratne") and likely captive birds were rejected.
- **Nest images.** Nest, egg and nestling images were not used.
- **Licences used.** CC0 / CC BY / CC BY-SA only. **No CC BY-NC was needed.**
- **`retrieved_on`.** Set to 2026-11-14 as instructed. Some metadata lookups were finished on 2026-11-16 after a pause. Owner to decide whether to keep a single date.

Confidence: **High** = diagnostic marks clearly visible; **Medium** = correct but one mark is not fully visible, or there is a quality issue; **Low** = not proposed.

## Sri Lanka Junglefowl (`slb-gallus-lafayettii`)
| Slot | image_id | Source page | Original file | Licence | ID confidence and marks checked | Concerns |
|---|---|---|---|---|---|---|
| male | gallus-lafayettii-male-1 | [Commons](https://commons.wikimedia.org/wiki/File:Ceylon_Junglefowl_(Gallus_lafayetii).jpg) | https://upload.wikimedia.org/wikipedia/commons/1/14/Ceylon_Junglefowl_%28Gallus_lafayetii%29.jpg | CC BY-SA 4.0 | High. Red comb with yellow centre, orange-gold hackles, red wattles, violet-black tail. Full body, 8256 px | None. Location not stated (Senaka Silva) |
| female | gallus-lafayettii-female-1 | [iNat photo 92429505](https://www.inaturalist.org/photos/92429505) (obs 57920866, Ratnapura) | https://inaturalist-open-data.s3.amazonaws.com/photos/92429505/original.jpeg | CC BY 4.0 | High. Brown with fine dark vermiculation, white-shafted breast feathers, barred wings, no comb. Wild bird on the ground | Original size not checked (iNat originals are often ≤ 2048 px) |

## Sri Lanka Blue Magpie (`slb-urocissa-ornata`)
| Slot | image_id | Source page | Original file | Licence | ID confidence and marks checked | Concerns |
|---|---|---|---|---|---|---|
| adult | urocissa-ornata-adult-1 | [Commons](https://commons.wikimedia.org/wiki/File:Sri_Lanka_blue_magpie_(Urocissa_ornata).jpg) | https://upload.wikimedia.org/wikipedia/commons/3/32/Sri_Lanka_blue_magpie_%28Urocissa_ornata%29.jpg | CC BY-SA 4.0 | High. Chestnut hood, red bill, red eye-ring, red legs, rufous wings, long blue tail. Sinharaja | None |
## Common Sandpiper (`slb-actitis-hypoleucos`)
| Slot | image_id | Source page | Original file | Licence | ID confidence and marks checked | Concerns |
|---|---|---|---|---|---|---|
| adult | actitis-hypoleucos-adult-1 | [Commons](https://commons.wikimedia.org/wiki/File:Common_Sandpiper_in_Kumana_National_Park.jpg) | https://upload.wikimedia.org/wikipedia/commons/e/e5/Common_Sandpiper_in_Kumana_National_Park.jpg | CC BY-SA 4.0 | High. Plain olive-brown upperparts, white wedge in front of the folded wing, pale eye-ring, short legs. Kumana | Grass stems cross the lower body. Head-on pose; a side view would show the tail extension better |
## Shikra (`slb-tachyspiza-badia`)
Only Sri Lankan birds are used, which should be the resident subspecies (ssp. not stated on the source pages).
| Slot | image_id | Source page | Original file | Licence | ID confidence and marks checked | Concerns |
|---|---|---|---|---|---|---|
| male | tachyspiza-badia-male-1 | [iNat photo 467601232](https://www.inaturalist.org/photos/467601232) (obs 260386962, Kegalle) | https://inaturalist-open-data.s3.amazonaws.com/photos/467601232/original.jpg | CC0 1.0 | High. Pale blue-grey upperparts, fine rufous barring below, dark (reddish) iris | Seen from below against a pale sky. Medium-size bird in frame |
| female | tachyspiza-badia-female-1 | [iNat photo 146116193](https://www.inaturalist.org/photos/146116193) (obs 88552824, Kokuvil, Jaffna) | https://inaturalist-open-data.s3.amazonaws.com/photos/146116193/original.jpeg | CC BY 4.0 | Medium-high. Browner-grey back than the male, rufous-barred underparts, yellow-orange iris | Bird standing on a wet road |
| juvenile | tachyspiza-badia-juvenile-1 | [iNat photo 410159620](https://www.inaturalist.org/photos/410159620) (obs 230969697, Polonnaruwa) | https://inaturalist-open-data.s3.amazonaws.com/photos/410159620/original.jpeg | CC BY 4.0 | High. Brown upperparts with pale fringes, yellow iris, streaked head, drop-spotted flanks | Perched on a wall. Streaked breast only partly visible |

## Indian Pond-heron (`slb-ardeola-grayii`)
| Slot | image_id | Source page | Original file | Licence | ID confidence and marks checked | Concerns |
|---|---|---|---|---|---|---|
| breeding | ardeola-grayii-breeding-1 | [Commons](https://commons.wikimedia.org/wiki/File:Indian_pond_heron-Breeding_plumage.jpg) | https://upload.wikimedia.org/wikipedia/commons/e/ed/Indian_pond_heron-Breeding_plumage.jpg | CC BY-SA 4.0 | High. Maroon mantle, buff head and neck, white plumes, blue bill base and lores, orange-red legs | Bangalore, India (breeding plumage is the same in Sri Lanka) || non_breeding | ardeola-grayii-non-breeding-1 | [Commons](https://commons.wikimedia.org/wiki/File:Indian_pond_heron_(Ardeola_grayii)_non_breeding.jpg) | https://upload.wikimedia.org/wikipedia/commons/5/55/Indian_pond_heron_%28Ardeola_grayii%29_non_breeding.jpg | CC BY-SA 4.0 | High. Streaked buff head and neck, plain brown back, yellowish legs. Kirala Kele, Sri Lanka | None |

## Asian Koel (`slb-eudynamys-scolopaceus`)
| Slot | image_id | Source page | Original file | Licence | ID confidence and marks checked | Concerns |
|---|---|---|---|---|---|---|
| male | eudynamys-scolopaceus-male-1 | [Commons](https://commons.wikimedia.org/wiki/File:Asian_koel_(male)_-_Sri_Lanka_-_01.jpg) | https://upload.wikimedia.org/wikipedia/commons/c/c2/Asian_koel_%28male%29_-_Sri_Lanka_-_01.jpg | CC BY-SA 4.0 | High. Glossy blue-black, crimson iris, pale greenish bill | Light flare at the right edge (can be cropped) || female | eudynamys-scolopaceus-female-1 | [Commons](https://commons.wikimedia.org/wiki/File:Asian_koel_(female)_-_Sri_Lanka_-_01.jpg) | https://upload.wikimedia.org/wikipedia/commons/2/2b/Asian_koel_%28female%29_-_Sri_Lanka_-_01.jpg | CC BY-SA 4.0 | High. Dark brown with white spots above, barred underparts, crimson iris (adult) | Taken from below. Tail cut off at the bottom |
| juvenile | **not filled** | — | — | — | — | See "Slots not filled well" |

## Indian Paradise-flycatcher (`slb-terpsiphone-paradisi`)
| Slot | image_id | Source page | Original file | Licence | ID confidence and marks checked | Concerns |
|---|---|---|---|---|---|---|
| male | terpsiphone-paradisi-male-1 | [Commons](https://commons.wikimedia.org/wiki/File:Ceylon_paradise_flycatcher_(male)_-_Sri_Lanka_(1).jpg) | https://upload.wikimedia.org/wikipedia/commons/8/83/Ceylon_paradise_flycatcher_%28male%29_-_Sri_Lanka_%281%29.jpg | CC BY-SA 4.0 | High. Rufous male with long rufous streamers, glossy black crested head, grey-white underparts. Labelled ssp. *ceylonensis* | **Possibly captive**: perched on ropes in front of a wall (an aviary-like setting). Owner check. Wild fallback: [Commons, Thimindu Goonatillake, Yala, 800×1160, CC BY-SA 2.0](https://commons.wikimedia.org/wiki/File:Asian_Paradise-flycatcher_(Male).jpg) (not viewed) || female | terpsiphone-paradisi-female-1 | [Commons](https://commons.wikimedia.org/wiki/File:Ceylon_paradise_flycatcher_(female)_-_Sri_Lanka_-_02.jpg) | https://upload.wikimedia.org/wikipedia/commons/a/a8/Ceylon_paradise_flycatcher_%28female%29_-_Sri_Lanka_-_02.jpg | CC BY-SA 4.0 | Medium-high. Grey throat and breast blending into the black head, no streamers, dull eye-ring. The male *ceylonensis* has a black throat | Strong crest. A young male cannot be fully excluded, but the grey throat favours female |
| morph_white | terpsiphone-paradisi-morph-white-1 | [Commons](https://commons.wikimedia.org/wiki/File:Indian_paradise_flycatcher_(male)_-_Sri_Lanka_-_01.jpg) | https://upload.wikimedia.org/wikipedia/commons/1/16/Indian_paradise_flycatcher_%28male%29_-_Sri_Lanka_-_01.jpg | CC BY-SA 4.0 | High. White body and long white streamers, glossy black head and crest, blue eye-ring, black shaft streaks. Pannipitiya | Bird is small in frame against backlit foliage (crop needed). White males in Sri Lanka are migrants of the Indian subspecies; the resident *ceylonensis* has no white morph (field-guide knowledge, owner may wish to confirm against CBC/Kotagama) |

## Purple Sunbird (`slb-cinnyris-asiaticus`)
| Slot | image_id | Source page | Original file | Licence | ID confidence and marks checked | Concerns |
|---|---|---|---|---|---|---|
| male | cinnyris-asiaticus-male-1 | [Commons](https://commons.wikimedia.org/wiki/File:Purple_Sunbird_Cinnyris_asiaticus_Male_by_Dr_Raju_Kasambe_(2).JPG) | https://upload.wikimedia.org/wikipedia/commons/7/73/Purple_Sunbird_Cinnyris_asiaticus_Male_by_Dr_Raju_Kasambe_%282%29.JPG | CC BY-SA 4.0 | High. Fully glossy metallic blue-purple-black breeding male | India, location not stated. Gloss looks more blue than purple in this light || female | cinnyris-asiaticus-female-1 | [Commons](https://commons.wikimedia.org/wiki/File:Purple_Sunbird_Cinnyris_asiaticus_Female_by_Vedant_Kasambe_DSC_6600_(1).jpg) | https://upload.wikimedia.org/wikipedia/commons/6/61/Purple_Sunbird_Cinnyris_asiaticus_Female_by_Vedant_Kasambe_DSC_6600_%281%29.jpg | CC BY-SA 4.0 | High. Olive-brown above, yellow below, dark eye-stripe, short bill (rules out female Loten's Sunbird) | 2000 px wide. Twigs in the foreground. India |
| eclipse | cinnyris-asiaticus-eclipse-1 | [Commons](https://commons.wikimedia.org/wiki/File:Purple_sunbird_(Cinnyris_asiaticus_asiaticus)_male_non-breeding.jpg) | https://upload.wikimedia.org/wikipedia/commons/c/c2/Purple_sunbird_%28Cinnyris_asiaticus_asiaticus%29_male_non-breeding.jpg | CC BY-SA 4.0 | High. Olive upperparts, yellow underparts, black central throat stripe, glossy purple wing coverts | Keoladeo, India |

## House Crow (`slb-corvus-splendens`)
| Slot | image_id | Source page | Original file | Licence | ID confidence and marks checked | Concerns |
|---|---|---|---|---|---|---|
| adult | corvus-splendens-adult-1 | [Commons](https://commons.wikimedia.org/wiki/File:A_house_crow_in_Viharamahadevi_Park,_Colombo.jpg) | https://upload.wikimedia.org/wikipedia/commons/e/ee/A_house_crow_in_Viharamahadevi_Park%2C_Colombo.jpg | CC BY-SA 4.0 | High. Grey nape and neck collar contrasting with the black face, crown and throat. Colombo | Bird in shade, framed by branches. Alternative: [Zamkov, *C. s. protegatus* pair, CC BY 2.0](https://commons.wikimedia.org/wiki/File:Corvus_splendens_protegatus.jpg) (backlit, collar not visible) |
## Common Myna (`slb-acridotheres-tristis`)
| Slot | image_id | Source page | Original file | Licence | ID confidence and marks checked | Concerns |
|---|---|---|---|---|---|---|
| adult | acridotheres-tristis-adult-1 | [Commons](https://commons.wikimedia.org/wiki/File:Common_myna_(Acridotheres_tristis_melanosternus).jpg) | https://upload.wikimedia.org/wikipedia/commons/8/87/Common_myna_%28Acridotheres_tristis_melanosternus%29.jpg | CC BY-SA 4.0 | High. Dark Sri Lankan *melanosternus*, yellow facial skin, bill and legs. Bundala | None |
## Sri Lanka Grey Hornbill (`slb-ocyceros-gingalensis`)
| Slot | image_id | Source page | Original file | Licence | ID confidence and marks checked | Concerns |
|---|---|---|---|---|---|---|
| male | ocyceros-gingalensis-male-1 | [Commons](https://commons.wikimedia.org/wiki/File:Sri_Lanka_grey_hornbill_(Ocyceros_gingalensis).jpg) | https://upload.wikimedia.org/wikipedia/commons/1/17/Sri_Lanka_grey_hornbill_%28Ocyceros_gingalensis%29.jpg | CC BY-SA 4.0 | High. Ivory-yellow bill with black base and a black stripe on the lower mandible. Kandy | None || female | ocyceros-gingalensis-female-1 | [Commons](https://commons.wikimedia.org/wiki/File:Sri_Lanka_Grey_Hornbill.JPG) | https://upload.wikimedia.org/wikipedia/commons/9/91/Sri_Lanka_Grey_Hornbill.JPG | CC BY 3.0 | High. Black bill with a cream stripe on the upper mandible. Sinharaja | Leaf partly covers the body. Lower body cut off |

## Sri Lanka Crimson-backed Flameback (`slb-chrysocolaptes-stricklandi`)
| Slot | image_id | Source page | Original file | Licence | ID confidence and marks checked | Concerns |
|---|---|---|---|---|---|---|
| male | chrysocolaptes-stricklandi-male-1 | [Commons](https://commons.wikimedia.org/wiki/File:Chrysocolaptes_stricklandi,_Kitulgala,_Sri_Lanka_1.jpg) | https://upload.wikimedia.org/wikipedia/commons/1/18/Chrysocolaptes_stricklandi%2C_Kitulgala%2C_Sri_Lanka_1.jpg | CC BY 4.0 | High. Fully crimson crown and crest, crimson back, black-and-white face. Kitulgala | Medium-small in frame (2048 px). Crop needed. iNat import credited as "tomheijnen" || female | chrysocolaptes-stricklandi-female-1 | [Commons](https://commons.wikimedia.org/wiki/File:Chrysocolaptes_stricklandi,_Rakkiththa_Kanda,_Sri_Lanka_1.jpg) | https://upload.wikimedia.org/wikipedia/commons/1/1d/Chrysocolaptes_stricklandi%2C_Rakkiththa_Kanda%2C_Sri_Lanka_1.jpg | CC BY 4.0 | High. Black crown densely spotted white (no red), crimson back | Branch crosses the neck. Rejected alternative: [Rehman Abubakr "female"](https://commons.wikimedia.org/wiki/File:Red-backed_flameback_-_August_2019.jpg) shows red in the rear crest, which does not fit a clean adult female |

## Indian Peafowl (`slb-pavo-cristatus`)
| Slot | image_id | Source page | Original file | Licence | ID confidence and marks checked | Concerns |
|---|---|---|---|---|---|---|
| male | pavo-cristatus-male-1 | [Commons](https://commons.wikimedia.org/wiki/File:Indian_peafowl_(Pavo_cristatus)_male.jpg) | https://upload.wikimedia.org/wikipedia/commons/f/f9/Indian_peafowl_%28Pavo_cristatus%29_male.jpg | CC BY-SA 4.0 | High. Blue neck, fan crest, barred back, ocellated train (closed). Near Galle | Train is not displayed (fine for ID) || female | pavo-cristatus-female-1 | [Commons](https://commons.wikimedia.org/wiki/File:Indian_peafowl_(Pavo_cristatus)_female_with_chick.jpg) | https://upload.wikimedia.org/wikipedia/commons/9/93/Indian_peafowl_%28Pavo_cristatus%29_female_with_chick.jpg | CC BY-SA 4.0 | High. Brown body, metallic green lower neck, whitish belly. Yala | **Head lowered into foliage** and a chick is in frame. A better peahen photo would help |

## Garganey (`slb-spatula-querquedula`)
| Slot | image_id | Source page | Original file | Licence | ID confidence and marks checked | Concerns |
|---|---|---|---|---|---|---|
| male | spatula-querquedula-male-1 | [Commons](https://commons.wikimedia.org/wiki/File:Garganey_Spatula_querquedula_01.jpg) | https://upload.wikimedia.org/wikipedia/commons/d/d3/Garganey_Spatula_querquedula_01.jpg | CC BY-SA 4.0 | High. Broad white supercilium, brown speckled breast, grey vermiculated flanks, long scapulars. Mumbai | None. Sri Lankan CC0 alternative: [iNat 676935919, Kumana](https://www.inaturalist.org/photos/676935919) (Sri Srikumar) || female | spatula-querquedula-female-1 | [Commons](https://commons.wikimedia.org/wiki/File:Anas_querquedula,_Llobregat_Delta,_Barcelona_6.jpg) | https://upload.wikimedia.org/wikipedia/commons/a/a2/Anas_querquedula%2C_Llobregat_Delta%2C_Barcelona_6.jpg | CC BY-SA 2.0 | High. Strong face pattern: dark crown and eye-stripe, pale supercilium, pale loral spot, dark cheek bar, grey bill | **1455 px wide (below the 1600 px master target)**. Spain. Credit name trimmed in the attribution (see below) |
| eclipse | spatula-querquedula-eclipse-1 | [Commons](https://commons.wikimedia.org/wiki/File:Anas_querquedula,_Hong_Kong_1.jpg) | https://upload.wikimedia.org/wikipedia/commons/1/16/Anas_querquedula%2C_Hong_Kong_1.jpg | CC BY-SA 2.0 | Medium-high. Female-like body and head, but **pale blue-grey forewing** and green speculum with broad white borders (eclipse male) | **1024 px (below target)**. Flight view. Hong Kong |

## Pacific Golden Plover (`slb-pluvialis-fulva`)
| Slot | image_id | Source page | Original file | Licence | ID confidence and marks checked | Concerns |
|---|---|---|---|---|---|---|
| breeding | pluvialis-fulva-breeding-1 | [Commons](https://commons.wikimedia.org/wiki/File:Pacific_Golden_Plover_-_breeding_plumage.jpg) | https://upload.wikimedia.org/wikipedia/commons/8/88/Pacific_Golden_Plover_-_breeding_plumage.jpg | CC BY 2.0 | High. Black face and underparts, white S-stripe down the neck side, gold-spangled upperparts | Near-full (not complete) breeding plumage; some white mottling below. Honolulu, Hawaii (as expected for this slot) || non_breeding | pluvialis-fulva-non-breeding-1 | [Commons](https://commons.wikimedia.org/wiki/File:Pacific_golden_plover_(Pluvialis_fulva)_non_breeding_Pearaing.jpg) | https://upload.wikimedia.org/wikipedia/commons/f/f9/Pacific_golden_plover_%28Pluvialis_fulva%29_non_breeding_Pearaing.jpg | CC BY-SA 4.0 | High. Golden-buff face and breast, spangled upperparts, long legs. Cambodia | Second bird blurred at the left edge (crop) |

## Brahminy Kite (`slb-haliastur-indus`)
| Slot | image_id | Source page | Original file | Licence | ID confidence and marks checked | Concerns |
|---|---|---|---|---|---|---|
| adult | haliastur-indus-adult-1 | [Commons](https://commons.wikimedia.org/wiki/File:Brahminy_kite_(Haliastur_indus_indus).jpg) | https://upload.wikimedia.org/wikipedia/commons/2/2a/Brahminy_kite_%28Haliastur_indus_indus%29.jpg | CC BY-SA 4.0 | High. White head and breast with dark shaft streaks, chestnut body and wings. Gal Oya | None || juvenile | haliastur-indus-juvenile-1 | [iNat photo 616057761](https://www.inaturalist.org/photos/616057761) (obs 338727206, Negombo) | https://inaturalist-open-data.s3.amazonaws.com/photos/616057761/original.jpg | CC BY-SA 4.0 | Medium. Brown with pale streaked head and pale feather fringes | Tail shape (rounded vs Black Kite's forked) not visible in the preview. Branches in frame. Original size not checked. Flight fallback: [Commons, juvenile, Jaffna](https://commons.wikimedia.org/wiki/File:Brahminy_Kite,_juvenile,_Jaffna,_Sri_Lanka.jpg) (soft, small in frame) |

## Oriental Magpie-robin (`slb-copsychus-saularis`)
| Slot | image_id | Source page | Original file | Licence | ID confidence and marks checked | Concerns |
|---|---|---|---|---|---|---|
| male | copsychus-saularis-male-1 | [Commons](https://commons.wikimedia.org/wiki/File:Oriental_magpie-robin_(Copsychus_saularis_ceylonensis)_male.jpg) | https://upload.wikimedia.org/wikipedia/commons/2/2a/Oriental_magpie-robin_%28Copsychus_saularis_ceylonensis%29_male.jpg | CC BY-SA 4.0 | High. Glossy blue-black hood and back, white wing stripe, white belly, cocked tail. *ceylonensis*, Kirala Kele | None || female | copsychus-saularis-female-1 | [iNat photo 62516060](https://www.inaturalist.org/photos/62516060) (obs 39406631, Kandy) | https://inaturalist-open-data.s3.amazonaws.com/photos/62516060/original.jpg | CC BY 4.0 | High. Slate-grey replaces the male's black; white wing stripe, white belly | Original size not checked. Rejected: the Ooty "female" on Commons looks brown and scaly, which fits a juvenile, not a female |

## Little Tern (`slb-sternula-albifrons`)
Saunders's Tern (*S. saundersi*) occurs in NW Sri Lanka (Mannar) and is very hard to separate from Little Tern outside breeding plumage. So I avoided Arabian Sea and west-India winter birds, and used places where Saunders's is not expected.
| Slot | image_id | Source page | Original file | Licence | ID confidence and marks checked | Concerns |
|---|---|---|---|---|---|---|
| breeding | sternula-albifrons-breeding-1 | [Commons](https://commons.wikimedia.org/wiki/File:Sternula_albifrons_-_Boat_Harbour.jpg) | https://upload.wikimedia.org/wikipedia/commons/1/1e/Sternula_albifrons_-_Boat_Harbour.jpg | CC BY-SA 4.0 | High. Black cap, white forehead patch, black-tipped yellow bill, orange legs. NSW, Australia (no Saunders's there) | Australian population (ssp. *sinensis*), not the Sri Lankan subspecies; plumage is equivalent |
| non_breeding | sternula-albifrons-non-breeding-1 | [Commons](https://commons.wikimedia.org/wiki/File:Little_Tern_by_Tisha_Mukherjee_01.jpg) | https://upload.wikimedia.org/wikipedia/commons/2/2a/Little_Tern_by_Tisha_Mukherjee_01.jpg | CC BY-SA 4.0 | Medium-high. Black bill, white forehead, black rear crown and mask, orange-red legs. Bakkhali, West Bengal, September | Bird is moderately small in frame (4146 px, croppable). Saunders's not normally on the Bay of Bengal coast |
| juvenile | sternula-albifrons-juvenile-1 | [Commons](https://commons.wikimedia.org/wiki/File:Charrancito_Sternula_albifrons_2.jpg) | https://upload.wikimedia.org/wikipedia/commons/0/0d/Charrancito_Sternula_albifrons_2.jpg | CC BY 2.0 | High. Juvenile with brown-scalloped upperparts and dark cap, being fed by a breeding adult. Cádiz, Spain | Two birds; the juvenile is partly hidden by the adult (crop to the juvenile, or accept as a pair image). Credit name trimmed in the attribution |

## Western Reef-Heron (`slb-egretta-gularis`)
| Slot | image_id | Source page | Original file | Licence | ID confidence and marks checked | Concerns |
|---|---|---|---|---|---|---|
| morph_white | egretta-gularis-morph-white-1 | [Commons](https://commons.wikimedia.org/wiki/File:Western_reef_egret_(Egretta_gularis_schistacea)_white_morph.jpg) | https://upload.wikimedia.org/wikipedia/commons/a/a4/Western_reef_egret_%28Egretta_gularis_schistacea%29_white_morph.jpg | CC BY-SA 4.0 | High. Heavy yellowish-brown bill (Little Egret's is fine and black), dark legs with yellow feet extending up the lower tarsus, nape plumes. *schistacea*, Bahrain | Not South Asia, but *schistacea* is the subspecies that reaches India and Sri Lanka || morph_dark | egretta-gularis-morph-dark-1 | [Commons](https://commons.wikimedia.org/wiki/File:Western_reef_egret_(Egretta_gularis_schistacea)_dark_morph_2.jpg) | https://upload.wikimedia.org/wikipedia/commons/9/95/Western_reef_egret_%28Egretta_gularis_schistacea%29_dark_morph_2.jpg | CC BY-SA 4.0 | High. Slate-grey plumage, white throat, heavy two-tone bill, nape plumes. *schistacea*, Bahrain | Pinkish courtship lores (breeding season) |

## Black-hooded Oriole (`slb-oriolus-xanthornus`)
| Slot | image_id | Source page | Original file | Licence | ID confidence and marks checked | Concerns |
|---|---|---|---|---|---|---|
| adult | oriolus-xanthornus-adult-1 | [Commons](https://commons.wikimedia.org/wiki/File:Black-hooded_oriole_(Oriolus_xanthornus_ceylonensis).jpg) | https://upload.wikimedia.org/wikipedia/commons/6/6e/Black-hooded_oriole_%28Oriolus_xanthornus_ceylonensis%29.jpg | CC BY-SA 4.0 | High. Full black hood, pink-red bill, red iris, yellow body, black wings with yellow patches. *ceylonensis*, Peradeniya | 1806 px long edge (just above target) || juvenile | oriolus-xanthornus-juvenile-1 | [Commons](https://commons.wikimedia.org/wiki/File:Black_hooded_Oriole_Juvenile.jpg) | https://upload.wikimedia.org/wikipedia/commons/6/66/Black_hooded_Oriole_Juvenile.jpg | CC BY-SA 4.0 | High. Immature: yellow forehead flecks, black hood streaked into the breast, **dark bill** (adult pink), duller wings | India (+05:30 EXIF), exact place not stated. Strictly first-year immature rather than fresh juvenile, which is how the species is usually shown |

## Slots not filled well

1. **Asian Koel, juvenile** — *no row added.* All candidates failed:
   - [Sarala Gamage, Hambantota](https://commons.wikimedia.org/wiki/File:Asian_Koel-_immature_male.jpg): watermarked, and a moulting immature male.
   - [J.M. Garg, Kolkata](https://commons.wikimedia.org/wiki/File:Asian_Koel-_Immature_I_IMG_1783.jpg): watermarked, small.
   - [Arthur Chapman](https://commons.wikimedia.org/wiki/File:Eudynamys_scolopaceus_(Asian_Koel)_-_Juvenile.jpg): probably the Australian population (not viewed).
   - Only iNat "juvenile" in Sri Lanka or India with an open licence: [iNat 430843068, Pune, CC BY](https://www.inaturalist.org/photos/430843068). A true black, dark-eyed fledgling, but grounded on a doorstep. Usable only as a fallback.

   Suggested next step: search eBird/Macaulay contributors or ask a Sri Lankan photographer for a CC BY photo. CC BY-NC would be the last resort per spec 003.

Weaker fills the owner should look at first:
- `terpsiphone-paradisi-male-1`: possibly captive.
- `pavo-cristatus-female-1`: head in foliage.
- `haliastur-indus-juvenile-1`: medium ID confidence.
- `spatula-querquedula-eclipse-1` and `spatula-querquedula-female-1`: below 1600 px.
- `sternula-albifrons-juvenile-1`: two birds.

## Notes for the owner
- **Licence counts (41 rows):** CC BY-SA 4.0 ×29, CC BY 4.0 ×6, CC BY-SA 2.0 ×2, CC BY 2.0 ×2, CC BY 3.0 ×1, CC0 1.0 ×1. **CC BY-NC: 0.** `training_ok=yes` on all rows.
- **Author vs attribution.** `author` is the credit string exactly as Commons gives it. Three Flickr-derived credits include a place ("Ferran Pestaña from Barcelona, España", "Frankie Chu from Hong Kong香港", "Agustín Povedano from El Puerto de Santa María, Extremadura y Andalucía"), and "JJ Harrison (https://www.jjharrison.com.au/)" includes a URL. The `attribution` line uses just the name. Confirm this is acceptable, or show the full author string.
- **CC BY-SA rows.** These images must stay CC BY-SA when the resized derivative is shared. The credit line plus licence link covers display; for any redistribution of the masters, keep the same licence.
- **iNat originals.** Pixel size of the six iNat originals was not checked (the API did not return dimensions). Some may be below 1600 px long edge.
- **Watermarks.** Watermark checks were visual on the full Commons image or the iNat medium preview. Re-check iNat originals for corner text after download.
