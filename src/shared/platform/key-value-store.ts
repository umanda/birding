import { createWebStorageStore } from './web-storage-store';

// Default (web) implementation; key-value-store.native.ts overrides it on devices.
// localStorage avoids shipping the SQLite wasm bundle just for one setting.
export const keyValueStore = createWebStorageStore({
  getItem: (key) => window.localStorage.getItem(key),
  setItem: (key, value) => window.localStorage.setItem(key, value),
});
