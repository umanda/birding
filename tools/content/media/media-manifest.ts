import { z } from 'zod';
import type { MediaRow } from './media-schema';
import { NONCOMMERCIAL_LICENCE } from './validate-media';

// Tooling only. src/ must `import type` from this file so zod never reaches the client bundle.

// Served statically by the web export: public/media/... becomes /media/...
export const PUBLIC_DIR = 'public';
export const OUTPUT_SUBDIR = 'media';
export const MANIFEST_FILE = 'content/media-manifest.json';

// ADR 0004. The target is a warning, the limit fails the build.
export const THUMB = { edge: 240, quality: 70, targetBytes: 12 * 1024 };
export const FULL = { edge: 1080, quality: 75, targetBytes: 120 * 1024, maxBytes: 200 * 1024 };
export const THUMBS_TOTAL_MAX_BYTES = 4 * 1024 * 1024;
export const HASH_LENGTH = 8;

// ADR 0004: one thumbnail per species. Its image is the first reviewed one in this plumage
// order, then the other plumages alphabetically, then image_id.
export const PRIMARY_PLUMAGE_PRIORITY = ['adult', 'male', 'breeding'];

const VariantSchema = z.object({
  path: z.string(),
  bytes: z.number().int().nonnegative(),
  sha256: z.string().regex(/^[0-9a-f]{64}$/),
});
const nullableText = z.string().nullable();
const ManifestImageSchema = z.object({
  image_id: z.string(),
  species_id: z.string(),
  plumage_key: z.string(),
  view: z.string(),
  primary: z.boolean(), // true exactly when thumb is present
  thumb: VariantSchema.nullable(),
  full: VariantSchema,
  master_sha256: z.string().regex(/^[0-9a-f]{64}$/),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  credit: z.object({
    author: nullableText,
    licence: nullableText,
    licence_url: nullableText,
    source_url: nullableText,
    attribution: nullableText,
    replace_before_launch: z.boolean(),
  }),
});
const ManifestSchema = z.object({ schema_version: z.literal(1), images: z.array(ManifestImageSchema) });

export type Variant = z.infer<typeof VariantSchema>;
export type ManifestImage = z.infer<typeof ManifestImageSchema>;
export type MediaManifest = z.infer<typeof ManifestSchema>;

export type ParsedManifest = { manifest: MediaManifest | null; errors: string[] };

export function parseManifest(text: string): ParsedManifest {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch (error) {
    return { manifest: null, errors: [`media-manifest.json is not valid JSON: ${(error as Error).message}`] };
  }
  const result = ManifestSchema.safeParse(json);
  if (result.success) return { manifest: result.data, errors: [] };
  const errors = result.error.issues.map((i) => `media-manifest.json: ${i.path.join('.')} ${i.message}`);
  return { manifest: null, errors };
}

function plumageRank(key: string): number {
  const index = PRIMARY_PLUMAGE_PRIORITY.indexOf(key);
  return index === -1 ? PRIMARY_PLUMAGE_PRIORITY.length : index;
}

function comparePrimary(a: MediaRow, b: MediaRow): number {
  const rank = plumageRank(a.plumage_key) - plumageRank(b.plumage_key);
  if (rank !== 0) return rank;
  if (a.plumage_key !== b.plumage_key) return a.plumage_key < b.plumage_key ? -1 : 1;
  if (a.image_id === b.image_id) return 0;
  return a.image_id < b.image_id ? -1 : 1;
}

// image_ids that get the species thumbnail: one per species, from its reviewed rows.
export function choosePrimaries(rows: readonly MediaRow[]): Set<string> {
  const best = new Map<string, MediaRow>();
  for (const row of rows.filter((r) => r.status === 'reviewed')) {
    const current = best.get(row.species_id);
    if (!current || comparePrimary(row, current) < 0) best.set(row.species_id, row);
  }
  return new Set([...best.values()].map((r) => r.image_id));
}

export function budgetErrors(images: readonly ManifestImage[]): string[] {
  const errors = images
    .filter((i) => i.full.bytes > FULL.maxBytes)
    .map((i) => `${i.image_id}: full is ${i.full.bytes} bytes, over the ${FULL.maxBytes} byte limit`);
  const thumbsTotal = images.reduce((sum, i) => sum + (i.thumb?.bytes ?? 0), 0);
  if (thumbsTotal > THUMBS_TOTAL_MAX_BYTES) {
    errors.push(`thumbs total ${thumbsTotal} bytes, over the ${THUMBS_TOTAL_MAX_BYTES} byte budget`);
  }
  return errors;
}

export function targetWarnings(images: readonly ManifestImage[]): string[] {
  const warnings: string[] = [];
  for (const { image_id: id, thumb, full } of images) {
    if (thumb && thumb.bytes > THUMB.targetBytes) {
      warnings.push(`${id}: thumb ${thumb.bytes} bytes, target ${THUMB.targetBytes}`);
    }
    if (full.bytes > FULL.targetBytes) warnings.push(`${id}: full ${full.bytes} bytes, target ${FULL.targetBytes}`);
  }
  return warnings;
}

export function creditOf(row: MediaRow): ManifestImage['credit'] {
  return {
    author: row.author,
    licence: row.licence,
    licence_url: row.licence_url,
    source_url: row.source_url,
    attribution: row.attribution,
    replace_before_launch: NONCOMMERCIAL_LICENCE.test(row.licence ?? ''),
  };
}
