import { getAllSpecies, getPlates, getSpeciesByPlate } from '@/shared/data/content';
import type { OccurrenceFilter } from '@/shared/data/content';
import type { Species } from '@/shared/data/content-schema';

import { buildPlateRows, countByFilter, toggleFilter } from './plate-filter';

const withCode = (occurrence_code: Species['occurrence_code']): Species =>
  ({ occurrence_code }) as Species;

describe('toggleFilter', () => {
  it('toggles on and off', () => {
    expect(toggleFilter(['E'], 'M')).toEqual(['E', 'M']);
    expect(toggleFilter(['E', 'M'], 'E')).toEqual(['M']);
  });
});

describe('with the bundled content', () => {
  const species = getAllSpecies();
  const rows = (filters: OccurrenceFilter[]) =>
    buildPlateRows(getPlates(), getSpeciesByPlate, filters);
  const total = (filters: OccurrenceFilter[]): number =>
    rows(filters).reduce((sum, row) => sum + row.count, 0);

  it('lists 43 plates in plate_number order when unfiltered', () => {
    const numbers = rows([]).map((row) => row.plate.plate_number);
    expect(numbers).toHaveLength(43);
    expect(numbers).toEqual([...numbers].sort((a, b) => a - b));
    expect(total([])).toBe(species.length);
  });

  it('counts 35 endemics, and compound codes under both R and M', () => {
    const counts = countByFilter(species);
    const only = (code: string): number => species.filter((s) => s.occurrence_code === code).length;
    const compound = species.filter((s) => /^R[/+]/.test(s.occurrence_code)).length;
    expect(compound).toBeGreaterThan(0);
    expect(counts.E).toBe(35);
    expect(counts.R).toBe(only('R') + compound);
    expect(counts.M).toBe(only('M') + compound);
  });

  it('hides plates without matches and sums to the filter count', () => {
    const endemic = rows(['E']);
    expect(endemic.length).toBeLessThan(43);
    expect(endemic.every((row) => row.count > 0)).toBe(true);
    expect(total(['E'])).toBe(35);
    expect(total(['R'])).toBe(countByFilter(species).R);
  });
});

describe('buildPlateRows with no matches', () => {
  it('returns no rows when a filter matches nothing', () => {
    const plates = getPlates().slice(0, 2);
    const onlyResident = (): Species[] => [withCode('R')];
    expect(buildPlateRows(plates, onlyResident, ['E'])).toEqual([]);
  });
});
