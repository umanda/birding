import type { Language } from './language';
import en from './locales/en.json';
import si from './locales/si.json';

type RawKey = keyof typeof en;
type PluralForm = 'zero' | 'one' | 'two' | 'few' | 'many' | 'other';

// "search.results.one" -> "search.results"; recurses because infer stops at the first ".".
type StripForm<K extends string> = K extends `${infer Head}.${infer Tail}`
  ? Tail extends PluralForm
    ? Head
    : `${Head}.${StripForm<Tail>}`
  : K;

/** Keys callers pass to t(); plural entries are addressed by their base key. */
export type MessageKey = StripForm<RawKey>;
export type Messages = Record<string, string>;
export type Vars = Record<string, string | number>;

// Typing si as Record<RawKey, string> makes tsc fail when si.json lacks an en.json key.
const siMessages: Record<RawKey, string> = si;

export const MESSAGES: Record<Language, Messages> = { en, si: siMessages };

/**
 * Looks up `key`, picks a plural form (`key.one`, `key.other`, ...) when `vars.count`
 * is a number, and replaces `{name}` placeholders. A missing key returns the key itself
 * so the gap is visible instead of crashing.
 */
export function translate(
  messages: Messages,
  language: Language,
  key: string,
  vars: Vars = {},
): string {
  const template = findTemplate(messages, language, key, vars.count);
  if (template === undefined) return key;
  return template.replace(/\{(\w+)\}/g, (placeholder, name: string) =>
    name in vars ? String(vars[name]) : placeholder,
  );
}

function findTemplate(
  messages: Messages,
  language: Language,
  key: string,
  count: string | number | undefined,
): string | undefined {
  if (typeof count !== 'number') return messages[key];
  const form = new Intl.PluralRules(language).select(count);
  return messages[`${key}.${form}`] ?? messages[`${key}.other`] ?? messages[key];
}

export function createT(language: Language): (key: MessageKey, vars?: Vars) => string {
  return (key, vars) => translate(MESSAGES[language], language, key, vars);
}
