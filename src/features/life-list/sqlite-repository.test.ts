import { DatabaseSync } from 'node:sqlite';

import type { SQLiteDatabase } from 'expo-sqlite';

import { describeLifeListRepository } from './life-list-repository.contract';
import { COLUMNS, MIGRATIONS, createSqliteRepository, migrate } from './sqlite-repository';

// node:sqlite stands in for expo-sqlite: same engine and SQL, only the async wrapper differs.
// Only the methods the repository uses are implemented.
type SqlValue = string | number | null;
const bindings = (params: unknown[]): SqlValue[] => params.flat() as SqlValue[];

function fakeDb(): { db: SQLiteDatabase; raw: DatabaseSync } {
  const raw = new DatabaseSync(':memory:');
  const fake = {
    execAsync: async (sql: string) => raw.exec(sql),
    runAsync: async (sql: string, ...params: unknown[]) => {
      raw.prepare(sql).run(...bindings(params));
    },
    getAllAsync: async (sql: string, ...params: unknown[]) =>
      raw.prepare(sql).all(...bindings(params)),
    getFirstAsync: async (sql: string, ...params: unknown[]) =>
      raw.prepare(sql).get(...bindings(params)) ?? null,
    withTransactionAsync: async (task: () => Promise<void>) => {
      raw.exec('BEGIN');
      try {
        await task();
        raw.exec('COMMIT');
      } catch (error) {
        raw.exec('ROLLBACK');
        throw error;
      }
    },
  };
  return { db: fake as unknown as SQLiteDatabase, raw };
}

const isColumn = (name: string): boolean => COLUMNS.some((column) => column === name);

const NUMERIC = ['count', 'lat_rounded', 'lon_rounded'];

// A TEXT column turns a stored number into text, so such a row can never exist on disk. Skipping it
// here keeps the shared "wrong shape" case honest instead of passing for the wrong reason.
const fitsColumns = (entries: [string, unknown][]): boolean =>
  entries.every(
    ([key, v]) => NUMERIC.includes(key) || !isColumn(key) || v === null || typeof v === 'string',
  );

// Seeds like a newer app version would: known fields to columns, the rest into `extra`.
function seed(raw: DatabaseSync, rows: unknown[]): void {
  for (const row of rows) {
    if (typeof row !== 'object' || row === null) continue;
    const entries = Object.entries(row);
    if (!fitsColumns(entries)) continue;
    const known = entries.filter(([key]) => isColumn(key));
    const extra = Object.fromEntries(entries.filter(([key]) => !isColumn(key)));
    const names = [...known.map(([key]) => key), 'extra'];
    const values = [...known.map(([, value]) => value), JSON.stringify(extra)] as SqlValue[];
    const marks = names.map(() => '?').join(', ');
    raw.prepare(`INSERT INTO sightings (${names.join(', ')}) VALUES (${marks})`).run(...values);
  }
}

describeLifeListRepository('sqlite', async (seedRows, deps) => {
  const { db, raw } = fakeDb();
  await migrate(db);
  seed(raw, seedRows);
  return { repository: createSqliteRepository({ db, deps }), cleanup: async () => raw.close() };
});

const OLD_ROW = {
  id: 'a',
  species_id: 's',
  seen_on: '2026-11-10',
  content_version: 'v1',
  created_at: '2026-11-10T08:00:00.000Z',
  updated_at: '2026-11-10T08:00:00.000Z',
};

describe('sqlite migrations', () => {
  it('0001_init sets user_version, adds the species index and is not applied twice', async () => {
    const { db, raw } = fakeDb();
    await migrate(db);
    await migrate(db);
    expect(raw.prepare('PRAGMA user_version').get()).toEqual({ user_version: MIGRATIONS.length });
    const indexes = raw.prepare("SELECT name FROM sqlite_master WHERE type = 'index'").all();
    expect(indexes).toContainEqual({ name: 'sightings_species_id' });
  });

  it('keeps existing rows when the repository opens an already migrated database', async () => {
    const { db, raw } = fakeDb();
    await migrate(db);
    seed(raw, [OLD_ROW]);
    const repo = createSqliteRepository({ db, deps: { newId: () => 'x', now: () => new Date() } });
    expect((await repo.list()).map((s) => s.id)).toEqual(['a']);
  });

  it('refuses a database from a newer app', async () => {
    const { db, raw } = fakeDb();
    raw.exec(`PRAGMA user_version = ${MIGRATIONS.length + 1}`);
    await expect(migrate(db)).rejects.toThrow(/newer/);
  });

  it('rolls back a failed migration', async () => {
    const { db, raw } = fakeDb();
    raw.exec('CREATE TABLE sightings (id TEXT)'); // makes 0001 fail
    await expect(migrate(db)).rejects.toThrow();
    expect(raw.prepare('PRAGMA user_version').get()).toEqual({ user_version: 0 });
  });
});
