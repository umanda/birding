import { generateSW } from 'workbox-build';
import { PHOTO_CACHE_MAX_ENTRIES } from '../content/media/media-manifest';

const DIST_DIR = 'dist';
// The generated worker, the sitemap debug page and source maps are not part of the shell.
// Per-plate HTML (43 files) is skipped likewise; `plate/[id].html` is its template (public/plate-navigation.js).
// Per-species HTML (295 x ~35 KB) is skipped: with it the precache exceeds ADR 0001's 10 MB
// budget. Species pages are served from the `species/[id].html` template (see below) because
// the species data ships inside the JS bundle and the router reads the id from the URL.
const NOT_PRECACHED = [
  'sw.js',
  '_sitemap.html',
  '**/*.map',
  'species/slb-*.html',
  'plate/plate-*.html',
];
const SPECIES_TEMPLATE = '/species/[id].html';
const MAX_FILE_BYTES = 5 * 1024 * 1024; // the single JS bundle exceeds Workbox's 2 MB default
// ADR 0004: full photos are cached when first viewed. File names carry a content hash, so an
// entry is never stale and the cache needs no versioned invalidation beyond its name.
const PHOTO_CACHE_NAME = 'photos-v1';
const PRECACHE_BUDGET_BYTES = 10 * 1024 * 1024; // ADR 0001 shell budget
const PRECACHE_WARN_BYTES = 9 * 1024 * 1024; // early notice, spec 006 risk R5

// Run after `expo export`. Precaches the static export so every route opens offline.
async function main(): Promise<void> {
  const { count, size, warnings } = await generateSW({
    globDirectory: DIST_DIR,
    // thumb.webp lives in the one brace pattern: a separate media glob warns while the manifest is empty.
    globPatterns: ['**/*.{html,js,css,png,ico,ttf,woff2,json,thumb.webp}'],
    globIgnores: NOT_PRECACHED,
    importScripts: ['/plate-navigation.js'],
    swDest: `${DIST_DIR}/sw.js`,
    maximumFileSizeToCacheInBytes: MAX_FILE_BYTES,
    // `/browse?occ=E` must resolve to the precached /browse.html, so ignore every query string.
    ignoreURLParametersMatching: [/.*/],
    navigateFallback: SPECIES_TEMPLATE,
    navigateFallbackAllowlist: [/^\/species\//],
    runtimeCaching: [
      {
        urlPattern: /\/media\/.*\.full\.webp$/,
        handler: 'CacheFirst',
        options: {
          cacheName: PHOTO_CACHE_NAME,
          expiration: { maxEntries: PHOTO_CACHE_MAX_ENTRIES, purgeOnQuotaError: true },
          // Skip partial (206) responses so a truncated image is never cached.
          cacheableResponse: { statuses: [200] },
        },
      },
    ],
    // A waiting worker is activated by the user via the update banner (spec 002 slice 4), never automatically.
    skipWaiting: false,
    clientsClaim: true,
  });
  // An oversize file would otherwise silently drop out of the precache.
  if (warnings.length > 0) throw new Error(`Workbox warnings:\n${warnings.join('\n')}`);
  process.stdout.write(`Precached ${count} files, ${(size / 1024 / 1024).toFixed(2)} MB\n`);
  if (size > PRECACHE_BUDGET_BYTES) {
    const budgetMb = PRECACHE_BUDGET_BYTES / 1024 / 1024;
    throw new Error(`Precache is ${size} bytes, over the ${budgetMb} MB budget (ADR 0001).`);
  }
  if (size > PRECACHE_WARN_BYTES) {
    process.stderr.write(
      `warning: precache is ${size} bytes, above 9 MiB (hard limit 10 MiB, ADR 0001)\n`,
    );
  }
}

main().catch((error: unknown) => {
  process.stderr.write(`${String(error)}\n`);
  process.exit(1);
});
