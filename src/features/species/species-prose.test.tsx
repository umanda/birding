import { render, screen } from '@testing-library/react-native';

import { getSpecies } from '@/shared/data/content';
import { getSpeciesText } from '@/shared/data/species-text';
import type { Species } from '@/shared/data/content-schema';
import { createT } from '@/shared/i18n/translate';
import type { Language } from '@/shared/i18n/language';

import { SpeciesProse } from './species-prose';

const mockGetSpeciesText = jest.mocked(getSpeciesText);
const ENGLISH_ID = 'slb-acridotheres-tristis';
const SINHALA_ID = 'slb-gallus-lafayettii';

function speciesOf(id: string): Species {
  const species = getSpecies(id);
  if (!species) throw new Error(`${id} missing from content.json`);
  return species;
}

async function renderProse(speciesId: string, language: Language): Promise<void> {
  await render(
    <SpeciesProse species={speciesOf(speciesId)} language={language} t={createT(language)} />,
  );
  await screen.findByText(language === 'en' ? 'Description' : 'විස්තරය');
}

describe('SpeciesProse', () => {
  beforeEach(() => mockGetSpeciesText.mockClear());

  it('shows a loading placeholder first', async () => {
    mockGetSpeciesText.mockReturnValueOnce(new Promise(() => undefined));
    await render(<SpeciesProse species={speciesOf(ENGLISH_ID)} language="en" t={createT('en')} />);
    expect(screen.getByText('Loading…')).toBeTruthy();
  });

  it('shows an error message when the text cannot load', async () => {
    mockGetSpeciesText.mockRejectedValueOnce(new Error('offline'));
    await render(<SpeciesProse species={speciesOf(ENGLISH_ID)} language="en" t={createT('en')} />);
    expect(await screen.findByText('Could not load this text.')).toBeTruthy();
  });

  it('shows all six sections without a notice for English text in the English UI', async () => {
    await renderProse(ENGLISH_ID, 'en');
    for (const title of [
      'Description',
      'Male & female',
      'Juvenile',
      'Field tips',
      'Distribution & hotspots',
      'Seasonality',
    ]) {
      expect(screen.getByRole('header', { name: title })).toBeTruthy();
    }
    expect(screen.getByText(/^Medium-sized, familiar myna/)).toHaveProp('lang', 'en');
    expect(screen.queryByText('Not yet available in English')).toBeNull();
  });

  it('notes that English text is not yet available in Sinhala', async () => {
    await renderProse(ENGLISH_ID, 'si');
    expect(screen.getAllByText('සිංහල භාෂාවෙන් තවම නැත')).toHaveLength(6);
    expect(screen.getByText(/^Medium-sized, familiar myna/)).toHaveProp('lang', 'en');
  });

  it('tags Sinhala text and notes it in the English UI', async () => {
    await renderProse(SINHALA_ID, 'en');
    expect(screen.getAllByText('Not yet available in English')).toHaveLength(5);
    expect(screen.getByText(/^ශ්‍රී ලංකාවට ආවේණික/)).toHaveProp('lang', 'si');
  });

  it('shows Sinhala text with no notice in the Sinhala UI', async () => {
    await renderProse(SINHALA_ID, 'si');
    expect(screen.queryByText(/තවම නැත/)).toBeNull();
    expect(screen.getByText(/^ශ්‍රී ලංකාවට ආවේණික/)).toHaveProp('lang', 'si');
  });

  it('reads Not recorded for a blank section, without a notice', async () => {
    await renderProse(SINHALA_ID, 'en');
    expect(screen.getAllByText('Not recorded')).toHaveLength(1);
  });

  it('shows the new species text when re-keyed to another species', async () => {
    const t = createT('en');
    const { rerender } = await render(
      <SpeciesProse key={ENGLISH_ID} species={speciesOf(ENGLISH_ID)} language="en" t={t} />,
    );
    await screen.findByText(/^Medium-sized, familiar myna/);
    await rerender(
      <SpeciesProse key={SINHALA_ID} species={speciesOf(SINHALA_ID)} language="en" t={t} />,
    );
    expect(await screen.findByText(/^ශ්‍රී ලංකාවට ආවේණික/)).toBeTruthy();
    expect(screen.queryByText(/^Medium-sized, familiar myna/)).toBeNull();
  });

  it('marks section headings as level 2', async () => {
    await renderProse(ENGLISH_ID, 'en');
    expect(screen.getByRole('header', { name: 'Description' })).toHaveProp('aria-level', 2);
  });
});
