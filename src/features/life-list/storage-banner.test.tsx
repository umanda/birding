import { render, screen } from '@testing-library/react-native';

import { SettingsProvider } from '@/features/settings';
import { createMemoryStore } from '@/test-utils/memory-store';

import { LifeListProvider } from './life-list-context';
import { createMemoryRepository } from './memory-repository';
import { StorageBanner } from './storage-banner';

jest.mock('./open-store', () => ({ openStore: jest.fn() }));
jest.mock('expo-localization', () => ({ getLocales: () => [{ languageCode: 'en' }] }));

const MESSAGE = "Sightings can't be saved on this device right now.";

const wrap = (
  open: () => Promise<ReturnType<typeof createMemoryRepository>>,
): React.JSX.Element => (
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
});
