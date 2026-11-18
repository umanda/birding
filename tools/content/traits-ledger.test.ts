import { readFileSync } from 'node:fs';
import { TRAITS_COLUMNS, validateTraits, ID_QUESTIONS, TRAIT_NAMES } from './traits';
import { LEDGER_COLUMNS, parseLedger, validateLedger } from './traits-ledger';

const IDS = new Set(['sp-a', 'sp-b']);
const LEDGER_HEADER = LEDGER_COLUMNS.join(',');
const TRAITS_HEADER = TRAITS_COLUMNS.join(',');
const VALUES: Record<string, string> = {
  zone: 'montane',
  habitat: 'forest',
  size: 'M',
  colour: 'red',
  behaviour: 'ground',
  month: 'all',
  commonness: 'montane:common',
};

// One reviewed row for every trait except those listed; extra rows are full CSV lines.
function traitsCsv(skip: string[] = [], ...extra: string[]): string {
  const lines = TRAIT_NAMES.filter((t) => !skip.includes(t)).map(
    (t) => `sp-a,${t},${VALUES[t]},,expert:x,high,reviewed,`,
  );
  return [TRAITS_HEADER, ...lines, ...extra].join('\n');
}

function check(unknown: string, skip: string[] = [], ...extra: string[]): string[] {
  const traits = validateTraits(traitsCsv(skip, ...extra), IDS).rows;
  const ledger = parseLedger(`${LEDGER_HEADER}\nsp-a,0,${unknown},owner,2026-11-17,`);
  return validateLedger(ledger, IDS, traits);
}

describe('validateLedger', () => {
  it('accepts a fully covered species', () => {
    expect(check('')).toEqual([]);
  });

  it('accepts a trait that is unknown and has no reviewed rows', () => {
    expect(check('month|commonness', ['month', 'commonness'])).toEqual([]);
  });

  it('rejects a trait that is in neither place', () => {
    expect(check('', ['size'])[0]).toMatch(/size has no reviewed row and is not unknown/);
  });

  it('rejects a trait that is in both places', () => {
    expect(check('zone')[0]).toMatch(/zone is unknown but has reviewed rows/);
  });

  it('rejects a row where all six questions are unknown', () => {
    const skip = [...ID_QUESTIONS];
    const errors = check(ID_QUESTIONS.join('|') + '|commonness', [...skip, 'commonness']);
    expect(errors.join()).toMatch(/all six ID questions are unknown/);
  });

  it('accepts five unknown questions', () => {
    const skip = ID_QUESTIONS.slice(1);
    expect(check(skip.join('|'), skip)).toEqual([]);
  });

  it('accepts a plumage that is unknown while other plumages are reviewed', () => {
    const rows = ['sp-a,colour,blue,male,expert:x,high,reviewed,'];
    expect(check('colour:juvenile', ['colour'], ...rows)).toEqual([]);
  });

it('rejects a plumage unknown when a blank-key row covers every plumage', () => {    expect(check('colour:juvenile')[0]).toMatch(/colour:juvenile is unknown but has/);  });
  it('rejects a plumage that is unknown but reviewed', () => {
    const rows = ['sp-a,colour,blue,juvenile,expert:x,high,reviewed,'];
    expect(check('colour:juvenile', ['colour'], ...rows)[0]).toMatch(/colour:juvenile is unknown but has/);
  });

  it('rejects a plumage unknown when the whole trait has no reviewed rows', () => {
    expect(check('colour:juvenile', ['colour']).join()).toMatch(/colour:juvenile needs the whole trait/);
  });

  it.each(['wing', 'colour:teal', 'zone:male', 'colour:morph_dark:x'])('rejects unknown_traits entry %s', (entry) => {
    expect(check(entry).length).toBeGreaterThan(0);
  });

  it('rejects a duplicate entry in unknown_traits', () => {
    expect(check('month|month', ['month']).join()).toMatch(/duplicate entry/);
  });

  it('rejects a species that is not in content', () => {
    const ledger = parseLedger(`${LEDGER_HEADER}\nsp-z,0,,owner,2026-11-17,`);
    expect(validateLedger(ledger, IDS, [])[0]).toMatch(/unknown species_id/);
  });

  it('rejects a duplicate species', () => {
    const row = 'sp-a,0,,owner,2026-11-17,';
    const traits = validateTraits(traitsCsv(), IDS).rows;
    const errors = validateLedger(parseLedger(`${LEDGER_HEADER}\n${row}\n${row}`), IDS, traits);
    expect(errors.join()).toMatch(/duplicate species in ledger/);
  });

  it('rejects reviewed rows for a species missing from the ledger', () => {
    const traits = validateTraits(traitsCsv(), IDS).rows;
    expect(validateLedger(parseLedger(LEDGER_HEADER), IDS, traits)[0]).toMatch(/not in the ledger/);
  });

  it('does not count proposed rows as coverage', () => {
    const traits = validateTraits(traitsCsv().replace(/reviewed/g, 'proposed'), IDS).rows;
    const ledger = parseLedger(`${LEDGER_HEADER}\nsp-a,0,,owner,2026-11-17,`);
    expect(validateLedger(ledger, IDS, traits)[0]).toMatch(/has no reviewed row/);
  });
});

describe('parseLedger', () => {
  it('rejects a wrong header', () => {
    expect(parseLedger('a,b').errors[0]).toMatch(/header must be/);
  });

  it.each([
    ['blank reviewer', 'sp-a,0,,,2026-11-17,'],
    ['blank date', 'sp-a,0,,owner,,'],
    ['bad date', 'sp-a,0,,owner,17/11/2026,'],
    ['bad batch', 'sp-a,one,,owner,2026-11-17,'],
  ])('rejects a %s', (_name, line) => {
    expect(parseLedger(`${LEDGER_HEADER}\n${line}`).errors).toHaveLength(1);
  });
});

describe('the real ledger', () => {
  it('lists exactly the species in traits.json, and validates', () => {
    const ledger = parseLedger(readFileSync('data/content/traits-batches.csv', 'utf8'));
    const traitRows = validateTraits(readFileSync('data/content/traits.csv', 'utf8'), new Set()).rows;
    const ids = new Set(traitRows.map((r) => r.species_id));
    expect(validateLedger(ledger, ids, traitRows)).toEqual([]);
    const built = JSON.parse(readFileSync('content/traits.json', 'utf8')) as { species: object };
    expect(ledger.rows.map((r) => r.species_id).sort()).toEqual(Object.keys(built.species).sort());
    expect(ledger.rows.every((r) => r.batch === '0')).toBe(true);
expect(ledger.rows).toHaveLength(34);
  });
});
