import type { Sighting, SightingFields, SightingInput } from './sighting';

// Same contract for every store (memory, idb, sqlite). Methods reject with an Error on invalid input.
export type LifeListRepository = {
  /** Rows that are not soft-deleted, newest `seen_on` first (ties: newest `created_at`). */
  list: () => Promise<Sighting[]>;
  /** Null when missing or soft-deleted. */
  get: (id: string) => Promise<Sighting | null>;
  add: (input: SightingInput) => Promise<Sighting>;
  /**
   * Bumps `updated_at`. Only the editable fields change: `id`, `species_id` and `created_at`
   * cannot. A field set to undefined, null or blank text is cleared to null; a field left out
   * is unchanged. Rejects if the sighting is missing or deleted.
   */
  update: (id: string, changes: Partial<SightingFields>) => Promise<Sighting>;
  /** Soft delete: sets `deleted_at` and bumps `updated_at`. A missing or deleted row is a no-op. */
  remove: (id: string) => Promise<void>;
  /** Removes rows from storage where `synced_at` is null (every row in M6). */
  removeAllUnsynced: () => Promise<void>;
};

// Injected so tests control ids and the clock.
export type RepositoryDeps = {
  newId: () => string;
  now: () => Date;
};

type UuidSource = Pick<Crypto, 'getRandomValues'> & Partial<Pick<Crypto, 'randomUUID'>>;

const toHex = (byte: number): string => byte.toString(16).padStart(2, '0');

// randomUUID is missing in insecure contexts and (unconfirmed, check in slice 4) on Hermes.
export function randomUuid(source: UuidSource = globalThis.crypto): string {
  if (typeof source.randomUUID === 'function') return source.randomUUID();
  const bytes = source.getRandomValues(new Uint8Array(16));
  bytes[6] = ((bytes[6] ?? 0) & 0x0f) | 0x40; // version 4
  bytes[8] = ((bytes[8] ?? 0) & 0x3f) | 0x80; // RFC 4122 variant
  const hex = Array.from(bytes, toHex).join('');
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20),
  ].join('-');
}

export const defaultDeps: RepositoryDeps = { newId: () => randomUuid(), now: () => new Date() };
