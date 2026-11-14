import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import sharp from 'sharp';
import { ingestMaster } from './ingest-media';

const tmp = (): string => mkdtempSync(path.join(tmpdir(), 'ingest-'));
const ids = { speciesId: 'slb-a', imageId: 'img-1' };

async function writeJpeg(file: string, orientation: number): Promise<void> {
  await sharp({ create: { width: 3200, height: 2000, channels: 3, background: '#468' } })
    .withExif({ IFD0: { Copyright: 'someone' } })
    .withMetadata({ orientation })
    .jpeg()
    .toFile(file);
}

describe('ingestMaster', () => {
  it('writes a 1600 px master with metadata stripped', async () => {
    const dir = tmp();
    const source = path.join(dir, 'original.jpg');
    await writeJpeg(source, 1);
    expect((await sharp(source).metadata()).exif).toBeDefined();
    const target = await ingestMaster(ids, source, dir);
    expect(target).toBe(path.join(dir, 'slb-a', 'img-1.webp'));
    const meta = await sharp(target).metadata();
    expect([meta.width, meta.height, meta.format]).toEqual([1600, 1000, 'webp']);
    expect(meta.exif).toBeUndefined();
    expect(meta.icc).toBeUndefined();
  });

  it('applies EXIF orientation 6 before resizing', async () => {
    const dir = tmp();
    const source = path.join(dir, 'rotated.jpg');
    await writeJpeg(source, 6);
    const target = await ingestMaster(ids, source, dir);
    const meta = await sharp(target).metadata();
    expect([meta.width, meta.height]).toEqual([1000, 1600]);
    expect(meta.orientation).toBeUndefined();
  });

  it('does not enlarge a small original', async () => {
    const dir = tmp();
    const source = path.join(dir, 'small.png');
    await sharp({ create: { width: 800, height: 600, channels: 3, background: '#468' } }).png().toFile(source);
    const meta = await sharp(await ingestMaster(ids, source, dir)).metadata();
    expect([meta.width, meta.height]).toEqual([800, 600]);
  });

  it('rejects ids that are not lowercase slugs', async () => {
    const bad = { speciesId: '../x', imageId: 'a' };
    await expect(ingestMaster(bad, 'f', tmp())).rejects.toThrow('lowercase');
  });
});
