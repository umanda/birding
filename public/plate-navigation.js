// Loaded by sw.js via importScripts. Workbox allows one navigateFallback (the species template), so
// plate pages get their own: every /plate/<id> navigation is answered from the one precached template.
// The page reads the id from the URL on the client, so one HTML file serves all plates.
const PLATE_PATH = /^\/plate\/[^/]+$/;
const PLATE_TEMPLATE = '/plate/[id].html';

self.addEventListener('fetch', (event) => {
  if (event.request.mode !== 'navigate') return;
  if (!PLATE_PATH.test(new URL(event.request.url).pathname)) return;
  // ignoreSearch: the precache key carries a ?__WB_REVISION__ query.
  event.respondWith(
    caches.match(PLATE_TEMPLATE, { ignoreSearch: true }).then((hit) => hit ?? fetch(event.request)),
  );
});
