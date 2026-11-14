import type { SpeciesTextFile } from './species-text-schema';

import file from '../../../content/species-text.json';

const SINHALA_BLOCK = /[඀-෿]/;

// The Sources section tags every citation lang="en"; this fails if a Sinhala citation ever arrives.
describe('species-text citations', () => {
  it('contain no Sinhala characters', () => {
    const { species } = file as SpeciesTextFile;
    const citations = Object.values(species).flatMap((record) => record.sources);
    expect(citations.filter((source) => SINHALA_BLOCK.test(source.citation))).toEqual([]);
  });
});
