import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { useEffect } from 'react';

import { SettingsProvider } from '@/features/settings';
import { keyValueStore } from '@/shared/platform/key-value-store';
import { registerServiceWorker } from '@/shared/platform/register-service-worker';
import { fontAssets } from '@/shared/theme/fonts';

// Anchor lets a direct load of /species/<id> or /plate/<id> go back to the tabs.
export const unstable_settings = { anchor: '(tabs)' };

export default function RootLayout() {
  const [, error] = useFonts(fontAssets);

  useEffect(() => {
    // eslint-disable-next-line no-console -- single, intentional font-failure report
    if (error) console.warn('Sinhala font failed to load; using system fallback.', error);
  }, [error]);

  useEffect(registerServiceWorker, []);

  // Render immediately: fallback fonts swap in, so static HTML hydrates and nothing blocks.
  return (
    <SettingsProvider store={keyValueStore}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="plate/[id]" options={{ headerShown: true }} />
        <Stack.Screen name="species/[id]" options={{ headerShown: true }} />
      </Stack>
    </SettingsProvider>
  );
}
