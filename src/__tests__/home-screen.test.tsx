import { renderRouter, screen } from 'expo-router/testing-library';

import HomeScreen from '@/app/index';
import { SettingsProvider } from '@/features/settings';

import { createMemoryStore } from '@/test-utils/memory-store';

describe('HomeScreen', () => {
  it('shows the app title', async () => {
    function Index() {
      return (
        <SettingsProvider store={createMemoryStore()}>
          <HomeScreen />
        </SettingsProvider>
      );
    }
    await renderRouter({ index: Index });
    expect(screen.getByText('Sri Lanka Birds')).toBeTruthy();
  });
});
