import type { RepositoryDeps } from './life-list-repository';
import {
  cleanFields,
  findFieldsError,
  toLocalDate,
  type CleanFields,
  type Sighting,
  type SightingFields,
  type SightingInput,
} from './sighting';

// Pure rules shared by every store, so memory and idb cannot drift apart.

function checkedFields(fields: SightingFields, now: Date): CleanFields {
  const clean = cleanFields(fields);
  const problem = findFieldsError(clean, toLocalDate(now));
  if (problem) throw new Error(problem);
  return clean;
}

export function buildSighting(input: SightingInput, deps: RepositoryDeps): Sighting {
  if (!input.species_id) throw new Error('species_id is required');
  if (!input.content_version) throw new Error('content_version is required');
  const now = deps.now();
  const stamp = now.toISOString();
  return {
    ...checkedFields(input, now),
    id: deps.newId(),
    species_id: input.species_id,
    lat_rounded: null,
    lon_rounded: null,
    content_version: input.content_version,
    created_at: stamp,
    updated_at: stamp,
    deleted_at: null,
    synced_at: null,
  };
}

export function applyChanges(
  current: Sighting,
  changes: Partial<SightingFields>,
  now: Date,
): Sighting {
  const fields = checkedFields({ ...current, ...changes }, now);
  return { ...current, ...fields, updated_at: now.toISOString() };
}

export function markDeleted(current: Sighting, now: Date): Sighting {
  const stamp = now.toISOString();
  return { ...current, deleted_at: stamp, updated_at: stamp };
}

export const isLive = (row: Sighting): boolean => row.deleted_at === null;

export const newestFirst = (a: Sighting, b: Sighting): number =>
  b.seen_on.localeCompare(a.seen_on) || b.created_at.localeCompare(a.created_at);
