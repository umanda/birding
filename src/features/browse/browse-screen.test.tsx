import { Slot } from 'expo-router';
import { userEvent } from '@testing-library/react-native';
import { renderRouter, screen } from 'expo-router/testing-library';

import { LanguageToggle, SettingsProvider } from '@/features/settings';
import { getPlates } from '@/shared/data/content';
import { createMemoryStore } from '@/test-utils/memory-store';

import { BrowseScreen } from './browse-screen';

jest.mock('expo-localization', () => ({ getLocales: () => [{ languageCode: 'en' }] }));

function Root(): React.JSX.Element {
  return (
    <SettingsProvider store={createMemoryStore()}>
      <LanguageToggle />
      <Slot />
    </SettingsProvider>
  );
}

const routes = { _layout: Root, browse: BrowseScreen };
const firstTitle = getPlates()[0]?.title.en;
const ENDEMIC_CHIP = 'Endemic, 35';

describe('BrowseScreen', () => {
  it('lists plates with titles and species counts', async () => {
    await renderRouter(routes, { initialUrl: '/browse' });
    expect(await screen.findByText(`Plate 1 · ${firstTitle}`)).toBeTruthy();
    expect(screen.getByRole('checkbox', { name: ENDEMIC_CHIP, checked: false })).toBeTruthy();
  });

  it('reads the filter from the route and removes it when toggled off', async () => {
    const user = userEvent.setup();
    await renderRouter(routes, { initialUrl: '/browse?occ=E' });
    const chip = await screen.findByRole('checkbox', { name: ENDEMIC_CHIP, checked: true });
    expect(screen).toHaveSearchParams({ occ: 'E' });
    await user.press(chip);
    expect(screen).toHaveSearchParams({});
  });

  it('switches titles with the language', async () => {
    const user = userEvent.setup();
    await renderRouter(routes, { initialUrl: '/browse' });
    await user.press(await screen.findByLabelText('Language: සිංහල'));
    expect(await screen.findByText(/^පුවරුව 1 · /)).toBeTruthy();
  });
});
