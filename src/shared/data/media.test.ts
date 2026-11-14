import { getSpeciesImages, mediaUrl } from './media';
import { fixtureImage } from '@/test-utils/media-fixture';

describe('manifest access', () => {
  it('returns nothing for a species without images', () => {
    expect(getSpeciesImages('slb-none')).toEqual([]);
  });

  it('serves manifest paths from the site root', () => {
    expect(mediaUrl(fixtureImage().full.path)).toBe('/media/full/img-1.webp');
  });
});
