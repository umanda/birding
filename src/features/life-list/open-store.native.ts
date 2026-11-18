import { randomUUID } from 'expo-crypto';
import { openDatabaseAsync } from 'expo-sqlite';

import { defaultDeps, type LifeListRepository } from './life-list-repository';
import { createSqliteRepository } from './sqlite-repository';

const DB_NAME = 'life-list.db';

// Hermes has no global crypto, so ids come from expo-crypto.
export async function openStore(): Promise<LifeListRepository> {
  const db = await openDatabaseAsync(DB_NAME);
  return createSqliteRepository({ db, deps: { ...defaultDeps, newId: randomUUID } });
}
