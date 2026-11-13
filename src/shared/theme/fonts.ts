import { NotoSans_400Regular } from '@expo-google-fonts/noto-sans/400Regular';
import { NotoSans_600SemiBold } from '@expo-google-fonts/noto-sans/600SemiBold';
import { NotoSans_700Bold } from '@expo-google-fonts/noto-sans/700Bold';
import { NotoSans_400Regular_Italic } from '@expo-google-fonts/noto-sans/400Regular_Italic';
import { NotoSansSinhala_400Regular } from '@expo-google-fonts/noto-sans-sinhala/400Regular';
import { NotoSansSinhala_600SemiBold } from '@expo-google-fonts/noto-sans-sinhala/600SemiBold';
import { NotoSansSinhala_700Bold } from '@expo-google-fonts/noto-sans-sinhala/700Bold';

// Bundled in the app binary / web export, so fonts work offline.
export const fontAssets = {
  NotoSans_400Regular,
  NotoSans_600SemiBold,
  NotoSans_700Bold,
  NotoSans_400Regular_Italic,
  NotoSansSinhala_400Regular,
  NotoSansSinhala_600SemiBold,
  NotoSansSinhala_700Bold,
};

type Script = 'latin' | 'sinhala';
type Weight = 400 | 600 | 700;

const WEIGHT_SUFFIX: Record<Weight, string> = { 400: 'Regular', 600: 'SemiBold', 700: 'Bold' };

export function fontFamily(script: Script, weight: Weight): string {
  const family = script === 'sinhala' ? 'NotoSansSinhala' : 'NotoSans';
  return `${family}_${weight}${WEIGHT_SUFFIX[weight]}`;
}
