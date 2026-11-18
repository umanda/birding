// Loaded by sw.js via importScripts. Workbox allows one navigateFallback (the species template), so
// plate pages get their own: every /plate/<id> navigation is answered from the one precached template.
// The page reads the id from the URL on the client, so one HTML file serves all plates.
const PLATE_PATH = /^\/plate\/[^/]+$/;
const PLATE_TEMPLATE = '/plate/[id].html';

self.addEventListener('fetch', (event) => {
  if (event.request.mode !== 'navigate') return;
  if (!PLATE_PATH.test(new URL(event.request.url).pathname)) return;
  // ignoreSearch: the precache key carries a ?__WB_REVISION__ query. While a new worker waits, both
  // revisions are cached and the older one matches first, which pairs with the older bundle in use.
  // If Workbox ever changes its key scheme this misses and falls back to the network; the offline
  // e2e (offline-reload.spec.ts) would catch that. Plain ES2015 on purpose: this file is not transpiled
  // and a syntax error here would break the whole service worker install.
  event.respondWith(
    caches.match(PLATE_TEMPLATE, { ignoreSearch: true }).then((hit) => hit || fetch(event.request)),
  );
});
