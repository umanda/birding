import type { LifeListRepository, RepositoryDeps } from './life-list-repository';
import type { SightingInput } from './sighting';

// Each store gives the suite a fresh repository, pre-loaded with raw rows (valid or not)
// and the injected id generator and clock.
export type RepositoryFactory = (
  seedRows: unknown[],
  deps: RepositoryDeps,
) => Promise<LifeListRepository>;

const TODAY = new Date(2026, 10, 18, 9, 0, 0); // local time, so the local date is 2026-11-18
const base: SightingInput = {
  species_id: 'slb-gallus-lafayettii',
  seen_on: '2026-11-10',
  content_version: 'v1',
};

function setup(factory: RepositoryFactory, seedRows: unknown[] = []) {
  let counter = 0;
  const clock = { now: TODAY };
  const deps: RepositoryDeps = { newId: () => `id-${++counter}`, now: () => clock.now };
  return { clock, repository: factory(seedRows, deps) };
}

export function describeLifeListRepository(name: string, factory: RepositoryFactory): void {
  describe(`LifeListRepository: ${name}`, () => {
    it('adds a sighting with generated id, null blanks and timestamps', async () => {
      const repo = await setup(factory).repository;
      const saved = await repo.add({ ...base, place_name: '' });
      expect(saved).toMatchObject({
        id: 'id-1',
        species_id: base.species_id,
        place_name: null,
        zone: null,
        count: null,
        note: null,
        lat_rounded: null,
        lon_rounded: null,
        content_version: 'v1',
        created_at: TODAY.toISOString(),
        updated_at: TODAY.toISOString(),
        deleted_at: null,
        synced_at: null,
      });
      expect(await repo.get('id-1')).toEqual(saved);
    });

    it('keeps text byte-identical, including Sinhala', async () => {
      const repo = await setup(factory).repository;
      const place = 'සිංහරාජ වන රක්ෂිතය';
      const saved = await repo.add({ ...base, place_name: place, zone: 'wet_lowland', count: 3 });
      expect((await repo.get(saved.id))?.place_name).toBe(place);
    });

    it('lists newest seen_on first, then newest created_at', async () => {
      const { repository, clock } = setup(factory);
      const repo = await repository;
      await repo.add({ ...base, seen_on: '2026-11-01' });
      clock.now = new Date(2026, 10, 18, 10);
      await repo.add({ ...base, seen_on: '2026-11-09' });
      clock.now = new Date(2026, 10, 18, 11);
      await repo.add({ ...base, seen_on: '2026-11-09' });
      expect((await repo.list()).map((s) => s.id)).toEqual(['id-3', 'id-2', 'id-1']);
    });

    it('updates fields and bumps updated_at only', async () => {
      const { repository, clock } = setup(factory);
      const repo = await repository;
      const saved = await repo.add({ ...base, note: 'first' });
      clock.now = new Date(2026, 10, 18, 12);
      const updated = await repo.update(saved.id, { note: null, count: 4 });
      expect(updated).toMatchObject({ note: null, count: 4, created_at: saved.created_at });
      expect(updated.updated_at).toBe(clock.now.toISOString());
      expect(await repo.get(saved.id)).toEqual(updated);
    });

    it('rejects an update for a missing or deleted sighting', async () => {
      const repo = await setup(factory).repository;
      await expect(repo.update('nope', { count: 2 })).rejects.toThrow();
      const saved = await repo.add(base);
      await repo.softDelete(saved.id);
      await expect(repo.update(saved.id, { count: 2 })).rejects.toThrow();
    });

    it('soft delete hides the row from list and get, and is repeatable', async () => {
      const repo = await setup(factory).repository;
      const saved = await repo.add(base);
      await repo.softDelete(saved.id);
      await repo.softDelete(saved.id);
      await repo.softDelete('nope');
      expect(await repo.list()).toEqual([]);
      expect(await repo.get(saved.id)).toBeNull();
    });

    it('deleteAll empties the store', async () => {
      const repo = await setup(factory).repository;
      await repo.add(base);
      await repo.add(base);
      await repo.deleteAll();
      expect(await repo.list()).toEqual([]);
    });

    it.each([
      ['a future date', { seen_on: '2026-11-19' }],
      ['an impossible date', { seen_on: '2026-02-30' }],
      ['a badly formatted date', { seen_on: '18/11/2026' }],
      ['count 0', { count: 0 }],
      ['count 1000', { count: 1000 }],
      ['a fractional count', { count: 1.5 }],
      ['a place name over 80 characters', { place_name: 'x'.repeat(81) }],
      ['a note over 500 characters', { note: 'x'.repeat(501) }],
      ['an unknown zone', { zone: 'moon' }],
    ])('rejects %s on add and update', async (_label, bad) => {
      const repo = await setup(factory).repository;
      await expect(repo.add({ ...base, ...bad } as SightingInput)).rejects.toThrow();
      const saved = await repo.add(base);
      await expect(repo.update(saved.id, bad as never)).rejects.toThrow();
      expect(await repo.get(saved.id)).toEqual(saved);
      expect(await repo.list()).toHaveLength(1);
    });

    it('accepts today and the limits', async () => {
      const repo = await setup(factory).repository;
      await repo.add({
        ...base,
        seen_on: '2026-11-18',
        count: 999,
        place_name: 'x'.repeat(80),
        note: 'y'.repeat(500),
      });
      await repo.add({ ...base, count: 1 });
      expect(await repo.list()).toHaveLength(2);
    });

    it('skips invalid stored rows and keeps the rest', async () => {
      const good = await (await setup(factory).repository).add(base);
      const seed = [
        good,
        { ...good, id: 'bad-count', count: 0 },
        { ...good, id: 'bad-date', seen_on: 'yesterday' },
        { ...good, id: 'bad-coords', lat_rounded: 6.9 },
        { ...good, id: undefined },
        'junk',
        null,
      ];
      const repo = await setup(factory, seed).repository;
      expect((await repo.list()).map((s) => s.id)).toEqual([good.id]);
      expect(await repo.get('bad-count')).toBeNull();
    });
  });
}
