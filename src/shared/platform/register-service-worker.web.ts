const SERVICE_WORKER_URL = '/sw.js';

// Production builds only: the dev server has no generated sw.js, and a stale worker would
// serve old bundles while developing. Failure is not fatal; the app simply stays online-only.
export function registerServiceWorker(): void {
  if (process.env.NODE_ENV !== 'production') return;
  if (!('serviceWorker' in navigator)) return;
  navigator.serviceWorker.register(SERVICE_WORKER_URL).catch((error: unknown) => {
    // eslint-disable-next-line no-console -- single, intentional registration-failure report
    console.warn('Service worker registration failed; offline reload is unavailable.', error);
  });
}
