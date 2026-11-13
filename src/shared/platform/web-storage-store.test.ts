import { createWebStorageStore } from './web-storage-store';

const throwingStorage = {
  getItem: (): string | null => {
    throw new Error('SecurityError');
  },
  setItem: (): void => {
    throw new Error('SecurityError');
  },
};

describe('createWebStorageStore', () => {
  it('reads null and ignores writes when storage throws', async () => {
    const store = createWebStorageStore(throwingStorage);
    expect(await store.getItem('k')).toBeNull();
    await expect(store.setItem('k', 'v')).resolves.toBeUndefined();
  });

  it('reads and writes through to storage', async () => {
    const data = new Map<string, string>();
    const store = createWebStorageStore({
      getItem: (key) => data.get(key) ?? null,
      setItem: (key, value) => void data.set(key, value),
    });
    await store.setItem('k', 'v');
    expect(await store.getItem('k')).toBe('v');
  });
});
