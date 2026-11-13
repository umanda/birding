import type { KeyValueStore } from './types';

type WebStorage = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
};

/** Storage can throw (e.g. Safari private mode), and persistence is best-effort, so never reject. */
export function createWebStorageStore(storage: WebStorage): KeyValueStore {
  return {
    getItem: (key) => {
      try {
        return Promise.resolve(storage.getItem(key));
      } catch {
        return Promise.resolve(null);
      }
    },
    setItem: (key, value) => {
      try {
        storage.setItem(key, value);
      } catch {
        // Ignored on purpose: the setting just won't survive a restart.
      }
      return Promise.resolve();
    },
  };
}
