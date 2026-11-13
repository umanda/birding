import { speciesStaticParams } from './static-params';

const SPECIES_COUNT = 295;

describe('speciesStaticParams', () => {
  it('lists every species id once', () => {
    const ids = speciesStaticParams().map(({ id }) => id);
    expect(ids).toHaveLength(SPECIES_COUNT);
    expect(new Set(ids).size).toBe(SPECIES_COUNT);
  });
});
