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

async function listCachedUrls(): Promise<ReadonlySet<string>> {
  const cache = await caches.open(PHOTO_CACHE_NAME);
  const requests = await cache.keys();
  return new Set(requests.map((request) => new URL(request.url).pathname));
}

// Sequential on purpose: one failure (offline) stops cleanly and a retry resumes.
async function download(
  urls: readonly string[],
  { signal, onProgress }: DownloadOptions,
): Promise<PackResult> {
  requestPersistence();
  const cache = await caches.open(PHOTO_CACHE_NAME);
  let done = 0;
  for (const url of urls) {
    if (signal.aborted) return 'cancelled';
    try {
      const response = await fetch(url, { signal });
      if (response.status !== HTTP_OK) return 'interrupted';
      await cache.put(url, response);
    } catch {
      return signal.aborted ? 'cancelled' : 'interrupted';
    }
    done += 1;
    onProgress(done);
  }
  return 'done';
}

export const photoPack: PhotoPack = {
  isSupported: () => typeof caches !== 'undefined',
  listCachedUrls,
  download,
};
