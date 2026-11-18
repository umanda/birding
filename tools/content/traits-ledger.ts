import { parse } from 'csv-parse/sync';
import { z } from 'zod';
import {
  ID_QUESTIONS,
  KEYED_TRAITS,
  MORPH_KEY,
  PLUMAGE_KEYS,
  TRAIT_NAMES,
  type TraitRow,
} from './traits';

export const LEDGER_COLUMNS = [
  'species_id',
  'batch',
  'unknown_traits',
  'reviewed_by',
  'reviewed_at',
  'note',
] as const;

// Blank unknown_traits and note are allowed; reviewer and date are not (spec 006).
const LedgerRowSchema = z.object({
  species_id: z.string().min(1),
  batch: z.string().regex(/^\d+$/, 'batch must be a whole number'),
  unknown_traits: z.string(),
  reviewed_by: z.string().min(1, 'blank reviewed_by'),
  reviewed_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'reviewed_at must be YYYY-MM-DD'),
  note: z.string(),
});
export type LedgerRow = z.infer<typeof LedgerRowSchema>;
export type Ledger = { rows: LedgerRow[]; errors: string[] };

export function parseLedger(csv: string): Ledger {
  let table: string[][];
  try {
    table = parse(csv, { skip_empty_lines: true, bom: true });
  } catch (error) {
    return { rows: [], errors: [`traits-batches.csv cannot be parsed: ${(error as Error).message}`] };
  }
  const [header = [], ...records] = table;
  if (header.join(',') !== LEDGER_COLUMNS.join(',')) {
    return { rows: [], errors: [`traits-batches.csv header must be: ${LEDGER_COLUMNS.join(',')}`] };
  }
  const rows: LedgerRow[] = [];
  const errors: string[] = [];
  records.forEach((record, i) => {
    const parsed = LedgerRowSchema.safeParse(
      Object.fromEntries(header.map((k, col) => [k, record[col] ?? ''])),
    );
    const where = `traits-batches.csv line ${i + 2}`;
    if (parsed.success) rows.push(parsed.data);
    else errors.push(...parsed.error.issues.map((x) => `${where}: ${x.path.join('.')}: ${x.message}`));
  });
  return { rows, errors };
}

type Unknown = { trait: string; plumage: string | undefined };

function parseUnknowns(list: string): Unknown[] {
  if (list === '') return [];
  return list.split('|').map((entry) => {
    const [trait = '', ...rest] = entry.split(':');
    const plumage = rest.length > 0 ? rest.join(':') : undefined;
    return { trait, plumage };
  });
}

function checkUnknownName({ trait, plumage }: Unknown): string[] {
  if (!TRAIT_NAMES.includes(trait)) return [`unknown trait "${trait}" in unknown_traits`];
  if (plumage === undefined) return [];
  if (!KEYED_TRAITS.includes(trait)) return [`${trait}:${plumage}: plumage only applies to colour and size`];
  return PLUMAGE_KEYS.includes(plumage) || MORPH_KEY.test(plumage)
    ? []
    : [`${trait}:${plumage}: bad plumage key`];
}

// Each trait is covered by reviewed rows or listed as unknown, never neither and never both.
function checkCoverage(unknowns: Unknown[], reviewed: TraitRow[]): string[] {
  const errors: string[] = [];
  for (const trait of TRAIT_NAMES) {
    const rows = reviewed.filter((r) => r.trait === trait);
    const wholeUnknown = unknowns.some((u) => u.trait === trait && u.plumage === undefined);
    if (rows.length === 0 && !wholeUnknown) errors.push(`${trait} has no reviewed row and is not unknown`);
    if (rows.length > 0 && wholeUnknown) errors.push(`${trait} is unknown but has reviewed rows`);
  }
  for (const { trait, plumage } of unknowns.filter((u) => u.plumage !== undefined)) {
    const rows = reviewed.filter((r) => r.trait === trait);
    if (rows.length === 0) errors.push(`${trait}:${plumage} needs the whole trait, or reviewed rows`);
    if (rows.some((r) => r.plumage_key === plumage)) {
      errors.push(`${trait}:${plumage} is unknown but has reviewed rows`);
    }
  }
  return errors;
}

function checkLedgerRow(row: LedgerRow, reviewed: TraitRow[]): string[] {
  const unknowns = parseUnknowns(row.unknown_traits);
  const names = unknowns.flatMap(checkUnknownName);
  if (names.length > 0) return names;
  const whole = unknowns.filter((u) => u.plumage === undefined).map((u) => u.trait);
  const errors = checkCoverage(unknowns, reviewed);
  if (ID_QUESTIONS.every((q) => whole.includes(q))) errors.push('all six ID questions are unknown');
  if (new Set(unknowns.map((u) => `${u.trait}:${u.plumage}`)).size < unknowns.length) {
    errors.push('duplicate entry in unknown_traits');
  }
  return errors;
}

export function validateLedger(
  ledger: Ledger,
  speciesIds: ReadonlySet<string>,
  traitRows: TraitRow[],
): string[] {
  const errors = [...ledger.errors];
  const listed = new Set<string>();
  for (const row of ledger.rows) {
    const id = row.species_id;
    const problems: string[] = [];
    if (!speciesIds.has(id)) problems.push('unknown species_id');
    if (listed.has(id)) problems.push('duplicate species in ledger');
    listed.add(id);
    const reviewed = traitRows.filter((r) => r.species_id === id && r.review_status === 'reviewed');
    problems.push(...checkLedgerRow(row, reviewed));
    errors.push(...problems.map((p) => `traits-batches.csv: ${id}: ${p}`));
  }
  // Rows for a species outside the ledger would be dropped from traits.json without a word.
  const unlisted = new Set(
    traitRows.filter((r) => r.review_status === 'reviewed' && !listed.has(r.species_id)).map((r) => r.species_id),
  );
  for (const id of unlisted) errors.push(`traits-batches.csv: ${id}: has reviewed rows but is not in the ledger`);
  return errors;
}
