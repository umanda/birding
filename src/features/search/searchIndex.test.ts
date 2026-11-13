import { getAllSpecies } from '../../shared/data/content';
import { buildIndex, search } from './index';
import { searchKey } from './searchKey';

const species = getAllSpecies();
const index = buildIndex(species);
const JUNGLEFOWL = 'slb-gallus-lafayettii';
const ZWJ = '‍';
const ZWNJ = '‌';

function sinhalaName(id: string): string {
  const name = species.find((s) => s.species_id === id)?.names.si;
  if (!name) throw new Error(`missing Sinhala name for ${id}`);
  return name;
}

describe('searchKey', () => {
  it.each([
    ['  Sri   Lanka  Junglefowl ', 'sri lanka junglefowl'],
    ['Blue-breasted Quail', 'blue breasted quail'],
    ['Café Ñandú', 'cafe nandu'],
    ['Galluś laf', 'gallus laf'],
  ])('latin %j -> %j', (input, expected) => {
    expect(searchKey(input)).toBe(expected);
  });

  it('strips ZWJ/ZWNJ and keeps Sinhala otherwise untouched', () => {
    expect(searchKey(`ශ්${ZWJ}රී${ZWNJ} ලංකා`)).toBe('ශ්රී ලංකා');
  });
});

describe('search', () => {
  it.each([
    ['Sri Lanka Junglefowl', 1],
    ['sri lanka junglefowl', 1],
    ['Gallus laf', 5],
    ['lafay', 5],
    ['junglefowl', 5],
    ['Galus lafayetii', 5],
    ['Sri Lanka Junglefoul', 5],
    ['Gallus lafayetti', 1],
  ])('%j finds the junglefowl within top %i', (query, top) => {
    expect(search(index, query).slice(0, top)).toContain(JUNGLEFOWL);
  });

  it('ranks the exact English name first', () => {
    expect(search(index, 'Sri Lanka Junglefowl')[0]).toBe(JUNGLEFOWL);
  });

  it.each(['', '   ', '\t\n'])('returns [] for blank query %j', (query) => {
    expect(search(index, query)).toEqual([]);
  });

  it.each(['zzzzqqqq', 'zq', 'ශශශශශ'])('returns [] when nothing matches %j', (query) => {
    expect(search(index, query)).toEqual([]);
  });

  it('respects the limit', () => {
    expect(search(index, 'a', 3)).toHaveLength(3);
  });
});

describe('search (Sinhala)', () => {
  const id = 'slb-francolinus-pictus';
  const name = sinhalaName(id);

  it('finds a name by itself, prefix and substring', () => {
    expect(search(index, name)[0]).toBe(id);
    expect(search(index, name.slice(0, 3))).toContain(id);
    expect(search(index, name.slice(3, 7))).toContain(id);
  });

  // content.json holds no names with joiners today; insert them after the virama.
  it('matches with ZWJ/ZWNJ typed or not', () => {
    const withZwj = name.replace('්', `්${ZWJ}`);
    const withZwnj = name.replace('්', `්${ZWNJ}`);
    expect(withZwj).not.toBe(name);
    expect(search(index, withZwj)[0]).toBe(id);
    expect(search(index, withZwnj)[0]).toBe(id);
  });

  it('matches a stored name that contains a ZWJ', () => {
    const stored = `ශ්${ZWJ}රී ලංකා`;
    const joinerIndex = buildIndex([
      {
        species_id: 'x',
        plate_id: 'p',
        plate_order: 1,
        names: { en: 'Test Bird', si: stored, scientific: 'Testus avis' },
        occurrence_code: 'R',
        iucn_category: null,
      },
    ]);
    expect(search(joinerIndex, 'ශ්රී')).toEqual(['x']);
    expect(search(joinerIndex, stored)).toEqual(['x']);
  });

  it('matches a decomposed vowel sign against the composed name', () => {
    const composed = species.find((s) => s.names.si?.includes('ො'));
    if (!composed?.names.si) throw new Error('no name with U+0DDC');
    const decomposed = composed.names.si.replace('ො', 'ො');
    expect(decomposed).not.toBe(composed.names.si);
    expect(search(index, decomposed)).toContain(composed.species_id);
  });

  it('applies no edit distance', () => {
    const typo = name.slice(0, 3) + 'ඝ' + name.slice(4);
    expect(search(index, typo)).not.toContain(id);
  });
});

describe('search performance', () => {
  it('averages well under 5 ms per query over the real species', () => {
    const queries = species.flatMap((s) => [
      s.names.en.slice(0, 5),
      s.names.scientific.replace('a', ''),
      s.names.si ?? s.names.en,
    ]);
    const runs = Array.from({ length: 1000 }, (_, i) => queries[i % queries.length] ?? '');
    const start = performance.now();
    for (const q of runs) search(index, q);
    const average = (performance.now() - start) / runs.length;
    // eslint-disable-next-line no-console
    console.info(`search: ${average.toFixed(3)} ms/query over ${runs.length} queries`);
    expect(average).toBeLessThan(20);
  });
});
