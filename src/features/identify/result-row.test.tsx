import { fireEvent, userEvent } from '@testing-library/react-native';
import { renderRouter, screen } from 'expo-router/testing-library';

import { MESSAGES, translate } from '@/shared/i18n/translate';
import type { Translate } from '@/shared/i18n/translate';

import { ResultRow } from './result-row';
import type { RankedSpecies } from './types';

jest.mock('expo-localization', () => ({ getLocales: () => [{ languageCode: 'en' }] }));

const t: Translate = (key, vars) => translate(MESSAGES.en, 'en', key, vars);
const HIDDEN = { includeHiddenElements: true }; // the placeholder is decorative
const SPARROW = 'slb-passer-domesticus'; // no photo
const CROW = 'slb-corvus-splendens'; // has a thumbnail

const result = (id: string, flags: RankedSpecies['flags'] = []): RankedSpecies => ({
  species_id: id,
  score: 0,
  descriptionScore: 0,
  reasons: [
    { field: 'zone', fit: 'match' },
    { field: 'size', fit: 'partial' },
  ],
  flags,
});

async function open(row: RankedSpecies): Promise<ReturnType<typeof userEvent.setup>> {
  const user = userEvent.setup();
  await renderRouter(
    {
      index: () => <ResultRow result={row} language="en" t={t} />,
      'species/[id]': () => null,
    },
    { initialUrl: '/' },
  );
  return user;
}

describe('ResultRow', () => {
  it('shows names, a spoken why line and flags with text', async () => {
    await open(result(SPARROW, ['not-usually-now', 'data-incomplete']));
    expect(await screen.findByText('House Sparrow')).toBeTruthy();
    expect(screen.getByLabelText('Place: matched. Size: close')).toBeTruthy();
    expect(screen.getByLabelText('Not usually now')).toBeTruthy();
    expect(screen.getByLabelText('Data incomplete')).toBeTruthy();
    expect(screen.getByText(/⚑/, HIDDEN)).toBeTruthy();
    expect(screen.getByText(/ⓘ/, HIDDEN)).toBeTruthy();
  });

  it('shows "No photo yet" only when the species has no thumbnail', async () => {
    await open(result(SPARROW));
    expect(await screen.findByText('No photo yet', HIDDEN)).toBeTruthy();
  });

  it('shows a thumbnail instead of the placeholder when one exists', async () => {
    await open(result(CROW));
    expect(await screen.findByText('House Crow')).toBeTruthy();
    expect(screen.queryByText('No photo yet', HIDDEN)).toBeNull();
  });

  it('falls back to the placeholder when the thumbnail fails to load', async () => {
    await open(result(CROW));
    await fireEvent(await screen.findByTestId('result-thumb'), 'error');
    expect(await screen.findByText('No photo yet', HIDDEN)).toBeTruthy();
    expect(screen.queryByTestId('result-thumb')).toBeNull();
  });

  it('hides the placeholder from assistive technology', async () => {
    await open(result(SPARROW));
    await screen.findByText('House Sparrow');
    expect(screen.queryByText('No photo yet')).toBeNull();
  });

  it('opens the species page', async () => {
    const user = await open(result(SPARROW));
    await user.press(await screen.findByRole('link'));
    expect(screen).toHavePathname(`/species/${SPARROW}`);
  });
});
