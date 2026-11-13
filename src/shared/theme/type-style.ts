import type { TextStyle } from 'react-native';

import type { Language } from '@/shared/i18n/language';

import { fontStyle } from './fonts';
import { BASE_FONT_SIZE, typography } from './tokens';
import type { TypeName } from './tokens';

/** Font, size and script-correct line height for a type token (Sinhala needs taller lines). */
export function typeStyle(name: TypeName, language: Language): TextStyle {
  const { size, weight, lineHeightLatin, lineHeightSinhala } = typography[name];
  const fontSize = size * BASE_FONT_SIZE;
  const lineHeight = fontSize * (language === 'si' ? lineHeightSinhala : lineHeightLatin);
  return { ...fontStyle(language, weight), fontSize, lineHeight };
}
