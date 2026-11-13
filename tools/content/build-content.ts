import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { readSheet } from 'read-excel-file/node';

const SOURCE_FILE = 'data/source/Sri_Lanka_Birds_Mobile_App_Database_v1.xlsx';
const OUTPUT_FILE = 'content/content.json';

type Cell = string | number | boolean | Date | null;
type Row = Record<string, Cell>;

// Blank means unknown: empty or whitespace-only cells become null. Anything else is kept as-is.
function blankToNull(cell: unknown): Cell {
  if (cell === undefined || cell === null) return null;
  if (typeof cell === 'string' && cell.trim() === '') return null;
  return cell as Cell;
}

async function readTable(file: string, sheet: string): Promise<Row[]> {
  const [header, ...rows] = await readSheet(file, sheet);
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
  const conservationById = new Map(tables.conservation.map((r) => [r.species_id, r]));
  const plateNumberById = new Map(tables.plates.map((r) => [r.plate_id, Number(r.plate_number)]));
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

async function main(): Promise<void> {
  const sha256 = createHash('sha256').update(readFileSync(SOURCE_FILE)).digest('hex');
  const [plates, species, conservation] = await Promise.all(
    ['Plates', 'Species', 'Conservation'].map((sheet) => readTable(SOURCE_FILE, sheet)),
  );
  const content = buildContent(
    { plates: plates ?? [], species: species ?? [], conservation: conservation ?? [] },
    sha256,
  );
  mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  // Pretty-printed: gzip erases the size cost and one-field-per-line diffs keep data reviews readable.
  writeFileSync(OUTPUT_FILE, `${JSON.stringify(content, null, 2)}\n`);
  process.stdout.write(`Wrote ${OUTPUT_FILE}\n`);
}

if (require.main === module) {
  main().catch((error: unknown) => {
    process.stderr.write(`${String(error)}\n`);
    process.exit(1);
  });
}
