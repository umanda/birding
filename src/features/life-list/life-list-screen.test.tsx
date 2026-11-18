import { Slot } from 'expo-router';
import { userEvent } from '@testing-library/react-native';
import { renderRouter, screen, waitFor } from 'expo-router/testing-library';
import { Text } from 'react-native';

import { SettingsProvider } from '@/features/settings';
import { getAllSpecies } from '@/shared/data/content';
import type { Species } from '@/shared/data/content-schema';
import { createMemoryStore } from '@/test-utils/memory-store';

import { LifeListProvider } from './life-list-context';
import type { LifeListRepository } from './life-list-repository';
import { LifeListScreen } from './life-list-screen';
import { createMemoryRepository } from './memory-repository';

jest.mock('expo-localization', () => ({ getLocales: () => [{ languageCode: 'en' }] }));
jest.setTimeout(30000);

const species = getAllSpecies();
const endemics = species.filter((s) => s.occurrence_code === 'E');
const [endemicA, endemicB] = endemics as [Species, Species];
const resident = species.find((s) => s.occurrence_code === 'R') as Species;

const base = { content_version: 'v1' };
async function seeded(): Promise<LifeListRepository> {
  const repo = createMemoryRepository();
  await repo.add({ ...base, species_id: endemicA.species_id, seen_on: '2026-01-05' });
  await repo.add({ ...base, species_id: endemicA.species_id, seen_on: '2026-03-09' });
  await repo.add({ ...base, species_id: endemicB.species_id, seen_on: '2026-02-01' });
  await repo.add({ ...base, species_id: resident.species_id, seen_on: '2026-04-01' });
  return repo;
}

function show(open: () => Promise<LifeListRepository>) {
  const Root = (): React.JSX.Element => (
    <SettingsProvider store={createMemoryStore()}>
      <LifeListProvider open={open}>
        <Slot />
      </LifeListProvider>
    </SettingsProvider>
  );
  const Species = (): React.JSX.Element => <Text>species page</Text>;
  return renderRouter(
    { _layout: Root, 'life-list': LifeListScreen, 'species/[id]': Species },
    { initialUrl: '/life-list' },
  );
}

describe('LifeListScreen', () => {
  it('shows loading, then the empty state with links and the device note', async () => {
    await show(async () => createMemoryRepository());
    expect(await screen.findByText('Your list is empty. Find a bird to add.')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Identify' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Search' })).toBeTruthy();
    expect(screen.getByText('Saved on this device only')).toBeTruthy();
  });

  it('shows the loading text while the store opens', async () => {
    await show(() => new Promise(() => undefined));
    expect(await screen.findByText('Loading your list…')).toBeTruthy();
  });

  it('summarises species, endemics of the content total, sightings and codes', async () => {
    await show(seeded);
    const total = endemics.length;
    expect(await screen.findByText('3 species')).toBeTruthy();
    expect(screen.getByText(`Endemics 2 of ${total}`)).toBeTruthy();
    expect(screen.getByLabelText(`2 of ${total} endemics`)).toBeTruthy();
    expect(screen.getByText('4 sightings')).toBeTruthy();
    expect(screen.getByText('● E Endemic: 2')).toBeTruthy();
    expect(screen.getByText('▲ R Resident: 1')).toBeTruthy();
  });

  it('lists one row per species with first, last and count, newest first', async () => {
    await show(seeded);
    expect(
      await screen.findByText('First 5 January 2026 · Last 9 March 2026 · 2 sightings'),
    ).toBeTruthy();
    expect(
      screen.getByText('First 1 February 2026 · Last 1 February 2026 · 1 sighting'),
    ).toBeTruthy();
    const texts = screen.getAllByText(/^First /).map((node) => node.props.children);
    expect(texts[0]).toContain('1 April 2026');
    expect(texts[1]).toContain('9 March 2026');
  });

  it('keeps a species that left the guide, by id, and counts it in the summary', async () => {
    await show(async () => {
      const repo = createMemoryRepository();
      await repo.add({ ...base, species_id: 'slb-gone', seen_on: '2026-05-01' });
      return repo;
    });
    expect(await screen.findByText('slb-gone')).toBeTruthy();
    expect(screen.getByText('No longer in this guide')).toBeTruthy();
    expect(screen.getByText('No longer in this guide: 1')).toBeTruthy();
    expect(screen.getByText('1 species')).toBeTruthy();
  });

  it('opens the species page when a row is pressed', async () => {
    const user = userEvent.setup();
    await show(seeded);
    await user.press(await screen.findByText(endemicB.names.en));
    await waitFor(() => expect(screen).toHavePathname(`/species/${endemicB.species_id}`));
  });

  describe('sort and filters', () => {
    const FRANCOLIN = 'Painted Francolin'; // resident, seen 1 April
    const SPURFOWL = 'Sri Lanka Spurfowl'; // endemic, last seen 9 March
    const JUNGLEFOWL = 'Sri Lanka Junglefowl'; // endemic, seen 1 February
    const TITLES = new RegExp(`^(${FRANCOLIN}|${SPURFOWL}|${JUNGLEFOWL})$`);
    const shown = (): string[] =>
      screen.getAllByText(TITLES).map((node) => String(node.props.children));

    it('defaults to Recent and marks it checked', async () => {
      await show(seeded);
      await screen.findByText('3 species');
      expect(screen.getByRole('radio', { name: 'Recent', checked: true })).toBeTruthy();
      expect(shown()).toEqual([FRANCOLIN, SPURFOWL, JUNGLEFOWL]);
    });

    it('sorts A to Z by name', async () => {
      const user = userEvent.setup();
      await show(seeded);
      await user.press(await screen.findByRole('radio', { name: 'A–Z' }));
      expect(shown()).toEqual([FRANCOLIN, JUNGLEFOWL, SPURFOWL]);
      expect(screen.getByRole('radio', { name: 'A–Z', checked: true })).toBeTruthy();
    });

    it('sorts by plate order', async () => {
      const user = userEvent.setup();
      await show(seeded);
      await user.press(await screen.findByRole('radio', { name: 'By plate' }));
      expect(shown()).toEqual([FRANCOLIN, SPURFOWL, JUNGLEFOWL]); // plate-01 orders 1, 2, 4;
    });

    it('filters to endemics, keeps the summary, and clears from the no-match state', async () => {
      const user = userEvent.setup();
      await show(seeded);
      await user.press(await screen.findByRole('checkbox', { name: 'Endemic' }));
      expect(shown()).toHaveLength(2);
      expect(screen.getByText('3 species')).toBeTruthy();
      await user.press(screen.getByRole('checkbox', { name: 'Endemic' }));
      await user.press(screen.getByRole('checkbox', { name: 'Migrant' }));
      expect(await screen.findByText('No sightings match')).toBeTruthy();
      await user.press(screen.getByRole('button', { name: 'Clear filters' }));
      expect(shown()).toHaveLength(3);
    });
  });
});
