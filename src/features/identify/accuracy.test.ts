import { readFileSync } from 'fs';
import { join } from 'path';
import { isMatch, rank } from './rank';
import { parseSightings } from './sightings-csv';
import type { TestSighting } from './sightings-csv';
import { getAllSpecies, getPlates } from '@/shared/data/content';
import { getSpeciesTraits } from '@/shared/data/traits-data';

const TOP_N = 5;
const DEMO_TOP_N = 3;
const MIN_HIT_RATE = 0.8;
const MAX_AVERAGE_MS = 50;
const SPEED_RUNS = 20;

const csv = readFileSync(join(__dirname, '../../../data/content/id-test-sightings.csv'), 'utf8');
const sightings = parseSightings(csv);
const traits = getSpeciesTraits();

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

function rankOf(sighting: TestSighting): number {
  const ranked = rank(traits, sighting.answers, { order });
  return ranked.findIndex((r) => r.species_id === sighting.expected_species_id) + 1;
}

describe('ranking accuracy on the real pilot traits', () => {
  it('has the 25 test sightings and one trait row per pilot species', () => {
    expect(sightings).toHaveLength(25);
    expect(traits).toHaveLength(34);
  });

  it('only expects species that have traits', () => {
    const known = new Set(traits.map((t) => t.species_id));
    const unknown = sightings.filter((s) => !known.has(s.expected_species_id));
    expect(unknown.map((s) => s.sighting_id)).toEqual([]);
  });

  it('puts the right species in the top 5 for at least 80% of sightings', () => {
    const hits = sightings.filter((s) => {
      const position = rankOf(s);
      return position >= 1 && position <= TOP_N;
    });
    expect(hits.length / sightings.length).toBeGreaterThanOrEqual(MIN_HIT_RATE);
  });

  it('puts every demo bird in the top 3', () => {
    const misses = sightings
      .filter((s) => s.demo)
      .filter((s) => {
        const position = rankOf(s);
        return position < 1 || position > DEMO_TOP_N;
      });
    expect(misses.map((s) => s.sighting_id)).toEqual([]);
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

  it('ranks all 34 species in under 50 ms on average', () => {
    const answers = sightings[0]?.answers ?? {};
    const start = performance.now();
    for (let i = 0; i < SPEED_RUNS; i++) rank(traits, answers, { order });
    const average = (performance.now() - start) / SPEED_RUNS;
    expect(average).toBeLessThan(MAX_AVERAGE_MS);
  });
});
