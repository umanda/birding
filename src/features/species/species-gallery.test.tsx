import { fireEvent, render, screen } from '@testing-library/react-native';

import { createT } from '@/shared/i18n/translate';
import type { Language } from '@/shared/i18n/language';

import { fixtureImage } from '@/test-utils/media-fixture';
import { SpeciesGallery } from './species-gallery';

const male = fixtureImage({ image_id: 'm', plumage_key: 'male' });
const female = fixtureImage({
  image_id: 'f',
  plumage_key: 'female',
  credit: { ...male.credit, author: 'Sam Roe', replace_before_launch: true },
});
const morph = fixtureImage({ image_id: 'x', plumage_key: 'morph_dark_phase' });

async function renderGallery(images = [male, female], language: Language = 'en'): Promise<void> {
  await render(
    <SpeciesGallery
      images={images}
      speciesName="Test Bird"
      language={language}
      t={createT(language)}
    />,
  );
}

const creditOf = (overrides: Partial<typeof male.credit>): typeof male => ({
  ...male,
  credit: { ...male.credit, ...overrides },
});

describe('SpeciesGallery credit', () => {
  it('uses the attribution text instead of "Photo: <author>"', async () => {
    await renderGallery([creditOf({ attribution: '© Jane Doe / WWF' })]);
    expect(screen.getByText('© Jane Doe / WWF')).toBeTruthy();
    expect(screen.queryByText('Photo: Jane Doe')).toBeNull();
  });

  it('says "Not recorded" for a missing author', async () => {
    await renderGallery([creditOf({ author: null })]);
    expect(screen.getByText('Photo: Not recorded')).toBeTruthy();
    expect(screen.getByLabelText('Test Bird, Male. Photo: Not recorded')).toBeTruthy();
  });

  it('shows a licence without a URL as plain text', async () => {
    await renderGallery([creditOf({ licence_url: null })]);
    expect(screen.getByText('CC BY 4.0')).toBeTruthy();
    expect(screen.queryByRole('link', { name: /creativecommons/ })).toBeNull();
  });

  it('labels a licence link by its domain when the licence name is missing', async () => {
    await renderGallery([creditOf({ licence: null })]);
    expect(screen.getByRole('link', { name: 'creativecommons.org' })).toBeTruthy();
  });

  it('shows no licence at all when both licence and URL are missing', async () => {
    await renderGallery([creditOf({ licence: null, licence_url: null })]);
    expect(screen.getAllByRole('link')).toHaveLength(1);
  });

  it('omits the source link when there is no source URL', async () => {
    await renderGallery([creditOf({ source_url: null })]);
    expect(screen.queryByRole('link', { name: 'commons.wikimedia.org' })).toBeNull();
    expect(screen.getByRole('link', { name: 'CC BY 4.0 (creativecommons.org)' })).toBeTruthy();
  });
});

describe('SpeciesGallery', () => {
  it('shows one tab when a plumage has two images', async () => {
    await renderGallery([male, fixtureImage({ image_id: 'm2', plumage_key: 'male' })]);
    expect(screen.getAllByRole('tab')).toHaveLength(1);
  });

  it('shows a placeholder and no image when there are no photos', async () => {
    await renderGallery([]);
    expect(screen.getByText('No photo yet')).toBeTruthy();
    expect(screen.queryByRole('tab')).toBeNull();
    expect(screen.queryByLabelText(/Photo:/)).toBeNull();
  });

  it('has one tab per plumage, the first selected, with alt text and credit', async () => {
    await renderGallery();
    expect(screen.getAllByRole('tab')).toHaveLength(2);
    expect(screen.getByRole('tab', { name: 'Male', selected: true })).toBeTruthy();
    expect(screen.getByRole('tab', { name: 'Male' }).props.accessibilityState.selected).toBe(true);
    expect(screen.getByRole('tab', { name: 'Female' }).props.accessibilityState.selected).toBe(
      false,
    );
    expect(screen.getByLabelText('Test Bird, Male. Photo: Jane Doe')).toBeTruthy();
    expect(screen.getByText('Photo: Jane Doe')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'CC BY 4.0 (creativecommons.org)' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'commons.wikimedia.org' })).toBeTruthy();
    expect(screen.queryByText('Licence: non-commercial')).toBeNull();
  });

  it('switches image and credit with the tab and marks non-commercial licences', async () => {
    await renderGallery();
    await fireEvent.press(screen.getByRole('tab', { name: 'Female' }));
    expect(screen.getByLabelText('Test Bird, Female. Photo: Sam Roe')).toBeTruthy();
    expect(screen.getByText('Licence: non-commercial')).toBeTruthy();
  });

  it('keeps the credit when the image fails to load', async () => {
    await renderGallery();
    await fireEvent(screen.getByLabelText('Test Bird, Male. Photo: Jane Doe'), 'error');
    expect(screen.getByText('Photo not downloaded')).toBeTruthy();
    expect(screen.getByText('Photo: Jane Doe')).toBeTruthy();
  });

  describe('when the full image fails', () => {
    const thumb = { path: 'media/slb-test/m.hash.thumb.webp', bytes: 10, sha256: 'b'.repeat(64) };
    const thumbOwner = fixtureImage({
      image_id: 'z-thumb',
      plumage_key: 'male',
      primary: true,
      thumb,
      credit: { ...male.credit, author: 'Thumb Author' },
    });

    it('shows the same-plumage thumbnail from another image with that image credit', async () => {
      await renderGallery([male, thumbOwner, female]);
      await fireEvent(screen.getByLabelText('Test Bird, Male. Photo: Jane Doe'), 'error');
      const shown = screen.getByLabelText('Test Bird, Male. Photo: Thumb Author');
      expect(shown.props.source).toEqual({ uri: '/media/slb-test/m.hash.thumb.webp' });
      expect(screen.getByText('Photo: Thumb Author')).toBeTruthy();
    });

    it('never shows a thumbnail of another plumage', async () => {
      await renderGallery([thumbOwner, female]);
      await fireEvent.press(screen.getByRole('tab', { name: 'Female' }));
      await fireEvent(screen.getByLabelText('Test Bird, Female. Photo: Sam Roe'), 'error');
      expect(screen.getByText('Photo not downloaded')).toBeTruthy();
      expect(screen.queryByLabelText(/Thumb Author/)).toBeNull();
      expect(screen.getByText('Photo: Sam Roe')).toBeTruthy();
    });

    it('shows text only when the thumbnail fails too', async () => {
      await renderGallery([thumbOwner]);
      await fireEvent(screen.getByLabelText('Test Bird, Male. Photo: Thumb Author'), 'error');
      await fireEvent(screen.getByLabelText('Test Bird, Male. Photo: Thumb Author'), 'error');
      expect(screen.getByText('Photo not downloaded')).toBeTruthy();
      expect(screen.queryByLabelText(/Thumb Author/)).toBeNull();
    });
  });

  it('labels tabs in Sinhala, including morphs', async () => {
    await renderGallery([male, morph], 'si');
    expect(screen.getByRole('tab', { name: 'පිරිමි' })).toBeTruthy();
    expect(screen.getByRole('tab', { name: 'වර්ණ ප්‍රභේදය: dark phase' })).toBeTruthy();
  });
});
