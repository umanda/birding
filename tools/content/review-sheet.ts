import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import type { Content } from '../../src/shared/data/content-schema';
import { parseDoubts, parseSensitive, type DoubtRow, type SensitiveRow } from './review-aids';
import { ID_QUESTIONS, TRAIT_NAMES, parseRows, type TraitRow } from './traits';
import { parseLedger, parseUnknowns, type LedgerRow } from './traits-ledger';
import { parsePlan, type PlanRow } from './traits-plan';
import { MIN_UNKNOWN_CORE_WARNING } from './traits-report';

const DATA_DIR = 'data/content';
export const SHEET_DIR = `${DATA_DIR}/traits-review`;
const SHEET_FILE = /^batch-(\d+)\.md$/;

export type SheetInput = {
  content: Content;
  plan: PlanRow[];
  ledger: LedgerRow[];
  traits: TraitRow[];
  doubts: DoubtRow[];
  sensitive: SensitiveRow[];
};

export function sheetPath(batch: string): string {
  return `${SHEET_DIR}/batch-${String(Number(batch)).padStart(2, '0')}.md`;
}

const cell = (text: string): string => text.replace(/\|/g, '/').replace(/\r?\n/g, ' ') || '-';

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

function flagsFor(input: SheetInput, id: string, ledger: LedgerRow | undefined, rows: TraitRow[], code: string): string[] {
  const unknownCore = parseUnknowns(ledger?.unknown_traits ?? '').filter(
    (u) => u.plumage === undefined && ID_QUESTIONS.includes(u.trait),
  );
  const sensitive = input.sensitive.find((s) => s.species_id === id);
  const flags = [
    code.includes('E') ? 'endemic' : '',
    sensitive ? `sensitive (${sensitive.reason})` : '',
    unknownCore.length >= MIN_UNKNOWN_CORE_WARNING ? `${unknownCore.length} unknown core questions` : '',
  ];
  const low = rows.filter((r) => r.confidence === 'low').length;
  const expert = rows.filter((r) => r.source.startsWith('expert:')).length;
  return [...flags.filter(Boolean), `${low} low-confidence`, `${expert} expert-sourced`];
}

// Before approval there is no ledger row, so unknowns and notes are not known yet.
function unknownLine(ledger: LedgerRow | undefined): string {
  if (!ledger) return '- Unknown: not in the ledger yet (awaiting approval)';
  const unknowns = ledger.unknown_traits === '' ? 'none' : ledger.unknown_traits.split('|').join(', ');
  return `- Unknown: ${unknowns}${ledger.note ? `. Ledger note: ${ledger.note}` : ''}`;
}

function speciesBlock(input: SheetInput, id: string): string[] {
  const ledger = input.ledger.find((l) => l.species_id === id);
  const species = input.content.species.find((s) => s.species_id === id);
  if (!species) return [`## ${id}`, 'Species not found in content.json.'];
  const plate = input.content.plates.find((p) => p.plate_id === species.plate_id);
  const rows = input.traits.filter((r) => r.species_id === id);
  const doubts = input.doubts.filter((d) => d.species_id === id);
  return [
    `## ${species.names.en} / ${species.names.si ?? '(no Sinhala name)'} / *${species.names.scientific}*`,
    '',
    `- Plate ${plate?.plate_number ?? '?'}, slot ${species.plate_order}. Occurrence code: ${species.occurrence_code}. \`${id}\``,
    `- Flags: ${flagsFor(input, id, ledger, rows, species.occurrence_code).join('; ')}`,
    unknownLine(ledger),
    ...doubts.map((d) => `- Workbook doubt (${d.field}): ${d.doubt}${d.suggested_source ? ` Check: ${d.suggested_source}` : ''}`),
    '',
    ...traitTable(rows),
    '',
  ];
}

export function renderBatchSheet(batch: string, input: SheetInput): string {
  const order = new Map(input.content.species.map((s, i) => [s.species_id, i]));
  const ids = input.plan
    .filter((p) => Number(p.batch) === Number(batch))
    .map((p) => p.species_id)
    .sort((a, b) => (order.get(a) ?? 0) - (order.get(b) ?? 0));
  const n = Number(batch);
  const header = [
    `# Traits review: batch ${n}`,
    '',
    `Generated from traits.csv, traits-plan.csv, traits-batches.csv, workbook-doubts.csv and sensitive-species.csv. Do not edit by hand: run \`npm run traits:review-sheet -- --batch ${n}\`.`,
    `${ids.length} species. Review every row. Zones: wet_lowland, wet_midhill, montane, intermediate, dry_lowland, arid_coast_north.`,
    '',
  ];
  return [...header, ...ids.flatMap((id) => speciesBlock(input, id))].join('\n');
}

function readCsv(name: string): string {
  return readFileSync(`${DATA_DIR}/${name}`, 'utf8');
}

export function loadSheetInput(): SheetInput {
  return {
    content: JSON.parse(readFileSync('content/content.json', 'utf8')) as Content,
    plan: parsePlan(readCsv('traits-plan.csv')).rows,
    ledger: parseLedger(readCsv('traits-batches.csv')).rows,
    traits: parseRows(readCsv('traits.csv')).rows,
    doubts: parseDoubts(readCsv('workbook-doubts.csv')).rows,
    sensitive: parseSensitive(readCsv('sensitive-species.csv')).rows,
  };
}

// Every planned batch needs a committed sheet equal to a fresh one, and no sheet may lack a plan.
export function checkReviewSheets(input: SheetInput): string[] {
  const batches = [...new Set(input.plan.map((p) => String(Number(p.batch))))];
  const errors = batches.flatMap((batch) => {
    const file = sheetPath(batch);
    const fix = `run npm run traits:review-sheet -- --batch ${batch}`;
    if (!existsSync(file)) return [`${file}: missing, ${fix}`];
    const committed = readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
    return committed === renderBatchSheet(batch, input) ? [] : [`${file}: out of date, ${fix}`];
  });
  const files = existsSync(SHEET_DIR) ? readdirSync(SHEET_DIR) : [];
  for (const name of files) {
    const match = SHEET_FILE.exec(name);
    if (match && !batches.includes(String(Number(match[1])))) {
      errors.push(`${SHEET_DIR}/${name}: no planned batch in traits-plan.csv`);
    }
  }
  return errors;
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
  writeFileSync(file, renderBatchSheet(batch, input));
  process.stdout.write(`Wrote ${file}\n`);
}

if (require.main === module) main();
