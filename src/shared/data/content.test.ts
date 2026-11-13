import rawContent from '../../../content/content.json';
import { ContentSchema, type OccurrenceCode } from './content-schema';
import {
  getAllSpecies,
  getPlate,
  getPlates,
  getSpecies,
  getSpeciesByPlate,
  matchesOccurrence,
  type OccurrenceFilter,
} from './content';

describe('content accessors', () => {
  it('bundled content.json satisfies the schema', () => {
    expect(ContentSchema.safeParse(rawContent).success).toBe(true);
  });

  it('exposes all plates and species', () => {
    expect(getPlates()).toHaveLength(43);
    expect(getAllSpecies()).toHaveLength(295);
  });

  it('looks up the Junglefowl by id', () => {
    const species = getSpecies('slb-gallus-lafayettii');
    expect(species?.names.scientific).toBe('Gallus lafayettii');
    expect(species?.occurrence_code).toBe('E');
  });

  it('lists plates in plate_number order', () => {
    const numbers = getPlates().map((p) => p.plate_number);
    expect(numbers).toEqual([...numbers].sort((a, b) => a - b));
  });

  it('looks up a plate by id', () => {
    expect(getPlate('plate-01')?.plate_number).toBe(1);
  });

  it('returns undefined for unknown ids', () => {
    expect(getSpecies('nope')).toBeUndefined();
    expect(getPlate('nope')).toBeUndefined();
  });

  it('returns no species for an unknown plate', () => {
    expect(getSpeciesByPlate('nope')).toEqual([]);
  });

  it('lists every species on exactly one plate, ordered by plate_order', () => {
    let total = 0;
    for (const plate of getPlates()) {
      const orders = getSpeciesByPlate(plate.plate_id).map((s) => s.plate_order);
      expect(orders).toEqual([...orders].sort((a, b) => a - b));
      total += orders.length;
    }
    expect(total).toBe(getAllSpecies().length);
  });
});

describe('matchesOccurrence', () => {
  // A Record forces a row for every OccurrenceCode, so new codes can't be missed.
  const table: Record<OccurrenceCode, Record<OccurrenceFilter, boolean>> = {
    E: { E: true, R: false, M: false },
    R: { E: false, R: true, M: false },
    M: { E: false, R: false, M: true },
    'R/M': { E: false, R: true, M: true },
    'R+M': { E: false, R: true, M: true },
    'R+(M)': { E: false, R: true, M: true },
  };

  it.each(Object.entries(table))('%s', (code, expected) => {
    for (const filter of ['E', 'R', 'M'] as const) {
      expect(matchesOccurrence(code as OccurrenceCode, filter)).toBe(expected[filter]);
    }
  });
});
