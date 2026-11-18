import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import {
  HASH_LENGTH,
  MANIFEST_FILE,
  MASTERS_MAX_BYTES,
  OUTPUT_SUBDIR,
  PHOTO_PACK_MAX_BYTES,
  PUBLIC_DIR,
  budgetErrors,
  choosePrimaries,
  creditOf,
  mastersErrors,
  packBytesOf,
  parseManifest,
  targetWarnings,
} from './media-manifest';
import type { ManifestImage, MediaManifest, Variant } from './media-manifest';
import type { Content } from '../../../src/shared/data/content-schema';
import { MediaRowSchema } from './media-schema';
import type { MediaRow } from './media-schema';
import { MEDIA_DIR, REGISTER_FILE, parseRegister } from './validate-media';

const CONTENT_FILE = 'content/content.json';

// Hashes of files as found on disk. Generated files are keyed by path relative to public/,
// masters by the register's `file` column.
export type FileInfo = { bytes: number; sha256: string };
export type MediaCheckInput = {
  rows: readonly MediaRow[];
  manifest: MediaManifest;
  files: ReadonlyMap<string, FileInfo>;
  masters: ReadonlyMap<string, string>;
};

function checkVariant(
  image: ManifestImage,
  kind: 'thumb' | 'full',
  variant: Variant,
  files: MediaCheckInput['files'],
): string[] {
  const id = `${image.image_id} ${kind}`;
  const name = `${image.image_id}.${variant.sha256.slice(0, HASH_LENGTH)}.${kind}.webp`;
  const expectedPath = `${OUTPUT_SUBDIR}/${image.species_id}/${name}`;
  const errors: string[] = [];
  if (variant.path !== expectedPath) errors.push(`${id}: path should be ${expectedPath}`);
  const file = files.get(variant.path);
  if (!file) return [...errors, `${id}: missing file ${variant.path}`];
  if (file.bytes !== variant.bytes) errors.push(`${id}: file is ${file.bytes} bytes, manifest says ${variant.bytes}`);
  if (file.sha256 !== variant.sha256) errors.push(`${id}: file sha256 differs from the manifest`);
  return errors;
}

function checkImage(
  image: ManifestImage,
  row: MediaRow,
  input: Pick<MediaCheckInput, 'files' | 'masters'>,
  primaries: ReadonlySet<string>,
): string[] {
  const id = image.image_id;
  const errors: string[] = [];
  for (const field of ['species_id', 'plumage_key', 'view'] as const) {
    if (image[field] !== row[field]) errors.push(`${id}: ${field} differs from the register`);
  }
  if (JSON.stringify(image.credit) !== JSON.stringify(creditOf(row))) {
    errors.push(`${id}: credit differs from the register`);
  }
  if (input.masters.get(row.file) !== image.master_sha256) errors.push(`${id}: master_sha256 differs from ${row.file}`);
  if (image.primary !== primaries.has(id)) errors.push(`${id}: primary should be ${primaries.has(id)}`);
  if (image.primary !== (image.thumb !== null)) errors.push(`${id}: thumb must be present exactly when primary`);
  if (image.thumb) errors.push(...checkVariant(image, 'thumb', image.thumb, input.files));
  return [...errors, ...checkVariant(image, 'full', image.full, input.files)];
}

// Does not re-encode, so it gives the same answer on every OS (libwebp output may differ).
export function checkMedia(input: MediaCheckInput): string[] {
  const { rows, manifest, files } = input;
  const reviewed = new Map(rows.filter((r) => r.status === 'reviewed').map((r) => [r.image_id, r]));
  const primaries = choosePrimaries(rows);
  const ids = manifest.images.map((i) => i.image_id);
  const errors = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))].map((id) => `${id}: duplicate in manifest`);
  for (const image of manifest.images) {
    const row = reviewed.get(image.image_id);
    errors.push(...(row ? checkImage(image, row, input, primaries) : [`${image.image_id}: no reviewed register row`]));
  }
  for (const id of reviewed.keys()) if (!ids.includes(id)) errors.push(`${id}: reviewed but not in manifest`);
  const listed = new Set(manifest.images.flatMap((i) => [i.thumb?.path, i.full.path]));
  for (const file of files.keys()) if (!listed.has(file)) errors.push(`${file}: not in manifest`);
  return [...errors, ...budgetErrors(manifest.images)];
}

