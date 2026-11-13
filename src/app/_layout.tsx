import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { useEffect } from 'react';

import { SettingsProvider } from '@/features/settings';
import { keyValueStore } from '@/shared/platform/key-value-store';
import { fontAssets } from '@/shared/theme/fonts';

export default function RootLayout() {
  const [, error] = useFonts(fontAssets);

  useEffect(() => {
    // eslint-disable-next-line no-console -- single, intentional font-failure report
    if (error) console.warn('Sinhala font failed to load; using system fallback.', error);
  }, [error]);

  // Render immediately: fallback fonts swap in, so static HTML hydrates and nothing blocks.
  return (
    <SettingsProvider store={keyValueStore}>
      <Stack />
    </SettingsProvider>
  );
}
