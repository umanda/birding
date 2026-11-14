import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { parse } from 'csv-parse/sync';
import { MediaRowSchema, REGISTER_COLUMNS } from './media-schema';
import type { MediaRow } from './media-schema';

export const MEDIA_DIR = 'data/content/media';
export const REGISTER_FILE = `${MEDIA_DIR}/licences.csv`;

const OPEN_LICENCE = /^(CC0-1\.0|CC-BY-\d\.\d|CC-BY-SA-\d\.\d)$/;
// Allowed for display but flagged "replace before launch" (ADR 0004).
export const NONCOMMERCIAL_LICENCE = /^CC-BY-NC(-SA)?-\d\.\d$/;
// A reviewed row is a published image, so provenance may not be blank.
const REVIEWED_REQUIRED = [
  'source_url',
  'author',
  'licence',
  'licence_url',
  'attribution',
  'retrieved_on',
  'reviewed_by',
  'reviewed_at',
] as const;

export type MediaContext = {
  speciesIds: ReadonlySet<string>;
  files: readonly string[]; // webp paths relative to MEDIA_DIR, e.g. "slb-x/img-1.webp"
};
export type MediaReport = { errors: string[]; noncommercialCount: number };

export type ParsedRegister = { rows: Record<string, string | null>[]; errors: string[] };

export function parseRegister(csv: string): ParsedRegister {
  let table: string[][];
  try {
    table = parse(csv, { skip_empty_lines: true, bom: true });
  } catch (error) {
    return { rows: [], errors: [`licences.csv cannot be parsed: ${(error as Error).message}`] };
  }
  const [header = [], ...records] = table;
  if (header.join(',') !== REGISTER_COLUMNS.join(',')) {
    return { rows: [], errors: [`licences.csv header must be: ${REGISTER_COLUMNS.join(',')}`] };
  }
  const rows = records.map((r) => Object.fromEntries(header.map((k, i) => [k, r[i] || null])));
  return { rows, errors: [] };
}

// Licence id -> path under creativecommons.org. Unlisted licences are caught by the allow-list.
function expectedLicenceUrl(licence: string): string | null {
  if (licence === 'CC0-1.0') return 'https://creativecommons.org/publicdomain/zero/1.0';
  const match = /^CC-BY((?:-[A-Z]+)*)-(\d\.\d)$/.exec(licence);
  if (!match) return null;
  return `https://creativecommons.org/licenses/by${(match[1] ?? '').toLowerCase()}/${match[2]}`;
}

function checkRow(row: MediaRow, ctx: MediaContext): string[] {
  const id = row.image_id;
  const errors: string[] = [];
  if (!ctx.speciesIds.has(row.species_id)) errors.push(`${id}: unknown species_id ${row.species_id}`);
  if (row.file !== `${row.species_id}/${id}.webp`) {
    errors.push(`${id}: file must be ${row.species_id}/${id}.webp`);
  }
  if (row.status === 'rejected') return errors;
  const licence = row.licence ?? '';
  if (row.licence !== null && !OPEN_LICENCE.test(licence) && !NONCOMMERCIAL_LICENCE.test(licence)) {
    errors.push(`${id}: licence ${licence} is not allowed (ND and all-rights-reserved are rejected)`);
  }
  if (row.status !== 'reviewed') return errors;
  for (const column of REVIEWED_REQUIRED) {
    if (row[column] === null) errors.push(`${id}: reviewed row has blank ${column}`);
  }
  const expectedUrl = expectedLicenceUrl(licence);
  if (expectedUrl && row.licence_url?.replace(/\/$/, '') !== expectedUrl) {
    errors.push(`${id}: licence_url must be ${expectedUrl}/ for ${licence}`);
  }
  if (row.display_ok !== 'yes') errors.push(`${id}: reviewed row must have display_ok=yes`);
  if (!ctx.files.includes(row.file)) errors.push(`${id}: reviewed row has no file ${row.file}`);
  return errors;
}

function checkParity(rows: MediaRow[], files: readonly string[]): string[] {
  const reviewed = rows.filter((r) => r.status === 'reviewed').map((r) => r.file);
  return files
    .filter((file) => reviewed.filter((f) => f === file).length !== 1)
    .map((file) => `${file}: image file needs exactly one reviewed row`);
}

function duplicates(ids: string[]): string[] {
  return ids.filter((id, i) => ids.indexOf(id) !== i);
}

export function validateMedia(input: Record<string, string | null>[], ctx: MediaContext): MediaReport {
  const errors: string[] = [];
  const rows: MediaRow[] = [];
  input.forEach((record, i) => {
    const parsed = MediaRowSchema.safeParse(record);
    if (parsed.success) {
      rows.push(parsed.data);
      return;
    }
    const where = record.image_id ?? `row ${i + 2}`;
    for (const issue of parsed.error.issues) errors.push(`${where}: ${issue.path.join('.')} ${issue.message}`);
  });
  for (const id of duplicates(rows.map((r) => r.image_id))) errors.push(`Duplicate image_id: ${id}`);
  for (const row of rows) errors.push(...checkRow(row, ctx));
  errors.push(...checkParity(rows, ctx.files));
  const noncommercialCount = rows.filter(
    (r) => r.status !== 'rejected' && NONCOMMERCIAL_LICENCE.test(r.licence ?? ''),
  ).length;
  return { errors, noncommercialCount };
}

// Only <species_id>/<image_id>.webp directly under dir; generated outputs live elsewhere.
export function listWebpFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((folder) =>
      readdirSync(`${dir}/${folder.name}`)
        .filter((name) => name.endsWith('.webp'))
        .map((name) => `${folder.name}/${name}`),
    );
}

export function validateMediaRegister(speciesIds: ReadonlySet<string>): MediaReport {
  const { rows, errors } = parseRegister(readFileSync(REGISTER_FILE, 'utf8'));
  const report = validateMedia(rows, { speciesIds, files: listWebpFiles(MEDIA_DIR) });
  return { ...report, errors: [...errors, ...report.errors] };
}
