import type { SpeciesTraits } from '../../src/shared/data/traits';
import {
  SIZE_CLASSES,
  type Behaviour,
  type Colour,
  type Commonness,
  type Habitat,
  type SizeClass,
  type Zone,
} from '../../src/shared/data/traits-vocabulary';
import type { TraitRow } from './traits';

export type TraitsFile = { schema_version: 1; species: Record<string, SpeciesTraits> };
const MONTHS = 12;

function values<T extends string>(rows: TraitRow[], trait: string): T[] | undefined {
  const found = rows.filter((r) => r.trait === trait).map((r) => r.value as T);
  return found.length > 0 ? found : undefined;
}

function coloursByPlumage(rows: TraitRow[]): Colour[][] | undefined {
  const groups = new Map<string, Colour[]>();
  for (const r of rows.filter((x) => x.trait === 'colour')) {
    groups.set(r.plumage_key, [...(groups.get(r.plumage_key) ?? []), r.value as Colour]);
  }
  return groups.size > 0 ? [...groups.values()] : undefined;
}

function sizeUnion(rows: TraitRow[]): SizeClass[] | undefined {
  const found = values<SizeClass>(rows, 'size');
  return found ? SIZE_CLASSES.filter((c) => found.includes(c)) : undefined;
}

function monthPresence(rows: TraitRow[]): SpeciesTraits['months'] {
  const listed = values(rows, 'month');
  if (!listed) return undefined;
  const all = listed.includes('all');
  return Array.from({ length: MONTHS }, (_, i) =>
    all || listed.includes(String(i + 1)) ? 'present' : 'absent',
  );
}

function commonnessByZone(rows: TraitRow[]): SpeciesTraits['commonness'] {
  const found = rows.filter((r) => r.trait === 'commonness').map((r) => r.value.split(':'));
  if (found.length === 0) return undefined;
  return Object.fromEntries(found) as Partial<Record<Zone, Commonness>>;
}

function speciesTraits(species_id: string, rows: TraitRow[]): SpeciesTraits {
  const parts = {
    zones: values<Zone>(rows, 'zone'),
    habitats: values<Habitat>(rows, 'habitat'),
    size: sizeUnion(rows),
    colours: coloursByPlumage(rows),
    behaviours: values<Behaviour>(rows, 'behaviour'),
    months: monthPresence(rows),
    commonness: commonnessByZone(rows),
  };
  // Unknown stays missing: no empty arrays and no nulls are written.
  const known = Object.entries(parts).filter(([, v]) => v !== undefined);
  return { species_id, ...Object.fromEntries(known) };
}

// Only reviewed rows ship. Species are sorted by id so the file is deterministic.
export function buildTraits(rows: TraitRow[]): TraitsFile {
  const reviewed = rows.filter((r) => r.review_status === 'reviewed');
  const ids = [...new Set(reviewed.map((r) => r.species_id))].sort();
  const species = Object.fromEntries(
    ids.map((id) => [id, speciesTraits(id, reviewed.filter((r) => r.species_id === id))]),
  );
  return { schema_version: 1, species };
}
