import { defaultDeps, type LifeListRepository, type RepositoryDeps } from './life-list-repository';
import {
  cleanFields,
  findFieldsError,
  isSighting,
  toLocalDate,
  type CleanFields,
  type Sighting,
  type SightingFields,
  type SightingInput,
} from './sighting';

function checkedFields(fields: SightingFields, now: Date): CleanFields {
  const clean = cleanFields(fields);
  const problem = findFieldsError(clean, toLocalDate(now));
  if (problem) throw new Error(problem);
  return clean;
}

function checkedInput(input: SightingInput, now: Date): CleanFields {
  if (!input.species_id) throw new Error('species_id is required');
  if (!input.content_version) throw new Error('content_version is required');
  return checkedFields(input, now);
}

const newestFirst = (a: Sighting, b: Sighting): number =>
  b.seen_on.localeCompare(a.seen_on) || b.created_at.localeCompare(a.created_at);

// `rows` is untrusted, like data read from disk: invalid rows are skipped on read.
// Rows are copied in and out, so callers cannot change the store by mutating what they hold.
export function createMemoryRepository(
  rows: unknown[] = [],
  deps: RepositoryDeps = defaultDeps,
): LifeListRepository {
  const store = new Map<string, unknown>();
  const put = (row: unknown): void => {
    if (typeof row === 'object' && row !== null && 'id' in row)
      store.set(String(row.id), { ...row });
  };
  rows.forEach(put);

  const live = (): Sighting[] =>
    [...store.values()].filter(isSighting).filter((row) => row.deleted_at === null);
  const find = (id: string): Sighting | null => live().find((row) => row.id === id) ?? null;

  return {
    list: async () =>
      live()
        .sort(newestFirst)
        .map((row) => ({ ...row })),
    get: async (id) => {
      const row = find(id);
      return row && { ...row };
    },
    add: async (input) => {
      const now = deps.now();
      const stamp = now.toISOString();
      const sighting: Sighting = {
        ...checkedInput(input, now),
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
      put(sighting);
      return { ...sighting };
    },
    update: async (id, changes) => {
      const current = find(id);
      if (!current) throw new Error(`sighting ${id} not found`);
      const now = deps.now();
      const fields = checkedFields({ ...current, ...changes }, now);
      const updated = { ...current, ...fields, updated_at: now.toISOString() };
      put(updated);
      return { ...updated };
    },
    remove: async (id) => {
      const current = find(id);
      if (!current) return;
      const stamp = deps.now().toISOString();
      put({ ...current, deleted_at: stamp, updated_at: stamp });
    },
    removeAllUnsynced: async () => {
      for (const [id, row] of store) {
        if (!isSighting(row) || row.synced_at === null) store.delete(id);
      }
    },
  };
}
