import type { ManifestImage } from '@/shared/data/media';

const HASH = 'a'.repeat(64);

// Test helper: a valid manifest image with overrides.
export function fixtureImage(overrides: Partial<ManifestImage> = {}): ManifestImage {
  const imageId = overrides.image_id ?? 'img-1';
  return {
    image_id: imageId,
    species_id: 'slb-test',
    plumage_key: 'male',
    view: 'side',
    primary: false,
    thumb: null,
    full: { path: `media/full/${imageId}.webp`, bytes: 1000, sha256: HASH },
    master_sha256: HASH,
    width: 1080,
    height: 720,
    credit: {
      author: 'Jane Doe',
      licence: 'CC BY 4.0',
      licence_url: 'https://creativecommons.org/licenses/by/4.0/',
      source_url: 'https://commons.wikimedia.org/wiki/File:X.jpg',
      attribution: null,
      replace_before_launch: false,
    },
    ...overrides,
  };
}
