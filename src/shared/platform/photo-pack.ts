export type PackResult = 'done' | 'cancelled' | 'interrupted';
export type DownloadOptions = { signal: AbortSignal; onProgress: (done: number) => void };
export type PhotoPack = {
  isSupported: () => boolean;
  listCachedUrls: () => Promise<ReadonlySet<string>>;
  download: (urls: readonly string[], options: DownloadOptions) => Promise<PackResult>;
};

// Native default: the offline photo pack is web-only until the native milestone (ADR 0004).
export const photoPack: PhotoPack = {
  isSupported: () => false,
  listCachedUrls: async () => new Set(),
  download: async () => 'interrupted',
};
