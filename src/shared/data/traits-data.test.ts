import { getAllSpecies } from './content';
import { getSpeciesTraits } from './traits-data';

describe('getSpeciesTraits', () => {
  it('returns reviewed traits for known species only', () => {
    const known = new Set(getAllSpecies().map((species) => species.species_id));
    const traits = getSpeciesTraits();
    expect(traits.length).toBeGreaterThan(0);
    expect(traits.every((t) => known.has(t.species_id))).toBe(true);
  });
});
