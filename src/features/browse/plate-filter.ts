import { matchesOccurrence } from '@/shared/data/content';
import type { OccurrenceFilter } from '@/shared/data/content';
import type { Plate, Species } from '@/shared/data/content-schema';

export const OCCURRENCE_FILTERS: readonly OccurrenceFilter[] = ['E', 'R', 'M'];
const FILTER_PARAM_SEPARATOR = ',';

export type PlateRow = { plate: Plate; count: number };

/** Reads the route param; unknown tokens are dropped and order is normalised. */
export function parseFilters(param: string | undefined): OccurrenceFilter[] {
  const tokens = (param ?? '').split(FILTER_PARAM_SEPARATOR);
  return OCCURRENCE_FILTERS.filter((filter) => tokens.includes(filter));
}

export function serializeFilters(filters: readonly OccurrenceFilter[]): string | undefined {
  return filters.length ? filters.join(FILTER_PARAM_SEPARATOR) : undefined;
}

export function toggleFilter(
  filters: readonly OccurrenceFilter[],
  filter: OccurrenceFilter,
): OccurrenceFilter[] {
  const without = filters.filter((f) => f !== filter);
  const next = without.length === filters.length ? [...filters, filter] : without;
  return OCCURRENCE_FILTERS.filter((f) => next.includes(f));
}

// Multi-select is a union (E + M = endemics or migrants); no filter means everything.
export function matchesFilters(species: Species, filters: readonly OccurrenceFilter[]): boolean {
  if (filters.length === 0) return true;
  return filters.some((filter) => matchesOccurrence(species.occurrence_code, filter));
}

export function countByFilter(allSpecies: readonly Species[]): Record<OccurrenceFilter, number> {
  const count = (filter: OccurrenceFilter): number =>
    allSpecies.filter((s) => matchesOccurrence(s.occurrence_code, filter)).length;
  return { E: count('E'), R: count('R'), M: count('M') };
}

/** Plates in plate_number order; with a filter active, plates with no match are hidden. */
export function buildPlateRows(
  plates: readonly Plate[],
  speciesOf: (plateId: string) => readonly Species[],
  filters: readonly OccurrenceFilter[],
): PlateRow[] {
  return [...plates]
    .sort((a, b) => a.plate_number - b.plate_number)
    .map((plate) => ({
      plate,
      count: speciesOf(plate.plate_id).filter((s) => matchesFilters(s, filters)).length,
    }))
    .filter(({ count }) => filters.length === 0 || count > 0);
}
