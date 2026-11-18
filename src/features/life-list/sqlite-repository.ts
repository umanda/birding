import type { SQLiteDatabase } from 'expo-sqlite';

import type { LifeListRepository, RepositoryDeps } from './life-list-repository';
import { checkedFields, checkedInput } from './memory-repository';
import { isSighting, type Sighting } from './sighting';

// Forward-only. Entry N takes the database to `PRAGMA user_version = N`. Never edit a shipped one.
// `extra` keeps JSON for fields this app version does not know, so a newer version's data survives.
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
const NEWEST_FIRST = 'ORDER BY seen_on DESC, created_at DESC';

export async function migrate(db: SQLiteDatabase): Promise<void> {
  const found = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  const version = found?.user_version ?? 0;
  if (version > MIGRATIONS.length) {
    throw new Error(`life list database version ${version} is newer than this app`);
  }
  for (let next = version + 1; next <= MIGRATIONS.length; next++) {
    await db.withTransactionAsync(async () => {
      await db.execAsync(MIGRATIONS[next - 1] ?? '');
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

export function createSqliteRepository({
  db,
  deps,
}: {
  db: SQLiteDatabase;
  deps: RepositoryDeps;
}): LifeListRepository {
  // Pending migrations run once, before the first query.
  const ready = migrate(db);

  const find = async (id: string): Promise<Sighting | null> => {
    await ready;
    const row = await db.getFirstAsync<Row>(
      'SELECT * FROM sightings WHERE id = ? AND deleted_at IS NULL',
      id,
    );
    return row ? toSighting(row) : null;
  };

  return {
    list: async () => {
      await ready;
      const sql = `SELECT * FROM sightings WHERE deleted_at IS NULL ${NEWEST_FIRST}`;
      return (await db.getAllAsync<Row>(sql))
        .map(toSighting)
        .filter((s): s is Sighting => s !== null);
    },
    get: find,
    add: async (input) => {
      await ready;
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
      const now = deps.now();
      const fields = checkedFields({ ...current, ...changes }, now);
      const updated: Sighting = { ...current, ...fields, updated_at: now.toISOString() };
      const assignments = EDITABLE.map((column) => `${column} = ?`).join(', ');
      await db.runAsync(`UPDATE sightings SET ${assignments} WHERE id = ?`, [
        ...EDITABLE.map((column) => updated[column]),
        id,
      ]);
      return updated;
    },
    remove: async (id) => {
      if (!(await find(id))) return;
      const stamp = deps.now().toISOString();
      await db.runAsync('UPDATE sightings SET deleted_at = ?, updated_at = ? WHERE id = ?', [
        stamp,
        stamp,
        id,
      ]);
    },
    removeAllUnsynced: async () => {
      await ready;
      await db.runAsync('DELETE FROM sightings WHERE synced_at IS NULL');
    },
  };
}
