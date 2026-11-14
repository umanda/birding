import { CONSERVATION_FIELDS, TEXT_FIELDS } from '../../src/shared/data/species-text-schema';
import type { Conservation, SpeciesSource, TextLang } from '../../src/shared/data/species-text-schema';

type Row = Record<string, unknown>;
type Key = `${string}|${string}`;

// Language rule: count letters only (digits, punctuation, spaces, ZWJ and combining marks are
// ignored). Sinhala prose often embeds Latin terms and names, so any real Sinhala text decides:
// 'si' if at least SI_MIN of the letters are in the Sinhala block, 'en' if there are none and
// at least one Latin letter exists (a cell with no letters at all is ambiguous).
// A trace (0 < share < SI_MIN) is ambiguous and needs a manual override. In workbook v1.0 every
// Sinhala cell is >= 33% and every English cell is exactly 0%, so nothing is ambiguous.
const SINHALA_LETTER = /[඀-෿]/u;
const ANY_LETTER = /\p{L}/gu;
const LATIN_LETTER = /[A-Za-z]/;
const SI_MIN = 0.2;

export function detectLang(text: string): TextLang | 'ambiguous' {
  const letters = text.match(ANY_LETTER) ?? [];
  const sinhala = letters.filter((c) => SINHALA_LETTER.test(c)).length;
  if (sinhala === 0) return LATIN_LETTER.test(text) ? 'en' : 'ambiguous';
  return sinhala / letters.length >= SI_MIN ? 'si' : 'ambiguous';
}

// Minimal CSV for our own lists: a header line, exactly one cell per column. Quotes and commas
// inside cells are not supported (use plain words in the reason column) and are rejected.
export function parseList(csv: string, columns: string[]): string[][] {
  const [header, ...lines] = csv.split(/\r?\n/).filter((l) => l.trim() !== '');
  if (header?.trim() !== columns.join(',')) throw new Error(`List header must be ${columns.join(',')}`);
  return lines.map((line) => {
    const cells = line.split(',').map((c) => c.trim());
    if (line.includes('"') || cells.length !== columns.length) throw new Error(`Bad list line: ${line}`);
    return cells;
  });
}

const keyOf = (id: string, field: string): Key => `${id}|${field}`;

// Tied to workbook v1.0: re-review the placeholder list whenever source_sha256 changes.
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

const URL_IN_TEXT = /https?:\/\/\S+/g;
const TRAILING_PUNCTUATION = /[.,;:)\]]+$/;

// Only the extracted link is trimmed; the citation keeps every character.
export function extractLinks(citation: string): string[] {
  return (citation.match(URL_IN_TEXT) ?? []).map((l) => l.replace(TRAILING_PUNCTUATION, ''));
}

const blankToNull = (cell: unknown): string | null =>
  typeof cell === 'string' && cell.trim() !== '' ? cell : null;

const idOf = (row: Row, sheet: string): string => {
  const id = typeof row.species_id === 'string' ? row.species_id.trim() : '';
  if (id === '') throw new Error(`${sheet} row has a blank species_id`);
  return id;
};

// Values are copied verbatim (numbers from the workbook become text); blank is null.
function toConservation(row: Row): Conservation {
  const text = (v: unknown): string | null => (typeof v === 'number' ? String(v) : blankToNull(v));
  return Object.fromEntries(CONSERVATION_FIELDS.map((f) => [f, text(row[f])])) as Conservation;
}

function groupConservation(rows: Row[]): Map<string, Conservation> {
  const byId = new Map<string, Conservation>();
  for (const row of rows) {
    const id = idOf(row, 'Conservation');
    if (byId.has(id)) throw new Error(`Duplicate Conservation row for ${id}`);
    byId.set(id, toConservation(row));
  }
  return byId;
}

// One entry per source_id, grouped by species and sorted by source_id.
function groupSources(rows: Row[]): Map<string, SpeciesSource[]> {
  const seen = new Set<string>();
  const byId = new Map<string, SpeciesSource[]>();
  for (const row of rows) {
    const speciesId = idOf(row, 'Species Sources');
    const sourceId = blankToNull(row.source_id);
    const citation = blankToNull(row.source_url);
    if (sourceId === null || citation === null) throw new Error(`Blank source_id or source_url for ${speciesId}`);
    if (seen.has(sourceId)) throw new Error(`Duplicate source_id ${sourceId}`);
    seen.add(sourceId);
    byId.set(speciesId, [...(byId.get(speciesId) ?? []), { source_id: sourceId, citation, links: extractLinks(citation), type: blankToNull(row.source_type) }]);
  }
  for (const list of byId.values()) list.sort((a, b) => (a.source_id < b.source_id ? -1 : 1));
  return byId;
}

type Lists = { placeholdersCsv: string; overridesCsv: string };
type FieldValue = { text: string; lang: TextLang } | null;

export function buildSpeciesText(
  tables: { identification: Row[]; distribution: Row[]; conservation: Row[]; sources: Row[] },
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
    const override = overrides.get(key);
    if (override !== undefined) {
      if (detected !== 'ambiguous') throw new Error(`Unneeded override: ${key} is not ambiguous`);
      used.add(key);
    }
    const lang = override ?? detected;
    if (lang === 'ambiguous') throw new Error(`Ambiguous-language cell ${id}|${field}: add a lang override`);
    return { text: cell, lang };
  };

  for (const row of [...tables.identification, ...tables.distribution]) {
    const id = typeof row.species_id === 'string' ? row.species_id.trim() : '';
    if (id === '') throw new Error('Text row has a blank species_id');
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
  const conservation = groupConservation(tables.conservation);
  const sources = groupSources(tables.sources);
  for (const id of [...conservation.keys(), ...sources.keys()]) {
    if (!(id in species)) throw new Error(`Conservation or source row for unknown species ${id}`);
  }
  const records = Object.keys(species).map((id) => {
    const cons = conservation.get(id);
    if (cons === undefined) throw new Error(`No Conservation row for ${id}`);
    return [id, { ...species[id], conservation: cons, sources: sources.get(id) ?? [] }] as const;
  });
  const sorted = Object.fromEntries(records.sort(([a], [b]) => (a < b ? -1 : 1)));
  return { schema_version: 3, species: sorted };
}
