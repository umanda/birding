import { mkdirSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { MEDIA_DIR } from './validate-media';

const MASTER_EDGE = 1600;
const MASTER_QUALITY = 80;
const ID = /^[a-z0-9][a-z0-9-]*$/;

// Resizes an original to the committed master. Orientation is applied, then all metadata
// (EXIF, GPS, ICC) is dropped, which is sharp's default.
export async function ingestMaster(
  ids: { speciesId: string; imageId: string },
  source: string,
  masterDir: string,
): Promise<string> {
  if (!ID.test(ids.speciesId) || !ID.test(ids.imageId)) {
    throw new Error('species_id and image_id must be lowercase ids');
  }
  const target = path.join(masterDir, ids.speciesId, `${ids.imageId}.webp`);
  mkdirSync(path.dirname(target), { recursive: true });
  await sharp(source)
    .rotate()
    .resize({ width: MASTER_EDGE, height: MASTER_EDGE, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: MASTER_QUALITY, effort: 4 })
    .toFile(target);
  return target;
}

async function main(): Promise<void> {
  const [speciesId, imageId, source] = process.argv.slice(2);
  if (!speciesId || !imageId || !source) {
    throw new Error('usage: npm run media:ingest -- <species_id> <image_id> <source-file>');
  }
  const target = await ingestMaster({ speciesId, imageId }, source, MEDIA_DIR);
  process.stdout.write(`wrote ${target}\nNext: add a licences.csv row with file ${speciesId}/${imageId}.webp\n`);
}

if (require.main === module) {
  main().catch((error: unknown) => {
    process.stderr.write(`${String(error)}\n`);
    process.exit(1);
  });
}
