import { budgetErrors, choosePrimaries, parseManifest, targetWarnings } from './media-manifest';
import type { ManifestImage } from './media-manifest';
import type { MediaRow } from './media-schema';

const SHA = 'a'.repeat(64);
const variant = (bytes: number): { path: string; bytes: number; sha256: string } => ({
  path: 'p',
  bytes,
  sha256: SHA,
});
const image = (thumb: number | null, full: number): ManifestImage =>
  ({
    image_id: 'img-1',
    primary: thumb !== null,
    thumb: thumb === null ? null : variant(thumb),
    full: variant(full),
  }) as ManifestImage;
const row = (image_id: string, plumage_key: string, species_id = 'slb-a', status = 'reviewed'): MediaRow =>
  ({ image_id, plumage_key, species_id, status }) as MediaRow;

describe('budgetErrors', () => {
  it('passes within budget', () => {
    expect(budgetErrors([image(12_000, 120_000)])).toEqual([]);
  });

  it('fails a full over 200 KB', () => {
    expect(budgetErrors([image(1, 200 * 1024 + 1)])[0]).toContain('img-1: full is');
  });

  it('fails thumbs totalling over 4 MB and ignores images without a thumb', () => {
    const images = Array.from({ length: 5 }, () => image(1024 * 1024, 1));
    expect(budgetErrors(images).join()).toContain('thumbs total');
    expect(budgetErrors([image(null, 1)])).toEqual([]);
  });
});

describe('targetWarnings', () => {
  it('warns above the thumb and full targets only', () => {
    expect(targetWarnings([image(12 * 1024, 120 * 1024)])).toEqual([]);
    expect(targetWarnings([image(12 * 1024 + 1, 120 * 1024 + 1)])).toHaveLength(2);
  });
});

describe('choosePrimaries', () => {
  const pick = (...keys: string[]): string[] => [...choosePrimaries(keys.map((k) => row(`i-${k}`, k)))];

  it('picks adult, then male, then breeding, then alphabetical', () => {
    expect(pick('female', 'male', 'adult')).toEqual(['i-adult']);
    expect(pick('female', 'breeding', 'male')).toEqual(['i-male']);
    expect(pick('juvenile', 'breeding')).toEqual(['i-breeding']);
    expect(pick('juvenile', 'female', 'eclipse')).toEqual(['i-eclipse']);
  });

  it('breaks ties by image_id, ignores unreviewed rows and picks one per species', () => {
    const rows = [
      row('b', 'male'),
      row('a', 'male'),
      row('z', 'adult', 'slb-a', 'proposed'),
      row('c', 'female', 'slb-b'),
    ];
    expect([...choosePrimaries(rows)].sort()).toEqual(['a', 'c']);
  });
});

describe('parseManifest', () => {
  it('accepts an empty manifest', () => {
    expect(parseManifest('{"schema_version":1,"images":[]}')).toEqual({
      manifest: { schema_version: 1, images: [] },
      errors: [],
    });
  });

  it('reports invalid JSON without throwing', () => {
    expect(parseManifest('{').errors[0]).toContain('not valid JSON');
  });

  it('reports a wrong shape readably', () => {
    const errors = parseManifest('{"schema_version":2}').errors.join('\n');
    expect(errors).toContain('schema_version');
    expect(errors).toContain('images');
    expect(parseManifest('{"schema_version":1,"images":[{"image_id":"x"}]}').errors.join()).toContain('images.0');
    expect(parseManifest('null').errors).toHaveLength(1);
  });
});
