import type { PhotoPack } from './photo-pack';
import { photoPack } from './photo-pack.web';

const ok = (): Response => new Response('x', { status: 200 });

function installCaches(stored: Map<string, Response>): void {
  const cache = {
    put: jest.fn(async (url: string, response: Response) => void stored.set(url, response)),
    keys: jest.fn(async () => [...stored.keys()].map((url) => ({ url: `http://x${url}` }))),
  };
  Object.assign(globalThis, { caches: { open: async () => cache } });
}

const signal = (): AbortSignal => new AbortController().signal;

describe('web photo pack', () => {
  const persist = jest.fn(async () => true);
  beforeEach(() => {
    Object.assign(globalThis, { navigator: { storage: { persist } } });
  });

  it('caches 200 responses, reports progress', async () => {
    const stored = new Map<string, Response>();
    installCaches(stored);
    Object.assign(globalThis, { fetch: jest.fn(async () => ok()) });
    const progress: number[] = [];
    const result = await photoPack.download(['/a', '/b'], {
      signal: signal(),
      onProgress: (n) => progress.push(n),
    });
    expect(result).toBe('done');
    expect(progress).toEqual([1, 2]);
    expect([...(await photoPack.listCachedUrls())]).toEqual(['/a', '/b']);
  });

  it('stops without caching when a response is not 200 or the network fails', async () => {
    const stored = new Map<string, Response>();
    installCaches(stored);
    Object.assign(globalThis, {
      fetch: jest.fn().mockResolvedValueOnce(ok()).mockRejectedValueOnce(new TypeError('offline')),
    });
    const result = await photoPack.download(['/a', '/b', '/c'], {
      signal: signal(),
      onProgress: () => undefined,
    });
    expect(result).toBe('interrupted');
    expect([...stored.keys()]).toEqual(['/a']);
  });

  it('stops cleanly when cancelled', async () => {
    installCaches(new Map());
    const controller = new AbortController();
    Object.assign(globalThis, { fetch: jest.fn(async () => ok()) });
    const result = await photoPack.download(['/a', '/b'], {
      signal: controller.signal,
      onProgress: () => controller.abort(),
    });
    expect(result).toBe('cancelled');
  });

  it('requests persistent storage once across downloads', async () => {
    installCaches(new Map());
    Object.assign(globalThis, { fetch: jest.fn(async () => ok()) });
    persist.mockClear();
    // A fresh module copy, because the "already asked" flag lives at module level.
    let fresh!: PhotoPack;
    jest.isolateModules(() => {
      fresh = jest.requireActual<{ photoPack: PhotoPack }>('./photo-pack.web').photoPack;
    });
    const options = { signal: signal(), onProgress: () => undefined };
    await fresh.download([], options);
    await fresh.download([], options);
    expect(persist).toHaveBeenCalledTimes(1);
  });

  it('is interrupted, not thrown, when the cache cannot be opened', async () => {
    Object.assign(globalThis, {
      caches: { open: async () => Promise.reject(new Error('blocked')) },
    });
    const result = await photoPack.download(['/a'], {
      signal: signal(),
      onProgress: () => undefined,
    });
    expect(result).toBe('interrupted');
    expect((await photoPack.listCachedUrls()).size).toBe(0);
  });
});
