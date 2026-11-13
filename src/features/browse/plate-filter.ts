import { matchesOccurrence } from '@/shared/data/content';
import type { OccurrenceFilter } from '@/shared/data/content';
import { OCCURRENCE_FILTERS, matchesFilters } from '@/shared/data/occurrence-filter';
import type { Plate, Species } from '@/shared/data/content-schema';

export type PlateRow = { plate: Plate; count: number };

export function toggleFilter(
  filters: readonly OccurrenceFilter[],
  filter: OccurrenceFilter,
): OccurrenceFilter[] {
  const next = filters.includes(filter)
    ? filters.filter((f) => f !== filter)
    : [...filters, filter];
  return OCCURRENCE_FILTERS.filter((f) => next.includes(f));
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
