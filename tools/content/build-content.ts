import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { readSheet } from 'read-excel-file/node';
import { buildSpeciesText } from './species-text';

const SOURCE_FILE = 'data/source/Sri_Lanka_Birds_Mobile_App_Database_v1.xlsx';
const OUTPUT_FILE = 'content/content.json';
const TEXT_OUTPUT_FILE = 'content/species-text.json';
const PLACEHOLDERS_FILE = 'data/content/text-placeholders.csv';
const OVERRIDES_FILE = 'data/content/text-lang-overrides.csv';

type Cell = string | number | boolean | Date | null;
type Row = Record<string, Cell>;

// Blank means unknown: empty or whitespace-only cells become null. Other cells are kept byte-for-byte.
export function blankToNull(cell: unknown): Cell {
  if (cell === undefined || cell === null) return null;
  if (typeof cell === 'string' && cell.trim() === '') return null;
  return cell as Cell;
}

async function readTable(file: string, sheet: string): Promise<Row[]> {
  const [header, ...rows] = await readSheet(file, sheet, { trim: false });
  if (!header) throw new Error(`Sheet "${sheet}" is empty`);
  return rows.map((row) =>
    Object.fromEntries(header.map((name, i) => [String(name), blankToNull(row[i])])),
  );
}

// Values are passed through untyped on purpose: the zod schema is the single gatekeeper.
export function buildContent(
  tables: { plates: Row[]; species: Row[]; conservation: Row[] },
  sha256: string,
): unknown {
  const conservationById = new Map<unknown, Row>();
  for (const row of tables.conservation) {
    if (conservationById.has(row.species_id)) {
      throw new Error(`Duplicate Conservation row for species_id: ${String(row.species_id)}`);
    }
    conservationById.set(row.species_id, row);
  }
  const plateNumberById = new Map<unknown, number>(
    tables.plates.map((r) => [r.plate_id, Number(r.plate_number)]),
  );
  const byPlateThenOrder = (a: Row, b: Row): number =>
    (plateNumberById.get(a.plate_id) ?? 0) - (plateNumberById.get(b.plate_id) ?? 0) ||
    Number(a.plate_order) - Number(b.plate_order);

  const plates = [...tables.plates]
    .sort((a, b) => Number(a.plate_number) - Number(b.plate_number))
    .map((r) => ({
      plate_id: r.plate_id,
      plate_number: r.plate_number,
      title: { en: r.plate_english_title, si: r.plate_sinhala_title },
    }));
  const species = [...tables.species].sort(byPlateThenOrder).map((r) => {
    const conservation = conservationById.get(r.species_id);
    return {
      species_id: r.species_id,
      plate_id: r.plate_id,
      plate_order: r.plate_order,
      names: { en: r.english_name, si: r.sinhala_name, scientific: r.accepted_scientific_name },
      occurrence_code: conservation?.sri_lanka_occurrence_code ?? null,
      iucn_category: conservation?.iucn_category_working ?? null,
    };
  });
  return {
    schema_version: 1,
    source_file: path.basename(SOURCE_FILE),
    source_sha256: sha256,
    plates,
    species,
  };
}

// Pretty-printed: gzip erases the size cost and one-field-per-line diffs keep data reviews readable.
function writeJson(file: string, data: unknown): void {
  writeFileSync(file, `${JSON.stringify(data, null, 2)}
`);
  process.stdout.write(`Wrote ${file}
`);
}

async function main(): Promise<void> {
  const sha256 = createHash('sha256').update(readFileSync(SOURCE_FILE)).digest('hex');
  const plates = await readTable(SOURCE_FILE, 'Plates');
  const species = await readTable(SOURCE_FILE, 'Species');
  const conservation = await readTable(SOURCE_FILE, 'Conservation');
  const content = buildContent({ plates, species, conservation }, sha256);
  const text = buildSpeciesText(
    {
      identification: await readTable(SOURCE_FILE, 'Identification'),
      distribution: await readTable(SOURCE_FILE, 'Distribution'),
      conservation,
      sources: await readTable(SOURCE_FILE, 'Species Sources'),
    },
    {
      placeholdersCsv: readFileSync(PLACEHOLDERS_FILE, 'utf8'),
      overridesCsv: readFileSync(OVERRIDES_FILE, 'utf8'),
    },
  );
  mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  writeJson(OUTPUT_FILE, content);
  writeJson(TEXT_OUTPUT_FILE, text);
}

if (require.main === module) {
  main().catch((error: unknown) => {
    process.stderr.write(`${String(error)}\n`);
    process.exit(1);
  });
}
