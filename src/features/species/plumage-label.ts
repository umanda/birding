import type { MessageKey, Vars } from '@/shared/i18n/translate';

type Translate = (key: MessageKey, vars?: Vars) => string;

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
