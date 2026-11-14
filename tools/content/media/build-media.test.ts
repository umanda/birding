import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import sharp from 'sharp';
import { buildMedia, validatedRows, writeMedia } from './build-media';
import { parseManifest } from './media-manifest';
import type { MediaRow } from './media-schema';

function row(overrides: Partial<MediaRow> = {}): MediaRow {
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
    status: 'reviewed',
    reviewed_by: 'owner',
    reviewed_at: '2026-11-14',
    ...overrides,
  };
}

// Noisy 2000x1000 master, so resizing and encoding are real.
async function writeMaster(dir: string, file: string): Promise<void> {
  const target = path.join(dir, file);
  mkdirSync(path.dirname(target), { recursive: true });
  const noise = await sharp({
    create: {
      width: 2000,
      height: 1000,
      channels: 3,
      background: '#808080',
      noise: { type: 'gaussian', mean: 128, sigma: 30 },
    },
  })
    .webp({ quality: 80 })
    .toBuffer();
  writeFileSync(target, noise);
}

const tmp = (): string => mkdtempSync(path.join(tmpdir(), 'media-'));

describe('buildMedia', () => {
  it('builds a sorted manifest from reviewed rows only, with one thumb per species', async () => {
    const masters = tmp();
    await writeMaster(masters, 'slb-a/img-1.webp');
    await writeMaster(masters, 'slb-a/img-0.webp');
    const rows = [
      row(),
      row({ image_id: 'img-0', file: 'slb-a/img-0.webp', plumage_key: 'female', licence: 'CC-BY-NC-4.0' }),
      row({ image_id: 'img-2', file: 'slb-a/img-2.webp', status: 'proposed' }),
    ];
    const { manifest, files } = await buildMedia(rows, masters);
    expect(manifest.schema_version).toBe(1);
    expect(manifest.images.map((i) => i.image_id)).toEqual(['img-0', 'img-1']);
    expect(manifest.images.map((i) => [i.primary, i.thumb !== null])).toEqual([
      [false, false],
      [true, true],
    ]);
    expect(files.size).toBe(3);
    const [nc, open] = manifest.images;
    expect(nc?.credit.replace_before_launch).toBe(true);
    expect(open?.credit).toEqual({
      author: 'A. Author',
      licence: 'CC-BY-4.0',
      licence_url: 'https://creativecommons.org/licenses/by/4.0/',
      source_url: 'https://example.org/p',
      attribution: 'Photo by A. Author',
      replace_before_launch: false,
    });
  });

  it('names files by content hash, records the master hash and sizes files to the ADR', async () => {
    const masters = tmp();
    await writeMaster(masters, 'slb-a/img-1.webp');
    const { manifest, files } = await buildMedia([row()], masters);
    const [image] = manifest.images;
    expect(image?.thumb?.path).toBe(`media/slb-a/img-1.${image?.thumb?.sha256.slice(0, 8)}.thumb.webp`);
    expect(image?.full.path).toMatch(/^media\/slb-a\/img-1\.[0-9a-f]{8}\.full\.webp$/);
    expect(image?.master_sha256).toMatch(/^[0-9a-f]{64}$/);
    expect(files.get(image?.full.path ?? '')?.length).toBe(image?.full.bytes);
    expect(await sharp(files.get(image?.thumb?.path ?? '')).metadata()).toMatchObject({ width: 240, height: 120 });
    expect(await sharp(files.get(image?.full.path ?? '')).metadata()).toMatchObject({ width: 1080, height: 540 });
    expect([image?.width, image?.height]).toEqual([1080, 540]);
  });

  it('is deterministic', async () => {
    const masters = tmp();
    await writeMaster(masters, 'slb-a/img-1.webp');
    const first = await buildMedia([row()], masters);
    const second = await buildMedia([row()], masters);
    expect(second.manifest).toEqual(first.manifest);
    for (const [file, data] of first.files) expect(second.files.get(file)?.equals(data)).toBe(true);
  });

  it('strips metadata from the generated files', async () => {
    const masters = tmp();
    mkdirSync(path.join(masters, 'slb-a'));
    const withExif = await sharp({ create: { width: 400, height: 300, channels: 3, background: '#468' } })
      .withExif({ IFD0: { Copyright: 'someone' } })
      .webp()
      .toBuffer();
    writeFileSync(path.join(masters, 'slb-a/img-1.webp'), withExif);
    expect((await sharp(withExif).metadata()).exif).toBeDefined();
    const { files } = await buildMedia([row()], masters);
    for (const data of files.values()) expect((await sharp(data).metadata()).exif).toBeUndefined();
  });

  it('writes files and a manifest that parses, and removes stale files', async () => {
    const masters = tmp();
    const out = tmp();
    await writeMaster(masters, 'slb-a/img-1.webp');
    mkdirSync(path.join(out, 'media/slb-old'), { recursive: true });
    writeFileSync(path.join(out, 'media/slb-old/gone.webp'), 'x');
    const build = await buildMedia([row()], masters);
    const manifestFile = path.join(out, 'manifest.json');
    writeMedia(build, out, manifestFile);
    expect(existsSync(path.join(out, 'media/slb-old/gone.webp'))).toBe(false);
    for (const file of build.files.keys()) expect(existsSync(path.join(out, file))).toBe(true);
    expect(parseManifest(readFileSync(manifestFile, 'utf8'))).toEqual({ manifest: build.manifest, errors: [] });
  });

  it('writes an empty manifest for an empty register', async () => {
    const build = await buildMedia([], tmp());
    expect(build.manifest).toEqual({ schema_version: 1, images: [] });
  });
});

describe('validatedRows', () => {
  const HEADER =
    'image_id,species_id,plumage_key,view,file,source_url,author,licence,licence_url,attribution,modifications,retrieved_on,display_ok,training_ok,status,reviewed_by,reviewed_at';
  const context = { speciesIds: new Set(['slb-a']), files: [] };

  it('returns rows for a valid register', () => {
    expect(validatedRows(`${HEADER}\n`, context)).toEqual([]);
  });

  it('throws on an invalid register before anything is built', () => {
    const csv = `${HEADER}\nimg-1,slb-x,male,perched,slb-x/img-1.webp,,,,,,,,,unknown,proposed,,\n`;
    expect(() => validatedRows(csv, context)).toThrow('unknown species_id');
  });
});
