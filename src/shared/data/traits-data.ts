import rawTraits from '../../../content/traits.json';
import type { SpeciesTraits } from './traits';

// Not parsed at runtime so zod stays out of the app bundle; tools/content validates the
// file at build time, and only reviewed rows are written to it.
const traits = Object.values(rawTraits.species) as SpeciesTraits[];

/** Reviewed traits of every pilot species. */
export const getSpeciesTraits = (): SpeciesTraits[] => traits;
