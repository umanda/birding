import type { Sighting, SightingFields, SightingInput } from './sighting';

// Same contract for every store (memory, idb, sqlite). Methods reject with an Error on invalid input.
export type LifeListRepository = {
  /** Rows that are not soft-deleted, newest `seen_on` first (ties: newest `created_at`). */
  list: () => Promise<Sighting[]>;
  /** Null when missing or soft-deleted. */
  get: (id: string) => Promise<Sighting | null>;
  add: (input: SightingInput) => Promise<Sighting>;
  /** Bumps `updated_at`. Rejects if the sighting is missing or deleted. */
  update: (id: string, changes: Partial<SightingFields>) => Promise<Sighting>;
  /** Sets `deleted_at`. Deleting a missing or already deleted row is a no-op. */
  softDelete: (id: string) => Promise<void>;
  /** Removes every row from storage (M6 has nothing synced, so no tombstones are needed). */
  deleteAll: () => Promise<void>;
};

// Injected so tests control ids and the clock.
export type RepositoryDeps = {
  newId: () => string;
  now: () => Date;
};

// Follow-up for slice 4: confirm Hermes provides crypto.randomUUID, or use expo-crypto on native.
export function randomUuid(): string {
  return globalThis.crypto.randomUUID();
}

export const defaultDeps: RepositoryDeps = { newId: randomUuid, now: () => new Date() };
