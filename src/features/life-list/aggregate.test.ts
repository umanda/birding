import { getAllSpecies, getPlate } from '@/shared/data/content';
import { AFTER_LAST_PLATE, lifeListRows, lifeListSummary } from './aggregate';
import type { Species } from '@/shared/data/content-schema';
import type { SightingInput } from './aggregate';

const all = getAllSpecies();
const pick = (code: Species['occurrence_code']): Species => {
  const found = all.find((s) => s.occurrence_code === code);
  if (!found) throw new Error(`no species with ${code}`);
  return found;
};
const seen = (id: string, seenOn: string, deletedAt: string | null = null): SightingInput => ({
  species_id: id,
  seen_on: seenOn,
  deleted_at: deletedAt,
});
const base = { sort: 'recent', filters: [], language: 'en' } as const;
const ids = (rows: { species_id: string }[]): string[] => rows.map((r) => r.species_id);
const codeOf = (id: string): string | undefined =>
  all.find((s) => s.species_id === id)?.occurrence_code;

const at = <T>(list: readonly T[], index: number): T => {
  const item = list[index];
  if (item === undefined) throw new Error('no item at ' + index);
  return item;
};

const endemic = pick('E');
const resident = pick('R');
const migrant = pick('M');
const both = pick('R/M');

describe('lifeListRows', () => {
  it('groups by species with first, last and count', () => {
    const id = endemic.species_id;
    const rows = lifeListRows(
      [seen(id, '2026-03-02'), seen(id, '2026-01-05'), seen(id, '2026-02-01')],
      all,
      base,
    );
    expect(rows).toEqual([
      {
        species_id: id,
        first_seen: '2026-01-05',
        last_seen: '2026-03-02',
        sightings: 3,
        inGuide: true,
      },
    ]);
  });

  it('ignores deleted sightings and drops species with only deleted ones', () => {
    const rows = lifeListRows(
      [
        seen(endemic.species_id, '2026-01-01'),
        seen(endemic.species_id, '2026-05-01', 'x'),
        seen(resident.species_id, '2026-02-01', 'x'),
      ],
      all,
      base,
    );
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ last_seen: '2026-01-01', sightings: 1 });
  });

  it('keeps unknown species and labels them', () => {
    expect(lifeListRows([seen('gone-bird', '2026-01-01')], all, base)).toEqual([
      {
        species_id: 'gone-bird',
        first_seen: '2026-01-01',
        last_seen: '2026-01-01',
        sightings: 1,
        inGuide: false,
      },
    ]);
  });

  it('returns nothing for no sightings', () => {
    expect(lifeListRows([], all, base)).toEqual([]);
  });

  it('sorts Recent newest first, breaking ties by name', () => {
    const sorted = [resident, migrant].sort((x, y) => x.names.en.localeCompare(y.names.en, 'en'));
    const a = at(sorted, 0);
    const b = at(sorted, 1);
    const rows = lifeListRows(
      [
        seen(b.species_id, '2026-04-01'),
        seen(a.species_id, '2026-04-01'),
        seen(endemic.species_id, '2026-06-01'),
      ],
      all,
      base,
    );
    expect(ids(rows)).toEqual([endemic.species_id, a.species_id, b.species_id]);
  });

  it('sorts A-Z by the name in the UI language', () => {
    const picks = [endemic, resident, migrant];
    const input = picks.map((s) => seen(s.species_id, '2026-01-01'));
    const rows = lifeListRows(input, all, { ...base, sort: 'name' });
    const expected = [...picks].sort((x, y) => x.names.en.localeCompare(y.names.en, 'en'));
    expect(ids(rows)).toEqual(expected.map((s) => s.species_id));
  });

  it('sorts A-Z in Sinhala order on real species', () => {
    const picks = all.filter((s) => s.names.si !== null).slice(0, 3);
    const sinhalaName = (s: Species): string => s.names.si ?? '';
    const input = [...picks].reverse().map((s) => seen(s.species_id, '2026-01-01'));
    const rows = lifeListRows(input, all, { ...base, sort: 'name', language: 'si' });
    const expected = [...picks].sort((x, y) => sinhalaName(x).localeCompare(sinhalaName(y), 'si'));
    expect(ids(rows)).toEqual(expected.map((s) => s.species_id));
  });

  it('falls back to the English name when Sinhala is missing', () => {
    // 'zzz' sorts after 'aaa' in English but would come first if it used a Sinhala name.
    const noSi = (id: string, en: string): Species => ({
      ...endemic,
      species_id: id,
      names: { ...endemic.names, en, si: null },
    });
    const species = [noSi('late', 'zzz'), noSi('early', 'aaa')];
    const input = species.map((s) => seen(s.species_id, '2026-01-01'));
    const options = { ...base, sort: 'name', language: 'si' } as const;
    expect(ids(lifeListRows(input, species, options))).toEqual(['early', 'late']);
  });

  it('sorts By plate with unknown species last', () => {
    const position = (s: Species): [number, number] => [
      getPlate(s.plate_id)?.plate_number ?? AFTER_LAST_PLATE,
      s.plate_order,
    ];
    const ordered = [...all].sort((a, b) => {
      const [pa, oa] = position(a);
      const [pb, ob] = position(b);
      return pa - pb || oa - ob;
    });
    const first = at(ordered, 0);
    const last = at(ordered, ordered.length - 1);
    const rows = lifeListRows(
      [
        seen('gone-bird', '2026-01-01'),
        seen(last.species_id, '2026-01-01'),
        seen(first.species_id, '2026-01-01'),
      ],
      all,
      { ...base, sort: 'plate' },
    );
    expect(ids(rows)).toEqual([first.species_id, last.species_id, 'gone-bird']);
  });

  it.each([
    ['E', ['E']],
    ['R', ['R', 'R/M']],
    ['M', ['M', 'R/M']],
  ] as const)('filter %s matches compound codes', (filter, codes) => {
    const input = [endemic, resident, migrant, both].map((s) => seen(s.species_id, '2026-01-01'));
    const rows = lifeListRows(input, all, { ...base, filters: [filter] });
    expect(rows.map((r) => codeOf(r.species_id)).sort()).toEqual([...codes].sort());
  });

  it('unions several filters and hides unknown species when filtering', () => {
    const input = [endemic, resident, migrant].map((s) => seen(s.species_id, '2026-01-01'));
    input.push(seen('gone-bird', '2026-01-01'));
    const rows = lifeListRows(input, all, { ...base, filters: ['E', 'M'] });
    expect(ids(rows).sort()).toEqual([endemic.species_id, migrant.species_id].sort());
  });
});

