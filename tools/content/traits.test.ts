import { buildTraits } from './traits-build';
import { TRAITS_COLUMNS, validateTraits } from './traits';

const HEADER = TRAITS_COLUMNS.join(',');
const IDS = new Set(['sp-a', 'sp-b']);

// Cells: trait, value, plumage_key, review_status (source and confidence are fixed).
function csv(...rows: [string, string, string, string][]): string {
  const lines = rows.map(([t, v, k, s]) => `sp-a,${t},${v},${k},expert:x,high,${s},`);
  return [HEADER, ...lines].join('\n');
}
const errorsOf = (...rows: [string, string, string, string][]): string[] =>
  validateTraits(csv(...rows), IDS).errors;

describe('validateTraits', () => {
  it('accepts a header-only file', () => {
    expect(validateTraits(HEADER, IDS).errors).toEqual([]);
  });

  it('rejects a wrong header', () => {
    expect(validateTraits('a,b', IDS).errors[0]).toMatch(/header must be/);
  });

  it('accepts free-text notes with commas and quotes', () => {
    const text = `${HEADER}\nsp-a,zone,montane,,expert:x,high,proposed,"hills, mostly"`;
    expect(validateTraits(text, IDS).errors).toEqual([]);
  });

  it('rejects an unknown species', () => {
    const text = `${HEADER}\nsp-z,zone,montane,,expert:x,high,proposed,`;
    expect(validateTraits(text, IDS).errors[0]).toMatch(/unknown species_id/);
  });

  it.each([
    ['zone', 'moon'],
    ['habitat', 'sea'],
    ['size', 'XXXXL'],
    ['colour', 'teal'],
    ['behaviour', 'sleeping'],
    ['month', '13'],
    ['commonness', 'montane:rare'],
    ['commonness', 'montane'],
    ['wing', 'long'],
  ])('rejects %s value %s', (trait, value) => {
    expect(errorsOf([trait, value, '', 'proposed'])).not.toEqual([]);
  });

  it('checks review_status and confidence', () => {
    const text = `${HEADER}\nsp-a,zone,montane,,expert:x,sure,done,`;
    expect(validateTraits(text, IDS).errors).toHaveLength(2);
  });

  it('rejects a blank source', () => {
    const text = `${HEADER}\nsp-a,zone,montane,,,high,proposed,`;
    expect(validateTraits(text, IDS).errors[0]).toMatch(/blank source/);
  });

  it('checks plumage keys and where they apply', () => {
    expect(errorsOf(['colour', 'red', 'morph_dark', 'proposed'])).toEqual([]);
    expect(errorsOf(['size', 'S', 'male', 'proposed'])).toEqual([]);
    expect(errorsOf(['colour', 'red', 'odd', 'proposed'])[0]).toMatch(/bad plumage_key/);
    expect(errorsOf(['zone', 'montane', 'male', 'proposed'])[0]).toMatch(/only applies/);
  });

  it("keeps month 'all' exclusive with 1-12", () => {
    expect(errorsOf(['month', 'all', '', 'proposed'], ['month', '3', '', 'proposed'])[0]).toMatch(/'all'/);
    expect(errorsOf(['month', '3', '', 'proposed'], ['month', '4', '', 'proposed'])).toEqual([]);
  });

  it('allows at most 3 colours per plumage', () => {
    const four = ['red', 'blue', 'black', 'white'].map((c): [string, string, string, string] => [
      'colour', c, 'male', 'proposed',
    ]);
    expect(errorsOf(...four)[0]).toMatch(/max 3/);
    const split = [...four.slice(0, 3), ['colour', 'white', 'female', 'proposed'] as [string, string, string, string]];
    expect(errorsOf(...split)).toEqual([]);
  });

  it('requires a matching zone row for commonness', () => {
    expect(errorsOf(['commonness', 'montane:common', '', 'proposed'])[0]).toMatch(/no usable zone/);
    expect(
      errorsOf(['zone', 'montane', '', 'proposed'], ['commonness', 'montane:common', '', 'proposed']),
    ).toEqual([]);
    expect(
      errorsOf(['zone', 'montane', '', 'proposed'], ['commonness', 'montane:common', '', 'reviewed']),
    ).not.toEqual([]);
  });

  it('rejects duplicates, including two commonness levels for a zone', () => {
    expect(errorsOf(['zone', 'montane', '', 'proposed'], ['zone', 'montane', '', 'reviewed'])[0]).toMatch(/duplicate/);
    const both = errorsOf(
      ['zone', 'montane', '', 'reviewed'],
      ['commonness', 'montane:common', '', 'reviewed'],
      ['commonness', 'montane:scarce', '', 'reviewed'],
    );
    expect(both[0]).toMatch(/duplicate/);
  });

  it('counts rows by review status and still validates proposed rows', () => {
    const report = validateTraits(
      csv(['zone', 'montane', '', 'proposed'], ['zone', 'moon', '', 'proposed'], ['habitat', 'coast', '', 'rejected']),
      IDS,
    );
    expect(report.counts).toEqual({ proposed: 2, reviewed: 0, rejected: 1 });
    expect(report.errors).toHaveLength(1);
  });
});

