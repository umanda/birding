import { readFileSync } from 'node:fs';
import { validateDoubts, validateSensitive } from './review-aids';

const IDS = new Set(['sp-a', 'sp-b']);
const DOUBTS = 'species_id,field,doubt,suggested_source\n';
const SENSITIVE = 'species_id,reason\n';

describe('validateDoubts', () => {
  it('accepts a row with a blank suggested_source', () => {
    expect(validateDoubts(`${DOUBTS}sp-a,species_description,odd text,\n`, IDS)).toEqual([]);
  });

  it('rejects an unknown species', () => {
    expect(validateDoubts(`${DOUBTS}sp-x,f,d,\n`, IDS)[0]).toMatch(/sp-x\+f: unknown species_id/);
  });

  it('rejects a blank doubt', () => {
    expect(validateDoubts(`${DOUBTS}sp-a,f,,\n`, IDS)[0]).toMatch(/line 2: doubt/);
  });

  it('rejects the same species and field twice, but allows another field', () => {
    expect(validateDoubts(`${DOUBTS}sp-a,f,d,\nsp-a,g,d,\nsp-a,f,e,\n`, IDS)).toEqual([
      'workbook-doubts.csv: sp-a+f: duplicate row',
    ]);
  });

  it('rejects a wrong header', () => {
    expect(validateDoubts('species_id,field\n', IDS)[0]).toMatch(/header must be/);
  });
});

describe('validateSensitive', () => {
  it('accepts a known reason', () => {
    expect(validateSensitive(`${SENSITIVE}sp-a,trade_targeted\n`, IDS)).toEqual([]);
  });

  it('rejects an unknown species, a duplicate and a bad reason', () => {
    const csv = `${SENSITIVE}sp-x,obscure_location\nsp-a,obscure_location\nsp-a,obscure_location\nsp-b,secret\n`;
    const errors = validateSensitive(csv, IDS);
    expect(errors).toEqual(
      expect.arrayContaining([
        'sensitive-species.csv: sp-x: unknown species_id',
        'sensitive-species.csv: sp-a: duplicate row',
        expect.stringMatching(/line 5: reason/),
      ]),
    );
  });
});

describe('committed review aids', () => {
  const content = JSON.parse(readFileSync('content/content.json', 'utf8')) as { species: { species_id: string }[] };
  const ids = new Set(content.species.map((s) => s.species_id));

  it('workbook-doubts.csv is valid', () => {
    expect(validateDoubts(readFileSync('data/content/workbook-doubts.csv', 'utf8'), ids)).toEqual([]);
  });

  it('sensitive-species.csv is valid', () => {
    expect(validateSensitive(readFileSync('data/content/sensitive-species.csv', 'utf8'), ids)).toEqual([]);
  });
});
