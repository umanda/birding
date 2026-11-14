import { readFileSync, statSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { ContentSchema } from '../../src/shared/data/content-schema';
import { SpeciesTextFileSchema } from '../../src/shared/data/species-text-schema';
import type { Content } from '../../src/shared/data/content-schema';
import { validateMediaRegister } from './media/validate-media';

export const EXPECTED_SPECIES = 295;
export const EXPECTED_PLATES = 43;
export const EXPECTED_SOURCES = 347;
const FACTSHEET_HOST = 'datazone.birdlife.org';
const SCHEME = /\b([A-Za-z][A-Za-z0-9+.-]*):\/\//g;
const CONTENT_FILE = 'content/content.json';
const TEXT_FILE = 'content/species-text.json';
export const TEXT_MAX_GZIP_BYTES = 250 * 1024; // lazy-loaded, but still precached (spec 003)

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

// Every species has a text record, and no record belongs to an unknown species.
export function validateSpeciesText(input: unknown, speciesIds: string[]): string[] {
  const parsed = SpeciesTextFileSchema.safeParse(input);
  if (!parsed.success) return parsed.error.issues.map((i) => `species-text: ${i.path.join('.')}: ${i.message}`);
  const textIds = Object.keys(parsed.data.species);
  return [
    ...speciesIds.filter((id) => !textIds.includes(id)).map((id) => `species-text: missing ${id}`),
    ...textIds.filter((id) => !speciesIds.includes(id)).map((id) => `species-text: unknown ${id}`),
  ];
}

export type SourceReport = { errors: string[]; httpCount: number; citationCount: number };

type Source = { source_id: string; citation: string; links: string[] };

function isHttpLink(link: string): boolean {
  try {
    return ['http:', 'https:'].includes(new URL(link).protocol);
  } catch {
    return false;
  }
}

// Every extracted link must parse as http(s), and so must any scheme in the citation text, so a
// link that extraction skipped (ftp://) is not lost silently.
function checkSource(source: Source): string[] {
  const where = `species-text: ${source.source_id}`;
  const errors = source.links.filter((l) => !isHttpLink(l)).map((l) => `${where}: bad link ${l}`);
  for (const [, scheme = ''] of source.citation.matchAll(SCHEME)) {
    if (!['http', 'https'].includes(scheme.toLowerCase())) errors.push(`${where}: scheme ${scheme} is not http(s)`);
  }
  return errors;
}

// Citations with no link are counted, not rejected: the workbook has them, and we do not rewrite data.
export function checkSources(input: unknown): SourceReport {
  const parsed = SpeciesTextFileSchema.safeParse(input);
  const report: SourceReport = { errors: [], httpCount: 0, citationCount: 0 };
  if (!parsed.success) return report; // validateSpeciesText reports schema errors
  const ids = new Set<string>();
  let total = 0;
  for (const [speciesId, record] of Object.entries(parsed.data.species)) {
    for (const source of record.sources) {
      total += 1;
      if (ids.has(source.source_id)) report.errors.push(`species-text: duplicate source_id ${source.source_id}`);
      ids.add(source.source_id);
      report.errors.push(...checkSource(source));
      report.httpCount += source.links.filter((l) => l.startsWith('http:')).length;
      if (source.links.length === 0) report.citationCount += 1;
    }
    const factsheet = record.conservation.birdlife_factsheet_url;
    if (factsheet !== null && !isFactsheetUrl(factsheet)) {
      report.errors.push(`species-text: ${speciesId}: factsheet URL is not on ${FACTSHEET_HOST}`);
    }
  }
  if (total !== EXPECTED_SOURCES) {
    report.errors.push(`species-text: expected ${EXPECTED_SOURCES} sources, found ${total}`);
  }
  return report;
}

function isFactsheetUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) && url.host === FACTSHEET_HOST;
  } catch {
    return false;
  }
}

function readJson(file: string): unknown {
  return JSON.parse(readFileSync(file, 'utf8'));
}

export function checkTextSize(gzipBytes: number): string[] {
  return gzipBytes > TEXT_MAX_GZIP_BYTES
    ? [`species-text: ${gzipBytes} bytes gzip exceeds budget ${TEXT_MAX_GZIP_BYTES}`]
    : [];
}

function main(): void {
  const content: unknown = readJson(CONTENT_FILE);
  const result = validateContent(content);
  const errors = [...result.errors];
  // Species ids come from content.json only when it is valid; otherwise its errors are enough.
  const parsed = ContentSchema.safeParse(content);
  if (parsed.success) {
    const ids = parsed.data.species.map((x) => x.species_id);
    const text = readJson(TEXT_FILE);
    errors.push(...validateSpeciesText(text, ids));
    const sources = checkSources(text);
    errors.push(...sources.errors);
    process.stdout.write(
      `sources: ${sources.httpCount} http links, ${sources.citationCount} free-text citations (not bare links)
`,
    );
    const media = validateMediaRegister(new Set(ids));
    errors.push(...media.errors);
    process.stdout.write(
      `media register: ${media.noncommercialCount} CC-BY-NC rows (replace before launch)\n`,
    );
  }
  const gzipBytes = gzipSync(readFileSync(TEXT_FILE)).length;
  errors.push(...checkTextSize(gzipBytes));
  for (const w of result.warnings) process.stdout.write(`warning: ${w}\n`);
  for (const e of errors) process.stderr.write(`error: ${e}\n`);
  if (errors.length > 0) process.exit(1);
  const rawBytes = statSync(TEXT_FILE).size;
  process.stdout.write(
    `${CONTENT_FILE} and ${TEXT_FILE} are valid (${rawBytes} raw, ${gzipBytes} gzip, ${result.warnings.length} warnings)\n`,
  );
}

if (require.main === module) main();
