import { mediaUrl } from '@/shared/data/media';
import type { ManifestImage } from '@/shared/data/media';

export type PackItem = { url: string; bytes: number };
export type PackPlan = {
  totalCount: number;
  totalBytes: number;
  remaining: PackItem[];
  remainingBytes: number;
};

const BYTES_PER_KB = 1024;
const BYTES_PER_MB = BYTES_PER_KB * BYTES_PER_KB;

// Resume: anything already in the photo cache is skipped, so a stopped download continues.
export function packPlan(
  images: readonly ManifestImage[],
  cachedUrls: ReadonlySet<string>,
): PackPlan {
  const items = images.map((image) => ({
    url: mediaUrl(image.full.path),
    bytes: image.full.bytes,
  }));
  const remaining = items.filter((item) => !cachedUrls.has(item.url));
  return {
    totalCount: items.length,
    totalBytes: sumBytes(items),
    remaining,
    remainingBytes: sumBytes(remaining),
  };
}

function sumBytes(items: readonly PackItem[]): number {
  return items.reduce((sum, item) => sum + item.bytes, 0);
}

export function formatBytes(bytes: number): string {
  if (bytes < BYTES_PER_KB) return `${bytes} B`;
  if (bytes < BYTES_PER_MB) return `${Math.round(bytes / BYTES_PER_KB)} KB`;
  return `${(bytes / BYTES_PER_MB).toFixed(1)} MB`;
}
