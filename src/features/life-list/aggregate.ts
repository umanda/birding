import { getPlate } from '@/shared/data/content';
import type { OccurrenceFilter } from '@/shared/data/content';
import type { OccurrenceCode, Species } from '@/shared/data/content-schema';
import { matchesFilters } from '@/shared/data/occurrence-filter';
import type { Language } from '@/shared/i18n/language';
import { localized } from '@/shared/i18n/localized';

/** The part of a Sighting the aggregation reads; the full Sighting type satisfies it. */
export type SightingInput = {
  species_id: string;
  seen_on: string;
  deleted_at: string | null;
};

export type LifeListSort = 'recent' | 'name' | 'plate';

export type LifeListRow = {
  species_id: string;
  first_seen: string;
  last_seen: string;
  sightings: number;
  /** False when the species is no longer in the content; the row is kept and labelled. */
  inGuide: boolean;
};

export type LifeListSummary = {
  species: number;
  sightings: number;
  endemics: number;
  endemicsTotal: number;
  byCode: Record<OccurrenceCode, number>;
  /** Species no longer in the guide; byCode plus unknown equals species. */
  unknown: number;
};

type Options = { sort: LifeListSort; filters: readonly OccurrenceFilter[]; language: Language };

const ENDEMIC_CODE: OccurrenceCode = 'E';
// Species that left the guide have no plate, so they go after every plate.
export const AFTER_LAST_PLATE = Number.MAX_SAFE_INTEGER;

// Code-point order, so ties break the same on every device and locale.
function compareCodePoints(a: string, b: string): number {
  if (a === b) return 0;
  return a < b ? -1 : 1;
}

const isActive = (sighting: SightingInput): boolean => sighting.deleted_at == null;

function bySpecies(sightings: readonly SightingInput[]): Map<string, SightingInput[]> {
  const groups = new Map<string, SightingInput[]>();
  for (const sighting of sightings.filter(isActive)) {
    const group = groups.get(sighting.species_id) ?? [];
    group.push(sighting);
    groups.set(sighting.species_id, group);
  }
  return groups;
}

// seen_on is YYYY-MM-DD, so plain string comparison orders dates correctly.
function toRow(speciesId: string, group: readonly SightingInput[], inGuide: boolean): LifeListRow {
  const dates = group.map((sighting) => sighting.seen_on).sort();
  return {
    species_id: speciesId,
    first_seen: dates[0] ?? '',
    last_seen: dates[dates.length - 1] ?? '',
    sightings: group.length,
    inGuide,
  };
}

function plateKey(species: Species | undefined): [number, number] {
  if (!species) return [AFTER_LAST_PLATE, 0];
  return [getPlate(species.plate_id)?.plate_number ?? AFTER_LAST_PLATE, species.plate_order];
}

function compareRows(
  sort: LifeListSort,
  language: Language,
  speciesById: ReadonlyMap<string, Species>,
): (a: LifeListRow, b: LifeListRow) => number {
  const nameOf = (row: LifeListRow): string => {
    const species = speciesById.get(row.species_id);
    return species ? localized(species.names, language).text : row.species_id;
  };
  const byName = (a: LifeListRow, b: LifeListRow): number =>
    nameOf(a).localeCompare(nameOf(b), language) || compareCodePoints(a.species_id, b.species_id);

  if (sort === 'name') return byName;
  if (sort === 'plate') {
    return (a, b) => {
      const [plateA, orderA] = plateKey(speciesById.get(a.species_id));
      const [plateB, orderB] = plateKey(speciesById.get(b.species_id));
      return plateA - plateB || orderA - orderB || byName(a, b);
    };
  }
  return (a, b) => b.last_seen.localeCompare(a.last_seen) || byName(a, b);
}

export function lifeListRows(
  sightings: readonly SightingInput[],
  species: readonly Species[],
  { sort, filters, language }: Options,
): LifeListRow[] {
  const speciesById = new Map(species.map((item) => [item.species_id, item]));
  const rows: LifeListRow[] = [];
  for (const [speciesId, group] of bySpecies(sightings)) {
    const known = speciesById.get(speciesId);
    // A species outside the guide has no occurrence code, so any filter hides it.
    if (known ? !matchesFilters(known, filters) : filters.length > 0) continue;
    rows.push(toRow(speciesId, group, known !== undefined));
  }
  return rows.sort(compareRows(sort, language, speciesById));
}

function emptyCodeCounts(): Record<OccurrenceCode, number> {
  return { E: 0, R: 0, M: 0, 'R/M': 0, 'R+M': 0, 'R+(M)': 0 };
}

export function lifeListSummary(
  sightings: readonly SightingInput[],
  species: readonly Species[],
): LifeListSummary {
  const speciesById = new Map(species.map((item) => [item.species_id, item]));
  const groups = bySpecies(sightings);
  const byCode = emptyCodeCounts();
  let sightingCount = 0;
  let unknown = 0;
  for (const [speciesId, group] of groups) {
    sightingCount += group.length;
    const known = speciesById.get(speciesId);
    if (known) byCode[known.occurrence_code] += 1;
    else unknown += 1;
  }
  return {
    species: groups.size,
    sightings: sightingCount,
    endemics: byCode[ENDEMIC_CODE],
    endemicsTotal: species.filter((item) => item.occurrence_code === ENDEMIC_CODE).length,
    byCode,
    unknown,
  };
}
