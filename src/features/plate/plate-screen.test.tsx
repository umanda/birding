import { Stack } from 'expo-router';
import { userEvent } from '@testing-library/react-native';
import { renderRouter, screen, within } from 'expo-router/testing-library';

import { BrowseScreen } from '@/features/browse';
import { SettingsProvider } from '@/features/settings';
import { getPlate, getSpecies, getSpeciesByPlate } from '@/shared/data/content';
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
const PLATE_1_TITLE = getPlate(PLATE_1)?.title.en ?? '';
const speciesNames = (plateId: string): string[] =>
  getSpeciesByPlate(plateId).map(({ names }) => names.en);

type Node = { props?: { title?: string }; children?: unknown };
const collectTitles = (node: unknown): string[] => {
  if (typeof node !== 'object' || node === null) return [];
  const { props, children } = node as Node;
  const own = props?.title ? [props.title] : [];
  return own.concat([children ?? []].flat().flatMap(collectTitles));
};
const headerTitles = (): string[] => collectTitles(screen.toJSON());

describe('PlateRoute', () => {
  it('shows the header and lists species in plate_order', async () => {
    await renderRouter(routes, { initialUrl: `/plate/${PLATE_1}` });
    await screen.findByText('Painted Francolin');
    // The native header title is a prop, not text, so look for it in the rendered tree.
    expect(headerTitles()).toContain(`Plate 1 · ${PLATE_1_TITLE}`);
    const names = speciesNames(PLATE_1);
    const shown = screen
      .getAllByRole('link')
      .map((link) => within(link).getAllByText(/./)[0]?.props.children);
    expect(shown).toEqual(names);
  });

  it('applies the occ filter from the route', async () => {
    await renderRouter(routes, { initialUrl: `/plate/${PLATE_1}?occ=E` });
    expect(await screen.findByText('Sri Lanka Junglefowl')).toBeTruthy();
    expect(screen.getAllByRole('link')).toHaveLength(2);
    expect(screen.queryByText('Indian Peafowl')).toBeNull();
  });

  it.each(['R', 'M'])('keeps compound codes under the %s filter', async (occ) => {
    await renderRouter(routes, { initialUrl: `/plate/${PLATE_2}?occ=${occ}` });
    const compound = getSpecies('slb-anas-poecilorhyncha')?.names.en ?? '';
    expect(await screen.findByText(compound)).toBeTruthy();
  });

  it('shows the empty state and clears the filter', async () => {
    const user = userEvent.setup();
    await renderRouter(routes, { initialUrl: `/plate/${PLATE_2}?occ=E` });
    expect(await screen.findByText('No species match these filters')).toBeTruthy();
    await user.press(screen.getByRole('button', { name: 'Clear filters' }));
    expect(await screen.findByText(speciesNames(PLATE_2)[0] ?? '')).toBeTruthy();
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
      await screen.findByRole('link', { name: new RegExp(`^Plate 1 · ${PLATE_1_TITLE}`) }),
    );
    expect(screen).toHavePathname(`/plate/${PLATE_1}`);
    expect(screen).toHaveSearchParams({ id: PLATE_1, occ: 'E' });
  });
});
