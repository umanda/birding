import { render, screen } from '@testing-library/react-native';
import { AccessibilityInfo, Platform } from 'react-native';

import { SettingsProvider } from '@/features/settings';
import { createT } from '@/shared/i18n/translate';
import { createMemoryStore } from '@/test-utils/memory-store';

import type { LifeListRepository } from './life-list-repository';
import { LifeListProvider } from './life-list-context';
import { createMemoryRepository } from './memory-repository';
import { StorageBanner, StorageBannerView } from './storage-banner';

jest.mock('./open-store', () => ({ openStore: jest.fn() }));
jest.mock('expo-localization', () => ({ getLocales: () => [{ languageCode: 'en' }] }));

const MESSAGE = "Sightings can't be saved on this device right now.";

const wrap = (open: () => Promise<LifeListRepository>): React.JSX.Element => (
  <SettingsProvider store={createMemoryStore()}>
    <LifeListProvider open={open}>
      <StorageBanner />
    </LifeListProvider>
  </SettingsProvider>
);

describe('StorageBanner', () => {
  it('is empty when the device store works', async () => {
    await render(wrap(async () => createMemoryRepository()));
    expect(await screen.findByTestId('storage-banner-region')).toBeTruthy();
    expect(screen.queryByText(MESSAGE, { exact: false })).toBeNull();
  });

  it('shows the warning when storage fell back to memory', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    await render(wrap(() => Promise.reject(new Error('blocked'))));
    expect(await screen.findByText(MESSAGE, { exact: false })).toBeTruthy();
    warn.mockRestore();
  });

  it('announces once on iOS when the species page shows a second copy', async () => {
    const os = jest.replaceProperty(Platform, 'OS', 'ios');
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    const announce = jest.spyOn(AccessibilityInfo, 'announceForAccessibility');
    announce.mockClear();
    await render(
      <SettingsProvider store={createMemoryStore()}>
        <LifeListProvider open={() => Promise.reject(new Error('blocked'))}>
          <StorageBanner />
          <StorageBannerView language="en" t={createT('en')} />
        </LifeListProvider>
      </SettingsProvider>,
    );
    expect(await screen.findAllByText(MESSAGE, { exact: false })).toHaveLength(2);
    expect(announce).toHaveBeenCalledTimes(1);
    announce.mockRestore();
    warn.mockRestore();
    os.restore();
  });
});
