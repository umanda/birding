import { checkMix, hardTally, tally } from './accuracy-report';
import type { Scored } from './accuracy-report';
import { rank } from './rank';
import { checkSightings } from './sightings-csv';
import type { TestSighting } from './sightings-csv';
import type { Answers } from './types';
import type { SpeciesTraits } from '@/shared/data/traits';

type Overrides = Partial<Omit<Scored, 'sighting'>> & Partial<TestSighting>;

function item(overrides: Overrides = {}): Scored {
  const { position = 1, topIds = [], plate = 'p1', batch = '1', common = true } = overrides;
  const sighting: TestSighting = {
    sighting_id: overrides.sighting_id ?? 's',
    expected_species_id: overrides.expected_species_id ?? 'a',
    demo: false,
    scenario_source: overrides.scenario_source ?? 'drafter',
    hard_group: overrides.hard_group ?? '',
    answers: {},
  };
  return { sighting, position, topIds, plate, batch, common, scarce: overrides.scarce ?? false };
}

describe('tally', () => {
  it('counts a species ranked 7th as top 10 but not top 5', () => {
    const result = tally([item({ position: 7 })]);
    expect([result.top5, result.top10]).toEqual([0, 1]);
  });

  it('counts a missing species as a miss', () => {
    expect(tally([item({ position: 0 })]).top10).toBe(0);
  });

  it('returns zero rates for no sightings', () => {
    expect(tally([])).toEqual({ count: 0, top5: 0, top10: 0 });
  });
});

describe('hardTally', () => {
  it('passes a hard sighting when a lookalike from its group is in the top 3', () => {
    const hard = [
      item({ hard_group: 'g', expected_species_id: 'a', position: 6, topIds: ['b', 'x', 'y'] }),
      item({ hard_group: 'g', expected_species_id: 'b', position: 1, topIds: ['b'] }),
    ];
    expect(hardTally(hard).groupTop3).toBe(1);
  });

  it('fails a hard sighting when no group member is in the top 3', () => {
    const hard = [item({ hard_group: 'g', position: 4, topIds: ['x', 'y', 'z'] })];
    expect(hardTally(hard).groupTop3).toBe(0);
  });

  it('ignores easy sightings', () => {
    expect(hardTally([item()]).count).toBe(0);
  });
});

describe('checkMix', () => {
  it('is not met when every scenario comes from the drafter', () => {
    expect(checkMix([item(), item()]).met).toBe(false);
  });

  it('is met with enough common targets and independent scenarios in every batch', () => {
    const items = [item(), item(), item(), item(), item({ scenario_source: 'plates' })];
    expect(checkMix(items).met).toBe(true);
  });

  it('is not met when one batch has no independent scenarios', () => {
    const items = [item({ batch: '1', scenario_source: 'other' }), item({ batch: '2' })];
    expect(checkMix(items).met).toBe(false);
  });

  it('is not met when too few targets are common', () => {
    const items = [
      item({ common: false, scenario_source: 'other' }),
      item({ scenario_source: 'other' }),
    ];
    expect(checkMix(items).met).toBe(false);
  });
});

describe('checkSightings', () => {
  const base = item().sighting;

  it('accepts a known scenario_source and a blank hard_group', () => {
    expect(checkSightings([base])).toEqual([]);
  });

  it('rejects a blank scenario_source', () => {
    expect(checkSightings([{ ...base, scenario_source: '' }])).toHaveLength(1);
  });

  it('rejects a badly formed hard_group', () => {
    expect(checkSightings([{ ...base, hard_group: 'Bad Name' }])).toHaveLength(1);
  });
});

describe('a species with unknown traits', () => {
  const answers: Answers = {
    month: 1,
    zone: 'wet_lowland',
    habitat: 'forest',
    size: 'M',
    colours: ['green'],
    behaviour: 'tree_bush',
  };
  const fullMatch: SpeciesTraits = {
    species_id: 'full',
    zones: ['wet_lowland'],
    habitats: ['forest'],
    size: ['M'],
    colours: [['green']],
    behaviours: ['tree_bush'],
    months: Array<'present'>(12).fill('present'),
  };

  it('cannot outrank a species that fully matches', () => {
    const allUnknown: SpeciesTraits = { species_id: 'unknown' };
    const ranked = rank([allUnknown, fullMatch], answers, { order: { unknown: 0, full: 1 } });
    expect(ranked[0]?.species_id).toBe('full');
  });
});
