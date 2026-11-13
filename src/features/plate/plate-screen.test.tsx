import { Stack } from 'expo-router';
import { userEvent } from '@testing-library/react-native';
import { renderRouter, screen, within } from 'expo-router/testing-library';

import { BrowseScreen } from '@/features/browse';
import { SettingsProvider } from '@/features/settings';
import { getPlate, getSpeciesByPlate } from '@/shared/data/content';
import type { OccurrenceFilter } from '@/shared/data/content';
import { matchesFilters } from '@/shared/data/occurrence-filter';
import { createMemoryStore } from '@/test-utils/memory-store';

import { PlateRoute } from './plate-screen';

jest.mock('expo-localization', () => ({ getLocales: () => [{ languageCode: 'en' }] }));

function Root(): React.JSX.Element {
  return (
    <SettingsProvider store={createMemoryStore()}>
      <Stack />
    </SettingsProvider>
  );
}

const routes = {
  _layout: Root,
  browse: BrowseScreen,
  'plate/[id]': PlateRoute,
  'species/[id]': () => null,
};
const PLATE_1 = 'plate-01';
const PLATE_2 = 'plate-02';
const COMPOUND_CODE_SPECIES = 'Indian Spot-billed Duck'; // plate-02, code R/M
const plateTitle = (id: string): string => getPlate(id)?.title.en ?? '';

const expectedNames = (plateId: string, filters: OccurrenceFilter[] = []): string[] =>
  getSpeciesByPlate(plateId)
    .filter((species) => matchesFilters(species, filters))
    .map(({ names }) => names.en);

// The primary name is the first text in each SpeciesRow link.
const shownNames = (): string[] =>
  screen
    .getAllByRole('link')
    .map((link) => String(within(link).getAllByText(/./)[0]?.props.children));

describe('PlateRoute', () => {
  it('shows the heading and lists species in plate_order', async () => {
    await renderRouter(routes, { initialUrl: `/plate/${PLATE_1}` });
    expect(
      await screen.findByRole('header', { name: `Plate 1 · ${plateTitle(PLATE_1)}` }),
    ).toBeTruthy();
    expect(shownNames()).toEqual(expectedNames(PLATE_1));
  });

  it('applies the occ filter from the route', async () => {
    await renderRouter(routes, { initialUrl: `/plate/${PLATE_1}?occ=E` });
    await screen.findByRole('header');
    const expected = expectedNames(PLATE_1, ['E']);
    expect(expected.length).toBeLessThan(expectedNames(PLATE_1).length);
    expect(shownNames()).toEqual(expected);
  });

  it.each(['R', 'M'] as const)('keeps compound codes under the %s filter', async (filter) => {
    await renderRouter(routes, { initialUrl: `/plate/${PLATE_2}?occ=${filter}` });
    await screen.findByRole('header');
    expect(shownNames()).toEqual(expectedNames(PLATE_2, [filter]));
    expect(shownNames()).toContain(COMPOUND_CODE_SPECIES);
  });

  it('shows the empty state and clears the filter', async () => {
    const user = userEvent.setup();
    await renderRouter(routes, { initialUrl: `/plate/${PLATE_2}?occ=E` });
    expect(await screen.findByText('No species match these filters')).toBeTruthy();
    await user.press(screen.getByRole('button', { name: 'Clear filters' }));
    expect(await screen.findByRole('link', { name: /Little Grebe/ })).toBeTruthy();
    expect(shownNames()).toEqual(expectedNames(PLATE_2));
    expect(screen).toHaveSearchParams({ id: PLATE_2 });
  });

  it('shows a not-found state linking back to Browse', async () => {
    const user = userEvent.setup();
    await renderRouter(routes, { initialUrl: '/plate/nope' });
    expect(await screen.findByRole('header', { name: 'Plate not found' })).toBeTruthy();
    await user.press(screen.getByRole('link', { name: 'Go to Browse' }));
    expect(screen).toHavePathname('/browse');
  });

  it('is reached from Browse with the filter carried over', async () => {
    const user = userEvent.setup();
    await renderRouter(routes, { initialUrl: '/browse?occ=E' });
    await user.press(
      await screen.findByRole('link', { name: new RegExp(`^Plate 1 · ${plateTitle(PLATE_1)}`) }),
    );
    expect(screen).toHavePathname(`/plate/${PLATE_1}`);
    expect(screen).toHaveSearchParams({ id: PLATE_1, occ: 'E' });
  });
});
