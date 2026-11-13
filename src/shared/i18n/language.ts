export const LANGUAGES = ['si', 'en'] as const;
export type Language = (typeof LANGUAGES)[number];

const FALLBACK_LANGUAGE: Language = 'en';

export function isLanguage(value: unknown): value is Language {
  return LANGUAGES.some((language) => language === value);
}

/** `si` maps to Sinhala; every other locale falls back to English. */
export function languageFromLocale(languageCode: string | null | undefined): Language {
  return languageCode === 'si' ? 'si' : FALLBACK_LANGUAGE;
}