describe('lifeListSummary', () => {
  it('finds 35 endemics in the real content', () => {
    expect(lifeListSummary([], all).endemicsTotal).toBe(35);
  });

  it('counts the endemic total from the species passed in', () => {
    expect(lifeListSummary([], all)).toMatchObject({
      species: 0,
      sightings: 0,
      endemics: 0,
      endemicsTotal: all.filter((s) => s.occurrence_code === 'E').length,
    });
  });

  it('counts exact codes plus unknown species, skipping deleted rows', () => {
    const summary = lifeListSummary(
      [
        seen(endemic.species_id, '2026-01-01'),
        seen(endemic.species_id, '2026-01-02'),
        seen(both.species_id, '2026-01-03'),
        seen(resident.species_id, '2026-01-04', 'x'),
        seen('gone-bird', '2026-01-05'),
      ],
      all,
    );
    expect(summary).toMatchObject({ species: 3, sightings: 4, endemics: 1, endemicsTotal: 35 });
    expect(summary.unknown).toBe(1);
    expect(summary.byCode).toEqual({ E: 1, R: 0, M: 0, 'R/M': 1, 'R+M': 0, 'R+(M)': 0 });
  });
});

describe('performance', () => {
  it('aggregates 2,000 sightings well inside the 1 s budget', () => {
    const input = Array.from({ length: 2000 }, (_, i) =>
      seen(at(all, i % all.length).species_id, `2026-${String((i % 12) + 1).padStart(2, '0')}-15`),
    );
    const start = performance.now();
    const rows = lifeListRows(input, all, { ...base, sort: 'name', language: 'si' });
    lifeListSummary(input, all);
    expect(performance.now() - start).toBeLessThan(1000);
    expect(rows).toHaveLength(all.length);
  });
});
