import { matchesOccurrence } from './content';
import type { OccurrenceFilter } from './content';
import type { Species } from './content-schema';

export const OCCURRENCE_FILTERS: readonly OccurrenceFilter[] = ['E', 'R', 'M'];
const FILTER_PARAM_SEPARATOR = ',';

/** Reads the route param; unknown tokens are dropped and order is normalised. */
export function parseFilters(param: string | readonly string[] | undefined): OccurrenceFilter[] {
  const tokens = [param ?? ''].flat().join(FILTER_PARAM_SEPARATOR).split(FILTER_PARAM_SEPARATOR);
  return OCCURRENCE_FILTERS.filter((filter) => tokens.includes(filter));
}

export function serializeFilters(filters: readonly OccurrenceFilter[]): string | undefined {
  return filters.length ? filters.join(FILTER_PARAM_SEPARATOR) : undefined;
}

// Multi-select is a union (E + M = endemics or migrants); no filter means everything.
export function matchesFilters(species: Species, filters: readonly OccurrenceFilter[]): boolean {
  if (filters.length === 0) return true;
  return filters.some((filter) => matchesOccurrence(species.occurrence_code, filter));
}
