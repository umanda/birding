import { isMatch, rank } from './rank';
import type { Answers, RankedSpecies, SpeciesTraits } from './types';
import type { MonthPresence } from './vocabulary';

const YEAR_ROUND: MonthPresence[] = Array<MonthPresence>(12).fill('present');

function bird(id: string, extra: Partial<SpeciesTraits> = {}): SpeciesTraits {
  return {
    species_id: id,
    zones: ['wet_lowland'],
    habitats: ['town_garden'],
    size: ['M'],
    colours: [['brown']],
    behaviours: ['ground'],
    months: YEAR_ROUND,
    ...extra,
  };
}

function scoreOf(traits: SpeciesTraits, answers: Answers): number {
  return at(rank([traits], answers), 0).score;
}

function topId(traits: SpeciesTraits[], answers: Answers): string {
  return at(rank(traits, answers), 0).species_id;
}

describe('size', () => {
  const answers: Answers = { size: 'M' };
  it.each([
    ['same class', ['M'], 3],
    ['one class away', ['L'], 1.5],
    ['two classes away', ['XL'], -1],
    ['any class in a span', ['XS', 'M'], 3],
  ] as const)('%s', (_name, size, expected) => {
    expect(scoreOf(bird('a', { size: [...size] }), answers)).toBe(expected);
  });

  it('ranks same class above adjacent above far', () => {
    const list = [bird('far', { size: ['XXL'] }), bird('near', { size: ['L'] }), bird('same')];
    expect(rank(list, answers).map((r) => r.species_id)).toEqual(['same', 'near', 'far']);
  });
});

describe('colours', () => {
  it('matches any plumage', () => {
    const duck = bird('duck', { colours: [['brown'], ['green', 'white']] });
    expect(at(rank([duck], { colours: ['green'] }), 0).reasons).toEqual([
      { field: 'colours', fit: 'match' },
    ]);
  });

  it('gives more points for more matched colours', () => {
    const one = bird('one', { colours: [['red']] });
    const two = bird('two', { colours: [['red', 'blue']] });
    expect(topId([one, two], { colours: ['red', 'blue'] })).toBe('two');
  });

  it('does not remove a species with no matching colour', () => {
    const result = rank([bird('a')], { colours: ['pink'] });
    expect(result).toHaveLength(1);
    expect(at(result, 0).reasons).toEqual([{ field: 'colours', fit: 'mismatch' }]);
  });
});

describe('zone and month', () => {
  const cases: [string, Answers, SpeciesTraits, string][] = [
    [
      'wrong zone',
      { zone: 'wet_lowland' },
      bird('stray', { zones: ['montane'] }),
      'not-usually-here',
    ],
    ['absent month', { month: 7 }, bird('stray', { months: absentIn(7) }), 'not-usually-now'],
  ];
  it.each(cases)('%s: penalty, flag, still listed', (_name, answers, stray, flag) => {
    const result = rank([stray, bird('resident')], answers);
    expect(result.map((r) => r.species_id)).toEqual(['resident', 'stray']);
    expect(at(result, 1).flags).toContain(flag);
    expect(at(result, 0).flags).not.toContain(flag);
  });

  it('lets one right answer outweigh a wrong place', () => {
    const here = bird('here', { size: ['XL'] });
    const away = bird('away', { zones: ['montane'] });
    expect(topId([away, here], { zone: 'wet_lowland', size: 'M' })).toBe('here');
  });
});

