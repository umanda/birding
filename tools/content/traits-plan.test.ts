import { validatePlan } from './traits-plan';
import type { LedgerRow } from './traits-ledger';

const IDS = new Set(['sp-a', 'sp-b']);
const HEADER = 'species_id,batch\n';
const approved = (species_id: string, batch: string): LedgerRow => ({
  species_id,
  batch,
  unknown_traits: '',
  reviewed_by: 'o',
  reviewed_at: '2026-11-18',
  note: '',
});

describe('validatePlan', () => {
  it('accepts planned species, with or without a ledger row', () => {
    expect(validatePlan(`${HEADER}sp-a,0\nsp-b,1\n`, IDS, [approved('sp-a', '0')])).toEqual([]);
  });

  it('rejects an unknown species and a duplicate', () => {
    const errors = validatePlan(`${HEADER}sp-x,1\nsp-a,1\nsp-a,2\n`, IDS, []);
    expect(errors).toEqual(['traits-plan.csv: sp-x: unknown species_id', 'traits-plan.csv: sp-a: duplicate species']);
  });

  it('rejects a batch that differs from the ledger', () => {
    expect(validatePlan(`${HEADER}sp-a,2\n`, IDS, [approved('sp-a', '0')])[0]).toMatch(/batch 2 but the ledger says 0/);
  });

  it('rejects a ledger species that is not planned', () => {
    expect(validatePlan(HEADER, IDS, [approved('sp-a', '0')])).toEqual([
      'traits-plan.csv: sp-a: in the ledger but not planned',
    ]);
  });

  it('rejects a bad batch and a bad header', () => {
    expect(validatePlan(`${HEADER}sp-a,x\n`, IDS, [])[0]).toMatch(/whole number/);
    expect(validatePlan('species_id\n', IDS, [])[0]).toMatch(/header must be/);
  });
});
