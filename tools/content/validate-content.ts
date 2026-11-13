import { readFileSync } from 'node:fs';
import { ContentSchema } from '../../src/shared/data/content-schema';
import type { Content } from '../../src/shared/data/content-schema';

export const EXPECTED_SPECIES = 295;
export const EXPECTED_PLATES = 43;
const CONTENT_FILE = 'content/content.json';

export type ValidationResult = { errors: string[]; warnings: string[] };

function findDuplicates(ids: string[]): string[] {
  return ids.filter((id, i) => ids.indexOf(id) !== i);
}

function checkKeys(content: Content): string[] {
  const errors: string[] = [];
  for (const id of findDuplicates(content.plates.map((p) => p.plate_id))) {
    errors.push(`Duplicate plate_id: ${id}`);
  }
  for (const id of findDuplicates(content.species.map((s) => s.species_id))) {
    errors.push(`Duplicate species_id: ${id}`);
  }
  const slots = content.species.map((s) => `${s.plate_id}#${s.plate_order}`);
  for (const slot of findDuplicates(slots)) errors.push(`Duplicate plate_order slot: ${slot}`);
  const plateIds = new Set(content.plates.map((p) => p.plate_id));
  for (const s of content.species) {
    if (!plateIds.has(s.plate_id)) errors.push(`${s.species_id}: unknown plate_id ${s.plate_id}`);
  }
  return errors;
}

function checkCounts(content: Content): string[] {
  const errors: string[] = [];
  if (content.species.length !== EXPECTED_SPECIES) {
    errors.push(`Expected ${EXPECTED_SPECIES} species, found ${content.species.length}`);
  }
  if (content.plates.length !== EXPECTED_PLATES) {
    errors.push(`Expected ${EXPECTED_PLATES} plates, found ${content.plates.length}`);
  }
  return errors;
}

// Blank Sinhala/IUCN is allowed (stays null) but surfaced; non-NFC Sinhala is reported, never fixed.
function hasEdgeWhitespace(text: string): boolean {
  return text !== text.trim();
}

function checkSinhala(label: string, kind: string, text: string | null): string[] {
  if (text === null) return [`${label}: blank Sinhala ${kind}`];
  return text === text.normalize('NFC') ? [] : [`${label}: Sinhala ${kind} is not NFC`];
}

// Blank Sinhala/IUCN is allowed (stays null) but surfaced. Whitespace and non-NFC text is
// reported, never fixed, because source values are copied verbatim.
function collectWarnings(content: Content): string[] {
  const warnings: string[] = [];
  for (const p of content.plates) {
    warnings.push(...checkSinhala(p.plate_id, 'title', p.title.si));
  }
  for (const s of content.species) {
    warnings.push(...checkSinhala(s.species_id, 'name', s.names.si));
    if (s.iucn_category === null) warnings.push(`${s.species_id}: blank IUCN category`);
    const names = [s.names.en, s.names.si ?? '', s.names.scientific];
    if (names.some(hasEdgeWhitespace)) warnings.push(`${s.species_id}: name has edge whitespace`);
  }
  return warnings;
}

// Zod reports array indexes; show the record id instead so errors are findable in the workbook.
function describeIssue(input: unknown, issue: { path: PropertyKey[]; message: string }): string {
  const [table, index, ...rest] = issue.path;
  const record = (input as Record<string, Record<number, Record<string, unknown>> | undefined>)?.[
    String(table)
  ]?.[Number(index)];
  const id = record?.species_id ?? record?.plate_id;
  const where = typeof id === 'string' ? `${String(table)}[${id}]` : issue.path.join('.');
  return `${[where, ...rest].join('.')}: ${issue.message}`;
}

export function validateContent(input: unknown): ValidationResult {
  const parsed = ContentSchema.safeParse(input);
  if (!parsed.success) {
    return { errors: parsed.error.issues.map((i) => describeIssue(input, i)), warnings: [] };
  }
  const content = parsed.data;
  return {
    errors: [...checkKeys(content), ...checkCounts(content)],
    warnings: collectWarnings(content),
  };
}

function main(): void {
  const { errors, warnings } = validateContent(JSON.parse(readFileSync(CONTENT_FILE, 'utf8')));
  for (const w of warnings) process.stdout.write(`warning: ${w}\n`);
  for (const e of errors) process.stderr.write(`error: ${e}\n`);
  if (errors.length > 0) process.exit(1);
  process.stdout.write(`${CONTENT_FILE} is valid (${warnings.length} warnings)\n`);
}

if (require.main === module) main();
