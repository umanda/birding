import { plateStaticParams } from './static-params';

const PLATE_COUNT = 43;

describe('plateStaticParams', () => {
  it('lists every plate id once', () => {
    const ids = plateStaticParams().map(({ id }) => id);
    expect(ids).toHaveLength(PLATE_COUNT);
    expect(new Set(ids).size).toBe(PLATE_COUNT);
  });
});
