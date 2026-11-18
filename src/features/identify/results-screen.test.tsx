import { act, userEvent } from '@testing-library/react-native';
import { Link, router, Slot } from 'expo-router';
import { renderRouter, screen } from 'expo-router/testing-library';

import { SettingsProvider } from '@/features/settings';
import { getSpecies } from '@/shared/data/content';
import type { SpeciesTraits } from '@/shared/data/traits';
import { createMemoryStore } from '@/test-utils/memory-store';

import { ResultsScreen } from './results-screen';

jest.mock('expo-localization', () => ({ getLocales: () => [{ languageCode: 'en' }] }));

const SPARROW = 'slb-passer-domesticus'; // fits every answer, no photo
const BULBUL = 'slb-pycnonotus-cafer'; // fits, but its size is unreviewed
const CROW = 'slb-corvus-splendens'; // wrong size, has a photo
const PEAFOWL = 'slb-pavo-cristatus'; // lives in the dry zone only

const PRESENT_ALL_YEAR = Array<'present'>(12).fill('present');
const TRAITS: SpeciesTraits[] = [
  { species_id: BULBUL, zones: ['wet_lowland'] },
  { species_id: CROW, zones: ['wet_lowland'], size: ['L'], months: PRESENT_ALL_YEAR },
  { species_id: PEAFOWL, zones: ['dry_lowland'], size: ['XXXL'], months: PRESENT_ALL_YEAR },
  { species_id: SPARROW, zones: ['wet_lowland'], size: ['S'], months: PRESENT_ALL_YEAR },
];
const nameOf = (id: string): string => getSpecies(id)?.names.en ?? id;

function Root(): React.JSX.Element {
  return (
    <SettingsProvider store={createMemoryStore()}>
      <Slot />
    </SettingsProvider>
  );
}

const NO_MATCH_TRAITS: SpeciesTraits[] = [
  { species_id: SPARROW, zones: ['wet_lowland'], size: ['S'] },
  { species_id: CROW, zones: ['wet_lowland'], size: ['L'] },
  { species_id: PEAFOWL, zones: ['dry_lowland'], size: ['XXXL'] },
];

async function open(query: string, traits = TRAITS): Promise<ReturnType<typeof userEvent.setup>> {
  const user = userEvent.setup();
  await renderRouter(
    {
      _layout: Root,
      index: () => null,
      browse: () => null,
      search: () => null,
      'identify/[step]': () => null,
      'identify/results': () => <ResultsScreen traits={traits} />,
      'species/[id]': () => null,
    },
    { initialUrl: `/identify/results?${query}` },
  );
  return user;
}

const MATCHING = 'month=7&zone=wet_lowland&size=S';
// Every species is wrong for size XXXL, so nothing matches; removing size fixes that.
const NOTHING = 'month=7&zone=wet_lowland&size=XXXL';
describe('ResultsScreen matches', () => {
  it('lists matches best first with a why line and flags', async () => {
    await open(MATCHING);
    const rows = await screen.findAllByRole('link', { name: /House Sparrow|Red-vented/ });
    expect(rows[0]).toHaveTextContent(/House Sparrow/);
    expect(rows[1]).toHaveTextContent(/Red-vented/);
    expect(screen.getByText('2 matches')).toBeTruthy();
    expect(screen.getByLabelText('Place: matched. Month: matched. Size: matched')).toBeTruthy();
    expect(screen.getByLabelText('Data incomplete')).toBeTruthy();
    expect(screen.queryByText('No close matches')).toBeNull();
  });

  it('opens the species page when a row is pressed', async () => {
    const user = await open(MATCHING);
    await user.press(await screen.findByRole('link', { name: new RegExp(nameOf(SPARROW)) }));
    expect(screen).toHavePathname(`/species/${SPARROW}`);
  });
});

describe('ResultsScreen answers', () => {
  it('re-ranks in place and updates the live title when a chip is removed', async () => {
    const user = await open(MATCHING);
    const title = await screen.findByText('2 matches');
    expect(title.props.accessibilityLiveRegion).toBe('polite');
    expect(screen.queryByText(nameOf(CROW))).toBeNull();
    await user.press(screen.getByRole('button', { name: 'Remove Size S' }));
    expect(screen).toHaveSearchParams({ month: '7', zone: 'wet_lowland' });
    expect(await screen.findByText(nameOf(CROW))).toBeTruthy();
    expect(screen.getByText('3 matches')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Remove Size S' })).toBeNull();
  });

  it('removing the month chip keeps the "any month" choice', async () => {
    const user = await open(MATCHING);
    await user.press(await screen.findByRole('button', { name: 'Remove July' }));
    expect(screen).toHaveSearchParams({ month: 'any', zone: 'wet_lowland', size: 'S' });
  });

  it('opens the first unanswered question without leaving a stale one in history', async () => {
    const user = userEvent.setup();
    await renderRouter(
      {
        _layout: Root,
        index: () => (
          <Link href="/identify/size?month=7&zone=wet_lowland&size=S" push>
            Start
          </Link>
        ),
        'identify/[step]': () => (
          <Link href={`/identify/results?${MATCHING}`} push>
            See results
          </Link>
        ),
        'identify/results': () => <ResultsScreen traits={TRAITS} />,
      },
      { initialUrl: '/' },
    );
    await user.press(await screen.findByText('Start'));
    await user.press(await screen.findByText('See results'));
    await user.press(await screen.findByRole('button', { name: 'Answer more questions (3 left)' }));
    expect(screen).toHavePathname('/identify/habitat');
    expect(screen).toHaveSearchParams({
      step: 'habitat',
      month: '7',
      zone: 'wet_lowland',
      size: 'S',
    });
    await act(() => router.back());
    expect(screen).toHavePathname('/');
  });
});

describe('ResultsScreen with no match', () => {
  it('shows the closest species in order with a way out', async () => {
    await open(NOTHING, NO_MATCH_TRAITS);
    expect(await screen.findByText('No close matches')).toBeTruthy();
    expect(screen.getByText('None of the birds in this guide fits all your answers.')).toBeTruthy();
    const rows = screen.getAllByRole('link', { name: /House|Peafowl/ });
    expect(rows).toHaveLength(3);
    expect(rows[0]).toHaveTextContent(/House Crow/);
    expect(rows[1]).toHaveTextContent(/House Sparrow/);
    expect(rows[2]).toHaveTextContent(/Indian Peafowl/);
    expect(screen.getByRole('header', { name: 'Not in this guide yet?' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Browse' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Search' })).toBeTruthy();
  });

  it('removes the last answer and re-ranks', async () => {
    const user = await open(NOTHING, NO_MATCH_TRAITS);
    await user.press(await screen.findByRole('button', { name: 'Remove last answer (Size XXXL)' }));
    expect(screen).toHaveSearchParams({ month: '7', zone: 'wet_lowland' });
    expect(await screen.findByText('2 matches')).toBeTruthy();
    expect(screen.queryByText('No close matches')).toBeNull();
  });
});

describe('ResultsScreen footer', () => {
  it('states coverage and links to Browse and Search without scrolling', async () => {
    const user = await open(MATCHING);
    expect(
      await screen.findByText('This guide can identify 4 of its 295 species so far'),
    ).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Browse' })).toBeTruthy();
    await user.press(screen.getByRole('link', { name: 'Search' }));
    expect(screen).toHavePathname('/search');
  });
});
