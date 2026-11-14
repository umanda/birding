import { useCallback, useEffect, useState } from 'react';

import type { ServiceWorkerUpdate } from './service-worker-update';

const SKIP_WAITING_MESSAGE = { type: 'SKIP_WAITING' };

// Calls `onWaiting` when a new worker is installed and an older one still controls the page.
// The very first install has no controller, so it is not an "update".
export function watchForWaitingWorker(
  registration: ServiceWorkerRegistration,
  container: ServiceWorkerContainer,
  onWaiting: (worker: ServiceWorker) => void,
): void {
  if (registration.waiting) onWaiting(registration.waiting);
  registration.addEventListener('updatefound', () => {
    const installing = registration.installing;
    installing?.addEventListener('statechange', () => {
      if (installing.state === 'installed' && container.controller) onWaiting(installing);
    });
  });
}

// Reloads only once the new worker has taken control, so the page never mixes old and new files.
export function activateWaitingWorker(
  worker: ServiceWorker,
  container: ServiceWorkerContainer,
  reload: () => void,
): void {
  container.addEventListener('controllerchange', reload, { once: true });
  worker.postMessage(SKIP_WAITING_MESSAGE);
}

export function useServiceWorkerUpdate(): ServiceWorkerUpdate {
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    const container = navigator.serviceWorker;
    // `ready` never resolves without a worker (dev server), which is the right outcome there.
    void container.ready.then((registration) =>
      watchForWaitingWorker(registration, container, setWaiting),
    );
  }, []);

  const reload = useCallback(() => {
    if (waiting) activateWaitingWorker(waiting, navigator.serviceWorker, () => location.reload());
  }, [waiting]);

  return { updateAvailable: waiting !== null, reload };
}
