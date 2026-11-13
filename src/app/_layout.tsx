import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';

import { fontAssets } from '@/shared/theme/fonts';

export default function RootLayout() {
  const [loaded, error] = useFonts(fontAssets);

  // Fonts are bundled, so this is near-instant; on failure fall back to system fonts.
  if (!loaded && !error) return null;
  return <Stack />;
}
