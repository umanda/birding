import { readFileSync } from 'fs';
import { join } from 'path';
import { checkMix, formatReport, hardTally, scoreSightings, tally } from './accuracy-report';
import { isMatch, rank } from './rank';
import { checkSightings, parseSightings } from './sightings-csv';
import { getAllSpecies, getPlates } from '@/shared/data/content';
import { getSpeciesTraits } from '@/shared/data/traits-data';

const DEMO_TOP_N = 3;
const ORIGINAL_ID = /^t\d{2}$/;
const ORIGINAL_COUNT = 25;
const MIN_TOP5 = 0.7;
const MIN_TOP10 = 0.9;
const MIN_ORIGINAL_TOP5 = 0.8;
const MIN_EASY_TOP5 = 0.8;
const MIN_HARD_TOP10 = 0.8;
const MIN_HARD_GROUP_TOP3 = 0.9;
// Spec 004 budget: results within 1 s; a tighter bound flaked under load.
const MAX_AVERAGE_MS = 1000;
const SPEED_RUNS = 20;

const dataFile = (name: string): string =>
  readFileSync(join(__dirname, '../../../data/content', name), 'utf8');
const sightings = parseSightings(dataFile('id-test-sightings.csv'));
const traits = getSpeciesTraits();

// Only species_id and batch are needed from the ledger, and neither is quoted.
const batchOf = Object.fromEntries(
  dataFile('traits-batches.csv')
    .split(/\r?\n/)
    .slice(1)
    .filter((row) => row !== '')
    .map((row) => row.split(',').slice(0, 2)),
) as Record<string, string>;
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
const mix = checkMix(scored);

describe('ranking accuracy on the real traits', () => {
  afterAll(() => {
    // eslint-disable-next-line no-console -- the report is the point of this test
    console.info(formatReport(scored, mix));
  });

  it('has the original 25 test sightings', () => {
    expect(sightings.filter((s) => ORIGINAL_ID.test(s.sighting_id))).toHaveLength(ORIGINAL_COUNT);
  });

  it('has a valid scenario_source and hard_group on every sighting', () => {
    expect(checkSightings(sightings)).toEqual([]);
  });

  it('only expects species that have traits', () => {
    const known = new Set(traits.map((t) => t.species_id));
    const unknown = sightings.filter((s) => !known.has(s.expected_species_id));
    expect(unknown.map((s) => s.sighting_id)).toEqual([]);
  });

  it('puts the right species in the top 5 for at least 80% of the original sightings', () => {
    const original = scored.filter((i) => ORIGINAL_ID.test(i.sighting.sighting_id));
    expect(tally(original).top5).toBeGreaterThanOrEqual(MIN_ORIGINAL_TOP5);
  });

  it('puts every demo bird in the top 3', () => {
    const misses = scored
      .filter((i) => i.sighting.demo && (i.position < 1 || i.position > DEMO_TOP_N))
      .map((i) => i.sighting.sighting_id);
    expect(misses).toEqual([]);
  });

  it('gets at least 80% of easy scenarios into the top 5', () => {
    const easy = scored.filter((i) => i.sighting.hard_group === '');
    expect(tally(easy).top5).toBeGreaterThanOrEqual(MIN_EASY_TOP5);
  });

  it('keeps hard-group scenarios in the top 10, with a group member in the top 3', () => {
    const hard = hardTally(scored);
    if (hard.count === 0) return; // no hard scenarios yet; the gate starts with the first one
    expect(hard.top10).toBeGreaterThanOrEqual(MIN_HARD_TOP10);
    expect(hard.groupTop3).toBeGreaterThanOrEqual(MIN_HARD_GROUP_TOP3);
  });

  it('meets the headline top-5 and top-10 targets once the scenario mix is valid', () => {
    if (!mix.met) return; // reported in the summary, not gated (spec 006)
    const gated = tally(scored.filter((i) => !i.scarce)); // scarce targets are reported only
    expect(gated.top5).toBeGreaterThanOrEqual(MIN_TOP5);
    expect(gated.top10).toBeGreaterThanOrEqual(MIN_TOP10);
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
