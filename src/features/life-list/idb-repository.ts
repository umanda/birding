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

// Numbered, forward-only. The IndexedDB version is the number of migrations, so
// migration N runs when a database is opened at version N-1 or lower. Never edit one
// that has shipped: append a new one.
export const migrations: ((db: SightingsDb) => void)[] = [
  // 0001_init
  (db) => {
    const store = db.createObjectStore(STORE, { keyPath: 'id' });
    store.createIndex('species_id', 'species_id');
  },
];

// Rejects with a clear error when the browser will not open IndexedDB
// (storage disabled, some private modes). The provider catches it and falls back to memory.
export async function openSightingsDb(dbName: string): Promise<SightingsDb> {
  try {
    return await openDB<SightingsSchema>(dbName, migrations.length, {
      upgrade: (db, oldVersion) => {
        migrations.slice(oldVersion).forEach((migrate) => migrate(db));
      },
    });
  } catch (cause) {
    throw new Error(`Browser storage is unavailable, sightings cannot be saved: ${String(cause)}`, {
      cause,
    });
  }
}

export type IdbRepository = LifeListRepository & { close: () => void };

export async function createIdbRepository({
  dbName,
  deps = defaultDeps,
}: {
  dbName: string;
  deps?: RepositoryDeps;
}): Promise<IdbRepository> {
  const db = await openSightingsDb(dbName);

  async function readLive(id: string): Promise<Sighting | null> {
    const row: unknown = await db.get(STORE, id);
    return isSighting(row) && isLive(row) ? row : null;
  }

  return {
    close: () => db.close(),
    list: async () => {
      const rows: unknown[] = await db.getAll(STORE);
      return rows.filter(isSighting).filter(isLive).sort(newestFirst);
    },
    get: readLive,
    add: async (input) => {
      const sighting = buildSighting(input, deps);
      await db.put(STORE, sighting);
      return sighting;
    },
    update: async (id, changes) => {
      const current = await readLive(id);
      if (!current) throw new Error(`sighting ${id} not found`);
      const updated = applyChanges(current, changes, deps.now());
      await db.put(STORE, updated);
      return updated;
    },
    remove: async (id) => {
      const current = await readLive(id);
      if (current) await db.put(STORE, markDeleted(current, deps.now()));
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
