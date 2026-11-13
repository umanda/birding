import { render, screen } from '@testing-library/react-native';

import type { Species } from '@/shared/data/content-schema';
import { createT } from '@/shared/i18n/translate';

import { SpeciesRow } from './species-row';

const species: Species = {
  species_id: 's1',
  plate_id: 'p1',
  plate_order: 1,
  names: { en: 'Sri Lanka Junglefowl', si: 'වල් කුකුළා', scientific: 'Gallus lafayettii' },
  occurrence_code: 'E',
  iucn_category: 'LC',
};

describe('SpeciesRow', () => {
  it('puts the UI language first and shows the other name, scientific name and badge', async () => {
    await render(<SpeciesRow species={species} language="en" t={createT('en')} />);
    expect(screen.getByText('Sri Lanka Junglefowl')).toBeTruthy();
    expect(screen.getByText('වල් කුකුළා')).toBeTruthy();
    expect(screen.getByText('Gallus lafayettii')).toBeTruthy();
    expect(screen.getByText('● E Endemic')).toBeTruthy();
  });

  it('falls back to English once when Sinhala is blank', async () => {
    const blank = { ...species, names: { ...species.names, si: null } };
    await render(<SpeciesRow species={blank} language="si" t={createT('si')} />);
    expect(screen.getByText('Sri Lanka Junglefowl')).toBeTruthy();
  });
});
