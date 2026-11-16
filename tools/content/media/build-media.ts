import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import sharp, { type OutputInfo } from 'sharp';
import {
  FULL,
  FULL_FALLBACKS,
  HASH_LENGTH,
  MANIFEST_FILE,
  OUTPUT_SUBDIR,
  PUBLIC_DIR,
  THUMB,
  budgetErrors,
  choosePrimaries,
  creditOf,
  targetWarnings,
} from './media-manifest';
import type { ManifestImage, MediaManifest, Variant } from './media-manifest';
import { MediaRowSchema } from './media-schema';
import type { MediaRow } from './media-schema';
import { MEDIA_DIR, REGISTER_FILE, listWebpFiles, parseRegister, validateMedia } from './validate-media';
import type { MediaContext } from './validate-media';

const CONTENT_FILE = 'content/content.json';

export type MediaBuild = { manifest: MediaManifest; files: Map<string, Buffer>; warnings: string[] };

type Setting = { edge: number; quality: number };
type Encoded = {
  variant: Variant;
  data: Buffer;
  width: number;
  height: number;
  steppedDownTo: Setting | null; // the fallback used for a full image, if any
};

function sha256Of(data: Buffer): string {
  return createHash('sha256').update(data).digest('hex');
}

// Metadata (EXIF, GPS, ICC) is dropped by sharp's default; a fixed effort keeps output reproducible.
function encodeAt(
  master: Buffer,
  edge: number,
  quality: number,
): Promise<{ data: Buffer; info: OutputInfo }> {
  return sharp(master)
    .resize({ width: edge, height: edge, fit: 'inside', withoutEnlargement: true })
    .webp({ quality, effort: 4 })
    .toBuffer({ resolveWithObject: true });
}

async function encode(master: Buffer, row: MediaRow, kind: 'thumb' | 'full'): Promise<Encoded> {
  const { edge, quality } = kind === 'thumb' ? THUMB : FULL;
  let { data, info } = await encodeAt(master, edge, quality);
  let steppedDownTo: Setting | null = null;
  if (kind === 'full') {
    for (const fallback of FULL_FALLBACKS) {
      if (data.length <= FULL.maxBytes) break;
      ({ data, info } = await encodeAt(master, fallback.edge, fallback.quality));
      steppedDownTo = fallback;
    }
  }
  const sha256 = sha256Of(data);
  const name = `${row.image_id}.${sha256.slice(0, HASH_LENGTH)}.${kind}.webp`;
  const variant = { path: `${OUTPUT_SUBDIR}/${row.species_id}/${name}`, bytes: data.length, sha256 };
  return { variant, data, width: info.width, height: info.height, steppedDownTo };
}

function compareRows(a: MediaRow, b: MediaRow): number {
  const key = (r: MediaRow): string => [r.species_id, r.plumage_key, r.image_id].join('|');
  if (key(a) === key(b)) return 0;
  return key(a) < key(b) ? -1 : 1;
}

// Only reviewed register rows are published; the species thumbnail is made for the primary image
// only. Throws when a budget is exceeded.
export async function buildMedia(rows: readonly MediaRow[], masterDir: string): Promise<MediaBuild> {
  const files = new Map<string, Buffer>();
  const images: ManifestImage[] = [];
  const warnings: string[] = [];
  const primaries = choosePrimaries(rows);
  for (const row of rows.filter((r) => r.status === 'reviewed').sort(compareRows)) {
    const master = readFileSync(path.join(masterDir, row.file));
    const full = await encode(master, row, 'full');
    const thumb = primaries.has(row.image_id) ? await encode(master, row, 'thumb') : null;
    files.set(full.variant.path, full.data);
    if (full.steppedDownTo) {
      const { edge, quality } = full.steppedDownTo;
      warnings.push(`${row.image_id}: full stepped down to ${edge}px q${quality}`);
    }
    if (thumb) files.set(thumb.variant.path, thumb.data);
    images.push({
      image_id: row.image_id,
      species_id: row.species_id,
      plumage_key: row.plumage_key,
      view: row.view,
      primary: thumb !== null,
      thumb: thumb?.variant ?? null,
      full: full.variant,
      master_sha256: sha256Of(master),
      width: full.width,
      height: full.height,
      credit: creditOf(row),
    });
  }
  const errors = budgetErrors(images);
  if (errors.length > 0) throw new Error(`Media budget exceeded:\n${errors.join('\n')}`);
  return { manifest: { schema_version: 1, images }, files, warnings: [...warnings, ...targetWarnings(images)] };
}

// Rewrites public/media from scratch, which also removes stale files.
export function writeMedia(build: MediaBuild, publicDir: string, manifestFile: string): void {
  rmSync(path.join(publicDir, OUTPUT_SUBDIR), { recursive: true, force: true });
  for (const [file, data] of build.files) {
    const target = path.join(publicDir, file);
    mkdirSync(path.dirname(target), { recursive: true });
    writeFileSync(target, data);
  }
  mkdirSync(path.dirname(manifestFile), { recursive: true });
  writeFileSync(manifestFile, `${JSON.stringify(build.manifest, null, 2)}\n`);
}

// Runs the register validator first, so nothing is generated from an invalid register.
export function validatedRows(csv: string, context: MediaContext): MediaRow[] {
  const parsed = parseRegister(csv);
  const errors = [...parsed.errors, ...validateMedia(parsed.rows, context).errors];
  if (errors.length > 0) throw new Error(`Media register is invalid:\n${errors.join('\n')}`);
  return parsed.rows.map((row) => MediaRowSchema.parse(row));
}

function readSpeciesIds(): Set<string> {
  const content = JSON.parse(readFileSync(CONTENT_FILE, 'utf8')) as { species: { species_id: string }[] };
  return new Set(content.species.map((s) => s.species_id));
}

async function main(): Promise<void> {
  const context = { speciesIds: readSpeciesIds(), files: listWebpFiles(MEDIA_DIR) };
  const rows = validatedRows(readFileSync(REGISTER_FILE, 'utf8'), context);
  const build = await buildMedia(rows, MEDIA_DIR);
  writeMedia(build, PUBLIC_DIR, MANIFEST_FILE);
  for (const warning of build.warnings) process.stderr.write(`warning: ${warning}\n`);
  process.stdout.write(`media: ${build.manifest.images.length} images\n`);
}

if (require.main === module) {
  main().catch((error: unknown) => {
    process.stderr.write(`${String(error)}\n`);
    process.exit(1);
  });
}
