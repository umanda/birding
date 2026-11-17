import { parse } from 'csv-parse/sync';
import {
  BEHAVIOURS,
  COLOURS,
  COMMONNESS,
  HABITATS,
  MAX_COLOURS,
  SIZE_CLASSES,
  ZONES,
} from '../../src/shared/data/traits-vocabulary';

export const TRAITS_COLUMNS = [
  'species_id',
  'trait',
  'value',
  'plumage_key',
  'source',
  'confidence',
  'review_status',
  'note',
] as const;
export const REVIEW_STATUSES = ['proposed', 'reviewed', 'rejected'];
const CONFIDENCES = ['high', 'medium', 'low'];
const MONTH_VALUES = ['all', ...Array.from({ length: 12 }, (_, i) => String(i + 1))];
const PLUMAGE_KEYS = ['male', 'female', 'juvenile', 'adult', 'breeding', 'non_breeding', 'eclipse'];
const MORPH_KEY = /^morph_[a-z0-9_]+$/;
const KEYED_TRAITS = ['colour', 'size'];

// Blank cells are '' here; note is free text and may be blank.
export type TraitRow = Record<(typeof TRAITS_COLUMNS)[number], string>;
export type TraitsReport = {
  rows: TraitRow[];
  errors: string[];
  counts: Record<string, number>;
};

const VOCABULARY: Record<string, readonly string[]> = {
  zone: ZONES,
  habitat: HABITATS,
  size: SIZE_CLASSES,
  colour: COLOURS,
  behaviour: BEHAVIOURS,
  month: MONTH_VALUES,
};

function parseRows(csv: string): { rows: TraitRow[]; errors: string[] } {
  let table: string[][];
  try {
    table = parse(csv, { skip_empty_lines: true, bom: true });
  } catch (error) {
    return { rows: [], errors: [`traits.csv cannot be parsed: ${(error as Error).message}`] };
  }
  const [header = [], ...records] = table;
  if (header.join(',') !== TRAITS_COLUMNS.join(',')) {
    return { rows: [], errors: [`traits.csv header must be: ${TRAITS_COLUMNS.join(',')}`] };
  }
  const rows = records.map((r) =>
    Object.fromEntries(header.map((k, i) => [k, r[i] ?? ''])),
  ) as TraitRow[];
  return { rows, errors: [] };
}

function checkValue(row: TraitRow): string[] {
  if (row.trait === 'commonness') {
    const [zone = '', level = ''] = row.value.split(':');
    const ok = ZONES.some((z) => z === zone) && COMMONNESS.some((c) => c === level);
    return ok ? [] : [`bad commonness "${row.value}", expected <zone>:<level>`];
  }
  const allowed = VOCABULARY[row.trait];
  if (!allowed) return [`unknown trait "${row.trait}"`];
  return allowed.includes(row.value) ? [] : [`${row.trait} value "${row.value}" is not in the vocabulary`];
}

function checkPlumageKey(row: TraitRow): string[] {
  const key = row.plumage_key;
  if (key === '') return [];
  if (!KEYED_TRAITS.includes(row.trait)) return ['plumage_key only applies to colour and size'];
  return PLUMAGE_KEYS.includes(key) || MORPH_KEY.test(key) ? [] : [`bad plumage_key "${key}"`];
}

function checkRow(row: TraitRow, speciesIds: ReadonlySet<string>): string[] {
  const problems = [...checkValue(row), ...checkPlumageKey(row)];
  if (!speciesIds.has(row.species_id)) problems.push('unknown species_id');
  if (row.source === '') problems.push('blank source');
  if (!CONFIDENCES.includes(row.confidence)) problems.push(`bad confidence "${row.confidence}"`);
  if (!REVIEW_STATUSES.includes(row.review_status)) {
    problems.push(`bad review_status "${row.review_status}"`);
  }
  return problems;
}

function checkSpecies(id: string, rows: TraitRow[]): string[] {
  const errors: string[] = [];
  const live = rows.filter((r) => r.review_status !== 'rejected');
  const months = live.filter((r) => r.trait === 'month').map((r) => r.value);
  if (months.includes('all') && months.length > 1) {
    errors.push(`${id}: month 'all' cannot be mixed with months 1-12`);
  }
  const colourCounts = new Map<string, number>();
  for (const r of live.filter((x) => x.trait === 'colour')) {
    colourCounts.set(r.plumage_key, (colourCounts.get(r.plumage_key) ?? 0) + 1);
  }
  for (const [key, n] of colourCounts) {
    if (n > MAX_COLOURS) errors.push(`${id}: ${n} colours for plumage "${key}", max ${MAX_COLOURS}`);
  }
  // A commonness row needs a zone row with the same status, so the built file has no dangling zone.
  for (const r of live.filter((x) => x.trait === 'commonness')) {
    const zone = r.value.split(':')[0];
    const hasZone = live.some(
      (z) => z.trait === 'zone' && z.value === zone && z.review_status === r.review_status,
    );
    if (!hasZone) errors.push(`${id}: commonness "${r.value}" has no ${r.review_status} zone row`);
  }
  return errors;
}

function duplicateKey(row: TraitRow): string {
  // One commonness level per zone, so the level is not part of the key.
  const value = row.trait === 'commonness' ? row.value.split(':')[0] : row.value;
  return [row.species_id, row.trait, value, row.plumage_key].join('|');
}

export function validateTraits(csv: string, speciesIds: ReadonlySet<string>): TraitsReport {
  const parsed = parseRows(csv);
  const errors = [...parsed.errors];
  const seen = new Set<string>();
  parsed.rows.forEach((row, i) => {
    const line = i + 2;
    for (const p of checkRow(row, speciesIds)) errors.push(`traits.csv line ${line}: ${row.species_id}: ${p}`);
    const key = duplicateKey(row);
    if (seen.has(key)) errors.push(`traits.csv line ${line}: duplicate row ${key}`);
    seen.add(key);
  });
  for (const id of new Set(parsed.rows.map((r) => r.species_id))) {
    errors.push(...checkSpecies(id, parsed.rows.filter((r) => r.species_id === id)));
  }
  const counts = Object.fromEntries(REVIEW_STATUSES.map((s) => [s, 0]));
  for (const row of parsed.rows) {
    if (row.review_status in counts) counts[row.review_status] = (counts[row.review_status] ?? 0) + 1;
  }
  return { rows: parsed.rows, errors, counts };
}
