import { randomUUID } from 'expo-crypto';
import { openDatabaseAsync } from 'expo-sqlite';

import type { LifeListRepository } from './life-list-repository';
import { createSqliteRepository } from './sqlite-repository';

const DATABASE_NAME = 'life-list.db';

// Hermes has no global crypto (neither React Native nor Expo polyfills it), so ids come from
// expo-crypto's native randomUUID.
export async function openNativeLifeList(): Promise<LifeListRepository> {
  const db = await openDatabaseAsync(DATABASE_NAME);
  return createSqliteRepository({ db, deps: { newId: randomUUID, now: () => new Date() } });
}
