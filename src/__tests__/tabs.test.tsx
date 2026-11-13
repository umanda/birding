import { Slot } from 'expo-router';
import { renderRouter, screen } from 'expo-router/testing-library';

import TabsLayout from '@/app/(tabs)/_layout';
import { ComingSoonScreen } from '@/features/shell';
import { SettingsProvider } from '@/features/settings';
import { createMemoryStore } from '@/test-utils/memory-store';

jest.mock('expo-localization', () => ({ getLocales: () => [{ languageCode: 'si' }] }));

function Root(): React.JSX.Element {
  return (
    <SettingsProvider store={createMemoryStore()}>
      <Slot />
    </SettingsProvider>
  );
}

const routes = {
  _layout: Root,
  '(tabs)/_layout': TabsLayout,
  '(tabs)/index': ComingSoonScreen,
  '(tabs)/search': ComingSoonScreen,
  '(tabs)/browse': ComingSoonScreen,
  '(tabs)/life-list': ComingSoonScreen,
  '(tabs)/me': ComingSoonScreen,
};

const LABELS = ['හඳුනාගන්න', 'සොයන්න', 'පිරික්සන්න', 'මගේ ලැයිස්තුව', 'මම'];

describe('tab shell', () => {
  it('opens on Identify with translated tab labels and the language toggle', async () => {
    await renderRouter(routes);
    expect(await screen.findByText('ඉක්මනින් එනු ඇත')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'හඳුනාගන්න' })).toBeTruthy();
    for (const label of LABELS) {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    }
    expect(screen.getByLabelText('භාෂාව: English')).toBeTruthy();
  });

  it('deep-links to a tab by URL', async () => {
    await renderRouter(routes, { initialUrl: '/search' });
    expect(await screen.findByText('ඉක්මනින් එනු ඇත')).toBeTruthy();
    expect(screen).toHavePathname('/search');
  });
});
