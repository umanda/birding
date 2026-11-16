import type { ManifestImage, MediaManifest } from '../../../tools/content/media/media-manifest';
import manifestJson from '../../../content/media-manifest.json';

export type { ManifestImage };

// Type-only import: the zod schema stays in tooling. CI (media:check) validates the file.
const images = (manifestJson as MediaManifest).images;

// Display order is the caller's concern; this is stable by image_id.
export function getSpeciesImages(speciesId: string): ManifestImage[] {
  return images
    .filter((image) => image.species_id === speciesId)
    .sort((a, b) => (a.image_id < b.image_id ? -1 : Number(a.image_id > b.image_id)));
}

// Paths in the manifest are relative to public/, which the web export serves at "/".
export function mediaUrl(path: string): string {
  return `/${path}`;
}

export function getAllImages(): readonly ManifestImage[] {
  return images;
}