describe('unknown traits', () => {
  it('score 0 and flag data-incomplete, never punish', () => {
    const unknown: SpeciesTraits = { species_id: 'unknown', zones: ['wet_lowland'] };
    const result = at(rank([unknown], { size: 'M', habitat: 'forest' }), 0);
    expect(result.score).toBe(0);
    expect(result.flags).toEqual(['data-incomplete']);
    expect(result.reasons.every((r) => r.fit === 'unknown')).toBe(true);
  });

  it('treats an unknown month value as unknown', () => {
    const months = YEAR_ROUND.map((m, i): MonthPresence => (i === 2 ? 'unknown' : m));
    expect(at(rank([bird('a', { months })], { month: 3 }), 0).flags).toEqual(['data-incomplete']);
  });

  it('does not flag questions that were skipped', () => {
    const sparse: SpeciesTraits = { species_id: 'sparse' };
    expect(at(rank([sparse], {}), 0).flags).toEqual([]);
  });
});

describe('endemic and IUCN are not inputs', () => {
  it('scores species that differ only in those fields the same', () => {
    const plain = bird('plain');
    const rare = { ...bird('rare'), occurrence: 'E', iucn: 'VU' };
    const answers: Answers = { zone: 'wet_lowland', size: 'M', colours: ['brown'], month: 5 };
    expect(scoreOf(rare, answers)).toBe(scoreOf(plain, answers));
  });
});

describe('ordering', () => {
  const common = bird('b-common', { commonness: { wet_lowland: 'common' } });
  const uncommon = bird('a-uncommon', { commonness: { wet_lowland: 'uncommon' } });
  const scarce = bird('c-scarce', { commonness: { wet_lowland: 'scarce' } });

  it('breaks ties by commonness in the answered zone', () => {
    const ids = rank([scarce, uncommon, common], { zone: 'wet_lowland' }).map((r) => r.species_id);
    expect(ids).toEqual(['b-common', 'a-uncommon', 'c-scarce']);
  });

  it('then by plate order, then by species_id', () => {
    const list = [bird('z'), bird('y'), bird('x')];
    const byOrder = rank(list, {}, { order: { z: 0, y: 1 } }).map((r) => r.species_id);
    expect(byOrder).toEqual(['z', 'y', 'x']);
    expect(rank(list, {}).map((r) => r.species_id)).toEqual(['x', 'y', 'z']);
  });

  it('is the same for any input order', () => {
    const forward = rank([common, uncommon, scarce], { zone: 'wet_lowland' });
    const backward = rank([scarce, uncommon, common], { zone: 'wet_lowland' });
    expect(backward).toEqual(forward);
  });

  it('lists everyone when all questions are skipped', () => {
    const list = [scarce, common, uncommon];
    const order = { 'a-uncommon': 0, 'b-common': 1, 'c-scarce': 2 };
    const ids = rank(list, {}, { order }).map((r) => r.species_id);
    expect(ids).toEqual(['a-uncommon', 'b-common', 'c-scarce']);
  });
});

describe('performance', () => {
  it('ranks 295 species well within a second', () => {
    const species = Array.from({ length: 295 }, (_, i) => bird(`sp-${i}`));
    const answers: Answers = {
      month: 7,
      zone: 'wet_lowland',
      habitat: 'forest',
      size: 'M',
      colours: ['brown', 'red', 'blue'],
      behaviour: 'aerial',
    };
    const start = performance.now();
    const result = rank(species, answers);
    expect(performance.now() - start).toBeLessThan(1000);
    expect(result).toHaveLength(295);
  });
});

function absentIn(month: number): MonthPresence[] {
  return YEAR_ROUND.map((m, i): MonthPresence => (i === month - 1 ? 'absent' : m));
}

function at(results: RankedSpecies[], index: number): RankedSpecies {
  const result = results[index];
  if (!result) throw new Error(`no result at ${index}`);
  return result;
}

describe('isMatch', () => {
  it.each([
    ['everything skipped', {}, 'a', true],
    ['right answers', { size: 'M', zone: 'wet_lowland' }, 'a', true],
    ['wrong zone', { zone: 'montane' }, 'a', false],
    ['far size only', { size: 'XXXL' }, 'a', false],
  ] as const)('%s', (_name, answers, id, expected) => {
    expect(isMatch(at(rank([bird(id)], answers), 0))).toBe(expected);
  });
});
