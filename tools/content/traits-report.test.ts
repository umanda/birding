import type { LedgerRow } from './traits-ledger';
import {
  countByBatch,
  coverageByQuestion,
  formatTraitsReport,
  speciesWithManyUnknownCore,
} from './traits-report';

function row(species_id: string, batch: string, unknown_traits = ''): LedgerRow {
  return { species_id, batch, unknown_traits, reviewed_by: 'o', reviewed_at: '2026-11-18', note: '' };
}
const rows = [row('a', '0'), row('b', '1', 'zone|month'), row('c', '1', 'commonness|colour:male')];

describe('traits report', () => {
  it('counts reviewed, unknown and not-in-ledger per question', () => {
    const c = coverageByQuestion(rows, 10);
    expect(c.zone).toEqual({ reviewed: 2, unknown: 1, notInLedger: 7 });
    expect(c.commonness).toEqual({ reviewed: 2, unknown: 1, notInLedger: 7 });
    expect(c.colour?.unknown).toBe(0); // a plumage-level unknown is still reviewed overall
  });

  it('counts species per batch', () => {
    expect(countByBatch(rows)).toEqual({ '0': 1, '1': 2 });
  });

  it('flags only species with two or more unknown core questions (commonness excluded)', () => {
    expect(speciesWithManyUnknownCore(rows)).toEqual(['b']);
    expect(speciesWithManyUnknownCore([row('d', '1', 'zone|commonness')])).toEqual([]);
  });

  it('formats short lines, warnings and the size', () => {
    const { lines, warnings } = formatTraitsReport(rows, 10, 3072);
    expect(lines).toHaveLength(3);
    expect(lines[1]).toBe('ledger: 3 species, by batch 0:1 1:2');
    expect(lines[2]).toBe('traits.json: 3.0 KB, 1.00 KB per species');
    expect(warnings).toEqual(['b: 2+ unknown core ID questions']);
  });

  it('handles an empty ledger', () => {
    expect(formatTraitsReport([], 10, 0).lines[2]).toBe('traits.json: 0.0 KB, 0.00 KB per species');
  });
});
