import type { LifeListRepository, RepositoryDeps } from './life-list-repository';
import type { Sighting, SightingInput } from './sighting';

// Each store gives the suite a fresh repository (a fresh database for idb and sqlite),
// pre-loaded with raw rows and using the injected id generator and clock.
// `cleanup` closes and deletes whatever the repository opened.
export type RepositoryFactory = (
  seedRows: unknown[],
  deps: RepositoryDeps,
) => Promise<{ repository: LifeListRepository; cleanup: () => Promise<void> }>;

const TODAY = new Date(2026, 10, 18, 9, 0, 0); // local time, so the local date is 2026-11-18
const base: SightingInput = {
  species_id: 'slb-gallus-lafayettii',
  seen_on: '2026-11-10',
  content_version: 'v1',
};

const GOOD: Sighting = {
  id: 'good-1',
  species_id: 'slb-gallus-lafayettii',
  seen_on: '2026-11-10',
  place_name: null,
  zone: null,
  count: null,
  note: null,
  lat_rounded: null,
  lon_rounded: null,
  content_version: 'v1',
  created_at: '2026-11-10T08:00:00.000Z',
  updated_at: '2026-11-10T08:00:00.000Z',
  deleted_at: null,
  synced_at: null,
};

export function describeLifeListRepository(name: string, factory: RepositoryFactory): void {
  describe(`LifeListRepository: ${name}`, () => {
    const cleanups: (() => Promise<void>)[] = [];
    afterEach(async () => {
      for (const cleanup of cleanups.splice(0)) await cleanup();
    });

    async function open(seedRows: unknown[] = []) {
      let counter = 0;
      const clock = { now: TODAY };
      const deps: RepositoryDeps = { newId: () => `id-${++counter}`, now: () => clock.now };
      const { repository, cleanup } = await factory(seedRows, deps);
      cleanups.push(cleanup);
      return { repo: repository, clock };
    }

    it('adds a sighting with generated id, null blanks and timestamps', async () => {
      const { repo } = await open();
      const saved = await repo.add({ ...base, place_name: '', note: '   ' });
      expect(saved).toEqual({
        ...GOOD,
        id: 'id-1',
        created_at: TODAY.toISOString(),
        updated_at: TODAY.toISOString(),
      });
      expect(await repo.get('id-1')).toEqual(saved);
    });

    it('keeps text byte-identical, including Sinhala', async () => {
      const { repo } = await open();
      const place = 'සිංහරාජ වන රක්ෂිතය';
      const saved = await repo.add({ ...base, place_name: place, zone: 'wet_lowland', count: 3 });
      expect((await repo.get(saved.id))?.place_name).toBe(place);
    });

    it('lists newest seen_on first, then newest created_at', async () => {
      const { repo, clock } = await open();
      await repo.add({ ...base, seen_on: '2026-11-01' });
      clock.now = new Date(2026, 10, 18, 10);
      await repo.add({ ...base, seen_on: '2026-11-09' });
      clock.now = new Date(2026, 10, 18, 11);
      await repo.add({ ...base, seen_on: '2026-11-09' });
      expect((await repo.list()).map((s) => s.id)).toEqual(['id-3', 'id-2', 'id-1']);
    });

    it('updates fields and bumps updated_at only', async () => {
      const { repo, clock } = await open();
      const saved = await repo.add({ ...base, note: 'first' });
      clock.now = new Date(2026, 10, 18, 12);
      const updated = await repo.update(saved.id, { note: null, count: 4 });
      expect(updated).toMatchObject({ note: null, count: 4, created_at: saved.created_at });
      expect(updated.updated_at).toBe(clock.now.toISOString());
      expect(await repo.get(saved.id)).toEqual(updated);
    });

    it('leaves omitted fields alone and clears undefined or blank ones', async () => {
      const { repo } = await open();
      const saved = await repo.add({ ...base, note: 'n', place_name: 'p', count: 2 });
      expect(await repo.update(saved.id, { count: 3 })).toMatchObject({
        note: 'n',
        place_name: 'p',
      });
      expect(await repo.update(saved.id, { note: undefined, place_name: '' })).toMatchObject({
        note: null,
        place_name: null,
        count: 3,
      });
    });

    it('cannot change id, species_id or created_at through update', async () => {
      const { repo, clock } = await open();
      const saved = await repo.add(base);
      clock.now = new Date(2026, 10, 18, 12);
      const sneaky = { id: 'other', species_id: 'other', created_at: '2020-01-01T00:00:00.000Z' };
      const changes = { ...sneaky, count: 2 } as Partial<SightingInput>;
      const updated = await repo.update(saved.id, changes);
      expect(updated).toMatchObject({ id: saved.id, species_id: saved.species_id, count: 2 });
      expect(updated.created_at).toBe(saved.created_at);
      expect(await repo.get('other')).toBeNull();
    });

    it('keeps unknown extra fields from a newer app version through update', async () => {
      const { repo } = await open([{ ...GOOD, future_field: 'keep me' }]);
      await repo.update('good-1', { count: 2 });
      const [row] = await repo.list();
      expect(row).toMatchObject({ count: 2, future_field: 'keep me' });
    });

    it('returns copies, so callers cannot change stored rows', async () => {
      const { repo } = await open();
      const saved = await repo.add(base);
      saved.note = 'changed';
      for (const row of await repo.list()) row.note = 'changed';
      const fetched = await repo.get(saved.id);
      if (fetched) fetched.note = 'changed';
      expect((await repo.get(saved.id))?.note).toBeNull();
    });

    it('rejects an update for a missing or deleted sighting', async () => {
      const { repo } = await open();
      await expect(repo.update('nope', { count: 2 })).rejects.toThrow();
      const saved = await repo.add(base);
      await repo.remove(saved.id);
      await expect(repo.update(saved.id, { count: 2 })).rejects.toThrow();
    });

    it('remove hides the row and is repeatable', async () => {
      const { repo, clock } = await open([GOOD]);
      clock.now = new Date(2026, 10, 18, 12);
      await repo.remove('good-1');
      clock.now = new Date(2026, 10, 18, 13);
      await repo.remove('good-1');
      await repo.remove('nope');
      expect(await repo.list()).toEqual([]);
      expect(await repo.get('good-1')).toBeNull();
    });

    it('removeAllUnsynced empties the store but keeps synced rows', async () => {
      const synced = { ...GOOD, id: 'synced', synced_at: '2026-11-11T00:00:00.000Z' };
      const { repo } = await open([GOOD, synced]);
      await repo.add(base);
      await repo.removeAllUnsynced();
      expect((await repo.list()).map((s) => s.id)).toEqual(['synced']);
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
      const { repo } = await open();
      await expect(repo.add({ ...base, ...bad } as SightingInput)).rejects.toThrow();
      const saved = await repo.add(base);
      await expect(repo.update(saved.id, bad as Partial<SightingInput>)).rejects.toThrow();
      expect(await repo.get(saved.id)).toEqual(saved);
      expect(await repo.list()).toHaveLength(1);
    });

    it.each([
      ['species_id', { species_id: '' }, /species_id/],
      ['content_version', { content_version: '' }, /content_version/],
    ])('rejects an empty %s on add', async (_label, bad, message) => {
      const { repo } = await open();
      await expect(repo.add({ ...base, ...bad })).rejects.toThrow(message);
    });

    it('accepts today and the limits', async () => {
      const { repo } = await open();
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

    it('skips stored rows with the wrong shape and keeps the rest', async () => {
      const { repo } = await open([
        GOOD,
        { ...GOOD, id: 'bad-count', count: 0 },
        { ...GOOD, id: 'bad-date', seen_on: 'yesterday' },
        { ...GOOD, id: 'bad-stamp', created_at: 'today' },
        { ...GOOD, id: 'bad-note', note: 5 },
      ]);
      expect((await repo.list()).map((s) => s.id)).toEqual(['good-1']);
      expect(await repo.get('bad-count')).toBeNull();
    });
  });
}
