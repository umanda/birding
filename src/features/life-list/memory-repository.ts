import { defaultDeps, type LifeListRepository, type RepositoryDeps } from './life-list-repository';
import { applyChanges, buildSighting, isLive, markDeleted, newestFirst } from './repository-rules';
import { isSighting, type Sighting } from './sighting';

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

  const live = (): Sighting[] => [...store.values()].filter(isSighting).filter(isLive);
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
      const sighting = buildSighting(input, deps);
      put(sighting);
      return { ...sighting };
    },
    update: async (id, changes) => {
      const current = find(id);
      if (!current) throw new Error(`sighting ${id} not found`);
      const updated = applyChanges(current, changes, deps.now());
      put(updated);
      return { ...updated };
    },
    remove: async (id) => {
      const current = find(id);
      if (current) put(markDeleted(current, deps.now()));
    },
    removeAllUnsynced: async () => {
      for (const [id, row] of store) {
        if (!isSighting(row) || row.synced_at === null) store.delete(id);
      }
    },
  };
}
