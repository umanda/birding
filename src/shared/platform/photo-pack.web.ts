import type { DownloadOptions, PackResult, PhotoPack } from './photo-pack';

const PHOTO_CACHE_NAME = 'photos-v1'; // must match runtimeCaching in tools/pwa/build-sw.ts
const HTTP_OK = 200;

let persistRequested = false;

// Asks the browser not to evict the saved photos. Best effort, so failures are ignored.
function requestPersistence(): void {
  if (persistRequested) return;
  persistRequested = true;
  navigator.storage?.persist?.().catch(() => undefined);
}

// Unreadable storage (private mode, blocked) counts as nothing saved.
async function listCachedUrls(): Promise<ReadonlySet<string>> {
  try {
    const cache = await caches.open(PHOTO_CACHE_NAME);
    const requests = await cache.keys();
    return new Set(requests.map((request) => new URL(request.url).pathname));
  } catch {
    return new Set();
  }
}

// Sequential on purpose: one failure (offline) stops cleanly and a retry resumes.
// Entries written here are not counted by the worker's Workbox expiration (maxEntries).
async function download(
  urls: readonly string[],
  { signal, onProgress }: DownloadOptions,
): Promise<PackResult> {
  requestPersistence();
  let done = 0;
  try {
    const cache = await caches.open(PHOTO_CACHE_NAME);
    for (const url of urls) {
      if (signal.aborted) return 'cancelled';
      const response = await fetch(url, { signal });
      if (response.status !== HTTP_OK) return 'interrupted';
      await cache.put(url, response);
      done += 1;
      onProgress(done);
    }
  } catch {
    return signal.aborted ? 'cancelled' : 'interrupted';
  }
  return 'done';
}

export const photoPack: PhotoPack = {
  isSupported: () => typeof caches !== 'undefined',
  listCachedUrls,
  download,
};
