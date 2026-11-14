import { z } from 'zod';

export const TEXT_FIELDS = [
  'species_description',
  'male_female_identification',
  'juvenile_immature_plumage',
  'field_spotting_tips',
  'sri_lanka_distribution_and_hotspots',
  'seasonality_months_seen',
] as const;

export type TextField = (typeof TEXT_FIELDS)[number];
export type TextLang = 'si' | 'en';
type Row = Record<string, unknown>;
type Key = `${string}|${string}`;

// Language rule: count letters only (digits, punctuation, spaces, ZWJ and combining marks are
// ignored). Sinhala prose often embeds Latin terms and names, so any real Sinhala text decides:
// 'si' if at least SI_MIN of the letters are in the Sinhala block, 'en' if there are none.
// A trace (0 < share < SI_MIN) is ambiguous and needs a manual override. In workbook v1.0 every
// Sinhala cell is >= 33% and every English cell is exactly 0%, so nothing is ambiguous.
const SINHALA_LETTER = /[඀-෿]/u;
const ANY_LETTER = /\p{L}/gu;
const SI_MIN = 0.2;

export function detectLang(text: string): TextLang | 'ambiguous' {
  const letters = text.match(ANY_LETTER) ?? [];
  const sinhala = letters.filter((c) => SINHALA_LETTER.test(c)).length;
  if (sinhala === 0) return 'en';
  return sinhala / letters.length >= SI_MIN ? 'si' : 'ambiguous';
}

// Minimal CSV for our own lists: a header line, no quoted commas, no multi-line cells.
export function parseList(csv: string, columns: string[]): string[][] {
  const [header, ...lines] = csv.split(/\r?\n/).filter((l) => l.trim() !== '');
  if (header?.trim() !== columns.join(',')) throw new Error(`List header must be ${columns.join(',')}`);
  return lines.map((line) => {
    const cells = line.split(',').map((c) => c.trim());
    if (cells.length < columns.length) throw new Error(`Bad list line: ${line}`);
    return cells;
  });
}

const keyOf = (id: string, field: string): Key => `${id}|${field}`;

// reason (3rd column) is for reviewers only.
function placeholderKeys(csv: string): Set<Key> {
  return new Set(parseList(csv, ['species_id', 'field', 'reason']).map(([id = '', f = '']) => keyOf(id, f)));
}

function overrideLangs(csv: string): Map<Key, TextLang> {
  const rows = parseList(csv, ['species_id', 'field', 'lang']);
  return new Map(
    rows.map(([id = '', f = '', lang]) => {
      if (lang !== 'si' && lang !== 'en') throw new Error(`Bad override lang for ${id}|${f}`);
      return [keyOf(id, f), lang];
    }),
  );
}

type Lists = { placeholdersCsv: string; overridesCsv: string };
type FieldValue = { text: string; lang: TextLang } | null;

export function buildSpeciesText(
  tables: { identification: Row[]; distribution: Row[] },
  lists: Lists,
): unknown {
  const placeholders = placeholderKeys(lists.placeholdersCsv);
  const overrides = overrideLangs(lists.overridesCsv);
  const used = new Set<Key>();
  const species: Record<string, Record<string, FieldValue>> = {};

  const tag = (id: string, field: string, cell: unknown): FieldValue => {
    const key = keyOf(id, field);
    if (placeholders.has(key)) {
      used.add(key);
      return null;
    }
    if (typeof cell !== 'string' || cell.trim() === '') return null; // blank stays null
    const detected = detectLang(cell);
    const lang = overrides.get(key) ?? detected;
    if (overrides.has(key)) used.add(key);
    if (lang === 'ambiguous') throw new Error(`Ambiguous-language cell ${id}|${field}: add a lang override`);
    return { text: cell, lang };
  };

  for (const row of [...tables.identification, ...tables.distribution]) {
    const id = String(row.species_id);
    const fields = TEXT_FIELDS.filter((f) => f in row);
    species[id] ??= {};
    for (const field of fields) {
      if (field in species[id]) throw new Error(`Duplicate text row for ${id}|${field}`);
      species[id][field] = tag(id, field, row[field]);
    }
  }
  for (const key of [...placeholders, ...overrides.keys()]) {
    if (!used.has(key)) throw new Error(`List entry matches no cell: ${key}`);
  }
  const sorted = Object.fromEntries(Object.entries(species).sort(([a], [b]) => (a < b ? -1 : 1)));
  return { schema_version: 2, species: sorted };
}

const TextValueSchema = z.object({ text: z.string().min(1), lang: z.enum(['si', 'en']) }).nullable();
export const SpeciesTextSchema = z.object({
  schema_version: z.literal(2),
  species: z.record(z.string(), z.object(Object.fromEntries(TEXT_FIELDS.map((f) => [f, TextValueSchema])))),
});
