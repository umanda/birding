import type { Language } from '@/shared/i18n/language';

export type LocalizedText = { en: string; si: string | null };

/** The text and the language it is actually written in, so callers pick the right font. */
export type Rendered = { text: string; language: Language };

// English is the only always-present language, so it is the fallback.
export function localized(value: LocalizedText, language: Language): Rendered {
  const text = value[language];
  return text ? { text, language } : { text: value.en, language: 'en' };
}

export const otherLanguage = (language: Language): Language => (language === 'si' ? 'en' : 'si');
