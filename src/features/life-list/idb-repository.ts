import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import { defaultDeps, type LifeListRepository, type RepositoryDeps } from './life-list-repository';
import { applyChanges, buildSighting, isLive, markDeleted, newestFirst } from './repository-rules';
import { isSighting, type Sighting } from './sighting';

// Web only. Native uses SQLite; the provider (slice 5) picks the store per platform.

const STORE = 'sightings';

type SightingsSchema = DBSchema & {
  sightings: { key: string; value: unknown; indexes: { species_id: string } };
};
type SightingsDb = IDBPDatabase<SightingsSchema>;
type Migration = (db: SightingsDb) => void;

// Numbered, forward-only. The IndexedDB version is the number of migrations, so
// migration N runs when a database is opened at version N-1 or lower. Never edit one
// that has shipped: append a new one.
export const migrations: Migration[] = [
  // 0001_init
  (db) => {
    const store = db.createObjectStore(STORE, { keyPath: 'id' });
    store.createIndex('species_id', 'species_id');
  },
];

// Rejects with a clear error when the browser will not open IndexedDB (storage disabled,
// some private modes) or when another tab already upgraded it. The provider catches it.
// `steps` is a parameter so tests can add a migration without changing the real list.
export async function openSightingsDb(
  dbName: string,
  steps: Migration[] = migrations,
): Promise<SightingsDb> {
  try {
    const db: SightingsDb = await openDB<SightingsSchema>(dbName, steps.length, {
      upgrade: (upgrading, oldVersion) =>
        steps.slice(oldVersion).forEach((migrate) => migrate(upgrading)),
      // Do not hold up another tab that needs to upgrade.
      blocking: () => db.close(),
      terminated: () => db.close(),
    });
    return db;
  } catch (cause) {
    const reason =
      cause instanceof Error && cause.name === 'VersionError'
        ? 'This page is out of date, reload it'
        : 'Browser storage is unavailable, sightings cannot be saved';
    throw new Error(`${reason}: ${String(cause)}`, { cause });
  }
}

export type IdbRepository = LifeListRepository & { close: () => void };

const asLive = (row: unknown): Sighting | null => (isSighting(row) && isLive(row) ? row : null);

export async function createIdbRepository({
  dbName,
  deps = defaultDeps,
}: {
  dbName: string;
  deps?: RepositoryDeps;
}): Promise<IdbRepository> {
  const db = await openSightingsDb(dbName);

  return {
    close: () => db.close(),
    list: async () => {
      const rows: unknown[] = await db.getAll(STORE);
      return rows.flatMap((row) => asLive(row) ?? []).sort(newestFirst);
    },
    get: async (id) => asLive(await db.get(STORE, id)),
    add: async (input) => {
      const sighting = buildSighting(input, deps);
      await db.put(STORE, sighting);
      void requestPersistentStorage();
      return sighting;
    },
    // Read and write share one transaction with no other await between them, so a
    // concurrent remove cannot be overwritten by a stale update.
    update: async (id, changes) => {
      const tx = db.transaction(STORE, 'readwrite');
      const current = asLive(await tx.store.get(id));
      if (!current) throw new Error(`sighting ${id} not found`);
      const updated = applyChanges(current, changes, deps.now());
      await tx.store.put(updated);
      await tx.done;
      return updated;
    },
    remove: async (id) => {
      const tx = db.transaction(STORE, 'readwrite');
      const current = asLive(await tx.store.get(id));
      if (current) await tx.store.put(markDeleted(current, deps.now()));
      await tx.done;
    },
    removeAllUnsynced: async () => {
      const tx = db.transaction(STORE, 'readwrite');
      for (let cursor = await tx.store.openCursor(); cursor; cursor = await cursor.continue()) {
        const row: unknown = cursor.value;
        if (!isSighting(row) || row.synced_at === null) await cursor.delete();
      }
      await tx.done;
    },
  };
}

let persistRequested = false;

// Asks the browser not to evict our data. A refusal or missing API must never block saving.
export async function requestPersistentStorage(): Promise<void> {
  if (persistRequested) return;
  persistRequested = true;
  try {
    await navigator.storage.persist();
  } catch {
    // Best effort only.
  }
}
