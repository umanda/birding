import { renderRouter, screen } from 'expo-router/testing-library';
import { Slot } from 'expo-router';

import ComingSoonScreen from '@/app/(tabs)/index';
import TabsLayout from '@/app/(tabs)/_layout';
import { SettingsProvider } from '@/features/settings';
import { createMemoryStore } from '@/test-utils/memory-store';

jest.mock('expo-localization', () => ({ getLocales: () => [{ languageCode: 'si' }] }));

function Root() {
  return (
    <SettingsProvider store={createMemoryStore()}>
      <Slot />
    </SettingsProvider>
  );
}

describe('tab shell', () => {
  it('opens on Identify with translated tab labels and the language toggle', async () => {
    await renderRouter({
      _layout: Root,
      '(tabs)/_layout': TabsLayout,
      '(tabs)/index': ComingSoonScreen,
      '(tabs)/search': ComingSoonScreen,
      '(tabs)/browse': ComingSoonScreen,
      '(tabs)/life-list': ComingSoonScreen,
      '(tabs)/me': ComingSoonScreen,
    });
    expect(await screen.findByText('ඉක්මනින් එනු ඇත')).toBeTruthy();
    expect(screen.getAllByText('හඳුනාගන්න').length).toBeGreaterThan(0);
    for (const label of ['සොයන්න', 'පිරික්සන්න', 'මගේ ලැයිස්තුව', 'මම']) {
      expect(screen.getByText(label)).toBeTruthy();
    }
    expect(screen.getByLabelText('භාෂාව: English')).toBeTruthy();
  });
});
