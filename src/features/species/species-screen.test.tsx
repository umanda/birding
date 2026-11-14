import { Slot, Stack, router } from 'expo-router';
import { act, renderRouter, screen } from 'expo-router/testing-library';
import { Text } from 'react-native';

import { SettingsProvider } from '@/features/settings';
import type { Species } from '@/shared/data/content-schema';
import { createT } from '@/shared/i18n/translate';
import { createMemoryStore } from '@/test-utils/memory-store';

import { SpeciesDetail, SpeciesRoute } from './species-screen';

let mockLanguage = 'en';
jest.mock('expo-localization', () => ({ getLocales: () => [{ languageCode: mockLanguage }] }));

const JUNGLEFOWL_ID = 'slb-gallus-lafayettii';
const PEAFOWL_PLATE_SI = 'මොනරා';

function Root(): React.JSX.Element {
  return (
    <SettingsProvider store={createMemoryStore()}>
      <Slot />
    </SettingsProvider>
  );
}

const routes = { _layout: Root, 'species/[id]': SpeciesRoute };

const blankSinhala: Species = {
  species_id: 'x',
  plate_id: 'missing-plate',
  plate_order: 1,
  names: { en: 'Test Bird', si: null, scientific: 'Avis testis' },
  occurrence_code: 'R',
  iucn_category: null,
};

describe('species screen', () => {
  it('shows neither not-found text nor a heading on the build-time template', async () => {
    mockLanguage = 'en';
    await renderRouter(routes, { initialUrl: '/species/[id]' });
    expect(screen.queryByText('Species not found')).toBeNull();
    expect(screen.queryByRole('header')).toBeNull();
  });

  it('shows names, plate and badges in English', async () => {
    mockLanguage = 'en';
    await renderRouter(routes, { initialUrl: `/species/${JUNGLEFOWL_ID}` });
    expect(await screen.findByRole('header', { name: 'Sri Lanka Junglefowl' })).toBeTruthy();
    expect(screen.getByText('වලි කුකුළා')).toBeTruthy();
    expect(screen.getByText('Gallus lafayettii')).toHaveStyle({ fontStyle: 'italic' });
    expect(screen.getByText('Indian Peafowl')).toBeTruthy();
    expect(screen.getByText('● E Endemic')).toBeTruthy();
    expect(screen.getByLabelText('Global status (working value): Least Concern')).toBeTruthy();
  });

  it('shows the Sinhala primary name and plate title', async () => {
    mockLanguage = 'si';
    await renderRouter(routes, { initialUrl: `/species/${JUNGLEFOWL_ID}` });
    expect(await screen.findByRole('header', { name: 'වලි කුකුළා' })).toBeTruthy();
    expect(screen.getByText('Sri Lanka Junglefowl')).toBeTruthy();
    expect(screen.getByText(PEAFOWL_PLATE_SI)).toBeTruthy();
  });

  it('shows a not-found state with a link to Search', async () => {
    mockLanguage = 'en';
    await renderRouter(routes, { initialUrl: '/species/nope' });
    expect(await screen.findByRole('header', { name: 'Species not found' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Go to Search' })).toBeTruthy();
  });

  it('goes back to the tabs after a direct load', async () => {
    mockLanguage = 'en';
    const stackRoutes = {
      _layout: { default: () => <Stack />, unstable_settings: { anchor: '(tabs)' } },
      '(tabs)/index': () => <Text>Home</Text>,
      'species/[id]': SpeciesRoute,
    };
    function Wrapped(): React.JSX.Element {
      return (
        <SettingsProvider store={createMemoryStore()}>
          <Stack />
        </SettingsProvider>
      );
    }
    await renderRouter(
      { ...stackRoutes, _layout: { default: Wrapped, unstable_settings: { anchor: '(tabs)' } } },
      { initialUrl: `/species/${JUNGLEFOWL_ID}` },
    );
    expect(router.canGoBack()).toBe(true);
    await act(() => router.back());
    expect(screen).toHavePathname('/');
  });
});

describe('SpeciesDetail', () => {
  it('reads Not recorded for blank values', async () => {
    await renderRouter({
      index: () => <SpeciesDetail species={blankSinhala} language="en" t={createT('en')} />,
    });
    expect(await screen.findByText('Test Bird')).toBeTruthy();
    expect(screen.getByText('Global status (working value): Not recorded')).toBeTruthy();
    // Two blank header values, then six prose sections: this species has no text record.
    await screen.findByText('Description');
    expect(screen.getAllByText('Not recorded')).toHaveLength(8);
  });

  it('uses the English heading in the Sinhala UI when the Sinhala name is blank', async () => {
    await renderRouter({
      index: () => <SpeciesDetail species={blankSinhala} language="si" t={createT('si')} />,
    });
    expect(await screen.findByRole('header', { name: 'Test Bird' })).toBeTruthy();
  });
});
