export type ServiceWorkerUpdate = { updateAvailable: boolean; reload: () => void };

const NO_UPDATE: ServiceWorkerUpdate = { updateAvailable: false, reload: () => {} };

// Native default: there is no service worker. service-worker-update.web.ts overrides it on web.
export function useServiceWorkerUpdate(): ServiceWorkerUpdate {
  return NO_UPDATE;
}
