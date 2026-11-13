import { blankToNull, buildContent } from './build-content';

const HASH = 'a'.repeat(64);
const plate = (n: number) => ({
  plate_id: `plate-${n}`,
  plate_number: n,
  plate_english_title: `P${n}`,
  plate_sinhala_title: null,
});
const bird = (id: string, plateNo: number, order: number, si: string | null) => ({
  species_id: id,
  plate_id: `plate-${plateNo}`,
  plate_order: order,
  english_name: id,
  sinhala_name: si,
  accepted_scientific_name: `Sci ${id}`,
});
const conservation = (id: string) => ({
  species_id: id,
  sri_lanka_occurrence_code: 'R+(M)',
  iucn_category_working: 'LC',
});

type Built = { species: { species_id: string; names: { si: string | null }; occurrence_code: unknown }[] };
const build = (species: ReturnType<typeof bird>[], cons: ReturnType<typeof conservation>[]) =>
  buildContent({ plates: [plate(2), plate(1)], species, conservation: cons }, HASH) as Built;

describe('buildContent', () => {
  it('keeps Sinhala text exactly, including ZWJ and edge whitespace', () => {
    const si = ' ශ්‍රී ලංකා ';
    const result = build([bird('a', 1, 1, si)], [conservation('a')]);
    expect(result.species[0]?.names.si).toBe(si);
  });

  it('turns missing, empty and whitespace-only cells into null', () => {
    expect([undefined, null, '', '  '].map(blankToNull)).toEqual([null, null, null, null]);
    expect(blankToNull(' x ')).toBe(' x ');
  });

  it('sorts by plate number then plate_order', () => {
    const result = build(
      [bird('c', 2, 1, 'x'), bird('b', 1, 2, 'x'), bird('a', 1, 1, 'x')],
      [],
    );
    expect(result.species.map((s) => s.species_id)).toEqual(['a', 'b', 'c']);
  });

  it('sets occurrence to null when the Conservation row is missing', () => {
    expect(build([bird('a', 1, 1, 'x')], []).species[0]?.occurrence_code).toBeNull();
  });

  it('throws on a duplicate Conservation species_id', () => {
    expect(() => build([bird('a', 1, 1, 'x')], [conservation('a'), conservation('a')])).toThrow(
      'Duplicate Conservation row for species_id: a',
    );
  });
});
