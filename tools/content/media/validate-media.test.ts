import { parseRegister, validateMedia } from './validate-media';
import type { MediaContext } from './validate-media';

const HEADER =
  'image_id,species_id,plumage_key,view,file,source_url,author,licence,licence_url,attribution,modifications,retrieved_on,display_ok,training_ok,status,reviewed_by,reviewed_at';
const ctx: MediaContext = { speciesIds: new Set(['slb-a']), files: [] };

function row(overrides: Record<string, string | null> = {}): Record<string, string | null> {
  return {
    image_id: 'img-1',
    species_id: 'slb-a',
    plumage_key: 'male',
    view: 'perched',
    file: 'slb-a/img-1.webp',
    source_url: 'https://example.org/p',
    author: 'A. Author',
    licence: 'CC-BY-4.0',
    licence_url: 'https://creativecommons.org/licenses/by/4.0/',
    attribution: 'Photo by A. Author',
    modifications: null,
    retrieved_on: '2026-11-14',
    display_ok: 'yes',
    training_ok: 'unknown',
    status: 'proposed',
    reviewed_by: null,
    reviewed_at: null,
    ...overrides,
  };
}
const reviewed = { status: 'reviewed', reviewed_by: 'owner', reviewed_at: '2026-11-14' };
const withFile: MediaContext = { ...ctx, files: ['slb-a/img-1.webp'] };

describe('validateMedia', () => {
  it('accepts an empty register and a valid proposed row', () => {
    expect(validateMedia([], ctx).errors).toEqual([]);
    expect(validateMedia([row()], ctx).errors).toEqual([]);
  });

  it('accepts a reviewed row with its file', () => {
    expect(validateMedia([row(reviewed)], withFile).errors).toEqual([]);
  });

  it.each<[string, Record<string, string | null>, MediaContext, string]>([
    ['unknown species', { species_id: 'slb-x', file: 'slb-x/img-1.webp' }, ctx, 'unknown species_id'],
    ['bad plumage_key', { plumage_key: 'Male' }, ctx, 'plumage_key'],
    ['bad view', { view: 'swimming' }, ctx, 'view'],
    ['bad status', { status: 'approved' }, ctx, 'status'],
    ['http url', { source_url: 'http://example.org/p' }, ctx, 'source_url'],
    ['ND licence', { licence: 'CC-BY-ND-4.0' }, ctx, 'not allowed'],
    ['NC-ND licence', { licence: 'CC-BY-NC-ND-4.0' }, ctx, 'not allowed'],
    ['all rights reserved', { licence: 'All rights reserved' }, ctx, 'not allowed'],
    ['wrong file path', { file: 'img-1.webp' }, ctx, 'file must be'],
    ['reviewed without file', reviewed, ctx, 'has no file'],
    ['reviewed with blank author', { ...reviewed, author: null }, withFile, 'blank author'],
    ['licence_url not matching licence', { ...reviewed, licence_url: 'https://creativecommons.org/licenses/by-sa/4.0/' }, withFile, 'licence_url must be'],
    ['reviewed with display_ok no', { ...reviewed, display_ok: 'no' }, withFile, 'display_ok'],
  ])('rejects %s', (_name, overrides, context, message) => {
    expect(validateMedia([row(overrides)], context).errors.join('\n')).toContain(message);
  });

  it('rejects duplicate image_id', () => {
    expect(validateMedia([row(), row()], ctx).errors).toContain('Duplicate image_id: img-1');
  });

  it('rejects a webp with no reviewed row', () => {
    expect(validateMedia([row()], withFile).errors).toContain(
      'slb-a/img-1.webp: image file needs exactly one reviewed row',
    );
  });

  it('allows any licence on a rejected row', () => {
    expect(validateMedia([row({ status: 'rejected', licence: 'CC-BY-ND-4.0' })], ctx).errors).toEqual([]);
  });

  it('counts NC rows but not rejected ones', () => {
    const rows = [
      row({ licence: 'CC-BY-NC-4.0' }),
      row({ image_id: 'img-2', file: 'slb-a/img-2.webp', licence: 'CC-BY-NC-SA-3.0' }),
      row({ image_id: 'img-3', file: 'slb-a/img-3.webp', licence: 'CC-BY-NC-4.0', status: 'rejected' }),
    ];
    const report = validateMedia(rows, ctx);
    expect(report.errors).toEqual([]);
    expect(report.noncommercialCount).toBe(2);
  });
});

describe('parseRegister', () => {
  it('reads quoted commas and turns blanks into null', () => {
    const csv = `${HEADER}
img-1,slb-a,male,perched,f,,"Doe, ""J""",,,,,,,unknown,proposed,,
`;
    const [record] = parseRegister(csv).rows;
    expect(record?.author).toBe('Doe, "J"');
    expect(record?.source_url).toBeNull();
  });

  it('returns no rows or errors for a header-only file', () => {
    expect(parseRegister(`${HEADER}
`)).toEqual({ rows: [], errors: [] });
  });

  it('reports a wrong header', () => {
    expect(parseRegister('image_id,species_id').errors[0]).toContain('header must be');
  });

  it('reports a ragged row without throwing', () => {
    expect(parseRegister(`${HEADER}
img-1,slb-a
`).errors[0]).toContain('cannot be parsed');
  });
});

describe('licence_url', () => {
  it.each([
    ['CC0-1.0', 'https://creativecommons.org/publicdomain/zero/1.0/'],
    ['CC-BY-SA-4.0', 'https://creativecommons.org/licenses/by-sa/4.0'],
    ['CC-BY-NC-SA-3.0', 'https://creativecommons.org/licenses/by-nc-sa/3.0/'],
  ])('accepts the canonical url for %s', (licence, licence_url) => {
    expect(validateMedia([row({ ...reviewed, licence, licence_url })], withFile).errors).toEqual([]);
  });
});
