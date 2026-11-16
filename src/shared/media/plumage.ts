import type { ManifestImage } from '@/shared/data/media';
import type { MessageKey, Translate } from '@/shared/i18n/translate';

const MORPH_PREFIX = 'morph_';
const PLAIN_KEYS: Record<string, MessageKey> = {
  male: 'plumage.male',
  female: 'plumage.female',
  juvenile: 'plumage.juvenile',
  adult: 'plumage.adult',
  breeding: 'plumage.breeding',
  non_breeding: 'plumage.nonBreeding',
  eclipse: 'plumage.eclipse',
};

// A morph key carries its own name ("morph_dark"); an unknown key is shown as is, never guessed.
export function plumageLabel(key: string, t: Translate): string {
  const plain = PLAIN_KEYS[key];
  if (plain) return t(plain);
  if (!key.startsWith(MORPH_PREFIX)) return key;
  return t('plumage.morph', { name: key.slice(MORPH_PREFIX.length).replaceAll('_', ' ') });
}

// Reader order (spec 003), unrelated to the thumbnail rule in the media tooling.
// Morphs and any unknown key sort after these, alphabetically.
const GALLERY_PLUMAGE_ORDER = [
  'male',
  'female',
  'adult',
  'juvenile',
  'breeding',
  'non_breeding',
  'eclipse',
] as const;

function plumageRank(key: string): number {
  const index = (GALLERY_PLUMAGE_ORDER as readonly string[]).indexOf(key);
  return index === -1 ? GALLERY_PLUMAGE_ORDER.length : index;
}

function compareText(a: string, b: string): number {
  return a < b ? -1 : Number(a > b);
}

export function sortForGallery(images: readonly ManifestImage[]): ManifestImage[] {
  return [...images].sort(
    (a, b) =>
      plumageRank(a.plumage_key) - plumageRank(b.plumage_key) ||
      compareText(a.plumage_key, b.plumage_key) ||
      compareText(a.image_id, b.image_id),
  );
}
