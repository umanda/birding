import { generateSW } from 'workbox-build';

const DIST_DIR = 'dist';
// The generated worker, the sitemap debug page and source maps are not part of the shell.
// Per-species HTML (295 x ~35 KB) is skipped: with it the precache exceeds ADR 0001's 10 MB
// budget. Species pages are served from the `species/[id].html` template (see below) because
// the species data ships inside the JS bundle and the router reads the id from the URL.
const NOT_PRECACHED = ['sw.js', '_sitemap.html', '**/*.map', 'species/slb-*.html'];
const SPECIES_TEMPLATE = '/species/[id].html';
const MAX_FILE_BYTES = 5 * 1024 * 1024; // the single JS bundle exceeds Workbox's 2 MB default
const PRECACHE_BUDGET_BYTES = 10 * 1024 * 1024; // ADR 0001 shell budget

// Run after `expo export`. Precaches the static export so every route opens offline.
async function main(): Promise<void> {
  const { count, size, warnings } = await generateSW({
    globDirectory: DIST_DIR,
    globPatterns: ['**/*.{html,js,css,png,ico,ttf,woff2,json}'],
    globIgnores: NOT_PRECACHED,
    swDest: `${DIST_DIR}/sw.js`,
    maximumFileSizeToCacheInBytes: MAX_FILE_BYTES,
    // `/browse?occ=E` must resolve to the precached /browse.html, so ignore every query string.
    ignoreURLParametersMatching: [/.*/],
    navigateFallback: SPECIES_TEMPLATE,
    navigateFallbackAllowlist: [/^\/species\//],
    // A waiting worker is activated by the user via the update banner (spec 002 slice 4), never automatically.
    skipWaiting: false,
    clientsClaim: true,
  });
  // An oversize file would otherwise silently drop out of the precache.
  if (warnings.length > 0) throw new Error(`Workbox warnings:\n${warnings.join('\n')}`);
  process.stdout.write(`Precached ${count} files, ${(size / 1024 / 1024).toFixed(2)} MB\n`);
  if (size > PRECACHE_BUDGET_BYTES)
    throw new Error('Precache exceeds the 10 MB budget (ADR 0001).');
}

main().catch((error: unknown) => {
  process.stderr.write(`${String(error)}\n`);
  process.exit(1);
});
