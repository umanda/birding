import { CONSERVATION_FIELDS, SpeciesTextFileSchema } from '../../src/shared/data/species-text-schema';
import { buildSpeciesText, extractLinks } from './species-text';
import { EXPECTED_SOURCES, checkSources } from './validate-content';

const NONE = { placeholdersCsv: 'species_id,field,reason\n', overridesCsv: 'species_id,field,lang\n' };
const cons = (extra: Record<string, unknown> = {}) => ({ species_id: 'a', ...extra });
const src = (id: string, citation: string) => ({ source_id: id, species_id: 'a', source_url: citation, source_type: 'ref' });

type Built = { conservation: Record<string, string | null>; sources: { source_id: string; citation: string; links: string[] }[] };
const build = (conservation: Record<string, unknown>[], sources: Record<string, unknown>[]): { species: Record<string, Built> } =>
  buildSpeciesText(
    { identification: [{ species_id: 'a', species_description: 'x' }], distribution: [], conservation, sources },
    NONE,
  ) as never;

describe('conservation in species-text', () => {
  it('copies verbatim, turns blank into null and stringifies numbers', () => {
    const note = ' Pending  review \n';
    const built = build([cons({ occurrence_source_note: note, iucn_source_note: '  ', iucn_assessment_year: 2021 })], []);
    const c = built.species.a?.conservation;
    expect(c?.occurrence_source_note).toBe(note);
    expect(c?.iucn_source_note).toBeNull();
    expect(c?.iucn_assessment_year).toBe('2021');
    expect(Object.keys(c ?? {})).toEqual([...CONSERVATION_FIELDS]);
  });

  it('fails on a missing, duplicate or unknown Conservation row', () => {
    expect(() => build([], [])).toThrow('No Conservation row for a');
    expect(() => build([cons(), cons()], [])).toThrow('Duplicate Conservation row');
    expect(() => build([cons(), { species_id: 'z' }], [])).toThrow('unknown species z');
  });
});

describe('sources in species-text', () => {
  it('sorts by source_id and keeps the cell verbatim', () => {
    const cell = 'Field guide; list: https://example.org/x ; more';
    const built = build([cons()], [src('a-src-02', 'https://b.org'), src('a-src-01', cell)]);
    expect(built.species.a?.sources.map((s) => [s.source_id, s.citation])).toEqual([
      ['a-src-01', cell],
      ['a-src-02', 'https://b.org'],
    ]);
  });

  it('fails on a duplicate source_id, a blank url or an unknown species', () => {
    expect(() => build([cons()], [src('s1', 'https://a.org'), src('s1', 'https://b.org')])).toThrow('Duplicate source_id');
    expect(() => build([cons()], [src('s1', ' ')])).toThrow('Blank source_id or source_url');
    expect(() => build([cons()], [{ ...src('s1', 'https://a.org'), species_id: 'z' }])).toThrow('unknown species z');
  });
});

const file = (conservation: Record<string, unknown>, sources: unknown[]): unknown => ({
  schema_version: 3,
  species: {
    a: {
      species_description: null, male_female_identification: null, juvenile_immature_plumage: null,
      field_spotting_tips: null, sri_lanka_distribution_and_hotspots: null, seasonality_months_seen: null,
      conservation: { ...Object.fromEntries(CONSERVATION_FIELDS.map((f) => [f, null])), ...conservation },
      sources,
    },
  },
});
const entry = (source_id: string, citation: string, links: string[]): unknown => ({ source_id, citation, links, type: null });
const many = (n: number): unknown[] =>
  Array.from({ length: n }, (_, i) => entry(`s${i}`, 'https://a.org', ['https://a.org']));

describe('checkSources', () => {
  it('accepts the expected count and counts http links and citations', () => {
    const sources = [...many(EXPECTED_SOURCES - 2), entry('h', 'http://a.org', ['http://a.org']), entry('c', 'Guide only', [])];
    const report = checkSources(file({ birdlife_factsheet_url: 'https://datazone.birdlife.org/species/factsheet/1' }, sources));
    expect(report).toEqual({ errors: [], httpCount: 1, citationCount: 1 });
  });

  it('rejects other schemes, duplicates, a wrong count and a foreign factsheet host', () => {
    const sources = [...many(EXPECTED_SOURCES - 1), entry('s0', 'see javascript://x', [])];
    const errors = checkSources(file({ birdlife_factsheet_url: 'https://example.org/f' }, sources)).errors.join('\n');
    expect(errors).toContain('duplicate source_id s0');
    expect(errors).toContain('scheme javascript is not http(s)');
    expect(errors).toContain('factsheet URL is not on datazone.birdlife.org');
    expect(checkSources(file({}, many(3))).errors).toEqual([`species-text: expected ${EXPECTED_SOURCES} sources, found 3`]);
  });

  it('rejects an unknown conservation field in the schema', () => {
    expect(SpeciesTextFileSchema.safeParse(file({ extra: 'x' }, [])).success).toBe(false);
  });
});

describe('extractLinks', () => {
  it.each([
    ['a bare URL', 'https://a.org/x?y=1', ['https://a.org/x?y=1']],
    ['one URL in a citation', 'Field guide: https://a.org/list', ['https://a.org/list']],
    ['two URLs in order', 'A: https://a.org/1 ; B: http://b.org/2', ['https://a.org/1', 'http://b.org/2']],
    ['trailing punctuation', 'see (https://a.org/x). Also https://b.org/y;', ['https://a.org/x', 'https://b.org/y']],
    ['encoded parentheses are kept', 'https://a.org/List%28Country%29.pdf', ['https://a.org/List%28Country%29.pdf']],
    ['no URL', 'CBC Country List 2022; Avibase checklist', []],
    ['Sinhala text around a URL', 'ශ්‍රී ලංකා පක්ෂි ලැයිස්තුව: https://a.org/si ; ඉහත', ['https://a.org/si']],
  ])('%s', (_name, cell, links) => {
    expect(extractLinks(cell)).toEqual(links);
  });

  it('keeps the citation unchanged next to its links', () => {
    const cell = 'Guide (https://a.org/x). ';
    const source = build([cons()], [src('s1', cell)]).species.a?.sources[0];
    expect(source?.citation).toBe(cell);
    expect(source?.links).toEqual(['https://a.org/x']);
  });
});
