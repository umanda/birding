# 0004 — Media storage, formats, licence register and offline packaging

- Status: Accepted
- Date: 2026-11-13

## Context
Species pages need male/female/juvenile images plus breeding, non-breeding and morph images where they differ
(#3, #11). That is about 480–520 images (ID design §5), and today there are none. MVP sources are Wikimedia
Commons and iNaturalist under CC licences (#10). Every image needs a licence record, and display rights are
separate from training rights (plan §4). Text, search and thumbnails ship with the app. The full photo pack is
optional (UX 01 §2.1). Data and index packaging belong to ADR 0006.

## Options
| Topic | Option | Pros | Cons |
|---|---|---|---|
| Hosting | **Processed images in repo, served as web static assets (ADR 0001 host)** | No extra service, versioned with data, previews include them | Repo grows (~70 MB). Replacements add history |
| | Cloudflare R2 bucket (10 GB free, free egress) | Repo stays small | Extra upload step, keys, drift between data and media |
| | Supabase Storage | Same vendor as auth | 1 GB / 5 GB egress free tier; egress costs |
| Format | **WebP only** | ~97% browser support, decodes on older Android/iOS | ~20% bigger than AVIF |
| | AVIF + WebP fallback | Smallest | Two files per image, older devices lack AVIF |

## Decision
- **Register:** `data/content/media/licences.csv` is the source of truth and is reviewed as `data` commits. Columns:
  `image_id, species_id, plumage_key, view (perched|flight), file, source_url, author, licence (SPDX, e.g.
  CC-BY-4.0), licence_url, attribution, modifications, retrieved_on, display_ok, training_ok (yes|no|unknown),
  status (proposed|reviewed|rejected), reviewed_by, reviewed_at`. Rows become ADR 0006 `MediaAsset` records. Allowed for display: CC0, CC BY, CC BY-SA.
  CC BY-NC is allowed **only** in the private MVP, flagged `replace_before_launch` (see owner question).
  ND and "all rights reserved" are not allowed. Only `reviewed` rows ship.
- **Files:** commit one master per image at `data/content/media/<species_id>/<image_id>.webp` (1600 px long
  edge, q80). Full-resolution originals are not committed, because `source_url` lets us re-fetch them. The
  pipeline (`tools/content/media`, using the `sharp` dev-dependency) generates:
  - **thumb**: 1 per species (primary plumage), 240 px long edge, WebP q70, target ≤ 12 KB
  - **full**: 1080 px long edge, WebP q75, target ≤ 120 KB, EXIF/GPS stripped
  - a `media-manifest.json` (id → path, bytes, sha256, credit line), consumed via ADR 0006 data.
- **Validation (CI, ADR 0005):** every shipped file has exactly one `reviewed` register row and vice versa,
  the licence is in the allow-list, size limits are met, and the `species_id`/`plumage_key` values exist.
- **Web/PWA offline:** the Workbox precache holds the app shell, fonts, data files, plate HTML and
  **thumbnails**; species pages come from one precached `species/[id].html` template via a navigation
  fallback (295 pages would be 13.9 MB, over ADR 0001's 10 MB budget; the precache is about 4 MB). Full images use a runtime **CacheFirst** cache (`photos-v1`). "Download offline pack"
  (Me tab) fetches all full images from the manifest into that cache with progress, Wi-Fi hint and
  resume, and calls `navigator.storage.persist()`. Use content-hashed file names, so updates only download changed images.
- **Native offline:** thumbnails are bundled as app assets. Full images download on demand or as the
  pack into the document directory via `expo-file-system`, from the same web host URLs, verified by sha256.
- **Updates:** web is a new deploy, then the SW shows "Update available, tap to reload" (no forced reload
  mid-ID). Native gets data/thumbs via EAS Update or a store build, and the photo pack is diffed against the new manifest.

## Budgets
| Item | Budget |
|---|---|
| Thumbnails (295) | ≤ 4 MB total |
| Full photo pack (~500) | ≤ 75 MB total; shown with size before download |
| Single full image | ≤ 200 KB hard limit (CI fails) |
| Repo media masters | ≤ 150 MB; above that, move masters to R2 (new ADR) |

## Consequences
- With one host and one deploy, previews show exactly the media that will ship.
- Credits are rendered from the manifest, so we never show an image without a credit. The Me tab gets a full credits list.
- The register also prepares Photo ID training data (`training_ok`), but training images are a separate, larger set.
- User uploads (F16) will need object storage (Supabase Storage or R2). Decide that in its own ADR.
