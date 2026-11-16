import { fixtureImage } from '@/test-utils/media-fixture';

import { sortForGallery } from './plumage';

describe('sortForGallery', () => {
  it('orders male, female, adult, juvenile, breeding, non-breeding, eclipse, then morphs', () => {
    const keys = [
      'morph_b',
      'eclipse',
      'juvenile',
      'morph_a',
      'non_breeding',
      'adult',
      'breeding',
      'female',
      'male',
    ];
    const images = keys.map((plumage_key) => fixtureImage({ image_id: plumage_key, plumage_key }));
    images.push(fixtureImage({ image_id: 'a-male', plumage_key: 'male' }));
    expect(sortForGallery(images).map((i) => i.image_id)).toEqual([
      'a-male',
      'male',
      'female',
      'adult',
      'juvenile',
      'breeding',
      'non_breeding',
      'eclipse',
      'morph_a',
      'morph_b',
    ]);
  });
});
