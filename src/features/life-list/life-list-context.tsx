import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ReactNode } from 'react';

import type { LifeListRepository } from './life-list-repository';
import { createMemoryRepository } from './memory-repository';
import { openStore } from './open-store';
import type { Sighting, SightingFields, SightingInput } from './sighting';

type Storage = 'device' | 'memory';

/** Writes reject until `status` is 'ready'. */
type LifeList = {
  status: 'loading' | 'ready';
  /** 'memory' means the device store could not be opened: sightings are lost on close. */
  storage: Storage;
  /** Newest first. */
  sightings: Sighting[];
  add: (input: SightingInput) => Promise<Sighting>;
  update: (id: string, changes: Partial<SightingFields>) => Promise<Sighting>;
  remove: (id: string) => Promise<void>;
  removeAllUnsynced: () => Promise<void>;
};

const LifeListContext = createContext<LifeList | null>(null);

type Props = { open?: () => Promise<LifeListRepository>; children: ReactNode };

type Opened = { repo: LifeListRepository; storage: Storage; rows: Sighting[] };

const warnReadFailed = (error: unknown): void => {
  // eslint-disable-next-line no-console -- a failed re-read must not hide a committed write
  console.warn('Life list could not be re-read after a write.', error);
};

async function openOrFallBack(open: () => Promise<LifeListRepository>): Promise<Opened> {
  try {
    const repo = await open();
    return { repo, storage: 'device', rows: await repo.list() };
  } catch (error) {
    // eslint-disable-next-line no-console -- single, intentional storage-failure report
    console.warn('Life list storage unavailable; sightings are kept in memory only.', error);
    return { repo: createMemoryRepository(), storage: 'memory', rows: [] };
  }
}

// `open` must be stable (module-level or memoised): a new function reopens the store.
function closeIfPossible(repo: LifeListRepository): void {
  if ('close' in repo && typeof repo.close === 'function') repo.close();
}

export function LifeListProvider({ open = openStore, children }: Props): ReactNode {
  const [opened, setOpened] = useState<Opened | null>(null);
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const repoRef = useRef<LifeListRepository | null>(null);
  const latestRead = useRef(0);

  useEffect(() => {
    let ignore = false;
    void openOrFallBack(open).then((result) => {
      if (ignore) return closeIfPossible(result.repo);
      repoRef.current = result.repo;
      setSightings(result.rows);
      setOpened(result);
    });
    return () => {
      ignore = true;
      if (repoRef.current) closeIfPossible(repoRef.current);
      repoRef.current = null;
    };
  }, [open]);

  // Writes go to the store first; the list is then re-read so it always mirrors storage.
  const write = useCallback(async <T,>(run: (repo: LifeListRepository) => Promise<T>) => {
    const repo = repoRef.current;
    if (!repo) throw new Error('life list is still loading');
    const result = await run(repo);
    // Only the write decides success; a failed re-read is logged, not reported as a failed save.
    const read = ++latestRead.current;
    repo.list().then((rows) => {
      if (read === latestRead.current) setSightings(rows);
    }, warnReadFailed);
    return result;
  }, []);

  const value = useMemo<LifeList>(
    () => ({
      status: opened ? 'ready' : 'loading',
      storage: opened?.storage ?? 'device',
      sightings,
      add: (input) => write((repo) => repo.add(input)),
      update: (id, changes) => write((repo) => repo.update(id, changes)),
      remove: (id) => write((repo) => repo.remove(id)),
      removeAllUnsynced: () => write((repo) => repo.removeAllUnsynced()),
    }),
    [opened, sightings, write],
  );
  return <LifeListContext.Provider value={value}>{children}</LifeListContext.Provider>;
}

export function useLifeList(): LifeList {
  const lifeList = useContext(LifeListContext);
  if (!lifeList) throw new Error('useLifeList must be used inside LifeListProvider');
  return lifeList;
}
