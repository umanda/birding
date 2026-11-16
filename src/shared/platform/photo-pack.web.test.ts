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

  it('caches 200 responses, reports progress and requests persistence once', async () => {
    const stored = new Map<string, Response>();
    installCaches(stored);
    Object.assign(globalThis, { fetch: jest.fn(async () => ok()) });
    const progress: number[] = [];
    const result = await photoPack.download(['/a', '/b'], {
      signal: signal(),
      onProgress: (n) => progress.push(n),
    });
    await photoPack.download([], { signal: signal(), onProgress: () => undefined });
    expect(result).toBe('done');
    expect(progress).toEqual([1, 2]);
    expect([...(await photoPack.listCachedUrls())]).toEqual(['/a', '/b']);
    expect(persist).toHaveBeenCalledTimes(1);
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
});
