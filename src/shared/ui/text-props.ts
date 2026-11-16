import type { TextProps } from 'react-native';

import type { Language } from '@/shared/i18n/language';

// The page title is the h1.
export const SECTION_HEADING_LEVEL = 2;

// react-native-web renders `lang` as the HTML attribute; the native Text type does not declare it.
export const langProps = (lang: Language): TextProps => ({ lang }) as TextProps;

// react-native-web renders aria-level as the heading level; without it a header role becomes h1.
export const headingProps = (level: number): TextProps => ({ 'aria-level': level }) as TextProps;
