import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import type { Content } from '../../src/shared/data/content-schema';
import { parseDoubts, parseSensitive, type DoubtRow, type SensitiveRow } from './review-aids';
import { ID_QUESTIONS, TRAIT_NAMES, parseRows, type TraitRow } from './traits';
import { parseLedger, parseUnknowns, type LedgerRow } from './traits-ledger';
import { MIN_UNKNOWN_CORE_WARNING } from './traits-report';

const DATA_DIR = 'data/content';
export const SHEET_DIR = `${DATA_DIR}/traits-review`;

export type SheetInput = {
  content: Content;
  ledger: LedgerRow[];
  traits: TraitRow[];
  doubts: DoubtRow[];
  sensitive: SensitiveRow[];
};

export function sheetPath(batch: string): string {
  return `${SHEET_DIR}/batch-${batch.padStart(2, '0')}.md`;
}

const cell = (text: string): string => text.replace(/\|/g, '/') || '-';

function traitTable(rows: TraitRow[]): string[] {
  const lines = ['| Question | Value | Plumage | Source | Conf. | Status | Note |', '|---|---|---|---|---|---|---|'];
  for (const trait of TRAIT_NAMES) {
    rows
      .filter((r) => r.trait === trait)
      .forEach((r, i) => {
        const cells = [r.value, r.plumage_key, r.source, r.confidence, r.review_status, r.note].map(cell);
        lines.push(`| ${i === 0 ? trait : ''} | ${cells.join(' | ')} |`);
      });
  }
  return lines;
}

function flagsFor(input: SheetInput, ledger: LedgerRow, rows: TraitRow[], code: string): string[] {
  const unknownCore = parseUnknowns(ledger.unknown_traits).filter(
    (u) => u.plumage === undefined && ID_QUESTIONS.includes(u.trait),
  );
  const sensitive = input.sensitive.find((s) => s.species_id === ledger.species_id);
  const flags = [
    code.includes('E') ? 'endemic' : '',
    sensitive ? `sensitive (${sensitive.reason})` : '',
    unknownCore.length >= MIN_UNKNOWN_CORE_WARNING ? `${unknownCore.length} unknown core questions` : '',
  ];
  const low = rows.filter((r) => r.confidence === 'low').length;
  const expert = rows.filter((r) => r.source.startsWith('expert:')).length;
  return [...flags.filter(Boolean), `${low} low-confidence`, `${expert} expert-sourced`];
}

function speciesBlock(input: SheetInput, ledger: LedgerRow): string[] {
  const species = input.content.species.find((s) => s.species_id === ledger.species_id);
  if (!species) return [`## ${ledger.species_id}`, 'Species not found in content.json.'];
  const plate = input.content.plates.find((p) => p.plate_id === species.plate_id);
  const rows = input.traits.filter((r) => r.species_id === ledger.species_id);
  const unknowns = ledger.unknown_traits === '' ? 'none' : ledger.unknown_traits.split('|').join(', ');
  const doubts = input.doubts.filter((d) => d.species_id === ledger.species_id);
  return [
    `## ${species.names.en} / ${species.names.si ?? '(no Sinhala name)'} / *${species.names.scientific}*`,
    '',
    `- Plate ${plate?.plate_number ?? '?'}, slot ${species.plate_order}. Occurrence code: ${species.occurrence_code}. \`${species.species_id}\``,
    `- Flags: ${flagsFor(input, ledger, rows, species.occurrence_code).join('; ')}`,
    `- Unknown: ${unknowns}${ledger.note ? `. Ledger note: ${ledger.note}` : ''}`,
    ...doubts.map((d) => `- Workbook doubt (${d.field}): ${d.doubt}${d.suggested_source ? ` Check: ${d.suggested_source}` : ''}`),
    '',
    ...traitTable(rows),
    '',
  ];
}

export function renderBatchSheet(batch: string, input: SheetInput): string {
  const ids = input.ledger.filter((l) => l.batch === batch).map((l) => l.species_id);
  const order = new Map(input.content.species.map((s, i) => [s.species_id, i]));
  const rows = input.ledger
    .filter((l) => l.batch === batch)
    .sort((a, b) => (order.get(a.species_id) ?? 0) - (order.get(b.species_id) ?? 0));
  const header = [
    `# Traits review: batch ${batch}`,
    '',
    `Generated from traits.csv, traits-batches.csv, workbook-doubts.csv and sensitive-species.csv. Do not edit by hand: run \`npm run traits:review-sheet -- --batch ${Number(batch)}\`.`,
    `${ids.length} species. Review every row. Zones: wet_lowland, wet_midhill, montane, intermediate, dry_lowland, arid_coast_north.`,
    '',
  ];
  return [...header, ...rows.flatMap((l) => speciesBlock(input, l))].join('\n');
}

function readCsv(name: string): string {
  return readFileSync(`${DATA_DIR}/${name}`, 'utf8');
}

export function loadSheetInput(): SheetInput {
  return {
    content: JSON.parse(readFileSync('content/content.json', 'utf8')) as Content,
    ledger: parseLedger(readCsv('traits-batches.csv')).rows,
    traits: parseRows(readCsv('traits.csv')).rows,
    doubts: parseDoubts(readCsv('workbook-doubts.csv')).rows,
    sensitive: parseSensitive(readCsv('sensitive-species.csv')).rows,
  };
}

// Every batch in the ledger must have a committed sheet equal to a fresh one.
export function checkReviewSheets(input: SheetInput): string[] {
  const batches = [...new Set(input.ledger.map((l) => l.batch))];
  return batches.flatMap((batch) => {
    const file = sheetPath(batch);
    if (!existsSync(file)) return [`${file}: missing, run npm run traits:review-sheet -- --batch ${Number(batch)}`];
    const committed = readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
    return committed === renderBatchSheet(batch, input)
      ? []
      : [`${file}: out of date, run npm run traits:review-sheet -- --batch ${Number(batch)}`];
  });
}

function main(): void {
  const flag = process.argv.indexOf('--batch');
  const batch = process.argv[flag + 1];
  if (flag < 0 || batch === undefined || !/^\d+$/.test(batch)) {
    process.stderr.write('usage: npm run traits:review-sheet -- --batch N\n');
    process.exit(1);
  }
  const input = loadSheetInput();
  mkdirSync(SHEET_DIR, { recursive: true });
  const file = sheetPath(batch);
  writeFileSync(file, renderBatchSheet(String(Number(batch)), input));
  process.stdout.write(`Wrote ${file}\n`);
}

if (require.main === module) main();
