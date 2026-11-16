import { render, screen, within } from '@testing-library/react-native';

import { getAllSpecies } from '@/shared/data/content';
import type { Species } from '@/shared/data/content-schema';
import { createT } from '@/shared/i18n/translate';
import { fixtureImage } from '@/test-utils/media-fixture';

import { PhotoCreditsList } from './photo-credits-screen';

const [first, second] = getAllSpecies() as unknown as [Species, Species];
const t = createT('en');

async function renderList(images: Parameters<typeof PhotoCreditsList>[0]['images']): Promise<void> {
  await render(<PhotoCreditsList images={images} language="en" t={t} />);
}

describe('PhotoCreditsList', () => {
  it('says there are no photos yet when the manifest is empty', async () => {
    await renderList([]);
    expect(screen.getByText('No photos yet')).toBeTruthy();
  });

  it('groups by species in content order and images in gallery order', async () => {
    await renderList([
      fixtureImage({ image_id: 'b', species_id: second.species_id, plumage_key: 'male' }),
      fixtureImage({ image_id: 'c', species_id: first.species_id, plumage_key: 'female' }),
      fixtureImage({ image_id: 'a', species_id: first.species_id, plumage_key: 'juvenile' }),
    ]);
    const headings = screen.getAllByRole('header');
    expect(headings.map((n) => n.props.children)).toEqual([first.names.en, second.names.en]);
    expect(headings[0]).toHaveProp('aria-level', 2);
    const plumages = (name: string): unknown[] =>
      within(screen.getByLabelText(name))
        .getAllByText(/^(Male|Female|Juvenile)$/)
        .map((n) => n.props.children);
    expect(plumages(first.names.en)).toEqual(['Female', 'Juvenile']);
    expect(plumages(second.names.en)).toEqual(['Male']);
  });

  it('shows licence and source links and the non-commercial marker', async () => {
    const base = fixtureImage({ species_id: first.species_id });
    await renderList([{ ...base, credit: { ...base.credit, replace_before_launch: true } }]);
    expect(screen.getAllByRole('link')).toHaveLength(2);
    expect(screen.getByText('Photo: Jane Doe')).toBeTruthy();
    expect(screen.getByText('Licence: non-commercial')).toBeTruthy();
  });
});
