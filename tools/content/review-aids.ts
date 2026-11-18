import { parse } from 'csv-parse/sync';
import { z } from 'zod';

// Sensitivity values follow docs/product/02-identification-design.md section 6.
export const SENSITIVITY_REASONS = ['obscure_location', 'never_show_location', 'trade_targeted'] as const;

const DoubtSchema = z.object({
  species_id: z.string().min(1),
  field: z.string().min(1),
  doubt: z.string().min(1),
  suggested_source: z.string(), // blank means no source suggested yet
});
const SensitiveSchema = z.object({
  species_id: z.string().min(1),
  reason: z.enum(SENSITIVITY_REASONS),
});
export type DoubtRow = z.infer<typeof DoubtSchema>;
export type SensitiveRow = z.infer<typeof SensitiveSchema>;

type Parsed<T> = { rows: T[]; errors: string[] };

function parseCsv<T>(name: string, csv: string, schema: z.ZodType<T>, columns: string[]): Parsed<T> {
  let table: string[][];
  try {
    table = parse(csv, { skip_empty_lines: true, bom: true });
  } catch (error) {
    return { rows: [], errors: [`${name} cannot be parsed: ${(error as Error).message}`] };
  }
  const [header = [], ...records] = table;
  if (header.join(',') !== columns.join(',')) {
    return { rows: [], errors: [`${name} header must be: ${columns.join(',')}`] };
  }
  const result: Parsed<T> = { rows: [], errors: [] };
  records.forEach((record, i) => {
    const parsed = schema.safeParse(Object.fromEntries(header.map((k, col) => [k, record[col] ?? ''])));
    if (parsed.success) result.rows.push(parsed.data);
    else result.errors.push(...parsed.error.issues.map((x) => `${name} line ${i + 2}: ${x.path.join('.')}: ${x.message}`));
  });
  return result;
}

export function parseDoubts(csv: string): Parsed<DoubtRow> {
  return parseCsv('workbook-doubts.csv', csv, DoubtSchema, Object.keys(DoubtSchema.shape));
}

export function parseSensitive(csv: string): Parsed<SensitiveRow> {
  return parseCsv('sensitive-species.csv', csv, SensitiveSchema, Object.keys(SensitiveSchema.shape));
}

function checkKeys(name: string, keys: { id: string; key: string }[], speciesIds: ReadonlySet<string>): string[] {
  const seen = new Set<string>();
  return keys.flatMap(({ id, key }) => {
    const problems: string[] = [];
    if (!speciesIds.has(id)) problems.push('unknown species_id');
    if (seen.has(key)) problems.push('duplicate row');
    seen.add(key);
    return problems.map((p) => `${name}: ${key}: ${p}`);
  });
}

export function validateDoubts(csv: string, speciesIds: ReadonlySet<string>): string[] {
  const { rows, errors } = parseDoubts(csv);
  const keys = rows.map((r) => ({ id: r.species_id, key: `${r.species_id}+${r.field}` }));
  return [...errors, ...checkKeys('workbook-doubts.csv', keys, speciesIds)];
}

export function validateSensitive(csv: string, speciesIds: ReadonlySet<string>): string[] {
  const { rows, errors } = parseSensitive(csv);
  const keys = rows.map((r) => ({ id: r.species_id, key: r.species_id }));
  return [...errors, ...checkKeys('sensitive-species.csv', keys, speciesIds)];
}
