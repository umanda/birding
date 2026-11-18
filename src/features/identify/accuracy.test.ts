import { readFileSync } from 'fs';
import { join } from 'path';
import {
  batchMixes,
  easyProblems,
  formatReport,
  hardProblems,
  headlineProblems,
  scoreSightings,
  tally,
} from './accuracy-report';
import { isMatch, rank } from './rank';
import { checkSightings, parseSightings } from './sightings-csv';
// eslint-disable-next-line no-restricted-imports -- test-only: reuse the validated ledger parser
import { parseLedger } from '../../../tools/content/traits-ledger';
import { getAllSpecies, getPlates } from '@/shared/data/content';
import { getSpeciesTraits } from '@/shared/data/traits-data';

const DEMO_TOP_N = 3;
const ORIGINAL_COUNT = 25;
const MIN_ORIGINAL_TOP5 = 0.8;
// Spec 004 budget: results within 1 s; a tighter bound flaked under load.
const MAX_AVERAGE_MS = 1000;
const SPEED_RUNS = 20;

const dataFile = (name: string): string =>
  readFileSync(join(__dirname, '../../../data/content', name), 'utf8');
const sightings = parseSightings(dataFile('id-test-sightings.csv'));
const traits = getSpeciesTraits();

const batchOf = Object.fromEntries(
  parseLedger(dataFile('traits-batches.csv')).rows.map((row) => [row.species_id, row.batch]),
);
const plateOf = Object.fromEntries(getAllSpecies().map((s) => [s.species_id, s.plate_id]));

// Same order the app uses: plate number, then position on the plate.
const plateNumbers = new Map(getPlates().map((plate) => [plate.plate_id, plate.plate_number]));
const orderedIds = [...getAllSpecies()]
  .sort(
    (a, b) =>
      (plateNumbers.get(a.plate_id) ?? 0) - (plateNumbers.get(b.plate_id) ?? 0) ||
      a.plate_order - b.plate_order,
  )
  .map((species) => species.species_id);
const order = Object.fromEntries(orderedIds.map((id, index) => [id, index]));

const scored = scoreSightings({ sightings, traits, context: { plateOf, batchOf }, order });
const mixes = batchMixes(scored);
const isOriginal = (id: string): boolean => {
  const number = /^t([0-9]+)$/.exec(id)?.[1];
  return number !== undefined && Number(number) <= ORIGINAL_COUNT;
};

describe('ranking accuracy on the real traits', () => {
  afterAll(() => {
    // eslint-disable-next-line no-console -- the report is the point of this test
    console.info(formatReport(scored, mixes));
  });

  it('has the original 25 test sightings', () => {
    expect(sightings.filter((s) => isOriginal(s.sighting_id))).toHaveLength(ORIGINAL_COUNT);
  });

  it('has a valid scenario_source and hard_group on every sighting', () => {
    expect(checkSightings(sightings)).toEqual([]);
  });

  it('only expects species that have traits', () => {
    const known = new Set(traits.map((t) => t.species_id));
    const unknown = sightings.filter((s) => !known.has(s.expected_species_id));
    expect(unknown.map((s) => s.sighting_id)).toEqual([]);
  });

  // All 25 are common pilot birds, so scarce targets need no filter here.
  it('puts the right species in the top 5 for at least 80% of the original sightings', () => {
    const original = scored.filter((i) => isOriginal(i.sighting.sighting_id));
    expect(tally(original).top5).toBeGreaterThanOrEqual(MIN_ORIGINAL_TOP5);
  });

  it('puts every demo bird in the top 3', () => {
    const misses = scored
      .filter((i) => i.sighting.demo && (i.position < 1 || i.position > DEMO_TOP_N))
      .map((i) => i.sighting.sighting_id);
    expect(misses).toEqual([]);
  });

  it('gets at least 80% of easy scenarios into the top 5', () => {
    expect(easyProblems(scored)).toEqual([]);
  });

  it('keeps hard-group scenarios in the top 10, with a group member in the top 3', () => {
    expect(hardProblems(scored)).toEqual([]);
  });

  it('meets the top-5 and top-10 targets in every batch whose scenario mix is valid', () => {
    expect(headlineProblems(scored, mixes)).toEqual([]);
  });

  it('counts the expected species as a match for every sighting', () => {
    const notMatched = sightings.filter((s) => {
      const result = rank(traits, s.answers, { order }).find(
        (r) => r.species_id === s.expected_species_id,
      );
      return !result || !isMatch(result);
    });
    expect(notMatched.map((s) => s.sighting_id)).toEqual([]);
  });

  it('ranks every species within the 1 s results budget', () => {
    const answers = sightings[0]?.answers ?? {};
    const start = performance.now();
    for (let i = 0; i < SPEED_RUNS; i++) rank(traits, answers, { order });
    const average = (performance.now() - start) / SPEED_RUNS;
    // eslint-disable-next-line no-console -- the report is the point of this test
    console.info(`rank() average over ${traits.length} species: ${average.toFixed(2)} ms`);
    expect(average).toBeLessThan(MAX_AVERAGE_MS);
  });
});
