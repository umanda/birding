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

type Opened = { repo: LifeListRepository; storage: Storage };

async function openOrFallBack(open: () => Promise<LifeListRepository>): Promise<Opened> {
  try {
    return { repo: await open(), storage: 'device' };
  } catch (error) {
    // eslint-disable-next-line no-console -- single, intentional storage-failure report
    console.warn('Life list storage unavailable; sightings are kept in memory only.', error);
    return { repo: createMemoryRepository(), storage: 'memory' };
  }
}

export function LifeListProvider({ open = openStore, children }: Props): ReactNode {
  const [opened, setOpened] = useState<Opened | null>(null);
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const repoRef = useRef<LifeListRepository | null>(null);

  useEffect(() => {
    let ignore = false;
    void openOrFallBack(open).then(async (result) => {
      const rows = await result.repo.list().catch(() => []);
      if (ignore) return;
      repoRef.current = result.repo;
      setSightings(rows);
      setOpened(result);
    });
    return () => {
      ignore = true;
    };
  }, [open]);

  // Writes go to the store first; the list is then re-read so it always mirrors storage.
  const write = useCallback(async <T,>(run: (repo: LifeListRepository) => Promise<T>) => {
    const repo = repoRef.current;
    if (!repo) throw new Error('life list is still loading');
    const result = await run(repo);
    setSightings(await repo.list());
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
