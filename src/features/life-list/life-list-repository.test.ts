import { randomUuid } from './life-list-repository';

const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

describe('randomUuid', () => {
  it('uses crypto.randomUUID when it exists', () => {
    const randomUUID = jest.fn(
      () => 'from-crypto' as `${string}-${string}-${string}-${string}-${string}`,
    );
    expect(randomUuid({ randomUUID, getRandomValues: jest.fn() })).toBe('from-crypto');
  });

  it('falls back to getRandomValues and builds a v4 UUID', () => {
    const getRandomValues = (<T extends ArrayBufferView | null>(array: T): T => {
      (array as unknown as Uint8Array).fill(255);
      return array;
    }) as Crypto['getRandomValues'];
    expect(randomUuid({ getRandomValues })).toBe('ffffffff-ffff-4fff-bfff-ffffffffffff');
  });

  it('makes valid, different ids in both modes', () => {
    const ids = [
      randomUuid(),
      randomUuid({ getRandomValues: globalThis.crypto.getRandomValues.bind(globalThis.crypto) }),
    ];
    ids.forEach((id) => expect(id).toMatch(UUID_V4));
    expect(ids[0]).not.toBe(ids[1]);
  });
});
