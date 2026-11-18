import { batchMixes, easyProblems, hardTally, headlineProblems, tally } from './accuracy-report';
import type { Scored } from './accuracy-report';
import { checkSightings } from './sightings-csv';
import type { TestSighting } from './sightings-csv';

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

describe('batchMixes', () => {
  it('is not met when every scenario comes from the drafter', () => {
    expect(batchMixes([item(), item()])[0]?.met).toBe(false);
  });

  it('is met with enough common targets and independent scenarios', () => {
    const items = [item(), item(), item(), item(), item({ scenario_source: 'plates' })];
    expect(batchMixes(items)[0]?.met).toBe(true);
  });

  it('judges each batch on its own', () => {
    const items = [item({ batch: '1', scenario_source: 'other' }), item({ batch: '2' })];
    expect(batchMixes(items).map((m) => m.met)).toEqual([true, false]);
  });

  it('is not met when too few targets are common', () => {
    const items = [
      item({ common: false, scenario_source: 'other' }),
      item({ scenario_source: 'other' }),
    ];
    expect(batchMixes(items)[0]?.met).toBe(false);
  });
});

describe('headlineProblems', () => {
  it('fails a later batch whose mix is not met, naming the batch', () => {
    const items = [item({ batch: '2' })];
    expect(headlineProblems(items, batchMixes(items))[0]).toContain(
      'batch 2: scenario mix not met',
    );
  });

  it('does not gate the legacy batch 0', () => {
    const items = [item({ batch: '0', position: 40 })];
    expect(headlineProblems(items, batchMixes(items))).toEqual([]);
  });

  it('fails a batch with a valid mix but a low top-5', () => {
    const items = [item({ batch: '1', scenario_source: 'other', position: 8 })];
    expect(headlineProblems(items, batchMixes(items))).toHaveLength(1);
  });

  it('leaves scarce targets out of the gate', () => {
    const items = [
      item({ batch: '1', scenario_source: 'other' }),
      item({ batch: '1', scenario_source: 'other', scarce: true, position: 0 }),
    ];
    expect(headlineProblems(items, batchMixes(items))).toEqual([]);
  });
});

describe('easyProblems', () => {
  it('fails when easy scenarios miss the top 5', () => {
    expect(easyProblems([item({ position: 9 })])).toHaveLength(1);
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
