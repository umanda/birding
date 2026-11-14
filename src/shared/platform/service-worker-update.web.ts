import { useCallback, useEffect, useState } from 'react';

import type { ServiceWorkerUpdate } from './service-worker-update';

const SKIP_WAITING_MESSAGE = { type: 'SKIP_WAITING' };

type Unsubscribe = () => void;
type OnWaiting = (worker: ServiceWorker) => void;

// The very first install has no controller, so it is not an "update".
function watchInstalling(
  worker: ServiceWorker,
  container: ServiceWorkerContainer,
  onWaiting: OnWaiting,
): Unsubscribe {
  const onStateChange = (): void => {
    if (worker.state === 'installed' && container.controller) onWaiting(worker);
  };
  worker.addEventListener('statechange', onStateChange);
  return () => worker.removeEventListener('statechange', onStateChange);
}

// Calls `onWaiting` when a new worker is installed while an older one still controls the page.
export function watchForWaitingWorker(
  registration: ServiceWorkerRegistration,
  container: ServiceWorkerContainer,
  onWaiting: OnWaiting,
): Unsubscribe {
  const unsubscribers: Unsubscribe[] = [];
  const watch = (worker: ServiceWorker | null): void => {
    if (worker) unsubscribers.push(watchInstalling(worker, container, onWaiting));
  };

  if (registration.waiting) onWaiting(registration.waiting);
  watch(registration.installing);
  const onUpdateFound = (): void => watch(registration.installing);
  registration.addEventListener('updatefound', onUpdateFound);

  return () => {
    registration.removeEventListener('updatefound', onUpdateFound);
    unsubscribers.forEach((unsubscribe) => unsubscribe());
  };
}

// Reloads only once the new worker has taken control, so the page never mixes old and new files.
export function activateWaitingWorker(
  worker: ServiceWorker,
  container: ServiceWorkerContainer,
  reload: () => void,
): void {
  // Already activated (for example from another tab): no controllerchange is coming.
  if (worker.state !== 'installed' || container.controller === worker) {
    reload();
    return;
  }
  container.addEventListener('controllerchange', reload, { once: true });
  worker.postMessage(SKIP_WAITING_MESSAGE);
}

export function useServiceWorkerUpdate(): ServiceWorkerUpdate {
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    const container = navigator.serviceWorker;
    let cancelled = false;
    let unsubscribe: Unsubscribe = () => {};
    // `ready` never resolves without a worker (dev server), which is the right outcome there.
    void container.ready.then((registration) => {
      if (!cancelled) unsubscribe = watchForWaitingWorker(registration, container, setWaiting);
    });
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  const reload = useCallback(() => {
    if (waiting) activateWaitingWorker(waiting, navigator.serviceWorker, () => location.reload());
  }, [waiting]);

  return { updateAvailable: waiting !== null, reload };
}
