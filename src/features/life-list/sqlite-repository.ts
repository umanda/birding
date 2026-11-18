import type { SQLiteDatabase } from 'expo-sqlite';

import type { LifeListRepository, RepositoryDeps } from './life-list-repository';
import { applyChanges, buildSighting, markDeleted } from './repository-rules';
import { isSighting, type Sighting } from './sighting';

// Forward-only. Entry N takes the database to `PRAGMA user_version = N`. Never edit a shipped one.
// `extra` holds JSON for fields this app version does not know. It is filled when rows arrive from
// a newer client (sync), so their data survives an edit here. A migration that promotes a key out of
// `extra` into a column must copy it (json_extract) and then remove it (json_remove).
export const MIGRATIONS: readonly string[] = [
  `CREATE TABLE sightings (
     id TEXT PRIMARY KEY NOT NULL,
     species_id TEXT NOT NULL,
     seen_on TEXT NOT NULL,
     place_name TEXT,
     zone TEXT,
     count INTEGER,
     note TEXT,
     lat_rounded REAL,
     lon_rounded REAL,
     content_version TEXT NOT NULL,
     created_at TEXT NOT NULL,
     updated_at TEXT NOT NULL,
     deleted_at TEXT,
     synced_at TEXT,
     extra TEXT
   );
   CREATE INDEX sightings_species_id ON sightings (species_id);`,
];

type Row = Record<string, unknown>;

export const COLUMNS = [
  'id',
  'species_id',
  'seen_on',
  'place_name',
  'zone',
  'count',
  'note',
  'lat_rounded',
  'lon_rounded',
  'content_version',
  'created_at',
  'updated_at',
  'deleted_at',
  'synced_at',
] as const;
const EDITABLE = ['seen_on', 'place_name', 'zone', 'count', 'note', 'updated_at'] as const;
const NEWEST_FIRST = 'ORDER BY seen_on DESC, created_at DESC, id DESC';

function migrationSql(version: number): string {
  const sql = MIGRATIONS[version - 1];
  if (!sql) throw new Error(`life list migration ${version} has no SQL`);
  return sql;
}

export async function migrate(db: SQLiteDatabase): Promise<void> {
  const found = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  const version = found?.user_version ?? 0;
  if (version > MIGRATIONS.length) {
    throw new Error(`life list database version ${version} is newer than this app`);
  }
  for (let next = version + 1; next <= MIGRATIONS.length; next++) {
    await db.withTransactionAsync(async () => {
      await db.execAsync(migrationSql(next));
      await db.execAsync(`PRAGMA user_version = ${next}`);
    });
  }
}

function parseExtra(extra: unknown): Row {
  if (typeof extra !== 'string') return {};
  try {
    const parsed: unknown = JSON.parse(extra);
    return typeof parsed === 'object' && parsed !== null ? (parsed as Row) : {};
  } catch {
    return {}; // unreadable extra must not hide the known columns
  }
}

// Known columns win over extra, so extra can never overwrite a real field.
function toSighting(row: Row): Sighting | null {
  const { extra, ...columns } = row;
  const sighting = { ...parseExtra(extra), ...columns };
  return isSighting(sighting) ? sighting : null;
}

export async function createSqliteRepository({
  db,
  deps,
}: {
  db: SQLiteDatabase;
  deps: RepositoryDeps;
}): Promise<LifeListRepository> {
  await migrate(db); // a failed or too-new database rejects here, at open

  const find = async (id: string): Promise<Sighting | null> => {
    const row = await db.getFirstAsync<Row>(
      'SELECT * FROM sightings WHERE id = ? AND deleted_at IS NULL',
      id,
    );
    return row ? toSighting(row) : null;
  };

  return {
    list: async () => {
      const sql = `SELECT * FROM sightings WHERE deleted_at IS NULL ${NEWEST_FIRST}`;
      return (await db.getAllAsync<Row>(sql))
        .map(toSighting)
        .filter((s): s is Sighting => s !== null);
    },
    get: find,
    add: async (input) => {
      const sighting = buildSighting(input, deps);
      const marks = COLUMNS.map(() => '?').join(', ');
      await db.runAsync(
        `INSERT INTO sightings (${COLUMNS.join(', ')}) VALUES (${marks})`,
        COLUMNS.map((column) => sighting[column]),
      );
      return sighting;
    },
    update: async (id, changes) => {
      const current = await find(id);
      if (!current) throw new Error(`sighting ${id} not found`);
      const updated = applyChanges(current, changes, deps.now());
      const assignments = EDITABLE.map((column) => `${column} = ?`).join(', ');
      await db.runAsync(`UPDATE sightings SET ${assignments} WHERE id = ? AND deleted_at IS NULL`, [
        ...EDITABLE.map((column) => updated[column]),
        id,
      ]);
      return updated;
    },
    remove: async (id) => {
      const current = await find(id);
      if (!current) return;
      const { deleted_at, updated_at } = markDeleted(current, deps.now());
      await db.runAsync('UPDATE sightings SET deleted_at = ?, updated_at = ? WHERE id = ?', [
        deleted_at,
        updated_at,
        id,
      ]);
    },
    removeAllUnsynced: async () => {
      await db.runAsync('DELETE FROM sightings WHERE synced_at IS NULL');
    },
  };
}