function sha256Of(data: Buffer): string {
  return createHash('sha256').update(data).digest('hex');
}

function readFiles(): Map<string, FileInfo> {
  const dir = path.join(PUBLIC_DIR, OUTPUT_SUBDIR);
  if (!existsSync(dir)) return new Map();
  const entries = readdirSync(dir, { recursive: true, withFileTypes: true }).filter((e) => e.isFile());
  return new Map(
    entries.map((e) => {
      const full = path.join(e.parentPath, e.name);
      const data = readFileSync(full);
      const relative = path.relative(PUBLIC_DIR, full).split(path.sep).join('/');
      return [relative, { bytes: data.length, sha256: sha256Of(data) }];
    }),
  );
}

function readMasters(rows: readonly MediaRow[]): Map<string, string> {
  const present = rows.filter((r) => existsSync(path.join(MEDIA_DIR, r.file)));
  return new Map(present.map((r) => [r.file, sha256Of(readFileSync(path.join(MEDIA_DIR, r.file)))]));
}

function readRows(): { rows: MediaRow[]; errors: string[] } {
  const parsed = parseRegister(readFileSync(REGISTER_FILE, 'utf8'));
  const rows: MediaRow[] = [];
  const errors = [...parsed.errors];
  for (const record of parsed.rows) {
    const result = MediaRowSchema.safeParse(record);
    if (result.success) rows.push(result.data);
    else errors.push(...result.error.issues.map((i) => `${record.image_id}: ${i.path.join('.')} ${i.message}`));
  }
  return { rows, errors };
}

function directoryBytes(dir: string): number {
  if (!existsSync(dir)) return 0;
  const entries = readdirSync(dir, { recursive: true, withFileTypes: true }).filter((e) => e.isFile());
  return entries.reduce((sum, e) => sum + statSync(path.join(e.parentPath, e.name)).size, 0);
}

const toMb = (bytes: number): string => `${(bytes / 1024 / 1024).toFixed(1)} MB`;

// Concise size and coverage report, printed when the check passes.
export function mediaReport(
  manifest: MediaManifest,
  speciesIds: readonly string[],
  sizes: { masters: number; publicMedia: number },
): string {
  const withPhotos = new Set(manifest.images.map((i) => i.species_id));
  const perPlumage = new Map<string, number>();
  for (const { plumage_key: key } of manifest.images) perPlumage.set(key, (perPlumage.get(key) ?? 0) + 1);
  const plumages = [...perPlumage].map(([key, n]) => `${key} ${n}`).join(', ');
  const without = speciesIds.filter((id) => !withPhotos.has(id)).length;
  return [
    `media manifest ok: ${manifest.images.length} images`,
    `photo pack ${toMb(packBytesOf(manifest.images))} of ${toMb(PHOTO_PACK_MAX_BYTES)}`,
    `masters ${toMb(sizes.masters)} of ${toMb(MASTERS_MAX_BYTES)}; public/media ${toMb(sizes.publicMedia)}`,
    `species with a photo ${withPhotos.size} / ${speciesIds.length}; without ${without}`,
    `images per plumage: ${plumages || 'none'}`,
  ].join('\n');
}

function readSpeciesIds(): string[] {
  const content = JSON.parse(readFileSync(CONTENT_FILE, 'utf8')) as Content;
  return content.species.map((s) => s.species_id);
}

function main(): void {
  const { rows, errors } = readRows();
  const { manifest, errors: manifestErrors } = parseManifest(readFileSync(MANIFEST_FILE, 'utf8'));
  errors.push(...manifestErrors);
  const mastersBytes = directoryBytes(MEDIA_DIR);
  if (manifest && errors.length === 0) {
    errors.push(...mastersErrors(mastersBytes));
    errors.push(...checkMedia({ rows, manifest, files: readFiles(), masters: readMasters(rows) }));
    for (const warning of targetWarnings(manifest.images)) process.stderr.write(`warning: ${warning}\n`);
  }
  if (errors.length > 0 || !manifest) throw new Error(`Media check failed:\n${errors.join('\n')}`);
  const publicMedia = directoryBytes(path.join(PUBLIC_DIR, OUTPUT_SUBDIR));
  process.stdout.write(`${mediaReport(manifest, readSpeciesIds(), { masters: mastersBytes, publicMedia })}\n`);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    process.stderr.write(`${String(error)}\n`);
    process.exit(1);
  }
}
