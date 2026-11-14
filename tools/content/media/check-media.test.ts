import { checkMedia } from './check-media';
import type { FileInfo } from './check-media';
import { creditOf } from './media-manifest';
import type { ManifestImage, MediaManifest } from './media-manifest';
import type { MediaRow } from './media-schema';

const SHA = 'ab12cd34'.padEnd(64, '0');
const MASTER_SHA = 'cd34ef56'.padEnd(64, '1');
const THUMB_PATH = 'media/slb-a/img-1.ab12cd34.thumb.webp';
const FULL_PATH = 'media/slb-a/img-1.ab12cd34.full.webp';
const FULL_2_PATH = 'media/slb-a/img-2.ab12cd34.full.webp';
const row: MediaRow = {
  image_id: 'img-1',
  species_id: 'slb-a',
  plumage_key: 'male',
  view: 'perched',
  file: 'slb-a/img-1.webp',
  source_url: 'https://example.org/p',
  author: 'A. Author',
  licence: 'CC-BY-NC-4.0',
  licence_url: 'https://creativecommons.org/licenses/by-nc/4.0/',
  attribution: 'Photo by A. Author',
  modifications: null,
  retrieved_on: '2026-11-14',
  display_ok: 'yes',
  training_ok: 'unknown',
  status: 'reviewed',
  reviewed_by: 'owner',
  reviewed_at: '2026-11-14',
};
const image = (): ManifestImage => ({
  image_id: 'img-1',
  species_id: 'slb-a',
  plumage_key: 'male',
  view: 'perched',
  primary: true,
  thumb: { path: THUMB_PATH, bytes: 100, sha256: SHA },
  full: { path: FULL_PATH, bytes: 1000, sha256: SHA },
  master_sha256: MASTER_SHA,
  width: 1080,
  height: 720,
  credit: creditOf(row),
});
const manifest = (...images: ManifestImage[]): MediaManifest => ({ schema_version: 1, images });
const files = (): Map<string, FileInfo> =>
  new Map([
    [THUMB_PATH, { bytes: 100, sha256: SHA }],
    [FULL_PATH, { bytes: 1000, sha256: SHA }],
  ]);
const masters = (): Map<string, string> => new Map([['slb-a/img-1.webp', MASTER_SHA]]);

type Overrides = { rows?: MediaRow[]; files?: Map<string, FileInfo>; masters?: Map<string, string> };
function run(m: MediaManifest, over: Overrides = {}): string {
  return checkMedia({
    rows: over.rows ?? [row],
    manifest: m,
    files: over.files ?? files(),
    masters: over.masters ?? masters(),
  }).join('\n');
}

describe('checkMedia', () => {
  it('accepts an empty register with an empty manifest', () => {
    expect(checkMedia({ rows: [], manifest: manifest(), files: new Map(), masters: new Map() })).toEqual([]);
  });

  it('accepts a matching manifest, register, masters and files', () => {
    expect(run(manifest(image()))).toBe('');
  });

  it('ignores rows that are not reviewed', () => {
    const rows = [{ ...row, status: 'proposed' as const }];
    expect(checkMedia({ rows, manifest: manifest(), files: new Map(), masters: new Map() })).toEqual([]);
  });

  it('reports a reviewed row missing from the manifest', () => {
    expect(run(manifest(), { files: new Map() })).toContain('img-1: reviewed but not in manifest');
  });

  it('reports a manifest image without a reviewed row', () => {
    expect(run(manifest(image()), { rows: [] })).toContain('no reviewed register row');
  });

  it('reports duplicate manifest entries once', () => {
    const out = run(manifest(image(), image(), image()));
    expect(out.match(/duplicate in manifest/g)).toHaveLength(1);
  });

  it('reports credit and field drift from the register', () => {
    const drifted = { ...image(), view: 'flight', credit: { ...image().credit, author: 'Someone else' } };
    const out = run(manifest(drifted));
    expect(out).toContain('view differs');
    expect(out).toContain('credit differs');
  });

  it('reports a changed or missing master', () => {
    const changed = run(manifest(image()), { masters: new Map([['slb-a/img-1.webp', 'x']]) });
    expect(changed).toContain('master_sha256 differs');
    expect(run(manifest(image()), { masters: new Map() })).toContain('master_sha256 differs');
  });

  it('reports a missing file, a size change and a hash change', () => {
    const f = files();
    f.delete(THUMB_PATH);
    f.set(FULL_PATH, { bytes: 5, sha256: 'x' });
    const out = run(manifest(image()), { files: f });
    expect(out).toContain('missing file');
    expect(out).toContain('file is 5 bytes');
    expect(out).toContain('sha256 differs');
  });

  it('reports a file name whose hash does not match the sha256', () => {
    const bad = image();
    bad.full.sha256 = 'ff'.repeat(32);
    expect(run(manifest(bad))).toContain('path should be media/slb-a/img-1.ffffffff.full.webp');
  });

  it('reports files that are not in the manifest', () => {
    const f = files();
    f.set('media/slb-a/stale.webp', { bytes: 1, sha256: 'x' });
    expect(run(manifest(image()), { files: f })).toContain('media/slb-a/stale.webp: not in manifest');
  });

  it('enforces the size budgets', () => {
    const big = image();
    big.full.bytes = 200 * 1024 + 1;
    const f = files();
    f.set(FULL_PATH, { bytes: big.full.bytes, sha256: SHA });
    expect(run(manifest(big), { files: f })).toContain('over the 204800 byte limit');
  });
});

describe('checkMedia primary thumbnail', () => {
  const second: MediaRow = { ...row, image_id: 'img-2', plumage_key: 'female', file: 'slb-a/img-2.webp' };
  const secondImage = (): ManifestImage => ({
    ...image(),
    image_id: 'img-2',
    plumage_key: 'female',
    primary: false,
    thumb: null,
    full: { path: FULL_2_PATH, bytes: 1000, sha256: SHA },
  });
  const both = (): Overrides => ({
    rows: [row, second],
    files: files().set(FULL_2_PATH, { bytes: 1000, sha256: SHA }),
    masters: masters().set('slb-a/img-2.webp', MASTER_SHA),
  });

  it('accepts a thumb on the primary image only', () => {
    expect(run(manifest(image(), secondImage()), both())).toBe('');
  });

  it('reports a thumb on a non-primary image', () => {
    const wrong = { ...secondImage(), primary: true, thumb: image().thumb };
    expect(run(manifest(image(), wrong), both())).toContain('img-2: primary should be false');
  });

  it('reports a primary image without a thumb', () => {
    const out = run(manifest({ ...image(), thumb: null }));
    expect(out).toContain('thumb must be present exactly when primary');
  });
});