describe('validateTraits status and key rules', () => {
  it('rejects proposed and reviewed rows mixed in one month list', () => {
    const e = errorsOf(['month', '1', '', 'proposed'], ['month', '2', '', 'reviewed']);
    expect(e[0]).toMatch(/month rows .* mix/);
    expect(errorsOf(['month', '1', '', 'reviewed'], ['month', '2', '', 'rejected'])).toEqual([]);
  });

  it('rejects mixed statuses within one plumage of colour or size, but not across plumages', () => {
    expect(errorsOf(['colour', 'red', 'male', 'proposed'], ['colour', 'blue', 'male', 'reviewed'])[0]).toMatch(/mix/);
    expect(errorsOf(['size', 'S', 'male', 'proposed'], ['size', 'M', 'male', 'reviewed'])[0]).toMatch(/mix/);
    expect(errorsOf(['colour', 'red', 'male', 'proposed'], ['colour', 'blue', 'female', 'reviewed'])).toEqual([]);
  });

  it('rejects a blank plumage_key mixed with named keys', () => {
    expect(errorsOf(['colour', 'red', '', 'proposed'], ['colour', 'blue', 'male', 'proposed'])[0]).toMatch(/blank plumage_key/);
    expect(errorsOf(['size', 'S', '', 'proposed'], ['size', 'M', 'male', 'proposed'])[0]).toMatch(/blank plumage_key/);
  });

  it('skips rejected rows in the duplicate check', () => {
    expect(errorsOf(['zone', 'montane', '', 'rejected'], ['zone', 'montane', '', 'reviewed'])).toEqual([]);
    expect(
      errorsOf(
        ['zone', 'montane', '', 'reviewed'],
        ['commonness', 'montane:common', '', 'rejected'],
        ['commonness', 'montane:scarce', '', 'reviewed'],
      ),
    ).toEqual([]);
  });

  it('lets proposed commonness use a reviewed or proposed zone, but reviewed needs a reviewed zone', () => {
    expect(errorsOf(['zone', 'montane', '', 'reviewed'], ['commonness', 'montane:common', '', 'proposed'])).toEqual([]);
    expect(errorsOf(['zone', 'montane', '', 'rejected'], ['commonness', 'montane:common', '', 'proposed'])).not.toEqual([]);
  });

  it('requires commonness to have exactly zone and level', () => {
    expect(errorsOf(['commonness', 'montane:common:x', '', 'proposed'])[0]).toMatch(/bad commonness/);
  });
});

describe('buildTraits', () => {
  const build = (...rows: [string, string, string, string][]): ReturnType<typeof buildTraits> =>
    buildTraits(validateTraits(csv(...rows), IDS).rows, new Set(['sp-a']));

  it('uses reviewed rows only', () => {
    const out = build(['zone', 'montane', '', 'proposed'], ['habitat', 'forest', '', 'rejected']);
    expect(out).toEqual({ schema_version: 1, species: {} });
  });

  it('leaves unknown traits missing', () => {
    const out = build(['zone', 'montane', '', 'reviewed']);
    expect(out.species['sp-a']).toEqual({ species_id: 'sp-a', zones: ['montane'] });
  });

  it("expands 'all' to 12 present months and fills listed months", () => {
    const all = build(['month', 'all', '', 'reviewed']).species['sp-a']?.months;
    expect(all).toEqual(Array(12).fill('present'));
    const some = build(['month', '1', '', 'reviewed'], ['month', '12', '', 'reviewed']).species['sp-a']?.months;
    expect(some?.filter((m) => m === 'present')).toHaveLength(2);
    expect([some?.[0], some?.[1], some?.[11]]).toEqual(['present', 'absent', 'present']);
  });

  it('groups colours by plumage and unions sizes in class order', () => {
    const out = build(
      ['colour', 'red', 'male', 'reviewed'],
      ['colour', 'blue', 'male', 'reviewed'],
      ['colour', 'brown', 'female', 'reviewed'],
      ['size', 'XL', 'male', 'reviewed'],
      ['size', 'M', 'female', 'reviewed'],
      ['size', 'XL', 'female', 'reviewed'],
    ).species['sp-a'];
    expect(out?.colours).toEqual([['red', 'blue'], ['brown']]);
    expect(out?.size).toEqual(['M', 'XL']);
  });

  it('maps behaviours, habitats and commonness', () => {
    const out = build(
      ['behaviour', 'ground', '', 'reviewed'],
      ['habitat', 'coast', '', 'reviewed'],
      ['zone', 'montane', '', 'reviewed'],
      ['commonness', 'montane:scarce', '', 'reviewed'],
    ).species['sp-a'];
    expect(out).toEqual({
      species_id: 'sp-a',
      zones: ['montane'],
      habitats: ['coast'],
      behaviours: ['ground'],
      commonness: { montane: 'scarce' },
    });
  });
});

describe('buildTraits ledger gate', () => {
  const rows = validateTraits(
    ['sp-a', 'sp-b'].map((id) => `${id},zone,montane,,expert:x,high,reviewed,`).reduce((a, l) => `${a}\n${l}`, HEADER),
    IDS,
  ).rows;

  it('ships only species listed in the ledger', () => {
    expect(Object.keys(buildTraits(rows, new Set(['sp-b'])).species)).toEqual(['sp-b']);
  });

  it('ships nothing for an empty ledger', () => {
    expect(buildTraits(rows, new Set()).species).toEqual({});
  });
});
