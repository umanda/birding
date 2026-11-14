import { activateWaitingWorker, watchForWaitingWorker } from './service-worker-update.web';

function fakeWorker(state = 'installing'): ServiceWorker & { fire: () => void } {
  const target = new EventTarget();
  return Object.assign(target, {
    state,
    postMessage: jest.fn(),
    fire: () => target.dispatchEvent(new Event('statechange')),
  }) as unknown as ServiceWorker & { fire: () => void };
}

function fakeRegistration(waiting: ServiceWorker | null = null) {
  const target = new EventTarget();
  const registration = Object.assign(target, { waiting, installing: null as ServiceWorker | null });
  return registration as unknown as ServiceWorkerRegistration & {
    installing: ServiceWorker | null;
  };
}

const controlled = { controller: {} } as unknown as ServiceWorkerContainer;
const uncontrolled = { controller: null } as unknown as ServiceWorkerContainer;

describe('watchForWaitingWorker', () => {
  it('reports a worker that is already waiting', () => {
    const waiting = fakeWorker('installed');
    const onWaiting = jest.fn();
    watchForWaitingWorker(fakeRegistration(waiting), controlled, onWaiting);
    expect(onWaiting).toHaveBeenCalledWith(waiting);
  });

  it('reports a newly installed worker when an older one controls the page', () => {
    const registration = fakeRegistration();
    const onWaiting = jest.fn();
    watchForWaitingWorker(registration, controlled, onWaiting);

    const worker = fakeWorker();
    registration.installing = worker;
    registration.dispatchEvent(new Event('updatefound'));
    expect(onWaiting).not.toHaveBeenCalled();
    Object.assign(worker, { state: 'installed' });
    worker.fire();
    expect(onWaiting).toHaveBeenCalledWith(worker);
  });

  it('ignores the first install, which has no controller to replace', () => {
    const registration = fakeRegistration();
    const onWaiting = jest.fn();
    watchForWaitingWorker(registration, uncontrolled, onWaiting);

    const worker = fakeWorker('installed');
    registration.installing = worker;
    registration.dispatchEvent(new Event('updatefound'));
    worker.fire();
    expect(onWaiting).not.toHaveBeenCalled();
  });
});

describe('activateWaitingWorker', () => {
  it('asks the worker to skip waiting and reloads only on controllerchange', () => {
    const worker = fakeWorker('installed');
    const container = new EventTarget() as unknown as ServiceWorkerContainer;
    const reload = jest.fn();

    activateWaitingWorker(worker, container, reload);
    expect(worker.postMessage).toHaveBeenCalledWith({ type: 'SKIP_WAITING' });
    expect(reload).not.toHaveBeenCalled();

    container.dispatchEvent(new Event('controllerchange'));
    container.dispatchEvent(new Event('controllerchange'));
    expect(reload).toHaveBeenCalledTimes(1);
  });
});
