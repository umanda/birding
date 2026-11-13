import type { TextStyle } from 'react-native';

// Latin uses the platform system font. Only Sinhala ships a font (subset TTFs, bundled so it
// works offline), because many devices lack a good Sinhala face and web first-load size matters.
export const fontAssets = {
  NotoSansSinhala_400Regular: require('../../../assets/fonts/NotoSansSinhala-400Regular.ttf'),
  NotoSansSinhala_700Bold: require('../../../assets/fonts/NotoSansSinhala-700Bold.ttf'),
};

export type Script = 'si' | 'en';
type Weight = 400 | 600 | 700;

const SINHALA_BOLD_FROM = 600;

type FontStyle = Pick<TextStyle, 'fontFamily' | 'fontWeight'>;

export function fontStyle(script: Script, weight: Weight): FontStyle {
  if (script !== 'si') return { fontFamily: undefined, fontWeight: `${weight}` };
  // Only 400 and 700 are shipped, so 600 renders as bold.
  const isBold = weight >= SINHALA_BOLD_FROM;
  return isBold
    ? { fontFamily: 'NotoSansSinhala_700Bold', fontWeight: '700' }
    : { fontFamily: 'NotoSansSinhala_400Regular', fontWeight: '400' };
}
