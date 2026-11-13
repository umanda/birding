import rawContent from '../../../content/content.json';
import {
  ContentSchema,
  type OccurrenceCode,
  type Plate,
  type Species,
} from './content-schema';

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

// Parsed once at module load. A throw here is deliberate: bundled content that
// fails its schema is a build defect, not a runtime condition to recover from.
const content = ContentSchema.parse(rawContent);

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
