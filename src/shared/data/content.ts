import rawContent from '../../../content/content.json';
import type { Content, OccurrenceCode, Plate, Species } from './content-schema';

export type OccurrenceFilter = 'E' | 'R' | 'M';

// Owner decision (spec 001): compound codes match both of their parts.
const CODES_BY_FILTER: Record<OccurrenceFilter, readonly OccurrenceCode[]> = {
  E: ['E'],
  R: ['R', 'R/M', 'R+M', 'R+(M)'],
  M: ['M', 'R/M', 'R+M', 'R+(M)'],
};

export function matchesOccurrence(code: OccurrenceCode, filter: OccurrenceFilter): boolean {
  return CODES_BY_FILTER[filter].includes(code);
}

// Not parsed at runtime so zod stays out of the app bundle; the file is validated
// at build time by validate:content (CI), and the test suite re-parses it.
const content = rawContent as Content;

const plates: readonly Plate[] = content.plates;
const allSpecies: readonly Species[] = content.species;
const platesById = new Map(plates.map((plate) => [plate.plate_id, plate]));
const speciesById = new Map(allSpecies.map((species) => [species.species_id, species]));

const speciesByPlate = new Map<string, Species[]>();
for (const species of [...allSpecies].sort((a, b) => a.plate_order - b.plate_order)) {
  const list = speciesByPlate.get(species.plate_id) ?? [];
  list.push(species);
  speciesByPlate.set(species.plate_id, list);
}

export const getPlates = (): readonly Plate[] => plates;
export const getPlate = (id: string): Plate | undefined => platesById.get(id);
export const getAllSpecies = (): readonly Species[] => allSpecies;
export const getSpecies = (id: string): Species | undefined => speciesById.get(id);
export const getSpeciesByPlate = (plateId: string): readonly Species[] =>
  speciesByPlate.get(plateId) ?? [];
