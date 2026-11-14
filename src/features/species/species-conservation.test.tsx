import { render, screen } from '@testing-library/react-native';

import { getSpecies } from '@/shared/data/content';
import { getSpeciesText } from '@/shared/data/species-text';
import type { Conservation } from '@/shared/data/species-text-schema';
import { createT } from '@/shared/i18n/translate';

import { aviListDiffers, SpeciesConservation } from './species-conservation';

const DUCULA_ID = 'slb-ducula-aenea';
const t = createT('en');
async function conservationOf(id: string): Promise<Conservation> {
  const text = await getSpeciesText(id);
  if (!text) throw new Error(`${id} has no text`);
  return text.conservation;
}

async function renderConservation(id: string, override: Partial<Conservation> = {}): Promise<void> {
  const species = getSpecies(id);
  if (!species) throw new Error(`${id} missing`);
  const conservation = { ...(await conservationOf(id)), ...override };
  await render(
    <SpeciesConservation
      occurrenceCode={species.occurrence_code}
      iucnCategory={species.iucn_category}
      conservation={conservation}
      language="en"
      t={t}
    />,
  );
}

describe('SpeciesConservation', () => {
  it('shows the codes and every verification status verbatim, pending included', async () => {
    await renderConservation(DUCULA_ID);
    const c = await conservationOf(DUCULA_ID);
    expect(screen.getByRole('header', { name: 'Conservation' })).toHaveProp('aria-level', 2);
    expect(screen.getByText('▲ R Resident')).toBeTruthy();
    expect(
      screen.getByText(`Occurrence verification: ${c.occurrence_verification_status}`),
    ).toBeTruthy();
    expect(screen.getByLabelText('Global status (working value): Least Concern')).toBeTruthy();
    expect(screen.getByText(`Assessment year: ${c.iucn_assessment_year}`)).toBeTruthy();
    expect(
      screen.getByText('IUCN verification: Pending individual factsheet verification'),
    ).toBeTruthy();
  });

  it('shows both IUCN values and a note when AviList differs (LC vs NT)', async () => {
    await renderConservation(DUCULA_ID);
    expect(screen.getByText('LC')).toBeTruthy();
    expect(screen.getByText('AviList: NT')).toBeTruthy();
    expect(screen.getByText(/AviList gives a different category/)).toBeTruthy();
  });

  it.each([
    ['equal', 'LC'],
    ['blank', null],
  ])('shows no AviList note when %s', async (_, value) => {
    await renderConservation(DUCULA_ID, { avilist_iucn_category: value });
    expect(screen.queryByText(/^AviList[: ]/)).toBeNull();
  });

  it('lists the BirdLife factsheet as a link with its domain', async () => {
    await renderConservation(DUCULA_ID);
    const name = 'BirdLife factsheet (datazone.birdlife.org)';
    expect(screen.getByRole('link', { name })).toBeTruthy();
  });

  it('omits the factsheet link when there is no URL', async () => {
    await renderConservation(DUCULA_ID, { birdlife_factsheet_url: null });
    expect(screen.queryByRole('link')).toBeNull();
  });

  it('reads Not recorded for blank statuses', async () => {
    await renderConservation(DUCULA_ID, {
      occurrence_verification_status: null,
      iucn_assessment_year: null,
      iucn_verification_status: null,
    });
    expect(screen.getByText('Occurrence verification: Not recorded')).toBeTruthy();
    expect(screen.getByText('Assessment year: Not recorded')).toBeTruthy();
    expect(screen.getByText('IUCN verification: Not recorded')).toBeTruthy();
  });
});

describe('aviListDiffers', () => {
  it('compares against the working value', () => {
    expect(aviListDiffers('LC', 'NT')).toBe(true);
    expect(aviListDiffers('LC', 'LC')).toBe(false);
    expect(aviListDiffers(null, null)).toBe(false);
    expect(aviListDiffers(null, 'NT')).toBe(true);
  });
});
