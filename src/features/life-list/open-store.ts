import { createIdbRepository } from './idb-repository';
import type { LifeListRepository } from './life-list-repository';

const DB_NAME = 'sri-lanka-birds-life-list';

// Web default; open-store.native.ts overrides it on devices, so the SQLite wasm stays out of the web bundle.
export function openStore(): Promise<LifeListRepository> {
  return createIdbRepository({ dbName: DB_NAME });
}
