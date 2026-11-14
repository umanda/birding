import type { SpeciesText } from '@/shared/data/species-text';
import type { SpeciesTextFile } from '@/shared/data/species-text-schema';

import file from '../../../content/species-text.json';

// Jest maps the real loader to this test double: it cannot run the loader's dynamic import() without
// --experimental-vm-modules. The e2e offline test covers the real chunk.
const { species } = file as SpeciesTextFile;

export const getSpeciesText = jest.fn((speciesId: string): Promise<SpeciesText | undefined> =>
  Promise.resolve(species[speciesId]),
);
