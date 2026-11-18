import { ID_QUESTIONS, TRAIT_NAMES } from './traits';
import { parseUnknowns, type LedgerRow } from './traits-ledger';

export const MIN_UNKNOWN_CORE_WARNING = 2;

type QuestionCoverage = { reviewed: number; unknown: number; notInLedger: number };

function wholeUnknowns(row: LedgerRow): string[] {
  return parseUnknowns(row.unknown_traits)
    .filter((u) => u.plumage === undefined)
    .map((u) => u.trait);
}

// Assumes validateLedger passed: a ledger species has each question either reviewed or whole-unknown.
export function coverageByQuestion(
  ledgerRows: LedgerRow[],
  speciesTotal: number,
): Record<string, QuestionCoverage> {
  const notInLedger = speciesTotal - ledgerRows.length;
  return Object.fromEntries(
    TRAIT_NAMES.map((trait) => {
      const unknown = ledgerRows.filter((r) => wholeUnknowns(r).includes(trait)).length;
      return [trait, { reviewed: ledgerRows.length - unknown, unknown, notInLedger }];
    }),
  );
}

export function countByBatch(ledgerRows: LedgerRow[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const r of ledgerRows) counts[r.batch] = (counts[r.batch] ?? 0) + 1;
  return counts;
}

export function speciesWithManyUnknownCore(ledgerRows: LedgerRow[]): string[] {
  return ledgerRows
    .filter((r) => wholeUnknowns(r).filter((t) => ID_QUESTIONS.includes(t)).length >= MIN_UNKNOWN_CORE_WARNING)
    .map((r) => r.species_id);
}

export function formatTraitsReport(
  ledgerRows: LedgerRow[],
  speciesTotal: number,
  jsonBytes: number,
): { lines: string[]; warnings: string[] } {
  const coverage = Object.entries(coverageByQuestion(ledgerRows, speciesTotal)).map(
    ([trait, c]) => `${trait} ${c.reviewed}/${c.unknown}/${c.notInLedger}`,
  );
  const batches = Object.entries(countByBatch(ledgerRows)).map(([b, n]) => `${b}:${n}`);
  const perSpecies = ledgerRows.length === 0 ? 0 : jsonBytes / 1024 / ledgerRows.length;
  const lines = [
    `traits coverage of ${speciesTotal} (reviewed/unknown/not in ledger): ${coverage.join(', ')}`,
    `ledger: ${ledgerRows.length} species, by batch ${batches.join(' ') || 'none'}`,
    `traits.json: ${(jsonBytes / 1024).toFixed(1)} KB, ${perSpecies.toFixed(2)} KB per species`,
  ];
  const many = speciesWithManyUnknownCore(ledgerRows);
  const warnings = many.map((id) => `${id}: ${MIN_UNKNOWN_CORE_WARNING}+ unknown core ID questions`);
  return { lines, warnings };
}
