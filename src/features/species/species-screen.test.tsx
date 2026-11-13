import { Slot } from 'expo-router';
import { renderRouter, screen } from 'expo-router/testing-library';

import { SettingsProvider } from '@/features/settings';
import { getPlate } from '@/shared/data/content';
import type { Species } from '@/shared/data/content-schema';
import { createT } from '@/shared/i18n/translate';
import { createMemoryStore } from '@/test-utils/memory-store';

import { SpeciesDetail, SpeciesRoute } from './species-screen';

let mockLanguage = 'en';
jest.mock('expo-localization', () => ({ getLocales: () => [{ languageCode: mockLanguage }] }));

const JUNGLEFOWL_ID = 'slb-gallus-lafayettii';

function Root(): React.JSX.Element {
  return (
    <SettingsProvider store={createMemoryStore()}>
      <Slot />
    </SettingsProvider>
  );
}

const routes = { _layout: Root, 'species/[id]': SpeciesRoute };

describe('species screen', () => {
  it('shows names, plate and badges in English', async () => {
    mockLanguage = 'en';
    await renderRouter(routes, { initialUrl: `/species/${JUNGLEFOWL_ID}` });
    expect(await screen.findByRole('header', { name: 'Sri Lanka Junglefowl' })).toBeTruthy();
    expect(screen.getByText('වලි කුකුළා')).toBeTruthy();
    expect(screen.getByText('Gallus lafayettii')).toHaveStyle({ fontStyle: 'italic' });
    expect(screen.getByText('● E Endemic')).toBeTruthy();
    expect(screen.getByLabelText('Global status (working value): Least Concern')).toBeTruthy();
  });

  it('shows the Sinhala primary name and plate title', async () => {
    mockLanguage = 'si';
    await renderRouter(routes, { initialUrl: `/species/${JUNGLEFOWL_ID}` });
    expect(await screen.findByRole('header', { name: 'වලි කුකුළා' })).toBeTruthy();
    expect(screen.getByText('Sri Lanka Junglefowl')).toBeTruthy();
    expect(screen.getByText(getPlate('plate-01')?.title.si ?? '')).toBeTruthy();
  });

  it('shows a not-found state for an unknown id', async () => {
    mockLanguage = 'en';
    await renderRouter(routes, { initialUrl: '/species/nope' });
    expect(await screen.findByRole('header', { name: 'Species not found' })).toBeTruthy();
  });
});

describe('SpeciesDetail', () => {
  it('reads Not recorded for blank values', async () => {
    const blank: Species = {
      species_id: 'x',
      plate_id: 'missing-plate',
      plate_order: 1,
      names: { en: 'Test Bird', si: null, scientific: 'Avis testis' },
      occurrence_code: 'R',
      iucn_category: null,
    };
    await renderRouter({
      index: () => <SpeciesDetail species={blank} language="en" t={createT('en')} />,
    });
    expect(await screen.findByText('Test Bird')).toBeTruthy();
    expect(screen.getByText('Global status (working value): Not recorded')).toBeTruthy();
    expect(screen.getAllByText('Not recorded')).toHaveLength(2);
  });
});
