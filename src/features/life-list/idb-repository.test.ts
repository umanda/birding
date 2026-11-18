import 'fake-indexeddb/auto';
import { deleteDB, openDB } from 'idb';
import { describeLifeListRepository } from './life-list-repository.contract';
import {
  createIdbRepository,
  migrations,
  openSightingsDb,
  requestPersistentStorage,
} from './idb-repository';
import type { RepositoryDeps } from './life-list-repository';

let counter = 0;
const uniqueName = (): string => `life-list-test-${++counter}`;

async function seed(dbName: string, rows: unknown[]): Promise<void> {
  const db = await openSightingsDb(dbName);
  for (const row of rows) await db.put('sightings', row);
  db.close();
}

describeLifeListRepository('idb', async (seedRows, deps) => {
  const dbName = uniqueName();
  await seed(dbName, seedRows);
  const repository = await createIdbRepository({ dbName, deps });
  return {
    repository,
    cleanup: async () => {
      repository.close();
      await deleteDB(dbName);
    },
  };
});

describe('idb migrations', () => {
  it('0001_init creates the sightings store keyed by id with a species_id index', async () => {
    const dbName = uniqueName();
    const db = await openSightingsDb(dbName);
    expect(db.version).toBe(migrations.length);
    expect([...db.objectStoreNames]).toEqual(['sightings']);
    const tx = db.transaction('sightings');
    expect(tx.store.keyPath).toBe('id');
    expect([...tx.store.indexNames]).toEqual(['species_id']);
    db.close();
    await deleteDB(dbName);
  });

  it('keeps existing rows when an already-migrated database is reopened', async () => {
    const dbName = uniqueName();
    await seed(dbName, [{ id: 'kept' }]);
    const db = await openSightingsDb(dbName);
    expect(await db.get('sightings', 'kept')).toEqual({ id: 'kept' });
    db.close();
    await deleteDB(dbName);
  });

  it('runs only the migrations newer than the stored version', async () => {
    const dbName = uniqueName();
    const old = await openDB(dbName, 1, { upgrade: (db) => void db.createObjectStore('other') });
    old.close();
    const second = jest.fn();
    migrations.push(second);
    try {
      const db = await openSightingsDb(dbName);
      expect(db.version).toBe(2);
      expect(second).toHaveBeenCalledTimes(1);
      db.close();
    } finally {
      migrations.pop();
      await deleteDB(dbName);
    }
  });
});

describe('idb raw rows', () => {
  it('remove keeps the row, sets deleted_at and bumps updated_at', async () => {
    const dbName = uniqueName();
    const clock = { now: new Date(2026, 10, 18, 9) };
    const deps: RepositoryDeps = { newId: () => 'a', now: () => clock.now };
    const repo = await createIdbRepository({ dbName, deps });
    await repo.add({ species_id: 's', seen_on: '2026-11-10', content_version: 'v1' });
    clock.now = new Date(2026, 10, 18, 12);
    await repo.remove('a');
    repo.close();

    const db = await openSightingsDb(dbName);
    const stamp = clock.now.toISOString();
    expect(await db.get('sightings', 'a')).toMatchObject({ deleted_at: stamp, updated_at: stamp });
    db.close();
    await deleteDB(dbName);
  });
});

describe('storage blocked', () => {
  afterEach(() => jest.restoreAllMocks());

  it('rejects with a clear error when IndexedDB cannot be opened', async () => {
    jest.spyOn(indexedDB, 'open').mockImplementation(() => {
      throw new DOMException('denied', 'SecurityError');
    });
    await expect(createIdbRepository({ dbName: uniqueName() })).rejects.toThrow(
      /Browser storage is unavailable/,
    );
  });
});

describe('requestPersistentStorage', () => {
  const setStorage = (storage: unknown): void => {
    Object.defineProperty(navigator, 'storage', { value: storage, configurable: true });
  };
  // A fresh module copy, because the "already asked" flag lives at module level.
  const freshRequest = (): typeof requestPersistentStorage => {
    let request = requestPersistentStorage;
    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      request = require('./idb-repository').requestPersistentStorage;
    });
    return request;
  };

  it('asks once, however often it is called', async () => {
    const persist = jest.fn().mockResolvedValue(true);
    setStorage({ persist });
    const request = freshRequest();
    await request();
    await request();
    expect(persist).toHaveBeenCalledTimes(1);
  });

  it('ignores a refusal and a missing API', async () => {
    setStorage({ persist: () => Promise.reject(new Error('no')) });
    await expect(freshRequest()()).resolves.toBeUndefined();
    setStorage(undefined);
    await expect(freshRequest()()).resolves.toBeUndefined();
  });
});
